import React from 'react';
import { Award, GraduationCap, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Scene03AboutProps {
  progress: number;
}

export const Scene03About: React.FC<Scene03AboutProps> = ({ progress }) => {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>EXECUTIVE BACKGROUND</span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#FFF' }}>
          QUALIFICATIONS & INDUSTRIAL MATRIX
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        width: '100%'
      }}>
        {/* Card 1: BCA Degree */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(0, 242, 254, 0.15)' }}>
              <GraduationCap size={28} color="#00F2FE" />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>BCA DEGREE (2024)</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Bachelor of Computer Application</div>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6' }}>
            Graduated in 2024 from <strong>Pope John Paul II College of Education, Puducherry</strong>. Specialized in computer programming, web technologies, SQL databases, software engineering, and system design.
          </p>
        </div>

        {/* Card 2: Google Certification */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(127, 0, 255, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(127, 0, 255, 0.15)' }}>
              <Award size={28} color="#A855F7" />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>GOOGLE DIGITAL GARAGE</div>
              <div style={{ fontSize: '0.85rem', color: '#A855F7' }}>Completion ID: #453421024</div>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6' }}>
            Issued March 2026. Certified in <strong>Fundamentals of Digital Marketing</strong> covering Technical SEO, Google Search Console, SEM (Google Ads), Google Analytics, Content Marketing, and SMM.
          </p>
        </div>

        {/* Card 3: Nexteer Automotive Work Experience */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)' }}>
              <Building2 size={28} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>NEXTEER AUTOMOTIVE</div>
              <div style={{ fontSize: '0.85rem', color: '#10B981' }}>Store Associate (Mar 2019 – Mar 2020)</div>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6' }}>
            Managed tier-1 automotive manufacturing supply chain inventory operations utilizing <strong>QAD ERP Enterprise Software</strong> with 100% material audit accuracy and strict quality control.
          </p>
        </div>
      </div>
    </section>
  );
};
