import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * useCinematicSceneTransition
 *
 * Implements a full scrub-driven Assembly & Disassembly timeline for a scene section.
 * As the user scrolls into the scene, elements assemble with 3D transform, glass opacity,
 * and text character reveals.
 * As the user scrolls past the scene, elements disassemble seamlessly into the background.
 */
export function useCinematicSceneTransition(
  sectionRef: React.RefObject<HTMLElement | null>,
  options?: {
    containerSelector?: string;
    onProgress?: (progress: number) => void;
  }
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const cards = section.querySelectorAll<HTMLElement>('.glass, .pill, .section-label, img, h2, h3, p');

    // Create a master scrubbed timeline for section entry (Assembly) and exit (Disassembly)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: 1.2, // Smooth spring scrub
        onUpdate: self => {
          options?.onProgress?.(self.progress);
        },
      },
    });

    // 1. Assembly Phase (0.0 -> 0.45 progress)
    tl.fromTo(cards,
      {
        opacity: 0,
        y: (i) => 40 + (i % 3) * 15,
        scale: 0.92,
        rotateX: -12,
        transformPerspective: 1000,
        filter: 'blur(8px)',
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        stagger: 0.05,
        duration: 0.45,
        ease: 'power3.out',
      }
    );

    // 2. Active Phase (0.45 -> 0.70 progress) - holds steady
    tl.to(cards, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.25,
    });

    // 3. Disassembly Phase (0.70 -> 1.0 progress)
    tl.to(cards, {
      opacity: 0,
      y: -40,
      scale: 1.05,
      rotateX: 10,
      filter: 'blur(10px)',
      stagger: 0.03,
      duration: 0.3,
      ease: 'power2.in',
    });

    return () => {
      tl.kill();
    };
  }, [reduced, sectionRef]);
}
