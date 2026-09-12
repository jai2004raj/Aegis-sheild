import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  Search,
  School,
  Hospital,
  ShoppingBag,
  Building,
  Warehouse,
  ArrowRight,
  Clock,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import api from '../../services/api';
import { Company } from '../../types';

// Curated default partner organizations with dedicated sector images
const DEFAULT_PARTNER_COMPANIES: Array<Partial<Company> & { image: string; tag: string; responseSla: string }> = [
  {
    _id: 'default_comp_1',
    companyId: 'SEC-C101',
    name: 'Orion Global Enterprise Headquarters',
    organizationType: 'Company',
    tag: 'Corporate Campus',
    city: 'Metropolis',
    state: 'NY',
    address: '100 Innovation Blvd, Tech Corridor',
    phone: '+1 (555) 876-5432',
    requiredWorkers: 12,
    activeWorkersCount: 12,
    requiredShift: '24x7 Rotating Shift',
    image: '/images/corporate-hq.jpg',
    responseSla: '< 10 Mins',
  },
  {
    _id: 'default_comp_2',
    companyId: 'SEC-C102',
    name: 'Metropolis Central University & High School',
    organizationType: 'School',
    tag: 'Educational Safety',
    city: 'Metropolis',
    state: 'NY',
    address: '124 Education Avenue, Knowledge Park',
    phone: '+1 (555) 234-5678',
    requiredWorkers: 8,
    activeWorkersCount: 8,
    requiredShift: 'Day & Evening Guarding',
    image: '/images/school.jpg',
    responseSla: '< 8 Mins',
  },
  {
    _id: 'default_comp_3',
    companyId: 'SEC-C103',
    name: 'CityCare General & Trauma Hospital',
    organizationType: 'Hospital',
    tag: 'Healthcare Security',
    city: 'Metropolis',
    state: 'NY',
    address: '50 Health Care Drive, Medical Zone',
    phone: '+1 (555) 345-6789',
    requiredWorkers: 10,
    activeWorkersCount: 10,
    requiredShift: '24x7 Emergency Guarding',
    image: '/images/hospital.jpg',
    responseSla: '< 5 Mins',
  },
  {
    _id: 'default_comp_4',
    companyId: 'SEC-C104',
    name: 'The Veridian Luxury Heights & Gated Estate',
    organizationType: 'Apartment',
    tag: 'Gated Community',
    city: 'Metropolis',
    state: 'NY',
    address: '450 Waterfront Drive, Bay Area',
    phone: '+1 (555) 987-1234',
    requiredWorkers: 6,
    activeWorkersCount: 6,
    requiredShift: 'Night Patrol & Gate Guard',
    image: '/images/residence.jpg',
    responseSla: '< 12 Mins',
  },
  {
    _id: 'default_comp_5',
    companyId: 'SEC-C105',
    name: 'The Pavilion Grand Mall & Retail Atrium',
    organizationType: 'Mall',
    tag: 'Retail & Commercial',
    city: 'Metropolis',
    state: 'NY',
    address: '99 Commercial Plaza, Downtown',
    phone: '+1 (555) 654-3210',
    requiredWorkers: 8,
    activeWorkersCount: 8,
    requiredShift: 'Day & Evening Shift',
    image: '/images/mall.jpg',
    responseSla: '< 10 Mins',
  },
  {
    _id: 'default_comp_6',
    companyId: 'SEC-C106',
    name: 'Apex E-Commerce Fulfillment & Cargo Hub',
    organizationType: 'Warehouse',
    tag: 'Logistics Distribution',
    city: 'Metropolis',
    state: 'NY',
    address: '770 Industrial Parkway, Logistics Zone',
    phone: '+1 (555) 432-1098',
    requiredWorkers: 14,
    activeWorkersCount: 14,
    requiredShift: '24x7 Round-The-Clock',
    image: '/images/warehouse.jpg',
    responseSla: '< 15 Mins',
  },
  {
    _id: 'default_comp_7',
    companyId: 'SEC-C107',
    name: 'St. Jude International STEM Academy',
    organizationType: 'School',
    tag: 'Private Campus',
    city: 'Metropolis',
    state: 'NY',
    address: '320 Scholars Way, North Hill',
    phone: '+1 (555) 765-4321',
    requiredWorkers: 6,
    activeWorkersCount: 6,
    requiredShift: 'Day Patrol & Gate Entry',
    image: '/images/school.jpg',
    responseSla: '< 7 Mins',
  },
  {
    _id: 'default_comp_8',
    companyId: 'SEC-C108',
    name: 'Meridian Heights Luxury Residences',
    organizationType: 'Apartment',
    tag: 'Residential Tower',
    city: 'Metropolis',
    state: 'NY',
    address: '880 Skyline Avenue, Uptown',
    phone: '+1 (555) 888-9900',
    requiredWorkers: 5,
    activeWorkersCount: 5,
    requiredShift: '24x7 Concierge Security',
    image: '/images/residence.jpg',
    responseSla: '< 10 Mins',
  },
];

export const Companies: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>(DEFAULT_PARTNER_COMPANIES);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/companies')
      .then((res) => {
        const fetched = res.data.companies || [];
        if (fetched.length > 0) {
          // Merge fetched with curated metadata image mapper
          const merged = fetched.map((comp: any) => {
            let img = '/images/corporate-hq.jpg';
            let tag = 'Commercial Partner';
            const type = (comp.organizationType || '').toLowerCase();
            if (type.includes('school')) {
              img = '/images/school.jpg';
              tag = 'Educational Safety';
            } else if (type.includes('hospital')) {
              img = '/images/hospital.jpg';
              tag = 'Healthcare Facility';
            } else if (type.includes('apartment') || type.includes('residential')) {
              img = '/images/residence.jpg';
              tag = 'Gated Community';
            } else if (type.includes('mall')) {
              img = '/images/mall.jpg';
              tag = 'Retail & Mall';
            } else if (type.includes('warehouse') || type.includes('industrial')) {
              img = '/images/warehouse.jpg';
              tag = 'Logistics Hub';
            }

            return {
              ...comp,
              image: img,
              tag,
              responseSla: comp.responseSla || '< 12 Mins',
            };
          });

          // If fewer than 4 from backend, supplement with default companies
          const combined = [...merged];
          DEFAULT_PARTNER_COMPANIES.forEach((def) => {
            if (!combined.some((c) => c.name.toLowerCase() === def.name?.toLowerCase())) {
              combined.push(def);
            }
          });
          setCompanies(combined);
        } else {
          setCompanies(DEFAULT_PARTNER_COMPANIES);
        }
      })
      .catch(() => {
        setCompanies(DEFAULT_PARTNER_COMPANIES);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getSectorIcon = (type: string) => {
    switch ((type || '').toLowerCase()) {
      case 'school':
        return <School className="w-4 h-4" />;
      case 'hospital':
        return <Hospital className="w-4 h-4" />;
      case 'apartment':
        return <Building className="w-4 h-4" />;
      case 'mall':
        return <ShoppingBag className="w-4 h-4" />;
      case 'warehouse':
        return <Warehouse className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const filtered = companies.filter((c) => {
    const matchSearch =
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.organizationType || '').toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || (c.organizationType || '').toLowerCase() === filterType.toLowerCase();
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 transition-colors duration-200">
      {/* Hero Banner with Corporate HQ Backdrop */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8 sm:p-14 text-center space-y-4 shadow-sm">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/corporate-hq.jpg"
            alt="Corporate Partner Headquarters"
            className="w-full h-full object-cover object-center opacity-10 dark:opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-slate-50/70 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/60 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-transparent to-slate-50/90 dark:from-slate-950/90 dark:via-transparent dark:to-slate-950/90"></div>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" /> 120+ Active Partner Organizations
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Trusted Organizations Protected By{' '}
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text text-transparent">
            Aegis Shield
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          From multi-tenant corporate tech parks and prestigious university campuses to trauma healthcare centers and gated luxury communities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search company, city, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { id: '', label: 'All Sectors' },
            { id: 'Company', label: 'Corporate' },
            { id: 'School', label: 'Schools & Campuses' },
            { id: 'Hospital', label: 'Hospitals' },
            { id: 'Mall', label: 'Malls & Retail' },
            { id: 'Apartment', label: 'Residential' },
            { id: 'Warehouse', label: 'Logistics Hubs' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType.toLowerCase() === type.id.toLowerCase()
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-amber-600 dark:text-amber-400 font-bold">{filtered.length}</strong> verified client organizations
        </span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" /> 100% Active Guard Stations
        </span>
      </div>

      {/* Dynamic Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map((c) => (
          <div
            key={c._id || c.companyId}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            {/* Sector Photo Header */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
              <img
                src={c.image || '/images/corporate-hq.jpg'}
                alt={c.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

              {/* Floating Sector Badge */}
              <div className="absolute top-3.5 left-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-amber-700 dark:text-amber-400 text-[11px] font-bold border border-amber-500/30 shadow-sm">
                  {getSectorIcon(c.organizationType)}
                  {c.tag || c.organizationType}
                </span>
              </div>

              {/* Verified Badge */}
              <div className="absolute top-3.5 right-3.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Active Client
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{c.address || `${c.city}, ${c.state}`}</span>
                </p>
              </div>

              {/* Security Metrics */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Security Force</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1.5 mt-0.5">
                    <Users className="w-3.5 h-3.5" /> {c.activeWorkersCount || c.requiredWorkers || 6} Guards
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Response SLA</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> {c.responseSla || '< 10 Mins'}
                  </span>
                </div>
              </div>

              {/* Shift info & CTA */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="truncate max-w-[170px]">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Coverage</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold truncate block">
                    {c.requiredShift || '24x7 Security Guarding'}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/contact?org=${encodeURIComponent(c.name)}`)}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-500 dark:bg-amber-500/10 dark:hover:bg-amber-500 text-amber-700 hover:text-slate-950 dark:text-amber-400 dark:hover:text-slate-950 border border-amber-200 dark:border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  Inquire <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Callout */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Want to secure your facility with Aegis Shield?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            We deploy specialized security workforce for corporations, schools, healthcare hubs, retail centers, and residential developments within 24 hours.
          </p>
        </div>
        <button
          onClick={() => navigate('/contact')}
          className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all shrink-0"
        >
          Request Security Proposal <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
