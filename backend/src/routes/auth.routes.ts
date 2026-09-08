import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.post("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
export default router;
