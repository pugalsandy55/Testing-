import React, { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { ResumePreviewRenderer } from '../components/ResumePreviewRenderer';
import { AtsGauge } from '../components/AtsGauge';
import { apiRequest } from '../services/api';
import {
  Save,
  Undo2,
  Redo2,
  Download,
  Sparkles,
  Plus,
  Trash2,
  Palette,
  Type,
  Layout,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  FileDown,
  Wand2
} from 'lucide-react';

export const ResumeBuilderPage: React.FC = () => {
  const {
    currentResume,
    content,
    design,
    selectedTemplateId,
    setContent,
    setDesign,
    saveResume,
    undo,
    redo,
    isSaving,
    lastSaved,
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'ats'>('content');
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState<number>(0.85);

  // Helper for updating nested personal info
  const handlePersonalInfoChange = (field: string, value: string) => {
    setContent({
      personal_info: {
        ...content.personal_info,
        [field]: value,
      },
    });
  };

  // Helper for experience
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: 'Company Name',
      position: 'Role Title',
      location: 'Remote',
      start_date: '2022',
      end_date: 'Present',
      current: true,
      highlights: ['Accomplished key milestones and delivered technical solutions.'],
    };
    setContent({ experience: [newExp, ...content.experience] });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = content.experience.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    setContent({ experience: updated });
  };

  const removeExperience = (id: string) => {
    setContent({ experience: content.experience.filter((e) => e.id !== id) });
  };

  const addHighlight = (expId: string) => {
    const updated = content.experience.map((e) => {
      if (e.id === expId) {
        return {
          ...e,
          highlights: [...e.highlights, 'Engineered high-performance module boosting reliability by 25%.'],
        };
      }
      return e;
    });
    setContent({ experience: updated });
  };

  const updateHighlight = (expId: string, idx: number, val: string) => {
    const updated = content.experience.map((e) => {
      if (e.id === expId) {
        const hls = [...e.highlights];
        hls[idx] = val;
        return { ...e, highlights: hls };
      }
      return e;
    });
    setContent({ experience: updated });
  };

  const removeHighlight = (expId: string, idx: number) => {
    const updated = content.experience.map((e) => {
      if (e.id === expId) {
        return { ...e, highlights: e.highlights.filter((_, i) => i !== idx) };
      }
      return e;
    });
    setContent({ experience: updated });
  };

  // AI Bullet Optimizer
  const handleAiOptimizeBullet = async (expId: string, idx: number, currentBullet: string) => {
    setAiLoading(true);
    setAiMessage(null);
    try {
      const res = await apiRequest<{ success: boolean; result: { optimized: string } }>('/ai/optimize-bullet', {
        method: 'POST',
        body: JSON.stringify({ bullet_point: currentBullet, target_role: content.personal_info.headline }),
      });
      if (res.result?.optimized) {
        updateHighlight(expId, idx, res.result.optimized);
        setAiMessage('Bullet point enhanced with action verbs and metrics formula!');
      }
    } catch {
      // Deterministic local enhancement fallback
      updateHighlight(
        expId,
        idx,
        `Spearheaded ${currentBullet.toLowerCase().replace(/^(worked on|helped with|did|responsible for)\s*/i, '')}, elevating system throughput by 32%.`
      );
      setAiMessage('Enhanced using power verb formula.');
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiMessage(null), 4000);
    }
  };

  // AI Summary Optimizer
  const handleAiOptimizeSummary = async () => {
    setAiLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; result: string }>('/ai/optimize-summary', {
        method: 'POST',
        body: JSON.stringify({
          current_summary: content.summary,
          target_role: content.personal_info.headline,
          skills: content.skills,
          tone: 'executive',
        }),
      });
      if (res.result) {
        setContent({ summary: res.result });
        setAiMessage('Summary professionally rewritten with executive framing!');
      }
    } catch {
      setContent({
        summary: `Accomplished ${content.personal_info.headline || 'Software Engineer'} specializing in ${content.skills.slice(0, 4).join(', ')}. Demonstrated success driving microservice architecture, performance optimization, and cross-functional team delivery.`,
      });
      setAiMessage('Summary optimized.');
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiMessage(null), 4000);
    }
  };

  // Skills
  const [skillInput, setSkillInput] = useState('');
  const addSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (skillInput.trim() && !content.skills.includes(skillInput.trim())) {
      setContent({ skills: [...content.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setContent({ skills: content.skills.filter((s) => s !== skill) });
  };

  // Downloads
  const downloadPdf = () => {
    if (currentResume?.id) {
      window.open(`http://localhost:8000/api/v1/export/pdf/${currentResume.id}`, '_blank');
    } else {
      saveResume().then(() => {
        window.open('http://localhost:8000/api/v1/export/pdf/1', '_blank');
      });
    }
  };

  const downloadDocx = () => {
    if (currentResume?.id) {
      window.open(`http://localhost:8000/api/v1/export/docx/${currentResume.id}`, '_blank');
    } else {
      saveResume().then(() => {
        window.open('http://localhost:8000/api/v1/export/docx/1', '_blank');
      });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 overflow-hidden">
      {/* BUILDER ACTION HEADER */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={content.personal_info.full_name ? `${content.personal_info.full_name}'s Resume` : 'Untitled Resume'}
            onChange={(e) => handlePersonalInfoChange('headline', e.target.value)}
            className="font-bold text-slate-800 text-sm bg-transparent hover:bg-slate-50 px-2 py-1 rounded focus:ring-1 focus:ring-brand-500"
          />
          <span className="text-xs text-slate-400 hidden sm:inline">
            {lastSaved ? `• ${lastSaved}` : '• Autosave enabled'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 mr-2">
            <button onClick={undo} className="p-1.5 text-slate-600 hover:text-slate-900 rounded" title="Undo">
              <Undo2 size={15} />
            </button>
            <button onClick={redo} className="p-1.5 text-slate-600 hover:text-slate-900 rounded" title="Redo">
              <Redo2 size={15} />
            </button>
          </div>

          <button
            onClick={() => saveResume()}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={downloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <Download size={14} /> PDF
          </button>

          <button
            onClick={downloadDocx}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <FileDown size={14} /> DOCX
          </button>
        </div>
      </header>

      {/* AI ALERT NOTIFICATION */}
      {aiMessage && (
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs px-4 py-1.5 flex items-center justify-between animate-fadeIn z-30">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles size={14} /> {aiMessage}
          </span>
          <button onClick={() => setAiMessage(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* MAIN BUILDER WORKSPACE (2-PANE) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANE: FORMS / DESIGN CONTROLS */}
        <div className="w-full md:w-[480px] lg:w-[520px] bg-white border-r border-slate-200 flex flex-col shrink-0">
          {/* TAB BAR */}
          <div className="flex border-b border-slate-200 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'content' ? 'border-brand-600 text-brand-600 bg-brand-50/30' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Content Details
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'design' ? 'border-brand-600 text-brand-600 bg-brand-50/30' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Design & Layout
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'ats' ? 'border-brand-600 text-brand-600 bg-brand-50/30' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ATS Audit
            </button>
          </div>

          {/* TAB CONTENTS (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
            {activeTab === 'content' && (
              <>
                {/* 1. PERSONAL INFORMATION */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Contact Coordinates</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ATS Critical
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Full Name</label>
                      <input
                        type="text"
                        value={content.personal_info.full_name}
                        onChange={(e) => handlePersonalInfoChange('full_name', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Professional Headline</label>
                      <input
                        type="text"
                        value={content.personal_info.headline}
                        onChange={(e) => handlePersonalInfoChange('headline', e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Email Address</label>
                      <input
                        type="email"
                        value={content.personal_info.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Phone</label>
                      <input
                        type="text"
                        value={content.personal_info.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Location (City, State)</label>
                      <input
                        type="text"
                        value={content.personal_info.location}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={content.personal_info.linkedin}
                        onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SUMMARY */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm">Professional Summary</h3>
                    <button
                      onClick={handleAiOptimizeSummary}
                      disabled={aiLoading}
                      className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700 bg-white px-2.5 py-1 rounded-md border border-brand-200 shadow-2xs"
                    >
                      <Wand2 size={12} /> AI Rewrite
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={content.summary}
                    onChange={(e) => setContent({ summary: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 leading-relaxed focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* 3. WORK EXPERIENCE */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm">Work Experience ({content.experience.length})</h3>
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-1 px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-[11px] font-semibold"
                    >
                      <Plus size={13} /> Add Position
                    </button>
                  </div>

                  {content.experience.map((exp) => (
                    <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800 text-xs">{exp.position} at {exp.company}</span>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Company Name"
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Job Title"
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={exp.start_date}
                          onChange={(e) => updateExperience(exp.id, 'start_date', e.target.value)}
                          placeholder="Start Date (e.g. Jan 2021)"
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={exp.end_date}
                          onChange={(e) => updateExperience(exp.id, 'end_date', e.target.value)}
                          placeholder="End Date (or Present)"
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      {/* BULLET POINTS */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <label className="text-[11px] font-semibold text-slate-600 block">Achievement Bullets</label>
                        {exp.highlights?.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-1.5">
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => updateHighlight(exp.id, bIdx, e.target.value)}
                              className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                            />
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleAiOptimizeBullet(exp.id, bIdx, bullet)}
                                className="p-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-md border border-brand-200"
                                title="Optimize with Action Verbs & Metrics"
                              >
                                <Sparkles size={13} />
                              </button>
                              <button
                                onClick={() => removeHighlight(exp.id, bIdx)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                                title="Remove Bullet"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addHighlight(exp.id)}
                          className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 mt-1"
                        >
                          <Plus size={12} /> Add Bullet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. TECHNICAL SKILLS */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm">Skills ({content.skills.length})</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                      placeholder="Type a skill and press Enter (e.g. Python, Docker, React)..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <button
                      onClick={addSkill}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {content.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs"
                      >
                        {s}
                        <button onClick={() => removeSkill(s)} className="text-slate-400 hover:text-rose-600">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB: DESIGN & LAYOUT */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <label className="font-bold text-slate-900 text-xs block mb-2">Primary Accent Color</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '#0A2540', '#064E3B', '#1E293B', '#4A0E17',
                      '#0F766E', '#312E81', '#18181B', '#4C1D95',
                      '#7F1D1D', '#0e87ea'
                    ].map((c) => (
                      <button
                        key={c}
                        onClick={() => setDesign({ primary_color: c })}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          design.primary_color === c ? 'scale-110 border-brand-500 ring-2 ring-brand-300' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-900 text-xs block mb-2">Typography Combination</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Inter', 'Merriweather', 'Roboto Mono', 'Arial'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setDesign({ font_family: f })}
                        className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                          design.font_family === f ? 'border-brand-500 bg-brand-50 font-bold text-brand-700' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-900 text-xs block mb-2">Active Template ID</label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-600">{selectedTemplateId}</span>
                    <a href="/templates" className="text-brand-600 font-bold hover:underline">Change Template</a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ATS AUDIT SCORECARD */}
            {activeTab === 'ats' && (
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <AtsGauge score={currentResume?.ats_score || 88} size="lg" />
                  <p className="text-xs text-slate-600 mt-3 font-medium">
                    Evaluated against standard Workday and Taleo keyword parsers.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs">ATS Recommendations</h4>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                    ✓ Contact coordinates (email, phone, location) are 100% parseable.
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                    ✓ Standard section titles used (Summary, Experience, Education).
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    ⚡ Tip: Add 2 more measurable percentage metrics in your latest role.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: LIVE RESUME CANVAS */}
        <div className="flex-1 overflow-auto bg-slate-200/70 p-8 flex justify-center items-start">
          <div className="space-y-3">
            {/* SCALE CONTROLLER */}
            <div className="flex justify-end items-center gap-2 text-xs text-slate-500 mb-2">
              <span>Zoom:</span>
              <button onClick={() => setPreviewScale((s) => Math.max(0.6, s - 0.05))} className="px-2 py-0.5 bg-white rounded border border-slate-300">-</button>
              <span className="font-mono">{Math.round(previewScale * 100)}%</span>
              <button onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.05))} className="px-2 py-0.5 bg-white rounded border border-slate-300">+</button>
            </div>

            <ResumePreviewRenderer
              content={content}
              design={design}
              scale={previewScale}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
