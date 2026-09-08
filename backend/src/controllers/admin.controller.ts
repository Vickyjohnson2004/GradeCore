import type { RequestHandler } from "express";
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { Lecturer } from "../models/Lecturer.js";
import { Course } from "../models/Course.js";
import { Department } from "../models/Department.js";
import { AcademicSession } from "../models/AcademicSession.js";
import { Result } from "../models/Result.js";
import { ok } from "../utils/api.js";
export const dashboard: RequestHandler = async (_req, res, next) => {
  try {
    const [
      students,
      lecturers,
      courses,
      pending,
      approved,
      released,
      sessions,
    ] = await Promise.all([
      User.countDocuments({ role: "STUDENT" }),
      User.countDocuments({ role: "LECTURER" }),
      Course.countDocuments({ isActive: true }),
      Result.countDocuments({ status: { $in: ["SUBMITTED", "UNDER_REVIEW"] } }),
      Result.countDocuments({ status: "APPROVED" }),
      Result.countDocuments({ status: "RELEASED" }),
      AcademicSession.findOne({ isActive: true }).lean(),
    ]);
    return ok(res, "Admin dashboard", {
      students,
      lecturers,
      courses,
      pending,
      approved,
      released,
      activeSession: sessions,
    });
  } catch (e) {
    next(e);
  }
};
export const stats: RequestHandler = async (_req, res, next) => {
  try {
    const [departments, students, lecturers, courses, sessions] =
      await Promise.all([
        Department.countDocuments(),
        Student.countDocuments(),
        Lecturer.countDocuments(),
        Course.countDocuments(),
        AcademicSession.countDocuments(),
      ]);
    return ok(res, "System statistics", {
      departments,
      students,
      lecturers,
      courses,
      sessions,
    });
  } catch (e) {
    next(e);
  }
};
