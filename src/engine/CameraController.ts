import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CameraController
 *
 * Simulates a virtual camera using CSS perspective illusion.
 * The camera wrapper has a CSS perspective applied; transforms on
 * child elements create depth without real 3D geometry.
 *
 * All movement is GSAP-driven for spring-based inertia.
 */
export class CameraController {
  private worldEl: HTMLElement | null = null;
  private perspectiveEl: HTMLElement | null = null;

  /** Attach to the main world container */
  mount(worldId = 'main-world', perspectiveId = 'camera-perspective') {
    this.worldEl = document.getElementById(worldId);
    this.perspectiveEl = document.getElementById(perspectiveId);
    if (this.perspectiveEl) {
      this.perspectiveEl.style.perspective = '1200px';
      this.perspectiveEl.style.perspectiveOrigin = '50% 50%';
    }
  }

  /** Subtle dolly forward — used during scroll */
  dollyForward(progress: number) {
    if (!this.worldEl) return;
    const scale = 1 + progress * 0.03; // 1.0 → 1.03 max
    gsap.to(this.worldEl, { scale, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  }

  /** Subtle pan left/right — used for section transitions */
  pan(x: number) {
    if (!this.worldEl) return;
    gsap.to(this.worldEl, { x: x * 8, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
  }

  /** Subtle tilt — used for section-based mood shifts */
  tilt(deg: number) {
    if (!this.perspectiveEl) return;
    gsap.to(this.perspectiveEl, { rotateX: deg, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
  }

  /** Focus lock — camera zooms to an element (used for project cards) */
  focusOn(el: HTMLElement, strength = 1.05) {
    gsap.to(el, { scale: strength, duration: 0.5, ease: 'power3.out' });
    if (this.worldEl) {
      gsap.to(this.worldEl, { scale: 0.98, duration: 0.5, ease: 'power2.out' });
    }
  }

  /** Reset focus */
  releaseFocus(el: HTMLElement) {
    gsap.to(el, { scale: 1, duration: 0.5, ease: 'elastic.out(0.8, 0.3)' });
    if (this.worldEl) {
      gsap.to(this.worldEl, { scale: 1, duration: 0.5, ease: 'elastic.out(0.8, 0.3)' });
    }
  }

  /** Wire up scroll → camera dolly */
  bindScrollTrigger() {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => this.dollyForward(self.progress),
    });
  }

  /** Reset all transforms */
  reset() {
    if (!this.worldEl) return;
    gsap.to(this.worldEl, { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
  }
}

// Singleton export
export const camera = new CameraController();
