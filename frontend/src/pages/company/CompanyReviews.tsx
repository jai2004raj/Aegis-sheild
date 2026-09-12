import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';

export const CompanyReviews: React.FC = () => {
  const { company } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [serviceType, setServiceType] = useState('Corporate Security');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !review) return;
    setSubmitting(true);
    setSuccessMsg('');
    try {
      await api.post('/reviews', {
        rating,
        title,
        review,
        serviceType,
        reviewerName: company?.contactPerson || 'Company Representative',
        reviewerOrg: company?.name || 'Partner Organization',
      });
      setSuccessMsg('Thank you! Your testimonial has been submitted for moderation.');
      setTitle('');
      setReview('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Client Feedback & Rating" subtitle="Submit verified feedback for Aegis Shield security workforce operations" />

      <div className="px-6 max-w-3xl mx-auto space-y-6">
        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
          <h2 className="text-xl font-bold text-white">Rate Our Security Service</h2>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Rating (1 to 5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2.5 rounded-xl border text-amber-400 transition-all ${
                      rating >= star ? 'bg-amber-500/20 border-amber-500' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-400' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Headline / Review Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Exceptional Vigilance & Professional Guard Discipline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Service Sector</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Corporate Security">Corporate Security</option>
                <option value="School Security">School Security</option>
                <option value="Hospital Security">Hospital Security</option>
                <option value="Apartment Security">Apartment Security</option>
                <option value="Industrial Security">Industrial Security</option>
                <option value="Event Security">Event Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Testimonial *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your satisfaction regarding guard attendance, emergency response speed, and overall site security..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all"
            >
              {submitting ? 'Submitting Testimonial...' : 'Submit Official Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
