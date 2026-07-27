import React, { useState } from 'react';
import { PERSONAL_INFO } from '../../data/pratheeshData';
import { sound } from '../../utils/soundEffects';
import { MessageSquareShare, Download, Calendar, Mail, CheckCircle2, Send, FileText } from 'lucide-react';

export const CommunicationWorkspace: React.FC = () => {
  const [quickMsgSent, setQuickMsgSent] = useState(false);
  const [msgContent, setMsgContent] = useState('');

  const handleSendQuickMsg = () => {
    if (!msgContent.trim()) return;
    sound.playClick();
    setQuickMsgSent(true);
    setTimeout(() => {
      setMsgContent('');
      setQuickMsgSent(false);
    }, 4000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(20, 184, 166, 0.15)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
            <MessageSquareShare size={28} color="#14B8A6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>COMMUNICATION CENTER</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Direct recruiter messaging, resume downloads, and interview scheduling
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Resume Download & Details */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FileText size={28} color="#00F2FE" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit' }}>
                PRATHEESH CLEMENT RESUME
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Verified PDF & Word Document Formats</p>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '20px' }}>
            Download Pratheesh Clement's official resume containing verified credentials: BCA 2024, Google Digital Marketing Certification ID 453421024, HDCA Grade A, and Nexteer Automotive QAD ERP experience.
          </p>

          <button
            onClick={() => {
              sound.playClick();
              window.open(`mailto:${PERSONAL_INFO.email}?subject=Requesting Pratheesh Clement Resume PDF`, '_blank');
            }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Download size={18} /> Request & Download Official Resume PDF
          </button>
        </div>

        {/* Recruiter Quick Transmission */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} color="#14B8A6" /> DIRECT RECRUITER TRANSMISSION
          </h3>

          {quickMsgSent ? (
            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', textAlign: 'center', color: '#10B981' }}>
              <CheckCircle2 size={32} style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Message Transmitted Successfully!</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>Pratheesh will respond to your email shortly.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <textarea
                placeholder="Type your hiring message or interview request..."
                value={msgContent}
                onChange={(e) => setMsgContent(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
              <button onClick={handleSendQuickMsg} className="btn-primary" style={{ justifyContent: 'center' }}>
                <Send size={16} /> Send Direct Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
