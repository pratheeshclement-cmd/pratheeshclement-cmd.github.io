import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, DUR, STAGGER } from '../../engine/MotionTokens';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SplitTextProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  /** scroll trigger start position */
  start?: string;
  stagger?: number;
  delay?: number;
}

/**
 * SplitText — splits text into individual <span class="char"> elements
 * and animates each one in on scroll with GSAP.
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text, tag: Tag = 'h2', className = '', style,
  start = 'top 80%', stagger = STAGGER.char, delay = 0,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (reduced) {
      el.style.opacity = '1';
      return;
    }

    const chars = el.querySelectorAll<HTMLSpanElement>('.char');

    const anim = gsap.fromTo(
      chars,
      { y: 60, opacity: 0, rotateX: -90 },
      {
        y: 0, opacity: 1, rotateX: 0,
        stagger,
        delay,
        duration: DUR.slow,
        ease: EASE.out,
        transformOrigin: '50% 100%',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => { anim.kill(); };
  }, [reduced, start, stagger, delay]);

  const chars = text.split('').map((char, i) => (
    <span key={i} className="char" aria-hidden={char === ' '}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ overflow: 'hidden', perspective: 1000, ...style }}
      aria-label={text}
    >
      {chars}
    </Tag>
  );
};
