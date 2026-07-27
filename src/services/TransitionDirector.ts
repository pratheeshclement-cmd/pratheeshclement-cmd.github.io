import anime from 'animejs';
import { WorkspaceId } from '../types';

export interface CameraTransform {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  blur: number;
}

export class TransitionDirector {
  private static instance: TransitionDirector;
  private currentTimeline: anime.AnimeTimelineInstance | null = null;
  private targetRotateX: number = 0;
  private targetRotateY: number = 0;
  private currentRotateX: number = 0;
  private currentRotateY: number = 0;
  private animationFrameId: number | null = null;

  public currentCamera: CameraTransform = {
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    blur: 0
  };

  private constructor() {}

  public static getInstance(): TransitionDirector {
    if (!TransitionDirector.instance) {
      TransitionDirector.instance = new TransitionDirector();
    }
    return TransitionDirector.instance;
  }

  /**
   * Executes AAA Cinematic unified Anime.js timeline with spring inertia & directional motion blur
   */
  public animateWorkspaceTransition(
    sceneElement: HTMLElement,
    viewportElement: HTMLElement,
    targetWorkspaceId: WorkspaceId,
    onMiddleSwitch: () => void,
    reducedMotion: boolean = false
  ): Promise<void> {
    return new Promise((resolve) => {
      if (reducedMotion) {
        onMiddleSwitch();
        resolve();
        return;
      }

      // Stop active timeline cleanly
      if (this.currentTimeline) {
        this.currentTimeline.pause();
      }

      const timeline = anime.timeline({
        easing: 'cubicBezier(0.25, 1, 0.5, 1)',
        complete: () => {
          this.currentTimeline = null;
          resolve();
        }
      });

      this.currentTimeline = timeline;

      // STEP 1 & 2: Camera Inertia Pull Back (Z: -60px) + Motion Blur Simulation (12px blur)
      timeline
        .add({
          targets: sceneElement,
          scale: [1, 0.95],
          translateZ: [0, -60],
          rotateX: [0, -3],
          filter: ['blur(0px)', 'blur(12px)'],
          opacity: [1, 0.45],
          duration: 220,
          easing: 'easeInCubic',
          complete: () => {
            onMiddleSwitch();
            viewportElement.scrollTop = 0;
          }
        })
        // STEP 3 & 4: Camera Fly In with Spring Damping + Motion Blur Dissolve (12px -> 0px blur)
        .add({
          targets: sceneElement,
          scale: [0.95, 1.0],
          translateZ: [-60, 0],
          rotateX: [-3, 0],
          filter: ['blur(12px)', 'blur(0px)'],
          opacity: [0.45, 1.0],
          duration: 380,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        })
        // STEP 5: Staggered Workspace Assembly (Header -> Hero -> Stats -> Cards -> Buttons)
        .add({
          targets: viewportElement.querySelectorAll('.glass-panel, h1, h2'),
          translateY: [25, 0],
          opacity: [0, 1],
          delay: anime.stagger(40),
          duration: 300,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        }, '-=220')
        .add({
          targets: viewportElement.querySelectorAll('.glass-card'),
          translateY: [20, 0],
          scale: [0.96, 1.0],
          opacity: [0, 1],
          delay: anime.stagger(50),
          duration: 320,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        }, '-=180')
        .add({
          targets: viewportElement.querySelectorAll('.btn-primary, .btn-secondary, .badge'),
          translateY: [10, 0],
          opacity: [0, 1],
          delay: anime.stagger(30),
          duration: 260,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        }, '-=180');
    });
  }

  /**
   * Applies Spring Inertia & Damping to camera movement on mouse move
   */
  public updateSceneParallaxWithInertia(sceneElement: HTMLElement, mouseX: number, mouseY: number) {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced || !sceneElement) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate target rotations
    this.targetRotateY = ((mouseX - windowWidth / 2) / windowWidth) * 3.5;
    this.targetRotateX = ((mouseY - windowHeight / 2) / windowHeight) * -3.5;

    // Start spring inertia loop if not already running
    if (!this.animationFrameId) {
      const step = () => {
        // Damping factor (0.08 = smooth physical weight)
        this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.08;
        this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.08;

        sceneElement.style.transform = `perspective(1200px) rotateX(${this.currentRotateX.toFixed(3)}deg) rotateY(${this.currentRotateY.toFixed(3)}deg) translateZ(0px)`;

        if (
          Math.abs(this.targetRotateX - this.currentRotateX) > 0.001 ||
          Math.abs(this.targetRotateY - this.currentRotateY) > 0.001
        ) {
          this.animationFrameId = requestAnimationFrame(step);
        } else {
          this.animationFrameId = null;
        }
      };
      this.animationFrameId = requestAnimationFrame(step);
    }
  }
}

export const director = TransitionDirector.getInstance();
