import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Target, Shield, Layers } from 'lucide-react';

export const MetaAdsPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.metaAds);

  const schema = webPageSchema({
    url: '/meta-ads/',
    name: 'Meta Ads & Facebook Marketing Strategy',
    description: PAGE_SEO.metaAds.description,
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'Meta Ads', item: '/meta-ads/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="meta-ads-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'Meta Ads' },
        ]}
      />

      <ProseContainer>
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Target size={14} color="var(--accent-warm)" />
            Paid Social Acquisition & Retargeting
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
            Meta Ads & Facebook/Instagram Marketing
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Structuring data-driven Meta advertising campaigns with custom pixel event tracking, lookalike audience modeling, creative testing, and CPL reduction strategies.
          </p>
        </div>

        <SkillGrid
          items={[
            'Meta Pixel Custom Events',
            'Custom & Lookalike Audiences',
            'Lead Generation Campaigns',
            'CPL Reduction Strategy',
            'A/B Creative Testing',
            'Retargeting Funnels',
            'Landing Page Alignment',
            'Conversion API (CAPI)',
          ]}
          accentColor="var(--accent-warm)"
        />

        <ContentH2>1. Fundamentals of Effective Meta Advertising</ContentH2>
        <ContentP>
          Meta advertising (Facebook and Instagram Ads) is a powerful push-marketing channel when combined with clear audience profiling and structured conversion tracking. Rather than boosting posts, profitable Meta campaigns rely on full-funnel strategy: cold audience testing, warm engagement retargeting, and hot lead capture.
        </ContentP>

        <InfoCard accentColor="var(--accent-warm)">
          <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8 }}>
            Core Campaign Execution Principles:
          </h4>
          <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
            <li><strong>Meta Pixel & Conversions API:</strong> Technical setup of custom events (`Lead`, `CompleteRegistration`, `ViewContent`) to ensure accurate attribution.</li>
            <li><strong>Audience Segmentation:</strong> Combining interest-based targeting, custom customer lists, and high-quality Lookalike Audiences (LAL).</li>
            <li><strong>Creative & Copy Testing:</strong> Systematic split-testing of video hooks, single-image ad angles, and primary text variations.</li>
            <li><strong>Landing Page Alignment:</strong> Maintaining exact visual and message consistency between the ad creative and destination landing page.</li>
          </ul>
        </InfoCard>

        <ContentH2>2. Campaign Setup & Optimization Process</ContentH2>
        <ContentH3>Phase 1: Event Tracking Architecture</ContentH3>
        <ContentP>
          Installing Meta Pixel scripts and configuring GTM triggers for custom conversion events. (Note: On this portfolio, Meta Pixel execution is strictly gated behind user cookie consent).
        </ContentP>

        <ContentH3>Phase 2: Funnel Mapping & Creative Testing</ContentH3>
        <ContentP>
          Building campaign structures separating Top-of-Funnel (cold prospecting), Middle-of-Funnel (re-engaging video viewers/page visitors), and Bottom-of-Funnel (direct lead capture).
        </ContentP>

        <ContentH3>Phase 3: Budget Allocation & CPL Optimization</ContentH3>
        <ContentP>
          Monitoring Cost-Per-Lead (CPL), Click-Through Rates (CTR), and Frequency metrics. Reallocating budget to top-performing ad sets while pruning underperforming creative.
        </ContentP>

        <ContentH2>3. Real Case Study Application</ContentH2>
        <ContentP>
          See how custom audience profiling and Meta Pixel event tracking were applied in the <a href="/projects/b2b-conversion-funnel/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Social Media B2B Conversion Funnel</a> case study to reduce cost-per-lead and eliminate spam form submissions.
        </ContentP>

        <PageCTA
          heading="Need Help Managing Meta Ad Campaigns?"
          description="Let's analyze your audience targeting, creative assets, and conversion tracking to improve your Meta advertising performance."
          primaryLabel="Discuss Meta Ads Strategy"
          primaryHref="/contact/"
          secondaryLabel="View B2B Funnel Case Study"
          secondaryHref="/projects/b2b-conversion-funnel/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default MetaAdsPage;
