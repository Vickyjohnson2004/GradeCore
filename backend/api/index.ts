import type { Request, Response } from "express";

let databaseConnection: Promise<unknown> | undefined;

function setCorsHeaders(request: Request, response: Response) {
  const origin = request.headers.origin;
  if (
    origin &&
    (origin === "http://localhost:3000" ||
      /^https:\/\/[^/]+\.vercel\.app$/.test(origin))
  ) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Vary", "Origin");
  }
}

export default async function handler(request: Request, response: Response) {
  setCorsHeaders(request, response);

  if (request.url === "/" || request.url === "/health") {
    return response.status(200).json({
      success: true,
      message: "GradeCore API is running",
    });
  }

  if (request.method === "OPTIONS") {
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,DELETE,OPTIONS",
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return response.status(204).end();
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
    setCorsHeaders(request, response);
    const message = error instanceof Error ? error.message : String(error);
    const configurationError = message.startsWith(
      "Invalid environment configuration",
    );
    console.error(
      configurationError
        ? "Backend environment configuration failed"
        : "Database connection failed",
      error,
    );
    return response.status(configurationError ? 500 : 503).json({
      success: false,
      message: configurationError
        ? "Backend configuration is incomplete"
        : "Database unavailable",
    });
  }
}
