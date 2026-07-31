import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { Search, X, Download, Bot, Sparkles, Moon, Sun, ArrowRight, Layers, FileText } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import { IDENTITY } from '../../data/identity';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();

  // Lock main page scrolling when command palette is open
  useScrollLock(isOpen, paletteRef);

  useEffect(() => {
    if (!isOpen) return;

    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    if (!reducedMotion) {
      if (overlayRef.current) {
        anime({
          targets: overlayRef.current,
          opacity: [0, 1],
          duration: 250,
          easing: 'easeOutQuad',
        });
      }

      if (paletteRef.current) {
        anime({
          targets: paletteRef.current,
          scale: [0.94, 1],
          translateY: [-20, 0],
          opacity: [0, 1],
          duration: 350,
          easing: 'easeOutQuart',
        });
      }
    }
  }, [isOpen, reducedMotion]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!reducedMotion && overlayRef.current && paletteRef.current) {
      anime({
        targets: paletteRef.current,
        scale: [1, 0.94],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuad',
      });

      anime({
        targets: overlayRef.current,
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuad',
        complete: onClose,
      });
    } else {
      onClose();
    }
  };

  const COMMAND_ITEMS = [
    { type: 'nav', label: 'Go to Hero Section', icon: Layers, action: () => scrollTo('#scene-hero') },
    { type: 'nav', label: 'Go to About Pratheesh', icon: Layers, action: () => scrollTo('#scene-about') },
    { type: 'nav', label: 'Go to Technical Matrix (Skills)', icon: Layers, action: () => scrollTo('#scene-skills') },
    { type: 'nav', label: 'Go to Featured Projects', icon: Layers, action: () => scrollTo('#scene-projects') },
    { type: 'nav', label: 'Go to Career & Experience', icon: Layers, action: () => scrollTo('#scene-experience') },
    { type: 'nav', label: 'Go to Services Offered', icon: Layers, action: () => scrollTo('#scene-services') },
    { type: 'nav', label: 'Go to Direct Contact', icon: Layers, action: () => scrollTo('#scene-contact') },
    { type: 'action', label: 'Download Resume (DOCX)', icon: Download, action: () => downloadResume() },
    { type: 'action', label: 'Open AI Concierge Chat', icon: Bot, action: () => openAIConcierge() },
    { type: 'action', label: `Switch Theme to ${theme === 'light' ? 'Dark' : 'Light'}`, icon: theme === 'light' ? Moon : Sun, action: () => { onToggleTheme(); handleClose(); } },
    { type: 'action', label: 'View Privacy Policy', icon: FileText, action: () => openLegal('privacy') },
    { type: 'action', label: 'View Terms of Service', icon: FileText, action: () => openLegal('terms') },
  ];

  const filteredItems = COMMAND_ITEMS.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const scrollTo = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    handleClose();
  };

  const downloadResume = () => {
    const a = document.createElement('a');
    a.href = '/resume/MariyaPratheesh.docx';
    a.download = 'MariyaPratheesh_Resume.docx';
    a.click();
    handleClose();
  };

  const openAIConcierge = () => {
    window.dispatchEvent(new CustomEvent('open-ai-concierge'));
    handleClose();
  };

  const openLegal = (doc: 'privacy' | 'terms') => {
    window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: doc }));
    handleClose();
  };

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette Search"
      style={{
        zIndex: 99995,
        padding: 'max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))',
      }}
      onClick={handleClose}
    >
      <div
        ref={paletteRef}
        className="glass"
        style={{
          width: 'min(640px, calc(100vw - 32px))',
          maxHeight: '90dvh',
          borderRadius: 24,
          padding: 20,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(36px) saturate(200%)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          color: 'var(--text-primary)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 16, marginBottom: 16 }}>
          <Search size={20} color="var(--accent-primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search section..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              minHeight: 44,
            }}
          />
          <button
            onClick={handleClose}
            aria-label="Close command palette"
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '60dvh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, WebkitOverflowScrolling: 'touch' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              No matching commands found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    minHeight: 48,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={18} color="var(--accent-primary)" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight size={14} style={{ opacity: 0.5 }} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--bg-tertiary)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
          <span>Tip: Press <strong>Esc</strong> to exit</span>
          <span>{IDENTITY.name} · Portfolio OS X</span>
        </div>
      </div>
    </div>
  );
};
