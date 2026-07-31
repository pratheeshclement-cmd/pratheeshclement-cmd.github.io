import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { BarChart2, Search, Target, Layers } from 'lucide-react';
import { navigateTo } from '../router/useRouter';

export const GoogleAdsPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.googleAds);

  const schema = webPageSchema({
    url: '/google-ads/',
    name: 'Google Ads & Search Engine Advertising Guide',
    description: PAGE_SEO.googleAds.description,
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'Google Ads', item: '/google-ads/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="google-ads-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'Google Ads' },
        ]}
      />

      <ProseContainer>
        {/* Header Title Banner */}
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <BarChart2 size={14} color="var(--accent-primary)" />
            Search Intent & Paid Search Management
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
            Google Ads & Paid Search Strategy
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Capturing active high-intent search queries with structured Google Search campaigns, negative keyword filtering, conversion tracking, and high ad relevance.
          </p>
        </div>

        {/* Skill Tags */}
        <SkillGrid
          items={[
            'Google Search Campaigns',
            'Keyword Match Types',
            'Negative Keyword Optimization',
            'Conversion Tracking Setup',
            'Ad Relevance & Quality Score',
            'Smart & Manual Bidding Strategies',
            'Display & Remarketing',
            'Search Intent Analysis',
          ]}
          accentColor="var(--accent-primary)"
        />

        {/* Section 1: Intent-Based Paid Search */}
        <ContentH2>1. Capturing High-Intent Demand via Google Search</ContentH2>
        <ContentP>
          Unlike social media ads which interrupt user browsing, Google Search Ads target users who are actively searching for specific solutions. Success in Google Search advertising depends on exact keyword intent mapping, high Quality Scores, compelling ad assets, and tight negative keyword lists to prevent wasted ad spend.
        </ContentP>

        <InfoCard accentColor="var(--accent-primary)">
          <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8 }}>
            Core Search Campaign Strategy Elements:
          </h4>
          <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
            <li><strong>Intent-Based Keyword Architecture:</strong> Structuring ad groups tightly around specific transactional and commercial search queries.</li>
            <li><strong>Negative Keyword Management:</strong> Continuously filtering non-converting search terms to maximize ad budget efficiency.</li>
            <li><strong>Ad Extension Assets:</strong> Utilizing sitelinks, callouts, structured snippets, and call assets to increase SERP real estate.</li>
            <li><strong>Conversion Tracking & GA4 Integration:</strong> Linking Google Ads to GA4 for accurate conversion attribution and bidding optimization.</li>
          </ul>
        </InfoCard>

        {/* Section 2: Quality Score & Ad Rank Fundamentals */}
        <ContentH2>2. Understanding Quality Score & Ad Rank</ContentH2>
        <ContentP>
          Ad Rank is calculated at auction time using multiple signals, including the bid, ad and landing-page quality, competitiveness of the auction, search context, thresholds, and the expected impact of assets and other ad formats.
        </ContentP>

        <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 28 }}>
          <li>
            <strong>Quality Score Diagnostic Metric:</strong> Google's 1–10 Quality Score is primarily a diagnostic metric based on expected CTR, ad relevance, and landing-page experience. It should not be treated as a direct numeric input in a simple Ad Rank formula.
          </li>
          <li>
            <strong>Auction Dynamics:</strong> Higher ad and landing page relevance improves overall auction competitiveness and ad position eligibility across search queries.
          </li>
          <li>
            <strong>Actual CPC Clearing:</strong> You pay the minimum price necessary to clear the Ad Rank threshold of the competitor immediately below your position in a dynamic second-price auction.
          </li>
        </ul>

        {/* Section 3: Campaign Optimization Workflow */}
        <ContentH2>3. Campaign Optimization & Management Workflow</ContentH2>
        
        <ContentH3>Phase 1: Keyword Research & Intent Grouping</ContentH3>
        <ContentP>
          Identifying core transactional keywords, evaluating search volumes and competition levels, and grouping keywords into tightly focused theme ad groups.
        </ContentP>

        <ContentH3>Phase 2: Ad Copywriting & Landing Page Alignment</ContentH3>
        <ContentP>
          Drafting responsive search ads (RSA) featuring primary keywords, clear calls-to-action, and ensuring the destination landing page directly matches searcher intent.
        </ContentP>

        <ContentH3>Phase 3: Search Terms Audit & Bidding Refinement</ContentH3>
        <ContentP>
          Auditing actual search term reports weekly to add negative keywords, adjusting device/location bid modifiers, and optimizing bidding strategies.
        </ContentP>

        {/* Related Discipline Hub */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', margin: '40px 0' }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-primary)" />
            Explore Related Discipline Guides & Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Technical SEO Guide', href: '/seo/' },
              { label: 'Digital Marketing Strategy', href: '/digital-marketing/' },
              { label: 'Meta Ads Strategy Guide', href: '/meta-ads/' },
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
          heading="Looking to Maximize Google Ads Performance?"
          description="Let's review your keyword strategy, Quality Scores, and search term reports to optimize your paid search budget."
          primaryLabel="Discuss Google Ads"
          primaryHref="/contact/"
          secondaryLabel="Explore Technical SEO"
          secondaryHref="/seo/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default GoogleAdsPage;
