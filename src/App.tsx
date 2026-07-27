import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from './components/Navbar';
import { BootSequence } from './components/BootSequence';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceCertificationsSection } from './components/ExperienceCertificationsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesPricingSection } from './components/ServicesPricingSection';
import { TestimonialsFAQSection } from './components/TestimonialsFAQSection';
import { ContactFooterSection } from './components/ContactFooterSection';
import { AIConciergeWidget } from './components/AIConciergeWidget';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    // Custom Cursor tracking
    const cursor = document.getElementById('cursor-dot');
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.2, ease: 'power2.out' });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.08
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', (e: { progress: number }) => {
      setScrollProgress(e.progress);
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);

    // GSAP ScrollTrigger Master Parallax Camera Engine
    const sections = document.querySelectorAll('section');
    sections.forEach((sec) => {
      gsap.fromTo(
        sec,
        { opacity: 0.8, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1
          }
        }
      );
    });

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleToggleTheme = () => {
    setIsDarkTheme(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      return next;
    });
  };

  return (
    <>
      {/* Custom Invert Cursor Dot */}
      <div id="cursor-dot" className="cursor-dot" />

      {/* Boot Intro Sequence */}
      {booting && <BootSequence onComplete={() => setBooting(false)} />}

      {/* Ambient Background Light Orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* Floating Glass Navbar */}
      <Navbar
        scrollProgress={scrollProgress}
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Continuous Scene Scroll Container */}
      <main id="main-content" style={{ position: 'relative', zIndex: 2 }}>
        <HeroSection
          onOpenAI={() => setAiOpen(true)}
          onExploreClick={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <AboutSection />
        <SkillsSection />
        <ExperienceCertificationsSection />
        <ProjectsSection />
        <ServicesPricingSection />
        <TestimonialsFAQSection />
        <ContactFooterSection />
      </main>

      {/* Persistent AI Concierge Assistant Widget */}
      <AIConciergeWidget />
    </>
  );
};
