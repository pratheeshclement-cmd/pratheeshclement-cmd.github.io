import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentP, InfoCard } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { ShieldCheck } from 'lucide-react';
import { IDENTITY } from '../data/identity';

export const PrivacyPolicyPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.privacy);

  const schema = webPageSchema({
    url: '/privacy-policy/',
    name: 'Privacy Policy — Pratheesh Clement',
    description: PAGE_SEO.privacy.description,
    breadcrumbs: [{ name: 'Privacy Policy', item: '/privacy-policy/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="privacy-page-schema" />
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      <ProseContainer>
        <div style={{ marginBottom: 36 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="var(--accent-primary)" />
            Data Protection & Transparency
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            Last Updated: July 2026 · {IDENTITY.name} ({IDENTITY.legalName})
          </p>
        </div>

        <ContentH2>1. Data Controller & Overview</ContentH2>
        <ContentP>
          This website (<em>pratheeshclement-cmd.github.io</em>) is owned and operated by <strong>{IDENTITY.name}</strong> (legal name <em>{IDENTITY.legalName}</em>), based in {IDENTITY.location.display}. We respect your privacy and are committed to protecting your personal data in compliance with general data protection regulations (GDPR) and local privacy frameworks.
        </ContentP>

        <ContentH2>2. Information We Collect</ContentH2>
        <ContentP>
          We collect information strictly necessary to provide a performant and interactive web experience:
        </ContentP>
        <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 20 }}>
          <li><strong>Voluntary Contact Data:</strong> Name, email address, and message content submitted via contact forms or direct email/WhatsApp links.</li>
          <li><strong>Technical & Usage Data:</strong> IP address, browser type, device specifications, and page interaction metrics collected via Google Analytics 4 (GA4) only upon explicit consent.</li>
          <li><strong>Cookie Preferences:</strong> Local storage settings storing your consent preferences for analytics and marketing.</li>
        </ul>

        <ContentH2>3. Analytics & AdSense Integration</ContentH2>
        <ContentP>
          In compliance with strict privacy standards, third-party analytics (Google Analytics) and tracking pixels (Meta Pixel) are <strong>gated behind our Granular Cookie Consent System</strong>. No non-essential tracking scripts execute until you explicitly click "Accept All" or enable them in Cookie Preferences.
        </ContentP>

        <ContentH2>4. Your Rights & Consent Management</ContentH2>
        <ContentP>
          You have the right to inspect, correct, or delete any personal data you submit to us. You can update or withdraw your cookie consent at any time by clicking the <strong>"Cookie Preferences"</strong> button located in the website footer.
        </ContentP>

        <InfoCard accentColor="var(--accent-primary)">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            For privacy inquiries, contact {IDENTITY.name} at <a href={`mailto:${IDENTITY.contact.email}`} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{IDENTITY.contact.email}</a>.
          </div>
        </InfoCard>
      </ProseContainer>
    </PageLayout>
  );
};

export default PrivacyPolicyPage;
