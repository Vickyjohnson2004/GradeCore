import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { dashboard, stats } from "../controllers/admin.controller.js";
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from "../controllers/admin.crud.controller.js";
const router = Router();
router.use(requireAuth, requireRole("ADMIN"));
router.get("/dashboard", dashboard);
router.get("/stats", stats);
router.get("/:resource", listResource);
router.post("/:resource", createResource);
router.patch("/:resource/:id", updateResource);
router.delete("/:resource/:id", deleteResource);
export default router;
