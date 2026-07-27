import React, { useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { EXPERIENCE } from '../../data/experience';
import { ExperienceItem } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const TimelineCard: React.FC<{ item: ExperienceItem; index: number }> = ({ item, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const dir = index % 2 === 0 ? -30 : 30;
    gsap.fromTo(ref.current,
      { opacity: 0, x: dir },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none reverse' },
      }
    );
  }, [index, reduced]);

  const IconEl = ((Icons as unknown) as Record<string, React.FC<{ size?: number; color?: string }>>)[
    item.icon.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  ] ?? (Icons.Briefcase as unknown as React.FC<{ size?: number; color?: string }>);

  const typeColor = item.type === 'certification' ? 'var(--accent-mint)'
    : item.type === 'education' ? 'var(--accent-secondary)' : 'var(--accent-primary)';

  return (
    <div ref={ref} className="timeline-item" style={{ opacity: reduced ? 1 : 0 }}>
      {/* Dot */}
      <div
        className="timeline-dot"
        style={{ background: `${typeColor}18`, border: `2px solid ${typeColor}` }}
      >
        <IconEl size={20} color={typeColor} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 8 }}>
        <GlassCard style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: typeColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {item.current ? '● Current Role' : item.type === 'certification' ? '✓ Verified' : item.period}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 2 }}>{item.company}</h3>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.role}</div>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{item.description}</p>

          {/* Credential ID badge */}
          {item.credentialId && (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: 'rgba(0,0,0,0.05)',
                padding: '4px 12px', borderRadius: 6, color: 'var(--text-secondary)',
              }}>
                ID: {item.credentialId}
              </span>
              <span className="pill" style={{ color: 'var(--accent-mint)', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', fontSize: '0.72rem' }}>
                <Icons.ShieldCheck size={12} />
                Verified — {item.verifier}
              </span>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

const ExperienceScene: React.FC<{ id: string }> = ({ id }) => (
  <section id={id} className="scene" aria-label="Experience and certifications section">
    <div className="scene-inner">
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <span className="section-label">
          <Icons.Briefcase size={13} />
          Experience & Credentials
        </span>
        <SplitText
          text="Career Journey"
          tag="h2"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
        />
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="timeline">
          {EXPERIENCE.map((item, i) => (
            <TimelineCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ExperienceScene;
