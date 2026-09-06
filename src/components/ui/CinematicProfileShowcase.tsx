import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface CinematicProfileShowcaseProps {
  imageSrc?: string;
  altText?: string;
}

export const CinematicProfileShowcase: React.FC<CinematicProfileShowcaseProps> = ({
  imageSrc = '/assets/new4k3.jpeg',
  altText = 'Pratheesh Clement — Digital Marketing Specialist & Architect of Digital Ecosystems',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const ambientLightRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Entrance & Exit GSAP ScrollTrigger Timeline
  useEffect(() => {
    const container = containerRef.current;
    const frame = frameRef.current;
    const img = imgRef.current;
    const ambientLight = ambientLightRef.current;

    if (!container || !frame || !img || reducedMotion) return;

    const isMobile = window.innerWidth <= 768;

    // Set initial entrance state
    gsap.set(container, { opacity: 1 });
    gsap.set(frame, {
      opacity: 0,
      scale: isMobile ? 0.96 : 0.9,
      filter: isMobile ? 'none' : 'blur(14px)',
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    });
    gsap.set(ambientLight, { opacity: 0, scale: 0.7 });

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // 1. Ambient Light Expansion
    scrollTimeline.to(
      ambientLight,
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      },
      0
    );

    // 2. Glass Frame Clip-Path Assembly
    scrollTimeline.to(
      frame,
      {
        opacity: 1,
        scale: 1,
        filter: 'none',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.1,
        ease: 'power4.out',
      },
      0.15
    );

    // 3. Image Focus Reveal (Sharp on mobile, no filter blur rasterization)
    if (isMobile) {
      scrollTimeline.fromTo(
        img,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.25
      );
    } else {
      scrollTimeline.fromTo(
        img,
        { scale: 1.12, filter: 'blur(8px)' },
        { scale: 1.0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' },
        0.25
      );
    }

    // 4. Idle Floating Loop (Desktop only)
    const idleTween = !isMobile ? gsap.to(frame, {
      y: -8,
      rotation: 0.8,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.easeInOut',
      delay: 1.2,
    }) : null;

    return () => {
      scrollTimeline.kill();
      idleTween?.kill();
    };
  }, [reducedMotion]);

  // Interactive 3D Mouse Tilt & Dynamic Spotlight Tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Normalize to -0.5 to 0.5
    const normX = x - 0.5;
    const normY = y - 0.5;

    // Calculate tilt angles (max 16 deg)
    const tiltX = -normY * 16;
    const tiltY = normX * 16;

    // Set CSS custom variables for dynamic spotlight
    containerRef.current.style.setProperty('--mouse-x', `${(x * 100).toFixed(1)}%`);
    containerRef.current.style.setProperty('--mouse-y', `${(y * 100).toFixed(1)}%`);

    if (frameRef.current) {
      gsap.to(frameRef.current, {
        rotateX: tiltX,
        rotateY: tiltY,
        scale: 1.03,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!frameRef.current || reducedMotion) return;

    // Smooth elastic spring return to origin
    gsap.to(frameRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1.0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1.0,
        duration: 0.7,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  // Generate ambient floating particles
  const particles = [
    { top: '10%', left: '-8%', size: 8, color: 'var(--accent-primary)', delay: '0s', duration: '5.5s' },
    { top: '25%', right: '-10%', size: 6, color: 'var(--accent-tertiary)', delay: '1s', duration: '6.2s' },
    { top: '65%', left: '-12%', size: 10, color: 'var(--accent-mint)', delay: '2s', duration: '7s' },
    { top: '80%', right: '-6%', size: 7, color: 'var(--accent-secondary)', delay: '0.5s', duration: '5.8s' },
    { top: '-5%', left: '40%', size: 5, color: 'var(--accent-primary)', delay: '1.8s', duration: '6.5s' },
    { bottom: '-8%', right: '30%', size: 9, color: 'var(--accent-tertiary)', delay: '2.5s', duration: '7.2s' },
  ];

  return (
    <div
      ref={containerRef}
      className={`cinematic-showcase-container showcase-container ${isHovered ? 'hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Interactive Profile Showcase"
    >
      {/* 1. Ambient Gradient Glow Backlight */}
      <div ref={ambientLightRef} className="showcase-ambient-light" />

      {/* 2. Animated Concentric Glow Ring */}
      <div className="showcase-glow-ring" />

      {/* 3. Ambient Floating Particle Elements */}
      <div ref={particleContainerRef}>
        {particles.map((p, idx) => (
          <div
            key={idx}
            className="showcase-particle"
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animationDelay: p.delay,
              animationDuration: p.duration,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* 4. Glassmorphic Frame with 3D Tilt */}
      <div ref={frameRef} className="showcase-frame">
        {/* Cursor Spotlight Overlay */}
        <div className="showcase-spotlight" />

        {/* Animated Light Shimmer Beam */}
        <div className="showcase-shimmer" />

        {/* Tech Corner Tag Badge */}
        <div className="showcase-corner-tag">
          <Sparkles size={11} style={{ display: 'inline', marginRight: 4, color: 'var(--accent-primary)' }} />
          ECOSYSTEM
        </div>

        {/* Image Display Box */}
        <div className="showcase-img-box">
          <picture style={{ display: 'block', width: '100%', height: '100%' }}>
            <source media="(max-width: 480px)" srcSet="/assets/new4k3-mobile.jpg 640w, /assets/new4k3.jpeg 1103w" sizes="100vw" />
            <source media="(max-width: 800px)" srcSet="/assets/new4k3-tablet.jpg 900w, /assets/new4k3.jpeg 1103w" sizes="(max-width: 800px) 100vw, 800px" />
            <source srcSet="/assets/new4k3.jpeg 1103w" sizes="400px" />
            <img
              ref={imgRef}
              src={imageSrc}
              alt={altText}
              title="Pratheesh Clement — Architect of Digital Ecosystems"
              width={380}
              height={437}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>

        {/* Live Status Overlay Badge */}
        <div className="showcase-status-badge">
          <span className="status-dot-pulse" />
          <span>AVAILABLE FOR PROJECTS</span>
          <ShieldCheck size={13} style={{ color: 'var(--accent-mint)', marginLeft: 2 }} />
        </div>
      </div>
    </div>
  );
};
