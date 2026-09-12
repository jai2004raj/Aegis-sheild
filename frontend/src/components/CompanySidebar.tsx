import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Clock,
  CalendarCheck,
  Star,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CompanySidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', path: '/company/profile', icon: Building2 },
    { name: 'Assigned Workers', path: '/company/workers', icon: Users },
    { name: 'Attendance Logs', path: '/company/attendance', icon: Clock },
    { name: 'Assignments Roster', path: '/company/assignments', icon: CalendarCheck },
    { name: 'Submit Review', path: '/company/reviews', icon: Star },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200 shrink-0">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
          <Shield className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-slate-900 dark:text-white font-extrabold text-base leading-tight">AEGIS <span className="text-blue-500">CLIENT</span></h2>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Company Portal</p>
        </div>
      </div>

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
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

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
