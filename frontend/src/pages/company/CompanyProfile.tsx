import React from 'react';
import { Building2, MapPin, Phone, Mail, Users, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const CompanyProfile: React.FC = () => {
  const { company } = useAuth();

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Organization Profile" subtitle="Your client registration, contract details, and workforce capacity" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500 text-slate-950 font-black text-2xl flex items-center justify-center">
                {company?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{company?.name}</h2>
                <span className="text-xs text-amber-400 font-semibold">{company?.organizationType} Sector • ID: {company?.companyId}</span>
              </div>
            </div>
            <Badge status={company?.status || 'ACTIVE'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold block">Contact Person</span>
              <span className="text-white font-semibold flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-400" /> {company?.contactPerson}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold block">Official Email</span>
              <span className="text-white font-semibold flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-400" /> {company?.email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold block">Phone Number</span>
              <span className="text-white font-semibold flex items-center gap-1.5"><Phone className="w-4 h-4 text-blue-400" /> {company?.phone}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-bold block">Facility Location</span>
              <span className="text-white font-semibold flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-400" /> {company?.address}, {company?.city}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Contract Workforce Capacity</h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Required Personnel Count: <strong>{company?.requiredWorkers || 5} Guards</strong></span>
              <span className="text-slate-300">Shift Requirements: <strong>{company?.requiredShift || '24x7'}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
