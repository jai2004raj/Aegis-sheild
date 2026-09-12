import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Attendance } from '../../types';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const CompanyAttendance: React.FC = () => {
  const { company } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (company?._id) {
      api.get('/attendance').then((res) => {
        setAttendance(res.data.attendance || []);
      }).catch(() => {});
    }
  }, [company]);

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Facility Attendance Logs" subtitle="Duty check-in and check-out logs of security guards stationed at your properties" />

      <div className="px-6 max-w-6xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">Security Guard</th>
                <th className="p-4">Date</th>
                <th className="p-4">Login Time</th>
                <th className="p-4">Logout Time</th>
                <th className="p-4">Logged Hours</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No attendance logs found for your location.
                  </td>
                </tr>
              ) : (
                attendance.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {(log.workerId as any)?.name || 'Guard'}
                      <span className="block text-[10px] text-amber-400 font-mono">{(log.workerId as any)?.workerId}</span>
                    </td>
                    <td className="p-4 text-slate-400">{log.date}</td>
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
