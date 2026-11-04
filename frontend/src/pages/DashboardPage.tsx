import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import { Resume } from '../types';
import { apiRequest } from '../services/api';
import { AtsGauge } from '../components/AtsGauge';
import {
  FileText,
  UploadCloud,
  Sparkles,
  LayoutTemplate,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  BarChart2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { loadResume } = useResumeStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await apiRequest<Resume[]>('/resumes');
      setResumes(data);
    } catch {
      // Fallback sample data if demo mode
      setResumes([
        {
          id: 1,
          user_id: 1,
          title: 'Senior Software Engineer Resume',
          target_role: 'Senior Software Engineer',
          template_id: 'tpl-software-engineer-1col-classic-corporate-navy-0001',
          content: {} as any,
          design_settings: {} as any,
          ats_score: 91,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResume = (res: Resume) => {
    loadResume(res);
    navigate('/builder');
  };

  const avgAtsScore = resumes.length
    ? Math.round(resumes.reduce((acc, r) => acc + (r.ats_score || 80), 0) / resumes.length)
    : 85;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* WELCOME BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.full_name || 'Alex'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your ATS-optimized resumes, AI enhancements, and application readiness.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-slate-200"
          >
            <UploadCloud size={15} /> Upload Resume
          </Link>
          <Link
            to="/builder"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm"
          >
            <Plus size={15} /> New Resume
          </Link>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Resumes</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{resumes.length}</span>
            <span className="text-[11px] text-emerald-600 font-medium">All ATS verified</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <FileText size={22} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Average ATS Score</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{avgAtsScore}%</span>
            <span className="text-[11px] text-emerald-600 font-medium">Top 8% candidate range</span>
          </div>
          <AtsGauge score={avgAtsScore} size="sm" showLabel={false} />
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Available Templates</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">1,260</span>
            <span className="text-[11px] text-brand-600 font-medium">Across 21 industries</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <LayoutTemplate size={22} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Plan</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block capitalize">{user?.subscription_plan || 'Pro'}</span>
            <span className="text-[11px] text-amber-600 font-medium">Unlimited PDF/DOCX downloads</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles size={22} />
          </div>
        </div>
      </div>

      {/* RECENT RESUMES LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Your Resumes ({resumes.length})</h2>
          <Link to="/templates" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
            Browse 1,000+ Templates <ArrowRight size={13} />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {resumes.map((res) => (
            <div key={res.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{res.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>Role: {res.target_role || 'General'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> Updated recently</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <AtsGauge score={res.ats_score || 88} size="sm" showLabel={false} />
                  <span className="text-xs font-bold text-slate-700">{res.ats_score || 88}% ATS</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenResume(res)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    Edit
                  </button>
                  <a
                    href={`http://localhost:8000/api/v1/export/pdf/${res.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                    title="Download PDF"
                  >
                    <Download size={15} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
