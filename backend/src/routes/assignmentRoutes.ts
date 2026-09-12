import { Router } from 'express';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
} from '../controllers/assignmentController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getAssignments);
router.post('/', protect, authorizeRoles('ADMIN'), createAssignment);
router.put('/:id', protect, authorizeRoles('ADMIN'), updateAssignment);

export default router;
