import anime from 'animejs';

/**
 * AnimeMasterEngine
 *
 * Master Motion Engine supporting distinct section entrance & exit transition styles:
 * - Slide Up / Slide Down / Slide Left / Slide Right
 * - Scale Up / Scale Down
 * - Blur-to-Clear / Glass Morph / Clip Mask / Split Reveal
 *
 * Sequence: Background -> Profile Image -> Heading -> Subheading -> Cards -> Buttons -> Icons -> Particles
 */

export type TransitionStyle =
  | 'hero'
  | 'slide-left'
  | 'slide-right'
  | 'scale-up'
  | 'scale-down'
  | 'blur-clear'
  | 'timeline-reveal'
  | 'glass-morph'
  | 'split-reveal';

export class AnimeMasterEngine {
  /**
   * Scrub master timeline on scroll update
   */
  public scrubScroll(_progress: number) {
    // Scrub scroll progress hook for Master Anime.js engine
  }
  public assembleSection(sectionEl: HTMLElement, style: TransitionStyle = 'blur-clear', duration = 1000) {
    const isMobile    = typeof window !== 'undefined' && window.innerWidth <= 768;
    const background  = sectionEl.querySelectorAll('.parallax-bg, .scene-inner');
    const profileImg  = sectionEl.querySelectorAll('img');
    const headings    = sectionEl.querySelectorAll('h1, h2');
    const subheadings = sectionEl.querySelectorAll('.section-label, .pill, p');
    const cards       = sectionEl.querySelectorAll('.glass, .timeline-item, .service-row');
    const buttons     = sectionEl.querySelectorAll('.btn-primary, .btn-secondary, button');
    const icons       = sectionEl.querySelectorAll('svg');
    const particles   = sectionEl.querySelectorAll('.ambient-orb, canvas');

    const tl = anime.timeline({
      easing: 'easeOutQuart',
      duration: isMobile ? duration * 0.7 : duration,
    });

    // 1. Background Entrance
    if (background.length > 0) {
      const bgProps = style === 'slide-left' ? { translateX: [isMobile ? 30 : 80, 0] }
        : style === 'slide-right' ? { translateX: [isMobile ? -30 : -80, 0] }
        : style === 'scale-up' ? { scale: [0.95, 1] }
        : { translateY: [isMobile ? 20 : 40, 0] };

      tl.add({
        targets: background,
        ...bgProps,
        opacity: [0, 1],
        duration: duration * 0.4,
      }, 0);
    }

    // 2. Profile Image Assembly (scale pop-in, no filter blur)
    if (profileImg.length > 0) {
      const imgProps = isMobile ? { opacity: [0, 1] } : {
        scale: [0.88, 1],
        opacity: [0, 1],
        // ✅ filter:blur removed from image assembly — scale provides same cinematic effect
      };

      tl.add({
        targets: profileImg,
        ...imgProps,
        duration: duration * 0.5,
      }, 100);
    }

    // 3. Headings Reveal
    if (headings.length > 0) {
      tl.add({
        targets: headings,
        translateY: [isMobile ? 15 : 35, 0],
        opacity: [0, 1],
        delay: anime.stagger(isMobile ? 15 : 30),
        duration: duration * 0.45,
      }, 200);
    }

    // 4. Subheadings Appear
    if (subheadings.length > 0) {
      tl.add({
        targets: subheadings,
        translateY: [isMobile ? 10 : 25, 0],
        opacity: [0, 1],
        delay: anime.stagger(isMobile ? 10 : 20),
        duration: duration * 0.4,
      }, 280);
    }

    // 5. Cards Slide In / Scale Reveal based on section style (No filter blurs on mobile)
    if (cards.length > 0) {
      const cardTranslateX = style === 'slide-left' ? [isMobile ? 25 : 60, 0] : style === 'slide-right' ? [isMobile ? -25 : -60, 0] : 0;
      const cardTranslateY = style === 'slide-left' || style === 'slide-right' ? 0 : [isMobile ? 20 : 45, 0];

      const cardProps = isMobile ? {
        translateX: cardTranslateX,
        translateY: cardTranslateY,
        opacity: [0, 1],
      } : {
        translateX: cardTranslateX,
        translateY: cardTranslateY,
        scale: style === 'scale-up' ? [0.92, 1] : [0.96, 1],
        opacity: [0, 1],
        // ✅ filter:blur removed — triggers full GPU repaint every frame
      };

      tl.add({
        targets: cards,
        ...cardProps,
        delay: anime.stagger(isMobile ? 30 : 70),
        duration: duration * 0.55,
      }, 350);
    }

    // 6. Buttons Animate
    if (buttons.length > 0) {
      tl.add({
        targets: buttons,
        scale: [0.85, 1],
        opacity: [0, 1],
        delay: anime.stagger(50),
        duration: duration * 0.4,
      }, 450);
    }

    // 7. Icons Animate
    if (icons.length > 0) {
      tl.add({
        targets: icons,
        scale: [0.7, 1],
        opacity: [0, 1],
        delay: anime.stagger(25),
        duration: duration * 0.35,
      }, 500);
    }

    // 8. Particles Activate
    if (particles.length > 0) {
      tl.add({
        targets: particles,
        opacity: [0, 1],
        duration: duration * 0.4,
      }, 550);
    }

    return tl;
  }

  /**
   * Anime.js Staggered Disassembly System for graceful section exit
   */
  public disassembleSection(sectionEl: HTMLElement, style: TransitionStyle = 'blur-clear', duration = 700) {
    const typography = sectionEl.querySelectorAll('h1, h2, h3, p');
    const cards      = sectionEl.querySelectorAll('.glass, .timeline-item, .service-row');
    const images     = sectionEl.querySelectorAll('img');

    const tl = anime.timeline({
      easing: 'easeInCubic',
      duration,
    });

    const exitX = style === 'slide-left' ? -50 : style === 'slide-right' ? 50 : 0;
    const exitY = style === 'slide-left' || style === 'slide-right' ? 0 : -35;

    if (typography.length > 0) {
      tl.add({
        targets: typography,
        translateY: exitY,
        translateX: exitX,
        opacity: [1, 0],
        delay: anime.stagger(15),
        duration: duration * 0.4,
      }, 0);
    }

    if (cards.length > 0) {
      tl.add({
        targets: cards,
        translateY: exitY,
        scale: [1, 0.96],
        // ✅ filter:blur removed — triggers full GPU repaint every animation frame
        opacity: [1, 0],
        delay: anime.stagger(30),
        duration: duration * 0.5,
      }, 80);
    }

    if (images.length > 0) {
      tl.add({
        targets: images,
        scale: [1, 1.03],
        // ✅ filter:blur removed from image exit
        opacity: [1, 0],
        duration: duration * 0.4,
      }, 120);
    }

    return tl;
  }
}

// Global Singleton Export
export const animeEngine = new AnimeMasterEngine();
