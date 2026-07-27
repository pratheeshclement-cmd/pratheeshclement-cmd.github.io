import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { initAnalytics } from './analytics';

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

export const ConsentBanner: React.FC = () => {
  const [consent, setConsent] = useState<ConsentState>(loadConsent);
  const [visible, setVisible] = useState(!consent.decided);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // If user already consented in a previous session, initialize analytics
    if (consent.decided) {
      initAnalytics(consent);
    }
  }, []);

  const accept = (all: boolean) => {
    const next: ConsentState = {
      analytics:  all,
      marketing:  all,
      functional: all,
      decided:    true,
    };
    saveConsent(next);
    setConsent(next);
    setVisible(false);
    initAnalytics(next);
    window.dispatchEvent(new CustomEvent('consent-granted', { detail: next }));
  };

  const saveCustom = (partial: Partial<ConsentState>) => {
    const next: ConsentState = { ...consent, ...partial, decided: true };
    saveConsent(next);
    setConsent(next);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('consent-granted', { detail: next }));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', bottom: 24, left: 24, right: 24, zIndex: 99990,
        maxWidth: showDetails ? 640 : 520,
        margin: '0 auto',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: 20,
        border: '1px solid rgba(203,213,225,0.6)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: 24,
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <Cookie size={20} style={{ flexShrink: 0, color: 'var(--accent-primary)', marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Privacy Choices</strong>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.6 }}>
            This site uses cookies for analytics and marketing to help improve your experience.
            You choose what's enabled.
          </p>
        </div>
        <button
          onClick={() => accept(false)}
          aria-label="Decline all and close"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 4 }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Custom choices */}
      {showDetails && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {[
            { key: 'analytics', label: 'Analytics', desc: 'Google Analytics 4 — page views & behaviour' },
            { key: 'marketing', label: 'Marketing', desc: 'Meta Pixel — ad campaign measurement' },
            { key: 'functional', label: 'Functional', desc: 'AI Concierge conversation memory' },
          ].map(({ key, label, desc }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consent[key as keyof ConsentState] as boolean}
                onChange={e => setConsent(prev => ({ ...prev, [key]: e.target.checked }))}
                style={{ marginTop: 2, accentColor: 'var(--accent-primary)' }}
                id={`consent-${key}`}
              />
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </label>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => accept(true)}
          style={{
            background: 'var(--accent-primary)', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          Accept All
        </button>

        {showDetails ? (
          <button
            onClick={() => saveCustom(consent)}
            style={{
              background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--bg-tertiary)',
              padding: '10px 20px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}
          >
            Save Choices
          </button>
        ) : (
          <button
            onClick={() => setShowDetails(true)}
            style={{
              background: 'none', color: 'var(--text-secondary)', border: '1px solid var(--bg-tertiary)',
              padding: '10px 20px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}
          >
            Customise
          </button>
        )}

        <button
          onClick={() => accept(false)}
          style={{ background: 'none', color: 'var(--text-tertiary)', border: 'none', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: '10px 8px' }}
        >
          Necessary only
        </button>
      </div>
    </div>
  );
};
