import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Salary } from '../../types';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const WorkerSalary: React.FC = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);

  useEffect(() => {
    api.get('/salaries').then((res) => {
      setSalaries(res.data.salaries || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="My Salary Statements" subtitle="Monthly paystub breakdowns including Basic, Allowances, Overtime, Deductions, and Net Pay" />

      <div className="px-6 max-w-5xl mx-auto space-y-6">
        <div className="space-y-4">
          {salaries.map((s) => (
            <div key={s._id} className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{s.month} {s.year} Paystub</h3>
                  <span className="text-xs text-slate-400">Statement ID: {s._id.slice(-6).toUpperCase()}</span>
                </div>
                <Badge status={s.paymentStatus} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block font-semibold">Basic Pay</span>
                  <span className="font-bold text-white text-sm">₹{s.basicSalary.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block font-semibold">Allowances</span>
                  <span className="font-bold text-emerald-400 text-sm">+₹{s.allowances.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block font-semibold">Overtime Pay</span>
                  <span className="font-bold text-emerald-400 text-sm">+₹{s.overtime.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block font-semibold">Deductions</span>
                  <span className="font-bold text-rose-400 text-sm">-₹{s.deductions.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Net Amount Deposited:</span>
                <span className="text-2xl font-black text-white">₹{s.netSalary.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
