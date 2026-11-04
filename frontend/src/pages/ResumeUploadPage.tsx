import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const ResumeUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadResume } = useResumeStore();

  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<any | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    setError(null);
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError(`Invalid file type '${ext}'. Please upload a PDF, DOCX, DOC, or TXT document.`);
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setError('File exceeds the 10 MB maximum size limit.');
      return;
    }

    setFile(f);
  };

  const handleProcessUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ats_token') || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.detail || 'Upload failed');
      }

      const data = await response.json();
      setParseResult(data);

      if (data.parsed_content) {
        loadResume({
          id: data.resume_id || 1,
          user_id: 1,
          title: file.name.replace(/\.[^/.]+$/, ''),
          template_id: 'tpl-ats-friendly-1col-classic-corporate-navy-0001',
          content: data.parsed_content,
          design_settings: {
            font_family: 'Inter',
            font_size: 'medium',
            primary_color: '#0e87ea',
            secondary_color: '#1e293b',
            accent_color: '#64748b',
            line_spacing: 'normal',
            margins: 'normal',
            section_order: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
          },
          ats_score: data.ats_score || 85,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <Sparkles size={14} /> Multi-Format ATS Ingestion Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Your Resume
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          We extract your contact information, work experience, education, skills, and certifications with intelligent entity mapping.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* DROPZONE */}
      {!parseResult ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
            dragOver ? 'border-brand-500 bg-brand-50/50 scale-[1.01]' : 'border-slate-300 bg-white hover:border-brand-400'
          }`}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {file ? file.name : 'Click to upload or drag & drop'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Supported formats: PDF, DOCX, DOC, TXT (Maximum file size: 10 MB)
          </p>

          {file && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProcessUpload();
                }}
                disabled={isUploading}
                className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-transform"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Extracting Entities...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Parse & Open in Editor
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* EXTRACTION SUCCESS SUMMARY CARD */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle2 size={20} />
              <span>Resume Successfully Parsed!</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Initial ATS Score: {parseResult.ats_score}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Contact Details Detected</h4>
              <p><b>Name:</b> {parseResult.parsed_content?.personal_info?.full_name}</p>
              <p><b>Email:</b> {parseResult.parsed_content?.personal_info?.email}</p>
              <p><b>Phone:</b> {parseResult.parsed_content?.personal_info?.phone || 'Not detected'}</p>
              <p><b>Location:</b> {parseResult.parsed_content?.personal_info?.location}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Extracted Skills ({parseResult.parsed_content?.skills?.length || 0})</h4>
              <div className="flex flex-wrap gap-1">
                {parseResult.parsed_content?.skills?.slice(0, 10).map((s: string, idx: number) => (
                  <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => { setFile(null); setParseResult(null); }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Upload Another
            </button>
            <button
              onClick={() => navigate('/builder')}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              Launch Live Resume Editor <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
