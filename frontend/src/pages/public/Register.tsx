import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, Phone, Building, AlertCircle, ArrowRight, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from '../../components/GoogleAuthButton';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'COMPANY' | 'WORKER'>('COMPANY');
  const [organizationType, setOrganizationType] = useState('Company');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectByRole = (userRole: string) => {
    switch (userRole) {
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'WORKER':
        navigate('/worker/dashboard');
        break;
      case 'COMPANY':
        navigate('/company/dashboard');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { role: userRole } = await registerUser({
        name,
        email,
        phone,
        password,
        role,
        organizationType,
      });
      redirectByRole(userRole);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[var(--bg-main)] transition-colors duration-200">
      <div className="w-full max-w-lg space-y-6 craft-card p-7 sm:p-9 rounded-xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] shadow-[5px_5px_0px_var(--shadow-color)]">
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-[var(--accent-mustard)] border-2 border-[var(--border-color)] flex items-center justify-center text-[#191614] mx-auto shadow-[2px_2px_0px_var(--shadow-color)] rotate-[1.5deg]">
            <ClipboardCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Enlist In The Dispatch Net
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-mono">
            Register as a Client Organization, Field Officer, or Private Client
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border-2 border-rose-500 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selection */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 font-mono">
              ROLE CLASSIFICATION:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'COMPANY', label: 'Company/Site' },
                { id: 'WORKER', label: 'Guard/Staff' },
                { id: 'CUSTOMER', label: 'Client User' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id as any)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all border-2 border-[var(--border-color)] ${
                    role === item.id
                      ? 'bg-[var(--accent-mustard)] text-[#191614] shadow-[2px_2px_0px_var(--shadow-color)]'
                      : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-alt)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
              Full Name / Contact Person *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="Capt. John Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--bg-main)] text-xs pl-10 pr-4 py-2.5 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-muted)] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="miller@facility.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-main)] text-xs pl-10 pr-4 py-2.5 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-muted)] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[var(--bg-main)] text-xs pl-10 pr-4 py-2.5 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-muted)] font-mono"
                />
              </div>
            </div>
          </div>

          {role === 'COMPANY' && (
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                Property / Organization Type
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                <select
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  className="w-full bg-[var(--bg-main)] text-xs pl-10 pr-4 py-2.5 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:shadow-[2px_2px_0px_var(--border-color)] font-mono"
                >
                  <option value="School">School / Campus</option>
                  <option value="College">College / University</option>
                  <option value="Company">Corporate Company</option>
                  <option value="Apartment">Apartment / Gated Community</option>
                  <option value="Hospital">Hospital / Healthcare</option>
                  <option value="Warehouse">Warehouse / Logistics</option>
                  <option value="Mall">Shopping Mall</option>
                  <option value="Factory">Factory / Heavy Industry</option>
                  <option value="Office">Office Building</option>
                  <option value="Other">Other Organization</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg-main)] text-xs pl-10 pr-4 py-2.5 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-muted)] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[var(--bg-main)] text-xs pl-10 pr-4 py-2.5 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-muted)] font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="tactile-btn w-full py-3 rounded-lg bg-[var(--accent-mustard)] text-[#191614] font-bold text-xs"
          >
            {loading ? 'Registering...' : 'Create Verified Account'} <ArrowRight className="w-4 h-4 ml-1 inline" />
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t-2 border-[var(--border-color)] w-full"></div>
          <span className="bg-[var(--bg-surface)] px-2.5 text-[10px] uppercase font-mono font-bold text-[var(--text-muted)]">
            OR ENLIST WITH
          </span>
          <div className="border-t-2 border-[var(--border-color)] w-full"></div>
        </div>

        <GoogleAuthButton
          role={role}
          onSuccess={(userRole) => redirectByRole(userRole)}
          onError={(err) => setErrorMsg(err)}
          text="signup"
        />

        <p className="text-center text-xs text-[var(--text-muted)] font-sans">
          Already have a station account?{' '}
          <Link to="/login" className="text-[var(--accent-terracotta)] font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
