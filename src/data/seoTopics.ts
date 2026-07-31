export interface SEOTopic {
  slug: string;
  name: string;
  category: 'SEO' | 'Digital Marketing' | 'UI/UX Design' | 'Web Development' | 'Google Search Console' | 'AI & Automation' | 'Freelancing';
  intent: 'Informational' | 'Commercial' | 'Navigational' | 'Transactional';
  canonicalUrl: string;
  relatedTopics: string[];
  keywords: string[];
  description: string;
}

export const SEO_TOPICS: SEOTopic[] = [
  {
    slug: 'seo',
    name: 'Search Engine Optimization (SEO)',
    category: 'SEO',
    intent: 'Informational',
    canonicalUrl: '/seo/',
    keywords: ['SEO', 'Technical SEO', 'On-Page SEO', 'Search Intent', 'Keyword Strategy', 'JSON-LD Schema', 'Core Web Vitals'],
    relatedTopics: ['google-search-console', 'web-development', 'digital-marketing'],
    description: 'Technical search engine optimization, crawlability audits, structured data architecture, and organic search growth.',
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing Strategy',
    category: 'Digital Marketing',
    intent: 'Commercial',
    canonicalUrl: '/digital-marketing/',
    keywords: ['Digital Marketing', 'Performance Marketing', 'Lead Generation', 'CRO', 'GA4 Analytics', 'Full-Funnel Strategy'],
    relatedTopics: ['seo', 'meta-ads', 'google-ads', 'ai-automation'],
    description: 'Full-funnel digital marketing strategy, channel analytics, conversion rate optimization, and paid acquisition.',
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX Interface & Experience Design',
    category: 'UI/UX Design',
    intent: 'Informational',
    canonicalUrl: '/ui-ux-design/',
    keywords: ['UI Design', 'UX Design', 'Glassmorphism', 'Responsive Design', 'Accessibility', 'Figma', 'Design Systems', 'WCAG'],
    relatedTopics: ['web-development', 'seo', 'freelancing'],
    description: 'User interface design, responsive layouts, accessibility compliance, glassmorphic design systems, and spatial motion.',
  },
  {
    slug: 'web-development',
    name: 'Frontend Web Development',
    category: 'Web Development',
    intent: 'Informational',
    canonicalUrl: '/web-development/',
    keywords: ['Web Development', 'React', 'TypeScript', 'Vite', 'HTML5', 'CSS Custom Properties', 'GSAP', 'SPA Architecture'],
    relatedTopics: ['ui-ux-design', 'seo', 'ai-automation'],
    description: 'Modern frontend engineering with React 19, TypeScript, Vite, accessible HTML5, and GSAP motion design.',
  },
  {
    slug: 'google-search-console',
    name: 'Google Search Console & Indexing',
    category: 'Google Search Console',
    intent: 'Informational',
    canonicalUrl: '/google-search-console/',
    keywords: ['Google Search Console', 'Search Console', 'Indexation', 'URL Inspection', 'Sitemaps', 'Crawl Errors', 'Canonical URLs'],
    relatedTopics: ['seo', 'web-development'],
    description: 'Search Console management, index coverage monitoring, URL inspection, XML sitemap auditing, and SERP performance.',
  },
  {
    slug: 'ai-automation',
    name: 'AI Tools & Workflow Automation',
    category: 'AI & Automation',
    intent: 'Informational',
    canonicalUrl: '/ai-automation/',
    keywords: ['AI Tools', 'AI Automation', 'Prompt Engineering', 'Gemini API', 'AI Concierge', 'Zapier Webhooks', 'LLM Integration'],
    relatedTopics: ['digital-marketing', 'web-development'],
    description: 'AI workflow integration, prompt engineering, conversational agents, and API automation pipelines.',
  },
  {
    slug: 'freelancing',
    name: 'Freelance Digital Marketing & Development Services',
    category: 'Freelancing',
    intent: 'Transactional',
    canonicalUrl: '/freelancing/',
    keywords: ['Freelancer', 'Freelance Digital Marketer', 'Freelance SEO', 'Freelance Web Developer', 'Freelance UI UX', 'Remote Consultant'],
    relatedTopics: ['services', 'projects', 'contact'],
    description: 'Professional freelance consulting in Technical SEO, React web development, Meta/Google ads, and digital strategy.',
  },
];
