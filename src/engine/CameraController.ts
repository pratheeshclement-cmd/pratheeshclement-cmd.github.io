import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CameraController
 *
 * Master Virtual Camera Engine that controls application 3D spatial motion.
 * Simulates a physical cinema camera flying through a continuous 3D world space:
 * - Dolly Zoom (depth flight)
 * - Orbit & Pan (horizontal & vertical rotation)
 * - Tilt & Roll (sinusoidal pitch and roll)
 * - Dynamic Perspective Shift (mouse + scroll vanishing point tracking)
 * - Inertia & Momentum
 */
export class CameraController {
  private worldEl: HTMLElement | null = null;
  private perspectiveEl: HTMLElement | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private targetRotX = 0;
  private targetRotY = 0;

  public mount(perspectiveId = 'camera-perspective', worldId = 'main-world') {
    this.perspectiveEl = document.getElementById(perspectiveId);
    this.worldEl = document.getElementById(worldId);

    if (this.perspectiveEl) {
      this.perspectiveEl.style.perspective = '1200px';
      this.perspectiveEl.style.perspectiveOrigin = '50% 50%';
      this.perspectiveEl.style.transformStyle = 'preserve-3d';
    }

    if (this.worldEl) {
      this.worldEl.style.transformStyle = 'preserve-3d';
      this.worldEl.style.willChange = 'transform';
    }

    // Attach mouse move tracking for dynamic camera orbit & perspective shift
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private onMouseMove = (e: MouseEvent) => {
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;
    this.mouseX = normX;
    this.mouseY = normY;

    if (this.perspectiveEl) {
      // Dynamic vanishing point perspective tracking
      const originX = 50 + normX * 8;
      const originY = 50 + normY * 8;
      this.perspectiveEl.style.perspectiveOrigin = `${originX}% ${originY}%`;
    }
  };

  /**
   * Continuous camera flight update driven by Lenis scroll progress (0.0 to 1.0) and velocity
   */
  public updateCamera(progress: number, velocity = 0) {
    if (!this.worldEl) return;

    // 1. Continuous dolly pitch & roll curves
    const scrollAngle = progress * Math.PI * 4;
    const tiltX = Math.sin(scrollAngle) * 3.5 - this.mouseY * 4;
    const tiltY = Math.cos(scrollAngle) * 4.5 + this.mouseX * 6;
    const rollZ = Math.sin(scrollAngle * 0.5) * 1.5;

    // 2. Velocity-based camera momentum push
    const velocityPush = Math.min(25, Math.max(-25, velocity * 0.4));

    // 3. Smooth spring animation applying virtual camera transformation
    gsap.to(this.worldEl, {
      rotateX: tiltX,
      rotateY: tiltY,
      rotateZ: rollZ,
      translateZ: velocityPush,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  /** Focus lock onto an element (e.g. project card or hero image) */
  public focusOn(el: HTMLElement, scale = 1.05) {
    gsap.to(el, { scale, duration: 0.6, ease: 'power3.out' });
    if (this.worldEl) {
      gsap.to(this.worldEl, { scale: 0.98, duration: 0.6, ease: 'power2.out' });
    }
  }

  /** Release focus */
  public releaseFocus(el: HTMLElement) {
    gsap.to(el, { scale: 1.0, duration: 0.6, ease: 'back.out(1.4)' });
    if (this.worldEl) {
      gsap.to(this.worldEl, { scale: 1.0, duration: 0.6, ease: 'back.out(1.4)' });
    }
  }

  public unmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
  }
}

export const camera = new CameraController();
