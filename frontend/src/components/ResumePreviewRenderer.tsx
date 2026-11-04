import React from 'react';
import { ResumeContent, DesignSettings, ResumeTemplate } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface Props {
  content: ResumeContent;
  design?: DesignSettings;
  template?: ResumeTemplate | null;
  scale?: number;
}

export const ResumePreviewRenderer: React.FC<Props> = ({
  content,
  design,
  template,
  scale = 1,
}) => {
  const pColor = template?.style_config?.primary_color || design?.primary_color || '#0A2540';
  const sColor = template?.style_config?.secondary_color || design?.secondary_color || '#1E293B';
  const aColor = template?.style_config?.accent_color || design?.accent_color || '#0284C7';
  const badgeColor = template?.style_config?.badge_color || '#E0F2FE';
  const headerFont = template?.style_config?.font_family_header || design?.font_family || 'Inter';
  const bodyFont = template?.style_config?.font_family_body || 'Inter';
  const layoutCode = template?.layout_config?.code || '1col-classic';

  const info = content.personal_info || {};
  const experiences = content.experience || [];
  const education = content.education || [];
  const skills = content.skills || [];
  const projects = content.projects || [];
  const certifications = content.certifications || [];
  const languages = content.languages || [];

  // Font family mappings
  const getFontFamily = (fontName: string) => {
    switch (fontName) {
      case 'Merriweather':
        return "'Merriweather', serif";
      case 'Roboto Mono':
        return "'Roboto Mono', monospace";
      default:
        return "'Inter', sans-serif";
    }
  };

  const renderContactItem = (icon: React.ReactNode, text: string, link?: string) => {
    if (!text) return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-600">
        <span style={{ color: aColor }}>{icon}</span>
        {link ? (
          <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer" className="hover:underline">
            {text}
          </a>
        ) : (
          <span>{text}</span>
        )}
      </div>
    );
  };

  const renderSectionTitle = (title: string) => (
    <div className="mb-2.5">
      <h3
        className="text-xs font-bold tracking-wider uppercase flex items-center gap-2"
        style={{
          fontFamily: getFontFamily(headerFont),
          color: pColor,
        }}
      >
        <span>{title}</span>
        <span className="flex-1 h-[1.5px]" style={{ backgroundColor: aColor, opacity: 0.3 }} />
      </h3>
    </div>
  );

  // SECTION RENDERERS
  const renderSummary = () => {
    if (!content.summary) return null;
    return (
      <div className="mb-4">
        {renderSectionTitle('Professional Summary')}
        <p className="text-xs text-slate-700 leading-relaxed font-normal">{content.summary}</p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experiences.length) return null;
    return (
      <div className="mb-4">
        {renderSectionTitle('Work Experience')}
        <div className="space-y-3.5">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative">
              {layoutCode === 'timeline-accent' && (
                <div
                  className="absolute -left-3 top-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: aColor }}
                />
              )}
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="font-semibold text-xs text-slate-900" style={{ fontFamily: getFontFamily(headerFont) }}>
                  {exp.position} <span className="font-normal text-slate-600">at {exp.company}</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {exp.start_date} – {exp.current ? 'Present' : exp.end_date} {exp.location && `| ${exp.location}`}
                </span>
              </div>
              <ul className="mt-1 space-y-1">
                {exp.highlights?.map((bullet, idx) => (
                  <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                    <span className="text-[10px] mt-0.5" style={{ color: aColor }}>•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = (asPills = false) => {
    if (!skills.length) return null;
    return (
      <div className="mb-4">
        {renderSectionTitle('Skills & Competencies')}
        {asPills ? (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: badgeColor,
                  color: pColor,
                  borderColor: `${aColor}33`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-700 leading-relaxed">
            {skills.join(' • ')}
          </p>
        )}
      </div>
    );
  };

  const renderEducation = () => {
    if (!education.length) return null;
    return (
      <div className="mb-4">
        {renderSectionTitle('Education')}
        <div className="space-y-2.5">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline flex-wrap">
                <span className="font-semibold text-xs text-slate-900" style={{ fontFamily: getFontFamily(headerFont) }}>
                  {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                </span>
                <span className="text-[11px] text-slate-500">
                  {edu.start_date} – {edu.end_date}
                </span>
              </div>
              <div className="text-xs text-slate-600 flex justify-between">
                <span>{edu.institution}</span>
                {edu.gpa && <span className="text-[11px] font-medium text-slate-500">GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!projects.length) return null;
    return (
      <div className="mb-4">
        {renderSectionTitle('Key Projects')}
        <div className="space-y-2.5">
          {projects.map((proj) => (
            <div key={proj.id}>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-slate-900">{proj.title}</span>
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600">
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mt-0.5">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((t, idx) => (
                    <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certifications.length) return null;
    return (
      <div className="mb-4">
        {renderSectionTitle('Certifications')}
        <div className="space-y-1.5">
          {certifications.map((cert) => (
            <div key={cert.id} className="text-xs flex justify-between">
              <span className="font-medium text-slate-900">{cert.name}</span>
              <span className="text-[11px] text-slate-500">{cert.issuer} {cert.date && `(${cert.date})`}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (!languages.length) return null;
    return (
      <div className="mb-4">
        {renderSectionTitle('Languages')}
        <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
          {languages.map((lang) => (
            <div key={lang.id} className="flex justify-between border-b border-slate-100 pb-0.5">
              <span className="font-medium">{lang.language}</span>
              <span className="text-slate-500 text-[11px]">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // LAYOUT ENGINE DISPATCHER
  const isLeftSidebar = layoutCode === '2col-left' || layoutCode === 'compact-grid';
  const isRightSidebar = layoutCode === '2col-right';
  const isBanner = layoutCode === 'exec-banner';

  return (
    <div
      className="bg-white shadow-2xl mx-auto rounded-sm border border-slate-200 overflow-hidden transition-all duration-200"
      style={{
        width: '794px', // Standard A4 width in pixels at 96 DPI
        minHeight: '1123px', // Standard A4 height
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        fontFamily: getFontFamily(bodyFont),
      }}
    >
      {/* EXECUTIVE FULL BANNER HEADER (if exec-banner) */}
      {isBanner && (
        <div className="p-8 text-white" style={{ backgroundColor: pColor }}>
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: getFontFamily(headerFont) }}>
            {info.full_name || 'Alex Morgan'}
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: aColor }}>
            {info.headline || 'Senior Software Engineer'}
          </p>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-200">
            {info.email && <div className="flex items-center gap-1"><Mail size={12} /> {info.email}</div>}
            {info.phone && <div className="flex items-center gap-1"><Phone size={12} /> {info.phone}</div>}
            {info.location && <div className="flex items-center gap-1"><MapPin size={12} /> {info.location}</div>}
            {info.linkedin && <div className="flex items-center gap-1"><Linkedin size={12} /> {info.linkedin}</div>}
          </div>
        </div>
      )}

      {/* STANDARD / 2-COLUMN LAYOUT BODY */}
      <div className={`p-8 ${isBanner ? 'pt-6' : ''}`}>
        {!isBanner && (
          <div className="border-b border-slate-200 pb-4 mb-5 text-center">
            <h1
              className="text-2xl font-extrabold tracking-tight"
              style={{
                fontFamily: getFontFamily(headerFont),
                color: pColor,
              }}
            >
              {info.full_name || 'Alex Morgan'}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1 text-slate-600">
              {info.headline || 'Senior Software Engineer'}
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2.5">
              {renderContactItem(<Mail size={12} />, info.email)}
              {renderContactItem(<Phone size={12} />, info.phone)}
              {renderContactItem(<MapPin size={12} />, info.location)}
              {renderContactItem(<Linkedin size={12} />, info.linkedin, info.linkedin)}
              {renderContactItem(<Github size={12} />, info.github, info.github)}
              {renderContactItem(<Globe size={12} />, info.website, info.website)}
            </div>
          </div>
        )}

        {/* 2-COLUMN LEFT SIDEBAR */}
        {isLeftSidebar && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 border-r border-slate-100 pr-4 space-y-4">
              {renderSkills(true)}
              {renderEducation()}
              {renderCertifications()}
              {renderLanguages()}
            </div>
            <div className="col-span-8 space-y-4">
              {renderSummary()}
              {renderExperience()}
              {renderProjects()}
            </div>
          </div>
        )}

        {/* 2-COLUMN RIGHT SIDEBAR */}
        {isRightSidebar && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-4">
              {renderSummary()}
              {renderExperience()}
              {renderProjects()}
            </div>
            <div className="col-span-4 border-l border-slate-100 pl-4 space-y-4">
              {renderSkills(true)}
              {renderEducation()}
              {renderCertifications()}
              {renderLanguages()}
            </div>
          </div>
        )}

        {/* 1-COLUMN CLASSIC / TIMELINE */}
        {!isLeftSidebar && !isRightSidebar && (
          <div className="space-y-4">
            {renderSummary()}
            {renderExperience()}
            {renderSkills(true)}
            {renderProjects()}
            {renderEducation()}
            {renderCertifications()}
            {renderLanguages()}
          </div>
        )}
      </div>
    </div>
  );
};
