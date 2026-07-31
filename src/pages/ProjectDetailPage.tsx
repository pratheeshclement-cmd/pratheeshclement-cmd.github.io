import React from 'react';
import { useSEOMeta } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { PROJECTS } from '../data/projects';
import { navigateTo } from '../router/useRouter';
import { NotFoundPage } from './NotFoundPage';
import { FolderKanban, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Layers } from 'lucide-react';

interface ProjectDetailPageProps {
  slug: string;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug }) => {
  const project = PROJECTS.find(p => p.id === slug);

  if (!project) {
    return <NotFoundPage />;
  }

  useSEOMeta({
    title: `${project.title} — Case Study`,
    description: `${project.summary} Problem: ${project.problem} Solution: ${project.solution}`,
    canonical: `/projects/${project.id}/`,
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: project.title,
  });

  const schema = webPageSchema({
    url: `/projects/${project.id}/`,
    name: `${project.title} — Case Study`,
    description: project.summary,
    breadcrumbs: [
      { name: 'Projects', item: '/projects/' },
      { name: project.title, item: `/projects/${project.id}/` },
    ],
  });

  // Find next project for navigation
  const currentIndex = PROJECTS.findIndex(p => p.id === slug);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <PageLayout>
      <StructuredData data={schema} id={`project-${project.id}-schema`} />
      <Breadcrumb
        items={[
          { label: 'Projects', href: '/projects/' },
          { label: project.title },
        ]}
      />

      <ProseContainer>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: project.accentColor, color: project.accentColor }}>
            <FolderKanban size={14} />
            {project.category}
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {project.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {project.summary}
          </p>
        </div>

        <SkillGrid items={project.tags} accentColor={project.accentColor} />

        {/* Executive Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 32, marginBottom: 40 }}>
          <InfoCard accentColor="var(--accent-warm)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <AlertCircle size={18} color="var(--accent-warm)" />
              <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>The Challenge / Problem</h4>
            </div>
            <ContentP style={{ fontSize: '0.92rem', margin: 0 }}>
              {project.problem}
            </ContentP>
          </InfoCard>

          <InfoCard accentColor={project.accentColor}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <CheckCircle2 size={18} color={project.accentColor} />
              <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>Strategy & Solution</h4>
            </div>
            <ContentP style={{ fontSize: '0.92rem', margin: 0 }}>
              {project.solution}
            </ContentP>
          </InfoCard>
        </div>

        {/* Detailed Breakdown */}
        <ContentH2>1. Context & Objective</ContentH2>
        <ContentP>
          {project.problem} The objective of this engagement was to establish a maintainable, high-performance solution that directly addressed root technical and strategic bottlenecks rather than applying superficial fixes.
        </ContentP>

        <ContentH2>2. Technical Implementation & Approach</ContentH2>
        <ContentP>
          {project.solution} Technologies and methodologies applied: {project.tags.join(', ')}.
        </ContentP>

        <ContentH2>3. Outcome & Demonstrated Result</ContentH2>
        <InfoCard accentColor="var(--accent-mint)">
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            Verified Outcome:
          </div>
          <ContentP style={{ fontSize: '0.95rem', margin: 0 }}>
            {project.result}
          </ContentP>
        </InfoCard>

        {/* Next Project Navigation */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Next Case Study
            </div>
            <button
              onClick={() => navigateTo(`/projects/${nextProject.id}/`)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {nextProject.title} <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <PageCTA
          heading="Interested in Similar Results for Your Brand?"
          description="Let's discuss how technical SEO, frontend engineering, or paid ad strategies can solve your specific growth challenges."
          primaryLabel="Contact Pratheesh"
          primaryHref="/contact/"
          secondaryLabel="View All Projects"
          secondaryHref="/projects/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default ProjectDetailPage;
