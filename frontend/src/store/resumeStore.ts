import { create } from 'zustand';
import { Resume, ResumeContent, DesignSettings } from '../types';
import { apiRequest } from '../services/api';

const defaultContent: ResumeContent = {
  personal_info: {
    full_name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    headline: 'Senior Full Stack Software Engineer',
    website: 'https://alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
  },
  summary:
    'Dedicated and performance-driven Senior Software Engineer with 6+ years of experience engineering high-throughput microservices, scalable distributed systems, and modern web architectures. Proven track record of boosting performance by 40% and leading agile teams.',
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Solutions',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      start_date: 'Jan 2022',
      end_date: 'Present',
      current: true,
      highlights: [
        'Architected and deployed high-performance REST APIs processing over 10M daily events with 99.99% uptime.',
        'Spearheaded migration to Docker containerized microservices, reducing AWS cloud infrastructure spend by 35%.',
        'Led sprint planning and mentored junior engineers on test-driven development and system observability.',
      ],
    },
    {
      id: 'exp-2',
      company: 'NextGen Digital Labs',
      position: 'Software Engineer',
      location: 'Austin, TX',
      start_date: 'Jun 2018',
      end_date: 'Dec 2021',
      current: false,
      highlights: [
        'Engineered responsive React and TypeScript single-page applications servicing 250,000 monthly active users.',
        'Optimized PostgreSQL query schemas and added Redis caching, trimming average response time from 420ms to 95ms.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      field_of_study: 'Computer Science & Software Systems',
      start_date: '2014',
      end_date: '2018',
      gpa: '3.8 / 4.0',
    },
  ],
  skills: [
    'Python',
    'TypeScript',
    'React.js',
    'FastAPI',
    'Node.js',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Kubernetes',
    'Redis',
    'Git',
    'CI/CD Pipelines',
    'Tailwind CSS',
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Cloud-Native ATS Scanner',
      role: 'Creator & Lead Developer',
      url: 'https://github.com/alexmorgan/ats-scanner',
      description:
        'High-accuracy resume keyword parser utilizing FastAPI, React, and heuristic taxonomy scoring.',
      technologies: ['FastAPI', 'React', 'TypeScript', 'Docker'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
      url: '',
    },
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native / Bilingual' },
    { id: 'lang-2', language: 'Spanish', proficiency: 'Professional Working' },
  ],
  awards: [
    { id: 'awd-1', title: 'Top Innovator Award', issuer: 'Apex Cloud Solutions', date: '2023' },
  ],
};

const defaultDesign: DesignSettings = {
  font_family: 'Inter',
  font_size: 'medium',
  primary_color: '#0e87ea',
  secondary_color: '#1e293b',
  accent_color: '#64748b',
  line_spacing: 'normal',
  margins: 'normal',
  section_order: [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'awards',
  ],
};

interface ResumeState {
  currentResume: Resume | null;
  content: ResumeContent;
  design: DesignSettings;
  selectedTemplateId: string;
  isSaving: boolean;
  lastSaved: string | null;
  history: ResumeContent[];
  future: ResumeContent[];

  setContent: (content: Partial<ResumeContent>) => void;
  setDesign: (design: Partial<DesignSettings>) => void;
  setTemplateId: (templateId: string) => void;
  loadResume: (resume: Resume) => void;
  saveResume: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  resetToDefault: () => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  currentResume: null,
  content: defaultContent,
  design: defaultDesign,
  selectedTemplateId: 'tpl-ats-friendly-1col-classic-corporate-navy-0001',
  isSaving: false,
  lastSaved: null,
  history: [],
  future: [],

  setContent: (newContent) => {
    const { content, history } = get();
    set({
      content: { ...content, ...newContent },
      history: [...history.slice(-15), content], // keep up to 15 undo steps
      future: [],
    });
  },

  setDesign: (newDesign) => {
    const { design } = get();
    set({ design: { ...design, ...newDesign } });
  },

  setTemplateId: (templateId) => {
    set({ selectedTemplateId: templateId });
  },

  loadResume: (resume) => {
    set({
      currentResume: resume,
      content: resume.content || defaultContent,
      design: resume.design_settings || defaultDesign,
      selectedTemplateId: resume.template_id || 'tpl-ats-friendly-1col-classic-corporate-navy-0001',
      history: [],
      future: [],
    });
  },

  saveResume: async () => {
    const { currentResume, content, design, selectedTemplateId } = get();
    set({ isSaving: true });
    try {
      if (currentResume && currentResume.id) {
        const updated = await apiRequest<Resume>(`/resumes/${currentResume.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: currentResume.title,
            target_role: currentResume.target_role,
            template_id: selectedTemplateId,
            content,
            design_settings: design,
          }),
        });
        set({ currentResume: updated, isSaving: false, lastSaved: new Date().toLocaleTimeString() });
      } else {
        const created = await apiRequest<Resume>('/resumes', {
          method: 'POST',
          body: JSON.stringify({
            title: `${content.personal_info.full_name || 'My'} Resume`,
            target_role: content.personal_info.headline,
            template_id: selectedTemplateId,
            content,
            design_settings: design,
          }),
        });
        set({ currentResume: created, isSaving: false, lastSaved: new Date().toLocaleTimeString() });
      }
    } catch {
      set({ isSaving: false, lastSaved: 'Saved locally' });
    }
  },

  undo: () => {
    const { history, content, future } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      content: previous,
      history: history.slice(0, history.length - 1),
      future: [content, ...future],
    });
  },

  redo: () => {
    const { future, content, history } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      content: next,
      future: future.slice(1),
      history: [...history, content],
    });
  },

  resetToDefault: () => {
    set({
      currentResume: null,
      content: defaultContent,
      design: defaultDesign,
      selectedTemplateId: 'tpl-ats-friendly-1col-classic-corporate-navy-0001',
    });
  },
}));
