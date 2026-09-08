import { AppError } from "../utils/AppError.js";
import type { HydratedDocument, InferSchemaType } from "mongoose";
import { schema } from "../models/Result.js";
export type ResultStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "RELEASED";
const allowed: Record<ResultStatus, ResultStatus[]> = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["RELEASED"],
  REJECTED: ["DRAFT"],
  RELEASED: [],
};
export function canTransition(from: ResultStatus, to: ResultStatus) {
  return allowed[from].includes(to);
}
export async function transition(
  result: HydratedDocument<InferSchemaType<typeof schema>>,
  to: ResultStatus,
) {
  if (!canTransition(result.status, to))
    throw new AppError(
      409,
      `Cannot move result from ${result.status} to ${to}`,
    );
  result.status = to;
  const now = new Date();
  if (to === "SUBMITTED") result.submittedAt = now;
  if (to === "APPROVED") result.approvedAt = now;
  if (to === "RELEASED") result.releasedAt = now;
  await result.save();
  return result;
}
