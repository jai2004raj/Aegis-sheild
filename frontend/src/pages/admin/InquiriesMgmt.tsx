import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Building, Users } from 'lucide-react';
import api from '../../services/api';
import { ContactInquiry } from '../../types';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const InquiriesMgmt: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/contact');
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/contact/${id}`, { status });
      fetchInquiries();
    } catch (err: any) {
      alert('Error updating inquiry status.');
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Security Service Quote Leads" subtitle="Review client quote inquiries submitted via website portal" />

      <div className="px-6 max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Client Contact</th>
                  <th className="p-4">Service & Personnel Count</th>
                  <th className="p-4">Requirement Details</th>
                  <th className="p-4">Date Submitted</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      No incoming lead inquiries found.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white block">{inq.name}</span>
                        <span className="text-[10px] text-amber-400 font-semibold block">{inq.organization || 'Individual Client'}</span>
                        <span className="text-[10px] text-slate-400">{inq.email} | {inq.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{inq.serviceRequired}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{inq.numberOfPersonnel} Guards Requested</span>
                      </td>
                      <td className="p-4 text-slate-300 max-w-xs truncate">{inq.message}</td>
                      <td className="p-4 text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Badge status={inq.status} />
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateStatus(inq._id, e.target.value)}
                          className="bg-slate-950 text-xs p-2 rounded-xl border border-slate-800 text-slate-200 focus:border-amber-500 focus:outline-none"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
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
