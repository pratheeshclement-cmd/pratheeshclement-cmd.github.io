import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * AmbientBackground
 * Fixed full-screen background layer with soft gradient orbs that react
 * to mouse movement in real time for a smooth, high-end parallax atmosphere.
 */
export const AmbientBackground: React.FC = () => {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: normX * 45,
          y: normY * 45,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -normX * 35,
          y: -normY * 35,
          duration: 1.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          x: normX * 25,
          y: normY * 25,
          duration: 1.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Top-left orb — soft sky blue */}
      <div
        ref={orb1Ref}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />

      {/* Top-right orb — soft lavender */}
      <div
        ref={orb2Ref}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />

      {/* Bottom-center orb — soft mint */}
      <div
        ref={orb3Ref}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '30%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)',
          filter: 'blur(100px)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
