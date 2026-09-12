import { Router } from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/contactController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.post('/', submitInquiry);
router.get('/', protect, authorizeRoles('ADMIN'), getInquiries);
router.put('/:id', protect, authorizeRoles('ADMIN'), updateInquiryStatus);

export default router;
