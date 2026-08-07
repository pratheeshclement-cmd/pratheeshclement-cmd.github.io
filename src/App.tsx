import React, { Suspense, useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from './hooks/useTheme';
import { camera } from './engine/CameraController';
import { animeEngine } from './engine/AnimeMasterEngine';
import { useRouter, normalisePath } from './router/useRouter';

// Layout
import { Navbar }                 from './components/layout/Navbar';
import { AmbientBackground }      from './components/layout/AmbientBackground';
import { CinematicParticleCanvas } from './components/layout/CinematicParticleCanvas';
import { CursorLighting }         from './components/layout/CursorLighting';
import { ConsentBanner }          from './utils/ConsentBanner';
import { LegalModal, LegalModalType } from './components/ui/LegalModal';
import { CommandPaletteModal }    from './components/ui/CommandPaletteModal';

// Router & Admin
import { AppRouter } from './router/AppRouter';
const AdminApp = React.lazy(() => import('./admin/AdminApp').then(m => ({ default: m.AdminApp })));

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

// ── Public Portfolio Homepage Content ───────────────────────────────────────
export const AppContent: React.FC = () => {
  const [bootDone, setBootDone] = useState(() => {
    try {
      return sessionStorage.getItem('pratheesh_boot_done') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [, setScrollProgress] = useState(0);

  // ── Mount 3D Virtual Camera & Lenis Smooth Scroll (Portfolio Only) ───────
  useEffect(() => {
    camera.mount('camera-perspective', 'main-world');

    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobile) {
      let lastScrollY = window.scrollY;
      let scrollTimer: number;

      const onNativeScroll = () => {
        const currentScrollY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(1, Math.max(0, currentScrollY / totalHeight)) : 0;
        const velocity = (currentScrollY - lastScrollY) * 0.1;
        lastScrollY = currentScrollY;

        setScrollProgress(progress);
        camera.updateCamera(progress, velocity);
        animeEngine.scrubScroll(progress);
        ScrollTrigger.update();

        window.dispatchEvent(new CustomEvent('mobile-scroll-state', { detail: { scrolling: true } }));
        clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          window.dispatchEvent(new CustomEvent('mobile-scroll-state', { detail: { scrolling: false } }));
        }, 150);
      };

      window.addEventListener('scroll', onNativeScroll, { passive: true });
      return () => {
        camera.unmount();
        clearTimeout(scrollTimer);
        window.removeEventListener('scroll', onNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
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
      <Suspense fallback={null}>
        {!bootDone && (
          <BootScene
            id="scene-boot"
            onLeave={() => {
              try {
                sessionStorage.setItem('pratheesh_boot_done', 'true');
              } catch (e) {
                // Ignore storage restriction
              }
              setBootDone(true);
            }}
          />
        )}
      </Suspense>

      <div id="camera-perspective" style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
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

      <ConsentBanner bootDone={bootDone} />
    </>
  );
};

// ── Root Entry Point: Isolated Render Trees for Admin vs Portfolio ─────────
export const App: React.FC = () => {
  const { currentPath } = useRouter();
  const normPath = normalisePath(currentPath);
  const isAdmin = normPath.startsWith('/admin');

  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { theme, toggleTheme } = useTheme('light');

  // Listen for open-legal-modal & command palette events (Portfolio Only)
  useEffect(() => {
    if (isAdmin) return;

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
  }, [isAdmin]);

  // ── BRANCH 1: DMOS Admin App (100% Isolated Render Tree) ────────────────
  if (isAdmin) {
    return (
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1220', color: '#94A3B8', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', flexDirection: 'column', gap: 16 }}>
          <div style={{ width: 36, height: 36, border: '3px solid #2E5AFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading DMOS Enterprise…
        </div>
      }>
        <AdminApp />
      </Suspense>
    );
  }

  // ── BRANCH 2: Public Portfolio App (Includes Navbar, Particles, Concierge) ─
  return (
    <>
      <a className="skip-link" href="#main-world">Skip to content</a>
      <AmbientBackground />
      <CinematicParticleCanvas />
      <CursorLighting />
      <Navbar
        scrollProgress={0}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <AppRouter homeComponent={<AppContent />} />

      <Suspense fallback={null}>
        <AIConcierge />
      </Suspense>

      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  );
};
