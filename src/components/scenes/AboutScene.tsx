import React, { useRef } from 'react';
import { User, Compass, Target, Award, Sparkles } from 'lucide-react';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { IDENTITY } from '../../data/identity';
import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';

const AboutScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  // Direct DOM refs for orb parallax — avoids React re-renders on every mousemove
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useCinematicSceneTransition(sectionRef, 'slide-left');

  // ✅ FIX: Direct DOM style mutation — no useState, no React re-renders on mousemove
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    const x1 = normX * 36;
    const y1 = normY * 36;
    if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${x1}px, ${y1}px)`;
    if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${-normX * 28}px, ${-normY * 28}px)`;
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="scene"
      aria-label="About section"
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Dynamic Mouse Parallax Ambient Orbs — GPU-composited, zero React renders */}
      <div
        ref={orb1Ref}
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          transform: 'translate(0px, 0px)',
          transition: 'transform 0.25s ease-out',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
        }}
      />
      <div
        ref={orb2Ref}
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          transform: 'translate(0px, 0px)',
          transition: 'transform 0.25s ease-out',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      <div className="scene-inner" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main 2-Column Split: Story & Vision text vs Portrait Showcase */}
        <div className="grid-2" style={{ alignItems: 'center', gap: 48, marginBottom: 48 }}>

          {/* Left Column — Text content (Strictly No Overflow) */}
          <div style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            <span className="section-label" style={{ marginBottom: 16 }}>
              <User size={13} />
              About Pratheesh Clement
            </span>

            <SplitText
              text="The Story & Vision"
              tag="h2"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                marginBottom: 24,
                lineHeight: 1.1,
                color: 'var(--text-primary)',
              }}
            />

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                marginBottom: 28,
                maxWidth: 620,
              }}
            >
              {IDENTITY.bio.medium}
            </p>

            {/* Core Values Pills */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Core Values & Directives
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {IDENTITY.coreValues.map((v) => (
                  <span key={v} className="pill" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                    <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Head-and-Shoulders Portrait Card */}
          <div style={{ width: '100%' }}>
            <GlassCard
              tilt
              style={{
                padding: 20,
                borderRadius: 28,
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(59, 130, 246, 0.15)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(320px, 42vh, 440px)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  marginBottom: 20,
                  border: '1.5px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
                }}
              >
                <img
                  src="/assets/pratheesh4k1.jpeg"
                  alt="Pratheesh Clement — Digital Marketing Specialist & Technical SEO Expert"
                  title="Pratheesh Clement — Digital Marketing Specialist"
                  width={600}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 10%',
                    display: 'block',
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/pratheesh4k2.jpeg';
                  }}
                />

                {/* Subtle sheen gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.5) 0%, transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Floating Location Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    left: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Pratheesh Clement</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>BCA · Google Certified</div>
                  </div>
                  <span
                    className="pill"
                    style={{
                      background: 'rgba(15, 23, 42, 0.65)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      fontSize: '0.75rem',
                    }}
                  >
                    Vadalur, TN, India
                  </span>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                  paddingTop: 16,
                  borderTop: '1px solid var(--bg-tertiary)',
                }}
              >
                {[
                  { label: 'Core Services', value: '9+' },
                  { label: 'Case Studies', value: '4' },
                  { label: 'Certifications', value: '2' },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom 2-Column Equal-Height Cards: Career Origins vs. Mission */}
        <div className="grid-2" style={{ gap: 24, alignItems: 'stretch' }}>

          {/* Career Origins Card */}
          <GlassCard
            style={{
              padding: 28,
              borderLeft: '4px solid var(--accent-primary)',
              background: 'var(--glass-bg)',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(59, 130, 246, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Compass size={20} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Career Origins
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Nexteer Automotive → Digital Marketing Lead
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                "{IDENTITY.bio.career}"
              </p>
            </div>
          </GlassCard>

          {/* Mission & Positioning Card */}
          <GlassCard
            style={{
              padding: 28,
              borderLeft: '4px solid var(--accent-mint)',
              background: 'var(--glass-bg)',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Target size={20} color="var(--accent-mint)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-mint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Strategic Positioning
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Mission & Digital Ecosystems
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                {IDENTITY.mission}
              </p>
            </div>
          </GlassCard>

        </div>
      </div>
    </section>
  );
};

export default AboutScene;
