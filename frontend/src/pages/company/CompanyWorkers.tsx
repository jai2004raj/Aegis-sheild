import React, { useState, useEffect } from 'react';
import { Users, Phone, ShieldCheck, Calendar } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const CompanyWorkers: React.FC = () => {
  const { company } = useAuth();
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (company?._id) {
      api.get(`/companies/${company._id}`).then((res) => {
        setActiveAssignments(res.data.activeAssignments || []);
      }).catch(() => {});
    }
  }, [company]);

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Assigned Security Guards Roster" subtitle="Permitted information of security personnel deployed at your facilities" />

      <div className="px-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAssignments.map((a) => (
            <div key={a._id} className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-4">
                {a.workerId?.profileImage || a.workerId?.photo ? (
                  <img
                    src={a.workerId?.profileImage || a.workerId?.photo}
                    alt={a.workerId?.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-blue-500/30 bg-slate-900 shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-extrabold text-xl flex items-center justify-center">
                    {a.workerId?.name?.charAt(0) || 'G'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">{a.workerId?.name}</h3>
                  <span className="text-xs text-amber-400 font-semibold block">{a.position}</span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {a.workerId?.workerId}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Duty Shift:</span>
                  <span className="font-bold text-white">{a.shiftId?.name} ({a.shiftId?.startTime} - {a.shiftId?.endTime})</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Official Phone:</span>
                  <span className="font-bold text-amber-400">{a.workerId?.phone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Joined Station:</span>
                  <span className="font-semibold text-slate-200">{new Date(a.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
