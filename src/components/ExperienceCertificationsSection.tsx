import React from 'react';
import { Briefcase, Building, Package, Award, GraduationCap, CheckCircle2 } from 'lucide-react';

export const ExperienceCertificationsSection: React.FC = () => {
  return (
    <section id="experience">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span className="badge pill" style={{ marginBottom: '16px' }}><Briefcase size={14} /> Journey & Credentials</span>
        <h2 className="split-heading" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
          Career Story & Credentials
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Experience Timeline Card */}
        <div className="glass" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Building size={24} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Career Roles</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: '16px' }}>
              <span className="pill" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>CURRENT ROLE</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>JBHL Pvt Ltd</h4>
              <div style={{ fontSize: '0.88rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Digital Marketer</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.6 }}>
                Leading digital marketing initiatives, technical SEO strategy, online brand growth, Meta ad funnels, and conversion optimization campaigns.
              </p>
            </div>

            <div style={{ borderLeft: '2px solid var(--accent-mint)', paddingLeft: '16px' }}>
              <span className="pill" style={{ fontSize: '0.75rem', marginBottom: '6px', color: 'var(--accent-mint)', borderColor: 'var(--accent-mint)' }}>INDUSTRIAL EXPERIENCE</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Nexteer Automotive India</h4>
              <div style={{ fontSize: '0.88rem', color: 'var(--accent-mint)', fontWeight: 600 }}>Store / Production Associate (Chennai)</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.6 }}>
                Handled warehouse layouts, tracked raw materials inventory, managed parts supplies, and collaborated with floor supervisors to prevent production line halts.
              </p>
            </div>
          </div>
        </div>

        {/* Education & Verified Google Certification Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Google Skillshop Cert Card */}
          <div className="glass" style={{ padding: '32px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.12)' }}>
                <Award size={28} color="var(--accent-mint)" />
              </div>
              <span className="pill" style={{ color: 'var(--accent-mint)', borderColor: 'var(--accent-mint)', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                <CheckCircle2 size={14} /> VERIFIED CREDENTIAL
              </span>
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Google Skillshop</h4>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Fundamentals of Digital Marketing
            </div>
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', backgroundColor: 'rgba(0,0,0,0.04)', padding: '6px 12px', borderRadius: '8px', display: 'inline-block', marginBottom: '12px' }}>
              Completion ID: 453421024
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Accredited by IAB Europe & The Open University. Covers search engine ranking basics, content strategies, analytics tracks, email/mobile outreach, and display network integrations.
            </p>
          </div>

          {/* Education Card */}
          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <GraduationCap size={24} color="var(--accent-primary)" />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Bachelor of Computer Applications</h4>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '8px' }}>BCA Degree</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Foundational computer science degree covering software engineering, database architecture, algorithms, web development, and system design.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
