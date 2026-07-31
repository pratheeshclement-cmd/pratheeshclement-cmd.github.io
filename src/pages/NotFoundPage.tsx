import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { PageLayout, ProseContainer, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { AlertTriangle, Home, FolderKanban, BookOpen, Mail } from 'lucide-react';
import { navigateTo } from '../router/useRouter';

export const NotFoundPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.notFound);

  return (
    <PageLayout showBack={false}>
      <Breadcrumb items={[{ label: '404 Page Not Found' }]} />

      <ProseContainer>
        <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <AlertTriangle size={36} color="var(--accent-warm)" />
          </div>

          <span className="pill" style={{ marginBottom: 16, borderColor: 'var(--accent-warm)', color: 'var(--accent-warm)' }}>
            Error 404 · Signal Lost
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Page Not Found
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
            The page or route you are looking for does not exist or has been moved. Explore main sections below to get back on track.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, textAlign: 'left', marginBottom: 40 }}>
            {[
              { label: 'Pratheesh OS Homepage', desc: 'Return to the main cinematic experience', href: '/', icon: Home },
              { label: 'Projects & Case Studies', desc: 'Explore technical SEO & web case studies', href: '/projects/', icon: FolderKanban },
              { label: 'Blog & Articles', desc: 'Read educational marketing & dev guides', href: '/blog/', icon: BookOpen },
              { label: 'Contact Pratheesh', desc: 'Get in touch for direct inquiries', href: '/contact/', icon: Mail },
            ].map(item => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.href}
                  onClick={() => navigateTo(item.href)}
                  style={{
                    padding: 20,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <IconComp size={18} color="var(--accent-primary)" />
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {item.label}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ProseContainer>
    </PageLayout>
  );
};

export default NotFoundPage;
