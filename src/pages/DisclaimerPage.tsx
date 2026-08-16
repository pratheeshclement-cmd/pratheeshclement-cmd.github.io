import React from 'react';
import { useSEOMeta } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentP, InfoCard } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { AlertTriangle } from 'lucide-react';
import { IDENTITY } from '../data/identity';

export const DisclaimerPage: React.FC = () => {
  useSEOMeta({
    title: 'Disclaimer — Pratheesh Clement',
    description: 'Professional disclaimer for pratheeshclement-cmd.github.io. All content is for educational and informational purposes only and does not constitute professional legal, financial, or business advice.',
    canonical: '/disclaimer/',
  });

  const schema = webPageSchema({
    url: '/disclaimer/',
    name: 'Disclaimer — Pratheesh Clement',
    description: 'Professional disclaimer for the Pratheesh Clement portfolio website.',
    breadcrumbs: [{ name: 'Disclaimer', item: '/disclaimer/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="disclaimer-page-schema" />
      <Breadcrumb items={[{ label: 'Disclaimer' }]} />

      <ProseContainer>
        <div style={{ marginBottom: 36 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} color="var(--accent-warm)" />
            Professional Disclosure
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.15, fontWeight: 700, marginBottom: 16 }}>
            Disclaimer
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            Last Updated: August 2026 · {IDENTITY.name} ({IDENTITY.legalName})
          </p>
        </div>

        <ContentP>
          The information provided on this website (<em>pratheeshclement-cmd.github.io</em>) is for <strong>general educational and informational purposes only</strong>. By using this website, you accept this disclaimer in full.
        </ContentP>

        <ContentH2>No Professional Advice</ContentH2>
        <ContentP>
          Nothing published on this website — including blog articles, service descriptions, case studies, project writeups, tool guides, or technical explanations — should be interpreted as professional legal, financial, tax, accounting, medical, or investment advice. The content reflects the author's personal professional experience and opinions. If you require professional advice tailored to your specific circumstances, you should consult a qualified professional in the relevant field.
        </ContentP>

        <ContentH2>No Guaranteed Results</ContentH2>
        <ContentP>
          Any outcomes described in case studies or service descriptions reflect specific historical engagements under specific conditions. They are illustrative of the type of work undertaken and are not guarantees or predictions of future results. Digital marketing, SEO, and paid advertising outcomes depend on many variables outside any individual's control, including platform algorithm changes, market competition, audience behavior, and execution quality.
        </ContentP>

        <ContentH2>Third-Party Links and Resources</ContentH2>
        <ContentP>
          This website contains links to third-party websites, tools, platforms, and services. These are provided for informational and convenience purposes. {IDENTITY.name} does not endorse, sponsor, or guarantee the accuracy, completeness, or reliability of any third-party content or service.
        </ContentP>

        <ContentH2>AI-Generated Content</ContentH2>
        <ContentP>
          This website includes an AI Concierge assistant that generates responses based on publicly available portfolio data. AI-generated responses may not always be accurate, complete, or up to date. They are provided for informational and exploratory purposes only and do not constitute binding commitments, official quotations, or professional advice.
        </ContentP>

        <ContentH2>Accuracy and Completeness</ContentH2>
        <ContentP>
          While every effort is made to ensure that the information on this website is accurate and current, {IDENTITY.name} makes no warranties or representations of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information on this website for any purpose. Content may be updated, corrected, or removed without notice.
        </ContentP>

        <InfoCard accentColor="var(--accent-warm)">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            For questions about this disclaimer, contact {IDENTITY.name} at <a href={`mailto:${IDENTITY.contact.email}`} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{IDENTITY.contact.email}</a>. See also the <a href="/terms/" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Terms of Service</a> and <a href="/privacy-policy/" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Privacy Policy</a>.
          </div>
        </InfoCard>
      </ProseContainer>
    </PageLayout>
  );
};

export default DisclaimerPage;
