import React from 'react';
import { PERSONAL_INFO } from '../data/pratheeshData';
import { sound } from '../utils/soundEffects';
import { Briefcase, Award, GraduationCap, Code2, Mail, Download, Sparkles } from 'lucide-react';

interface RecruiterBarProps {
  onClose: () => void;
  onNavigate: (workspaceId: any) => void;
}

export const RecruiterBar: React.FC<RecruiterBarProps> = ({ onClose, onNavigate }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(15, 22, 38, 0.95)',
      backdropFilter: 'blur(30px)',
      borderBottom: '1px solid rgba(0, 242, 254, 0.3)',
      padding: '16px 24px',
      color: '#F8FAFC',
      boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
      position: 'relative',
      zIndex: 8500,
      animation: 'slideDown 0.3s ease-out'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px',
            borderRadius: '12px',
            background: 'rgba(0, 242, 254, 0.15)',
            border: '1px solid rgba(0, 242, 254, 0.3)'
          }}>
            <Sparkles size={20} color="#00F2FE" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#FFF' }}>
                60-SECOND RECRUITER EXECUTIVE SUMMARY
              </h3>
              <span className="badge badge-cyan">PRATHEESH CLEMENT</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
              Computer Applications Graduate (BCA 2024) • Google Digital Marketing Certified (ID: 453421024) • Nexteer Automotive QAD ERP Exp
            </p>
          </div>
        </div>

        {/* Key Quick Metric Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem'
          }}>
            <GraduationCap size={16} color="#00F2FE" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>EDUCATION</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>BCA (2024)</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem'
          }}>
            <Award size={16} color="#EC4899" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>GOOGLE CERT</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>Digital Marketing</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem'
          }}>
            <Briefcase size={16} color="#10B981" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>INDUSTRY EXP</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>QAD ERP Associate</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem'
          }}>
            <Code2 size={16} color="#3B82F6" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>STACK</div>
              <div style={{ fontWeight: 700, color: '#FFF' }}>React, TS, JS, SEO</div>
            </div>
          </div>
        </div>

        {/* Direct Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('ai-concierge');
            }}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
          >
            <Sparkles size={14} /> Ask AI Concierge
          </button>

          <button
            onClick={() => {
              sound.playClick();
              window.open(`mailto:${PERSONAL_INFO.email}?subject=Hiring Inquiry for Pratheesh Clement`, '_blank');
            }}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
          >
            <Mail size={14} /> Email Pratheesh
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('communication');
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#FFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={14} /> Resume PDF
          </button>
        </div>
      </div>
    </div>
  );
};
