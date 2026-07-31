import React, { useRef } from 'react';
import { Heart } from 'lucide-react';
import { SplitText } from '../ui/SplitText';
import { GlassCard } from '../ui/GlassCard';
import { FAQAccordion } from '../ui/FAQAccordion';
import { ClientReviewForm } from '../ui/ClientReviewForm';
import { IDENTITY } from '../../data/identity';
import { FAQ } from '../../data/faq';
import { useCinematicSceneTransition } from '../../hooks/useScrollTimeline';

const TestimonialsScene: React.FC<{ id: string }> = ({ id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useCinematicSceneTransition(sectionRef, 'split-reveal');

  return (
    <section id={id} ref={sectionRef} className="scene" aria-label="Testimonials and FAQ section">
      <div className="scene-inner">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-label">
            <Heart size={13} />
            Culture & FAQ
          </span>
          <SplitText
            text="Core Principles & Client Feedback"
            tag="h2"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
          />
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start', gap: 48 }}>

          {/* Left — Core values + Client Review Form */}
          <div>
            {/* Core values */}
            <GlassCard style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Heart size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', margin: 0 }}>Core Principles</h3>
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

            {/* Interactive Client Review Submission Form */}
            <ClientReviewForm />
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
