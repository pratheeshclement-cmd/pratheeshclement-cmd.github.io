import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentP, InfoCard } from './components/PageLayout';
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
            Usage Terms &amp; Intellectual Property
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
            Last Updated: August 2026 · {IDENTITY.name} ({IDENTITY.legalName})
          </p>
        </div>

        <ContentP>
          Please read these Terms of Service carefully before using the website at <em>pratheeshclement-cmd.github.io</em>. By accessing any page of this website, you confirm that you have read, understood, and agreed to be bound by these terms in their entirety.
        </ContentP>

        <ContentH2>1. Acceptance of Terms</ContentH2>
        <ContentP>
          By accessing and navigating this portfolio website (<em>pratheeshclement-cmd.github.io</em>), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you must refrain from using this website. These terms apply to all visitors, readers, and anyone who accesses or uses this website.
        </ContentP>

        <ContentH2>2. Intellectual Property Rights</ContentH2>
        <ContentP>
          All content on this website — including custom UI designs, source code, interactive canvas implementations, case study analyses, blog articles, written content, photography, branding assets, and technical documentation — is the intellectual property of <strong>{IDENTITY.name}</strong> ({IDENTITY.legalName}) unless otherwise stated. This content is protected under applicable copyright and intellectual property laws.
        </ContentP>
        <ContentP>
          You may read, link to, and share individual pages for non-commercial purposes provided that appropriate attribution is given and no content is reproduced wholesale. Unattributed copying, commercial redistribution, or use of this website's content in AI training datasets without prior written permission is strictly prohibited.
        </ContentP>

        <ContentH2>3. Educational Purpose &amp; No Professional Advice</ContentH2>
        <ContentP>
          All articles, guides, case studies, and technical content published on this website are provided for <strong>general educational and informational purposes only</strong>. They represent the author's personal professional experience and perspective.
        </ContentP>
        <ContentP>
          Nothing on this website constitutes professional legal, financial, tax, medical, or investment advice. The strategies and techniques described reflect general industry practice and the author's own experience. Results from applying any technique described will vary depending on your specific circumstances, industry, competitive environment, and execution quality. You should consult qualified professionals before making significant business or financial decisions.
        </ContentP>

        <ContentH2>4. AI Concierge Disclaimer</ContentH2>
        <ContentP>
          This website includes an integrated AI Concierge assistant that provides information based on publicly available portfolio data. While engineered for accuracy, AI-generated responses are provided for informational purposes only and may not always reflect current facts. AI responses do not constitute binding legal contracts, official quotations, financial proposals, or guaranteed service agreements. For definitive information, contact {IDENTITY.name} directly via the contact details provided.
        </ContentP>

        <ContentH2>5. External Links</ContentH2>
        <ContentP>
          This website contains links to third-party external websites, platforms, and services (including GitHub, LinkedIn, Instagram, Facebook, Google tools, and other referenced resources). These links are provided as a convenience and for informational purposes. We exercise no control over the content, accuracy, privacy practices, or availability of those external sites. The inclusion of any link does not imply endorsement, sponsorship, or affiliation with the linked site or organisation.
        </ContentP>

        <ContentH2>6. Limitation of Liability</ContentH2>
        <ContentP>
          To the maximum extent permitted by applicable law, {IDENTITY.name} shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, this website or any content found on it. This includes but is not limited to damages for loss of business, loss of revenue, loss of data, or errors in content.
        </ContentP>
        <ContentP>
          This website is provided on an "as is" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
        </ContentP>

        <ContentH2>7. Governing Law</ContentH2>
        <ContentP>
          These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from your use of this website that cannot be resolved amicably shall be subject to the exclusive jurisdiction of the courts located in Tamil Nadu, India.
        </ContentP>

        <ContentH2>8. Changes to These Terms</ContentH2>
        <ContentP>
          {IDENTITY.name} reserves the right to modify these Terms of Service at any time without prior notice. Changes become effective immediately upon publication to this page. The "Last Updated" date at the top of this page reflects when changes were last made. Continued use of this website after any changes constitutes your acceptance of the new terms. We encourage you to review this page periodically.
        </ContentP>

        <InfoCard accentColor="var(--accent-primary)">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            For any terms-related questions or requests, contact {IDENTITY.name} at <a href={`mailto:${IDENTITY.contact.email}`} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{IDENTITY.contact.email}</a>.
          </div>
        </InfoCard>
      </ProseContainer>
    </PageLayout>
  );
};

export default TermsPage;
