import { Service } from '../types';

// Services sourced from docs/CONTENT.md with accent colors and responsive visual tags
export const SERVICES: Service[] = [
  {
    id: 'technical-seo',
    name: 'Technical SEO',
    description:
      'Full-funnel technical SEO audits, schema markup graphs, sitemaps, robots.txt, and Core Web Vitals optimization for lasting organic growth.',
    icon: 'search',
    highlights: ['SEO Audits', 'JSON-LD Schema', 'Core Web Vitals', 'Search Console'],
    accentColor: '#3B82F6',
  },
  {
    id: 'digital-marketing-strategy',
    name: 'Digital Marketing Strategy',
    description:
      'End-to-end marketing strategy: channel planning, content funnels, growth roadmaps, and analytics frameworks to drive measurable business outcomes.',
    icon: 'trending-up',
    highlights: ['Growth Roadmaps', 'Channel Strategy', 'Content Funnels', 'GA4 Analytics'],
    accentColor: '#0EA5E9',
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Interface Design',
    description:
      'Designing modern, accessible user interfaces with glassmorphic component systems, fluid responsive typography, and WCAG accessibility.',
    icon: 'layout',
    highlights: ['UI Systems', 'Glassmorphism', 'WCAG Accessibility', 'Figma'],
    accentColor: '#8B5CF6',
  },
  {
    id: 'website-development',
    name: 'Website Development',
    description:
      'Premium, responsive, high-performance web applications built with React 19, TypeScript, and Vite. Clean semantic code, accessibility-first, and conversion-optimized.',
    icon: 'globe',
    highlights: ['React / Vite', 'Responsive Design', 'Accessibility (WCAG)', 'Performance'],
    accentColor: '#10B981',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description:
      'Search and Display campaign setup, keyword targeting, bid strategy, conversion tracking, and ongoing optimization for maximum ROI.',
    icon: 'bar-chart-2',
    highlights: ['Search Campaigns', 'Conversion Tracking', 'Bid Strategy', 'Ad Copy Testing'],
    accentColor: '#F59E0B',
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    description:
      'Facebook and Instagram ad campaigns with custom audience building, Meta Pixel event tracking, funnel-based creative, and CPL reduction.',
    icon: 'target',
    highlights: ['Custom Audiences', 'Pixel Events', 'Lookalike Audiences', 'CPL Optimization'],
    accentColor: '#EC4899',
  },
  {
    id: 'ai-automation',
    name: 'AI Tools & Automation',
    description:
      'AI-powered workflow automation connecting CRMs, content systems, and marketing platforms using webhooks, Zapier, and custom API integrations.',
    icon: 'bot',
    highlights: ['Workflow Automation', 'API Integrations', 'AI Chat Agents', 'Auto Reporting'],
    accentColor: '#6366F1',
  },
  {
    id: 'freelancing',
    name: 'Freelance Consulting & Services',
    description:
      'Independent technical consulting, custom web app development, SEO audits, and campaign management for businesses worldwide.',
    icon: 'user-check',
    highlights: ['Remote Consulting', 'Technical Audits', 'React Engineering', 'Ad Management'],
    accentColor: '#14B8A6',
  },
];
