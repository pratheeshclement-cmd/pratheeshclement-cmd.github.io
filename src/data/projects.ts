import { Project } from '../types';

// Real case studies only — sourced from docs/CONTENT.md. No invented content.
export const PROJECTS: Project[] = [
  {
    id: 'seo-growth-campaign',
    title: 'SEO Growth Campaign',
    category: 'SEO Services · Competitor Gap · JSON-LD · GA4',
    tags: ['Technical SEO', 'Schema Markup', 'GA4', 'Keyword Research'],
    summary:
      'Full-funnel technical search audit and keyword optimization for an Indian e-commerce platform.',
    problem:
      'Low organic indexation, duplicate titles, no schema markup, stagnant rankings — the site was invisible to Google despite having real content.',
    solution:
      'Rebuilt robots.txt and sitemaps, implemented JSON-LD structured data graphs, identified and fixed keyword gaps across all high-value pages.',
    result:
      'Significant organic visibility gain, rich snippets appearing in SERP, lower bounce rate within 60 days of implementation.',
    icon: 'search',
    accentColor: 'var(--accent-secondary)',
  },
  {
    id: 'restaurant-branding-web',
    title: 'Restaurant Branding Web Layout',
    category: 'CSS Grid · Responsive · Micro-Interactions',
    tags: ['Frontend', 'CSS Grid', 'Responsive Design', 'UI/UX'],
    summary:
      'Responsive frontend for custom menus and table queries for a restaurant brand.',
    problem:
      'Hard-coded layouts with no mobile support, non-touch-friendly buttons, and slow image rendering on mobile devices.',
    solution:
      'Rebuilt with fluid CSS Grid, optimized image rendering, clean CTAs, and semantic HTML structure ready for backend integration.',
    result:
      'Smooth multi-viewport display across all screen sizes, clean and maintainable codebase ready for backend integration.',
    icon: 'layout',
    accentColor: 'var(--accent-primary)',
  },
  {
    id: 'b2b-conversion-funnel',
    title: 'Social Media B2B Conversion Funnel',
    category: 'Meta Ads · Lead Gen · Pixel Events',
    tags: ['Meta Ads', 'Meta Pixel', 'Lead Generation', 'B2B'],
    summary:
      'Meta Ads campaign for targeted B2B inquiries with custom pixel event tracking.',
    problem:
      'Poor audience profiling, spam form submissions, and high cost-per-lead were draining the advertising budget without qualified results.',
    solution:
      'Built lookalike audiences, implemented custom Meta Pixel events, and ran high-impact copy testing to identify the best performing ad creative.',
    result:
      'Reduced cost-per-lead, more pre-qualified leads, and a significant improvement in lead-to-conversion rate.',
    icon: 'trending-up',
    accentColor: 'var(--accent-mint)',
  },
  {
    id: 'portfolio-redesign',
    title: 'Personal Portfolio Redesign',
    category: 'Frontend Architecture · Motion Design · Cinematic UX',
    tags: ['React', 'TypeScript', 'GSAP', 'Three.js', 'Scroll Animation'],
    summary:
      'Iterative modern frontend architecture and spatial motion design for a cinematic digital portfolio.',
    problem:
      'Traditional portfolio pages lacked the visual impact needed to demonstrate frontend engineering and design capabilities to recruiters and clients.',
    solution:
      'Designed and built a scroll-driven cinematic experience with GSAP ScrollTrigger, Three.js, Lenis smooth scroll, and a premium glass design system.',
    result:
      'A portfolio that demonstrates technical depth through interaction itself — the experience IS the case study.',
    icon: 'sparkles',
    accentColor: 'var(--accent-tertiary)',
  },
];
