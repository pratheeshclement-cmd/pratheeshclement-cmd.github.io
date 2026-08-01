import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { getDynamicIcon } from '../../utils/iconMap';
import { Project } from '../../types';
import { GlassCard } from './GlassCard';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Lock main page scrolling when project modal is open
  useScrollLock(Boolean(project), contentRef);

  // Trap focus inside modal
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Animate in
    if (!reduced) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }

    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length) focusables[0].focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, []);

  const handleClose = useCallback(() => {
    if (!reduced) {
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.25, onComplete: onClose,
      });
    } else {
      onClose();
    }
  }, [reduced, onClose]);

  const IconComp = getDynamicIcon(project.icon);

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={e => e.target === overlayRef.current && handleClose()}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div ref={contentRef} className="modal-content">
        <GlassCard style={{ padding: 40 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ padding: 10, borderRadius: 12, background: `${project.accentColor}18` }}>
                  <IconComp size={24} color={project.accentColor} />
                </div>
                <span className="section-label" style={{ marginBottom: 0 }}>{project.category}</span>
              </div>
              <h2 id="modal-title" style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {project.title}
              </h2>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close project details"
              style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Problem</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{project.problem}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Solution</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{project.solution}</p>
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Result</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{project.result}</p>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {project.tags.map(tag => (
              <span key={tag} className="pill">{tag}</span>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
