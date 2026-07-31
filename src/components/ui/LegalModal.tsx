import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { X, ShieldCheck, FileText, Cookie, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import { IDENTITY } from '../../data/identity';

export type LegalModalType = 'privacy' | 'terms' | 'cookies' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Lock main page scrolling when legal modal is open
  useScrollLock(Boolean(type), contentRef);

  useEffect(() => {
    if (!type || reducedMotion) return;

    if (overlayRef.current) {
      anime({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 350,
        easing: 'easeOutQuad',
      });
    }

    if (contentRef.current) {
      anime({
        targets: contentRef.current,
        scale: [0.94, 1],
        translateY: [25, 0],
        opacity: [0, 1],
        duration: 450,
        easing: 'easeOutQuart',
      });
    }
  }, [type, reducedMotion]);

  if (!type) return null;

  const handleClose = () => {
    if (!reducedMotion && overlayRef.current && contentRef.current) {
      anime({
        targets: contentRef.current,
        scale: [1, 0.94],
        opacity: [1, 0],
        duration: 250,
        easing: 'easeInQuad',
      });

      anime({
        targets: overlayRef.current,
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad',
        complete: onClose,
      });
    } else {
      onClose();
    }
  };

  const getModalConfig = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: ShieldCheck,
          canonical: 'https://pratheeshclement-cmd.github.io/privacy-policy',
          description: `Privacy policy for Pratheesh Clement (${IDENTITY.name}). Learn how your personal data, analytics, and privacy preferences are protected.`,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Privacy Policy — Pratheesh Clement',
            'url': 'https://pratheeshclement-cmd.github.io/privacy-policy',
            'description': 'Official privacy policy detailing data processing, Google Analytics 4, Meta Pixel, and user rights.',
            'publisher': {
              '@type': 'Person',
              'name': IDENTITY.name,
              'jobTitle': IDENTITY.title,
            },
          },
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: FileText,
          canonical: 'https://pratheeshclement-cmd.github.io/terms-of-service',
          description: `Terms of service governing the usage of Pratheesh Clement's portfolio, interactive showcases, AI Concierge, and IP rights.`,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Terms of Service — Pratheesh Clement',
            'url': 'https://pratheeshclement-cmd.github.io/terms-of-service',
            'description': 'Terms of service for browsing Pratheesh Clement portfolio and using AI Concierge services.',
          },
        };
      case 'cookies':
        return {
          title: 'Cookie Policy',
          icon: Cookie,
          canonical: 'https://pratheeshclement-cmd.github.io/cookie-policy',
          description: `Comprehensive Cookie Policy covering Necessary, Analytics, and Marketing cookies utilized on this site.`,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Cookie Policy — Pratheesh Clement',
            'url': 'https://pratheeshclement-cmd.github.io/cookie-policy',
            'description': 'Detailed breakdown of cookies used on this website and consent settings.',
          },
        };
      default:
        return { title: '', icon: ShieldCheck, canonical: '', description: '', jsonLd: {} };
    }
  };

  const config = getModalConfig();
  const Icon = config.icon;

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      style={{ zIndex: 99999 }}
      onClick={handleClose}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(config.jsonLd) }}
      />

      <div
        ref={contentRef}
        className="modal-content glass"
        style={{
          padding: '40px 36px',
          borderRadius: 28,
          maxWidth: 780,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          color: 'var(--text-primary)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Home</span>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{config.title}</span>
          </nav>

          <button
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--bg-tertiary)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} color="var(--accent-primary)" />
          </div>
          <div>
            <h1 id="legal-modal-title" style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', margin: 0, lineHeight: 1.2 }}>
              {config.title}
            </h1>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              Last Updated: July 2026 · {IDENTITY.name} ({IDENTITY.legalName})
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28, borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: 20 }}>
          {config.description}
        </p>

        {/* Policy Content */}
        <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {type === 'privacy' && (
            <>
              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>1. Data Controller & Overview</h2>
                <p>
                  This website is owned and operated by <strong>{IDENTITY.name}</strong> (legal name <em>{IDENTITY.legalName}</em>), based in {IDENTITY.location.display}. We respect your privacy and are committed to protecting your personal data in compliance with general data protection regulations (GDPR) and local privacy frameworks.
                </p>
              </section>

              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>2. Information We Collect</h2>
                <p>
                  We collect information strictly necessary to provide a performant and interactive web experience:
                </p>
                <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <li><strong>Voluntary Contact Data:</strong> Name, email address, and message content submitted via contact forms or direct email/WhatsApp links.</li>
                  <li><strong>Technical & Usage Data:</strong> IP address, browser type, device specifications, and page interaction metrics collected via Google Analytics 4 (GA4) only upon explicit consent.</li>
                  <li><strong>Cookie Preferences:</strong> Local storage settings storing your consent preferences for analytics and marketing.</li>
                </ul>
              </section>

              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>3. Analytics & AdSense Integration</h2>
                <p>
                  In compliance with strict privacy standards, third-party analytics (Google Analytics) and tracking pixels (Meta Pixel) are <strong>gated behind our Granular Cookie Consent System</strong>. No non-essential tracking scripts execute until you explicitly click "Accept All" or enable them in Cookie Preferences.
                </p>
              </section>

              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>4. Your Rights</h2>
                <p>
                  You have the right to inspect, correct, or delete any personal data you submit to us. You can update or withdraw your cookie consent at any time by clicking the <strong>"Cookie Preferences"</strong> link located in the website footer.
                </p>
              </section>
            </>
          )}

          {type === 'terms' && (
            <>
              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>1. Acceptance of Terms</h2>
                <p>
                  By accessing and navigating this portfolio (<em>pratheeshclement-cmd.github.io</em>), you agree to be bound by these Terms of Service. If you do not agree, please refrain from using the site.
                </p>
              </section>

              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>2. Intellectual Property Rights</h2>
                <p>
                  All content on this site—including custom UI designs, source code, interactive canvas implementations, case study analyses, and branding assets—is the intellectual property of <strong>{IDENTITY.name}</strong> unless otherwise stated. Unattributed copying or commercial redistribution is strictly prohibited.
                </p>
              </section>

              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>3. AI Concierge Usage</h2>
                <p>
                  The integrated AI Concierge provides intelligent assistance based on public portfolio data. While engineered for precision, response outputs are for informational purposes and do not constitute binding legal contracts.
                </p>
              </section>
            </>
          )}

          {type === 'cookies' && (
            <>
              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>1. What Are Cookies?</h2>
                <p>
                  Cookies and local storage items are small data files saved on your device to remember user preferences, maintain session state, and provide anonymous site metrics.
                </p>
              </section>

              <section>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 10 }}>2. Categories of Cookies We Use</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: 14, borderRadius: 12, border: '1px solid var(--bg-tertiary)' }}>
                    <strong>Essential / Necessary:</strong> Required for site operation, visual state persistence, and theme selection. Cannot be disabled.
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: 14, borderRadius: 12, border: '1px solid var(--bg-tertiary)' }}>
                    <strong>Analytics (GA4):</strong> Helps us measure visitor engagement and Core Web Vital performance anonymously. Enabled only with consent.
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: 14, borderRadius: 12, border: '1px solid var(--bg-tertiary)' }}>
                    <strong>Marketing (Meta Pixel):</strong> Used for conversion tracking and ad audience measurement. Enabled only with consent.
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid var(--bg-tertiary)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.88rem' }}
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
