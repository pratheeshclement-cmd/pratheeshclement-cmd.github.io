import React, { useRef, useCallback } from 'react';
import gsap from 'gsap';
import { TILT } from '../../engine/MotionTokens';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tilt?: boolean;
  float?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children, className = '', style, tilt = false, float = false, onClick, 'aria-label': ariaLabel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const dy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    gsap.to(ref.current, {
      rotateY:  dx * TILT.maxDeg,
      rotateX: -dy * TILT.maxDeg,
      scale: TILT.scale,
      duration: 0.3, ease: 'power2.out', overwrite: 'auto',
      transformPerspective: TILT.perspective,
    });
  }, [tilt, reduced]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateY: 0, rotateX: 0, scale: 1,
      duration: 0.6, ease: TILT.resetEase, overwrite: 'auto',
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`glass ${float && !reduced ? 'glass-float' : ''} ${className}`}
      style={{ ...style, willChange: tilt ? 'transform' : undefined }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? e => e.key === 'Enter' && onClick() : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};
