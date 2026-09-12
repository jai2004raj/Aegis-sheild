import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  CalendarCheck,
  Clock,
  DollarSign,
  UserCheck,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { Header } from '../../components/Header';
import { Badge } from '../../components/Badge';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/reports/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const pieColors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pieData =
    stats?.companiesByType?.map((item: any) => ({
      name: item._id || 'Other',
      value: item.count,
    })) || [];

  const barData = [
    { name: 'Total Force', count: stats?.totalWorkers || 0 },
    { name: 'Active Guards', count: stats?.activeWorkers || 0 },
    { name: 'Deployed', count: stats?.activeAssignments || 0 },
    { name: 'Present Today', count: stats?.todayAttendanceCount || 0 },
    { name: 'On Leave', count: stats?.workersOnLeave || 0 },
  ];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto pb-16 space-y-8 transition-colors duration-200">
      <Header title="Admin Command Dashboard" subtitle="Real-time central monitoring for workforce allocation & security operations" />

      <div className="px-6 space-y-8 max-w-7xl mx-auto">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Workers"
            value={stats?.totalWorkers || 0}
            subtitle={`${stats?.activeWorkers || 0} active in service`}
            icon={Users}
            color="amber"
          />
          <StatCard
            title="Active Companies"
            value={stats?.totalCompanies || 0}
            subtitle="Partner organizations"
            icon={Building2}
            color="blue"
          />
          <StatCard
            title="Active Deployments"
            value={stats?.activeAssignments || 0}
            subtitle={`${stats?.unassignedWorkers || 0} available guards`}
            icon={CalendarCheck}
            color="emerald"
          />
          <StatCard
            title="Today's Attendance"
            value={stats?.todayAttendanceCount || 0}
            subtitle="Duty check-ins logged"
            icon={Clock}
            color="purple"
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Monthly Salary Spend</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">₹{(stats?.totalSalaryExpense || 0).toLocaleString()}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Pending Quote Requests</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats?.pendingInquiriesCount || 0} Leads</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Workers On Leave</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats?.workersOnLeave || 0} Guards</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Visual Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" /> Workforce & Duty Overview
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                  />
                  <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" /> Client Distribution by Sector
              </h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              {pieData.length === 0 ? (
                <p className="text-xs text-slate-500">No company sector data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
