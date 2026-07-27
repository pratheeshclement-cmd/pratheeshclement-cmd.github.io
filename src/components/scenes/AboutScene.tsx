import React, { useRef } from 'react';
import { User, Compass } from 'lucide-react';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { IDENTITY } from '../../data/identity';

const AboutScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);

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

          {/* Right — 3D tilt glass card */}
          <div>
            <GlassCard tilt style={{ padding: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={22} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Career Origins</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>How It Started</div>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontStyle: 'italic' }}>
                "{IDENTITY.bio.career}"
              </p>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--bg-tertiary)' }}>
                {[
                  { label: 'Services', value: '9+' },
                  { label: 'Case Studies', value: '4' },
                  { label: 'Certifications', value: '2' },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Mission card */}
            <GlassCard style={{ padding: 24, marginTop: 20 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-mint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Mission</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{IDENTITY.mission}</p>
            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutScene;
