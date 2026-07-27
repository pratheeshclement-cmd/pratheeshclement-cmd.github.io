import React, { useRef } from 'react';
import { MessageSquare, Heart } from 'lucide-react';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { FAQAccordion } from '../ui/FAQAccordion';
import { IDENTITY } from '../../data/identity';
import { FAQ } from '../../data/faq';
import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';

const TestimonialsScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCinematicSceneTransition(sectionRef);

  return (
    <section id={id} ref={sectionRef} className="scene" aria-label="Testimonials and FAQ section">
      <div className="scene-inner">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-label">
            <Heart size={13} />
            Culture & FAQ
          </span>
          <SplitText
            text="Core Principles & FAQ"
            tag="h2"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
          />
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start', gap: 48 }}>

          {/* Left — Core values + testimonials placeholder */}
          <div>
            {/* Core values */}
            <GlassCard style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Heart size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>Core Principles</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {IDENTITY.coreValues.map((v, i) => (
                  <span
                    key={v}
                    className="pill"
                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                  >
                    {i + 1}. {v}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Testimonials placeholder — per GEMINI.md policy */}
            <GlassCard style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <MessageSquare size={20} color="var(--accent-secondary)" />
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>Client Testimonials</h3>
              </div>
              <div style={{
                padding: '32px 24px', textAlign: 'center',
                border: '2px dashed var(--bg-tertiary)', borderRadius: 16,
              }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                  Real client testimonials will be added upon verification.<br />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Coming soon.</span>
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Right — FAQ Accordion */}
          <div>
            <GlassCard style={{ padding: 32 }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: 20 }}>
                Frequently Asked Questions
              </h3>
              <FAQAccordion items={FAQ} />
            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialsScene;
