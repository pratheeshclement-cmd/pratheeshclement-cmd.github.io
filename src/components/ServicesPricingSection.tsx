import React from 'react';
import { Layers, Target, Search, Globe, Layout, Bot, Check, ArrowRight } from 'lucide-react';

export const ServicesPricingSection: React.FC = () => {
  const services = [
    { title: 'Website Development', desc: 'Custom, high-performance React & Next.js applications engineered for 100/100 Core Web Vitals.', icon: Globe, color: 'var(--accent-primary)' },
    { title: 'Technical SEO Audit & Ranking', desc: 'On-page, off-page, sitemap, JSON-LD schema, and keyword search intent optimization.', icon: Search, color: 'var(--accent-secondary)' },
    { title: 'Google & Meta Ads Strategy', desc: 'High-ROAS paid campaign architecture, custom pixel setup, lookalike audiences, and CPL reduction.', icon: Target, color: 'var(--accent-mint)' },
    { title: 'UI/UX Design Systems', desc: 'User-centered interface design, glassmorphism UI components, responsive layout systems, and Figma mockups.', icon: Layout, color: 'var(--accent-tertiary)' },
    { title: 'AI Tools & Workflow Automation', desc: 'Smart AI integrations, automated CRM lead routing, doc generation, and prompt engineering.', icon: Bot, color: 'var(--accent-warm)' }
  ];

  return (
    <section id="services">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="pill" style={{ marginBottom: '16px' }}><Layers size={14} /> Services & Solutions</span>
        <h2 className="split-heading" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
          What I Build & Deliver
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {services.map((srv, idx) => {
          const IconComp = srv.icon;
          return (
            <div key={idx} className="glass" style={{ padding: '32px' }}>
              <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', width: 'fit-content', marginBottom: '20px' }}>
                <IconComp size={28} color={srv.color} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>{srv.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{srv.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
