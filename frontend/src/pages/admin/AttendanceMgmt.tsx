import React, { useState, useEffect } from 'react';
import { Clock, Search, Calendar, Filter } from 'lucide-react';
import api from '../../services/api';
import { Attendance } from '../../types';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const AttendanceMgmt: React.FC = () => {
  const [attendanceLogs, setAttendanceLogs] = useState<Attendance[]>([]);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance?date=${dateFilter}${statusFilter ? `&status=${statusFilter}` : ''}`);
      setAttendanceLogs(res.data.attendance || []);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter, statusFilter]);

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Daily Attendance Monitor" subtitle="Inspect duty login timestamps, logout times, and total logged working hours" />

      <div className="px-6 max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-slate-950 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 text-xs p-2.5 rounded-xl border border-slate-800 text-slate-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Attendance Statuses</option>
              <option value="PRESENT">PRESENT</option>
              <option value="ABSENT">ABSENT</option>
              <option value="LATE">LATE</option>
              <option value="HALF_DAY">HALF_DAY</option>
              <option value="LEAVE">LEAVE</option>
            </select>
          </div>

          <div className="text-xs font-bold text-slate-400">
            Total Logs Recorded: <span className="text-amber-400">{attendanceLogs.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Security Officer</th>
                  <th className="p-4">Assigned Location</th>
                  <th className="p-4">Duty Login Time</th>
                  <th className="p-4">Duty Logout Time</th>
                  <th className="p-4">Total Hours</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {attendanceLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      No attendance logs recorded for {dateFilter}.
                    </td>
                  </tr>
                ) : (
                  attendanceLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white">
                        {(log.workerId as any)?.name || 'Worker'}
                        <span className="block text-[10px] text-amber-400 font-mono">
                          {(log.workerId as any)?.workerId}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{(log.companyId as any)?.name || 'Station'}</span>
                        <span className="text-[10px] text-slate-400">{(log.companyId as any)?.city}</span>
                      </td>
                      <td className="p-4 text-emerald-400 font-semibold">
                        {log.loginTime ? new Date(log.loginTime).toLocaleTimeString() : 'N/A'}
                      </td>
                      <td className="p-4 text-rose-400 font-semibold">
                        {log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString() : 'On Duty'}
                      </td>
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
    </div>
  );
};
