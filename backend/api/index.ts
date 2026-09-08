import type { Request, Response } from "express";

let databaseConnection: Promise<unknown> | undefined;

export default async function handler(request: Request, response: Response) {
  if (request.url === "/" || request.url === "/health") {
    return response.status(200).json({
      success: true,
      message: "GradeCore API is running",
    });
  }

  try {
    const [{ app }, { connectDatabase }] = await Promise.all([
      import("../src/app.js"),
      import("../src/config/db.js"),
    ]);
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
