import React from 'react';
import { ShieldCheck, Award, Users, CheckCircle2, Lock, FileCheck } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 transition-colors duration-200">
      {/* Header Banner with Background Image */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center max-w-5xl mx-auto space-y-4 shadow-sm">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/hero-bg.jpg"
            alt="Security Agency"
            className="w-full h-full object-cover object-center opacity-10 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-slate-50/70 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/60"></div>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">About Aegis Shield</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Over 10 Years of Uncompromising Security Excellence
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
          Founded on the core principles of integrity, tactical discipline, and operational transparency, Aegis Shield manages over 450 verified security officers across educational, corporate, industrial, and residential sectors.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Vetted Force</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Every single security officer undergoes 100% police verification, extensive background checks, drug screening, and physical fitness evaluations before deployment.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Award className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Certified Training</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Our personnel complete mandatory training modules in fire safety, emergency evacuation, de-escalation tactics, first aid CPR, and CCTV monitoring.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            <FileCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Digital Oversight</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Our cloud portal allows real-time duty check-ins, automated attendance logs, salary transparency, and instant shift replacement notifications.
          </p>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-sm">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Core Commitments</h2>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold">Zero Compromise on Vigilance</strong>
                Our officers maintain constant situational awareness, ensuring your premises remain secure 24 hours a day, 365 days a year.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold">Transparent Labor Compliance</strong>
                Full compliance with statutory labor laws, minimum wages, statutory allowances, and insurance for worker welfare.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold">Rapid Guard Replacement</strong>
                If an assigned officer is unavailable due to emergency leave, an equivalent certified backup officer is dispatched immediately.
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 text-center">
          <Lock className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fully Licensed & Insured</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            Operating under official Security Guard Agency licenses, private security regulation acts, and comprehensive commercial liability insurance.
          </p>
        </div>
      </div>
    </div>
  );
};
