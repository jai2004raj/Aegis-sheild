import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Building2, ShieldCheck, Play, Square, Bell, DollarSign } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const WorkerDashboard: React.FC = () => {
  const { worker, refreshUser } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchTodayAttendance = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await api.get(`/attendance?date=${todayStr}`);
      if (res.data.attendance && res.data.attendance.length > 0) {
        setTodayAttendance(res.data.attendance[0]);
      } else {
        setTodayAttendance(null);
      }
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
    refreshUser();
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setMsg('');
    try {
      const res = await api.post('/attendance/check-in');
      setMsg(res.data.message);
      fetchTodayAttendance();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Check-in failed.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingOut(true);
    setMsg('');
    try {
      const res = await api.post('/attendance/check-out');
      setMsg(res.data.message);
      fetchTodayAttendance();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Check-out failed.');
    } finally {
      setCheckingOut(false);
    }
  };

  const assignment: any = worker?.currentAssignment;

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto pb-16 space-y-6 transition-colors duration-200">
      <Header title="Security Officer Portal" subtitle={`Welcome back, ${worker?.name || 'Officer'}`} />

      <div className="px-6 max-w-7xl mx-auto space-y-8">
        {/* Status Notification Alert */}
        {msg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            {msg}
          </div>
        )}

        {/* Duty Check-In / Check-Out Widget */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              ● Active Duty Console
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Daily Duty Check-In & Check-Out</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {todayAttendance?.logoutTime
                ? 'Duty Completed for Today'
                : todayAttendance
                ? `Checked in at ${new Date(todayAttendance.loginTime).toLocaleTimeString()}`
                : 'Click Check-In when arriving at your assigned security post'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {!todayAttendance ? (
              <button
                onClick={handleCheckIn}
                disabled={checkingIn || !assignment}
                className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
              >
                <Play className="w-5 h-5 fill-slate-950" /> {checkingIn ? 'Checking In...' : 'START DUTY (CHECK-IN)'}
              </button>
            ) : !todayAttendance.logoutTime ? (
              <button
                onClick={handleCheckOut}
                disabled={checkingOut}
                className="px-8 py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md shadow-rose-500/20 flex items-center gap-2 transition-all"
              >
                <Square className="w-5 h-5 fill-slate-950" /> {checkingOut ? 'Checking Out...' : 'FINISH DUTY (CHECK-OUT)'}
              </button>
            ) : (
              <div className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                ✓ Shift Completed ({todayAttendance.totalHours} hrs)
              </div>
            )}
          </div>
        </div>

        {/* Active Assignment Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 md:col-span-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Current Security Posting
              </span>
              <Badge status={assignment ? 'ACTIVE' : 'UNASSIGNED'} />
            </div>

            {assignment ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{assignment.companyId?.name || 'Assigned Client'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-amber-500" /> {assignment.companyId?.address}, {assignment.companyId?.city}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">Duty Designation</span>
                    <span className="font-bold text-slate-900 dark:text-white">{assignment.position || worker?.designation}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">Shift Timing</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{assignment.shiftId?.name || 'Shift'}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                      {assignment.shiftId?.startTime} - {assignment.shiftId?.endTime}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">Start Date</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{new Date(assignment.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                No active company assignment currently assigned. You will be notified when allocated.
              </div>
            )}
          </div>

          {/* Quick Stats Widget */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Monthly Base Salary</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white block">
                ₹{(worker?.salaryStructure?.baseSalary || 18000).toLocaleString()}
              </span>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+ Allowances & Overtime Eligible</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Officer Badge ID</span>
              <span className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400 block">{worker?.workerId}</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Verification Code Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
