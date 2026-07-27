import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { SceneProps } from '../../types';
import { IDENTITY } from '../../data/identity';

interface BootSceneProps extends Partial<SceneProps> {
  onLeave: () => void;
}

const BootScene: React.FC<BootSceneProps> = ({ onLeave }) => {
  const [progress, setProgress] = useState(0);
  const bgImageRef  = useRef<HTMLImageElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 5-second total timeline animation
    const timelineObj = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        // Disassembly transition: zoom image in, fade overlay out smoothly
        gsap.to(bgImageRef.current, { scale: 1.25, opacity: 0, duration: 0.8, ease: 'power2.inOut' });
        gsap.to('#boot-overlay', {
          opacity: 0,
          scale: 1.05,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: onLeave,
        });
      },
    });

    // 1. Ken Burns background zoom over 5 seconds
    gsap.fromTo(
      bgImageRef.current,
      { scale: 1.18, opacity: 0.85 },
      { scale: 1.0, opacity: 0.95, duration: 5.0, ease: 'none' }
    );

    // 2. Scanline sweeping loop across photo
    gsap.fromTo(
      scanLineRef.current,
      { top: '-10%' },
      { top: '110%', duration: 2.5, repeat: 1, ease: 'linear' }
    );

    // 3. Center card assembly
    tl.fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.92, filter: 'blur(10px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }
    );

    // 4. Progress counter from 0 to 100 over 4.8s
    tl.to(timelineObj, {
      value: 100,
      duration: 4.0,
      ease: 'power1.inOut',
      onUpdate: () => setProgress(Math.floor(timelineObj.value)),
    }, '-=0.4');

    // 5. Progress bar fill
    gsap.fromTo(progressBarRef.current,
      { width: '0%' },
      { width: '100%', duration: 4.5, ease: 'power1.inOut' }
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        tl.kill();
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
      {/* Full-screen high-res portrait image background with cinematic lighting */}
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

      {/* Holographic scanner line */}
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

      {/* Vignette and radial lighting overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(9, 13, 22, 0.3) 0%, rgba(9, 13, 22, 0.85) 80%)',
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
            Initializing Cinematic Universe
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
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #10B981)',
              borderRadius: 999,
              boxShadow: '0 0 15px var(--accent-primary)',
            }}
          />
        </div>

        {/* Percentage text */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'var(--font-mono)' }}>
          <span>Loading Spatial Engine...</span>
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
