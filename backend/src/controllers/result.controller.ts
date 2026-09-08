import type { RequestHandler } from "express";
import { Result } from "../models/Result.js";
import { Student } from "../models/Student.js";
import { Lecturer } from "../models/Lecturer.js";
import { Course } from "../models/Course.js";
import { GradingConfiguration } from "../models/GradingConfiguration.js";
import { CourseAssignment } from "../models/CourseAssignment.js";
import { CourseRegistration } from "../models/CourseRegistration.js";
import { calculateGrade, qualityPoint } from "../services/grading.service.js";
import { transition } from "../services/workflow.service.js";
import { audit } from "../services/audit.service.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/api.js";

async function getStudentForUser(userId: string) {
  const s = await Student.findOne({ user: userId });
  if (!s) throw new AppError(404, "Student profile not found");
  return s;
}
export const studentResults: RequestHandler = async (req, res, next) => {
  try {
    const student = await getStudentForUser(req.user!.id);
    const results = await Result.find({
      student: student._id,
      status: "RELEASED",
    })
      .populate("course", "code title creditUnit level")
      .populate("session", "name")
      .lean();
    await student.populate("department", "name");
    return ok(res, "Released results", {
      student: {
        fullName: student.fullName,
        matricNo: student.matricNo,
        level: student.level,
        department: student.department,
      },
      data: results,
    });
  } catch (e) {
    next(e);
  }
};

export const studentCourses: RequestHandler = async (req, res, next) => {
  try {
    const student = await getStudentForUser(req.user!.id);
    const courses = await CourseRegistration.find({ student: student._id })
      .populate("course", "code title creditUnit level semester")
      .populate("session", "name")
      .lean();
    return ok(res, "Registered courses", {
      student: {
        fullName: student.fullName,
        matricNo: student.matricNo,
        level: student.level,
      },
      data: courses,
    });
  } catch (e) {
    next(e);
  }
};

export const list: RequestHandler = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1),
      limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.session) filter.session = req.query.session;
    if (req.user!.role === "LECTURER") {
      const lecturer = await Lecturer.findOne({ user: req.user!.id })
        .select("_id")
        .lean();
      if (!lecturer) throw new AppError(404, "Lecturer profile not found");
      filter.lecturer = lecturer._id;
    }
    const total = await Result.countDocuments(filter);
    const data = await Result.find(filter)
      .populate("student", "matricNo fullName")
      .populate("course", "code title creditUnit")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return ok(res, "Results retrieved", {
      data,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    next(e);
  }
};

export const updateScores: RequestHandler = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) throw new AppError(404, "Result not found");
    if (!["DRAFT", "REJECTED"].includes(result.status))
      throw new AppError(
        409,
        "Scores can only be edited while draft or rejected",
      );
    const lecturer = await Lecturer.findOne({ user: req.user!.id })
      .select("_id")
      .lean();
    const assignment = lecturer
      ? await CourseAssignment.findOne({
          course: result.course,
          lecturer: lecturer._id,
        })
      : null;
    if (req.user!.role === "LECTURER" && !assignment)
      throw new AppError(403, "You are not assigned to this course");
    const course = await Course.findById(result.course);
    if (!course) throw new AppError(404, "Course not found");
    const config = await GradingConfiguration.findOne({
      isActive: true,
    }).lean();
    if (!config) throw new AppError(500, "No grading configuration is active");
    const ca = Number(req.body.ca),
      exam = Number(req.body.exam);
    if (!Number.isFinite(ca) || ca < 0 || ca > config.caMax)
      throw new AppError(400, `CA score must be between 0 and ${config.caMax}`);
    if (!Number.isFinite(exam) || exam < 0 || exam > config.examMax)
      throw new AppError(
        400,
        `Examination score must be between 0 and ${config.examMax}`,
      );
    const before = {
      ca: result.ca,
      exam: result.exam,
      total: result.total,
      grade: result.grade,
      gradePoint: result.gradePoint,
      qualityPoint: result.qualityPoint,
    };
    const g = calculateGrade(ca, exam, config.rules);
    result.ca = ca;
    result.exam = exam;
    result.total = g.total;
    result.grade = g.grade;
    result.gradePoint = g.gradePoint;
    result.qualityPoint = qualityPoint(course.creditUnit, g.gradePoint);
    await result.save();
    await audit({
      user: req.user!.id,
      action: "SCORE_EDITED",
      resource: "Result",
      resourceId: result.id,
      previousValue: before,
      newValue: { ca, exam, ...g, qualityPoint: result.qualityPoint },
    });
    return ok(res, "Scores saved", result);
  } catch (e) {
    next(e);
  }
};

export const workflow: RequestHandler = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) throw new AppError(404, "Result not found");
    const action = String(req.params.action).toUpperCase();
    const target =
      action === "SUBMIT"
        ? "SUBMITTED"
        : action === "APPROVE"
          ? "APPROVED"
          : action === "REJECT"
            ? "REJECTED"
            : action === "RELEASE"
              ? "RELEASED"
              : action === "REVIEW"
                ? "UNDER_REVIEW"
                : "";
    if (!target) throw new AppError(400, "Unknown workflow action");
    if (
      ["APPROVED", "RELEASED", "REJECTED", "UNDER_REVIEW"].includes(target) &&
      req.user!.role !== "ADMIN"
    )
      throw new AppError(403, "Administrator permission required");
    if (target === "SUBMITTED" && req.user!.role === "LECTURER") {
      const lecturer = await Lecturer.findOne({ user: req.user!.id })
        .select("_id")
        .lean();
      const assignment = lecturer
        ? await CourseAssignment.findOne({
            course: result.course,
            lecturer: lecturer._id,
          })
        : null;
      if (!assignment) throw new AppError(403, "Unauthorized course");
    }
    const previous = result.status;
    if (target === "REJECTED")
      result.rejectionReason = String(
        req.body?.reason || "Correction required",
      );
    await transition(result, target as never);
    await audit({
      user: req.user!.id,
      action: `RESULT_${target}`,
      resource: "Result",
      resourceId: result.id,
      previousValue: { status: previous },
      newValue: { status: target },
      metadata: { reason: result.rejectionReason },
    });
    return ok(res, "Result workflow updated", result);
  } catch (e) {
    next(e);
  }
};
