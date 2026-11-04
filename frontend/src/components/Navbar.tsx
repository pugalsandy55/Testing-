import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  FileText,
  Sparkles,
  LayoutTemplate,
  CheckCircle2,
  Briefcase,
  FileSearch,
  User,
  Shield,
  LogOut,
  UploadCloud,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles size={22} />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">
              ATS Resume <span className="text-brand-600">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wide uppercase -mt-1">
              Enterprise Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/templates" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
            <LayoutTemplate size={16} /> Templates (1,000+)
          </Link>
          <Link to="/ats-checker" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
            <CheckCircle2 size={16} /> ATS Checker
          </Link>
          <Link to="/ai-optimizer" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
            <Sparkles size={16} /> AI Optimizer
          </Link>
          <Link to="/job-analyzer" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
            <FileSearch size={16} /> Job Matcher
          </Link>
          <Link to="/cover-letter" className="hover:text-brand-600 flex items-center gap-1.5 transition-colors">
            <Briefcase size={16} /> Cover Letters
          </Link>
          <Link to="/pricing" className="hover:text-brand-600 transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <UploadCloud size={15} /> Upload Resume
          </Link>
          
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-600/30 transition-all hover:shadow"
          >
            <FileText size={15} /> Open Editor
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <Link
                to="/dashboard"
                className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs hover:bg-brand-100 transition-colors"
                title="User Dashboard"
              >
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Admin Dashboard"
                >
                  <Shield size={18} />
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
