// ─── DMOS Backend: Firestore Document Schemas ─────────────────────────────

export interface BaseDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: string;
  version: number;
}

export interface BlogDocument extends BaseDocument {
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  ogImage: string;
  canonicalUrl: string;
  metaDescription: string;
  readingTime: string;
  seoScore: number;
  faqSchema: Record<string, any>[];
  articleSchema: Record<string, any>;
  views: number;
}

export interface CRMLeadDocument extends BaseDocument {
  name: string;
  email: string;
  phone?: string;
  company: string;
  service: string;
  message: string;
  value: number;
  stage: 'new' | 'contacted' | 'meeting' | 'proposal' | 'won' | 'lost';
  aiSummary?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface ProjectDocument extends BaseDocument {
  title: string;
  slug: string;
  description: string;
  client: string;
  category: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  featured: boolean;
  coverImage: string;
}

export interface MediaDocument extends BaseDocument {
  name: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  dimensions?: string;
}

export interface NotificationDocument extends BaseDocument {
  title: string;
  desc: string;
  type: 'lead' | 'seo' | 'perf' | 'alert' | 'blog' | 'traffic';
  read: boolean;
  priority: 'critical' | 'warning' | 'info' | 'success';
}

export interface AutomationDocument extends BaseDocument {
  name: string;
  trigger: string;
  actions: string[];
  runs: number;
  lastRunAt?: string;
}

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  BLOGS: 'blogs',
  PROJECTS: 'projects',
  MEDIA: 'media',
  CONTACTS: 'contacts',
  CRM: 'crm',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  SEO: 'seo',
  ANALYTICS_CACHE: 'analytics_cache',
  AUTOMATIONS: 'automations',
  AUDIT_LOGS: 'audit_logs',
  SETTINGS: 'settings',
};
