import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Moon, Sun, Settings, X, ArrowRight, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useRouter, navigateTo, normalisePath } from '../../router/useRouter';

interface NavbarProps {
  scrollProgress: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '/about/', hash: '#scene-about' },
  { label: 'Projects', href: '/projects/', hash: '#scene-projects' },
  { label: 'Services', href: '/services/', hash: '#scene-services' },
  { label: 'Blog', href: '/blog/', hash: '#scene-blog' },
  { label: 'Experience', href: '/certifications/', hash: '#scene-experience' },
  { label: 'Contact', href: '/contact/', hash: '#scene-contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ scrollProgress, theme, onToggleTheme }) => {
  const barRef        = useRef<HTMLDivElement>(null);
  const linksRef      = useRef<HTMLUListElement>(null);
  const themeBtnRef   = useRef<HTMLButtonElement>(null);
  const gearBtnRef    = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { currentPath, isHome } = useRouter();
  const [activeSection, setActiveSection] = useState('#scene-hero');
  const [mobileOpen, setMobileOpen]       = useState(false);
  const reduced       = useReducedMotion();

  // Lock main page scrolling when mobile navigation menu is open
  useScrollLock(mobileOpen, mobileMenuRef);

  // 1. Scroll progress bar update
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${scrollProgress * 100}%`;
    }
  }, [scrollProgress]);

  // 2. Active section detection on scroll (when on homepage)
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const sections = NAV_LINKS.map(link => document.querySelector(link.hash));
      const scrollPos = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i] as HTMLElement | null;
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(NAV_LINKS[i].hash);
          return;
        }
      }
      setActiveSection('#scene-hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // 3. Stagger assembly on mount
  useEffect(() => {
    if (reduced || !linksRef.current) return;
    const items = linksRef.current.querySelectorAll('li');
    anime({
      targets: items,
      translateY: [-15, 0],
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: anime.stagger(60, { start: 200 }),
      duration: 600,
      easing: 'easeOutQuart',
    });
  }, [reduced]);

  // 4. Mobile Menu Anime.js toggle animation
  const toggleMobileMenu = () => {
    const nextState = !mobileOpen;
    setMobileOpen(nextState);

    if (gearBtnRef.current) {
      anime({
        targets: gearBtnRef.current,
        rotate: nextState ? 180 : 0,
        duration: 500,
        easing: 'easeOutElastic(1, 0.5)',
      });
    }

    if (nextState && mobileMenuRef.current) {
      anime({
        targets: mobileMenuRef.current,
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 400,
        easing: 'easeOutQuart',
      });
      const items = mobileMenuRef.current.querySelectorAll('.mobile-nav-item');
      anime({
        targets: items,
        translateX: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(50, { start: 100 }),
        duration: 500,
        easing: 'easeOutQuart',
      });
    }
  };

  // 5. Smooth theme toggle button icon spin
  const handleThemeToggle = () => {
    if (!reduced && themeBtnRef.current) {
      anime({
        targets: themeBtnRef.current,
        rotate: 360,
        scale: [1, 1.2, 1],
        duration: 500,
        easing: 'easeOutElastic(1, 0.4)',
      });
    }
    onToggleTheme();
  };

  const handleNavClick = (link: { label: string; href: string; hash: string }) => {
    if (mobileOpen) setMobileOpen(false);

    if (isHome) {
      const el = document.querySelector(link.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    navigateTo(link.href);
  };

  const isLinkActive = (link: { label: string; href: string; hash: string }) => {
    if (isHome) {
      return activeSection === link.hash;
    }
    const norm = normalisePath(currentPath);
    return norm.startsWith(link.href);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 8000,
        width: 'min(1200px, calc(100vw - 32px))',
      }}
    >
      <nav
        className="glass"
        style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 'var(--radius-full)',
          boxShadow: scrollProgress > 0.02 ? '0 10px 30px rgba(0,0,0,0.12)' : 'none',
          transition: 'all 0.3s ease',
        }}
        aria-label="Main navigation"
      >
        {/* Branding: Pratheesh Clement */}
        <a
          href="/"
          onClick={e => {
            e.preventDefault();
            if (isHome) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigateTo('/');
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
          aria-label="Pratheesh Clement — go to homepage"
        >
          <img
            src="/assets/pratheesh4k1.jpeg"
            alt="Pratheesh Clement"
            title="Pratheesh Clement Portfolio"
            width={32}
            height={32}
            loading="eager"
            decoding="async"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--accent-primary)',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
            }}
          />
          <span>Pratheesh</span>
        </a>

        {/* Desktop Nav links */}
        <ul
          ref={linksRef}
          className="desktop-only-nav"
          style={{ display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}
          role="list"
        >
          {NAV_LINKS.map(link => {
            const active = isLinkActive(link);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={e => {
                    e.preventDefault();
                    handleNavClick(link);
                  }}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: active ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 0.25s ease',
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Actions (Theme toggle + AI Assistant + Command Palette + Mobile Gear) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme Toggle */}
          <button
            ref={themeBtnRef}
            onClick={handleThemeToggle}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              padding: 8,
              borderRadius: 'var(--radius-sm)',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* AI Concierge Launcher */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-concierge'))}
            aria-label="Open AI Concierge Assistant"
            className="desktop-only-nav pill"
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              background: 'rgba(139, 92, 246, 0.1)',
              borderColor: 'rgba(139, 92, 246, 0.3)',
              color: 'var(--accent-tertiary)',
            }}
          >
            <Sparkles size={13} />
            AI Assistant
          </button>

          {/* Command Palette Launcher (⌘K) */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            aria-label="Open Command Search Palette"
            className="desktop-only-nav pill"
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              background: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.3)',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ⌘K
          </button>

          {/* Mobile Animated Gear Button */}
          <button
            ref={gearBtnRef}
            onClick={toggleMobileMenu}
            aria-label="Mobile settings menu"
            className="mobile-only-gear"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'var(--accent-primary)',
              borderRadius: '50%',
              width: 38,
              height: 38,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Settings size={20} />}
          </button>
        </div>
      </nav>

      {/* Scroll progress bar */}
      <div
        style={{
          height: 2,
          background: 'var(--bg-tertiary)',
          borderRadius: 2,
          marginTop: 4,
          overflow: 'hidden',
          opacity: scrollProgress > 0 ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        aria-hidden="true"
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Mobile Full-Screen OS Navigation Panel */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            top: 72,
            left: 0,
            right: 0,
            bottom: -100,
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(32px) saturate(200%)',
            zIndex: 9999,
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            borderRadius: '24px 24px 0 0',
            borderTop: '1px solid var(--glass-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="section-label" style={{ marginBottom: 0 }}>System Navigation</span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile menu"
              style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NAV_LINKS.map(link => {
              const active = isLinkActive(link);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => {
                    e.preventDefault();
                    handleNavClick(link);
                  }}
                  className="mobile-nav-item"
                  style={{
                    padding: '14px 20px',
                    borderRadius: 14,
                    background: active ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-secondary)',
                    border: active ? '1px solid var(--accent-primary)' : '1px solid var(--bg-tertiary)',
                    color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {link.label}
                  <ArrowRight size={18} />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
