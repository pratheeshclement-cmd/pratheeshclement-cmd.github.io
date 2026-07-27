import { useEffect } from 'react';

/**
 * Attaches 3D tilt effect on elements matching selector (max 6deg tilt).
 * Uses GPU transform3d only. Respects prefers-reduced-motion.
 */
export const use3DTilt = (selector: string = '.glass-card') => {
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isReduced || isTouch) return;

    const elements = document.querySelectorAll<HTMLElement>(selector);

    const handleMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max 6 degree tilt
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -4px, 0)`;
      card.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.5), ${rotateY * 2}px ${rotateX * 2}px 25px rgba(0, 242, 254, 0.15)`;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
      card.style.boxShadow = 'var(--shadow-glass)';
    };

    elements.forEach(el => {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      elements.forEach(el => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [selector]);
};

/**
 * Attaches magnetic hover attraction to buttons (max 12px radius).
 */
export const useMagneticButtons = (selector: string = '.btn-primary, .btn-secondary') => {
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isReduced || isTouch) return;

    const buttons = document.querySelectorAll<HTMLElement>(selector);

    const handleMouseMove = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Max 12px translation
      const maxDistance = 12;
      const translateX = Math.max(-maxDistance, Math.min(maxDistance, x * 0.25));
      const translateY = Math.max(-maxDistance, Math.min(maxDistance, y * 0.25));

      btn.style.transform = `translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0)`;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement;
      btn.style.transform = 'translate3d(0, 0, 0)';
    };

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      buttons.forEach(btn => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [selector]);
};
