import React from 'react';
import { User, Compass, Target, Award, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
        {/* Left Column: Medium Bio */}
        <div>
          <span className="pill" style={{ marginBottom: '16px' }}><User size={14} /> About Pratheesh</span>
          <h2 className="split-heading" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '24px' }}>
            The Multidisciplinary Story
          </h2>
          
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
            Pratheesh Clement is a multidisciplinary digital professional specializing in Digital Marketing, UI/UX Design, SEO, Web Development, Branding, and AI-powered solutions. His work focuses on creating digital ecosystems that combine outstanding user experiences with measurable business growth.
          </p>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
            With expertise spanning website design, search engine optimization, Meta advertising, conversion optimization, performance optimization, and creative branding, he approaches every project from both a strategic and technical perspective. Rather than treating design, marketing, and technology as separate disciplines, he integrates them into a unified system that drives engagement, visibility, and conversions.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span className="pill" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--accent-mint)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              Open to Work | Remote | Hybrid
            </span>
          </div>
        </div>

        {/* Right Column: 3D Tilted Glass Card */}
        <div className="glass" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(59, 130, 246, 0.12)' }}>
              <Compass size={28} color="var(--accent-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Career Journey Origins</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Vadalur, Tamil Nadu</span>
            </div>
          </div>

          <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '24px' }}>
            "My journey into the digital world began with curiosity rather than a predefined career path. I was fascinated by how websites, branding, marketing, and technology could influence the way people interact with businesses. That curiosity evolved into a passion for learning UI/UX design, web development, search engine optimization, digital marketing, and artificial intelligence."
          </p>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>JBHL Pvt Ltd</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Digital Marketer</span>
          </div>
        </div>
      </div>
    </section>
  );
};
