import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, FolderKanban } from 'lucide-react';
import gsap from 'gsap';
import { getDynamicIcon } from '../../utils/iconMap';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { ProjectModal } from '../ui/ProjectModal';
import { PROJECTS } from '../../data/projects';
import { Project } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ProjectCard: React.FC<{ project: Project; index: number; onOpen: (p: Project) => void }> = ({ project, index, onOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', delay: index * 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none reverse' },
      }
    );
  }, [index, reduced]);

  const IconEl = getDynamicIcon(project.icon);

  return (
    <div ref={ref} style={{ opacity: reduced ? 1 : 0 }}>
      <GlassCard
        tilt
        className="project-card-glow"
        style={{ padding: 28, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 380, cursor: 'pointer' }}
        onClick={() => onOpen(project)}
        aria-label={`View ${project.title} case study`}
      >
        {/* Icon banner */}
        <div style={{
          height: 160, borderRadius: 16, marginBottom: 20,
          background: `linear-gradient(135deg, ${project.accentColor}18, ${project.accentColor}08)`,
          border: `1px solid ${project.accentColor}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconEl size={48} color={project.accentColor} />
        </div>

        {/* Category */}
        <span className="section-label" style={{ marginBottom: 12, fontSize: '0.72rem' }}>{project.category.split('·')[0].trim()}</span>

        {/* Title */}
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.3 }}>
          {project.title}
        </h3>

        {/* Summary */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1 }}>
          {project.summary}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
          {project.tags.slice(0, 3).map(t => (
            <span key={t} className="pill" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>{t}</span>
          ))}
        </div>

        {/* CTA indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, color: project.accentColor, fontSize: '0.85rem', fontWeight: 600 }}>
          View Case Study <ArrowRight size={14} />
        </div>
      </GlassCard>
    </div>
  );
};

import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';

const ProjectsScene: React.FC<{ id: string }> = ({ id }) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useCinematicSceneTransition(sectionRef, 'slide-right');

  return (
    <section id={id} ref={sectionRef} className="scene" aria-label="Projects section">
      <div className="scene-inner">
        <div style={{ marginBottom: 56 }}>
          <span className="section-label">
            <FolderKanban size={13} />
            Case Studies
          </span>
          <SplitText
            text="Selected Works"
            tag="h2"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
          />
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 560, marginTop: 16, lineHeight: 1.7 }}>
            Real projects. Real problems. Real results — no invented metrics.
          </p>
        </div>

        <div className="grid-2">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={setActiveProject}
            />
          ))}
        </div>
      </div>

      {/* In-place modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  );
};

export default ProjectsScene;
