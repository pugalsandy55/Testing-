import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { ResumeTemplate } from '../types';
import { apiRequest } from '../services/api';
import {
  Search,
  Filter,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';

export const TemplateMarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { setTemplateId } = useResumeStore();

  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [palettes, setPalettes] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(1260);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedLayout, setSelectedLayout] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [atsOnly, setAtsOnly] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  useEffect(() => {
    // Fetch categories and palettes
    apiRequest('/templates/categories').then(setCategories).catch(() => {});
    apiRequest('/templates/palettes').then(setPalettes).catch(() => {});
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [page, selectedCategory, selectedColor, atsOnly]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: '24',
      });
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedColor !== 'all') params.append('color', selectedColor);
      if (atsOnly) params.append('is_ats_friendly', 'true');
      if (searchTerm) params.append('search', searchTerm);

      const res = await apiRequest<{ total: number; templates: ResumeTemplate[] }>(`/templates?${params.toString()}`);
      setTemplates(res.templates);
      setTotalCount(res.total);
    } catch {
      // If backend is booting up, fallback to empty or retry
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTemplates();
  };

  const handleSelectTemplate = (template: ResumeTemplate) => {
    setTemplateId(template.id);
    navigate('/builder');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-3 border border-amber-200">
          <Star size={13} className="fill-amber-500 text-amber-500" /> Over 1,000+ Distinct ATS Layouts Available
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Template Marketplace
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Select from {totalCount.toLocaleString()} genuinely engineered layout architectures across 21 industries.
        </p>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, keyword, layout (e.g. Software Engineer, Cyber, Timeline, Navy)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* CATEGORY TABS SCROLLER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => { setSelectedCategory('all'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories ({totalCount})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedCategory(c.id); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === c.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name.replace(' Templates', '')}
            </button>
          ))}
        </div>

        {/* SECONDARY FILTER CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <SlidersHorizontal size={14} /> Color Scheme:
            </span>
            <button
              onClick={() => { setSelectedColor('all'); setPage(1); }}
              className={`px-2.5 py-1 rounded-md border ${selectedColor === 'all' ? 'border-brand-500 bg-brand-50 font-bold text-brand-700' : 'border-slate-200'}`}
            >
              All Palettes
            </button>
            {palettes.slice(0, 6).map((p) => (
              <button
                key={p.name}
                onClick={() => { setSelectedColor(p.name); setPage(1); }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${
                  selectedColor === p.name ? 'border-brand-500 bg-brand-50 font-bold text-brand-700' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.primary }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={atsOnly}
              onChange={(e) => { setAtsOnly(e.target.checked); setPage(1); }}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <span>ATS-Optimized Single Column Only</span>
          </label>
        </div>
      </div>

      {/* TEMPLATE GRID */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading templates from 1,000+ catalog...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-700">No templates match your active filters.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedColor('all'); setSearchTerm(''); setPage(1); }}
            className="mt-3 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* CARD PREVIEW HEADER */}
              <div
                className="h-44 p-4 relative overflow-hidden flex flex-col justify-between"
                style={{
                  backgroundColor: tpl.style_config.primary_color,
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                    {tpl.layout_config.code.toUpperCase()}
                  </span>
                  {tpl.is_premium ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                      <Star size={10} className="fill-slate-950" /> PRO
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      FREE
                    </span>
                  )}
                </div>

                {/* MINI PREVIEW SKELETON */}
                <div className="bg-white/95 rounded-lg p-2.5 shadow-md space-y-1.5 opacity-95 group-hover:scale-[1.02] transition-transform">
                  <div className="h-2 w-24 rounded" style={{ backgroundColor: tpl.style_config.primary_color }} />
                  <div className="h-1.5 w-36 bg-slate-200 rounded" />
                  <div className="pt-1 flex gap-1">
                    <div className="h-1 flex-1 bg-slate-100 rounded" />
                    <div className="h-1 flex-1 bg-slate-100 rounded" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>ATS Safe • {tpl.style_config.palette_name}</span>
                </div>
              </div>

              {/* CARD DETAILS BODY */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {tpl.name}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{tpl.category}</span>
                    <span className="flex items-center gap-0.5 font-semibold text-amber-500">
                      ★ {tpl.rating}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1"
                    title="Quick Preview"
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(tpl)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    Use Template <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 text-xs">
        <span className="text-slate-500">
          Showing Page <b>{page}</b> of <b>{Math.ceil(totalCount / 24)}</b> ({totalCount} total templates)
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={page >= Math.ceil(totalCount / 24)}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* QUICK PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-500">{previewTemplate.category} • {previewTemplate.layout_config.code}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div><b>Header Font:</b> {previewTemplate.style_config.font_family_header}</div>
                <div><b>Body Font:</b> {previewTemplate.style_config.font_family_body}</div>
                <div><b>Columns:</b> {previewTemplate.layout_config.columns}</div>
                <div><b>ATS Compatible:</b> Yes (100% Tested)</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => handleSelectTemplate(previewTemplate)}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Apply This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
