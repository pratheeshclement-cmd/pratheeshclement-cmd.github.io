import React, { useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { SERVICES } from '../../data/services';
import { Service } from '../../types';
import { useMagneticHover } from '../../hooks/useMagneticHover';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';
import { navigateTo } from '../../router/useRouter';

const SERVICE_ROUTE_MAP: Record<string, string> = {
  'technical-seo': '/seo/',
  'digital-marketing-strategy': '/digital-marketing/',
  'ui-ux-design': '/ui-ux-design/',
  'website-development': '/web-development/',
  'google-ads': '/google-ads/',
  'meta-ads': '/meta-ads/',
  'ai-automation': '/ai-automation/',
  'freelancing': '/freelancing/',
};

const ServiceCardItem: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { ref: magRef, onMouseMove, onMouseLeave } = useMagneticHover<HTMLDivElement>();

  useEffect(() => {
    if (reduced || !cardRef.current) return;
    
    // Lightweight mobile-friendly GSAP reveal
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        delay: Math.min(index * 0.05, 0.3),
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [index, reduced]);

  const IconEl = ((Icons as unknown) as Record<string, React.FC<{ size?: number; color?: string }>>)[
    service.icon.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  ] ?? (Icons.Layers as unknown as React.FC<{ size?: number; color?: string }>);

  const targetRoute = SERVICE_ROUTE_MAP[service.id] || '/services/';
  const accent = service.accentColor || 'var(--accent-primary)';

  return (
    <div ref={cardRef} style={{ opacity: reduced ? 1 : 0, width: '100%', minWidth: 0 }}>
      <GlassCard
        style={{ cursor: 'pointer', width: '100%', overflow: 'hidden' }}
        onClick={() => navigateTo(targetRoute)}
      >
        <div
          className="service-row"
          ref={magRef}
          onMouseMove={!reduced ? onMouseMove : undefined}
          onMouseLeave={!reduced ? onMouseLeave : undefined}
        >
          {/* Card Header & Content Wrapper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, width: '100%', minWidth: 0 }}>
            
            {/* Top Bar: Index + Icon + Category */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div
                  className="service-icon"
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    background: `${accent}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconEl size={22} color={accent} />
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: accent,
                  background: `${accent}12`,
                  border: `1px solid ${accent}30`,
                  padding: '4px 10px',
                  borderRadius: 9999,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                SPECIALIZATION
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h3
                style={{
                  fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                  lineHeight: 1.25,
                  textAlign: 'left',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                }}
              >
                {service.name}
              </h3>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  textAlign: 'left',
                  margin: 0,
                  overflowWrap: 'break-word',
                }}
              >
                {service.description}
              </p>
            </div>

            {/* Highlights pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {service.highlights.map(h => (
                <span key={h} className="pill" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Touch-Friendly Action CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: accent, fontSize: '0.88rem', fontWeight: 600 }}>
              <span>Explore {service.name} Strategy</span>
              <Icons.ArrowRight size={16} />
            </div>

          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const ServicesScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCinematicSceneTransition(sectionRef, 'glass-morph');

  return (
    <section id={id} ref={sectionRef} className="scene" aria-label="Services section">
      <div className="scene-inner">
        <div style={{ marginBottom: 40 }}>
          <span className="section-label">
            <Icons.Layers size={13} />
            Expertise & Capabilities
          </span>
          <SplitText
            text="Services & Solutions"
            tag="h2"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 3.2rem)', lineHeight: 1.15 }}
          />
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 640, marginTop: 16, lineHeight: 1.7 }}>
            End-to-end digital solutions combining technical search engine optimization, performance marketing, frontend engineering, and AI automation.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          {SERVICES.map((svc, i) => (
            <ServiceCardItem key={svc.id} service={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesScene;
