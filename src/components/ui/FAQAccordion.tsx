import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../../types';

interface FAQAccordionProps {
  items: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [open, setOpen] = useState<string | null>(null);
  const answerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = (id: string) => {
    const prev = open;
    setOpen(prev === id ? null : id);

    // Animate closed one
    if (prev && answerRefs.current[prev]) {
      gsap.to(answerRefs.current[prev], { height: 0, duration: 0.3, ease: 'power2.inOut' });
    }

    // Animate new one open
    if (id !== prev && answerRefs.current[id]) {
      const el = answerRefs.current[id]!;
      gsap.set(el, { height: 'auto' });
      const h = el.offsetHeight;
      gsap.fromTo(el, { height: 0 }, { height: h, duration: 0.35, ease: 'power2.out' });
    }
  };

  return (
    <div>
      {items.map(item => (
        <div key={item.id} className="faq-item">
          <button
            className="faq-question"
            onClick={() => toggle(item.id)}
            aria-expanded={open === item.id}
            aria-controls={`faq-answer-${item.id}`}
            id={`faq-btn-${item.id}`}
          >
            {item.question}
            <ChevronDown
              size={18}
              style={{
                flexShrink: 0,
                transition: 'transform 0.3s ease',
                transform: open === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                color: open === item.id ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              }}
            />
          </button>
          <div
            id={`faq-answer-${item.id}`}
            role="region"
            aria-labelledby={`faq-btn-${item.id}`}
            className="faq-answer"
            ref={el => { answerRefs.current[item.id] = el; }}
            style={{ paddingBottom: open === item.id ? 16 : 0 }}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
};
