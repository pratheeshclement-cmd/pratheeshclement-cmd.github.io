import { useEffect } from 'react';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, DUR } from '../engine/MotionTokens';

/**
 * useScrollTimeline
 *
 * Attaches a GSAP ScrollTrigger enter animation to a section ref.
 * Each scene calls this hook once in its mount effect.
 */
export function useScrollTimeline(
  ref: React.RefObject<HTMLElement | null>,
  options?: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    onEnter?: () => void;
    onLeave?: () => void;
  }
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = options?.from ?? { opacity: 0, y: 40 };
    const to   = options?.to   ?? { opacity: 1, y: 0, duration: DUR.normal, ease: EASE.out };

    const st = ScrollTrigger.create({
      trigger: el,
      start:   options?.start ?? 'top 80%',
      end:     options?.end   ?? 'top 20%',
      scrub:   options?.scrub ?? false,
      toggleActions: 'play none none reverse',
      onEnter:  options?.onEnter,
      onLeave:  options?.onLeave,
      animation: gsap.fromTo(el, from, to),
    });

    return () => st.kill();
  }, []);
}
