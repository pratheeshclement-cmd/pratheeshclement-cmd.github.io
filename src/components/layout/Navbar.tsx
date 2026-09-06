import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import anime from 'animejs';
import gsap from 'gsap';
import { Moon, Sun, Settings, X, ArrowRight, Sparkles, User, FolderKanban, Layers, BookOpen, Award, Mail } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useRouter, navigateTo, normalisePath } from '../../router/useRouter';

interface NavbarProps {
  scrollProgress: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '/about/', hash: '#scene-about', icon: User, desc: 'Background & Core Philosophy' },
  { label: 'Projects', href: '/projects/', hash: '#scene-projects', icon: FolderKanban, desc: 'Case Studies & Live Applications' },
  { label: 'Services', href: '/services/', hash: '#scene-services', icon: Layers, desc: 'SEO, Ads & Web Development' },
  { label: 'Blog', href: '/blog/', hash: '#scene-blog', icon: BookOpen, desc: 'Articles & Technical Insights' },
  { label: 'Experience', href: '/certifications/', hash: '#scene-experience', icon: Award, desc: 'Work History & Google Certifications' },
  { label: 'Contact', href: '/contact/', hash: '#scene-contact', icon: Mail, desc: 'Get in Touch for Projects' },
];

export const Navbar: React.FC<NavbarProps> = ({ scrollProgress, theme, onToggleTheme }) => {
  const barRef        = useRef<HTMLDivElement>(null);
  const linksRef      = useRef<HTMLUListElement>(null);
  const themeBtnRef   = useRef<HTMLButtonElement>(null);
  const gearBtnRef    = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);

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

  // 4. Sync mobile settings menu state with body locking, GSAP pausing, and custom events
  useEffect(() => {
    document.body.classList.toggle('menu-open', mobileOpen);
    window.dispatchEvent(new CustomEvent('mobile-menu-state-changed', { detail: { open: mobileOpen } }));

    if (mobileOpen) {
      gsap.globalTimeline.pause();
      try {
        window.history.pushState({ mobileSettingsOpen: true }, '');
      } catch (e) {
        // Handle history push state restrictions
      }
    } else {
      gsap.globalTimeline.resume();
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [mobileOpen]);

  // 5. Handle Android Hardware Back Button (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mobileOpen]);

  // 6. Handle Escape key and focus trap inside Settings Modal Sheet
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }

      if (e.key === 'Tab' && mobileMenuRef.current) {
        const focusables = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // 7. Mobile Menu toggle animation
  const toggleMobileMenu = () => {
    const nextState = !mobileOpen;
    setMobileOpen(nextState);

    if (gearBtnRef.current) {
      anime({
        targets: gearBtnRef.current,
        rotate: nextState ? 180 : 0,
        duration: 400,
        easing: 'easeOutElastic(1, 0.5)',
      });
    }

    if (nextState) {
      requestAnimationFrame(() => {
        if (!reduced) {
          if (overlayRef.current) {
            anime({
              targets: overlayRef.current,
              opacity: [0, 1],
              duration: 250,
              easing: 'easeOutQuad',
            });
          }
          if (mobileMenuRef.current) {
            anime({
              targets: mobileMenuRef.current,
              opacity: [0, 1],
              scale: [0.96, 1],
              translateY: [15, 0],
              duration: 300,
              easing: 'easeOutCubic',
            });
          }
        }
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
      className="main-header"
      style={{
        position: 'fixed',
        top: 'max(12px, env(safe-area-inset-top, 12px))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 8000,
        width: 'min(calc(100vw - 24px), 1200px)',
      }}
    >
      <nav
        className="glass nav-capsule"
        style={{
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 'var(--radius-full)',
          boxShadow: scrollProgress > 0.02 ? '0 10px 30px rgba(0,0,0,0.12)' : 'none',
          transition: 'all 0.3s ease',
          width: '100%',
        }}
        aria-label="Main navigation"
      >
        {/* Branding: Pratheesh Clement Profile */}
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
            fontSize: '1rem',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            minWidth: 0,
            flexShrink: 1,
          }}
          aria-label="Pratheesh Clement — go to homepage"
        >
          <img
            src="/assets/new4k3.jpeg"
            alt="Pratheesh Clement"
            title="Pratheesh Clement Portfolio"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--accent-primary)',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 120,
            }}
          >
            Pratheesh
          </span>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Theme Toggle */}
          <button
            ref={themeBtnRef}
            onClick={handleThemeToggle}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="nav-control-btn"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--bg-tertiary)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              padding: 0,
              margin: 0,
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
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
            className="mobile-only-gear nav-control-btn"
            style={{
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'var(--accent-primary)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              padding: 0,
              margin: 0,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
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

      {/* Mobile Full-Screen OS Navigation Panel & Dimmed Backdrop */}
      {mobileOpen && createPortal(
        <>
          {/* 1. Full-screen dimmed backdrop overlay */}
          <div
            ref={overlayRef}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
            className="mobile-drawer-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99998,
              background: 'rgba(4, 8, 18, 0.82)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              opacity: 1,
              pointerEvents: 'auto',
              touchAction: 'auto',
              transition: 'opacity 0.22s ease',
            }}
          />

          {/* 2. Apple / HarmonyOS Style Floating Settings Sheet */}
          <div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Settings and System Navigation"
            className="mobile-drawer-sheet"
            style={{
              position: 'fixed',
              top: 'max(16px, env(safe-area-inset-top, 16px))',
              left: 'max(16px, env(safe-area-inset-left, 16px))',
              right: 'max(16px, env(safe-area-inset-right, 16px))',
              width: 'min(calc(100vw - 32px), 440px)',
              maxWidth: 440,
              marginInline: 'auto',
              maxHeight: 'calc(100dvh - 32px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              zIndex: 99999,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              borderRadius: '28px',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
              transform: 'translate3d(0, 0, 0)',
              opacity: 1,
              pointerEvents: 'auto',
              touchAction: 'pan-y',
              willChange: 'transform, opacity',
            }}
          >
            {/* Header: Title + Theme toggle + Close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, paddingBottom: 14, borderBottom: '1px solid var(--bg-tertiary)' }}>
              <div>
                <span className="section-label" style={{ marginBottom: 2 }}>System Drawer</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Settings & Navigation
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleThemeToggle}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  className="nav-control-btn"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    color: 'var(--accent-primary)',
                    borderRadius: '50%',
                    width: 38,
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close mobile settings menu"
                  className="nav-control-btn"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    borderRadius: '50%',
                    width: 38,
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Nav Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {NAV_LINKS.map(link => {
                const active = isLinkActive(link);
                const ItemIcon = link.icon;
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
                      minHeight: 56,
                      padding: '12px 16px',
                      borderRadius: 18,
                      background: active ? 'rgba(59, 130, 246, 0.14)' : 'var(--bg-secondary)',
                      border: active ? '1px solid var(--accent-primary)' : '1px solid var(--bg-tertiary)',
                      color: active ? 'var(--accent-primary)' : 'var(--text-primary)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      pointerEvents: 'auto',
                      touchAction: 'auto',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          background: active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          flexShrink: 0,
                        }}
                      >
                        <ItemIcon size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: active ? 'var(--accent-primary)' : 'var(--text-primary)', lineHeight: 1.3 }}>
                          {link.label}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {link.desc}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={18} style={{ color: active ? 'var(--accent-primary)' : 'var(--text-tertiary)', flexShrink: 0 }} />
                  </a>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div style={{ paddingTop: 14, borderTop: '1px solid var(--bg-tertiary)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent('open-ai-concierge'));
                }}
                style={{
                  width: '100%',
                  minHeight: 48,
                  padding: '12px 16px',
                  borderRadius: 16,
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: 'var(--accent-tertiary)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={18} /> Open AI Concierge Assistant
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
};
