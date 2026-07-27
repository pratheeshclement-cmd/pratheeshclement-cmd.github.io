import React, { useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { SERVICES } from '../../data/services';
import { Service } from '../../types';
import { useMagneticHover } from '../../hooks/useMagneticHover';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ServiceRow: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { ref: magRef, onMouseMove, onMouseLeave } = useMagneticHover<HTMLDivElement>();

  useEffect(() => {
    if (reduced || !cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, x: -24 },
      {
        opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', delay: index * 0.07,
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%', toggleActions: 'play none none reverse' },
      }
    );
  }, [index, reduced]);

  const IconEl = ((Icons as unknown) as Record<string, React.FC<{ size?: number; color?: string }>>)[
    service.icon.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  ] ?? (Icons.Layers as unknown as React.FC<{ size?: number; color?: string }>);

  return (
    <div ref={cardRef} style={{ opacity: reduced ? 1 : 0 }}>
      <GlassCard
        style={{ cursor: 'pointer' }}
      >
        <div
          className="service-row"
          ref={magRef}
          onMouseMove={!reduced ? onMouseMove : undefined}
          onMouseLeave={!reduced ? onMouseLeave : undefined}
        >
          {/* Number + icon + info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
            <span style={{
              fontSize: '1.6rem', fontWeight: 700,
              color: 'var(--bg-tertiary)',
              fontFamily: 'var(--font-display)',
              minWidth: 32, flexShrink: 0,
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 10, borderRadius: 12, background: 'rgba(59,130,246,0.08)', flexShrink: 0 }} className="service-icon">
                <IconEl size={22} color="var(--accent-primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 4 }}>{service.name}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{service.description}</p>
              </div>
            </div>
          </div>

          {/* Highlights pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end', maxWidth: 220, flexShrink: 0 }}>
            {service.highlights.map(h => (
              <span key={h} className="pill" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{h}</span>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const ServicesScene: React.FC<{ id: string }> = ({ id }) => (
  <section id={id} className="scene" aria-label="Services section">
    <div className="scene-inner">
      <div style={{ marginBottom: 56 }}>
        <span className="section-label">
          <Icons.Layers size={13} />
          What I Build
        </span>
        <SplitText
          text="Services"
          tag="h2"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
        />
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 560, marginTop: 16, lineHeight: 1.7 }}>
          End-to-end digital solutions — from strategy to deployment.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SERVICES.map((svc, i) => (
          <ServiceRow key={svc.id} service={svc} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default ServicesScene;
