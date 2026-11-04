import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  UploadCloud,
  LayoutTemplate,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Bot,
  Layers,
  Award
} from 'lucide-react';
import { AtsGauge } from '../components/AtsGauge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6">
          <Sparkles size={14} className="text-brand-600 animate-pulse" />
          <span>Next-Generation ATS AI Optimization Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Land 3x More Interviews With <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">ATS-Engineered</span> Resumes
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload your existing CV or build from scratch using 1,000+ certified templates. Automatically diagnose ATS parsing gaps, quantify bullet points with AI, and tailor for specific job descriptions.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.02]"
          >
            <UploadCloud size={18} /> Upload Existing Resume
          </Link>
          <Link
            to="/builder"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm transition-all"
          >
            <FileText size={18} className="text-brand-600" /> Build from Scratch
          </Link>
          <Link
            to="/templates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <LayoutTemplate size={18} /> Explore 1,000+ Templates <ArrowRight size={15} />
          </Link>
        </div>

        {/* HERO LIVE ATS AUDIT PREVIEW CARD */}
        <div className="mt-14 max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 md:p-8 text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Live ATS Diagnosis Engine</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Senior Cloud Software Engineer Resume</h3>
              <p className="text-xs text-slate-500 mt-1">Evaluated across 45 ATS structural parameters and job alignment weights</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
              <AtsGauge score={92} size="md" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-emerald-600 block">Top 5% Candidate</span>
                <span className="text-slate-500">Keyword Match: 94%</span>
                <span className="text-slate-500 block">Formatting: 100% Safe</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                <CheckCircle2 size={14} className="text-emerald-600" /> Structure & Taxonomy
              </span>
              <p className="text-emerald-800">Standard section markers detected. Contact coordinates and LinkedIn profile parse cleanly.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
              <span className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <Sparkles size={14} className="text-blue-600" /> AI Quantified Metrics
              </span>
              <p className="text-blue-800">Action verbs like <i>Orchestrated</i> and <i>Architected</i> reinforced with 35% latency gains.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <Target size={14} className="text-amber-600" /> Target Role Fit
              </span>
              <p className="text-amber-800">Matches key requirements for Kubernetes, distributed microservices, and PostgreSQL.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 1,000+ TEMPLATES TEASER BANNER */}
      <section className="bg-slate-900 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-semibold mb-4">
            <Award size={14} /> Largest Curated Collection Worldwide
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            1,000+ Programmatically Crafted Resume Templates
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm">
            Covering 21 industries from Technology and Cybersecurity to Healthcare and Academic CVs. Every template is strictly tested against leading parsing systems including Workday, Taleo, Greenhouse, and Lever.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs font-medium">
            {['Software Engineer', 'Cybersecurity', 'Data Analyst', 'Project Manager', 'Healthcare', 'Executive C-Suite', 'Finance', 'Fresher / Graduate', 'Indian Market Format', 'Academic CV'].map((cat, idx) => (
              <span key={idx} className="bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-200">
                {cat}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md"
            >
              Browse Full Template Marketplace <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* CORE 6 FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Engineered For What ATS Systems & Recruiters Care About
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Stop losing job applications to automated screening filters. Our end-to-end suite guarantees parser compatibility.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Bot size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Contextual Rewriter</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Transforms passive duties into high-impact accomplishment bullets following the XYZ formula without fabricating false details.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Transparent ATS Scoring</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Get actionable feedback on structural taxonomy, formatting pitfalls, keyword density, and missing contact coordinates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Layers size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Multi-Format Parser</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Seamlessly drag-and-drop PDF, DOCX, DOC, or TXT documents. Auto-populates the editor with automatic OCR fallback for scans.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Targeted Job Matcher</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Paste any job description to instantly detect missing keywords, required credentials, and tailoring recommendations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Live Drag-and-Drop Editor</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Real-time multi-column editing, section reordering, custom typography, spacing controls, live preview, and autosave.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pixel-Perfect Export</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Download clean, single-pass PDF and Microsoft Word DOCX files with zero hidden tables or unparseable graphics.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready To Pass Every ATS Filter?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-100 max-w-xl mx-auto">
            Join thousands of candidates who transformed their resumes and accelerated their careers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/upload"
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all"
            >
              Upload Resume (Free)
            </Link>
            <Link
              to="/builder"
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-brand-500 hover:bg-brand-400 rounded-xl border border-white/20 transition-all"
            >
              Start in Live Editor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
