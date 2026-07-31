import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ContentH2, ContentP, InfoCard, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Award, GraduationCap, CheckCircle2, ExternalLink } from 'lucide-react';
import { IDENTITY } from '../data/identity';

export const CertificationsPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.certifications);

  const schema = webPageSchema({
    url: '/certifications/',
    name: 'Certifications & Academic Qualifications',
    description: PAGE_SEO.certifications.description,
    breadcrumbs: [{ name: 'Certifications', item: '/certifications/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="cert-schema" />
      <Breadcrumb items={[{ label: 'Certifications & Education' }]} />

      <div style={{ marginBottom: 40 }}>
        <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Award size={14} color="var(--accent-mint)" />
          Verified Credentials
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
          Certifications & Academic Qualifications
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 760 }}>
          Official academic background and industry certifications verified by Google Skillshop, Interactive Advertising Bureau (IAB) Europe, and The Open University.
        </p>
      </div>

      <ContentH2>Verified Industry Certification</ContentH2>
      <div style={{ marginBottom: 40 }}>
        <InfoCard accentColor="var(--accent-mint)">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Award size={26} color="var(--accent-mint)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                  Fundamentals of Digital Marketing
                </h3>
                <span className="pill" style={{ borderColor: 'var(--accent-mint)', color: 'var(--accent-mint)', background: 'rgba(16,185,129,0.08)' }}>
                  Verified Credential
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: 4, marginBottom: 12 }}>
                Google Skillshop · Accredited by IAB Europe & The Open University
              </div>

              <ContentP style={{ fontSize: '0.94rem', marginBottom: 16 }}>
                Comprehensive 26-module certification covering search engine ranking fundamentals, content strategy, data analytics, email outreach, search engine optimization (SEO), display advertising, and e-commerce growth strategies.
              </ContentP>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: 10, display: 'inline-block' }}>
                <strong>Completion ID:</strong> 453421024 · Verified Record
              </div>
            </div>
          </div>
        </InfoCard>
      </div>

      <ContentH2>Academic Degree</ContentH2>
      <div style={{ marginBottom: 48 }}>
        <InfoCard accentColor="var(--accent-secondary)">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(14, 165, 233, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <GraduationCap size={26} color="var(--accent-secondary)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                Bachelor of Computer Applications (BCA)
              </h3>
              <div style={{ fontSize: '0.95rem', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: 4, marginBottom: 12 }}>
                Undergraduate Computer Science Degree
              </div>
              <ContentP style={{ fontSize: '0.94rem', marginBottom: 0 }}>
                Foundational computer science degree covering software engineering principles, database design (SQL/relational models), data structures, algorithms, object-oriented programming, web technologies, and system architecture.
              </ContentP>
            </div>
          </div>
        </InfoCard>
      </div>

      <PageCTA
        heading="Explore Pratheesh's Projects & Case Studies"
        description="See how these technical qualifications and digital marketing principles are applied in real projects."
        primaryLabel="View Projects"
        primaryHref="/projects/"
        secondaryLabel="About Pratheesh"
        secondaryHref="/about/"
      />
    </PageLayout>
  );
};

export default CertificationsPage;
