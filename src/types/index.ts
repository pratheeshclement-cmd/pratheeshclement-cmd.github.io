export type WorkspaceId = 
  | 'welcome'
  | 'ai-concierge'
  | 'creative-tech'
  | 'design-studio'
  | 'frontend-lab'
  | 'performance-center'
  | 'seo-center'
  | 'digital-marketing'
  | 'project-vault'
  | 'knowledge-hub'
  | 'playground'
  | 'communication'
  | 'timeline'
  | 'contact'
  | 'settings';

export interface WorkspaceConfig {
  id: WorkspaceId;
  title: string;
  subtitle: string;
  category: 'core' | 'engineering' | 'marketing' | 'creative' | 'career';
  icon: string;
  accentColor: string;
  badge?: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  period: string;
  location?: string;
  highlights: string[];
  tools: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  type: string;
  technologies: string[];
  description: string;
  problem: string;
  solution: string;
  responsibilities: string[];
  challenges: string[];
  features: string[];
  impact: string;
  architectureDetails: string;
  lessonsLearned: string;
  futureImprovements: string[];
  demoUrl?: string;
  githubUrl?: string;
  metrics?: { label: string; value: string }[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  id?: string;
  grade?: string;
  topics: string[];
  verified: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location?: string;
  year: string;
  details?: string;
}

export interface TechnicalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level: number; tag?: string }[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  actionChips?: { label: string; action: string }[];
}

export interface SystemSettings {
  reducedMotion: boolean;
  soundMuted: boolean;
  highContrast: boolean;
  glowIntensity: 'low' | 'medium' | 'high';
}
