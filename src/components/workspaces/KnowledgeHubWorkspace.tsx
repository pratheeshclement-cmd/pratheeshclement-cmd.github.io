import React, { useState } from 'react';
import { EDUCATION, CERTIFICATIONS, TECHNICAL_ARTICLES } from '../../data/pratheeshData';
import { sound } from '../../utils/soundEffects';
import { BookOpen, GraduationCap, Award, FileText, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

export const KnowledgeHubWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'education' | 'certifications' | 'articles'>('education');
  const [selectedArticle, setSelectedArticle] = useState(TECHNICAL_ARTICLES[0]);

  const hdcaCert = CERTIFICATIONS.find(c => c.title.includes('HDCA')) || CERTIFICATIONS[1];
  const googleCert = CERTIFICATIONS.find(c => c.id === '453421024') || CERTIFICATIONS[0];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <BookOpen size={28} color="#06B6D4" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>KNOWLEDGE HUB & TECHNICAL ARTICLES</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Academic credentials, verified certifications, research notes, and engineering articles
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { sound.playClick(); setActiveTab('education'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'education' ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'education' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'education' ? '#00F2FE' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Academic Qualifications (BCA Degree)
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('certifications'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'certifications' ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'certifications' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'certifications' ? '#10B981' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Verified Certifications
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('articles'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'articles' ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'articles' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'articles' ? '#A855F7' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Technical Articles & Notes
        </button>
      </div>

      {/* Tab 1: Education */}
      {activeTab === 'education' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {EDUCATION.map((edu, idx) => (
            <div key={idx} className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.15)' }}>
                  <GraduationCap size={24} color="#00F2FE" />
                </div>
                <div>
                  <span className="badge badge-cyan">{edu.year}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit', marginTop: '2px' }}>
                    {edu.degree}
                  </h3>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#00F2FE', fontWeight: 600, marginBottom: '8px' }}>
                {edu.institution} {edu.location ? `• ${edu.location}` : ''}
              </div>

              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.6' }}>
                {edu.details}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Certifications */}
      {activeTab === 'certifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Award size={28} color="#10B981" />
              <div>
                <span className="badge badge-emerald">GOOGLE CERTIFICATE</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit', marginTop: '2px' }}>
                  {googleCert.title}
                </h3>
              </div>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#10B981', fontWeight: 600, marginBottom: '8px' }}>
              {googleCert.issuer} • ID: {googleCert.id}
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: '1.6' }}>
              SEO, SEM, Social Media Marketing, Content Strategy, Google Analytics, & Email Marketing.
            </p>
          </div>

          <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Award size={28} color="#A855F7" />
              <div>
                <span className="badge badge-violet">GRADE A (EXCELLENT)</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit', marginTop: '2px' }}>
                  {hdcaCert.title}
                </h3>
              </div>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#A855F7', fontWeight: 600, marginBottom: '8px' }}>
              {hdcaCert.issuer} • {hdcaCert.date}
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: '1.6' }}>
              SQL Server, Visual Basic, HTML/ASP/XML, Tally ERP 9, & Hardware.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Technical Articles & Dev Notes */}
      {activeTab === 'articles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {TECHNICAL_ARTICLES.map((art) => {
              const isSelected = art.id === selectedArticle.id;
              return (
                <div
                  key={art.id}
                  onClick={() => { sound.playClick(); setSelectedArticle(art); }}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'rgba(18, 26, 42, 0.6)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="badge badge-violet">{art.category}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{art.readTime}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>{art.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: '1.5' }}>{art.summary}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-panel" style={{ borderRadius: '24px', padding: '32px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>{selectedArticle.category}</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit', marginBottom: '12px' }}>
              {selectedArticle.title}
            </h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: '#64748B', marginBottom: '20px' }}>
              <span>Published: {selectedArticle.date}</span>
              <span>Reading Time: {selectedArticle.readTime}</span>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: '1.8' }}>
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
