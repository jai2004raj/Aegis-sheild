import React, { useState, useEffect } from 'react';
import { CalendarCheck, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const CompanyAssignments: React.FC = () => {
  const { company } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (company?._id) {
      api.get(`/assignments?companyId=${company._id}`).then((res) => {
        setAssignments(res.data.assignments || []);
      }).catch(() => {});
    }
  }, [company]);

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Company Duty Roster & Contracts" subtitle="Active and historical guard deployments at your organization" />

      <div className="px-6 max-w-6xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">Assigned Officer</th>
                <th className="p-4">Duty Position</th>
                <th className="p-4">Shift Schedule</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {assignments.map((a) => (
                <tr key={a._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white">
                    {(a.workerId as any)?.name || 'Guard'}
                    <span className="block text-[10px] text-amber-400 font-mono">{(a.workerId as any)?.workerId}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{a.position}</td>
                  <td className="p-4 text-amber-400 font-bold">{(a.shiftId as any)?.name}</td>
                  <td className="p-4 text-slate-400">{new Date(a.startDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Badge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
