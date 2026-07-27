import React from 'react';
import { ThreeHeroGlobe } from './ThreeHeroGlobe';
import { ArrowDown, Bot, Code2, Sparkles, Send } from 'lucide-react';

interface HeroSectionProps {
  onOpenAI: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAI, onExploreClick }) => {
  return (
    <section id="hero" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '960px', margin: '0 auto' }}>
        {/* Role Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span className="pill"><Sparkles size={14} /> Architect of Digital Ecosystems</span>
          <span className="pill" style={{ color: 'var(--accent-tertiary)', borderColor: 'rgba(139, 92, 246, 0.3)', backgroundColor: 'rgba(139, 92, 246, 0.08)' }}>
            <Bot size={14} /> Digital Marketing Specialist • AI Enthusiast
          </span>
        </div>

        {/* Hero Name */}
        <h1 style={{
          fontSize: 'clamp(3.2rem, 7vw, 6rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          marginBottom: '20px'
        }}>
          PRATHEESH <span className="text-gradient">CLEMENT</span>
        </h1>

        {/* Motto Accent Pill */}
        <div className="glass" style={{ display: 'inline-block', padding: '10px 24px', marginBottom: '28px', borderRadius: '9999px' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontWeight: 500 }}>
            "Sacrifice is the brilliant move"
          </p>
        </div>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          maxWidth: '720px',
          margin: '0 auto 36px',
          lineHeight: 1.7
        }}>
          Designing complete digital ecosystems where branding, user experience, search engine optimization, performance engineering, and AI automation operate as one integrated growth system.
        </p>

        {/* Action CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={onExploreClick} className="btn-primary">
            Explore Experience <ArrowDown size={18} />
          </button>
          <button onClick={onOpenAI} className="btn-secondary">
            <Bot size={18} color="var(--accent-tertiary)" /> AI Concierge Assistant
          </button>
        </div>
      </div>

      {/* Background Interactive Three.js Particle Globe */}
      <div style={{ marginTop: '-80px', position: 'relative', zIndex: 1 }}>
        <ThreeHeroGlobe />
      </div>
    </section>
  );
};
