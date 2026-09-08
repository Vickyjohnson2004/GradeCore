import type { Request, Response } from "express";
import { app } from "../src/app.js";
import { connectDatabase } from "../src/config/db.js";

let databaseConnection: Promise<unknown> | undefined;

export default async function handler(
  request: Request,
  response: Response,
) {
  try {
    databaseConnection ??= connectDatabase();
    await databaseConnection;
    return app(request, response);
  } catch (error) {
    databaseConnection = undefined;
    console.error("Database connection failed", error);
    return response.status(503).json({
      success: false,
      message: "Database unavailable",
    });
  }
}
