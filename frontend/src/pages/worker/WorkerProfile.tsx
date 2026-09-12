import React from 'react';
import { User, Phone, Mail, Award, Shield, MapPin, Calendar, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const WorkerProfile: React.FC = () => {
  const { worker, user } = useAuth();

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Security Officer Profile" subtitle="Your official verified security agency service credentials" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
          <div className="flex items-center gap-5 border-b border-slate-800 pb-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-500 text-slate-950 font-black text-3xl flex items-center justify-center shadow-xl">
              {worker?.name?.charAt(0) || 'W'}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">{worker?.name}</h2>
              <span className="text-xs font-mono text-amber-400 font-bold block">{worker?.workerId} • {worker?.designation}</span>
              <div className="flex items-center gap-2 pt-1">
                <Badge status={worker?.employmentStatus || 'ACTIVE'} />
                <span className="text-[10px] text-slate-400">Joined {worker?.joiningDate ? new Date(worker.joiningDate).toLocaleDateString() : '2026'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold block">Contact Email</span>
              <span className="text-white font-semibold flex items-center gap-1.5"><Mail className="w-4 h-4 text-amber-500" /> {worker?.email || user?.email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold block">Phone Number</span>
              <span className="text-white font-semibold flex items-center gap-1.5"><Phone className="w-4 h-4 text-amber-500" /> {worker?.phone}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold block">Emergency Contact</span>
              <span className="text-white font-semibold flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> {worker?.emergencyContact || '+1 (555) 999-8877'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold block">Experience</span>
              <span className="text-white font-semibold flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-500" /> {worker?.experience || '3 Years'}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Skills & Tactical Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {(worker?.skills || ['Access Control', 'Perimeter Patrol', 'CCTV']).map((sk, i) => (
                <span key={i} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
