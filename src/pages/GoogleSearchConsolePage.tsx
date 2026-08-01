import React from 'react';
import { useSEOMeta } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Search, BarChart2, CheckCircle2, ShieldCheck, AlertCircle, HelpCircle, Layers } from 'lucide-react';
import { navigateTo } from '../router/useRouter';

export const GoogleSearchConsolePage: React.FC = () => {
  useSEOMeta({
    title: 'Google Search Console & Indexing Architecture Guide',
    description: 'Master Google Search Console, URL inspection, index coverage diagnostics, XML sitemap auditing, canonical URL resolution, and Core Web Vitals telemetry.',
    canonical: '/google-search-console/',
    ogImage: '/assets/pratheesh-desktop.jpg',
    ogImageAlt: 'Pratheesh Clement — Google Search Console Guide',
  });

  const schema = webPageSchema({
    url: '/google-search-console/',
    name: 'Google Search Console & Indexing Architecture Guide',
    description: 'Master Google Search Console, URL inspection, index coverage diagnostics, XML sitemap auditing, canonical URL resolution, and Core Web Vitals telemetry.',
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'Google Search Console', item: '/google-search-console/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="gsc-page-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'Google Search Console' },
        ]}
      />

      <ProseContainer>
        {/* Header Title Banner */}
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
            <Search size={14} />
            Search Indexing & Diagnostic Intelligence
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
            Google Search Console & Indexing Architecture
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Google Search Console (GSC) is the primary authoritative channel for diagnosing search indexation status, monitoring organic impressions, inspecting canonical URLs, verifying sitemaps, and resolving crawl bottlenecks.
          </p>
        </div>

        {/* Skill / Capability Tags */}
        <SkillGrid
          items={[
            'URL Inspection Tool',
            'Index Coverage Diagnostics',
            'XML Sitemap Submission',
            'Canonical Resolution',
            'Search Queries & CTR',
            'Core Web Vitals Telemetry',
            'Robots.txt Directives',
            'Rich Result Enhancements',
          ]}
          accentColor="var(--accent-secondary)"
        />

        {/* Section 1: Key Diagnostic Reports in GSC */}
        <ContentH2>1. Essential Diagnostic Reports in Google Search Console</ContentH2>
        <ContentP>
          Managing search engine performance requires continuous monitoring of Search Console telemetry data. Rather than guessing why pages fail to rank, GSC provides direct diagnostic data straight from Googlebot:
        </ContentP>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '24px 0 40px' }}>
          <InfoCard accentColor="var(--accent-primary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Performance Report
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Tracks total organic clicks, search impressions, average Click-Through Rate (CTR), and average SERP position per keyword query across devices and countries.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-secondary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Page Indexing Report
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Categorizes unindexed URLs by reason (e.g. "Crawled - currently not indexed", "Discovered - currently not indexed", "Duplicate without user-selected canonical").
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-mint)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              URL Inspection Tool
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Fetches live URL DOM rendered states, checks mobile usability, verifies Google-selected canonicals, and tests valid JSON-LD schema graphs.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-tertiary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Sitemaps & Robots.txt
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Submits XML sitemaps (`sitemap.xml`) and monitors parsing status, error logs, and robots.txt disallow directives.
            </p>
          </InfoCard>
        </div>

        {/* Section 2: Troubleshooting "Page Not Appearing" Workflow */}
        <ContentH2>2. Practical Troubleshooting: When a Page Is Not Appearing on Google</ContentH2>
        <ContentP>
          If an important page is missing from search results, follow this 12-step diagnostic checklist:
        </ContentP>

        <ol style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.85, marginBottom: 32 }}>
          <li><strong>Confirm Public Accessibility:</strong> Verify the URL returns HTTP <code>200 OK</code> status and is not behind authentication or firewall blockers.</li>
          <li><strong>Inspect Robots.txt:</strong> Ensure no <code>Disallow:</code> path directives block Googlebot from crawling the URL.</li>
          <li><strong>Check Restrictive Directives:</strong> Verify no restrictive <code>&lt;meta name="robots" content="noindex" /&gt;</code> tag or <code>X-Robots-Tag: noindex</code> HTTP header is blocking indexing. (Google treats indexing and following as default behavior unless a restrictive directive is present).</li>
          <li><strong>Verify Canonical URL:</strong> Ensure <code>&lt;link rel="canonical" href="..." /&gt;</code> points to the exact URL, including trailing slash consistency.</li>
          <li><strong>Inspect Internal Linking:</strong> Verify the page is connected via normal <code>&lt;a href="..."&gt;</code> links from indexed parent pages.</li>
          <li><strong>Verify XML Sitemap Inclusion:</strong> Confirm the page URL is listed in <code>sitemap.xml</code> with <code>&lt;lastmod&gt;</code> date.</li>
          <li><strong>Run URL Inspection:</strong> Open GSC &rarr; URL Inspection &rarr; paste target URL &rarr; click "Test Live URL".</li>
          <li><strong>Compare Rendered HTML:</strong> Check the "View Rendered Page" tab in GSC to ensure text content renders properly.</li>
          <li><strong>Evaluate Content Depth & Quality:</strong> Verify the content satisfies search intent better than generic definitions without thin text.</li>
          <li><strong>Request Indexing:</strong> Click "Request Indexing" in GSC to place the URL in Google's priority fetch queue.</li>
          <li><strong>Check Security & Manual Actions:</strong> Verify GSC Security & Manual Actions tabs report zero penalties.</li>
          <li><strong>Monitor Telemetry:</strong> Track index coverage status over time in Search Console rather than repeatedly requesting indexing.</li>
        </ol>

        {/* Section 3: Understanding Common GSC Statuses */}
        <ContentH2>3. Demystifying Common Index Coverage Statuses</ContentH2>
        
        <ContentH3>Crawled — Currently Not Indexed</ContentH3>
        <ContentP>
          Occurs when Googlebot fetches a page but chooses not to add it to the index due to perceived thin content, duplicate intent, or weak internal link support. Resolved by consolidating thin pages into comprehensive pillar guides and adding contextual internal links.
        </ContentP>

        <ContentH3>Discovered — Currently Not Indexed</ContentH3>
        <ContentP>
          Indicates Google discovered the URL (via sitemap or internal link) but has not yet allocated crawl budget to fetch it. Resolved by ensuring fast server response times, submitting a clean sitemap, and building site authority.
        </ContentP>

        <ContentH3>Duplicate Without User-Selected Canonical</ContentH3>
        <ContentP>
          Occurs when multiple URL paths serve identical content without explicit <code>&lt;link rel="canonical" /&gt;</code> tags, forcing Google to guess the authoritative version.
        </ContentP>

        {/* Section 4: First-Hand Case Evidence */}
        <ContentH2>4. GSC Architecture & Post-Deployment Validation on Pratheesh OS</ContentH2>
        <InfoCard accentColor="var(--accent-secondary)">
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
            Pratheesh OS is structured to support post-deployment validation through Google Search Console. By establishing canonical directory paths (<code>/about/</code>, <code>/seo/</code>, <code>/google-search-console/</code>, <code>/projects/</code>) and configuring static HTML prerendering (<code>scripts/prerender.js</code>), every section resolves to a clean, indexable URL with pre-baked JSON-LD schema ready for GSC indexing telemetry.
          </p>
        </InfoCard>

        {/* Related Discipline Hub */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', margin: '40px 0' }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-secondary)" />
            Explore Related Discipline Guides & Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Technical SEO Guide', href: '/seo/' },
              { label: 'Web Development Architecture', href: '/web-development/' },
              { label: 'Blog: GSC URL Inspection', href: '/blog/how-i-approach-technical-seo/' },
              { label: 'SEO Growth Campaign Case Study', href: '/projects/seo-growth-campaign/' },
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

        {/* Page CTA */}
        <PageCTA
          heading="Need Help Auditing Your Google Search Console?"
          description="Let's diagnose your indexation coverage, resolve crawl errors, and optimize your XML sitemaps."
          primaryLabel="Request Search Audit"
          primaryHref="/contact/"
          secondaryLabel="Explore Technical SEO"
          secondaryHref="/seo/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default GoogleSearchConsolePage;
