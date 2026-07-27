import React, { useEffect } from 'react';
import gsap from 'gsap';
import { SceneProps } from '../../types';

interface BootSceneProps extends Partial<SceneProps> {
  onLeave: () => void;
}

const BootScene: React.FC<BootSceneProps> = ({ onLeave }) => {
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('#boot-overlay', {
          opacity: 0, duration: 0.6, ease: 'power2.inOut',
          onComplete: onLeave,
        });
      },
    });

    tl.to('#boot-dot', { scale: 1.6, repeat: 1, yoyo: true, duration: 0.35, ease: 'power2.inOut' })
      .to('#boot-dot', { scale: 14, opacity: 0, duration: 0.55, ease: 'power2.in' })
      .to('#boot-text', { opacity: 0, duration: 0.2 }, '-=0.3');

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { tl.kill(); onLeave(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onLeave]);

  return (
    <div
      id="boot-overlay"
      role="status"
      aria-label="Loading Portfolio X"
      style={{
        position: 'fixed', inset: 0, background: '#000',
        zIndex: 99999, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
      }}
    >
      <div
        id="boot-dot"
        aria-hidden="true"
        style={{
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--accent-primary)',
          boxShadow: '0 0 40px var(--accent-primary)',
        }}
      />
      <p
        id="boot-text"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#64748B', letterSpacing: '0.05em' }}
      >
        Initializing Portfolio X<span aria-hidden="true">...</span>
      </p>
      <button
        onClick={onLeave}
        aria-label="Skip intro"
        style={{
          position: 'absolute', bottom: 32, right: 32,
          background: 'none', border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.4)', padding: '8px 16px',
          borderRadius: 9999, fontSize: '0.8rem', cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}
      >
        Skip (Esc)
      </button>
    </div>
  );
};

export default BootScene;
