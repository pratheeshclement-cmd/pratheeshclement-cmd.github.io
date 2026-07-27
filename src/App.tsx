import React, { Suspense, useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from './hooks/useTheme';
import { camera } from './engine/CameraController';
import { animeEngine } from './engine/AnimeMasterEngine';

// Layout
import { Navbar }                 from './components/layout/Navbar';
import { AmbientBackground }      from './components/layout/AmbientBackground';
import { CinematicParticleCanvas } from './components/layout/CinematicParticleCanvas';
import { CursorLighting }         from './components/layout/CursorLighting';
import { ConsentBanner }          from './utils/ConsentBanner';

// Scenes — lazy for code splitting
const BootScene         = React.lazy(() => import('./components/scenes/BootScene'));
const HeroScene         = React.lazy(() => import('./components/scenes/HeroScene'));
const AboutScene        = React.lazy(() => import('./components/scenes/AboutScene'));
const SkillsScene       = React.lazy(() => import('./components/scenes/SkillsScene'));
const ProjectsScene     = React.lazy(() => import('./components/scenes/ProjectsScene'));
const ExperienceScene   = React.lazy(() => import('./components/scenes/ExperienceScene'));
const ServicesScene     = React.lazy(() => import('./components/scenes/ServicesScene'));
const TestimonialsScene = React.lazy(() => import('./components/scenes/TestimonialsScene'));
const ContactScene      = React.lazy(() => import('./components/scenes/ContactScene'));
const AIConcierge       = React.lazy(() => import('./components/ai/AIConcierge'));

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [bootDone, setBootDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme } = useTheme('light');

  // ── Mount 3D Virtual Camera & Lenis Smooth Scroll ──────────────────
  useEffect(() => {
    camera.mount('camera-perspective', 'main-world');

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onScroll = (e: { progress: number; velocity: number }) => {
      setScrollProgress(e.progress);
      // Update Virtual Camera 3D flight & scrub master Anime.js timeline
      camera.updateCamera(e.progress, e.velocity);
      animeEngine.scrubScroll(e.progress);
      ScrollTrigger.update();
    };
    lenis.on('scroll', onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      camera.unmount();
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Accessibility skip link */}
      <a className="skip-link" href="#main-world">Skip to content</a>

      {/* Fixed ambient background layer */}
      <AmbientBackground />

      {/* Floating ambient particle canvas layer */}
      <CinematicParticleCanvas />

      {/* Custom cursor lighting */}
      <CursorLighting />

      {/* Boot sequence — fixed overlay */}
      <Suspense fallback={null}>
        {!bootDone && <BootScene id="scene-boot" onLeave={() => setBootDone(true)} />}
      </Suspense>

      {/* Floating glass navbar */}
      <Navbar
        scrollProgress={scrollProgress}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* ── 3D Virtual Camera Perspective Container ───────────────────── */}
      <div id="camera-perspective" style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
        {/* ── Main 3D Scroll World Space ──────────────────────────────── */}
        <main id="main-world" role="main">
          <Suspense fallback={null}>
            <HeroScene         id="scene-hero" />
            <AboutScene        id="scene-about" />
            <SkillsScene       id="scene-skills" />
            <ProjectsScene     id="scene-projects" />
            <ExperienceScene   id="scene-experience" />
            <ServicesScene     id="scene-services" />
            <TestimonialsScene id="scene-testimonials" />
            <ContactScene      id="scene-contact" />
          </Suspense>
        </main>
      </div>

      {/* Persistent AI Concierge */}
      <Suspense fallback={null}>
        <AIConcierge />
      </Suspense>

      {/* Cookie Consent Banner — displays center screen after loading finishes */}
      <ConsentBanner bootDone={bootDone} />
    </>
  );
};
