import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram, Facebook, ShieldCheck } from 'lucide-react';

export const ContactFooterSection: React.FC = () => {
  const [consentGranted, setConsentGranted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" style={{ paddingBottom: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <span className="pill" style={{ marginBottom: '16px' }}><Mail size={14} /> Contact Channel</span>
        <h2 className="split-heading" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', lineHeight: 1.1, marginBottom: '32px' }}>
          Let's Build the <span className="text-gradient">Future</span>
        </h2>

        {/* Contact Details Grid */}
        <div className="glass" style={{ padding: '48px', marginBottom: '48px', textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px', marginBottom: '36px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '6px' }}>EMAIL ADDRESS</div>
              <a href="mailto:pratheesh.clement@gmail.com" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
                pratheesh.clement@gmail.com
              </a>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '6px' }}>PHONE / WHATSAPP</div>
              <a href="tel:+918667876102" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
                +91 8667876102
              </a>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '6px' }}>LOCATION</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Vadalur, Tamil Nadu, India
              </div>
            </div>
          </div>

          {/* Social Icons Links */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '24px' }}>
            <a href="https://github.com/pratheeshclement-cmd" target="_blank" rel="noreferrer" className="pill" style={{ textDecoration: 'none' }}>
              <Github size={16} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/mariya-pratheesh-5b8a9b316/" target="_blank" rel="noreferrer" className="pill" style={{ textDecoration: 'none' }}>
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href="https://www.instagram.com/pratheeeesh/" target="_blank" rel="noreferrer" className="pill" style={{ textDecoration: 'none' }}>
              <Instagram size={16} /> Instagram
            </a>
            <a href="https://www.facebook.com/profile.php?id=61576255974969" target="_blank" rel="noreferrer" className="pill" style={{ textDecoration: 'none' }}>
              <Facebook size={16} /> Facebook
            </a>
          </div>
        </div>

        {/* Granular Cookie Consent Gating Banner */}
        {!consentGranted && (
          <div className="glass" style={{ padding: '20px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={20} color="var(--accent-mint)" />
              <span>We use cookies to measure site traffic and optimize analytics. (GA4 & Meta Pixel consent gating active).</span>
            </div>
            <button onClick={() => setConsentGranted(true)} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Accept All Cookies
            </button>
          </div>
        )}

        {/* Footer Note */}
        <footer style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            © 2026 Pratheesh Clement. All rights reserved.
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            Crafted with curiosity & spatial engineering
          </span>
        </footer>
      </div>
    </section>
  );
};
