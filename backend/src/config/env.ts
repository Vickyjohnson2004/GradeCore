import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  JWT_EXPIRES_IN: z.string().default("1d"),

  CLIENT_URL: z.string().default("http://localhost:3000"),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => issue.path.join("."))
    .join(", ");

  throw new Error(`Invalid environment configuration. Check: ${missing}`);
}

export const env = parsed.data;

export const clientUrls = env.CLIENT_URL.split(",")
  .map((url) => url.trim())
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));
