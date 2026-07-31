import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentP, InfoCard, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { IDENTITY } from '../data/identity';

export const ContactPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.contact);

  const schema = webPageSchema({
    url: '/contact/',
    name: 'Contact Pratheesh Clement',
    description: PAGE_SEO.contact.description,
    breadcrumbs: [{ name: 'Contact', item: '/contact/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="contact-page-schema" />
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <ProseContainer>
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Mail size={14} color="var(--accent-primary)" />
            Direct Communication & Collaboration
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Contact Pratheesh Clement
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Open to digital marketing strategy consulting, technical SEO audits, Meta & Google Ads campaigns, React web app development, and AI automation.
          </p>
        </div>

        <ContentH2>Get in Touch Directly</ContentH2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24, marginBottom: 48 }}>
          <InfoCard accentColor="var(--accent-primary)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Direct Email
                </div>
                <a
                  href={`mailto:${IDENTITY.contact.email}`}
                  style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  {IDENTITY.contact.email}
                </a>
              </div>
            </div>
          </InfoCard>

          <InfoCard accentColor="var(--accent-mint)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={20} color="var(--accent-mint)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Phone / WhatsApp
                </div>
                <a
                  href={`tel:${IDENTITY.contact.phone}`}
                  style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  {IDENTITY.contact.phone}
                </a>
              </div>
            </div>
          </InfoCard>

          <InfoCard accentColor="var(--accent-tertiary)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={20} color="var(--accent-tertiary)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Base Location & Timezone
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {IDENTITY.location.display} (IST / UTC+5:30)
                </span>
              </div>
            </div>
          </InfoCard>
        </div>

        <ContentH2>Verified Social Profiles</ContentH2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          {[
            { label: 'GitHub Profile', href: IDENTITY.social.github, icon: Github },
            { label: 'LinkedIn Profile', href: IDENTITY.social.linkedin, icon: Linkedin },
            { label: 'Instagram Profile', href: IDENTITY.social.instagram, icon: Instagram },
            { label: 'Facebook Page', href: IDENTITY.social.facebook, icon: Facebook },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none', gap: 8, fontSize: '0.9rem' }}
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </div>

        <PageCTA
          heading="Response Time Commitment"
          description="All emails and messages are answered within 24 hours. Available for remote work worldwide."
          primaryLabel="Send Email"
          primaryHref={`mailto:${IDENTITY.contact.email}`}
          secondaryLabel="WhatsApp Message"
          secondaryHref={`https://wa.me/${IDENTITY.contact.whatsapp.replace(/\D/g, '')}`}
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default ContactPage;
