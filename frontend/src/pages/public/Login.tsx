import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from '../../components/GoogleAuthButton';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role: string) => {
    switch (role) {
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
    setLoading(true);
    try {
      const { role } = await login(email, password);
      redirectByRole(role);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[var(--bg-main)] transition-colors duration-200">
      <div className="w-full max-w-md space-y-6 craft-card p-7 sm:p-8 rounded-xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] shadow-[5px_5px_0px_var(--shadow-color)]">
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-[var(--accent-mustard)] border-2 border-[var(--border-color)] flex items-center justify-center text-[#191614] mx-auto shadow-[2px_2px_0px_var(--shadow-color)] rotate-[-2deg]">
            <Shield className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
            Station Check-In
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-mono">
            Enter credentials for Admin, Guard, or Client property
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border-2 border-rose-500 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
              Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="officer@aegisshield.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-main)] text-xs pl-10 pr-4 py-2.5 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-muted)] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="tactile-btn w-full py-3 rounded-lg bg-[var(--accent-mustard)] text-[#191614] font-bold text-xs"
          >
            {loading ? 'Verifying...' : 'Authenticate & Enter Portal'} <ArrowRight className="w-4 h-4 ml-1 inline" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t-2 border-[var(--border-color)] w-full"></div>
          <span className="bg-[var(--bg-surface)] px-2.5 text-[10px] uppercase font-mono font-bold text-[var(--text-muted)]">
            OR VERIFY WITH
          </span>
          <div className="border-t-2 border-[var(--border-color)] w-full"></div>
        </div>

        {/* Real Google OAuth Button */}
        <GoogleAuthButton
          onSuccess={(userRole) => redirectByRole(userRole)}
          onError={(err) => setErrorMsg(err)}
          text="signin"
        />

        {/* Seed Credentials Pinned Memo */}
        <div className="p-3 rounded-lg bg-[var(--bg-main)] border-2 border-[var(--border-color)] text-[11px] text-[var(--text-muted)] font-mono space-y-1 rotate-[-0.5deg]">
          <span className="font-bold text-[var(--text-main)] flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-[var(--accent-terracotta)]" /> Demo Logins:
          </span>
          <div>👑 <strong>Admin:</strong> admin@securityagency.com / Password@123</div>
          <div>👮 <strong>Worker:</strong> worker1@securityagency.com / Worker@123</div>
          <div>🏢 <strong>Company:</strong> contact@abcschool.org / Company@123</div>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] font-sans">
          Need a new guard account or client login?{' '}
          <Link to="/register" className="text-[var(--accent-terracotta)] font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};
