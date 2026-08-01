import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * CinematicParticleCanvas
 * Ambient luminous floating particles with real-time mouse parallax deflection
 * and scroll velocity dynamics.
 */
export const CinematicParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced   = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isMobile = width <= 768;
    const isTablet = width > 480 && width <= 768;
    const isMobilePhone = width <= 480;
    const PARTICLE_COUNT = isMobilePhone ? 20 : isTablet ? 50 : 100;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      baseX: number;
      baseY: number;
    }

    const colors = [
      'rgba(59, 130, 246, ',  // Sky Blue
      'rgba(139, 92, 246, ',  // Soft Lavender
      'rgba(16, 185, 129, ',  // Soft Mint
      'rgba(14, 165, 233, ',  // Ice Blue
    ];

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      return {
        x: rx,
        y: ry,
        baseX: rx,
        baseY: ry,
        size: Math.random() * (isMobile ? 2.0 : 2.5) + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    let animId: number;
    let isTabActive = !document.hidden;
    let isMenuOpen = false;
    let isFastScrolling = false;
    let lastScrollY = window.scrollY;

    const onMenuToggle = (e: Event) => {
      const customEv = e as CustomEvent<{ open: boolean }>;
      isMenuOpen = customEv.detail?.open ?? false;
    };
    const onScrollState = (e: Event) => {
      const customEv = e as CustomEvent<{ scrolling: boolean }>;
      isFastScrolling = customEv.detail?.scrolling ?? false;
    };
    window.addEventListener('mobile-menu-state-changed', onMenuToggle);
    window.addEventListener('mobile-scroll-state', onScrollState);

    const onMouseMove = !isMobile ? (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    } : null;
    if (onMouseMove) window.addEventListener('mousemove', onMouseMove);

    const onVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive && !isMenuOpen && !isFastScrolling && !animId) {
        render();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const render = () => {
      if (!isTabActive || isMenuOpen || isFastScrolling) return;

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const normMouseX = (mouseX / width - 0.5) * 40;
      const normMouseY = (mouseY / height - 0.5) * 40;

      // Scroll velocity influence
      const currentScrollY = window.scrollY;
      const scrollVelocity = (currentScrollY - lastScrollY) * 0.15;
      lastScrollY = currentScrollY;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY - scrollVelocity;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse Parallax deflection offset
        const drawX = p.x + normMouseX * (p.size / 3);
        const drawY = p.y + normMouseY * (p.size / 3);

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;

        // Omit expensive shadowBlur on mobile
        if (!isMobile) {
          ctx.shadowBlur = p.size * 4;
          ctx.shadowColor = `${p.color}0.8)`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const onResize = () => {
      if (!canvas) return;
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('mobile-menu-state-changed', onMenuToggle);
      window.removeEventListener('mobile-scroll-state', onScrollState);
      window.removeEventListener('resize', onResize);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};
