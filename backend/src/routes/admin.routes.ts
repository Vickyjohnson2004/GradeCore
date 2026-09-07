import { Router } from 'express'; import { requireAuth,requireRole } from '../middleware/auth.js'; import { dashboard,stats } from '../controllers/admin.controller.js';
const router=Router();router.use(requireAuth,requireRole('ADMIN'));router.get('/dashboard',dashboard);router.get('/stats',stats);export default router;
