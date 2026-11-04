import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                ATS Resume <span className="text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering job seekers worldwide with enterprise-grade ATS optimization algorithms, 1,000+ certified resume templates, and contextual AI rewriting.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 size={14} /> 100% ATS Compliant Layouts
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">Core Features</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/builder" className="hover:text-white transition-colors">Visual Resume Editor</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors">1,000+ Resume Templates</Link></li>
              <li><Link to="/ats-checker" className="hover:text-white transition-colors">ATS Resume Checker</Link></li>
              <li><Link to="/ai-optimizer" className="hover:text-white transition-colors">AI Bullet Optimizer</Link></li>
              <li><Link to="/job-analyzer" className="hover:text-white transition-colors">Job Description Matcher</Link></li>
              <li><Link to="/cover-letter" className="hover:text-white transition-colors">Cover Letter Generator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">Template Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/templates?category=software-engineer" className="hover:text-white transition-colors">Software Engineering</Link></li>
              <li><Link to="/templates?category=cybersecurity" className="hover:text-white transition-colors">Cybersecurity</Link></li>
              <li><Link to="/templates?category=data-analyst" className="hover:text-white transition-colors">Data Science & Analytics</Link></li>
              <li><Link to="/templates?category=executive" className="hover:text-white transition-colors">Executive & C-Suite</Link></li>
              <li><Link to="/templates?category=ats-friendly" className="hover:text-white transition-colors">Classic ATS Minimalist</Link></li>
              <li><Link to="/templates?category=healthcare" className="hover:text-white transition-colors">Healthcare & Clinical</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">Security & Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Your resume data is strictly isolated. We never train public foundation models on your private credentials.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400">
              <ShieldCheck size={16} /> SOC2 & GDPR Architecture Ready
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ATS Resume AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link to="/security" className="hover:text-slate-400">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
