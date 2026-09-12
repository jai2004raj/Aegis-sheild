import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Notification } from '../../types';
import { Header } from '../../components/Header';

export const WorkerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      // Ignore
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="My Dispatch Notifications" subtitle="Duty updates, assignment transfers, shift notices, and announcements" />

      <div className="px-6 max-w-4xl mx-auto space-y-4">
        {notifications.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-500 rounded-3xl">No notifications currently.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-5 rounded-2xl border space-y-2 transition-all ${
                n.isRead ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-amber-500/10 border-amber-500/30 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-400 text-sm">{n.title}</span>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Read
                  </button>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-300">{n.message}</p>
              <span className="block text-[10px] text-slate-500 pt-1">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
