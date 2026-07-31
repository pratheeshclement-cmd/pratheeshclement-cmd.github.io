import React from 'react';
import { navigateTo } from '../../router/useRouter';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  /** Show "back to portfolio" button */
  showBack?: boolean;
}

/**
 * Wrapper for all content pages (About, Services, Blog, etc.)
 * Provides consistent padding, max-width, and the OS design language
 * while allowing long-form readable content.
 */
export const PageLayout: React.FC<PageLayoutProps> = ({ children, showBack = true }) => {
  return (
    <main
      id="page-content"
      role="main"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(80px, 10vw, 120px)',
        paddingBottom: 80,
        paddingLeft: 'clamp(16px, 5vw, 40px)',
        paddingRight: 'clamp(16px, 5vw, 40px)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        {showBack && (
          <button
            onClick={() => navigateTo('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 18px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              marginBottom: 28,
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--accent-primary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
            }}
          >
            <ArrowLeft size={14} />
            Back to Portfolio
          </button>
        )}

        {children}
      </div>
    </main>
  );
};

/** Prose-width wrapper for long-form reading content (blog articles, SEO pages) */
export const ProseContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      maxWidth: 780,
      margin: '0 auto',
    }}
  >
    {children}
  </div>
);

/** Section heading for content pages — consistent h2 style */
export const ContentH2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    style={{
      fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
      fontFamily: 'var(--font-display)',
      color: 'var(--text-primary)',
      fontWeight: 700,
      lineHeight: 1.25,
      marginTop: 48,
      marginBottom: 16,
    }}
  >
    {children}
  </h2>
);

/** Section heading h3 for content pages */
export const ContentH3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3
    style={{
      fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
      fontFamily: 'var(--font-display)',
      color: 'var(--text-primary)',
      fontWeight: 600,
      lineHeight: 1.3,
      marginTop: 32,
      marginBottom: 12,
    }}
  >
    {children}
  </h3>
);

/** Body paragraph for content pages */
export const ContentP: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <p
    style={{
      fontSize: '1rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.8,
      marginBottom: 20,
      ...style,
    }}
  >
    {children}
  </p>
);

/** Glass info card for highlighted content */
export const InfoCard: React.FC<{ children: React.ReactNode; accentColor?: string }> = ({
  children,
  accentColor = 'var(--accent-primary)',
}) => (
  <div
    style={{
      background: 'var(--glass-bg)',
      border: `1px solid var(--glass-border)`,
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: 'var(--radius-sm)',
      backdropFilter: 'blur(12px)',
      padding: '20px 24px',
      marginBottom: 24,
    }}
  >
    {children}
  </div>
);

/** Grid of skill/tool pills */
export const SkillGrid: React.FC<{ items: string[]; accentColor?: string }> = ({
  items,
  accentColor,
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 24 }}>
    {items.map(item => (
      <span
        key={item}
        style={{
          padding: '5px 14px',
          borderRadius: 9999,
          fontSize: '0.82rem',
          fontWeight: 500,
          background: accentColor ? `${accentColor}15` : 'var(--bg-secondary)',
          border: `1px solid ${accentColor ? `${accentColor}30` : 'var(--bg-tertiary)'}`,
          color: accentColor || 'var(--text-secondary)',
        }}
      >
        {item}
      </span>
    ))}
  </div>
);

/** Call-to-action section at bottom of content pages */
export const PageCTA: React.FC<{
  heading: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}> = ({ heading, description, primaryLabel, primaryHref, secondaryLabel, secondaryHref }) => (
  <div
    style={{
      marginTop: 64,
      padding: '40px 36px',
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      backdropFilter: 'blur(16px)',
      textAlign: 'center',
    }}
  >
    <h2
      style={{
        fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
        fontFamily: 'var(--font-display)',
        color: 'var(--text-primary)',
        marginBottom: 12,
      }}
    >
      {heading}
    </h2>
    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>
      {description}
    </p>
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
      <a
        href={primaryHref}
        onClick={e => {
          e.preventDefault();
          if (primaryHref.startsWith('/')) navigateTo(primaryHref);
          else window.open(primaryHref, '_blank');
        }}
        className="btn-primary"
        style={{ textDecoration: 'none' }}
      >
        {primaryLabel}
      </a>
      {secondaryLabel && secondaryHref && (
        <a
          href={secondaryHref}
          onClick={e => {
            e.preventDefault();
            if (secondaryHref.startsWith('/')) navigateTo(secondaryHref);
            else window.open(secondaryHref, '_blank');
          }}
          className="btn-secondary"
          style={{ textDecoration: 'none' }}
        >
          {secondaryLabel}
        </a>
      )}
    </div>
  </div>
);
