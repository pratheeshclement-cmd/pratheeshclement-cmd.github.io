import React, { useEffect, useState } from 'react';

interface CursorLightingProps {
  disabled?: boolean;
}

export const CursorLighting: React.FC<CursorLightingProps> = ({ disabled = false }) => {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disabled) return;

    // Check if coarse pointer (mobile/touch) or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || isReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, visible]);

  if (disabled || !visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, rgba(0, 242, 254, 0.08), transparent 80%)`,
        transition: 'background 0.05s ease-out'
      }}
    />
  );
};
