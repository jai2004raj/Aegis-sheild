import { Router } from 'express';
import { getDashboardStats } from '../controllers/reportController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard-stats', protect, authorizeRoles('ADMIN'), getDashboardStats);

export default router;
