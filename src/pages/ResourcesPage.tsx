import React from 'react';
import { useSEOMeta } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { ExternalLink, Search, BarChart2, Target, Zap, Layout, Bot, Globe } from 'lucide-react';
import { IDENTITY } from '../data/identity';

interface Resource {
  name: string;
  url: string;
  description: string;
  category: string;
}

const RESOURCES: { category: string; icon: React.FC<{ size?: number; color?: string }>; accentColor: string; items: Resource[] }[] = [
  {
    category: 'Technical SEO & Search',
    icon: Search,
    accentColor: 'var(--accent-secondary)',
    items: [
      { name: 'Google Search Console', url: 'https://search.google.com/search-console', description: 'The definitive tool for monitoring search performance, URL indexation, Core Web Vitals field data, and coverage issues directly from Google.', category: 'SEO' },
      { name: 'Google PageSpeed Insights', url: 'https://pagespeed.web.dev/', description: 'Measures both lab (Lighthouse) and real-world (CrUX) Core Web Vitals for any URL. Essential for diagnosing LCP, INP, and CLS issues.', category: 'SEO' },
      { name: 'Screaming Frog SEO Spider', url: 'https://www.screamingfrog.co.uk/seo-spider/', description: 'Desktop crawler for auditing on-page SEO elements: title tags, meta descriptions, canonical URLs, redirect chains, and broken links.', category: 'SEO' },
      { name: 'Google Rich Results Test', url: 'https://search.google.com/test/rich-results', description: 'Validates structured data (JSON-LD) and previews how rich snippets will appear in Google Search results.', category: 'SEO' },
    ],
  },
  {
    category: 'Analytics & Conversion Tracking',
    icon: BarChart2,
    accentColor: 'var(--accent-primary)',
    items: [
      { name: 'Google Analytics 4 (GA4)', url: 'https://analytics.google.com/', description: 'Google\'s event-based analytics platform for tracking website traffic, user journeys, conversion events, and audience insights.', category: 'Analytics' },
      { name: 'Google Tag Manager', url: 'https://tagmanager.google.com/', description: 'Tag management system for deploying analytics, conversion pixels, and tracking scripts without modifying source code.', category: 'Analytics' },
      { name: 'Meta Events Manager', url: 'https://business.facebook.com/events_manager', description: 'Meta\'s tool for monitoring pixel events, testing CAPI integration, and managing custom conversions for Facebook and Instagram campaigns.', category: 'Analytics' },
      { name: 'Looker Studio', url: 'https://lookerstudio.google.com/', description: 'Free data visualization and reporting tool from Google, ideal for creating shareable dashboards from GA4, Google Ads, and Search Console data.', category: 'Analytics' },
    ],
  },
  {
    category: 'Paid Advertising',
    icon: Target,
    accentColor: 'var(--accent-warm)',
    items: [
      { name: 'Google Ads', url: 'https://ads.google.com/', description: 'The primary platform for running Search, Display, Shopping, YouTube, and Performance Max campaigns targeting Google users globally.', category: 'Paid Ads' },
      { name: 'Meta Ads Manager', url: 'https://adsmanager.facebook.com/', description: 'Campaign management platform for Facebook and Instagram advertising. Manages campaign objectives, audience targeting, creative, and bidding.', category: 'Paid Ads' },
      { name: 'Google Keyword Planner', url: 'https://ads.google.com/home/tools/keyword-planner/', description: 'Keyword research tool within Google Ads for discovering search volume, competition levels, and cost-per-click estimates for target keywords.', category: 'Paid Ads' },
    ],
  },
  {
    category: 'Web Development & Performance',
    icon: Zap,
    accentColor: 'var(--accent-mint)',
    items: [
      { name: 'Vite', url: 'https://vitejs.dev/', description: 'Next-generation frontend build tool for JavaScript and TypeScript projects. Significantly faster than webpack for development and production builds.', category: 'Web Dev' },
      { name: 'WebPageTest', url: 'https://www.webpagetest.org/', description: 'Advanced performance testing tool providing waterfall charts, filmstrip views, and real-device testing from multiple global locations.', category: 'Web Dev' },
      { name: 'Lighthouse', url: 'https://developer.chrome.com/docs/lighthouse/', description: 'Built into Chrome DevTools. Audits performance, accessibility, SEO, and best practices, providing a lab-based score with specific improvement recommendations.', category: 'Web Dev' },
      { name: 'Can I Use', url: 'https://caniuse.com/', description: 'Browser compatibility reference for CSS, HTML, JavaScript, and Web API features. Essential for checking cross-browser support before using modern features.', category: 'Web Dev' },
    ],
  },
  {
    category: 'Design & Creative',
    icon: Layout,
    accentColor: 'var(--accent-secondary)',
    items: [
      { name: 'Figma', url: 'https://figma.com/', description: 'Collaborative interface design tool for wireframes, UI mockups, design systems, and interactive prototypes. The industry standard for web and product design.', category: 'Design' },
      { name: 'Coolors', url: 'https://coolors.co/', description: 'Color palette generator for creating and exploring harmonious color schemes. Includes contrast checking for accessibility compliance.', category: 'Design' },
      { name: 'Google Fonts', url: 'https://fonts.google.com/', description: 'Free, open-source font library from Google with 1,500+ typefaces optimized for web delivery. Supports subsetting to minimize font loading impact.', category: 'Design' },
    ],
  },
  {
    category: 'AI & Automation',
    icon: Bot,
    accentColor: 'var(--accent-tertiary)',
    items: [
      { name: 'OpenAI Platform', url: 'https://platform.openai.com/', description: 'API access to GPT-4, o1, and other OpenAI models for building AI-powered applications, content generation pipelines, and intelligent chatbots.', category: 'AI' },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/', description: 'Web-based IDE for prototyping with Gemini models. Useful for testing prompts, multimodal inputs, and building lightweight AI features.', category: 'AI' },
      { name: 'Zapier', url: 'https://zapier.com/', description: 'No-code automation platform for connecting apps and triggering workflows. Useful for automating lead notifications, CRM updates, and reporting tasks.', category: 'AI' },
    ],
  },
];

export const ResourcesPage: React.FC = () => {
  useSEOMeta({
    title: 'Digital Marketing & Web Development Resources — Pratheesh Clement',
    description: 'A curated collection of professional tools for technical SEO, analytics, paid advertising, web development, design, and AI automation — organized by category with honest descriptions.',
    canonical: '/resources/',
  });

  const schema = webPageSchema({
    url: '/resources/',
    name: 'Digital Marketing & Web Development Resources',
    description: 'Curated professional tools for SEO, analytics, paid advertising, web development, design, and AI automation.',
    type: 'CollectionPage',
    breadcrumbs: [{ name: 'Resources', item: '/resources/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="resources-page-schema" />
      <Breadcrumb items={[{ label: 'Resources' }]} />

      <ProseContainer>
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Globe size={14} color="var(--accent-primary)" />
            Curated Professional Toolset
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.15, fontWeight: 700, marginBottom: 20 }}>
            Digital Marketing &amp; Web Development Resources
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            A curated collection of professional tools I use and recommend across SEO, analytics, paid advertising, web development, design, and AI automation. Each tool is linked directly with an honest, practical description — no affiliate links, no fluff.
          </p>
        </div>

        {RESOURCES.map(({ category, icon: Icon, accentColor, items }) => (
          <div key={category} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.25, marginTop: 40, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={20} color={accentColor} />
              {category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map(({ name, url, description }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', padding: '18px 22px', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', textDecoration: 'none', backdropFilter: 'blur(8px)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700 }}>{name}</span>
                    <ExternalLink size={13} color="var(--text-tertiary)" />
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{description}</p>
                </a>
              ))}
            </div>
          </div>
        ))}

        <InfoCard accentColor="var(--accent-primary)">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Note:</strong> These are tools used in professional practice. None of the links above are affiliate or sponsored links. Tool inclusion reflects genuine professional use and recommendation.
          </div>
        </InfoCard>

        <PageCTA
          heading="Want to Know How These Tools Fit Together?"
          description="Read the in-depth guides on SEO, digital marketing strategy, and web development to see how these tools are applied in real projects."
          primaryLabel="Explore Articles"
          primaryHref="/blog/"
          secondaryLabel="View Services"
          secondaryHref="/services/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default ResourcesPage;
