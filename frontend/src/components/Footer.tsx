import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, Radio, Coffee, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-100 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Personal Note */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-mustard)] border-2 border-[var(--border-color)] flex items-center justify-center text-[var(--border-color)] font-bold shadow-[2px_2px_0px_var(--shadow-color)]">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">
                  AEGIS <span className="underline decoration-[var(--accent-terracotta)] decoration-2">SHIELD</span>
                </span>
                <span className="block text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">
                  Independent Guard Company
                </span>
              </div>
            </div>

            {/* Handwritten-style personal dispatch note */}
            <div className="craft-box p-3.5 rounded-lg bg-[var(--bg-surface)] text-xs text-[var(--text-main)] space-y-1.5 rotate-[-0.5deg]">
              <div className="flex items-center gap-1.5 font-bold text-[var(--accent-terracotta)] font-mono text-[11px]">
                <Coffee className="w-3.5 h-3.5" /> Note from Dispatch Desk #1:
              </div>
              <p className="leading-relaxed">
                "We aren’t an algorithm or an outsourced app. We’re 120 dedicated field guards, 14 supervisors, and 3 dispatchers who drink too much black coffee. When you ring us at 3:15 AM on a rainy Tuesday, a real human answers."
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono pt-1">
              <span className="craft-badge bg-[var(--bg-surface)]">
                <Clock className="w-3 h-3 mr-1 text-[var(--accent-terracotta)]" /> 24/7/365 On-Call Dispatch
              </span>
            </div>
          </div>

          {/* Col 2: Field Services */}
          <div>
            <h3 className="font-bold mb-3 uppercase tracking-wider text-xs font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1">
              Field Deployments
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link to="/services" className="hover:underline hover:text-[var(--accent-terracotta)]">Campus &amp; School Watch</Link></li>
              <li><Link to="/services" className="hover:underline hover:text-[var(--accent-terracotta)]">Corporate Tech Lobby</Link></li>
              <li><Link to="/services" className="hover:underline hover:text-[var(--accent-terracotta)]">Hospital ER Security</Link></li>
              <li><Link to="/services" className="hover:underline hover:text-[var(--accent-terracotta)]">Residential Gated Checkpoint</Link></li>
              <li><Link to="/services" className="hover:underline hover:text-[var(--accent-terracotta)]">Warehouse Cargo Gate</Link></li>
              <li><Link to="/services" className="hover:underline hover:text-[var(--accent-terracotta)]">Night Mobile Perimeter Patrol</Link></li>
            </ul>
          </div>

          {/* Col 3: Roster & Portals */}
          <div>
            <h3 className="font-bold mb-3 uppercase tracking-wider text-xs font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1">
              Duty Log &amp; Portals
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link to="/login" className="hover:underline hover:text-[var(--accent-terracotta)]">Officer Duty Check-In</Link></li>
              <li><Link to="/login" className="hover:underline hover:text-[var(--accent-terracotta)]">Client Post Portal</Link></li>
              <li><Link to="/companies" className="hover:underline hover:text-[var(--accent-terracotta)]">Protected Properties</Link></li>
              <li><Link to="/reviews" className="hover:underline hover:text-[var(--accent-terracotta)]">Field Station Reviews</Link></li>
              <li><Link to="/about" className="hover:underline hover:text-[var(--accent-terracotta)]">Our Standards &amp; Training</Link></li>
              <li><Link to="/contact" className="hover:underline hover:text-[var(--accent-terracotta)]">Request Guard Quote</Link></li>
            </ul>
          </div>

          {/* Col 4: Physical Station */}
          <div>
            <h3 className="font-bold mb-3 uppercase tracking-wider text-xs font-mono text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1">
              Station Headquarters
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent-terracotta)] shrink-0 mt-0.5" />
                <span>Station 4, Sector 7 Industrial Area, Metro 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--accent-terracotta)] shrink-0" />
                <span className="font-mono font-bold">+1 (800) 555-DISPATCH</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent-terracotta)] shrink-0" />
                <span>dispatch@aegisshield.local</span>
              </li>
            </ul>

            <div className="mt-4 p-2 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-[10px] text-[var(--text-muted)]">
              <span className="font-bold text-[var(--text-main)] block">STATUS BOARD:</span>
              <span>All 28 active posts staffed. No unresolved alerts.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t-2 border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <p>© 2026 Aegis Shield Security Agency. Handcrafted with pride &amp; black coffee.</p>
        </div>
      </div>
    </footer>
  );
};
