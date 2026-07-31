import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentP } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { FileText } from 'lucide-react';
import { IDENTITY } from '../data/identity';

export const TermsPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.terms);

  const schema = webPageSchema({
    url: '/terms/',
    name: 'Terms of Service — Pratheesh Clement',
    description: PAGE_SEO.terms.description,
    breadcrumbs: [{ name: 'Terms of Service', item: '/terms/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="terms-page-schema" />
      <Breadcrumb items={[{ label: 'Terms of Service' }]} />

      <ProseContainer>
        <div style={{ marginBottom: 36 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <FileText size={14} color="var(--accent-primary)" />
            Usage Terms & Intellectual Property
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
            Terms of Service
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            Last Updated: July 2026 · {IDENTITY.name} ({IDENTITY.legalName})
          </p>
        </div>

        <ContentH2>1. Acceptance of Terms</ContentH2>
        <ContentP>
          By accessing and navigating this portfolio website (<em>pratheeshclement-cmd.github.io</em>), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using the website.
        </ContentP>

        <ContentH2>2. Intellectual Property Rights</ContentH2>
        <ContentP>
          All content on this website — including custom UI designs, source code, interactive canvas implementations, case study analyses, and branding assets — is the intellectual property of <strong>{IDENTITY.name}</strong> unless otherwise stated. Unattributed copying or commercial redistribution without prior written permission is strictly prohibited.
        </ContentP>

        <ContentH2>3. AI Concierge Usage</ContentH2>
        <ContentP>
          The integrated AI Concierge provides intelligent assistance based on public portfolio data. While engineered for precision, response outputs are provided for informational purposes and do not constitute binding legal contracts or financial proposals.
        </ContentP>

        <ContentH2>4. External Links</ContentH2>
        <ContentP>
          This website may contain links to external sites (such as GitHub, LinkedIn, and Instagram). We are not responsible for the content, privacy practices, or accuracy of third-party websites.
        </ContentP>
      </ProseContainer>
    </PageLayout>
  );
};

export default TermsPage;
