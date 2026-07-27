import { useRef, useCallback } from 'react';
import anime from 'animejs';

/**
 * useMagneticHover
 *
 * Uses Anime.js spring mechanics to pull magnetic buttons towards the cursor
 * and release them with an elastic spring snap.
 */
export function useMagneticHover<T extends HTMLElement>(
  pull: number = 0.35
) {
  const ref = useRef<T>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);

    anime({
      targets: el,
      translateX: dx * pull,
      translateY: dy * pull,
      duration: 350,
      easing: 'easeOutQuad',
    });
  }, [pull]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    anime({
      targets: el,
      translateX: 0,
      translateY: 0,
      duration: 800,
      easing: 'easeOutElastic(1, 0.4)',
    });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
