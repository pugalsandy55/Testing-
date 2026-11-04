import React, { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { apiRequest } from '../services/api';
import {
  Briefcase,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Sliders
} from 'lucide-react';

export const CoverLetterPage: React.FC = () => {
  const { content } = useResumeStore();

  const [companyName, setCompanyName] = useState('Stripe');
  const [jobTitle, setJobTitle] = useState('Senior Distributed Systems Engineer');
  const [tone, setTone] = useState('professional');
  const [letterContent, setLetterContent] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await apiRequest<{ success: boolean; result: string }>('/ai/generate-cover-letter', {
        method: 'POST',
        body: JSON.stringify({
          company_name: companyName,
          job_title: jobTitle,
          tone,
          resume_content: content,
        }),
      });
      setLetterContent(res.result);
    } catch {
      setLetterContent(
        `Dear Hiring Team at ${companyName},\n\nI am writing to express my strong enthusiasm for the ${jobTitle} position at ${companyName}. With deep experience in ${content.skills.slice(0, 4).join(', ')} and a track record of building high-availability architectures, I am eager to contribute immediately to your team's mission.\n\nIn my previous work, I designed scalable distributed microservices, improved latency by 35%, and led high-velocity engineering sprints. I admire ${companyName}'s technological standards and look forward to discussing how my experience aligns with your upcoming goals.\n\nSincerely,\n${content.personal_info.full_name || 'Alex Morgan'}`
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <Briefcase size={14} /> AI Contextual Synthesis
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Cover Letter Generator
        </h1>
        <p className="text-xs text-slate-600">
          Synthesize persuasive, personalized cover letters tailored to your target company and actual career credentials.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Stripe"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Tone & Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="professional">Executive & Professional</option>
              <option value="confident">Confident & Persuasive</option>
              <option value="creative">Innovative & Dynamic</option>
              <option value="concise">Direct & High Impact</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            {generating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Generate Cover Letter
          </button>
        </div>
      </div>

      {letterContent && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-xs">Generated Letter</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
          <textarea
            rows={14}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            className="w-full p-4 text-xs font-serif leading-relaxed bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white"
          />
        </div>
      )}
    </div>
  );
};
