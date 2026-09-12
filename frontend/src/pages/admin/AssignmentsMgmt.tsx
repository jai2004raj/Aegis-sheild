import React, { useState, useEffect } from 'react';
import { CalendarCheck, ShieldAlert, ArrowRight, CheckCircle2, History } from 'lucide-react';
import api from '../../services/api';
import { Worker, Company, Shift, Assignment } from '../../types';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const AssignmentsMgmt: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [position, setPosition] = useState('Security Guard');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    try {
      const [wRes, cRes, sRes, aRes] = await Promise.all([
        api.get('/workers'),
        api.get('/companies'),
        api.get('/shifts'),
        api.get('/assignments'),
      ]);
      setWorkers(wRes.data.workers || []);
      setCompanies(cRes.data.companies || []);
      setShifts(sRes.data.shifts || []);
      setAssignments(aRes.data.assignments || []);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId || !selectedCompanyId || !selectedShiftId) return;

    setSubmitting(true);
    setSuccessMsg('');
    try {
      const res = await api.post('/assignments', {
        workerId: selectedWorkerId,
        companyId: selectedCompanyId,
        shiftId: selectedShiftId,
        position,
        startDate,
        notes,
      });
      setSuccessMsg(res.data.message || 'Worker allocated successfully!');
      fetchData();
      setSelectedWorkerId('');
      setNotes('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error processing allocation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Workforce Allocation & Transfer" subtitle="Deploy security personnel to clients, configure duty shifts, and manage transfers" />

      <div className="px-6 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800 lg:col-span-1">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">New Duty Deployment</h3>
                <p className="text-[10px] text-amber-400 font-semibold uppercase">Shift & Transfer Control</p>
              </div>
            </div>

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Security Worker *</label>
                <select
                  required
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Select Security Officer --</option>
                  {workers.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.name} ({w.workerId}) — {w.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Target Client Company *</label>
                <select
                  required
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Select Client Organization --</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.organizationType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Duty Shift *</label>
                <select
                  required
                  value={selectedShiftId}
                  onChange={(e) => setSelectedShiftId(e.target.value)}
                  className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Select Shift Schedule --</option>
                  {shifts.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.startTime} - {s.endTime})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Position / Duty Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Main Gate Supervisor"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Effective Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Allocation Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Special night patrol posting"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all"
              >
                {submitting ? 'Allocating...' : 'Confirm Allocation & Transfer'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Active Deployments Roster */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" /> Active & Past Security Deployments
              </h3>
              <span className="text-xs text-slate-400 font-semibold">{assignments.length} total deployment records</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Worker</th>
                      <th className="p-4">Stationed Company</th>
                      <th className="p-4">Shift & Position</th>
                      <th className="p-4">Start Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {assignments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-slate-500">
                          No assignment records found.
                        </td>
                      </tr>
                    ) : (
                      assignments.map((a) => (
                        <tr key={a._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-bold text-white">
                            {(a.workerId as any)?.name || 'Worker'}
                            <span className="block text-[10px] text-amber-400 font-mono">
                              {(a.workerId as any)?.workerId}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-white block">{(a.companyId as any)?.name || 'Company'}</span>
                            <span className="text-[10px] text-slate-400">{(a.companyId as any)?.organizationType}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-200 block">{a.position}</span>
                            <span className="text-[10px] text-amber-400">{(a.shiftId as any)?.name}</span>
                          </td>
                          <td className="p-4 text-slate-400">{new Date(a.startDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            <Badge status={a.status} />
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
      </div>
    </div>
  );
};
