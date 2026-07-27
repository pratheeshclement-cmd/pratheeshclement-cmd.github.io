import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CameraFrame {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  blur: number;
  opacity: number;
}

export class CinematicCameraEngine {
  private static instance: CinematicCameraEngine;
  
  public currentFrame: CameraFrame = {
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    blur: 0,
    opacity: 1
  };

  private constructor() {}

  public static getInstance(): CinematicCameraEngine {
    if (!CinematicCameraEngine.instance) {
      CinematicCameraEngine.instance = new CinematicCameraEngine();
    }
    return CinematicCameraEngine.instance;
  }

  /**
   * Calculates interpolated camera position for scene index (0 to 8) based on scroll progress (0 to 1)
   */
  public getCameraForProgress(progress: number): CameraFrame {
    // 9 Keyframe Camera States across scroll range 0.0 -> 1.0
    if (progress < 0.10) {
      // Scene 01: Intro Particle Logo Formation
      const p = progress / 0.10;
      return {
        x: 0,
        y: 0,
        z: gsap.utils.interpolate(-300, 0, p),
        rotateX: gsap.utils.interpolate(15, 0, p),
        rotateY: gsap.utils.interpolate(-20, 0, p),
        rotateZ: 0,
        scale: gsap.utils.interpolate(0.7, 1.0, p),
        blur: gsap.utils.interpolate(10, 0, p),
        opacity: gsap.utils.interpolate(0, 1, p)
      };
    } else if (progress < 0.22) {
      // Scene 02: Cinematic Hero & Portrait Reveal
      const p = (progress - 0.10) / 0.12;
      return {
        x: gsap.utils.interpolate(0, 20, p),
        y: gsap.utils.interpolate(0, -10, p),
        z: gsap.utils.interpolate(0, 40, p),
        rotateX: gsap.utils.interpolate(0, 2, p),
        rotateY: gsap.utils.interpolate(0, -4, p),
        rotateZ: 0,
        scale: 1.0,
        blur: 0,
        opacity: 1
      };
    } else if (progress < 0.35) {
      // Scene 03: About & Qualifications Matrix
      const p = (progress - 0.22) / 0.13;
      return {
        x: gsap.utils.interpolate(20, -30, p),
        y: gsap.utils.interpolate(-10, 0, p),
        z: gsap.utils.interpolate(40, -20, p),
        rotateX: gsap.utils.interpolate(2, -4, p),
        rotateY: gsap.utils.interpolate(-4, 6, p),
        rotateZ: 0,
        scale: gsap.utils.interpolate(1.0, 0.98, p),
        blur: 0,
        opacity: 1
      };
    } else if (progress < 0.48) {
      // Scene 04: Technical Skills 3D Orbit
      const p = (progress - 0.35) / 0.13;
      return {
        x: gsap.utils.interpolate(-30, 0, p),
        y: gsap.utils.interpolate(0, -20, p),
        z: gsap.utils.interpolate(-20, 60, p),
        rotateX: gsap.utils.interpolate(-4, 6, p),
        rotateY: gsap.utils.interpolate(6, -8, p),
        rotateZ: 0,
        scale: 1.05,
        blur: 0,
        opacity: 1
      };
    } else if (progress < 0.62) {
      // Scene 05: Project Vault Deep Dive
      const p = (progress - 0.48) / 0.14;
      return {
        x: gsap.utils.interpolate(0, 0, p),
        y: gsap.utils.interpolate(-20, 0, p),
        z: gsap.utils.interpolate(60, 80, p),
        rotateX: gsap.utils.interpolate(6, 0, p),
        rotateY: gsap.utils.interpolate(-8, 0, p),
        rotateZ: 0,
        scale: 1.08,
        blur: 0,
        opacity: 1
      };
    } else if (progress < 0.75) {
      // Scene 06: Career Timeline Sideways Perspective
      const p = (progress - 0.62) / 0.13;
      return {
        x: gsap.utils.interpolate(0, 40, p),
        y: gsap.utils.interpolate(0, -10, p),
        z: gsap.utils.interpolate(80, 20, p),
        rotateX: gsap.utils.interpolate(0, -3, p),
        rotateY: gsap.utils.interpolate(0, -12, p),
        rotateZ: 0,
        scale: 1.0,
        blur: 0,
        opacity: 1
      };
    } else if (progress < 0.85) {
      // Scene 07: Services & Capability Layers
      const p = (progress - 0.75) / 0.10;
      return {
        x: gsap.utils.interpolate(40, -20, p),
        y: gsap.utils.interpolate(-10, 0, p),
        z: gsap.utils.interpolate(20, 40, p),
        rotateX: gsap.utils.interpolate(-3, 4, p),
        rotateY: gsap.utils.interpolate(-12, 5, p),
        rotateZ: 0,
        scale: 1.02,
        blur: 0,
        opacity: 1
      };
    } else if (progress < 0.93) {
      // Scene 08: Google Skillshop & Certifications Floating Space
      const p = (progress - 0.85) / 0.08;
      return {
        x: gsap.utils.interpolate(-20, 0, p),
        y: gsap.utils.interpolate(0, -15, p),
        z: gsap.utils.interpolate(40, 50, p),
        rotateX: gsap.utils.interpolate(4, -2, p),
        rotateY: gsap.utils.interpolate(5, -3, p),
        rotateZ: 0,
        scale: 1.04,
        blur: 0,
        opacity: 1
      };
    } else {
      // Scene 09: Contact & AI Concierge Final Transmission
      const p = (progress - 0.93) / 0.07;
      return {
        x: 0,
        y: 0,
        z: gsap.utils.interpolate(50, 0, p),
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1.0,
        blur: 0,
        opacity: 1
      };
    }
  }
}

export const cameraEngine = CinematicCameraEngine.getInstance();
