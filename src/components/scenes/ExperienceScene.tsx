import React, { useRef, useEffect } from 'react';
import { ShieldCheck, Briefcase } from 'lucide-react';
import gsap from 'gsap';
import { getDynamicIcon } from '../../utils/iconMap';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { EXPERIENCE } from '../../data/experience';
import { ExperienceItem } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';

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

  const IconEl = getDynamicIcon(item.icon);

  const typeColor = item.type === 'certification' ? 'var(--accent-mint)'
    : item.type === 'education' ? 'var(--accent-secondary)' : 'var(--accent-primary)';

  return (
    <div ref={ref} className="timeline-item" style={{ opacity: reduced ? 1 : 0 }}>
      <div className="timeline-node" style={{ background: typeColor, boxShadow: `0 0 16px ${typeColor}` }}>
        <IconEl size={18} color="#fff" />
      </div>

      <div className="timeline-content">
        <GlassCard style={{ padding: 24, borderLeft: `3px solid ${typeColor}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            <div>
              <span className="pill" style={{ color: typeColor, borderColor: `${typeColor}40`, marginBottom: 6, fontSize: '0.72rem' }}>
                {item.type.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '1.1rem', margin: '4px 0 2px' }}>{item.role}</h3>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.company}</p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              {item.period}
            </span>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{item.description}</p>

          {item.credentialId && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: 'rgba(0,0,0,0.05)',
                padding: '4px 12px', borderRadius: 6, color: 'var(--text-secondary)',
              }}>
                ID: {item.credentialId}
              </span>
              <span className="pill" style={{ color: 'var(--accent-mint)', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', fontSize: '0.72rem' }}>
                <ShieldCheck size={12} />
                Verified — {item.verifier}
              </span>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

const ExperienceScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCinematicSceneTransition(sectionRef, 'timeline-reveal');

  return (
    <section id={id} ref={sectionRef} className="scene" aria-label="Experience and certifications section">
      <div className="scene-inner">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-label">
            <Briefcase size={13} />
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
};

export default ExperienceScene;
