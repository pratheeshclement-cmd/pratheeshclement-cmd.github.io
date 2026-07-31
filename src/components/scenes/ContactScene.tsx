import React, { useRef } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { MagneticButton } from '../ui/MagneticButton';
import { CinematicProfileShowcase } from '../ui/CinematicProfileShowcase';
import { IDENTITY } from '../../data/identity';
import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';

const ContactScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCinematicSceneTransition(sectionRef, 'blur-clear');

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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

        <div className="grid-2" style={{ alignItems: 'flex-start', marginBottom: 80 }}>

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

          {/* Right Column — Large Cinematic Profile Showcase (Occupies ~45–50% of section) */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CinematicProfileShowcase
              imageSrc="/assets/pratheesh4k2.jpeg"
              altText="Pratheesh Clement — Digital Marketing Specialist & Freelance SEO Consultant Vadalur"
            />

            {/* Direct Inquiries & Messaging Action Box */}
            <GlassCard style={{ padding: '24px 28px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: 8, lineHeight: 1.2 }}>
                Direct Contact with Pratheesh
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                Whether you need a digital marketing strategy, SEO overhaul, web development, or AI automation — let's talk.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <MagneticButton as="a" href={`mailto:${IDENTITY.contact.email}`} style={{ justifyContent: 'center', padding: '12px 20px', fontSize: '0.9rem' } as React.CSSProperties}>
                  Send Email <ArrowRight size={15} />
                </MagneticButton>
                <MagneticButton as="a" href={`https://wa.me/${IDENTITY.contact.whatsapp.replace(/\D/g, '')}`} variant="secondary" style={{ justifyContent: 'center', padding: '12px 20px', fontSize: '0.9rem' } as React.CSSProperties}>
                  WhatsApp Chat
                </MagneticButton>
              </div>

              <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                Available for remote work worldwide · IST (UTC+5:30) timezone
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ── Premium High-End Glassmorphic Footer ──────────────────── */}
        <footer style={{ paddingTop: 48, borderTop: '1px solid var(--bg-tertiary)' }}>
          <GlassCard style={{ padding: '40px 32px', marginBottom: 32 }}>
            <div className="grid-4" style={{ gap: 32, alignItems: 'flex-start' }}>

              {/* Col 1: Brand & Identity */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <img
                    src="/assets/pratheesh4k1.jpeg"
                    alt="Pratheesh Clement — Architect of Digital Ecosystems"
                    title="Pratheesh Clement"
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 10%', border: '2px solid var(--accent-primary)' }}
                  />
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      Pratheesh Clement
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      Architect of Digital Ecosystems
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                  "{IDENTITY.tagline}"
                </p>

                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { href: IDENTITY.social.github, icon: Github, label: 'GitHub' },
                    { href: IDENTITY.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
                    { href: IDENTITY.social.instagram, icon: Instagram, label: 'Instagram' },
                  ].map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-secondary)', textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Col 2: Quick Links */}
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  Explore
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'About Pratheesh', href: '/about/' },
                    { label: 'Featured Projects', href: '/projects/' },
                    { label: 'Services Overview', href: '/services/' },
                    { label: 'Blog & Insights', href: '/blog/' },
                    { label: 'Certifications', href: '/certifications/' },
                    { label: 'Contact', href: '/contact/' },
                  ].map(link => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={e => {
                          if (link.href.startsWith('/')) {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent('navigate', { detail: link.href }));
                          }
                        }}
                        style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Expertise & Discipline Guides */}
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  Expertise
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Technical SEO Strategy', href: '/seo/' },
                    { label: 'Digital Marketing Strategy', href: '/digital-marketing/' },
                    { label: 'UI/UX Design Systems', href: '/ui-ux-design/' },
                    { label: 'Web Development (React)', href: '/web-development/' },
                    { label: 'Google Search Console', href: '/google-search-console/' },
                    { label: 'Meta Ads & Facebook', href: '/meta-ads/' },
                    { label: 'Google Search Ads', href: '/google-ads/' },
                    { label: 'AI Tools & Automation', href: '/ai-automation/' },
                    { label: 'Freelance Services', href: '/freelancing/' },
                  ].map(link => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={e => {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent('navigate', { detail: link.href }));
                        }}
                        style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: Inquiries & Contact */}
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  Direct Inquiries
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                  <strong>Email:</strong> {IDENTITY.contact.email}<br />
                  <strong>Phone:</strong> {IDENTITY.contact.phone}<br />
                  <strong>Location:</strong> Vadalur, Tamil Nadu (IST)
                </div>
                <span className="pill" style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-mint)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  Response within 24 hours
                </span>
              </div>

            </div>
          </GlassCard>

          {/* Bottom Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, padding: '16px 0', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            <div>
              © {new Date().getFullYear()} {IDENTITY.name} (Mariya Pratheesh) · All rights reserved.
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: 'privacy' }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: 'terms' }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                Terms of Service
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0, fontSize: '0.8rem' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                Cookie Preferences
              </button>
            </div>
          </div>
        </footer>

      </div>
    </section>
  );
};

export default ContactScene;
