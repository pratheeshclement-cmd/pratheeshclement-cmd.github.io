import React, { useState } from 'react';
import { CERTIFICATIONS } from '../../data/pratheeshData';
import { sound } from '../../utils/soundEffects';
import { TrendingUp, Award, Users, Target, BarChart2, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const DigitalMarketingWorkspace: React.FC = () => {
  const googleCert = CERTIFICATIONS.find(c => c.id === '453421024') || CERTIFICATIONS[0];
  const [activeTab, setActiveTab] = useState<'cert' | 'analytics' | 'funnel'>('cert');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
            <TrendingUp size={28} color="#EC4899" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>DIGITAL MARKETING COMMAND CENTER</h2>
              <span className="badge badge-emerald">Google Certified</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Google Digital Garage credentials, Google Analytics insights, and SEM/SMM growth strategy
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { sound.playClick(); setActiveTab('cert'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'cert' ? '1px solid #EC4899' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'cert' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'cert' ? '#EC4899' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Google Certification Verification
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('analytics'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'analytics' ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'analytics' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'analytics' ? '#00F2FE' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Google Analytics Real-Time Simulator
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('funnel'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'funnel' ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'funnel' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'funnel' ? '#10B981' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Growth & SEM Strategy
        </button>
      </div>

      {/* Tab 1: Google Certification Deep-Dive */}
      {activeTab === 'cert' && (
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #10B981 0%, #00F2FE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
              flexShrink: 0
            }}>
              <Award size={64} color="#FFF" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit' }}>
                  Fundamentals of Digital Marketing
                </h3>
                <span className="badge badge-emerald">VERIFIED CERTIFICATE</span>
              </div>

              <div style={{ fontSize: '0.95rem', color: '#00F2FE', fontWeight: 600, marginBottom: '12px' }}>
                Issued by Google Digital Garage (Google Skillshop) • Completed 14 March 2026
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'JetBrains Mono', marginBottom: '20px' }}>
                <span>Completion ID: <strong>453421024</strong></span>
                <span>Authenticity: <strong>100% Validated</strong></span>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>COVERS 7 CORE DOMAINS:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {googleCert.topics.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                    <CheckCircle2 size={16} color="#10B981" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Analytics Simulator */}
      {activeTab === 'analytics' && (
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} color="#00F2FE" /> GOOGLE ANALYTICS REAL-TIME DASHBOARD
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>ACTIVE USERS RIGHT NOW</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00F2FE', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>42</div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>AVG ENGAGEMENT TIME</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>2m 45s</div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>CONVERSION RATE</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EC4899', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>8.4%</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF', marginBottom: '12px' }}>TOP TRAFFIC ACQUISITION CHANNELS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94A3B8' }}>Organic Search (Google SEO)</span>
                <span style={{ color: '#00F2FE', fontWeight: 700 }}>58%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94A3B8' }}>Direct (Portfolio OS X link)</span>
                <span style={{ color: '#A855F7', fontWeight: 700 }}>24%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94A3B8' }}>Social & Referral (LinkedIn/GitHub)</span>
                <span style={{ color: '#EC4899', fontWeight: 700 }}>18%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Funnel & SEM */}
      {activeTab === 'funnel' && (
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '20px' }}>END-TO-END DIGITAL MARKETING FUNNEL</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <div className="badge badge-cyan" style={{ marginBottom: '10px' }}>STAGE 1: AWARENESS</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>SEO & SEM Acquisition</h4>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Targeted Google Search campaigns & organic keyword optimization.</p>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div className="badge badge-violet" style={{ marginBottom: '10px' }}>STAGE 2: ENGAGEMENT</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>Interactive UX</h4>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Spatial Portfolio OS X environment keeping recruiters engaged for 2+ minutes.</p>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div className="badge badge-emerald" style={{ marginBottom: '10px' }}>STAGE 3: CONVERSION</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>Recruiter Inquiries</h4>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Instant interview scheduling, resume download, and direct email transmission.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
