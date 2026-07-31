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
    document.title = `${title} | ${SITE_NAME}`;

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
      document.title = 'Pratheesh Clement | Digital Marketing Specialist & AI Enthusiast';
      setLink('canonical', `${BASE_URL}/`);
      setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    };
  }, [meta.title, meta.description, meta.canonical]);
}

// Pre-defined SEO configurations for each route
export const PAGE_SEO = {
  home: {
    title: 'Digital Marketing Specialist & AI Enthusiast',
    description: 'Official portfolio of Pratheesh Clement — Digital Marketing Specialist, Technical SEO, Meta Ads, Google Ads, Web Development, and AI Automation expert based in Vadalur, Tamil Nadu, India.',
    canonical: '/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Digital Marketing Specialist',
  },
  about: {
    title: 'About Pratheesh Clement',
    description: 'Learn about Pratheesh Clement — his background in digital marketing, SEO, web development, and AI automation. Currently Digital Marketer at JBHL Pvt Ltd, based in Vadalur, Tamil Nadu.',
    canonical: '/about/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — About',
  },
  projects: {
    title: 'Projects & Case Studies',
    description: 'Real digital marketing and web development projects by Pratheesh Clement — SEO growth campaigns, responsive web design, Meta Ads B2B funnels, and cinematic portfolio development.',
    canonical: '/projects/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Projects',
  },
  services: {
    title: 'Digital Marketing & Web Development Services',
    description: 'Explore services offered by Pratheesh Clement: Technical SEO, Google Ads, Meta Ads, React web development, AI automation, performance optimization, and personal branding.',
    canonical: '/services/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Services',
  },
  seo: {
    title: 'SEO & Search Optimization',
    description: 'Comprehensive Technical SEO services and knowledge — on-page optimization, schema markup, Core Web Vitals, keyword research, and search strategy by Pratheesh Clement.',
    canonical: '/seo/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — SEO Services',
  },
  digitalMarketing: {
    title: 'Digital Marketing Strategy',
    description: 'Full-funnel digital marketing strategy, channel planning, analytics, and conversion optimization by Pratheesh Clement — helping businesses grow their online presence measurably.',
    canonical: '/digital-marketing/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Digital Marketing',
  },
  metaAds: {
    title: 'Meta Ads — Facebook & Instagram Advertising',
    description: 'Meta Ads campaign management: custom audiences, Meta Pixel tracking, lead generation, retargeting, and CPL optimization by Pratheesh Clement.',
    canonical: '/meta-ads/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Meta Ads',
  },
  googleAds: {
    title: 'Google Ads — Search & Display Campaigns',
    description: 'Google Ads campaign strategy: keyword planning, search intent, conversion tracking, bidding, and ongoing optimization by Pratheesh Clement.',
    canonical: '/google-ads/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Google Ads',
  },
  webDev: {
    title: 'Web Development',
    description: 'Modern web development using React, TypeScript, Vite, GSAP, and accessible HTML/CSS. Performance-first, SEO-ready frontend development by Pratheesh Clement.',
    canonical: '/web-development/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Web Development',
  },
  aiAutomation: {
    title: 'AI Tools & Automation',
    description: 'AI-assisted workflows, prompt engineering, API integrations, and automation pipelines combining marketing and development — by Pratheesh Clement.',
    canonical: '/ai-automation/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — AI Automation',
  },
  uiUxDesign: {
    title: 'UI/UX Design & Interface Architecture',
    description: 'Explore UI/UX design principles, responsive layouts, glassmorphism systems, component accessibility, and micro-interactions by Pratheesh Clement.',
    canonical: '/ui-ux-design/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — UI/UX Design',
  },
  googleSearchConsole: {
    title: 'Google Search Console & Indexing Architecture',
    description: 'Master Google Search Console, URL inspection, index coverage, XML sitemap auditing, canonical URL resolution, and Core Web Vitals performance.',
    canonical: '/google-search-console/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Google Search Console Guide',
  },
  freelancing: {
    title: 'Freelance Digital Marketing & Web Development Services',
    description: 'Professional freelance consulting in Technical SEO, React web development, Meta & Google Ads campaigns, and AI automation by Pratheesh Clement.',
    canonical: '/freelancing/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Freelance Digital Marketing & Development',
  },
  certifications: {
    title: 'Certifications & Education',
    description: 'Verified credentials of Pratheesh Clement — Google Skillshop Fundamentals of Digital Marketing (ID: 453421024, accredited by IAB Europe & The Open University) and BCA degree.',
    canonical: '/certifications/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Certifications',
  },
  blog: {
    title: 'SEO, Marketing & Development Insights',
    description: 'Educational articles on Technical SEO, Meta Ads, Google Ads, web development, and AI automation by Pratheesh Clement — practical knowledge from real project experience.',
    canonical: '/blog/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Blog',
  },
  contact: {
    title: 'Contact Pratheesh Clement',
    description: 'Get in touch with Pratheesh Clement for digital marketing, SEO, web development, or AI automation projects. Available for remote collaboration worldwide from Vadalur, Tamil Nadu.',
    canonical: '/contact/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Contact',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Privacy policy for pratheeshclement-cmd.github.io — how your data is handled, cookie usage, Google Analytics 4, and Meta Pixel consent gating.',
    canonical: '/privacy-policy/',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms of service for Pratheesh Clement\'s portfolio — usage terms, intellectual property, and AI Concierge usage guidelines.',
    canonical: '/terms/',
  },
  cookies: {
    title: 'Cookie Policy',
    description: 'Detailed cookie policy covering necessary, analytics (GA4), and marketing (Meta Pixel) cookies used on this website.',
    canonical: '/cookie-policy/',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist. Navigate to the Pratheesh OS homepage or explore projects, services, and blog.',
    canonical: '/',
    noindex: true,
  },
} as const;
