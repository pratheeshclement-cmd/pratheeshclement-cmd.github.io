import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const HeroAuroraGlass: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Morphing floating animation for aurora light blobs
    const tween1 = gsap.to(orb1Ref.current, {
      x: 35,
      y: -40,
      scale: 1.15,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.easeInOut',
    });

    const tween2 = gsap.to(orb2Ref.current, {
      x: -45,
      y: 30,
      scale: 1.2,
      duration: 7.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.easeInOut',
      delay: 1,
    });

    const tween3 = gsap.to(orb3Ref.current, {
      x: 25,
      y: 35,
      scale: 0.9,
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.easeInOut',
      delay: 2,
    });

    return () => {
      tween1.kill();
      tween2.kill();
      tween3.kill();
    };
  }, [reducedMotion]);

  // Gentle mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(containerRef.current, {
      x: normX * 30,
      y: normY * 30,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        inset: -40,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Morphing Aurora Light Orbs */}
      <div
        ref={orb1Ref}
        style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(14, 165, 233, 0.12) 50%, transparent 75%)',
          filter: 'blur(50px)',
          opacity: 0.85,
        }}
      />
      <div
        ref={orb2Ref}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '30%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(16, 185, 129, 0.12) 55%, transparent 75%)',
          filter: 'blur(60px)',
          opacity: 0.8,
        }}
      />
      <div
        ref={orb3Ref}
        style={{
          position: 'absolute',
          top: '35%',
          right: '5%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
          filter: 'blur(45px)',
          opacity: 0.7,
        }}
      />

      {/* Floating Glass Light Rays & Shimmer Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 75% 35%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%)
          `,
          opacity: 0.6,
        }}
      />
    </div>
  );
};
