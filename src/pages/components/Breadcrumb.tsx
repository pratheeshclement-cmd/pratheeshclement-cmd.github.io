import React from 'react';
import { navigateTo } from '../../router/useRouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Visible accessible breadcrumb — works with StructuredData BreadcrumbList schema.
 * First item is always "Home".
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.82rem',
        color: 'var(--text-tertiary)',
        marginBottom: 32,
        flexWrap: 'wrap',
      }}
    >
      <a
        href="/"
        onClick={e => { e.preventDefault(); navigateTo('/'); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: 'var(--text-tertiary)',
          textDecoration: 'none',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
      >
        <Home size={13} />
        Home
      </a>

      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={12} aria-hidden="true" />
          {item.href && i < items.length - 1 ? (
            <a
              href={item.href}
              onClick={e => { e.preventDefault(); if (item.href) navigateTo(item.href); }}
              style={{
                color: 'var(--text-tertiary)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
            >
              {item.label}
            </a>
          ) : (
            <span
              style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
              aria-current="page"
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
