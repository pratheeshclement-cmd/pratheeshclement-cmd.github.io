import React from 'react';
import { CERTIFICATIONS } from '../../data/pratheeshData';
import { Award } from 'lucide-react';

interface Scene08CertificationsProps {
  progress: number;
}

export const Scene08Certifications: React.FC<Scene08CertificationsProps> = ({ progress }) => {
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
        <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>CREDENTIAL AUTHENTICATION</span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#FFF' }}>
          VERIFIED GOOGLE & TECHNICAL CERTIFICATIONS
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', width: '100%' }}>
        {CERTIFICATIONS.map((cert, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                <Award size={32} color="#10B981" />
              </div>
              <span className="badge badge-emerald">AUTHENTICATED</span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>{cert.title}</h3>
            <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600, marginBottom: '14px' }}>
              {cert.issuer} • Issued {cert.date}
            </div>

            {cert.id && (
              <div style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono', color: '#94A3B8', marginBottom: '16px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '6px' }}>
                Completion ID: {cert.id}
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cert.topics.map((top, tIdx) => (
                <span key={tIdx} style={{ fontSize: '0.75rem', color: '#A855F7', backgroundColor: 'rgba(127, 0, 255, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>
                  {top}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
