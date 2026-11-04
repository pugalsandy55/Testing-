export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  gpa: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  url: string;
  description: string;
  technologies: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface ResumeContent {
  personal_info: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  awards: AwardItem[];
}

export interface DesignSettings {
  font_family: string;
  font_size: string; // 'small' | 'medium' | 'large'
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  line_spacing: string; // 'tight' | 'normal' | 'relaxed'
  margins: string;
  section_order: string[];
}

export interface Resume {
  id: number;
  user_id: number;
  title: string;
  target_role?: string;
  template_id: string;
  content: ResumeContent;
  design_settings: DesignSettings;
  ats_score: number;
  ats_details?: any;
  created_at: string;
  updated_at: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  category_id: string;
  industry: string;
  is_premium: boolean;
  is_ats_friendly: boolean;
  layout_config: {
    code: string;
    columns: number;
    sidebar: 'left' | 'right' | null;
    header_style: string;
    section_order: string[];
    margins: string;
    line_spacing: string;
  };
  style_config: {
    palette_name: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    badge_color: string;
    font_family_header: string;
    font_family_body: string;
    letter_spacing: string;
    font_size_scale: string;
  };
  tags: string[];
  rating: string;
  uses_count: number;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  subscription_plan: 'free' | 'pro' | 'enterprise';
  is_active: boolean;
  created_at: string;
}

export interface ATSResult {
  overall_score: number;
  keyword_match_pct: number;
  structure_score: number;
  skills_score: number;
  formatting_score: number;
  impact_score: number;
  found_keywords: string[];
  missing_keywords: string[];
  formatting_warnings: Array<{
    category: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    fix_suggestion: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  summary_evaluation: string;
}
