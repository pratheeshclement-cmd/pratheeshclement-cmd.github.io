import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Moon, Sun, Download, Settings, X, ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NavbarProps {
  scrollProgress: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { label: 'About',      href: '#scene-about' },
  { label: 'Skills',     href: '#scene-skills' },
  { label: 'Projects',   href: '#scene-projects' },
  { label: 'Experience', href: '#scene-experience' },
  { label: 'Services',   href: '#scene-services' },
  { label: 'Contact',    href: '#scene-contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ scrollProgress, theme, onToggleTheme }) => {
  const barRef       = useRef<HTMLDivElement>(null);
  const linksRef     = useRef<HTMLUListElement>(null);
  const themeBtnRef  = useRef<HTMLButtonElement>(null);
  const gearBtnRef   = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState('#scene-hero');
  const [mobileOpen, setMobileOpen]       = useState(false);
  const reduced      = useReducedMotion();

  // 1. Scroll progress bar update
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${scrollProgress * 100}%`;
    }
  }, [scrollProgress]);

  // 2. Active section detection on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(link => document.querySelector(link.href));
      const scrollPos = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i] as HTMLElement | null;
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(NAV_LINKS[i].href);
          return;
        }
      }
      setActiveSection('#scene-hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    if (mobileOpen) setMobileOpen(false);
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
        {/* Branding: (Profile Photo) Pratheesh */}
        <a
          href="#scene-hero"
          onClick={e => { e.preventDefault(); scrollTo('#scene-hero'); }}
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
          aria-label="Pratheesh Clement — go to top"
        >
          <img
            src="/assets/pratheesh4k1.jpeg"
            alt="Pratheesh Clement — Digital Marketing Specialist & SEO Expert"
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

        {/* Desktop Nav links (Hidden on small screens via CSS query) */}
        <ul
          ref={linksRef}
          className="desktop-only-nav"
          style={{ display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}
          role="list"
        >
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-full)',
                    transition: 'all 0.25s ease',
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
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

        {/* Actions (Theme toggle + Resume + Mobile Gear Button) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <a
            href="/resume/MariyaPratheesh.docx"
            download="MariyaPratheesh_Resume.docx"
            aria-label="Download Resume"
            className="btn-primary desktop-only-nav"
            style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}
          >
            <Download size={14} />
            Resume
          </a>

          {/* Mobile Animated Gear Icon Button */}
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
              display: 'none', // Controlled via CSS for mobile display
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
        style={{ height: 2, background: 'var(--bg-tertiary)', borderRadius: 2, marginTop: 4, overflow: 'hidden', opacity: scrollProgress > 0 ? 1 : 0, transition: 'opacity 0.3s ease' }}
        aria-hidden="true"
      >
        <div
          ref={barRef}
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))', transition: 'width 0.1s linear' }}
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
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                className="mobile-nav-item"
                style={{
                  padding: '14px 20px',
                  borderRadius: 14,
                  background: activeSection === link.href ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-secondary)',
                  border: activeSection === link.href ? '1px solid var(--accent-primary)' : '1px solid var(--bg-tertiary)',
                  color: activeSection === link.href ? 'var(--accent-primary)' : 'var(--text-primary)',
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
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--bg-tertiary)', display: 'flex', gap: 12 }}>
            <a
              href="/resume/MariyaPratheesh.docx"
              download="MariyaPratheesh_Resume.docx"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
            >
              <Download size={16} />
              Download Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
