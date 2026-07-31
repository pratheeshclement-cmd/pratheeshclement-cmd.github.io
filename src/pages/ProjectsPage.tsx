import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ContentH2, ContentP, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { PROJECTS } from '../data/projects';
import { navigateTo } from '../router/useRouter';
import { FolderKanban, ArrowRight, Layers, Search, Layout, TrendingUp, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  search: Search,
  layout: Layout,
  'trending-up': TrendingUp,
  sparkles: Sparkles,
};

export const ProjectsPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.projects);

  const schema = webPageSchema({
    url: '/projects/',
    name: 'Projects & Digital Case Studies',
    description: PAGE_SEO.projects.description,
    type: 'CollectionPage',
    breadcrumbs: [{ name: 'Projects', item: '/projects/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="projects-schema" />
      <Breadcrumb items={[{ label: 'Projects & Case Studies' }]} />

      <div style={{ marginBottom: 40 }}>
        <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <FolderKanban size={14} color="var(--accent-primary)" />
          Real Case Studies · Verified Results Only
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
          Featured Projects & Digital Case Studies
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 760 }}>
          Real engineering and marketing challenges solved with technical rigor — from e-commerce technical SEO audits to Meta ad conversion funnels and scroll-driven React applications.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, marginTop: 24, marginBottom: 56 }}>
        {PROJECTS.map((project) => {
          const IconComp = ICON_MAP[project.icon] || Layers;

          return (
            <div
              key={project.id}
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
                <div
                  style={{
                    height: 140,
                    borderRadius: 16,
                    marginBottom: 20,
                    background: `linear-gradient(135deg, ${project.accentColor}18, ${project.accentColor}08)`,
                    border: `1px solid ${project.accentColor}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComp size={44} color={project.accentColor} />
                </div>

                <span className="section-label" style={{ marginBottom: 8, fontSize: '0.72rem' }}>
                  {project.category.split('·')[0].trim()}
                </span>

                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.3 }}>
                  {project.title}
                </h3>

                <ContentP style={{ fontSize: '0.94rem', marginBottom: 20 }}>
                  {project.summary}
                </ContentP>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                  {project.tags.map((t) => (
                    <span key={t} className="pill" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigateTo(`/projects/${project.id}/`)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  color: project.accentColor,
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-body)',
                }}
              >
                Read Full Case Study <ArrowRight size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <PageCTA
        heading="Have a Project in Mind?"
        description="Let's discuss how we can approach your technical SEO, paid acquisition, or web development goals."
        primaryLabel="Start a Conversation"
        primaryHref="/contact/"
        secondaryLabel="Explore Services"
        secondaryHref="/services/"
      />
    </PageLayout>
  );
};

export default ProjectsPage;
