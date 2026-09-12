import { Router } from 'express';
import { getShifts, createShift } from '../controllers/shiftController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getShifts);
router.post('/', protect, authorizeRoles('ADMIN'), createShift);

export default router;
