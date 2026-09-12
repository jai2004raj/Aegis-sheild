import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types';
import { Modal } from '../../components/Modal';

export const Reviews: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(5.0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [serviceType, setServiceType] = useState('Corporate Security');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerOrg, setReviewerOrg] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data.reviews || []);
      setAvgRating(res.data.averageRating || 5.0);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reviewText) return;
    setSubmitting(true);
    setSuccessMsg('');
    try {
      await api.post('/reviews', {
        rating,
        title,
        review: reviewText,
        serviceType,
        reviewerName: reviewerName || user?.name,
        reviewerOrg,
      });
      setSuccessMsg('Review submitted successfully! It will appear publicly after admin moderation.');
      setTitle('');
      setReviewText('');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 2500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 transition-colors duration-200">
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900/90 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/ops-center-bg.jpg"
            alt="Client Testimonials and Operations"
            className="w-full h-full object-cover object-center opacity-10 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-slate-50/70 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/70"></div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-amber-500">{avgRating}</span>
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500" />
              ))}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Client Reviews & Satisfaction Ratings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Verified testimonials from organizational leaders and facility leads.</p>
        </div>

        {user ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all"
          >
            <MessageSquarePlus className="w-5 h-5" /> Submit Client Review
          </button>
        ) : (
          <div className="text-center sm:text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Log in to leave a verified review</p>
            <a href="/login" className="px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-amber-600 dark:text-amber-400 text-xs font-bold inline-block hover:bg-slate-100 transition-colors">
              Login to Write Review
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-[10px] font-semibold border border-slate-200 dark:border-slate-800">
                {r.serviceType}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{r.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">"{r.review}"</p>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="block font-bold text-slate-900 dark:text-white">{r.reviewerName}</span>
                <span className="block text-slate-500 dark:text-slate-400">{r.reviewerOrg || 'Verified Client'}</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                <CheckCircle className="w-3.5 h-3.5" /> Approved Review
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Customer Review">
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-xl border text-amber-500 transition-all ${
                    rating >= star ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-500' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Review Headline / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Outstanding 24/7 Security Coverage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                placeholder={user?.name || 'Full Name'}
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Organization / Company</label>
              <input
                type="text"
                placeholder="e.g. Apex Tech Towers"
                value={reviewerOrg}
                onChange={(e) => setReviewerOrg(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Service Received</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition-all"
            >
              <option value="School Security">School Security</option>
              <option value="Corporate Security">Corporate Security</option>
              <option value="Apartment Security">Apartment Security</option>
              <option value="Hospital Security">Hospital Security</option>
              <option value="Warehouse Security">Warehouse Security</option>
              <option value="Event Security">Event Security</option>
              <option value="Night Patrol">Night Patrol</option>
              <option value="CCTV Surveillance">CCTV Surveillance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Feedback</label>
            <textarea
              required
              rows={4}
              placeholder="Share your experience regarding guard discipline, punctuality, and management responsiveness..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all"
          >
            {submitting ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
