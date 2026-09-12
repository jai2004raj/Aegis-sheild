import { Router } from 'express';
import { checkIn, checkOut, getAttendance } from '../controllers/attendanceController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/', protect, getAttendance);

export default router;
