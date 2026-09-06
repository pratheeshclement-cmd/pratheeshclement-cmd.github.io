import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CameraController
 *
 * Upright & Stable Spatial Camera Controller.
 * Zero rotations or spinning — keeps scrolling completely stable, comfortable,
 * and grounded while providing subtle depth momentum (scale & translateZ).
 */
export class CameraController {
  private worldEl: HTMLElement | null = null;
  private perspectiveEl: HTMLElement | null = null;

  public mount(perspectiveId = 'camera-perspective', worldId = 'main-world') {
    this.perspectiveEl = document.getElementById(perspectiveId);
    this.worldEl = document.getElementById(worldId);

    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (this.perspectiveEl) {
      this.perspectiveEl.style.perspective = isMobile ? 'none' : '1200px';
      this.perspectiveEl.style.perspectiveOrigin = '50% 50%';
    }

    if (this.worldEl) {
      this.worldEl.style.willChange = isMobile ? 'auto' : 'transform';
    }
  }

  /**
   * Smooth depth momentum without camera rotation
   */
  public updateCamera(_progress: number, velocity = 0) {
    if (!this.worldEl) return;

    // Mobile check: skip 3D translateZ on touch / small screens to prevent GPU texture blur
    const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (isMobile) {
      return;
    }

    // Velocity-based depth push (desktop only)
    const velocityPush = Math.min(12, Math.max(-12, velocity * 0.2));

    gsap.to(this.worldEl, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateZ: velocityPush,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  /** Focus lock onto an element (e.g. project card) */
  public focusOn(el: HTMLElement, scale = 1.03) {
    gsap.to(el, { scale, duration: 0.5, ease: 'power3.out' });
  }

  /** Release focus */
  public releaseFocus(el: HTMLElement) {
    gsap.to(el, { scale: 1.0, duration: 0.5, ease: 'back.out(1.4)' });
  }

  public unmount() {
    // Cleanup if needed
  }
}

export const camera = new CameraController();
