import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ContentH2, ContentP, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { SERVICES } from '../data/services';
import { navigateTo } from '../router/useRouter';
import { ArrowRight, Layers, Search, BarChart2, Target, TrendingUp, Layout, Zap, Bot, UserCheck } from 'lucide-react';

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
                <button
                  onClick={() => navigateTo(dedicatedRoute)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Explore {svc.name} Guide & Strategy <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('/contact/')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Inquire About Service <ArrowRight size={15} />
                </button>
              )}
            </div>
          );
        })}
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
