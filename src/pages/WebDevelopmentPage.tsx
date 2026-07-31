import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Code2, Globe, Cpu, CheckCircle2, Layers, Zap } from 'lucide-react';
import { navigateTo } from '../router/useRouter';

export const WebDevelopmentPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.webDev);

  const schema = webPageSchema({
    url: '/web-development/',
    name: 'Modern Web Development & Frontend Architecture Guide',
    description: PAGE_SEO.webDev.description,
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'Web Development', item: '/web-development/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="webdev-page-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'Web Development' },
        ]}
      />

      <ProseContainer>
        {/* Header Title Banner */}
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Code2 size={14} color="var(--accent-mint)" />
            Frontend Architecture & Web Engineering
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Modern Web Development & Frontend Architecture
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Building fast, responsive, accessible, and search-optimized web applications with clean TypeScript, React 19, Vite, and spatial motion engineering.
          </p>
        </div>

        {/* Skill Tags */}
        <SkillGrid
          items={[
            'React 19 & TypeScript',
            'Vite & Rollup Bundling',
            'Semantic HTML5 & WCAG',
            'CSS Custom Properties',
            'GSAP & Lenis Motion',
            'Static HTML Prerendering',
            'Core Web Vitals',
            'Git & GitHub Pages',
            'JSON-LD Schema Integration',
            'Component Decoupling',
          ]}
          accentColor="var(--accent-mint)"
        />

        {/* Section 1: Modern Frontend Architecture */}
        <ContentH2>1. Core Principles of Modern Frontend Engineering</ContentH2>
        <ContentP>
          Modern frontend web development requires more than rendering visual UI elements. A production-ready web application must be engineered for speed, type safety, accessibility compliance, search engine crawlability, and maintainable component architecture.
        </ContentP>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '24px 0 40px' }}>
          <InfoCard accentColor="var(--accent-mint)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              React 19 & TypeScript Strictness
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Writing strongly-typed React components with strict TypeScript interfaces (`Project`, `Service`, `AIMessage`) to prevent runtime crashes.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-primary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Vite & Code Splitting
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Utilizing Vite HMR and dynamic `React.lazy()` imports to split heavy route chunks and minimize initial JavaScript bundles.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-secondary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Semantic HTML5 & Accessibility
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Structuring DOM nodes with standard <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;footer&gt;</code> elements for assistive technology and crawlers.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-tertiary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Performance & Core Web Vitals
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Optimizing Largest Contentful Paint (LCP) and eliminating Cumulative Layout Shift (CLS) with responsive image derivatives (<code>srcSet</code>).
            </p>
          </InfoCard>
        </div>

        {/* Section 2: React SPA SEO Architecture Case Study */}
        <ContentH2>2. First-Hand Evidence: React SPA SEO & Prerendering Architecture</ContentH2>
        <ContentP>
          Single Page Applications (SPAs) built with client-side React often encounter search indexation bottlenecks. Here is how Pratheesh OS solves React SPA SEO without migrating away from Vite or adding heavy server infrastructure:
        </ContentP>

        <InfoCard accentColor="var(--accent-mint)">
          <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={18} color="var(--accent-mint)" />
            Pratheesh OS Technical Solutions & Trade-offs:
          </h4>
          <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.85, margin: 0 }}>
            <li><strong>Static HTML Prerendering Engine (<code>scripts/prerender.js</code>):</strong> Pre-generates 26 static <code>index.html</code> files in <code>dist/</code> containing route-specific <code>&lt;title&gt;</code>, <code>&lt;meta description&gt;</code>, <code>&lt;link rel="canonical"&gt;</code>, and pre-baked HTML prose inside <code>&lt;div id="root"&gt;</code>.</li>
            <li><strong>GitHub Pages SPA Routing Fallback (<code>404.html</code>):</strong> Direct deep link requests (e.g. <code>/web-development/</code>) hit <code>404.html</code>, encoding the path into a query parameter which <code>useRouter.ts</code> decodes and restores via <code>history.replaceState()</code>.</li>
            <li><strong>Native Momentum Touch Scrolling:</strong> Configured Lenis smooth scroll (<code>syncTouch: false</code>) to ensure touch devices retain native momentum scrolling without input latency.</li>
            <li><strong>Responsive Picture Elements:</strong> Replaced master 5.2 MB hero imagery with <code>&lt;picture&gt;</code> tags serving a 58 KB WebP derivative on mobile phones, cutting payload by 98.8%.</li>
          </ul>
        </InfoCard>

        {/* Section 3: Related Case Studies */}
        <ContentH2>3. Web Development Project Case Studies</ContentH2>
        <ContentP>
          Examine frontend engineering and architecture in the <a href="/projects/pratheesh-os/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Pratheesh OS Architecture</a>, <a href="/projects/portfolio-redesign/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Portfolio Redesign</a>, and <a href="/projects/restaurant-branding-web/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Restaurant Branding Layout</a> case studies.
        </ContentP>

        {/* Explore Related Topic Pillars Hub */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', margin: '40px 0' }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-mint)" />
            Explore Related Discipline Guides & Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Technical SEO Strategy', href: '/seo/' },
              { label: 'UI/UX Interface Design', href: '/ui-ux-design/' },
              { label: 'AI Tools & Automation', href: '/ai-automation/' },
              { label: 'Blog: React SEO Architecture', href: '/blog/building-search-friendly-react-portfolios/' },
              { label: 'Pratheesh OS Case Study', href: '/projects/pratheesh-os/' },
            ].map(link => (
              <button
                key={link.href}
                onClick={() => navigateTo(link.href)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {link.label} →
              </button>
            ))}
          </div>
        </div>

        {/* Page CTA */}
        <PageCTA
          heading="Need a Fast, SEO-Ready React Web Application?"
          description="Let's build your web project with clean TypeScript, modern component architecture, and sub-second performance."
          primaryLabel="Discuss Web Project"
          primaryHref="/contact/"
          secondaryLabel="View Pratheesh OS Case Study"
          secondaryHref="/projects/pratheesh-os/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default WebDevelopmentPage;
