import { Service } from '../types';

// Services sourced from docs/CONTENT.md
export const SERVICES: Service[] = [
  {
    id: 'website-development',
    name: 'Website Development',
    description:
      'Premium, responsive, high-performance web applications built with modern frameworks. Clean semantic code, accessibility-first, and conversion-optimized.',
    icon: 'globe',
    highlights: ['React / Next.js', 'Responsive Design', 'Accessibility (WCAG)', 'Performance Optimization'],
  },
  {
    id: 'technical-seo',
    name: 'Technical SEO',
    description:
      'Full-funnel technical SEO audits, schema markup implementation, sitemaps, robots.txt, and Core Web Vitals optimization for lasting organic growth.',
    icon: 'search',
    highlights: ['SEO Audits', 'JSON-LD Schema', 'Core Web Vitals', 'Keyword Research'],
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description:
      'Search and Display campaign setup, keyword targeting, bid strategy, conversion tracking, and ongoing optimization for maximum ROI.',
    icon: 'bar-chart-2',
    highlights: ['Search Campaigns', 'Conversion Tracking', 'Bid Strategy', 'Ad Copy Testing'],
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    description:
      'Facebook and Instagram ad campaigns with custom audience building, Meta Pixel event tracking, funnel-based creative, and CPL reduction.',
    icon: 'target',
    highlights: ['Custom Audiences', 'Pixel Events', 'Lookalike Audiences', 'CPL Optimization'],
  },
  {
    id: 'digital-marketing-strategy',
    name: 'Digital Marketing Strategy',
    description:
      'End-to-end marketing strategy: channel planning, content funnels, growth roadmaps, and analytics frameworks to drive measurable business outcomes.',
    icon: 'trending-up',
    highlights: ['Growth Roadmaps', 'Channel Strategy', 'Content Funnels', 'GA4 Analytics'],
  },
  {
    id: 'landing-page-development',
    name: 'Landing Page Development',
    description:
      'High-converting landing pages designed for specific campaigns — fast loading, CRO-optimized, and integrated with analytics and ad platforms.',
    icon: 'layout',
    highlights: ['CRO Design', 'A/B Testing', 'Fast Load Times', 'Analytics Integration'],
  },
  {
    id: 'performance-optimization',
    name: 'Website / Performance Optimization',
    description:
      'Lighthouse and Core Web Vitals audits, image optimization, code splitting, caching strategies, and render performance improvements.',
    icon: 'zap',
    highlights: ['Lighthouse 95+', 'Image Optimization', 'Code Splitting', 'Cache Strategy'],
  },
  {
    id: 'ai-automation',
    name: 'AI Tools & Automation',
    description:
      'AI-powered workflow automation connecting CRMs, content systems, and marketing platforms using webhooks, Zapier, and custom API integrations.',
    icon: 'bot',
    highlights: ['Workflow Automation', 'API Integrations', 'AI Chat Agents', 'Auto Reporting'],
  },
  {
    id: 'personal-branding',
    name: 'Personal Branding',
    description:
      'Professional personal brand strategy covering visual identity, online presence, LinkedIn optimization, and content positioning.',
    icon: 'user-check',
    highlights: ['Visual Identity', 'LinkedIn Strategy', 'Content Positioning', 'Online Presence'],
  },
];
