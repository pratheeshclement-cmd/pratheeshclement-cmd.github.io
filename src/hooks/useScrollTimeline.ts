import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';
import { animeEngine, TransitionStyle } from '../engine/AnimeMasterEngine';

/**
 * useAnimeScene
 * Binds an entire scene section to the Anime.js Motion Engine with a distinct transition style.
 */
export function useAnimeScene(
  sectionRef: React.RefObject<HTMLElement | null>,
  style: TransitionStyle = 'blur-clear',
  options?: {
    onAssemble?: () => void;
    onDisassemble?: () => void;
  }
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    let hasAssembled = false;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        if (!hasAssembled) {
          animeEngine.assembleSection(section, style);
          options?.onAssemble?.();
          hasAssembled = true;
        }
      },
      onLeave: () => {
        animeEngine.disassembleSection(section, style);
        options?.onDisassemble?.();
        hasAssembled = false;
      },
      onEnterBack: () => {
        animeEngine.assembleSection(section, style);
        options?.onAssemble?.();
        hasAssembled = true;
      },
      onLeaveBack: () => {
        animeEngine.disassembleSection(section, style);
        options?.onDisassemble?.();
        hasAssembled = false;
      },
    });

    return () => {
      st.kill();
    };
  }, [reduced, sectionRef, style]);
}

/** Backwards compatibility alias */
export function useCinematicSceneTransition(
  sectionRef: React.RefObject<HTMLElement | null>,
  style: TransitionStyle = 'blur-clear'
) {
  return useAnimeScene(sectionRef, style);
}
