import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ContentH2, ContentH3, ContentP, InfoCard, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { SERVICES } from '../data/services';
import { navigateTo } from '../router/useRouter';
import { ArrowRight, Layers, Search, BarChart2, Target, TrendingUp, Layout, Zap, Bot, UserCheck, CheckCircle2 } from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  globe: Layout,
  search: Search,
  'bar-chart-2': BarChart2,
  target: Target,
  'trending-up': TrendingUp,
  layout: Layout,
  zap: Zap,
  bot: Bot,
  'user-check': UserCheck,
};

const SERVICE_SLUG_MAP: Record<string, string> = {
  'technical-seo': '/seo/',
  'digital-marketing-strategy': '/digital-marketing/',
  'meta-ads': '/meta-ads/',
  'google-ads': '/google-ads/',
  'website-development': '/web-development/',
  'ai-automation': '/ai-automation/',
};

export const ServicesPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.services);

  const schema = webPageSchema({
    url: '/services/',
    name: 'Digital Marketing & Web Development Services',
    description: PAGE_SEO.services.description,
    type: 'CollectionPage',
    breadcrumbs: [{ name: 'Services', item: '/services/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="services-schema" />
      <Breadcrumb items={[{ label: 'Services' }]} />

      <div style={{ marginBottom: 40 }}>
        <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Layers size={14} color="var(--accent-primary)" />
          End-to-End Capabilities
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
          Digital Marketing & Web Development Services
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 760 }}>
          Comprehensive solutions combining strategy, technical search engine optimization, paid ad acquisition, frontend engineering, and AI automation.
        </p>
      </div>

      <ContentH2>Service Specializations</ContentH2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24, marginTop: 24, marginBottom: 56, width: '100%' }}>
        {SERVICES.map((svc) => {
          const IconComp = ICON_MAP[svc.icon] || Layers;
          const dedicatedRoute = SERVICE_SLUG_MAP[svc.id];

          return (
            <div
              key={svc.id}
              style={{
                padding: 28,
                borderRadius: 'var(--radius-md)',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(59, 130, 246, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComp size={22} color="var(--accent-primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                    {svc.name}
                  </h3>
                </div>

                <ContentP style={{ fontSize: '0.94rem', marginBottom: 20 }}>
                  {svc.description}
                </ContentP>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                  {svc.highlights.map((h) => (
                    <span key={h} className="pill" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {dedicatedRoute ? (
                <a
                  href={dedicatedRoute}
                  onClick={e => { e.preventDefault(); navigateTo(dedicatedRoute); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--accent-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Explore {svc.name} Guide & Strategy <ArrowRight size={15} />
                </a>
              ) : (
                <a
                  href="/contact/"
                  onClick={e => { e.preventDefault(); navigateTo('/contact/'); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Inquire About Service <ArrowRight size={15} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      <ContentH2>How Services Are Delivered</ContentH2>
      <ContentP>
        Every service listed here is delivered remotely, directly by Pratheesh Clement — not by a junior team or outsourced vendor. Work spans from one-time audits and project deliverables to ongoing monthly retainer engagements, depending on the scope and your objectives.
      </ContentP>
      <ContentP>
        The services below are not isolated offerings — they are designed to work together. A technical SEO audit reveals on-page gaps that can be addressed through content strategy. A Meta Ads campaign performs significantly better when the landing page it sends traffic to has been conversion-rate optimized. Google Ads campaigns depend on Google Analytics 4 being configured correctly to pass conversion data back to the algorithm. The cross-disciplinary approach is intentional.
      </ContentP>

      <ContentH2>My Approach</ContentH2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {[
          { n: '01', title: 'Diagnose First', desc: 'Every engagement starts with an audit or discovery call — not a pre-packaged solution. Understanding the actual situation determines the right strategy.' },
          { n: '02', title: 'Clear Deliverables', desc: 'Written scope of work with specific deliverables, timelines, and success criteria before work begins. No vague statements of work.' },
          { n: '03', title: 'Execution with Visibility', desc: 'You stay informed at each milestone. Reports, dashboards, or shared documents depending on the service type.' },
          { n: '04', title: 'Measurement & Iteration', desc: 'Results are tracked against the objectives defined at the start. What gets measured gets improved.' },
        ].map(({ n, title, desc }) => (
          <InfoCard key={n} accentColor="var(--accent-primary)">
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: 'var(--accent-primary)', fontWeight: 700, opacity: 0.5, marginBottom: 8 }}>{n}</div>
            <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</div>
          </InfoCard>
        ))}
      </div>

      <ContentH2>Frequently Asked Questions</ContentH2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
        {[
          {
            q: 'Do you offer project-based or retainer-based engagements?',
            a: 'Both. One-time project engagements are available for defined deliverables like an SEO audit, website build, or campaign setup. Monthly retainers are available for ongoing services like paid ad management, analytics reporting, or continuous SEO improvement.'
          },
          {
            q: 'Can I request a combination of services?',
            a: 'Yes, and it is often more effective. Many clients engage across multiple service areas simultaneously — for example, combining Google Ads management with landing page development and GA4 conversion tracking setup. Bundled engagements are scoped individually based on your specific needs.'
          },
          {
            q: 'What industries do you work with?',
            a: 'Services have been delivered to clients in real estate, hospitality, e-commerce, B2B professional services, and technology. The underlying disciplines — technical SEO, paid media, analytics, and web development — apply across verticals. Industry-specific nuances are factored into strategy.'
          },
          {
            q: 'How quickly can you start after initial contact?',
            a: 'For most projects, work can begin within 3–5 business days after scope and agreement are finalized. Emergency audits and one-time deliverables can sometimes be expedited. Current availability is communicated during the discovery call.'
          },
        ].map(({ q, a }) => (
          <InfoCard key={q} accentColor="var(--accent-secondary)">
            <div style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>{q}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{a}</div>
          </InfoCard>
        ))}
      </div>

      <PageCTA
        heading="Need a Tailored Digital Strategy?"
        description="Let's analyze your project requirements, target audience, and growth objectives to design a custom roadmap."
        primaryLabel="Contact Pratheesh"
        primaryHref="/contact/"
        secondaryLabel="View Case Studies"
        secondaryHref="/projects/"
      />
    </PageLayout>
  );
};

export default ServicesPage;
