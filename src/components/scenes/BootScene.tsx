import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, Cpu } from 'lucide-react';
import { SceneProps } from '../../types';
import { IDENTITY } from '../../data/identity';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';

interface BootSceneProps extends Partial<SceneProps> {
  onLeave: () => void;
}

export const BootScene: React.FC<BootSceneProps> = ({ onLeave }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const reduced      = useReducedMotion();

  // Lock page scrolling while intro sequence is active
  useScrollLock(true);

  useEffect(() => {
    if (reduced) {
      onLeave();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: onLeave,
        });
      },
    });

    // 1. Initial subtle text reveal
    if (contentRef.current) {
      const items = contentRef.current.querySelectorAll('.boot-item');
      tl.fromTo(
        items,
        { y: 20, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.15, ease: 'power3.out' },
        0.2
      );
    }

    // 2. Progress bar animation (1.8s)
    if (progressBarRef.current) {
      tl.fromTo(
        progressBarRef.current,
        { width: '0%' },
        { width: '100%', duration: 1.8, ease: 'power2.inOut' },
        0.4
      );
    }

    // Pause briefly at 100% then transition
    tl.to({}, { duration: 0.3 });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        tl.kill();
        onLeave();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      tl.kill();
    };
  }, [onLeave, reduced]);

  return (
    <div
      ref={containerRef}
      id="boot-overlay"
      role="status"
      aria-label="Pratheesh OS System Initialization"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-primary)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        willChange: 'opacity, transform',
      }}
    >
      {/* Subtle ambient blur orb background */}
      <div
        style={{
          position: 'absolute',
          width: 'min(500px, 80vw)',
          height: 'min(500px, 80vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Center Startup Content */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: 24,
          maxWidth: 460,
          width: '100%',
        }}
      >
        {/* System Directive Badge */}
        <div className="boot-item" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, opacity: 0 }}>
          <span
            className="pill"
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              borderColor: 'rgba(59, 130, 246, 0.25)',
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <Cpu size={13} />
            PRATHEESH OS v1.0 · INITIALIZING
          </span>
        </div>

        {/* Identity Title */}
        <h1
          className="boot-item"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 8px 0',
            color: 'var(--text-primary)',
            opacity: 0,
          }}
        >
          {IDENTITY.name}
        </h1>

        {/* Subtitle */}
        <p
          className="boot-item"
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            margin: '0 0 28px 0',
            opacity: 0,
          }}
        >
          {IDENTITY.title}
        </p>

        {/* Loading Progress Bar Container */}
        <div
          className="boot-item"
          style={{
            width: '100%',
            height: 4,
            background: 'var(--bg-tertiary)',
            borderRadius: 99,
            overflow: 'hidden',
            marginBottom: 16,
            opacity: 0,
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              height: '100%',
              width: '0%',
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))',
              borderRadius: 99,
            }}
          />
        </div>

        {/* Status text */}
        <div className="boot-item" style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', opacity: 0 }}>
          Loading digital ecosystem...
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onLeave}
        aria-label="Skip startup"
        style={{
          position: 'absolute',
          bottom: 28,
          right: 28,
          zIndex: 20,
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)',
          padding: '8px 18px',
          borderRadius: 9999,
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-primary)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
      >
        Skip (Esc)
      </button>
    </div>
  );
};

export default BootScene;
