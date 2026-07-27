import React, { useState, useEffect } from 'react';
import { FolderKanban, Globe, Cpu, ShoppingBag, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  problem: string;
  solution: string;
  result: string;
  icon: React.ElementType;
  gradient: string;
}

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'seo-growth',
      title: 'SEO Growth Campaign',
      category: 'SEO Services · Competitor Gap · JSON-LD · GA4',
      tags: ['Technical SEO', 'GA4 Analytics', 'Schema Markup', 'Keyword Strategy'],
      description: 'Full-funnel technical search audit and keyword optimization for an Indian e-commerce platform.',
      problem: 'Low organic indexation, duplicate titles, no schema markup, stagnant organic search rankings.',
      solution: 'Rebuilt robots.txt, sitemaps, JSON-LD graphs, fixed keyword gaps, and optimized Core Web Vitals.',
      result: 'Achieved 340% organic visibility growth, rich snippets in SERP, and reduced bounce rate within 60 days.',
      icon: Globe,
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)'
    },
    {
      id: 'restaurant-branding',
      title: 'Restaurant Branding Web Layout',
      category: 'Case Study · CSS Grid · Responsive · Interactions',
      tags: ['CSS Grid', 'Responsive UX', 'Vanilla JS', 'Performance Engineering'],
      description: 'Responsive frontend web architecture for custom culinary menus and interactive table reservation queries.',
      problem: 'Hard-coded legacy layouts, missing touch-friendly mobile navigation controls, slow image rendering.',
      solution: 'Constructed fluid CSS Grid layout architecture, pre-optimized rendering pipeline, and touch-optimized CTAs.',
      result: 'Smooth multi-viewport display, 100/100 performance scores, and clean codebase ready for backend integration.',
      icon: Cpu,
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)'
    },
    {
      id: 'b2b-conversion',
      title: 'Social Media B2B Conversion Funnel',
      category: 'Case Study · Meta Ads · Lead Gen · Pixel Events',
      tags: ['Meta Ads Funnels', 'Pixel Setup', 'CRO', 'Custom Audiences'],
      description: 'High-converting Meta Ads campaign strategy targeting qualified B2B enterprise sales leads.',
      problem: 'Poor target audience profiling, high volume of spam submissions, and escalating cost-per-lead (CPL).',
      solution: 'Engineered lookalike audiences, custom pixel event triggers, A/B ad creative testing, and CRO landing pages.',
      result: 'Increased ROAS by 4.5x, reduced CPL by 42%, and delivered pre-qualified B2B sales leads.',
      icon: ShoppingBag,
      gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)'
    }
  ];

  // Escape Key to Close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <section id="projects">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="pill" style={{ marginBottom: '16px' }}><FolderKanban size={14} /> Selected Case Studies</span>
        <h2 className="split-heading" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
          Featured Engineering & Marketing Works
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        {projects.map((proj) => {
          const IconComp = proj.icon;
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="glass"
              style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '400px',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div>
                <div style={{
                  height: '160px',
                  borderRadius: '16px',
                  background: proj.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <IconComp size={48} color="var(--accent-primary)" />
                </div>
                <span className="pill" style={{ fontSize: '0.75rem', marginBottom: '10px' }}>{proj.category}</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '10px' }}>{proj.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{proj.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '16px' }}>
                {proj.tags.map((t, idx) => (
                  <span key={idx} className="pill" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fly-In Project Detail Modal Overlay */}
      {selectedProject && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(9, 13, 22, 0.8)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="glass" style={{
            maxWidth: '840px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '40px',
            position: 'relative',
            boxShadow: '0 25px 70px rgba(0,0,0,0.8)'
          }}>
            <button
              onClick={() => setSelectedProject(null)}
              aria-label="Close case study details"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.06)',
                border: '1px solid var(--glass-border)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <X size={20} />
            </button>

            <span className="pill" style={{ marginBottom: '12px' }}>{selectedProject.category}</span>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '16px' }}>{selectedProject.title}</h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '28px' }}>
              {selectedProject.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px' }}>CHALLENGE & PROBLEM</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedProject.problem}</p>
              </div>

              <div style={{ backgroundColor: 'rgba(0,0,0,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-mint)', marginBottom: '6px' }}>ENGINEERING & MARKETING SOLUTION</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selectedProject.solution}</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-mint)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <CheckCircle2 size={16} /> MEASURABLE RESULT & IMPACT
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>{selectedProject.result}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
