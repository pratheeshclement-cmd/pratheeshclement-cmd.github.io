import React, { useRef, useEffect } from 'react';
import anime from 'animejs';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SplitTextProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  start?: string;
  stagger?: number;
  delay?: number;
}

/**
 * SplitText — splits text into individual <span class="char"> elements
 * and animates each character with Anime.js staggered assembly.
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text, tag: Tag = 'h2', className = '', style,
  start = 'top 80%', stagger = 30, delay = 0,
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

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => {
        anime({
          targets: chars,
          translateY: [50, 0],
          rotateX: [-90, 0],
          opacity: [0, 1],
          delay: anime.stagger(stagger, { start: delay * 1000 }),
          duration: 800,
          easing: 'easeOutBack',
        });
      },
      onLeaveBack: () => {
        anime({
          targets: chars,
          translateY: [0, 50],
          rotateX: [0, -90],
          opacity: [1, 0],
          duration: 400,
          easing: 'easeInCubic',
        });
      },
    });

    return () => { st.kill(); };
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
