import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { ok, fail } from "../utils/api.js";
import { loginSchema } from "../validators/auth.js";

const getCookieOptions = (req: Parameters<RequestHandler>[0]) => {
  const isSecureRequest =
    env.NODE_ENV === "production" ||
    req.secure ||
    req.headers["x-forwarded-proto"] === "https";

  return {
    httpOnly: true,
    secure: isSecureRequest,
    sameSite: isSecureRequest ? "none" : "lax",
    path: "/",
    maxAge: 86400000,
  } as const;
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email }).select(
      "+passwordHash",
    );
    if (
      !user ||
      !user.isActive ||
      !(await bcrypt.compare(body.password, user.passwordHash))
    )
      return fail(res, "Invalid email or password", 401);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );
    res.cookie("access_token", token, getCookieOptions(req));
    return ok(res, "Login successful", {
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    next(e);
  }
};
export const logout: RequestHandler = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production" || req.secure,
    sameSite: env.NODE_ENV === "production" || req.secure ? "none" : "lax",
    path: "/",
  });
  return ok(res, "Logged out", null);
};
export const me: RequestHandler = async (req, res) =>
  ok(res, "Current user", req.user);
