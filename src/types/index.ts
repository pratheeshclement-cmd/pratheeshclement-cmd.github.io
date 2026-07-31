// Global TypeScript types for Portfolio X

export interface SceneProps {
  id: string;
  onEnter?: () => void;
  onLeave?: () => void;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  problem: string;
  solution: string;
  result: string;
  icon: string;
  accentColor: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  level: 'Expert' | 'Proficient' | 'Learning';
  icon: string;
  accentColor: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  type: 'work' | 'education' | 'certification';
  period: string;
  current?: boolean;
  description: string;
  icon: string;
  accentColor: string;
  credentialId?: string;
  verifier?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  highlights: string[];
  image?: string;
  accentColor?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type UserRole = 'recruiter' | 'founder' | 'client' | 'developer' | 'browsing';

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  decided: boolean;
}

export type Theme = 'light' | 'dark';
