import React from 'react';
import { WORK_EXPERIENCE, EDUCATION } from '../../data/pratheeshData';
import { Building2, GraduationCap } from 'lucide-react';

interface Scene06TimelineProps {
  progress: number;
}

export const Scene06Timeline: React.FC<Scene06TimelineProps> = ({ progress }) => {
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
        <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>CHRONOLOGICAL TIMELINE</span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#FFF' }}>
          CAREER & EDUCATIONAL JOURNEY
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', width: '100%' }}>
        {/* Work Experience Timeline Card */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Building2 size={24} color="#10B981" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>INDUSTRIAL WORK EXPERIENCE</h3>
          </div>

          {WORK_EXPERIENCE.map((exp, idx) => (
            <div key={idx} style={{ borderLeft: '2px solid #10B981', paddingLeft: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{exp.role}</div>
              <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>{exp.company} • {exp.period}</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '8px', lineHeight: '1.5' }}>
                {exp.highlights.join(' ')}
              </div>
            </div>
          ))}
        </div>

        {/* Education Timeline Card */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <GraduationCap size={24} color="#00F2FE" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>ACADEMIC QUALIFICATIONS</h3>
          </div>

          {EDUCATION.map((edu, idx) => (
            <div key={idx} style={{ borderLeft: '2px solid #00F2FE', paddingLeft: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{edu.degree}</div>
              <div style={{ fontSize: '0.85rem', color: '#00F2FE', fontWeight: 600 }}>{edu.institution} • {edu.year}</div>
              {edu.details && (
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '8px', lineHeight: '1.5' }}>{edu.details}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
