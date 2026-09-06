// SEO meta management — dynamically updates <head> tags per route.
// Uses direct DOM manipulation (compatible with Vite static SPA).

import { useEffect } from 'react';

const BASE_URL = 'https://pratheeshclement-cmd.github.io';
const SITE_NAME = 'Pratheesh Clement';

export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
  articlePublished?: string;
  articleModified?: string;
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSEOMeta(meta: SEOMeta) {
  useEffect(() => {
    const { title, description, canonical, ogType = 'website', ogImage, ogImageAlt, noindex, articlePublished, articleModified } = meta;

    // Title
    document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    // Core meta
    setMeta('description', description);
    setMeta('robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Canonical
    const canonicalUrl = canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`;
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', SITE_NAME, true);
    if (ogImage) {
      const imgUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
      setMeta('og:image', imgUrl, true);
      if (ogImageAlt) setMeta('og:image:alt', ogImageAlt, true);
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (ogImage) {
      const imgUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
      setMeta('twitter:image', imgUrl);
    }

    // Article metadata
    if (articlePublished) setMeta('article:published_time', articlePublished, true);
    if (articleModified) setMeta('article:modified_time', articleModified, true);

    // Restore canonical on unmount (back to homepage)
    return () => {
      document.title = 'Pratheesh Clement | SEO, Digital Marketing & Web Development';
      setLink('canonical', `${BASE_URL}/`);
      setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    };
  }, [meta.title, meta.description, meta.canonical]);
}

// Pre-defined SEO configurations for each route
export const PAGE_SEO = {
  home: {
    title: 'Pratheesh Clement | SEO, Digital Marketing & Web Development',
    description: 'Official Portfolio of Pratheesh Clement (also known as Pratheesh) — Digital Marketing Specialist, Technical SEO Expert, UI/UX Designer, Frontend Developer, and AI Enthusiast based in Vadalur, Tamil Nadu, India.',
    canonical: '/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Digital Marketing Specialist',
  },
  about: {
    title: 'About Pratheesh Clement | Technical SEO & Digital Marketing Specialist',
    description: 'Learn about Pratheesh Clement (Pratheesh) — creator of Pratheesh OS, Digital Marketing Specialist, Technical SEO Expert, Frontend Developer, and AI Enthusiast based in Vadalur, Tamil Nadu.',
    canonical: '/about/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — About',
  },
  projects: {
    title: 'Projects & Case Studies | Pratheesh Clement',
    description: 'Real digital marketing and web development projects by Pratheesh Clement — SEO growth campaigns, responsive web design, Meta Ads B2B funnels, and cinematic portfolio architecture.',
    canonical: '/projects/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Projects',
  },
  services: {
    title: 'Digital Marketing & Web Development Services | Pratheesh Clement',
    description: 'Explore services offered by Pratheesh Clement: Technical SEO, Google Ads, Meta Ads, React web development, AI automation, and UI/UX design.',
    canonical: '/services/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Services',
  },
  seo: {
    title: 'Technical SEO & Search Optimization | Pratheesh Clement',
    description: 'Technical SEO services and search optimization strategy by Pratheesh Clement (Pratheesh) — on-page SEO, JSON-LD schema graphs, Core Web Vitals, and search indexation.',
    canonical: '/seo/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — SEO Services',
  },
  digitalMarketing: {
    title: 'Digital Marketing Strategy | Pratheesh Clement',
    description: 'Full-funnel digital marketing strategy, multi-channel growth, analytics, and conversion optimization by Pratheesh Clement (Pratheesh) — helping businesses grow online.',
    canonical: '/digital-marketing/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Digital Marketing',
  },
  metaAds: {
    title: 'Meta Ads & Facebook Marketing | Pratheesh Clement',
    description: 'Meta Ads campaign management, Meta Pixel conversion tracking, custom audiences, and CPL optimization by Pratheesh Clement (Pratheesh).',
    canonical: '/meta-ads/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Meta Ads',
  },
  googleAds: {
    title: 'Google Ads & Paid Search Strategy | Pratheesh Clement',
    description: 'Google Ads campaign strategy, keyword planning, search intent, conversion tracking, and PPC optimization by Pratheesh Clement (Pratheesh).',
    canonical: '/google-ads/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Google Ads',
  },
  webDev: {
    title: 'Web Development & Frontend Architecture | Pratheesh Clement',
    description: 'Modern web development using React, TypeScript, Vite, and GSAP by Pratheesh Clement (Pratheesh) — performance-first, SEO-ready frontend applications.',
    canonical: '/web-development/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Web Development',
  },
  aiAutomation: {
    title: 'AI Tools & Workflow Automation | Pratheesh Clement',
    description: 'AI-assisted workflows, prompt engineering, API integrations, and automation pipelines combining marketing and development by Pratheesh Clement (Pratheesh).',
    canonical: '/ai-automation/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — AI Automation',
  },
  uiUxDesign: {
    title: 'UI/UX Design & Interface Architecture | Pratheesh Clement',
    description: 'Explore UI/UX design principles, responsive layouts, glassmorphism systems, component accessibility, and micro-interactions by Pratheesh Clement (Pratheesh).',
    canonical: '/ui-ux-design/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — UI/UX Design',
  },
  googleSearchConsole: {
    title: 'Google Search Console & Indexing Guide | Pratheesh Clement',
    description: 'Master Google Search Console, URL inspection, index coverage, XML sitemap auditing, canonical URL resolution, and Core Web Vitals with Pratheesh Clement.',
    canonical: '/google-search-console/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Google Search Console Guide',
  },
  freelancing: {
    title: 'Freelance Digital Marketing & Web Development | Pratheesh Clement',
    description: 'Professional freelance consulting in Technical SEO, React web development, Meta & Google Ads campaigns, and AI automation by Pratheesh Clement (Pratheesh).',
    canonical: '/freelancing/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Freelance Digital Marketing & Development',
  },
  certifications: {
    title: 'Certifications & Qualifications | Pratheesh Clement',
    description: 'Verified credentials of Pratheesh Clement — Google Skillshop Fundamentals of Digital Marketing (ID: 453421024) and BCA degree.',
    canonical: '/certifications/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Certifications',
  },
  blog: {
    title: 'SEO, Marketing & Development Insights | Blog',
    description: 'Educational articles on Technical SEO, Meta Ads, Google Ads, web development, and AI automation by Pratheesh Clement (Pratheesh).',
    canonical: '/blog/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Blog',
  },
  contact: {
    title: 'Contact Pratheesh Clement | Digital Marketing & Web Development',
    description: 'Get in touch with Pratheesh Clement (Pratheesh) for digital marketing, SEO, web development, or AI automation projects based in Vadalur, Tamil Nadu.',
    canonical: '/contact/',
    ogImage: '/assets/new4k3.jpeg',
    ogImageAlt: 'Pratheesh Clement — Contact',
  },
  privacy: {
    title: 'Privacy Policy | Pratheesh Clement',
    description: 'Privacy policy for pratheeshclement-cmd.github.io — data protection, cookie usage, Google Analytics 4, and Meta Pixel consent gating.',
    canonical: '/privacy-policy/',
  },
  terms: {
    title: 'Terms of Service | Pratheesh Clement',
    description: 'Terms of service for Pratheesh Clement\'s portfolio — usage terms, intellectual property, and AI Concierge usage guidelines.',
    canonical: '/terms/',
  },
  cookies: {
    title: 'Cookie Policy | Pratheesh Clement',
    description: 'Detailed cookie policy covering necessary, analytics (GA4), and marketing (Meta Pixel) cookies used on this website.',
    canonical: '/cookie-policy/',
  },
  notFound: {
    title: 'Page Not Found | Pratheesh Clement',
    description: 'The page you are looking for does not exist. Navigate to the Pratheesh OS homepage or explore projects, services, and blog.',
    canonical: '/',
    noindex: true,
  },
} as const;
