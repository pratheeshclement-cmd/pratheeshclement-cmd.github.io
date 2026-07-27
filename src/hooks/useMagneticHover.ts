import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import { MAGNETIC, EASE } from '../engine/MotionTokens';

/**
 * useMagneticHover
 *
 * Returns { ref, handlers } to attach to any magnetic button or card.
 * On mousemove, the element shifts slightly toward the cursor.
 * On mouseleave, it springs back using elastic easing.
 */
export function useMagneticHover<T extends HTMLElement>(
  pull: number = MAGNETIC.pull
) {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    gsap.to(el, { x: dx * pull, y: dy * pull, duration: 0.3, ease: EASE.out, overwrite: 'auto' });
  }, [pull]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      x: 0, y: 0,
      duration: MAGNETIC.resetDur,
      ease: MAGNETIC.resetEase,
      overwrite: 'auto',
    });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
