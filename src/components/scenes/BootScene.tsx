import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { SceneProps } from '../../types';
import { IDENTITY } from '../../data/identity';

interface BootSceneProps extends Partial<SceneProps> {
  onLeave: () => void;
}

const BootScene: React.FC<BootSceneProps> = ({ onLeave }) => {
  const [progress, setProgress] = useState(0);
  const bgImageRef     = useRef<HTMLImageElement>(null);
  const cardRef        = useRef<HTMLDivElement>(null);
  const scanLineRef    = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Anime.js Ken Burns background zoom
    if (bgImageRef.current) {
      anime({
        targets: bgImageRef.current,
        scale: [1.18, 1.0],
        opacity: [0.8, 0.95],
        duration: 5000,
        easing: 'linear',
      });
    }

    // 2. Anime.js Holographic scan line loop
    if (scanLineRef.current) {
      anime({
        targets: scanLineRef.current,
        top: ['-10%', '110%'],
        duration: 2500,
        loop: true,
        easing: 'linear',
      });
    }

    // 3. Anime.js Center Card Assembly Sequence
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [60, 0],
        scale: [0.9, 1.0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 200,
      });
    }

    // 4. Anime.js Progress Bar & Counter
    const counterObj = { value: 0 };
    anime({
      targets: counterObj,
      value: 100,
      round: 1,
      duration: 4600,
      easing: 'easeInOutCubic',
      update: () => {
        setProgress(counterObj.value);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${counterObj.value}%`;
        }
      },
      complete: () => {
        // Flying Camera Exit Transition into Hero Section
        anime({
          targets: bgImageRef.current,
          scale: 1.3,
          opacity: 0,
          duration: 800,
          easing: 'easeInQuint',
        });

        anime({
          targets: '#boot-overlay',
          opacity: 0,
          scale: 1.08,
          duration: 800,
          easing: 'easeInQuint',
          complete: onLeave,
        });
      },
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onLeave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onLeave]);

  return (
    <div
      id="boot-overlay"
      role="status"
      aria-label="Loading Portfolio X"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#090D16',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Full-screen 9:16 high-res portrait image background */}
      <img
        ref={bgImageRef}
        src="/assets/pratheesh4k2.jpeg"
        alt="Pratheesh Clement Full Portrait"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 25%',
          filter: 'brightness(0.75) contrast(1.1)',
          pointerEvents: 'none',
        }}
      />

      {/* Holographic laser scan line */}
      <div
        ref={scanLineRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, var(--accent-primary) 50%, var(--accent-secondary) 100%)',
          boxShadow: '0 0 25px var(--accent-primary), 0 0 50px var(--accent-secondary)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Vignette & radial lighting overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(9, 13, 22, 0.2) 0%, rgba(9, 13, 22, 0.85) 80%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Center assembly glassmorphic card */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          zIndex: 10,
          width: 'min(520px, calc(100vw - 40px))',
          padding: '36px 32px',
          borderRadius: 28,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(32px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.25)',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        {/* Profile Avatar Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div
            style={{
              position: 'relative',
              width: 80,
              height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--accent-primary)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
            }}
          >
            <img
              src="/assets/pratheesh4k1.jpeg"
              alt="Pratheesh Clement Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: 6,
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          {IDENTITY.name}
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          color: 'rgba(255, 255, 255, 0.85)',
          fontStyle: 'italic',
          marginBottom: 24,
        }}>
          "{IDENTITY.tagline}"
        </p>

        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <span className="pill" style={{ background: 'rgba(59, 130, 246, 0.25)', border: '1px solid rgba(59, 130, 246, 0.5)', color: '#93C5FD', fontSize: '0.78rem' }}>
            <Sparkles size={12} />
            Anime.js Master Motion System
          </span>
          <span className="pill" style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid rgba(16, 185, 129, 0.5)', color: '#6EE7B7', fontSize: '0.78rem' }}>
            <ShieldCheck size={12} />
            Verified Portfolio
          </span>
        </div>

        {/* Progress bar container */}
        <div style={{
          width: '100%',
          height: 6,
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 999,
          overflow: 'hidden',
          marginBottom: 12,
          position: 'relative',
        }}>
          <div
            ref={progressBarRef}
            style={{
              height: '100%',
              width: '0%',
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #10B981)',
              borderRadius: 999,
              boxShadow: '0 0 15px var(--accent-primary)',
            }}
          />
        </div>

        {/* Percentage text */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'var(--font-mono)' }}>
          <span>Loading Spatial Motion Engine...</span>
          <span style={{ color: '#6EE7B7', fontWeight: 600 }}>{progress}%</span>
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={onLeave}
        aria-label="Skip intro"
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'rgba(255, 255, 255, 0.8)',
          padding: '10px 20px',
          borderRadius: 9999,
          fontSize: '0.82rem',
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
      >
        Skip Intro (Esc)
      </button>
    </div>
  );
};

export default BootScene;
