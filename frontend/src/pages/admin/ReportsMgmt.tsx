import React, { useState, useEffect } from 'react';
import { Download, FileText, Filter, Calendar } from 'lucide-react';
import api from '../../services/api';
import { Header } from '../../components/Header';

export const ReportsMgmt: React.FC = () => {
  const [reportType, setReportType] = useState<'attendance' | 'salary' | 'allocation'>('attendance');
  const [data, setData] = useState<any[]>([]);

  const fetchReportData = async () => {
    try {
      if (reportType === 'attendance') {
        const res = await api.get('/attendance');
        setData(res.data.attendance || []);
      } else if (reportType === 'salary') {
        const res = await api.get('/salaries');
        setData(res.data.salaries || []);
      } else if (reportType === 'allocation') {
        const res = await api.get('/assignments');
        setData(res.data.assignments || []);
      }
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  const exportToCSV = () => {
    if (data.length === 0) return;

    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === 'attendance') {
      headers = ['Worker ID', 'Worker Name', 'Company Station', 'Date', 'Login Time', 'Logout Time', 'Hours', 'Status'];
      rows = data.map((d) => [
        d.workerId?.workerId || '',
        d.workerId?.name || '',
        d.companyId?.name || '',
        d.date || '',
        d.loginTime ? new Date(d.loginTime).toLocaleTimeString() : '',
        d.logoutTime ? new Date(d.logoutTime).toLocaleTimeString() : '',
        String(d.totalHours || 0),
        d.status || '',
      ]);
    } else if (reportType === 'salary') {
      headers = ['Worker ID', 'Worker Name', 'Month', 'Year', 'Basic Salary', 'Allowances', 'Overtime', 'Deductions', 'Net Salary', 'Status'];
      rows = data.map((d) => [
        d.workerId?.workerId || '',
        d.workerId?.name || '',
        d.month || '',
        String(d.year || ''),
        String(d.basicSalary || 0),
        String(d.allowances || 0),
        String(d.overtime || 0),
        String(d.deductions || 0),
        String(d.netSalary || 0),
        d.paymentStatus || '',
      ]);
    } else if (reportType === 'allocation') {
      headers = ['Worker ID', 'Worker Name', 'Company Name', 'Position', 'Shift', 'Start Date', 'Status'];
      rows = data.map((d) => [
        d.workerId?.workerId || '',
        d.workerId?.name || '',
        d.companyId?.name || '',
        d.position || '',
        d.shiftId?.name || '',
        d.startDate ? new Date(d.startDate).toLocaleDateString() : '',
        d.status || '',
      ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aegis_Shield_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Audit & Operational Reports" subtitle="Generate comprehensive workforce logs and export official CSV datasets" />

      <div className="px-6 max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            {[
              { id: 'attendance', label: 'Attendance Audit' },
              { id: 'salary', label: 'Salary Expenditure' },
              { id: 'allocation', label: 'Allocation History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  reportType === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={exportToCSV}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-700 text-amber-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>

        {/* Data Preview Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {reportType.toUpperCase()} DATASET PREVIEW ({data.length} Records)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                {reportType === 'attendance' && (
                  <tr>
                    <th className="p-4">Officer</th>
                    <th className="p-4">Company Station</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Login</th>
                    <th className="p-4">Logout</th>
                    <th className="p-4">Hours</th>
                    <th className="p-4">Status</th>
                  </tr>
                )}
                {reportType === 'salary' && (
                  <tr>
                    <th className="p-4">Officer</th>
                    <th className="p-4">Month/Year</th>
                    <th className="p-4">Basic Pay</th>
                    <th className="p-4">Allowances</th>
                    <th className="p-4">Net Salary</th>
                    <th className="p-4">Payment Status</th>
                  </tr>
                )}
                {reportType === 'allocation' && (
                  <tr>
                    <th className="p-4">Officer</th>
                    <th className="p-4">Company Name</th>
                    <th className="p-4">Position</th>
                    <th className="p-4">Shift</th>
                    <th className="p-4">Start Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {data.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-800/40 transition-colors">
                    {reportType === 'attendance' && (
                      <>
                        <td className="p-4 font-bold text-white">{row.workerId?.name || 'Guard'}</td>
                        <td className="p-4">{row.companyId?.name || 'Site'}</td>
                        <td className="p-4 text-slate-400">{row.date}</td>
                        <td className="p-4 text-emerald-400">{row.loginTime ? new Date(row.loginTime).toLocaleTimeString() : 'N/A'}</td>
                        <td className="p-4 text-rose-400">{row.logoutTime ? new Date(row.logoutTime).toLocaleTimeString() : 'On Duty'}</td>
                        <td className="p-4 font-bold text-white">{row.totalHours || 0} hrs</td>
                        <td className="p-4 font-bold text-amber-400">{row.status}</td>
                      </>
                    )}
                    {reportType === 'salary' && (
                      <>
                        <td className="p-4 font-bold text-white">{row.workerId?.name || 'Guard'}</td>
                        <td className="p-4">{row.month} {row.year}</td>
                        <td className="p-4">₹{row.basicSalary?.toLocaleString()}</td>
                        <td className="p-4">₹{row.allowances?.toLocaleString()}</td>
                        <td className="p-4 font-black text-amber-400">₹{row.netSalary?.toLocaleString()}</td>
                        <td className="p-4 font-bold text-emerald-400">{row.paymentStatus}</td>
                      </>
                    )}
                    {reportType === 'allocation' && (
                      <>
                        <td className="p-4 font-bold text-white">{row.workerId?.name || 'Guard'}</td>
                        <td className="p-4">{row.companyId?.name || 'Site'}</td>
                        <td className="p-4">{row.position}</td>
                        <td className="p-4 text-amber-400">{row.shiftId?.name}</td>
                        <td className="p-4 text-slate-400">{new Date(row.startDate).toLocaleDateString()}</td>
                        <td className="p-4 font-bold text-emerald-400">{row.status}</td>
                      </>
                    )}
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
