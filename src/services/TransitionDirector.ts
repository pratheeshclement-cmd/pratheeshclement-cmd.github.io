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
   * Executes unified Anime.js timeline for spatial 3D camera navigation
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

      // Stop any running timeline to prevent animation collisions
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

      // STEP 1 & 2: Camera pulls back (Z: -40px), scales to 0.96, scene blurs to 12px
      timeline
        .add({
          targets: sceneElement,
          scale: [1, 0.96],
          translateZ: [0, -50],
          rotateX: [0, -2],
          filter: ['blur(0px)', 'blur(8px)'],
          opacity: [1, 0.5],
          duration: 200,
          easing: 'easeInQuad',
          complete: () => {
            onMiddleSwitch();
            viewportElement.scrollTop = 0;
          }
        })
        // STEP 3 & 4: Camera flies into selected workspace (Z: +30px -> 0px), scales up to 1.0, unblurs
        .add({
          targets: sceneElement,
          scale: [0.96, 1.0],
          translateZ: [-50, 0],
          rotateX: [-2, 0],
          filter: ['blur(8px)', 'blur(0px)'],
          opacity: [0.5, 1.0],
          duration: 350,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        })
        // STEP 5: Staggered Assembly (Header -> Hero -> Stats -> Cards -> Buttons)
        .add({
          targets: viewportElement.querySelectorAll('.glass-panel, h1, h2'),
          translateY: [25, 0],
          opacity: [0, 1],
          delay: anime.stagger(40),
          duration: 300,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        }, '-=200')
        .add({
          targets: viewportElement.querySelectorAll('.glass-card'),
          translateY: [20, 0],
          scale: [0.96, 1.0],
          opacity: [0, 1],
          delay: anime.stagger(50),
          duration: 300,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        }, '-=150')
        .add({
          targets: viewportElement.querySelectorAll('.btn-primary, .btn-secondary, .badge'),
          translateY: [10, 0],
          opacity: [0, 1],
          delay: anime.stagger(30),
          duration: 250,
          easing: 'cubicBezier(0.25, 1, 0.5, 1)'
        }, '-=150');
    });
  }

  /**
   * Applies subtle parallax camera shift based on mouse move across 3D scene
   */
  public updateSceneParallax(sceneElement: HTMLElement, mouseX: number, mouseY: number) {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced || !sceneElement) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Subtle 3D scene tilt (max 2.5 degrees)
    const rotateY = ((mouseX - windowWidth / 2) / windowWidth) * 4;
    const rotateX = ((mouseY - windowHeight / 2) / windowHeight) * -4;

    sceneElement.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0px)`;
  }
}

export const director = TransitionDirector.getInstance();
