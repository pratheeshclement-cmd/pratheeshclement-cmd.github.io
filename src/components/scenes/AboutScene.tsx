import React, { useRef } from 'react';
import { User, Compass } from 'lucide-react';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { IDENTITY } from '../../data/identity';
import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';

const AboutScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCinematicSceneTransition(sectionRef);

  return (
    <section id={id} ref={sectionRef} className="scene" aria-label="About section">
      <div className="scene-inner">
        <div className="grid-2" style={{ alignItems: 'center' }}>

          {/* Left — Text content */}
          <div>
            <span className="section-label">
              <User size={13} />
              About Pratheesh
            </span>

            <SplitText
              text="The Story"
              tag="h2"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 24, lineHeight: 1.1 }}
            />

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 20 }}>
              {IDENTITY.bio.medium}
            </p>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)', paddingLeft: 16 }}>
              {IDENTITY.bio.career.slice(0, 220)}…
            </p>

            {/* Core values pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
              {IDENTITY.coreValues.map((v, i) => (
                <span key={v} className="pill" style={{ animationDelay: `${i * 0.05}s` }}>{v}</span>
              ))}
            </div>
          </div>

          {/* Right — Profile Photo & Glass Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <GlassCard tilt style={{ padding: 24, textAlign: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxHeight: 340,
                borderRadius: 20,
                overflow: 'hidden',
                marginBottom: 20,
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 12px 32px rgba(59, 130, 246, 0.15)',
              }}>
                <img
                  src="/assets/pratheesh4k1.jpeg"
                  alt="Pratheesh Clement — Digital Marketing Specialist"
                  style={{
                    width: '100%',
                    height: 320,
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    display: 'block',
                  }}
                  onError={(e) => {
                    // Fallback to second photo if first has path issue
                    (e.currentTarget as HTMLImageElement).src = '/assets/pratheesh4k2.jpeg';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 16,
                  right: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}>
                  <span>Pratheesh Clement</span>
                  <span className="pill" style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
                    Vadalur, India
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, textAlign: 'left' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Compass size={20} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Career Origins</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>How It Started</div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', textAlign: 'left' }}>
                "{IDENTITY.bio.career}"
              </p>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--bg-tertiary)' }}>
                {[
                  { label: 'Services', value: '9+' },
                  { label: 'Case Studies', value: '4' },
                  { label: 'Certifications', value: '2' },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Mission card */}
            <GlassCard style={{ padding: 20 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-mint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Mission</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{IDENTITY.mission}</p>
            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutScene;
