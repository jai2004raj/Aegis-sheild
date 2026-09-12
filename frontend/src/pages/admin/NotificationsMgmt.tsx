import React, { useState, useEffect } from 'react';
import { Bell, Send, Megaphone, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Worker } from '../../types';
import { Header } from '../../components/Header';

export const NotificationsMgmt: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [targetWorkerId, setTargetWorkerId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'ASSIGNMENT' | 'TRANSFER' | 'SHIFT' | 'SALARY' | 'ANNOUNCEMENT'>('ANNOUNCEMENT');
  const [isBroadcast, setIsBroadcast] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    api.get('/workers').then((res) => {
      setWorkers(res.data.workers || []);
    });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setSubmitting(true);
    setSuccessMsg('');
    try {
      const res = await api.post('/notifications', {
        workerId: targetWorkerId,
        title,
        message,
        type,
        isBroadcast,
      });
      setSuccessMsg(res.data.message || 'Notification dispatched!');
      setTitle('');
      setMessage('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error sending notification.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Worker Notification Hub" subtitle="Dispatch targeted updates, assignment changes, or agency-wide broadcasts" />

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Send Worker Dispatch Notice</h3>
              <p className="text-[10px] text-amber-400 font-semibold uppercase">Real-Time Mobile Push</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <input
                type="checkbox"
                id="broadcast"
                checked={isBroadcast}
                onChange={(e) => setIsBroadcast(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <label htmlFor="broadcast" className="text-xs font-bold text-white cursor-pointer flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" /> Broadcast Announcement to ALL Security Workers
              </label>
            </div>

            {!isBroadcast && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Security Officer *</label>
                <select
                  required={!isBroadcast}
                  value={targetWorkerId}
                  onChange={(e) => setTargetWorkerId(e.target.value)}
                  className="w-full bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">-- Select Recipient --</option>
                  {workers.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.name} ({w.workerId}) — {w.designation}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Assignment Update"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="ASSIGNMENT">ASSIGNMENT</option>
                  <option value="TRANSFER">TRANSFER</option>
                  <option value="SHIFT">SHIFT</option>
                  <option value="SALARY">SALARY</option>
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Message Content *</label>
              <textarea
                required
                rows={4}
                placeholder="Enter exact message to display on worker dashboard..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Dispatching Notice...' : 'Dispatch Notification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
