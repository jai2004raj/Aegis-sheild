import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, LogIn, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Companies', path: '/companies' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'WORKER':
        return '/worker/dashboard';
      case 'COMPANY':
        return '/company/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-surface)] border-b-2 border-[var(--border-color)] transition-colors duration-200 shadow-[0_2px_0_0_var(--shadow-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with tactile badge */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-[var(--accent-mustard)] border-2 border-[var(--border-color)] flex items-center justify-center shadow-[2px_2px_0px_var(--shadow-color)] group-hover:rotate-3 transition-transform">
              <Shield className="w-6 h-6 text-[var(--border-color)] stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">
                  AEGIS <span className="underline decoration-[var(--accent-terracotta)] decoration-2">SHIELD</span>
                </span>
                <span className="hidden sm:inline-flex craft-badge bg-[var(--bg-main)] text-[10px] text-[var(--text-muted)]">
                  EST. 2014
                </span>
              </div>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">
                Field Dispatch &amp; Watch
              </span>
            </div>
          </Link>



          {/* Desktop Public Navigation Items */}
          <div className="hidden md:flex items-center gap-1.5">
            {publicLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[var(--bg-surface-alt)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] text-[var(--text-main)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-alt)] hover:border hover:border-[var(--border-color)]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="tactile-btn px-4 py-2 rounded-lg bg-[var(--accent-mustard)] text-[#191614] text-xs font-bold"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5 inline" />
                  My Portal ({user.role})
                </button>
                <button
                  onClick={logout}
                  className="tactile-btn p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-600 bg-[var(--bg-surface-alt)]"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="tactile-btn px-3.5 py-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-main)] text-xs font-bold"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1 text-[var(--accent-terracotta)] inline" />
                  Staff Login
                </Link>
                <Link
                  to="/register"
                  className="tactile-btn px-4 py-2 rounded-lg bg-[var(--accent-mustard)] text-[#191614] text-xs font-bold"
                >
                  <User className="w-3.5 h-3.5 mr-1 inline" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 transition-colors">
          {publicLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                location.pathname === link.path
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-900 space-y-2">
            {user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate(getDashboardPath());
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to Portal ({user.role})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full px-4 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold"
                >
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
