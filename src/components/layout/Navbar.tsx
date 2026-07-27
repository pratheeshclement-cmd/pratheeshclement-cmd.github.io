import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Moon, Sun, Download } from 'lucide-react';

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
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${scrollProgress * 100}%`;
    }
  }, [scrollProgress]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
        style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 'var(--radius-full)' }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#scene-hero"
          onClick={e => { e.preventDefault(); scrollTo('#scene-hero'); }}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em' }}
          aria-label="Pratheesh Clement — go to top"
        >
          PC<span style={{ color: 'var(--accent-primary)' }}>.</span>
        </a>

        {/* Nav links */}
        <ul style={{ display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 }} role="list">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', borderRadius: 'var(--radius-full)', transition: 'all 0.2s ease', display: 'block' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: 8, borderRadius: 'var(--radius-sm)' }}
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
