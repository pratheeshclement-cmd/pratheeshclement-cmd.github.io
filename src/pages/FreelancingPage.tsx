import React from 'react';
import { useSEOMeta } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Briefcase, CheckCircle2, UserCheck, Mail, MapPin, Layers } from 'lucide-react';
import { navigateTo } from '../router/useRouter';
import { IDENTITY } from '../data/identity';

export const FreelancingPage: React.FC = () => {
  useSEOMeta({
    title: 'Freelance Digital Marketing & Web Development Services',
    description: 'Professional freelance consulting in Technical SEO, React web development, Meta & Google Ads campaigns, and AI automation by Pratheesh Clement.',
    canonical: '/freelancing/',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: 'Pratheesh Clement — Freelance Digital Marketing & Development',
  });

  const schema = webPageSchema({
    url: '/freelancing/',
    name: 'Freelance Digital Marketing & Web Development Services',
    description: 'Professional freelance consulting in Technical SEO, React web development, Meta & Google Ads campaigns, and AI automation by Pratheesh Clement.',
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'Freelancing', item: '/freelancing/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="freelancing-page-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'Freelance Services' },
        ]}
      />

      <ProseContainer>
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: 'var(--accent-mint)', color: 'var(--accent-mint)' }}>
            <Briefcase size={14} />
            Professional Remote Consulting & Development
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
            Freelance Digital Marketing & Web Development
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Providing independent technical consulting, custom web application development, search engine optimization audits, and digital campaign management for businesses worldwide.
          </p>
        </div>

        <SkillGrid
          items={[
            'Technical SEO Audits',
            'React & TypeScript Web Apps',
            'Meta Ads Campaign Setup',
            'Google Ads Optimization',
            'UI/UX Design Architecture',
            'AI Workflow Automation',
            'Performance Optimization',
            'GA4 & Pixel Setup',
          ]}
          accentColor="var(--accent-mint)"
        />

        <ContentH2>1. Freelance Capabilities & Specializations</ContentH2>
        <ContentP>
          Working directly with founders, digital agencies, and business teams, I provide end-to-end technical execution across five core service areas:
        </ContentP>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 24, marginBottom: 40 }}>
          <InfoCard accentColor="var(--accent-primary)">
            <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Freelance Technical SEO
            </h4>
            <ContentP style={{ fontSize: '0.9rem', margin: 0 }}>
              Crawlability audits, JSON-LD schema graphs, Core Web Vitals optimization, and Search Console troubleshooting.
            </ContentP>
          </InfoCard>

          <InfoCard accentColor="var(--accent-secondary)">
            <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Freelance React Development
            </h4>
            <ContentP style={{ fontSize: '0.9rem', margin: 0 }}>
              Building fast, accessible, type-safe web applications using React 19, TypeScript, Vite, and GSAP motion.
            </ContentP>
          </InfoCard>

          <InfoCard accentColor="var(--accent-mint)">
            <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Paid Social & Search Ads
            </h4>
            <ContentP style={{ fontSize: '0.9rem', margin: 0 }}>
              Meta Ads lead generation funnels, Google Search Ads campaign planning, custom pixel tracking, and CPL reduction.
            </ContentP>
          </InfoCard>

          <InfoCard accentColor="var(--accent-tertiary)">
            <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              AI & Workflow Automation
            </h4>
            <ContentP style={{ fontSize: '0.9rem', margin: 0 }}>
              Integrating conversational AI agents, prompt engineering pipelines, and Zapier webhook automations.
            </ContentP>
          </InfoCard>
        </div>

        <ContentH2>2. Client Collaboration & Workflow Principles</ContentH2>
        <ContentP>
          Every project engagement follows a clear, transparent workflow built on direct communication, empirical testing, and technical documentation:
        </ContentP>

        <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 32 }}>
          <li><strong>1. Requirement Discovery:</strong> Defining precise project goals, target metrics, and technical constraints.</li>
          <li><strong>2. Transparent Proposals:</strong> Providing clear deliverables, scope boundaries, and timeline commitments.</li>
          <li><strong>3. Execution & Testing:</strong> Building solutions with clean code, responsive design, and performance optimization.</li>
          <li><strong>4. Handoff & Training:</strong> Delivering technical documentation, source code repositories, or campaign tracking dashboards.</li>
        </ul>

        <ContentH2>3. Verified Credentials & Experience</ContentH2>
        <ContentP>
          Currently serving as Digital Marketer at JBHL Pvt Ltd, with prior experience as Store/Production Associate at Nexteer Automotive India (steering systems manufacturer). Degree: Bachelor of Computer Applications (BCA). Verified Google Skillshop Certification in Fundamentals of Digital Marketing (ID: 453421024). Explore <a href="/certifications/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Certifications & Qualifications</a>.
        </ContentP>

        {/* Explore Related Topic Pillars Hub */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', marginBottom: 40 }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-primary)" />
            Explore Services & Portfolio Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Services Overview', href: '/services/' },
              { label: 'Technical SEO Audits', href: '/seo/' },
              { label: 'React Web Development', href: '/web-development/' },
              { label: 'Google Search Ads', href: '/google-ads/' },
              { label: 'Meta Ads & Conversion Pixel', href: '/meta-ads/' },
              { label: 'Featured Projects', href: '/projects/' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); navigateTo(link.href); }}
                style={{
                  display: 'inline-block',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>

        <PageCTA
          heading="Have a Project to Discuss?"
          description="Send your project requirements or inquiries directly for a detailed technical proposal within 24 hours."
          primaryLabel="Contact Pratheesh"
          primaryHref="/contact/"
          secondaryLabel="View Case Studies"
          secondaryHref="/projects/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default FreelancingPage;
