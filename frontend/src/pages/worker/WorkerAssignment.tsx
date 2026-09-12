import React, { useState, useEffect } from 'react';
import { CalendarCheck, MapPin, Building2, Clock, History } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const WorkerAssignment: React.FC = () => {
  const { worker } = useAuth();
  const [assignmentHistory, setAssignmentHistory] = useState<any[]>([]);

  useEffect(() => {
    if (worker?._id) {
      api.get(`/workers/${worker._id}`).then((res) => {
        setAssignmentHistory(res.data.assignmentHistory || []);
      }).catch(() => {});
    }
  }, [worker]);

  const currentAssignment: any = worker?.currentAssignment;

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="My Security Assignment" subtitle="Details of your current duty station, shift timing, and history" />

      <div className="px-6 max-w-5xl mx-auto space-y-8">
        {/* Active Card */}
        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Current Duty Assignment
            </span>
            <Badge status={currentAssignment ? 'ACTIVE' : 'UNASSIGNED'} />
          </div>

          {currentAssignment ? (
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white">{currentAssignment.companyId?.name || 'Assigned Site'}</h2>
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" /> {currentAssignment.companyId?.address}, {currentAssignment.companyId?.city}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Duty Position</span>
                  <span className="font-extrabold text-white text-sm">{currentAssignment.position || worker?.designation}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Shift Timing</span>
                  <span className="font-extrabold text-amber-400 text-sm">{currentAssignment.shiftId?.name}</span>
                  <span className="block text-[10px] text-slate-400">
                    {currentAssignment.shiftId?.startTime} - {currentAssignment.shiftId?.endTime}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Deployment Start</span>
                  <span className="font-bold text-slate-200 text-sm">{new Date(currentAssignment.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">You currently have no active client posting.</p>
          )}
        </div>

        {/* Assignment History */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" /> Duty Deployment History
          </h3>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Stationed Client</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Shift</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {assignmentHistory.map((h) => (
                  <tr key={h._id}>
                    <td className="p-4 font-bold text-white">{(h.companyId as any)?.name || 'Client Site'}</td>
                    <td className="p-4">{h.position}</td>
                    <td className="p-4 text-amber-400">{(h.shiftId as any)?.name}</td>
                    <td className="p-4 text-slate-400">{new Date(h.startDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Badge status={h.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
