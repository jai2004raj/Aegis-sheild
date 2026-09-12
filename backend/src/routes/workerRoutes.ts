import { Router } from 'express';
import {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
} from '../controllers/workerController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getWorkers);
router.get('/:id', protect, getWorkerById);
router.post('/', protect, authorizeRoles('ADMIN'), createWorker);
router.put('/:id', protect, authorizeRoles('ADMIN'), updateWorker);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteWorker);

export default router;
