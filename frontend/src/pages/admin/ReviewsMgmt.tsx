import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { Review } from '../../types';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const ReviewsMgmt: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/admin');
      setReviews(res.data.reviews || []);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.put(`/reviews/${id}`, { status });
      fetchReviews();
    } catch (err: any) {
      alert('Error updating review status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err: any) {
      alert('Error deleting review.');
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Client Review Moderation" subtitle="Approve or reject customer testimonials before public publication" />

      <div className="px-6 max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Reviewer</th>
                  <th className="p-4">Rating & Headline</th>
                  <th className="p-4">Detailed Review</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      No review entries found.
                    </td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">
                        {r.reviewerName}
                        <span className="block text-[10px] text-slate-400">{r.reviewerOrg || 'Private Client'}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-400 mb-1">
                          {[...Array(r.rating)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="font-bold text-slate-200 block">{r.title}</span>
                      </td>
                      <td className="p-4 text-slate-400 italic max-w-xs truncate">"{r.review}"</td>
                      <td className="p-4 font-semibold text-amber-400">{r.serviceType}</td>
                      <td className="p-4">
                        <Badge status={r.status} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateStatus(r._id, 'APPROVED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}
                          {r.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleUpdateStatus(r._id, 'REJECTED')}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
