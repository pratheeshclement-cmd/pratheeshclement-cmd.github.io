import React from 'react';
import { PERSONAL_INFO } from '../../data/pratheeshData';
import { sound } from '../../utils/soundEffects';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Award, Code2, Search, Bot } from 'lucide-react';

interface WelcomeWorkspaceProps {
  onNavigate: (workspaceId: any) => void;
}

export const WelcomeWorkspace: React.FC<WelcomeWorkspaceProps> = ({ onNavigate }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Spotlight */}
      <div className="glass-panel" style={{
        borderRadius: '28px',
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(0, 242, 254, 0.25)'
      }}>
        {/* Subtle Background Glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Left Column: Text & Hero Content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span className="badge badge-cyan">PORTFOLIO OS X</span>
            <span className="badge badge-violet">MASTER SPEC v1.0</span>
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            lineHeight: 1.1,
            fontFamily: 'Outfit, sans-serif',
            marginBottom: '16px'
          }}>
            PRATHEESH <span className="text-gradient">CLEMENT</span>
          </h1>

          <h3 style={{
            fontSize: '1.25rem',
            color: '#00F2FE',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            {PERSONAL_INFO.title}
          </h3>

          <p style={{
            fontSize: '1rem',
            color: '#94A3B8',
            lineHeight: '1.7',
            marginBottom: '28px'
          }}>
            {PERSONAL_INFO.summary}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('ai-concierge');
              }}
              className="btn-primary"
            >
              <Bot size={18} /> Launch AI Concierge
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('project-vault');
              }}
              className="btn-secondary"
            >
              <Code2 size={18} /> Explore Projects <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Spatial Profile Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="glass-card" style={{
            padding: '16px',
            borderRadius: '24px',
            maxWidth: '360px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              height: '320px',
              borderRadius: '18px',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: '16px'
            }}>
              <img
                src="/asset/pratheesh4k1.jpeg"
                alt="Pratheesh Clement"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11, 14, 20, 0.9) 0%, transparent 60%)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span className="badge badge-emerald">Available for Roles</span>
                <span style={{ fontSize: '0.75rem', color: '#FFF', fontFamily: 'JetBrains Mono' }}>Vadalur, TN</span>
              </div>
            </div>

            <div style={{ padding: '0 8px' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#FFF' }}>MARIYA PRATHEESH C</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                BCA (2024) • Google Digital Marketing Cert (ID: 453421024)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Navigation Grid */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
          PRIMARY OS WORKSPACES
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          <div
            onClick={() => { sound.playClick(); onNavigate('frontend-lab'); }}
            className="glass-card"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)' }}>
                <Code2 size={24} color="#3B82F6" />
              </div>
              <span className="badge badge-violet">React 19</span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
              Frontend Engineering Lab
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>
              React 19, TypeScript, state flow visualizers, and live component playground.
            </p>
          </div>

          <div
            onClick={() => { sound.playClick(); onNavigate('seo-center'); }}
            className="glass-card"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)' }}>
                <Search size={24} color="#F59E0B" />
              </div>
              <span className="badge badge-cyan">Technical SEO</span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
              SEO Intelligence Suite
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>
              SERP preview simulator, schema markup validator, and keyword rank tracker.
            </p>
          </div>

          <div
            onClick={() => { sound.playClick(); onNavigate('digital-marketing'); }}
            className="glass-card"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)' }}>
                <Award size={24} color="#EC4899" />
              </div>
              <span className="badge badge-emerald">Google Cert</span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
              Digital Marketing Command
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>
              Google Skillshop certification deep-dive, SEM/SMM analytics, and campaign ROI funnel.
            </p>
          </div>

          <div
            onClick={() => { sound.playClick(); onNavigate('performance-center'); }}
            className="glass-card"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)' }}>
                <Zap size={24} color="#10B981" />
              </div>
              <span className="badge badge-emerald">100/100</span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
              Performance Center
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }}>
              Core Web Vitals diagnostic engine, Lighthouse score suite, and bundle audit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
