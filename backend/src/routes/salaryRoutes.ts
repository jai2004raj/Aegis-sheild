import { Router } from 'express';
import { getSalaries, createSalary, updateSalaryStatus } from '../controllers/salaryController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getSalaries);
router.post('/', protect, authorizeRoles('ADMIN'), createSalary);
router.put('/:id', protect, authorizeRoles('ADMIN'), updateSalaryStatus);

export default router;
