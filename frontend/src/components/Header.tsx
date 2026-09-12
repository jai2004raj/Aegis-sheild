import React, { useState, useEffect } from 'react';
import { Bell, Search, User as UserIcon, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Notification } from '../types';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      // Ignore
    }
  };

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3" />
          <input
            type="text"
            placeholder="Search records..."
            className="bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:outline-none w-48 lg:w-64 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            aria-label="Notifications"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{unreadCount} unread</span>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                        n.isRead
                          ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400'
                          : 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/30 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-600 dark:text-amber-400">{n.title}</span>
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(n._id)}
                            className="text-[10px] text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Mark read
                          </button>
                        )}
                      </div>
                      <p className="leading-relaxed">{n.message}</p>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-sm">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-xl object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</span>
            <span className="block text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
