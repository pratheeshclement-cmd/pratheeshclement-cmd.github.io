import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentP, InfoCard } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Cookie } from 'lucide-react';
import { IDENTITY } from '../data/identity';

export const CookiePolicyPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.cookies);

  const schema = webPageSchema({
    url: '/cookie-policy/',
    name: 'Cookie Policy — Pratheesh Clement',
    description: PAGE_SEO.cookies.description,
    breadcrumbs: [{ name: 'Cookie Policy', item: '/cookie-policy/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="cookie-page-schema" />
      <Breadcrumb items={[{ label: 'Cookie Policy' }]} />

      <ProseContainer>
        <div style={{ marginBottom: 36 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Cookie size={14} color="var(--accent-primary)" />
            Cookie Usage & Preference Controls
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Cookie Policy
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            Last Updated: July 2026 · {IDENTITY.name} ({IDENTITY.legalName})
          </p>
        </div>

        <ContentH2>1. What Are Cookies?</ContentH2>
        <ContentP>
          Cookies and local storage items are small data files saved on your browser or device when you visit a website. They remember your preferences, maintain UI theme choices, and provide anonymous performance metrics.
        </ContentP>

        <ContentH2>2. Cookie Categories We Use</ContentH2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, marginBottom: 32 }}>
          <InfoCard accentColor="var(--accent-primary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              1. Essential / Necessary (Always Active)
            </h4>
            <ContentP style={{ fontSize: '0.92rem', margin: 0 }}>
              Required for basic website functionality, visual theme persistence (light/dark mode selection), and cookie consent preferences. These do not track personal identity.
            </ContentP>
          </InfoCard>

          <InfoCard accentColor="var(--accent-secondary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              2. Analytics Cookies (Gated — Requires Consent)
            </h4>
            <ContentP style={{ fontSize: '0.92rem', margin: 0 }}>
              Google Analytics 4 (GA4) — helps us understand page visit counts, Core Web Vitals performance, and traffic sources anonymously. Enabled only upon explicit user consent.
            </ContentP>
          </InfoCard>

          <InfoCard accentColor="var(--accent-warm)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              3. Marketing Cookies (Gated — Requires Consent)
            </h4>
            <ContentP style={{ fontSize: '0.92rem', margin: 0 }}>
              Meta Pixel — used for conversion measurement and custom audience building on Facebook and Instagram. Enabled only upon explicit user consent.
            </ContentP>
          </InfoCard>
        </div>

        <ContentH2>3. Managing Your Preferences</ContentH2>
        <ContentP>
          You can change or withdraw your cookie consent at any time by clicking the <strong>"Cookie Preferences"</strong> button in the footer of any page.
        </ContentP>
      </ProseContainer>
    </PageLayout>
  );
};

export default CookiePolicyPage;
