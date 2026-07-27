import React, { useState } from 'react';
import { PERSONAL_INFO } from '../../data/pratheeshData';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface Scene09ContactProps {
  progress: number;
}

export const Scene09Contact: React.FC<Scene09ContactProps> = ({ progress }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    sound.playClick();
    setSubmitted(true);
  };

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
        <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>FINAL TRANSMISSION</span>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#FFF' }}>
          INITIATE CONTACT & COLLABORATION
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', width: '100%' }}>
        {/* Direct Channel Details */}
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '28px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: '24px' }}>DIRECT CONTACT CHANNELS</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(0, 242, 254, 0.15)' }}>
                <Mail size={22} color="#00F2FE" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>EMAIL ADDRESS</div>
                <a href={`mailto:${PERSONAL_INFO.email}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', textDecoration: 'none' }}>
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
                <Phone size={22} color="#10B981" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>PHONE NUMBER</div>
                <a href={`tel:${PERSONAL_INFO.phone}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', textDecoration: 'none' }}>
                  {PERSONAL_INFO.phone}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '14px', backgroundColor: 'rgba(127, 0, 255, 0.15)' }}>
                <MapPin size={22} color="#A855F7" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>LOCATION</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>{PERSONAL_INFO.location}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Transmission Form */}
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '28px', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={56} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>TRANSMISSION RECEIVED</h3>
              <p style={{ color: '#94A3B8', marginTop: '8px' }}>Thank you for reaching out! Pratheesh Clement will respond to your message shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>SEND TRANSMISSION</h3>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>YOUR NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>YOUR EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>YOUR MESSAGE</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter your message or project inquiry..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none', resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <Send size={18} /> Transmit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
