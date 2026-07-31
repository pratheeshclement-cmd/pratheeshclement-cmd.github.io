import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { TrendingUp, Target, BarChart2, Search, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { navigateTo } from '../router/useRouter';

export const DigitalMarketingPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.digitalMarketing);

  const schema = webPageSchema({
    url: '/digital-marketing/',
    name: 'Digital Marketing Strategy & Growth Architecture Guide',
    description: PAGE_SEO.digitalMarketing.description,
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'Digital Marketing', item: '/digital-marketing/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="dm-page-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'Digital Marketing' },
        ]}
      />

      <ProseContainer>
        {/* Header Title Banner */}
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
            <TrendingUp size={14} />
            Full-Funnel Growth & Acquisition Strategy
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
            Digital Marketing Strategy & Growth Architecture
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Combining data-driven marketing strategy, organic search engine optimization, paid acquisition funnels, conversion rate optimization (CRO), and precise GA4 analytics tracking.
          </p>
        </div>

        {/* Skill Tags */}
        <SkillGrid
          items={[
            'Full-Funnel Marketing Strategy',
            'GA4 & Analytics Tracking',
            'Conversion Rate Optimization',
            'Meta Ads Campaign Planning',
            'Google Search Ads (PPC)',
            'Technical SEO Audits',
            'Lead Generation Funnels',
            'Customer Journey Mapping',
          ]}
          accentColor="var(--accent-secondary)"
        />

        {/* Section 1: Full-Funnel Marketing Framework */}
        <ContentH2>1. The Full-Funnel Digital Marketing Framework</ContentH2>
        <ContentP>
          Effective digital marketing connects every touchpoint of the customer journey — from initial brand discovery to purchase conversion and long-term retention.
        </ContentP>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '24px 0 40px' }}>
          <InfoCard accentColor="var(--accent-primary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Top of Funnel (TOFU) — Awareness
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Attracting high-intent organic traffic via Technical SEO pillar content, search intent targeting, and broad interest Meta ad campaigns.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-secondary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Middle of Funnel (MOFU) — Evaluation
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Nurturing prospective leads with in-depth case studies, comparative landing pages, retargeting ad sets, and email workflows.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-mint)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Bottom of Funnel (BOFU) — Conversion
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Converting qualified leads into inquiries or customers with optimized landing page forms, high ad relevance, and clear CTAs.
            </p>
          </InfoCard>
        </div>

        {/* Section 2: Channel Synergies */}
        <ContentH2>2. Channel Synergies: Connecting Organic & Paid Acquisition</ContentH2>
        <ContentP>
          Digital channels operate most effectively when integrated as a unified growth engine:
        </ContentP>

        <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 32 }}>
          <li>
            <strong>SEO & Google Ads:</strong> High-performing Google Search Ads queries inform organic keyword clustering. Conversely, strong organic SEO content reduces PPC landing page bounce rates.
          </li>
          <li>
            <strong>Meta Ads & Landing Page CRO:</strong> Driving targeted traffic from Facebook and Instagram to high-converting, fast-loading landing pages with custom pixel event measurement.
          </li>
          <li>
            <strong>GA4 Analytics & Attribution:</strong> Measuring multi-channel acquisition paths to determine exact conversion attribution and channel ROI.
          </li>
        </ul>

        {/* Section 3: Real Case Evidence */}
        <ContentH2>3. Real Project Case Studies</ContentH2>
        <ContentP>
          Explore marketing campaign strategy in the <a href="/projects/b2b-conversion-funnel/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Social Media B2B Conversion Funnel</a> and <a href="/projects/seo-growth-campaign/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>SEO Growth Campaign</a> case studies.
        </ContentP>

        {/* Explore Related Topic Pillars Hub */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', margin: '40px 0' }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-secondary)" />
            Explore Related Discipline Guides & Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Technical SEO Guide', href: '/seo/' },
              { label: 'Meta Ads Strategy Guide', href: '/meta-ads/' },
              { label: 'Google Search Ads Guide', href: '/google-ads/' },
              { label: 'Blog: Meta Pixel Tracking', href: '/blog/how-meta-pixel-and-conversion-tracking-work/' },
              { label: 'B2B Lead Funnel Case Study', href: '/projects/b2b-conversion-funnel/' },
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
          heading="Ready to Build Your Growth Strategy?"
          description="Let's analyze your target audience, acquisition channels, and analytics to design a custom growth roadmap."
          primaryLabel="Contact Pratheesh"
          primaryHref="/contact/"
          secondaryLabel="Explore Meta Ads Strategy"
          secondaryHref="/meta-ads/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default DigitalMarketingPage;
