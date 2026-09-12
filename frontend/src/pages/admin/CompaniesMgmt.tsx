import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  Send,
} from 'lucide-react';
import api from '../../services/api';
import { Company, OrganizationType } from '../../types';
import { Header } from '../../components/Header';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';

export const CompaniesMgmt: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [organizationType, setOrganizationType] = useState<OrganizationType>('Company');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Company@123');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metropolis');
  const [state, setState] = useState('NY');
  const [requiredWorkers, setRequiredWorkers] = useState(5);
  const [requiredShift, setRequiredShift] = useState('Day & Night (24x7)');

  // Post-Registration Credentials Modal State
  const [createdCredentials, setCreatedCredentials] = useState<{
    companyId: string;
    name: string;
    contactPerson: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
    organizationType?: string;
    loginUrl?: string;
  } | null>(null);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [showCredPassword, setShowCredPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data.companies || []);
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let randomPass = 'Comp@';
    for (let i = 0; i < 4; i++) {
      randomPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    randomPass += '!';
    setPassword(randomPass);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/companies', {
        name,
        organizationType,
        contactPerson,
        email,
        phone,
        password,
        address,
        city,
        state,
        requiredWorkers,
        requiredShift,
      });

      setIsAddModalOpen(false);
      fetchCompanies();

      // Display login credentials modal and email notification
      if (res.data.credentials) {
        setCreatedCredentials(res.data.credentials);
        setIsCredentialsModalOpen(true);
      }

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setContactPerson('');
      setAddress('');
      setPassword('Company@123');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating company.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company record?')) return;
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting company.');
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const copyAllCredentials = () => {
    if (!createdCredentials) return;
    const text = `🛡️ SECURITY AGENCY WORKFORCE ALLOCATION PLATFORM
========================================
CLIENT ORGANIZATION LOGIN CREDENTIALS
========================================
Company Name:     ${createdCredentials.name}
Company ID:       ${createdCredentials.companyId}
Contact Person:   ${createdCredentials.contactPerson}
Sector / Type:    ${createdCredentials.organizationType || 'Client'}
System Role:      ${createdCredentials.role}
Email / Username: ${createdCredentials.email}
Temporary Password: ${createdCredentials.password}
Login Portal:     ${window.location.origin}/login
========================================
Please change your password upon your first login.`;
    copyToClipboard(text, 'all');
  };

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.companyId.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || c.organizationType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Company & Client Directory" subtitle="Manage client organizations, required workforce capacity, and duty contracts" />

      <div className="px-6 max-w-7xl mx-auto space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search company, ID, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-slate-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Sectors</option>
              <option value="School">School</option>
              <option value="College">College</option>
              <option value="Company">Company</option>
              <option value="Apartment">Apartment</option>
              <option value="Hospital">Hospital</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Mall">Mall</option>
              <option value="Factory">Factory</option>
              <option value="Office">Office</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Register New Company
          </button>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div key={c._id} className="glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/20">
                    {c.companyId}
                  </span>
                  <Badge status={c.status} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  <span className="text-xs text-amber-400 font-semibold">{c.organizationType} Sector</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {c.address}, {c.city}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {c.phone} ({c.contactPerson})
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" /> {c.email}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">Deployed Guards</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      {(c as any).activeWorkersCount ?? 0} / {c.requiredWorkers} Required
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Shift Timing</span>
                    <span className="font-semibold text-slate-200">{c.requiredShift}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                    title="Delete Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Company Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Client Organization">
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="Apex Tech Towers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Organization Type *</label>
              <select
                value={organizationType}
                onChange={(e) => setOrganizationType(e.target.value as any)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="Company">Company</option>
                <option value="Apartment">Apartment</option>
                <option value="Hospital">Hospital</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Mall">Mall</option>
                <option value="Factory">Factory</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Contact Person *</label>
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Official Email *</label>
              <input
                type="email"
                required
                placeholder="security@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Required Security Guards *</label>
              <input
                type="number"
                required
                min={1}
                value={requiredWorkers}
                onChange={(e) => setRequiredWorkers(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Initial Password Setting */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Initial Login Password *
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Auto-Generate
              </button>
            </div>
            <div className="relative">
              <input
                type={showFormPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Company@123"
                className="w-full bg-slate-950 text-xs p-3 pr-10 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowFormPassword(!showFormPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              These credentials will be displayed immediately upon registration and sent to the registered email.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Street Address *</label>
            <input
              type="text"
              required
              placeholder="800 Innovation Blvd, Tech Corridor"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            Register Client Organization
          </button>
        </form>
      </Modal>

      {/* Post-Registration Credentials & Email Dispatch Modal */}
      {createdCredentials && (
        <Modal
          isOpen={isCredentialsModalOpen}
          onClose={() => setIsCredentialsModalOpen(false)}
          title="Company Registration Complete"
        >
          <div className="space-y-5">
            {/* Header Success & Email Notification Banner */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-xs">Client Organization Created Successfully!</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  Credentials dispatched to: <strong className="text-white">{createdCredentials.email}</strong>
                </p>
              </div>
            </div>

            {/* Organization Overview Summary */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-extrabold text-xl flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{createdCredentials.name}</h3>
                <p className="text-xs text-amber-400 font-mono font-semibold">{createdCredentials.companyId}</p>
                <p className="text-[11px] text-slate-400">
                  Contact: {createdCredentials.contactPerson} • {createdCredentials.organizationType || 'Client'} Sector
                </p>
              </div>
            </div>

            {/* Credentials Card */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Portal Login Credentials
              </h4>

              {/* System Role */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">System Role:</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-bold text-[10px] border border-blue-500/30">
                  {createdCredentials.role}
                </span>
              </div>

              {/* Email / Username */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Official Email / Login Username</span>
                  <span className="font-mono font-bold text-white text-xs">{createdCredentials.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdCredentials.email, 'email')}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                  title="Copy email"
                >
                  {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Login Password</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    {showCredPassword ? createdCredentials.password : '••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowCredPassword(!showCredPassword)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    title={showCredPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                    title="Copy password"
                  >
                    {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Portal Link */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Portal Login URL</span>
                  <span className="font-mono text-slate-300 text-[11px]">{window.location.origin}/login</span>
                </div>
                <a
                  href="/login"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                  title="Open login page in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={copyAllCredentials}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                {copiedField === 'all' ? (
                  <>
                    <Check className="w-4 h-4" /> Credentials Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy All Credentials
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsCredentialsModalOpen(false)}
                className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
