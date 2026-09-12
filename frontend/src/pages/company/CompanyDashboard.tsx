import React, { useState, useEffect } from 'react';
import { Users, Clock, ShieldCheck, Building2, Calendar } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { StatCard } from '../../components/StatCard';

export const CompanyDashboard: React.FC = () => {
  const { company, refreshUser } = useAuth();
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);

  useEffect(() => {
    refreshUser();
    if (company?._id) {
      api.get(`/companies/${company._id}`).then((res) => {
        setActiveAssignments(res.data.activeAssignments || []);
        setTodayAttendance(res.data.todayAttendance || []);
      }).catch(() => {});
    }
  }, [company]);

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 pb-12 space-y-6 transition-colors duration-200">
      <Header title="Company Security Dashboard" subtitle={`Welcome, ${company?.name || 'Client Representative'}`} />

      <div className="px-6 max-w-7xl mx-auto space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Assigned Guards"
            value={company?.activeWorkersCount || activeAssignments.length}
            subtitle={`Target required: ${company?.requiredWorkers || 5}`}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Present On Duty Today"
            value={todayAttendance.length}
            subtitle="Check-ins recorded today"
            icon={Clock}
            color="emerald"
          />
          <StatCard
            title="Required Shift"
            value={company?.requiredShift || '24x7'}
            subtitle="Current Security Contract"
            icon={Building2}
            color="amber"
          />
        </div>

        {/* Assigned Security Roster Summary */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" /> Active Stationed Security Guards
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAssignments.map((a) => (
              <div key={a._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-lg flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
                  {a.workerId?.name?.charAt(0) || 'G'}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-sm">{a.workerId?.name}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">{a.position}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{a.shiftId?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
