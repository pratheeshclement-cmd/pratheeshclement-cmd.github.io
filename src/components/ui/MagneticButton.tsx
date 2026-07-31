import React from 'react';
import { useMagneticHover } from '../../hooks/useMagneticHover';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
  download?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  variant = 'primary', children, className = '', as: Tag = 'button', href, download, ...props
}) => {
  const reduced = useReducedMotion();
  const { ref, onMouseMove, onMouseLeave } = useMagneticHover<HTMLButtonElement>();

  const cls = variant === 'primary'   ? 'btn-primary'
             : variant === 'secondary' ? 'btn-secondary'
             : 'btn-secondary';

  if (Tag === 'a') {
    return (
      <a
        href={href}
        download={download}
        className={`${cls} ${className}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        onMouseMove={!reduced ? (onMouseMove as unknown as React.MouseEventHandler<HTMLAnchorElement>) : undefined}
        onMouseLeave={!reduced ? (onMouseLeave as unknown as React.MouseEventHandler<HTMLAnchorElement>) : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={`${cls} ${className}`}
      onMouseMove={!reduced ? onMouseMove : undefined}
      onMouseLeave={!reduced ? onMouseLeave : undefined}
      {...props}
    >
      {children}
    </button>
  );
};
