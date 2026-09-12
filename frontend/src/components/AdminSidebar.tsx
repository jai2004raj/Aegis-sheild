import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Clock,
  DollarSign,
  Bell,
  Star,
  MessageSquare,
  FileText,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Workers', path: '/admin/workers', icon: Users },
    { name: 'Companies', path: '/admin/companies', icon: Building2 },
    { name: 'Assignments', path: '/admin/assignments', icon: CalendarCheck },
    { name: 'Attendance', path: '/admin/attendance', icon: Clock },
    { name: 'Salaries', path: '/admin/salaries', icon: DollarSign },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Contact Requests', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200 shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
          <Shield className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-slate-900 dark:text-white font-extrabold text-base leading-tight">AEGIS <span className="text-amber-500">ADMIN</span></h2>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Control Center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
