import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { Salary, Worker } from '../../types';
import { Header } from '../../components/Header';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';

export const SalariesMgmt: React.FC = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [month, setMonth] = useState('September');
  const [year, setYear] = useState(2026);
  const [basicSalary, setBasicSalary] = useState(18000);
  const [allowances, setAllowances] = useState(2000);
  const [overtime, setOvertime] = useState(1500);
  const [deductions, setDeductions] = useState(500);
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING' | 'PROCESSING'>('PAID');

  const fetchData = async () => {
    try {
      const [sRes, wRes] = await Promise.all([api.get('/salaries'), api.get('/workers')]);
      setSalaries(sRes.data.salaries || []);
      setWorkers(wRes.data.workers || []);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWorkerSelect = (id: string) => {
    setSelectedWorkerId(id);
    const worker = workers.find((w) => w._id === id);
    if (worker) {
      setBasicSalary(worker.salaryStructure?.baseSalary || 18000);
      setAllowances(worker.salaryStructure?.allowances || 2000);
      setDeductions(worker.salaryStructure?.deductions || 500);
    }
  };

  const handleCreateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId) return;

    try {
      await api.post('/salaries', {
        workerId: selectedWorkerId,
        month,
        year,
        basicSalary,
        allowances,
        overtime,
        deductions,
        paymentStatus,
      });
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error processing salary.');
    }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    const nextStatus = current === 'PAID' ? 'PENDING' : 'PAID';
    try {
      await api.put(`/salaries/${id}`, { paymentStatus: nextStatus });
      fetchData();
    } catch (err: any) {
      alert('Error updating payment status.');
    }
  };

  const netPayCalculated = basicSalary + allowances + overtime - deductions;

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Salary & Payroll Records" subtitle="Generate monthly paystubs, calculate net pay, and update payment disbursement status" />

      <div className="px-6 max-w-7xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h3 className="font-bold text-white text-sm">Monthly Payroll Cycle</h3>
            <p className="text-xs text-slate-400">Total Statements: {salaries.length}</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Generate Worker Paystub
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Worker</th>
                  <th className="p-4">Month / Year</th>
                  <th className="p-4">Basic + Allowances</th>
                  <th className="p-4">Overtime / Deductions</th>
                  <th className="p-4">Net Salary</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {salaries.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {(s.workerId as any)?.name || 'Worker'}
                      <span className="block text-[10px] text-amber-400 font-mono">
                        {(s.workerId as any)?.workerId}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      {s.month} {s.year}
                    </td>
                    <td className="p-4 text-slate-300">
                      ₹{s.basicSalary.toLocaleString()} + ₹{s.allowances.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-300">
                      +₹{s.overtime.toLocaleString()} / -₹{s.deductions.toLocaleString()}
                    </td>
                    <td className="p-4 font-black text-amber-400 text-sm">₹{s.netSalary.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge status={s.paymentStatus} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(s._id, s.paymentStatus)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Generate Salary Statement">
        <form onSubmit={handleCreateSalary} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Select Security Officer *</label>
            <select
              required
              value={selectedWorkerId}
              onChange={(e) => handleWorkerSelect(e.target.value)}
              className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="">-- Select Worker --</option>
              {workers.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name} ({w.workerId}) — {w.designation}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Basic Salary (₹)</label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Allowances (₹)</label>
              <input
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Overtime Pay (₹)</label>
              <input
                type="number"
                value={overtime}
                onChange={(e) => setOvertime(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Deductions (₹)</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <span className="font-bold text-xs text-amber-400 uppercase">Calculated Net Pay:</span>
            <span className="text-xl font-black text-white">₹{netPayCalculated.toLocaleString()}</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all"
          >
            Save & Issue Paystub
          </button>
        </form>
      </Modal>
    </div>
  );
};
