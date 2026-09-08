import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  list,
  studentCourses,
  studentResults,
  updateScores,
  workflow,
} from "../controllers/result.controller.js";
const router = Router();
router.get("/", requireAuth, requireRole("ADMIN", "LECTURER"), list);
router.get("/student/me", requireAuth, requireRole("STUDENT"), studentResults);
router.get(
  "/student/courses",
  requireAuth,
  requireRole("STUDENT"),
  studentCourses,
);
router.patch(
  "/:id/scores",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  updateScores,
);
router.post(
  "/:id/:action",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  workflow,
);
export default router;
