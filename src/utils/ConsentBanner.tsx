import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { ShieldCheck, Check, Cookie } from 'lucide-react';
import { initAnalytics } from './analytics';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollLock } from '../hooks/useScrollLock';

const CONSENT_KEY = 'portfolio-consent-v1';

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  decided: boolean;
}

const defaultConsent: ConsentState = {
  analytics: false,
  marketing: false,
  functional: false,
  decided: false,
};

function loadConsent(): ConsentState {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : defaultConsent;
  } catch {
    return defaultConsent;
  }
}

function saveConsent(c: ConsentState): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
}

export function getStoredConsent(): ConsentState {
  return loadConsent();
}

export const ConsentBanner: React.FC<{ bootDone?: boolean }> = ({ bootDone = true }) => {
  const [consent, setConsent] = useState<ConsentState>(loadConsent);
  const [visible, setVisible] = useState(!consent.decided);
  const [showDetails, setShowDetails] = useState(false);
  const popupRef  = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduced   = useReducedMotion();

  // Lock main page scrolling when consent banner is open
  useScrollLock(visible && bootDone, popupRef);

  useEffect(() => {
    if (consent.decided) {
      initAnalytics(consent);
    }
  }, [consent]);

  // Listen for footer "Cookie Preferences" trigger event
  useEffect(() => {
    const handleReopen = () => {
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener('open-cookie-preferences', handleReopen);
    return () => window.removeEventListener('open-cookie-preferences', handleReopen);
  }, []);

  // Anime.js Entrance Animation when loading finishes
  useEffect(() => {
    if (!visible || !bootDone || reduced) return;

    if (overlayRef.current) {
      anime({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuad',
      });
    }

    if (popupRef.current) {
      anime({
        targets: popupRef.current,
        scale: [0.92, 1.0],
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuart',
        delay: 150,
      });

      const buttons = popupRef.current.querySelectorAll('button');
      anime({
        targets: buttons,
        scale: [0.88, 1],
        opacity: [0, 1],
        delay: anime.stagger(60, { start: 400 }),
        duration: 500,
        easing: 'easeOutBack',
      });
    }
  }, [visible, bootDone, reduced]);

  const accept = (all: boolean) => {
    const next: ConsentState = {
      analytics:  all,
      marketing:  all,
      functional: all,
      decided:    true,
    };

    if (!reduced && popupRef.current && overlayRef.current) {
      anime({
        targets: popupRef.current,
        scale: [1, 0.95],
        opacity: [1, 0],
        duration: 350,
        easing: 'easeInCubic',
      });

      anime({
        targets: overlayRef.current,
        opacity: [1, 0],
        duration: 400,
        easing: 'easeInCubic',
        complete: () => {
          saveConsent(next);
          setConsent(next);
          setVisible(false);
          initAnalytics(next);
          window.dispatchEvent(new CustomEvent('consent-granted', { detail: next }));
        },
      });
    } else {
      saveConsent(next);
      setConsent(next);
      setVisible(false);
      initAnalytics(next);
      window.dispatchEvent(new CustomEvent('consent-granted', { detail: next }));
    }
  };

  const saveCustom = (partial: Partial<ConsentState>) => {
    const next: ConsentState = { ...consent, ...partial, decided: true };
    saveConsent(next);
    setConsent(next);
    setVisible(false);
    initAnalytics(next);
    window.dispatchEvent(new CustomEvent('consent-granted', { detail: next }));
  };

  if (!visible || !bootDone) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Cookie Privacy Consent"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        background: 'rgba(9, 13, 22, 0.55)',
        backdropFilter: 'blur(16px) saturate(180%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        opacity: reduced ? 1 : 0,
      }}
    >
      <div
        ref={popupRef}
        style={{
          width: 'min(540px, 100%)',
          borderRadius: 28,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(32px) saturate(200%)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--hover-shadow)',
          padding: '36px 32px',
          color: 'var(--text-primary)',
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <Cookie size={28} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', margin: 0, color: 'var(--text-primary)' }}>
            🍪 Your Privacy Matters
          </h2>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
          We use cookies to improve your browsing experience, analyze website traffic, personalize content, and enhance website performance. You can choose which cookies to allow.
        </p>

        {/* Custom preference toggles */}
        {showDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, textAlign: 'left', background: 'var(--bg-secondary)', padding: 18, borderRadius: 16, border: '1px solid var(--bg-tertiary)' }}>
            {[
              { key: 'analytics', label: 'Analytics Cookies', desc: 'Google Analytics 4 — measure traffic and page views' },
              { key: 'marketing', label: 'Marketing Cookies', desc: 'Meta Pixel — ad conversion measurement' },
              { key: 'functional', label: 'Functional Cookies', desc: 'AI Concierge session memory' },
            ].map(({ key, label, desc }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consent[key as keyof ConsentState] as boolean}
                  onChange={e => setConsent(prev => ({ ...prev, [key]: e.target.checked }))}
                  style={{ marginTop: 3, accentColor: 'var(--accent-primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{desc}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => accept(true)}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: '0.92rem' }}
          >
            <Check size={16} />
            Accept All Cookies
          </button>

          <button
            onClick={() => accept(false)}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: '0.92rem' }}
          >
            <ShieldCheck size={16} />
            Essential Cookies Only
          </button>

          {!showDetails && (
            <button
              onClick={() => setShowDetails(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 6,
                textDecoration: 'underline',
              }}
            >
              Cookie Preferences
            </button>
          )}

          {showDetails && (
            <button
              onClick={() => saveCustom(consent)}
              style={{
                background: 'none',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
                padding: '10px 20px',
                borderRadius: 999,
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 4,
              }}
            >
              Save Custom Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
