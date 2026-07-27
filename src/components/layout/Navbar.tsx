import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Moon, Sun, Download } from 'lucide-react';
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
  const navRef       = useRef<HTMLElement>(null);
  const linksRef     = useRef<HTMLUListElement>(null);
  const themeBtnRef  = useRef<HTMLButtonElement>(null);
  const [activeSection, setActiveSection] = useState('#scene-hero');
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
      const scrollPos = window.scrollY + 200;

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
    gsap.fromTo(items,
      { opacity: 0, y: -15, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
    );
  }, [reduced]);

  // 4. Smooth theme toggle button icon animation
  const handleThemeToggle = () => {
    if (!reduced && themeBtnRef.current) {
      gsap.to(themeBtnRef.current, {
        rotate: 360,
        scale: 1.2,
        duration: 0.4,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.set(themeBtnRef.current, { rotate: 0, scale: 1 });
        },
      });
    }
    onToggleTheme();
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      ref={navRef}
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 8000,
        width: 'min(1200px, calc(100vw - 32px))',
        transition: 'all 0.3s ease',
      }}
    >
      <nav
        className="glass"
        style={{
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 'var(--radius-full)',
          boxShadow: scrollProgress > 0.02 ? '0 10px 30px rgba(0,0,0,0.12)' : 'none',
          transition: 'all 0.3s ease',
        }}
        aria-label="Main navigation"
      >
        {/* Logo with profile avatar */}
        <a
          href="#scene-hero"
          onClick={e => { e.preventDefault(); scrollTo('#scene-hero'); }}
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
          }}
          aria-label="Pratheesh Clement — go to top"
        >
          <img
            src="/assets/pratheesh4k1.jpeg"
            alt="PC Avatar"
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-primary)' }}
          />
          <span>PC<span style={{ color: 'var(--accent-primary)' }}>.</span></span>
        </a>

        {/* Nav links */}
        <ul ref={linksRef} style={{ display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 }} role="list">
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

        {/* Actions */}
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
              transition: 'color 0.2s ease',
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <a
            href="/resume/MariyaPratheesh.docx"
            download="MariyaPratheesh_Resume.docx"
            aria-label="Download Resume"
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}
          >
            <Download size={14} />
            Resume
          </a>
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
    </header>
  );
};
