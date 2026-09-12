import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  Clock,
  Building,
  Star,
  CheckCircle,
  ArrowRight,
  PhoneCall,
  Video,
  School,
  Building2,
  Hospital,
  Warehouse,
  ShoppingBag,
  Moon,
  AlertTriangle,
  Radio,
  FileText,
  Coffee,
} from 'lucide-react';
import api from '../../services/api';
import { Review } from '../../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(5.0);

  useEffect(() => {
    api.get('/reviews').then((res) => {
      setReviews(res.data.reviews || []);
      setAvgRating(res.data.averageRating || 5.0);
    }).catch(() => {});
  }, []);

  const services = [
    {
      name: 'Campus & School Watch',
      icon: School,
      image: '/images/school.jpg',
      tag: 'ZONE-A',
      desc: 'Perimeter lockdown, visitor badge verification, and calming presence during morning drop-offs and afternoons.',
      guardNote: 'Officer Sarah: "We know every parent and bus driver by name."',
      featured: false,
    },
    {
      name: 'Night Patrol & Rapid Response',
      icon: Moon,
      image: '/images/patrol-bg.jpg',
      tag: 'NIGHT WATCH',
      desc: 'Mobile nocturnal cruisers with real-time GPS check-ins. We check padlocks, dark alleys, and loading docks every 45 minutes.',
      guardNote: 'Shift Supervisor Mike: "Active from 21:00 to 06:00 without missing a sweep."',
      featured: true,
    },
    {
      name: 'Corporate & Tech Park Guarding',
      icon: Building2,
      image: '/images/corporate-hq.jpg',
      tag: 'ZONE-B',
      desc: 'Polished front-desk security officers who represent your company professionally while keeping unauthorized guests outside.',
      guardNote: 'Badge checks, NDA logs, and executive escorting.',
      featured: false,
    },
    {
      name: 'Hospital & Clinic De-escalation',
      icon: Hospital,
      image: '/images/hospital.jpg',
      tag: 'HIGH ALERT',
      desc: 'Specially trained staff in emergency room patience, verbal de-escalation, and patient protection.',
      guardNote: 'Zero-tolerance for violence; compassionate handling.',
      featured: false,
    },
    {
      name: 'Gated Residential Communities',
      icon: Building,
      image: '/images/residence.jpg',
      tag: 'RESIDENTIAL',
      desc: 'Boom-barrier checkpoints, license plate scans, and courteous late-night resident assistance.',
      guardNote: 'No tailgaters get past the gatehouse. Ever.',
      featured: false,
    },
    {
      name: 'Warehouse & Industrial Cargo',
      icon: Warehouse,
      image: '/images/warehouse.jpg',
      tag: 'LOGISTICS',
      desc: 'Seal verification, driver manifests, heavy equipment monitoring, and preventing inventory shrinkage.',
      guardNote: 'Checking container locks and manifests 24/7.',
      featured: false,
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-24 pb-20 transition-colors duration-200">
      {/* =========================================================
          HERO SECTION: Handcrafted Field Dispatch & Tactical Zine
          ========================================================= */}
      <section className="relative pt-12 pb-16 lg:pb-20 border-b-2 border-[var(--border-color)] bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Asymmetric Quirky Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tilted Sticker Tag */}
              <div className="inline-block">
                <span className="craft-badge bg-[var(--accent-mustard)] text-[#191614] rotate-[-2deg] shadow-[2px_2px_0px_var(--shadow-color)]">
                  ⚡ FIELD DEPLOYED SINCE 2014 • VERIFIED HUMAN CREW
                </span>
              </div>

              {/* Bold Comic Sans Headline with hand-drawn underline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-main)] leading-[1.12]">
                Real guards who actually{' '}
                <span className="hand-drawn-underline">stay awake</span>{' '}
                and watch your doors.
              </h1>

              {/* Honest, Conversational Copy */}
              <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl font-sans">
                Founded by two former night patrol supervisors who got fed up with giant corporate security agencies sending sleepy teenagers with a clipboard. We run an active VHF radio net, rotate rested crews, and answer our emergency line on the second ring.
              </p>

              {/* Tactile Pushable Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => navigate('/contact')}
                  className="tactile-btn px-6 py-3.5 rounded-lg bg-[var(--accent-terracotta)] text-white text-sm"
                >
                  Request A Guard Post <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button
                  onClick={() => navigate('/services')}
                  className="tactile-btn px-5 py-3.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-main)] text-sm"
                >
                  Browse Shift Rosters
                </button>
              </div>

              {/* Hand-annotated Field Pledges */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-[var(--text-muted)] border-t-2 border-[var(--border-color)]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[var(--accent-terracotta)] shrink-0" />
                  Police &amp; State Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
                  Live Radio Backing
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[var(--accent-mustard)] shrink-0" />
                  15-Min Relief Guarantee
                </span>
              </div>
            </div>

            {/* Right Column: Physical Dispatch Board (Clipboard Aesthetic) */}
            <div className="lg:col-span-5">
              <div className="craft-card rounded-xl p-6 bg-[var(--bg-surface)] rotate-[1deg] space-y-5">
                {/* Clipboard Top Header */}
                <div className="flex items-center justify-between border-b-2 border-[var(--border-color)] pb-3 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                    <span className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                      DISPATCH LOG • POST 01
                    </span>
                  </div>
                  <span className="craft-badge bg-[var(--bg-surface-alt)] text-[10px]">
                    LIVE SYNC
                  </span>
                </div>

                {/* Handcrafted Stats Board with real quirky notes */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="craft-box p-3 rounded-lg bg-[var(--bg-main)]">
                    <span className="text-2xl font-bold text-[var(--text-main)] block">450+</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Uniformed Guards</span>
                  </div>
                  <div className="craft-box p-3 rounded-lg bg-[var(--bg-main)]">
                    <span className="text-2xl font-bold text-[var(--accent-terracotta)] block">120+</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Protected Sites</span>
                  </div>
                  <div className="craft-box p-3 rounded-lg bg-[var(--bg-main)]">
                    <span className="text-2xl font-bold text-[var(--text-main)] block">99.8%</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Shift Coverage</span>
                  </div>
                  <div className="craft-box p-3 rounded-lg bg-[var(--bg-main)]">
                    <span className="text-2xl font-bold text-emerald-600 block">15 Min</span>
                    <span className="text-[11px] text-[var(--text-muted)]">Mobile Backup</span>
                  </div>
                </div>

                {/* Pinned Note from Chief Dave */}
                <div className="p-3.5 rounded-lg bg-[var(--accent-mustard)]/15 border-2 border-[var(--border-color)] text-xs text-[var(--text-main)] rotate-[-1deg]">
                  <div className="font-bold flex items-center gap-1.5 font-mono text-[11px] text-[var(--accent-terracotta)] mb-1">
                    <Coffee className="w-3.5 h-3.5" /> Note from Dispatch Chief Dave:
                  </div>
                  <p className="leading-snug italic">
                    "Every guard assigned to your premises is trained on your exact floor plan before they ever set foot on duty. No rookies flying blind."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES SECTION: Asymmetric Field Deployments Roster
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="craft-badge bg-[var(--accent-terracotta)] text-white text-[11px] rotate-[-1deg]">
                DUTY ROSTERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] mt-2">
                Where We Stand Watch
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md">
              We don't offer generic "one-size-fits-all" security packages. An elementary school needs a different guard demeanor than a 30-acre cargo warehouse.
            </p>
          </div>
        </div>

        {/* Asymmetric Grid: Featured item spans 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            const isFeatured = item.featured;
            return (
              <div
                key={idx}
                onClick={() => navigate('/services')}
                className={`craft-card rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all ${
                  isFeatured ? 'md:col-span-2 bg-[var(--bg-surface-alt)]' : 'bg-[var(--bg-surface)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="craft-badge bg-[var(--bg-main)] text-[10px]">
                      {item.tag}
                    </span>
                    {isFeatured && (
                      <span className="craft-badge bg-[var(--accent-terracotta)] text-white text-[10px] animate-pulse">
                        ⚡ HIGH PRIORITY
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-mustard)] border-2 border-[var(--border-color)] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_var(--shadow-color)]">
                      <Icon className="w-5 h-5 text-[#191614] stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-main)]">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Handcrafted Guard Note on Card */}
                <div className="mt-4 pt-3 border-t-2 border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-[var(--text-muted)] italic">
                    {item.guardNote}
                  </span>
                  <span className="font-bold text-[var(--accent-terracotta)] flex items-center gap-1 shrink-0 ml-2">
                    Review Post <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE US: The Dispatch Standards Logbook
          ========================================================= */}
      <section className="bg-[var(--bg-surface-alt)] border-y-2 border-[var(--border-color)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="craft-badge bg-[var(--bg-main)] text-[11px]">
                FIELD CODE OF CONDUCT
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)]">
                Our 5 Non-Negotiable Field Rules
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Most agencies hide behind fine print. We run on a strict operational code our guards and supervisors memorize on Day 1.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  { rule: 'Rule 01', text: 'If a guard is even 5 minutes late, the roving supervisor personally fills the post.' },
                  { rule: 'Rule 02', text: '100% background and police-verified officers with state licenses on file.' },
                  { rule: 'Rule 03', text: 'VHF radio check-ins every 45 minutes on nocturnal shifts.' },
                  { rule: 'Rule 04', text: 'Guards receive living wages on time, every month. Respected guards protect better.' },
                  { rule: 'Rule 05', text: 'Instant guard replacement within 60 minutes if any client is ever unsatisfied.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="craft-box p-3 rounded-lg bg-[var(--bg-surface)] flex items-center gap-3 text-xs"
                  >
                    <span className="craft-badge bg-[var(--accent-mustard)] text-[#191614] text-[10px] shrink-0">
                      {item.rule}
                    </span>
                    <span className="font-semibold text-[var(--text-main)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asymmetric Stats & Incident Notes */}
            <div className="lg:col-span-5 space-y-4">
              <div className="craft-card p-6 rounded-xl bg-[var(--bg-surface)] space-y-4 rotate-[1deg]">
                <div className="flex items-center gap-2 border-b-2 border-[var(--border-color)] pb-3 font-mono">
                  <FileText className="w-4 h-4 text-[var(--accent-terracotta)]" />
                  <span className="font-bold text-xs uppercase text-[var(--text-main)]">
                    ANNUAL AUDIT SUMMARY
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-[var(--bg-main)]">
                    <span className="text-[var(--text-muted)]">Verified Incident-Free:</span>
                    <span className="font-bold text-[var(--text-main)] text-sm">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-[var(--bg-main)]">
                    <span className="text-[var(--text-muted)]">Active Service Years:</span>
                    <span className="font-bold text-[var(--accent-terracotta)] text-sm">12 Years</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-[var(--bg-main)]">
                    <span className="text-[var(--text-muted)]">Client Retention:</span>
                    <span className="font-bold text-emerald-600 text-sm">96.4%</span>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-muted)] italic font-mono pt-1">
                  * Note: The 0.2% non-incident was an ambitious raccoon in a corporate cafeteria who was safely relocated to the park.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CLIENT REVIEWS: Pinned Memo Testimonials
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="craft-badge bg-[var(--accent-mustard)] text-[#191614] text-[11px] rotate-[-1deg]">
              POST LOGBOOK FEEDBACK
            </span>
            <h2 className="text-3xl font-bold text-[var(--text-main)] mt-2">
              Words From Property Managers
            </h2>
          </div>
          <button
            onClick={() => navigate('/reviews')}
            className="tactile-btn px-4 py-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-main)] text-xs"
          >
            Read All Reviews &amp; Add Yours
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r, idx) => (
            <div
              key={r._id || idx}
              className={`craft-card p-6 rounded-xl bg-[var(--bg-surface)] space-y-3 ${
                idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
              }`}
            >
              <div className="flex items-center gap-1 text-[var(--accent-mustard)]">
                {[...Array(r.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--accent-mustard)]" />
                ))}
              </div>
              <h3 className="font-bold text-base text-[var(--text-main)]">
                "{r.title}"
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">
                "{r.review}"
              </p>
              <div className="pt-3 border-t-2 border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="block font-bold text-[var(--text-main)]">{r.reviewerName}</span>
                  <span className="block text-[10px] text-[var(--text-muted)]">{r.reviewerOrg}</span>
                </div>
                <span className="craft-badge bg-[var(--bg-main)] text-[10px]">
                  {r.serviceType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          BOTTOM CTA: Physical Dispatch Notice
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="craft-card rounded-2xl bg-[var(--accent-mustard)] text-[#191614] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 border-2 border-[var(--border-color)] shadow-[5px_5px_0px_var(--shadow-color)]">
          <div className="space-y-2 text-center lg:text-left">
            <span className="craft-badge bg-[#191614] text-white text-[10px] rotate-[-1deg]">
              DISPATCH LINE OPEN
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191614]">
              Need Guards On Your Property This Week?
            </h2>
            <p className="text-sm font-semibold max-w-xl text-[#191614]/80">
              We can usually survey your site within 24 hours and station licensed officers by Monday morning.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/contact')}
              className="tactile-btn px-6 py-3.5 rounded-lg bg-[#191614] text-white text-xs font-bold shadow-[3px_3px_0px_#000]"
            >
              Get Direct Quote <ArrowRight className="w-4 h-4 ml-1.5 inline" />
            </button>
            <a
              href="tel:+18005552344"
              className="tactile-btn px-5 py-3.5 rounded-lg bg-white text-[#191614] text-xs font-bold flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" />
              Call Dispatch Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
