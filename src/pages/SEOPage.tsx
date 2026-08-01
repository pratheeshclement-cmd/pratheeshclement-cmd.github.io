import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Search, Code2, Cpu, CheckCircle2, FileText, ArrowRight, ShieldCheck, HelpCircle, Layers } from 'lucide-react';
import { navigateTo } from '../router/useRouter';

export const SEOPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.seo);

  const schema = webPageSchema({
    url: '/seo/',
    name: 'SEO & Technical Search Engine Optimization Guide',
    description: PAGE_SEO.seo.description,
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'Technical SEO', item: '/seo/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="seo-page-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'Technical SEO' },
        ]}
      />

      <ProseContainer>
        {/* Header Title Banner */}
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Search size={14} color="var(--accent-secondary)" />
            People-First Search Engine Optimization
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
            Technical SEO & Search Optimization
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Sustainable organic search visibility is built on people-first content quality, robust technical architecture, structured entity schema, and sub-second performance — never keyword stuffing, doorway pages, or automated spam.
          </p>
        </div>

        {/* Skill / Capability Tags */}
        <SkillGrid
          items={[
            'Schema Graph (JSON-LD)',
            'Core Web Vitals Optimization',
            'Sitemap Architecture',
            'Robots Directives',
            'Canonical Strategy',
            'Google Search Console',
            'Keyword Intent Mapping',
            'Internal Link Architecture',
            'React & SPA Prerendering',
            'Mobile-First Indexing',
          ]}
          accentColor="var(--accent-secondary)"
        />

        {/* Section 1: People-First SEO Philosophy */}
        <ContentH2>1. People-First SEO: Content First, Keywords Second</ContentH2>
        <ContentP>
          Modern search engine optimization must align strictly with Google's people-first content guidelines. Rather than creating pages solely because a keyword exists, every page must answer a real user question, satisfy explicit search intent, and provide first-hand technical or professional insights.
        </ContentP>
        <ContentP>
          When search engines crawl a web application, they evaluate whether the content delivers genuine depth, clear authorship (E-E-A-T), logical heading structure, and fast user experience. Keywords are not forces to be injected into paragraphs; they are natural semantic markers of a comprehensive topic.
        </ContentP>

        {/* Section 2: 12-Step SEO Workflow */}
        <ContentH2>2. My 12-Step Technical SEO Workflow</ContentH2>
        <ContentP>
          Every technical search engine optimization project follows a systematic diagnostic and implementation framework:
        </ContentP>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '24px 0 40px' }}>
          {[
            { step: '01', title: 'Technical Discovery Audit', desc: 'Inspecting server HTTP status codes, client-side rendering behavior, and crawl bottlenecks.' },
            { step: '02', title: 'Crawlability Analysis', desc: 'Auditing robots.txt directives, disallow rules, and search bot access pathways.' },
            { step: '03', title: 'Indexability Audit', desc: 'Resolving noindex flags, canonical mismatches, and page status code errors.' },
            { step: '04', title: 'Search Intent Mapping', desc: 'Categorizing target topics into Informational, Commercial, Navigational, or Transactional intent.' },
            { step: '05', title: 'Topic Clustering', desc: 'Group semantically related keywords into comprehensive pillar pages and supporting articles.' },
            { step: '06', title: 'Information Architecture', desc: 'Structuring clean, crawlable URL paths with trailing slash normalization.' },
            { step: '07', title: 'Semantic HTML5', desc: 'Using strict heading hierarchies (H1 -> H2 -> H3), nav, main, article, and footer elements.' },
            { step: '08', title: 'Contextual Internal Links', desc: 'Connecting pillar pages downward to articles and sideways to case studies.' },
            { step: '09', title: 'Structured Data Graphs', desc: 'Writing nested @graph JSON-LD schemas connecting Person, WebSite, and WebPage entities.' },
            { step: '10', title: 'Core Web Vitals Engineering', desc: 'Optimizing LCP, INP, and CLS scores through modern image derivatives and asset preloading.' },
            { step: '11', title: 'Search Console Telemetry', desc: 'Submitting XML sitemaps, inspecting live URLs, and monitoring index coverage in GSC.' },
            { step: '12', title: 'Analytics & Measurement', desc: 'Tracking organic impressions, clicks, CTR, and conversion events in GA4.' },
          ].map(item => (
            <InfoCard key={item.step} accentColor="var(--accent-secondary)">
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: 6 }}>
                STEP {item.step}
              </div>
              <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </InfoCard>
          ))}
        </div>

        {/* Section 3: Crawlability vs Indexability */}
        <ContentH2>3. Technical Breakdown: Crawlability vs. Indexability</ContentH2>
        <ContentP>
          A common point of confusion in web development is the difference between <strong>crawlability</strong> and <strong>indexability</strong>:
        </ContentP>
        <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 28 }}>
          <li>
            <strong>Crawlability:</strong> The ability of search engine crawlers (e.g. Googlebot) to discover and fetch bytes from a URL. Obstacles include `robots.txt` disallow rules, server 5xx errors, unhandled JavaScript errors, or slow server response times.
          </li>
          <li>
            <strong>Indexability:</strong> The eligibility of a fetched page to be parsed, analyzed, and added to the Google Search index. Obstacles include <code>&lt;meta name="robots" content="noindex" /&gt;</code>, duplicate content without canonical declaration, thin content quality, or explicit canonical overrides.
          </li>
        </ul>

        {/* Section 4: Real Case Evidence — Pratheesh OS Architecture */}
        <ContentH2>4. First-Hand Evidence: How Pratheesh OS Achieves SPA Search Crawlability</ContentH2>
        <ContentP>
          Single Page Applications (SPAs) built with React and Vite often struggle with search engine indexation if they rely entirely on client-side JavaScript rendering. While Googlebot can execute JavaScript, relying exclusively on client rendering introduces rendering delays and indexation risks.
        </ContentP>
        
        <InfoCard accentColor="var(--accent-primary)">
          <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Code2 size={18} color="var(--accent-primary)" />
            Pratheesh OS Technical Architecture Case Study:
          </h4>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
            In building Pratheesh OS (<code>pratheeshclement-cmd.github.io</code>), I engineered a hybrid static pre-rendering architecture using Node.js (<code>scripts/prerender.js</code>) during Vite build time. For all 26 canonical routes (<code>/seo/</code>, <code>/ui-ux-design/</code>, <code>/blog/</code>, etc.), the build process pre-generates a static <code>index.html</code> containing pre-baked <code>&lt;title&gt;</code>, <code>&lt;meta description&gt;</code>, <code>&lt;link rel="canonical"&gt;</code>, <code>@graph</code> JSON-LD schema, and semantic HTML prose inside <code>&lt;div id="root"&gt;</code>.
            <br /><br />
            When search engines request any URL path, GitHub Pages immediately serves pre-rendered HTML <em>before</em> JavaScript executes. Once loaded, client-side React mounts seamlessly over the pre-rendered DOM, providing 60 FPS motion without compromising search bot crawlability.
          </p>
        </InfoCard>

        {/* Section 5: Common Technical SEO Pitfalls */}
        <ContentH2>5. Common Technical SEO Pitfalls to Avoid</ContentH2>
        <ContentP>
          Avoiding fundamental technical errors is essential for maintaining domain search authority:
        </ContentP>

        <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 32 }}>
          <li><strong>Keyword Stuffing:</strong> Artificially repeating search keywords degrades user readability and triggers Google quality penalties.</li>
          <li><strong>Hash Anchor Routing:</strong> Relying on <code>/#about</code> or <code>/#services</code> instead of real crawlable paths (<code>/about/</code>, <code>/services/</code>) prevents search engines from indexing distinct topics.</li>
          <li><strong>Missing or Conflict Canonical Tags:</strong> Serving duplicate URL parameters without explicit <code>&lt;link rel="canonical" /&gt;</code> tags confuses Googlebot canonical selection.</li>
          <li><strong>Layout Shift (CLS):</strong> Unsized hero images causing content jumps during page load degrade Core Web Vitals signals.</li>
        </ul>

        {/* Frequently Asked Questions */}
        <ContentH2>6. Frequently Asked Questions (FAQ)</ContentH2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          <div style={{ padding: 20, borderRadius: 16, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle size={16} color="var(--accent-primary)" />
              Does Googlebot render client-side React JavaScript?
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Yes, Googlebot uses a modern Chromium rendering engine to execute JavaScript. However, client-side rendering occurs in a secondary rendering queue, which can cause indexing delays. Pre-rendering static HTML ensures immediate initial indexation.
            </p>
          </div>

          <div style={{ padding: 20, borderRadius: 16, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle size={16} color="var(--accent-primary)" />
              What is the ideal Core Web Vitals performance target?
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Target Largest Contentful Paint (LCP) under 2.5 seconds, Cumulative Layout Shift (CLS) under 0.1, and Interaction to Next Paint (INP) under 200 milliseconds across mobile and desktop devices.
            </p>
          </div>
        </div>

        {/* Explore Related Topic Pillars Hub */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', marginBottom: 40 }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-primary)" />
            Explore Related Discipline Guides & Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Google Search Console Guide', href: '/google-search-console/' },
              { label: 'Web Development Architecture', href: '/web-development/' },
              { label: 'UI/UX Interface Design', href: '/ui-ux-design/' },
              { label: 'Blog: SPA Technical SEO', href: '/blog/how-i-approach-technical-seo/' },
              { label: 'Pratheesh OS Case Study', href: '/projects/pratheesh-os/' },
              { label: 'SEO Growth Audit Case Study', href: '/projects/seo-growth-campaign/' },
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
          heading="Ready to Optimize Your Site's Search Architecture?"
          description="Let's audit your technical SEO, schema implementation, and Core Web Vitals to build sustainable organic search visibility."
          primaryLabel="Request SEO Audit"
          primaryHref="/contact/"
          secondaryLabel="Read Pratheesh OS Case Study"
          secondaryHref="/projects/pratheesh-os/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default SEOPage;
