import anime from 'animejs';

/**
 * AnimeMasterEngine
 *
 * Primary Anime.js Master Motion Engine for Portfolio X.
 * Manages synchronized assembly, disassembly, camera, lighting,
 * and text/card animations across the continuous scroll timeline.
 */

export class AnimeMasterEngine {
  private masterTimeline: anime.AnimeTimelineInstance | null = null;
  private isInitialized = false;

  constructor() {
    this.createMasterTimeline();
  }

  private createMasterTimeline() {
    this.masterTimeline = anime.timeline({
      autoplay: false,
      easing: 'easeOutExpo',
      duration: 10000, // Normalized master timeline duration
    });
  }

  /**
   * Seeks the master timeline based on scroll progress (0.0 to 1.0)
   */
  public scrubScroll(progress: number) {
    if (!this.masterTimeline) return;
    const targetTime = Math.max(0, Math.min(10000, progress * 10000));
    this.masterTimeline.seek(targetTime);
  }

  /**
   * Anime.js Staggered Assembly System for any scene section:
   * Particles -> Background -> Glass -> Lighting -> Cards -> Images -> Typography -> Buttons
   */
  public assembleSection(sectionEl: HTMLElement, duration = 1200) {
    const particles = sectionEl.querySelectorAll('.ambient-orb, canvas');
    const background = sectionEl.querySelectorAll('.parallax-bg');
    const glassCards = sectionEl.querySelectorAll('.glass');
    const images     = sectionEl.querySelectorAll('img');
    const typography = sectionEl.querySelectorAll('h1, h2, h3, .char, p');
    const buttons    = sectionEl.querySelectorAll('.btn-primary, .btn-secondary, button');

    const tl = anime.timeline({
      easing: 'easeOutQuart',
      duration,
    });

    if (particles.length > 0) {
      tl.add({
        targets: particles,
        scale: [0.7, 1],
        opacity: [0, 1],
        duration: duration * 0.4,
      }, 0);
    }

    if (background.length > 0) {
      tl.add({
        targets: background,
        translateY: [60, 0],
        opacity: [0, 1],
        duration: duration * 0.5,
      }, 100);
    }

    if (glassCards.length > 0) {
      tl.add({
        targets: glassCards,
        translateY: [50, 0],
        rotateX: [-15, 0],
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: anime.stagger(80),
        duration: duration * 0.6,
      }, 200);
    }

    if (images.length > 0) {
      tl.add({
        targets: images,
        scale: [1.1, 1],
        rotate: [-3, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: duration * 0.6,
      }, 300);
    }

    if (typography.length > 0) {
      tl.add({
        targets: typography,
        translateY: [35, 0],
        rotateX: [-90, 0],
        opacity: [0, 1],
        delay: anime.stagger(25),
        duration: duration * 0.5,
      }, 350);
    }

    if (buttons.length > 0) {
      tl.add({
        targets: buttons,
        scale: [0.85, 1],
        opacity: [0, 1],
        delay: anime.stagger(60),
        duration: duration * 0.4,
      }, 500);
    }

    return tl;
  }

  /**
   * Anime.js Staggered Disassembly System:
   * Typography -> Cards -> Glass -> Particles
   */
  public disassembleSection(sectionEl: HTMLElement, duration = 800) {
    const typography = sectionEl.querySelectorAll('h1, h2, h3, .char, p');
    const glassCards = sectionEl.querySelectorAll('.glass');

    const tl = anime.timeline({
      easing: 'easeInCubic',
      duration,
    });

    if (typography.length > 0) {
      tl.add({
        targets: typography,
        translateY: [0, -30],
        opacity: [1, 0],
        delay: anime.stagger(15),
        duration: duration * 0.4,
      }, 0);
    }

    if (glassCards.length > 0) {
      tl.add({
        targets: glassCards,
        translateY: [0, -40],
        scale: [1, 1.05],
        opacity: [1, 0],
        delay: anime.stagger(40),
        duration: duration * 0.5,
      }, 100);
    }

    return tl;
  }

  /**
   * Anime.js Text Letter Split & Assembly
   */
  public animateTextChars(chars: NodeListOf<Element> | Element[], delay = 0) {
    return anime({
      targets: chars,
      translateY: [45, 0],
      rotateX: [-90, 0],
      opacity: [0, 1],
      easing: 'easeOutBack',
      duration: 800,
      delay: anime.stagger(30, { start: delay }),
    });
  }

  /**
   * Anime.js Button Spring Press & Magnetic Feedback
   */
  public animateButtonHover(btnEl: HTMLElement, isHover: boolean) {
    anime({
      targets: btnEl,
      scale: isHover ? 1.05 : 1.0,
      translateY: isHover ? -2 : 0,
      duration: 400,
      easing: 'easeOutElastic(1, 0.4)',
    });
  }

  /**
   * Anime.js Card Depth Float Loop
   */
  public animateFloatingCard(cardEl: HTMLElement) {
    return anime({
      targets: cardEl,
      translateY: ['-6px', '6px'],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 4000 + Math.random() * 2000,
    });
  }
}

// Global Singleton Export
export const animeEngine = new AnimeMasterEngine();
