import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser, Role } from "../types/auth.js";
import { AppError } from "../utils/AppError.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const cookieToken = req.cookies?.access_token as string | undefined;
  const token = headerToken || cookieToken;

  if (!token) return next(new AppError(401, "Authentication required"));

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired session"));
  }
};

export function requireRole(...roles: Role[]): RequestHandler {
  return (req, _res, next) =>
    req.user && roles.includes(req.user.role)
      ? next()
      : next(new AppError(403, "Insufficient permissions"));
}
