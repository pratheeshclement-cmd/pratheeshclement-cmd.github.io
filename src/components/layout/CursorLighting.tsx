import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CursorLighting: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    if (isMobile) return;
    const dot = dotRef.current;
    if (!dot) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.2, ease: 'power2.out' });
    };

    const onEnter = () => dot.classList.add('hovered');
    const onLeave = () => dot.classList.remove('hovered');

    window.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, .glass, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
};
