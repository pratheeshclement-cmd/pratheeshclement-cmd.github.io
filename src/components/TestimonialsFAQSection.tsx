import React from 'react';
import { Heart, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';

export const TestimonialsFAQSection: React.FC = () => {
  const coreValues = [
    '1. Continuous Learning',
    '2. User-Centered Thinking',
    '3. Innovation',
    '4. Quality',
    '5. Integrity',
    '6. Collaboration',
    '7. Excellence'
  ];

  return (
    <section id="principles">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="pill" style={{ marginBottom: '16px' }}><Heart size={14} /> Work Ethics & Culture</span>
        <h2 className="split-heading" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
          Core Operating Principles
        </h2>
      </div>

      {/* Floating Core Values Pills Cloud */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '48px', maxWidth: '840px', margin: '0 auto 48px' }}>
        {coreValues.map((val, idx) => (
          <span key={idx} className="pill" style={{ fontSize: '1rem', padding: '10px 22px' }}>
            {val}
          </span>
        ))}
      </div>

      {/* Testimonials Holder & FAQ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Testimonials Container */}
        <div className="glass" style={{ padding: '36px', border: '1px dashed var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <MessageSquare size={24} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Client Testimonials</h3>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Verified client testimonials and project reviews are currently being compiled and authenticated. Real client quotes will be displayed here soon.
          </p>
        </div>

        {/* FAQ Accordion Component */}
        <div className="glass" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <HelpCircle size={24} color="var(--accent-tertiary)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Frequently Asked Questions</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                What services do you offer?
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Digital Marketing, Technical SEO, Full-Stack Web Development, UI/UX Design, and AI Workflow Automations.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Are you open to remote or freelance work?
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Yes! I am open to full-time roles, freelance projects, and remote/hybrid consulting engagements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
