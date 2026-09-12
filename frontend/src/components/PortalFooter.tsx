import React from 'react';
import { Shield, Radio, Phone, Clock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortalFooterProps {
  portalName?: string;
}

export const PortalFooter: React.FC<PortalFooterProps> = ({ portalName = 'Client Property Portal' }) => {
  return (
    <footer className="w-full mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-5 px-6 sm:px-8 transition-colors duration-200 z-10">
      <div className="w-full max-w-7xl mx-auto space-y-4">
        {/* Top Dispatch Info Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Shield className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Aegis Shield • {portalName}
              </span>
              <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Direct Field Dispatch Command Console
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300">
              <Phone className="w-3 h-3 mr-1 text-blue-500" /> 24/7 Desk: +1 (800) 555-AEGIS
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Posts Covered
            </span>
          </div>
        </div>

        {/* Quick Operational Notice & Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Shift handovers occur daily at 07:00, 15:00, and 23:00. Emergency relief dispatched within 15 minutes.</span>
          </div>

          <div className="flex items-center gap-3 font-semibold text-xs shrink-0">
            <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              Request Extra Guards
            </Link>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <Link to="/reviews" className="text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              Post Feedback
            </Link>
          </div>
        </div>

        {/* Bottom Micro Stamp */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <p>© 2026 Aegis Shield Security Agency Management. Field Dispatch Station 04.</p>
        </div>
      </div>
    </footer>
  );
};
