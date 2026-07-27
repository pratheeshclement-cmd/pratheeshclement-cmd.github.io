import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { cameraEngine, CameraFrame } from './engine/CinematicCameraEngine';
import { ParticleCanvasEngine } from './engine/ParticleCanvasEngine';
import { CursorLighting } from './components/CursorLighting';
import { CinematicHUD } from './components/cinematic/CinematicHUD';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AIConcierge } from './components/AIConcierge';
import { sound } from './utils/soundEffects';
import { X } from 'lucide-react';

// 9 Continuous Scenes
import { Scene01Intro } from './components/cinematic/Scene01Intro';
import { Scene02Hero } from './components/cinematic/Scene02Hero';
import { Scene03About } from './components/cinematic/Scene03About';
import { Scene04Skills } from './components/cinematic/Scene04Skills';
import { Scene05Projects } from './components/cinematic/Scene05Projects';
import { Scene06Timeline } from './components/cinematic/Scene06Timeline';
import { Scene07Services } from './components/cinematic/Scene07Services';
import { Scene08Certifications } from './components/cinematic/Scene08Certifications';
import { Scene09Contact } from './components/cinematic/Scene09Contact';

export const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenisRef.current = lenis;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
      setScrollProgress(progress);

      // Interpolate camera parameters for scroll progress
      const frame: CameraFrame = cameraEngine.getCameraForProgress(progress);
      if (sceneRef.current) {
        sceneRef.current.style.transform = `perspective(1200px) translate3d(${frame.x}px, ${frame.y}px, ${frame.z}px) rotateX(${frame.rotateX}deg) rotateY(${frame.rotateY}deg) rotateZ(${frame.rotateZ}deg) scale(${frame.scale})`;
        sceneRef.current.style.filter = `blur(${frame.blur}px)`;
        sceneRef.current.style.opacity = `${frame.opacity}`;
      }
    };

    lenis.on('scroll', handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Keyboard Shortcuts (Cmd+K, Cmd+1-9, Esc)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key === 'k') {
        e.preventDefault();
        sound.playClick();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setAiModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      lenis.destroy();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleJumpToScene = (progressTarget: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = progressTarget * totalHeight;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#07090E', color: '#F8FAFC', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Soft Cyan Radial Cursor Lighting */}
      <CursorLighting />

      {/* Particle Canvas Engine Layer */}
      <ParticleCanvasEngine progress={scrollProgress} />

      {/* Persistent OS Floating HUD Header & Progress Bar */}
      <CinematicHUD
        scrollProgress={scrollProgress}
        onJumpToScene={handleJumpToScene}
        onOpenAI={() => setAiModalOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Continuous 3D Spatial Scene Canvas */}
      <div
        ref={sceneRef}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out, filter 0.2s ease-out',
          willChange: 'transform, opacity, filter'
        }}
      >
        {/* Scene 01: Intro & Logo */}
        <Scene01Intro progress={scrollProgress} />

        {/* Scene 02: Cinematic Hero & Portrait Reveal */}
        <Scene02Hero progress={scrollProgress} onNavigateAI={() => setAiModalOpen(true)} />

        {/* Scene 03: About & Qualifications Matrix */}
        <Scene03About progress={scrollProgress} />

        {/* Scene 04: Technical & Marketing Skills Orbit */}
        <Scene04Skills progress={scrollProgress} />

        {/* Scene 05: Featured Project Vault & Case Studies */}
        <Scene05Projects progress={scrollProgress} />

        {/* Scene 06: Career & Education Timeline */}
        <Scene06Timeline progress={scrollProgress} />

        {/* Scene 07: Professional Services */}
        <Scene07Services progress={scrollProgress} />

        {/* Scene 08: Verified Google & Technical Certifications */}
        <Scene08Certifications progress={scrollProgress} />

        {/* Scene 09: Contact & Transmission */}
        <Scene09Contact progress={scrollProgress} />
      </div>

      {/* Holographic AI Concierge Modal Overlay */}
      {aiModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '1000px' }}>
            <button
              onClick={() => { sound.playClick(); setAiModalOpen(false); }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#FFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem'
              }}
            >
              <X size={20} /> Close Hologram
            </button>
            <AIConcierge />
          </div>
        </div>
      )}

      {/* Global Search Command Center Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(wsId) => {
          const sceneMap: Record<string, number> = {
            'welcome': 0.15,
            'ai-concierge': 0.95,
            'frontend-lab': 0.42,
            'seo-center': 0.42,
            'digital-marketing': 0.80,
            'performance-center': 0.42,
            'project-vault': 0.55,
            'knowledge-hub': 0.28,
            'timeline': 0.68,
            'contact': 0.97
          };
          handleJumpToScene(sceneMap[wsId] || 0.15);
        }}
      />
    </div>
  );
};
