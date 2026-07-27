import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Download, FileText } from 'lucide-react';

interface NavbarProps {
  scrollProgress: number; // 0.0 -> 1.0
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ scrollProgress, isDarkTheme, onToggleTheme }) => {
  return (
    <>
      <a href="#hero" className="skip-link">Skip to main content</a>

      <header
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)',
          maxWidth: '1240px',
          height: '56px',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          borderRadius: '9999px'
        }}
        className="glass"
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles size={16} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
            Portfolio <span className="text-gradient">X</span>
          </span>
        </div>

        {/* Scroll Progress Bar Indicator */}
        <div style={{
          width: '200px',
          height: '4px',
          backgroundColor: 'rgba(0,0,0,0.06)',
          borderRadius: '9999px',
          overflow: 'hidden',
          display: 'none',
          position: 'relative'
        }} className="desktop-progress">
          <div style={{
            height: '100%',
            width: `${(scrollProgress * 100).toFixed(1)}%`,
            background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            transition: 'width 0.1s linear'
          }} />
        </div>

        {/* Utility Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Resume Download Link */}
          <a
            href="https://pratheeshclement-cmd.github.io/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '9999px' }}
          >
            <FileText size={14} /> Resume
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle light and dark theme"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.04)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            {isDarkTheme ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#3B82F6" />}
          </button>
        </div>
      </header>
    </>
  );
};
