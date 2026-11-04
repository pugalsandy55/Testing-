import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Check, Sparkles, Shield, Star, Zap } from 'lucide-react';

export const SubscriptionPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for early exploration and single-resume drafting.',
      features: [
        '1 Active Resume Draft',
        'Standard ATS-Safe Templates',
        'Basic ATS Structure Audit',
        'Standard PDF Export',
      ],
      current: user?.subscription_plan === 'free',
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
    },
    {
      name: 'Professional',
      price: selectedCycle === 'yearly' ? '$12' : '$19',
      period: 'per month, billed annually',
      popular: true,
      description: 'Everything you need to apply, optimize, and land interviews.',
      features: [
        'Unlimited Active Resumes',
        'Access to All 1,000+ Resume Templates',
        'Unlimited AI Rewriting & XYZ Bullet Enhancement',
        'Deep ATS Keyword Scoring & Gap Analysis',
        'Job Description Targeted Matcher',
        'High-Resolution PDF & Microsoft Word DOCX Export',
        'Instant AI Cover Letter Generator',
      ],
      current: user?.subscription_plan === 'pro',
      buttonText: 'Upgrade to Professional',
      buttonVariant: 'primary',
    },
    {
      name: 'Enterprise / Teams',
      price: selectedCycle === 'yearly' ? '$49' : '$69',
      period: 'per month',
      description: 'For university career centers, teams, and recruitment consultants.',
      features: [
        'Everything in Professional',
        'Bulk Multi-Candidate Parsing (OCR Batch)',
        'Custom Branded University / Firm Templates',
        'Team Management & Role Permissions',
        'Dedicated API Access & Priority Processing',
        'Dedicated SLA & Success Manager',
      ],
      current: user?.subscription_plan === 'enterprise',
      buttonText: 'Contact Enterprise Sales',
      buttonVariant: 'dark',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <Sparkles size={14} /> Transparent & Flexible Plans
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Accelerate Your Career with ATS Pro
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Get unlimited access to 1,000+ ATS-certified templates, AI powered accomplishment rewrites, and instant DOCX/PDF downloads.
        </p>

        {/* BILLING TOGGLE */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setSelectedCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              selectedCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedCycle('yearly')}
            className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              selectedCycle === 'yearly' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Yearly <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">Save 35%</span>
          </button>
        </div>
      </div>

      {/* PLANS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl p-8 bg-white border flex flex-col justify-between transition-all duration-300 ${
              p.popular
                ? 'border-brand-500 shadow-2xl ring-2 ring-brand-500/20 md:-translate-y-2'
                : 'border-slate-200 shadow-sm hover:border-slate-300'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.description}</p>
              </div>

              <div className="pt-2">
                <span className="text-4xl font-extrabold text-slate-900">{p.price}</span>
                <span className="text-xs text-slate-500 ml-1.5">{p.period}</span>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <span className="text-xs font-bold text-slate-900 block">Plan Highlights:</span>
                {p.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check size={14} className="text-brand-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  p.buttonVariant === 'primary'
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25'
                    : p.buttonVariant === 'dark'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
