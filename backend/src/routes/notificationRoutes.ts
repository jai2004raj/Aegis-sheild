import { Router } from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
} from '../controllers/notificationController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getNotifications);
router.post('/', protect, authorizeRoles('ADMIN'), createNotification);
router.put('/:id/read', protect, markAsRead);

export default router;
