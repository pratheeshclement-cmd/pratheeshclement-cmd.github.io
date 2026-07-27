import React, { useRef, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import * as Icons from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { SKILLS } from '../../data/skills';
import { SkillCategory } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const LEVEL_COLORS: Record<string, string> = {
  Expert: 'var(--accent-mint)',
  Proficient: 'var(--accent-primary)',
  Learning: 'var(--accent-warm)',
};

const SkillCard: React.FC<{ cat: SkillCategory; index: number }> = ({ cat, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: index * 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none reverse' },
      }
    );
  }, [index, reduced]);

  const IconEl = ((Icons as unknown) as Record<string, React.FC<{ size?: number; color?: string }>>)[
    cat.icon.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  ] ?? (Icons.Code as unknown as React.FC<{ size?: number; color?: string }>);

  return (
    <div ref={ref} style={{ opacity: reduced ? 1 : 0 }}>
      <GlassCard style={{ padding: 28, height: '100%' }}>
        {/* Category header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, borderRadius: 10, background: `${cat.accentColor}18` }}>
              <IconEl size={20} color={cat.accentColor} />
            </div>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{cat.name}</h3>
          </div>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, color: LEVEL_COLORS[cat.level] ?? 'var(--text-tertiary)',
            background: `${LEVEL_COLORS[cat.level] ?? 'var(--accent-primary)'}15`,
            border: `1px solid ${LEVEL_COLORS[cat.level] ?? 'var(--accent-primary)'}30`,
            padding: '3px 10px', borderRadius: 9999,
          }}>
            {cat.level}
          </span>
        </div>

        {/* Skill pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {cat.skills.map(skill => (
            <span key={skill} className="pill" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>{skill}</span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

const SkillsScene: React.FC<{ id: string }> = ({ id }) => (
  <section id={id} className="scene" aria-label="Skills section">
    <div className="scene-inner">
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <span className="section-label">
          <Cpu size={13} />
          Technical Matrix
        </span>
        <SplitText
          text="Technical Arsenal"
          tag="h2"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
        />
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '16px auto 0', lineHeight: 1.7 }}>
          Six domains — each working together as one unified digital ecosystem.
        </p>
      </div>

      <div className="grid-3">
        {SKILLS.map((cat, i) => (
          <SkillCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default SkillsScene;
