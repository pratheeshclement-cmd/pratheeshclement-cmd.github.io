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
import { LegalModal, LegalModalType } from './components/ui/LegalModal';
import { CommandPaletteModal }    from './components/ui/CommandPaletteModal';

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

import { AppRouter } from './router/AppRouter';

gsap.registerPlugin(ScrollTrigger);

export const AppContent: React.FC = () => {
  const [bootDone, setBootDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── Mount 3D Virtual Camera & Lenis Smooth Scroll ──────────────────
  useEffect(() => {
    camera.mount('camera-perspective', 'main-world');

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const lenis = new Lenis({
      duration: isTouch ? 0.8 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    (window as any).__lenis__ = lenis;

    const onScroll = (e: { progress: number; velocity: number }) => {
      setScrollProgress(e.progress);
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
      {/* Boot sequence — fixed overlay */}
      <Suspense fallback={null}>
        {!bootDone && <BootScene id="scene-boot" onLeave={() => setBootDone(true)} />}
      </Suspense>

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

      {/* Cookie Consent Banner — displays center screen after loading finishes */}
      <ConsentBanner bootDone={bootDone} />
    </>
  );
};

export const App: React.FC = () => {
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { theme, toggleTheme } = useTheme('light');

  // Listen for open-legal-modal & command palette events
  useEffect(() => {
    const handleOpenLegal = (e: CustomEvent<LegalModalType>) => {
      if (e.detail) {
        setLegalModalType(e.detail);
      }
    };

    const handleOpenPalette = () => {
      setIsCommandPaletteOpen(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('open-legal-modal' as any, handleOpenLegal);
    window.addEventListener('open-command-palette' as any, handleOpenPalette);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-legal-modal' as any, handleOpenLegal);
      window.removeEventListener('open-command-palette' as any, handleOpenPalette);
      window.removeEventListener('keydown', handleKeyDown);
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

      {/* Floating glass navbar persistent across all routes */}
      <Navbar
        scrollProgress={0}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Router renders Homepage (AppContent) at / or dedicated page at /about/, /blog/, etc. */}
      <AppRouter homeComponent={<AppContent />} />

      {/* Persistent AI Concierge */}
      <Suspense fallback={null}>
        <AIConcierge />
      </Suspense>

      {/* SEO Legal Documents Modal */}
      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />

      {/* Command Palette Spotlight Search Modal (⌘K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  );
};

