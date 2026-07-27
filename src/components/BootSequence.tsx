import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Cpu, Sparkles } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    // Prefers reduced motion skip
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    tl.to('.boot-logo', { scale: 1.2, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' })
      .to('.boot-dot', { scale: 1.5, repeat: 2, yoyo: true, duration: 0.3 })
      .to('.boot-container', { opacity: 0, duration: 0.5, delay: 0.4 });

    const handleSkip = () => {
      if (!skipped) {
        setSkipped(true);
        tl.kill();
        onComplete();
      }
    };

    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);

    return () => {
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
    };
  }, [onComplete, skipped]);

  return (
    <div
      className="boot-container"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#090D16',
        color: '#FFFFFF',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      <div className="boot-logo" style={{ opacity: 0, transform: 'scale(0.8)', marginBottom: '24px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)'
        }}>
          <Sparkles size={36} color="#FFF" />
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: '#FFF' }}>
          PORTFOLIO <span style={{ color: '#3B82F6' }}>X</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px' }}>
          PRATHEESH CLEMENT
        </p>
      </div>

      <div className="boot-dot" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3B82F6', marginBottom: '16px' }} />

      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
        Press any key or click to skip
      </div>
    </div>
  );
};
