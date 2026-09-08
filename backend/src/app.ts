import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { clientUrls } from "./config/env.js";

import auth from "./routes/auth.routes.js";
import results from "./routes/result.routes.js";
import admin from "./routes/admin.routes.js";

import { errorHandler } from "./middleware/error.js";

export const app = express();

/**
 * =========================================================
 * CORS
 * =========================================================
 */

const allowedOrigins = [
  // Local development
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://gradecore.vercel.app",

  // URLs from environment variables
  ...clientUrls,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin
      // e.g. Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview/production frontend deployments
      if (/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked:", origin);

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization", "Accept"],

    optionsSuccessStatus: 204,
  }),
);

/**
 * =========================================================
 * SECURITY
 * =========================================================
 */

app.use(helmet());

/**
 * =========================================================
 * BODY PARSING
 * =========================================================
 */

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/**
 * =========================================================
 * COOKIES
 * =========================================================
 */

app.use(cookieParser());

/**
 * =========================================================
 * HEALTH CHECK
 * =========================================================
 */

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "API healthy",
  });
});

/**
 * =========================================================
 * ROOT
 * =========================================================
 */

app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "GradeCore API is running",
  });
});

/**
 * =========================================================
 * API ROUTES
 * =========================================================
 */

app.use("/api/auth", auth);

app.use("/api/results", results);

app.use("/api/admin", admin);

/**
 * =========================================================
 * ERROR HANDLER
 * =========================================================
 *
 * MUST BE LAST.
 */

app.use(errorHandler);
