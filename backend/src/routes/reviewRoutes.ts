import { Router } from 'express';
import {
  getApprovedReviews,
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} from '../controllers/reviewController';
import { protect, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getApprovedReviews);
router.get('/admin', protect, authorizeRoles('ADMIN'), getAllReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, authorizeRoles('ADMIN'), updateReviewStatus);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteReview);

export default router;
