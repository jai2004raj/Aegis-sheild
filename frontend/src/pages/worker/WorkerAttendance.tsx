import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import api from '../../services/api';
import { Attendance } from '../../types';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const WorkerAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    api.get('/attendance').then((res) => {
      setAttendance(res.data.attendance || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="My Duty Attendance Logs" subtitle="View your daily check-in timestamps, check-out records, and logged working hours" />

      <div className="px-6 max-w-5xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Location Station</th>
                <th className="p-4">Duty Check-In</th>
                <th className="p-4">Duty Check-Out</th>
                <th className="p-4">Total Hours</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No attendance logs recorded yet.
                  </td>
                </tr>
              ) : (
                attendance.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{log.date}</td>
                    <td className="p-4 font-semibold text-slate-200">{(log.companyId as any)?.name || 'Assigned Post'}</td>
                    <td className="p-4 text-emerald-400 font-semibold">{log.loginTime ? new Date(log.loginTime).toLocaleTimeString() : 'N/A'}</td>
                    <td className="p-4 text-rose-400 font-semibold">{log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString() : 'On Duty'}</td>
                    <td className="p-4 font-bold text-white">{log.totalHours || 0} hrs</td>
                    <td className="p-4">
                      <Badge status={log.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
