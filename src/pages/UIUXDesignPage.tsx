import React from 'react';
import { useSEOMeta } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Palette, Smartphone, Eye, Sparkles, Layout, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { navigateTo } from '../router/useRouter';

export const UIUXDesignPage: React.FC = () => {
  useSEOMeta({
    title: 'UI/UX Design & Interface Architecture Guide',
    description: 'Explore UI/UX design principles, responsive layouts, glassmorphism systems, component accessibility, WCAG compliance, and micro-interactions by Pratheesh Clement.',
    canonical: '/ui-ux-design/',
    ogImage: '/assets/pratheesh-desktop.jpg',
    ogImageAlt: 'Pratheesh Clement — UI/UX Design',
  });

  const schema = webPageSchema({
    url: '/ui-ux-design/',
    name: 'UI/UX Design & Interface Architecture Guide',
    description: 'Explore UI/UX design principles, responsive layouts, glassmorphism systems, component accessibility, WCAG compliance, and micro-interactions by Pratheesh Clement.',
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'UI/UX Design', item: '/ui-ux-design/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="uiux-page-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'UI/UX Design' },
        ]}
      />

      <ProseContainer>
        {/* Header Title Banner */}
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }}>
            <Palette size={14} />
            User Interface & Experience Design
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
            UI/UX Design & Interface Architecture
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Designing modern, accessible, and conversion-focused user interfaces that combine clean visual hierarchy, glassmorphic design systems, responsive typography, and intuitive user flows.
          </p>
        </div>

        {/* Skill Tags */}
        <SkillGrid
          items={[
            'UI Design Systems',
            'UX User Flows',
            'Glassmorphism Aesthetic',
            'Responsive Grid Layouts',
            'Typography Systems',
            'Figma & Prototyping',
            'WCAG Accessibility',
            'Micro-Interactions',
            'Touch Target Optimization',
            'Design Token Architecture',
          ]}
          accentColor="var(--accent-tertiary)"
        />

        {/* Section 1: UI vs UX */}
        <ContentH2>1. Defining UI vs. UX in Web Engineering</ContentH2>
        <ContentP>
          While User Experience (UX) and User Interface (UI) design are closely linked, they address different aspects of digital product design:
        </ContentP>

        <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 28 }}>
          <li>
            <strong>User Experience (UX):</strong> The underlying structure, information architecture, user journey, task efficiency, accessibility, and emotional response of interacting with a web application. UX ensures that users accomplish their goals with minimal friction.
          </li>
          <li>
            <strong>User Interface (UI):</strong> The visual presentation, component styling, color palettes, typography hierarchy, visual feedback, spatial motion, and glassmorphic micro-interactions that make a digital product distinct, engaging, and polished.
          </li>
        </ul>

        {/* Section 2: Core Design System Principles */}
        <ContentH2>2. Core Interface Design Principles</ContentH2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '24px 0 40px' }}>
          <InfoCard accentColor="var(--accent-primary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Visual Hierarchy & Whitespace
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Guiding the user's eye naturally through typography scale, font weights, contrasting accent colors, and generous whitespace breathing room.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-tertiary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Glassmorphism & Design Tokens
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Utilizing CSS variables (`--glass-bg`, `--glass-border`, `--radius-md`) to build reusable frosted glass panels with subtle ambient backlights.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-mint)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              WCAG Accessibility & Touch Targets
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Ensuring minimum 4.5:1 color contrast ratios, 44x44px touch targets, visible keyboard focus indicators, and reduced-motion support.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-warm)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Readability & Line Length
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Constraining long-form body text containers to 65–85 characters per line (`max-width: 760px`) to prevent eye fatigue during reading.
            </p>
          </InfoCard>
        </div>

        {/* Section 3: UI/UX Decisions Behind Pratheesh OS */}
        <ContentH2>3. First-Hand Case Evidence: UI/UX Decisions Behind Pratheesh OS</ContentH2>
        <ContentP>
          This portfolio website (Pratheesh OS) serves as a live, practical case study of custom UI/UX design architecture. Key interface decisions and trade-offs include:
        </ContentP>

        <InfoCard accentColor="var(--accent-tertiary)">
          <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8 }}>
            Pratheesh OS Interface Design Trade-offs & Solutions:
          </h4>
          <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.85, margin: 0 }}>
            <li><strong>Spatial Navigation & Command Palette:</strong> Providing multiple navigation channels — continuous scroll, floating navbar, Spotlight command search (`⌘K`), and an intelligent AI Concierge assistant.</li>
            <li><strong>Responsive Vertical Services Architecture:</strong> Redesigned the Services section from a squeezed desktop flex row into a mobile-first vertical card layout with 44px touch targets and fluid text wrapping.</li>
            <li><strong>Accessible Motion Systems:</strong> Custom React hooks (`useReducedMotion`) automatically disable 3D camera transforms and heavy tilt effects when users enable prefers-reduced-motion in OS settings.</li>
            <li><strong>Responsive Image Payload Optimization:</strong> Converted 5.2 MB hero photography into responsive <code>&lt;picture&gt;</code> elements (<code>srcSet</code>), serving a tiny 58 KB WebP derivative on mobile screens.</li>
          </ul>
        </InfoCard>

        {/* Section 4: Real Project Case Studies */}
        <ContentH2>4. Related UI/UX Project Case Studies</ContentH2>
        <ContentP>
          Explore interface design implementations in the <a href="/projects/restaurant-branding-web/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Restaurant Branding Web Layout</a>, <a href="/projects/portfolio-redesign/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Personal Portfolio Redesign</a>, and <a href="/projects/pratheesh-os/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Pratheesh OS Architecture</a> case studies.
        </ContentP>

        {/* Explore Related Topic Pillars Hub */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', margin: '40px 0' }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-tertiary)" />
            Explore Related Discipline Guides & Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Web Development Architecture', href: '/web-development/' },
              { label: 'Technical SEO Strategy', href: '/seo/' },
              { label: 'Blog: Search-Friendly React Portfolios', href: '/blog/building-search-friendly-react-portfolios/' },
              { label: 'Pratheesh OS Case Study', href: '/projects/pratheesh-os/' },
              { label: 'Restaurant Layout Case Study', href: '/projects/restaurant-branding-web/' },
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
          heading="Looking for High-End UI/UX Design?"
          description="Let's design a modern, accessible, and conversion-focused interface system for your web application."
          primaryLabel="Discuss UI/UX Project"
          primaryHref="/contact/"
          secondaryLabel="View Pratheesh OS Case Study"
          secondaryHref="/projects/pratheesh-os/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default UIUXDesignPage;
