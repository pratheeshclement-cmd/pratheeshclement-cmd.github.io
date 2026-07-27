import React, { useRef, useCallback } from 'react';
import anime from 'animejs';
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

    anime({
      targets: ref.current,
      rotateY: dx * 6,
      rotateX: -dy * 6,
      scale: 1.02,
      duration: 400,
      easing: 'easeOutQuad',
    });
  }, [tilt, reduced]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    anime({
      targets: ref.current,
      rotateY: 0,
      rotateX: 0,
      scale: 1.0,
      duration: 600,
      easing: 'easeOutElastic(1, 0.4)',
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`glass ${float && !reduced ? 'glass-float' : ''} ${className}`}
      style={{ ...style, willChange: tilt ? 'transform' : undefined, transformStyle: 'preserve-3d' }}
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
