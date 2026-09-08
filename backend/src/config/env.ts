import "dotenv/config";
import { z } from "zod";

const defaults = {
  PORT: 5000,
  MONGODB_URI: "mongodb://127.0.0.1:27017/gradecore",
  JWT_SECRET: "development-secret-change-me-32chars",
  JWT_EXPIRES_IN: "1d",
  CLIENT_URL: "http://localhost:3000",
  NODE_ENV: "development",
} as const;

const schema = z.object({
  PORT: z.coerce.number().default(defaults.PORT),

  MONGODB_URI: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  JWT_EXPIRES_IN: z.string().default(defaults.JWT_EXPIRES_IN),

  CLIENT_URL: z.string().default(defaults.CLIENT_URL),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default(defaults.NODE_ENV),
});

const isProduction = process.env.NODE_ENV === "production";

const parsed = schema.safeParse(
  isProduction ? process.env : { ...defaults, ...process.env },
);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => issue.path.join(".") || issue.code)
    .join(", ");

  if (isProduction) {
    throw new Error(
      `Production environment configuration is incomplete. Check: ${issues}`,
    );
  }

  console.warn(
    `Using local defaults because some env vars are missing or invalid: ${issues}`,
  );
}

export const env = parsed.success
  ? parsed.data
  : schema.parse(isProduction ? process.env : { ...defaults, ...process.env });

export const clientUrls = env.CLIENT_URL.split(",")
  .map((url) => url.trim())
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));
