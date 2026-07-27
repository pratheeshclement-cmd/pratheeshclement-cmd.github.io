import { useEffect } from 'react';
import anime from 'animejs';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';
import { animeEngine } from '../engine/AnimeMasterEngine';

/**
 * useAnimeScene
 * Binds an entire scene to the Anime.js Master Motion Engine.
 * As the user scrolls into the section, Anime.js executes the staggered Assembly System.
 * As the user scrolls past the section, Anime.js executes the Disassembly System.
 */
export function useAnimeScene(
  sectionRef: React.RefObject<HTMLElement | null>,
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
          animeEngine.assembleSection(section);
          options?.onAssemble?.();
          hasAssembled = true;
        }
      },
      onLeave: () => {
        animeEngine.disassembleSection(section);
        options?.onDisassemble?.();
        hasAssembled = false;
      },
      onEnterBack: () => {
        animeEngine.assembleSection(section);
        options?.onAssemble?.();
        hasAssembled = true;
      },
      onLeaveBack: () => {
        animeEngine.disassembleSection(section);
        options?.onDisassemble?.();
        hasAssembled = false;
      },
    });

    return () => {
      st.kill();
    };
  }, [reduced, sectionRef]);
}

/** Legacy alias for backwards compatibility */
export const useCinematicSceneTransition = useAnimeScene;
