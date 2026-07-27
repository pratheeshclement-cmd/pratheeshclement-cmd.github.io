import React, { useRef } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { MagneticButton } from '../ui/MagneticButton';
import { IDENTITY } from '../../data/identity';
import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';

const ContactScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCinematicSceneTransition(sectionRef, 'blur-clear');

  return (
    <section id={id} ref={sectionRef} className="scene" aria-label="Contact section">
      <div className="scene-inner">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SplitText
            text="Let's Build the Future"
            tag="h2"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', lineHeight: 1.1, marginBottom: 20 }}
          />
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Open to new projects, collaborations, and conversations. Send me a message and I will respond within 24 hours.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start' }}>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: Mail, label: 'Email', value: IDENTITY.contact.email, href: `mailto:${IDENTITY.contact.email}` },
              { icon: Phone, label: 'Phone / WhatsApp', value: IDENTITY.contact.phone, href: `tel:${IDENTITY.contact.phone}` },
              { icon: MapPin, label: 'Location', value: IDENTITY.location.display, href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <GlassCard key={label} style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
                    {href ? (
                      <a href={href} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                      >{value}</a>
                    ) : (
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}

            {/* Social links */}
            <GlassCard style={{ padding: 24 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Social Links</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { href: IDENTITY.social.github, icon: Github, label: 'GitHub' },
                  { href: IDENTITY.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
                  { href: IDENTITY.social.instagram, icon: Instagram, label: 'Instagram' },
                  { href: IDENTITY.social.facebook, icon: Facebook, label: 'Facebook' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} profile`}
                    className="pill"
                    style={{ textDecoration: 'none', gap: 6 }}
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* CTA glass card with Pratheesh Photo */}
          <GlassCard tilt style={{ padding: 36, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{
                position: 'relative',
                width: 96,
                height: 96,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid var(--accent-primary)',
                boxShadow: '0 0 25px rgba(59, 130, 246, 0.35)',
              }}>
                <img
                  src="/assets/pratheesh4k2.jpeg"
                  alt="Pratheesh Clement"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', marginBottom: 12, lineHeight: 1.2 }}>
              Direct Contact with Pratheesh
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
              Whether you need a digital marketing strategy, SEO overhaul, web development, or AI automation — let's talk.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <MagneticButton as="a" href={`mailto:${IDENTITY.contact.email}`} style={{ justifyContent: 'center' } as React.CSSProperties}>
                Send Email <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton as="a" href={`https://wa.me/${IDENTITY.contact.whatsapp.replace(/\D/g, '')}`} variant="secondary" style={{ justifyContent: 'center' } as React.CSSProperties}>
                WhatsApp Chat
              </MagneticButton>
            </div>

            <p style={{ marginTop: 28, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Available for remote work worldwide · IST timezone
            </p>
          </GlassCard>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 80, paddingTop: 32, borderTop: '1px solid var(--bg-tertiary)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} {IDENTITY.name} · Built with React, GSAP & Three.js · Deployed on GitHub Pages
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            <em>"{IDENTITY.tagline}"</em>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactScene;
