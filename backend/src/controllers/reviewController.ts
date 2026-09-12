import { Request, Response } from 'express';
import Review from '../models/Review';
import Company from '../models/Company';
import { AuthRequest } from '../types';

// @desc    Get public approved reviews
// @route   GET /api/reviews
export const getApprovedReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ status: 'APPROVED' }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
        : 5.0;

    res.status(200).json({ count: reviews.length, averageRating: avgRating, reviews });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching reviews.' });
  }
};

// @desc    Get all reviews for Admin moderation
// @route   GET /api/reviews/admin
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ count: reviews.length, reviews });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching admin reviews.' });
  }
};

// @desc    Submit a review (Authenticated user)
// @route   POST /api/reviews
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, title, review, serviceType, reviewerOrg, reviewerName } = req.body;

    if (!rating || !title || !review) {
      res.status(400).json({ message: 'Rating, title, and review body are required.' });
      return;
    }

    let name = reviewerName || req.user?.email.split('@')[0] || 'Verified Client';
    let org = reviewerOrg;

    if (req.user?.role === 'COMPANY') {
      const companyDoc = await Company.findOne({ userId: req.user.id });
      if (companyDoc) {
        name = companyDoc.contactPerson;
        org = companyDoc.name;
      }
    }

    const newReview = await Review.create({
      userId: req.user?.id,
      reviewerName: name,
      reviewerOrg: org || 'Private Client',
      rating: Number(rating),
      title,
      review,
      serviceType: serviceType || 'Security Services',
      status: 'PENDING',
    });

    res.status(201).json({
      message: 'Thank you for your feedback! Your review has been submitted for moderation.',
      review: newReview,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error submitting review.' });
  }
};

// @desc    Approve/Reject review (Admin)
// @route   PUT /api/reviews/:id
export const updateReviewStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      res.status(400).json({ message: 'Invalid review status.' });
      return;
    }

    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) {
      res.status(404).json({ message: 'Review not found.' });
      return;
    }

    res.status(200).json({ message: `Review status updated to ${status}.`, review });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating review.' });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404).json({ message: 'Review not found.' });
      return;
    }
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting review.' });
  }
};
