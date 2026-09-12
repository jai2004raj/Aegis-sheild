import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School,
  Building2,
  Building,
  Hospital,
  Warehouse,
  ShoppingBag,
  UserCheck,
  Moon,
  Video,
  AlertTriangle,
  ShieldCheck,
  Shield,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const services = [
    {
      name: 'School & Campus Security',
      icon: School,
      tag: 'Educational Safety',
      desc: 'Protecting students, faculty, and campus property with screened, child-friendly security personnel.',
      features: ['Access Control at Gates', 'Visitor ID Screening', 'School Bus Boarding Escort', 'Perimeter Patrol'],
    },
    {
      name: 'Corporate Office Security',
      icon: Building2,
      tag: 'Enterprise Protection',
      desc: 'Sophisticated lobby check-in, executive protection, and NDA-compliant badge verification.',
      features: ['Badge & Pass Screening', 'Executive Escort', 'Confidential Data Room Guarding', 'Parking Operations'],
    },
    {
      name: 'Apartment & Gated Community',
      icon: Building,
      tag: 'Residential Living',
      desc: '24x7 gate security, visitor digital logging, package management, and neighborhood patrol.',
      features: ['Digital Entry Logs', 'Delivery Clearance', 'Night Perimeter Rounds', 'Emergency Call Button'],
    },
    {
      name: 'Hospital & Healthcare Security',
      icon: Hospital,
      tag: 'Medical Safety',
      desc: 'Emergency Room safety, de-escalation, visitor pass control, and pharmaceutical storage guarding.',
      features: ['ER Violence Prevention', 'ICU Pass Verification', 'Pharma Vault Security', 'Ambulance Bay Ops'],
    },
    {
      name: 'Warehouse & Cargo Security',
      icon: Warehouse,
      tag: 'Logistics Guarding',
      desc: 'Preventing inventory theft, cargo loading verification, vehicle sealing, and fire safety checks.',
      features: ['Loading Dock Screening', 'Seal Audits', 'Loss Prevention', 'Fire Hazard Patrol'],
    },
    {
      name: 'Shopping Mall & Retail',
      icon: ShoppingBag,
      tag: 'Retail Protection',
      desc: 'Shoplifting deterrence, crowd control, lost child assistance, and parking lot safety.',
      features: ['Shoplifting Deterrence', 'Crowd Guidance', 'Escalator & Elevator Guarding', 'CCTV Monitoring'],
    },
    {
      name: 'Event & VIP Escort Security',
      icon: UserCheck,
      tag: 'Event Management',
      desc: 'Bespoke security for concerts, galas, sporting events, and high-profile corporate conventions.',
      features: ['Metal Detector Scanning', 'VIP Close Protection', 'Stage Perimeter', 'Emergency Evacuation'],
    },
    {
      name: 'Night Mobile Patrol',
      icon: Moon,
      tag: 'Nocturnal Surveillance',
      desc: 'Dedicated roving vehicle patrols inspecting commercial assets during high-risk night hours.',
      features: ['Lock & Gate Checks', 'Burglar Alarm Response', 'Random Patrol Intervals', 'Instant Incident Log'],
    },
    {
      name: 'CCTV Control Room Ops',
      icon: Video,
      tag: 'Tech Monitoring',
      desc: 'Certified control room operators monitoring multi-camera feeds for real-time threat detection.',
      features: ['Live Video Analytics', 'Control Room Incident Log', 'Remote Gate Release', 'Archive Auditing'],
    },
    {
      name: 'Industrial & Factory Security',
      icon: AlertTriangle,
      tag: 'Heavy Industry',
      desc: 'Hazardous area access control, worker biometric check-ins, and heavy machinery security.',
      features: ['Hazmat Safety Inspection', 'Shift Change Guarding', 'Perimeter Fence Alarm', 'Material Exit Pass'],
    },
    {
      name: 'Night Patrol & Rapid Guard',
      icon: ShieldCheck,
      tag: 'Emergency Guard',
      desc: 'Instant guard dispatch for sudden security breaches, guard absences, or high-alert periods.',
      features: ['Dispatch in <30 Mins', 'Armed Patrol Options', 'Temporary Duty Posting', 'Incident Reporting'],
    },
    {
      name: 'Residential Villa Guarding',
      icon: Shield,
      tag: 'Private Estates',
      desc: 'Discreet, highly trained personal security for private luxury residences and estates.',
      features: ['Smart Gate Verification', 'Estate Grounds Patrol', 'Intrusion System Response', 'CCTV Surveillance'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 transition-colors duration-200">
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center max-w-5xl mx-auto space-y-4 shadow-sm">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/patrol-bg.jpg"
            alt="Security Patrol"
            className="w-full h-full object-cover object-center opacity-10 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-slate-50/70 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/60"></div>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Service Directory</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Professional Security Workforce Solutions</h1>
        <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl mx-auto">Select any service to view operational specifications or request an allocation quote.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold border border-slate-200 dark:border-slate-700">
                    {s.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{s.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                <div className="space-y-2 pt-2">
                  {s.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => setSelectedService(s)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate('/contact', { state: { service: s.name } })}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                >
                  Quote <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Modal */}
      {selectedService && (
        <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={selectedService.name}>
          <div className="space-y-6">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{selectedService.desc}</p>
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Key Operational Deliverables:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedService.features.map((feat: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-amber-500" /> {feat}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedService(null);
                  navigate('/contact', { state: { service: selectedService.name } });
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-colors"
              >
                Request Guards For This Service
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
