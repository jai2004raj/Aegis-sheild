import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export const Contact: React.FC = () => {
  const location = useLocation();
  const initialService = (location.state as any)?.service || 'Corporate Security';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [serviceRequired, setServiceRequired] = useState(initialService);
  const [numberOfPersonnel, setNumberOfPersonnel] = useState(5);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.post('/contact', {
        name,
        email,
        phone,
        organization,
        serviceRequired,
        numberOfPersonnel,
        message,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 transition-colors duration-200">
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center max-w-5xl mx-auto space-y-4 shadow-sm">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/hero-bg.jpg"
            alt="Security Operations Contact"
            className="w-full h-full object-cover object-center opacity-10 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-slate-50/70 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/60"></div>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Contact & Inquiry</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Request Security Personnel Quote</h1>
        <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl mx-auto">Speak directly with our operations dispatch team or submit a workforce requirement proposal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Contact Info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> Dispatch HQ
            </h3>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Main Headquarters</strong>
                  100 Aegis Tower, Security HQ Blvd, Metropolis NY 10001
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">24/7 Toll Free</strong>
                  +1 (800) 555-AEGIS (+1 800 555 2344)
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Official Email</strong>
                  contact@aegisshield.com
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
              ⚡ <strong>Fast SLA:</strong> All business quote inquiries are reviewed by our operations manager within 2 hours.
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl space-y-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Workforce Requirement Form</h2>

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 space-y-3 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
              <h3 className="text-xl font-bold">Inquiry Received Successfully!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you for choosing Aegis Shield. Our security manager will review your personnel count and reach out to your provided contact number.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-sm"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Organization / School / Complex</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC International School"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Service Required *</label>
                  <select
                    value={serviceRequired}
                    onChange={(e) => setServiceRequired(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition-all"
                  >
                    <option value="School Security">School Security</option>
                    <option value="Corporate Security">Corporate Security</option>
                    <option value="Apartment Security">Apartment Security</option>
                    <option value="Hospital Security">Hospital Security</option>
                    <option value="Industrial Security">Industrial Security</option>
                    <option value="Event Security">Event Security</option>
                    <option value="Warehouse Security">Warehouse Security</option>
                    <option value="Mall Security">Mall Security</option>
                    <option value="Night Patrol">Night Patrol</option>
                    <option value="CCTV Surveillance Support">CCTV Surveillance Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Personnel Needed</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={numberOfPersonnel}
                    onChange={(e) => setNumberOfPersonnel(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Requirement Details & Duty Timings *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your location, specific shift preferences (24x7 / Day / Night), special skill requirements (armed guard, supervisor, CCTV)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all placeholder:text-slate-400"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting Proposal...' : 'Submit Security Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
