import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Department } from "../models/Department.js";
import { AcademicSession } from "../models/AcademicSession.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/api.js";
import type { Model } from "mongoose";

type Resource = "courses" | "departments" | "sessions";
const models = {
  courses: Course,
  departments: Department,
  sessions: AcademicSession,
} as const;

function modelFor(resource: string) {
  if (!(resource in models)) throw new AppError(404, "Unknown resource");
  return models[resource as Resource] as unknown as Model<
    Record<string, unknown>
  >;
}

export const listResource: RequestHandler = async (req, res, next) => {
  try {
    const resource = String(req.params.resource);
    if (resource === "users") {
      const users = await User.find()
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .lean();
      return ok(res, "Users retrieved", users);
    }
    const Model = modelFor(resource);
    const data = await Model.find().sort({ createdAt: -1 }).lean();
    return ok(res, `${resource} retrieved`, data);
  } catch (error) {
    next(error);
  }
};

export const createResource: RequestHandler = async (req, res, next) => {
  try {
    const resource = String(req.params.resource);
    if (resource === "users") {
      const { email, password, role } = req.body;
      if (
        !email ||
        !password ||
        !["ADMIN", "LECTURER", "STUDENT"].includes(role)
      )
        throw new AppError(
          400,
          "Email, password and a valid role are required",
        );
      const user = await User.create({
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role,
      });
      return ok(
        res,
        "User created",
        { id: user.id, email: user.email, role: user.role },
        201,
      );
    }
    const created = await modelFor(resource).create(req.body);
    return ok(res, `${resource} created`, created, 201);
  } catch (error) {
    next(error);
  }
};

export const updateResource: RequestHandler = async (req, res, next) => {
  try {
    const resource = String(req.params.resource);
    const update = { ...req.body };
    if (resource === "users") {
      if (update.password) {
        update.passwordHash = await bcrypt.hash(update.password, 12);
        delete update.password;
      }
      const user = await User.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      })
        .select("-passwordHash")
        .lean();
      if (!user) throw new AppError(404, "User not found");
      return ok(res, "User updated", user);
    }
    const record = await modelFor(resource)
      .findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      })
      .lean();
    if (!record) throw new AppError(404, "Record not found");
    return ok(res, `${resource} updated`, record);
  } catch (error) {
    next(error);
  }
};

export const deleteResource: RequestHandler = async (req, res, next) => {
  try {
    const resource = String(req.params.resource);
    const record =
      resource === "users"
        ? await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true },
          )
            .select("-passwordHash")
            .lean()
        : await modelFor(resource)
            .findByIdAndUpdate(
              req.params.id,
              { isActive: false },
              { new: true },
            )
            .lean();
    if (!record) throw new AppError(404, "Record not found");
    return ok(res, `${resource} deactivated`, record);
  } catch (error) {
    next(error);
  }
};
