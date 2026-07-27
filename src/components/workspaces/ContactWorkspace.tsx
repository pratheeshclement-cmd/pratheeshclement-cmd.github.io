import React, { useState } from 'react';
import { PERSONAL_INFO } from '../../data/pratheeshData';
import { sound } from '../../utils/soundEffects';
import { Mail, Phone, MapPin, Send, CheckCircle2, Linkedin, Github, Globe } from 'lucide-react';

export const ContactWorkspace: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    sound.playBootChime();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <Mail size={28} color="#38BDF8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>CONTACT & DIRECT TRANSMISSION</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              Connect directly with Pratheesh Clement for web engineering or digital marketing roles
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Left Column: Direct Contact Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.15)' }}>
                <Mail size={20} color="#00F2FE" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>DIRECT EMAIL</div>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', textDecoration: 'none' }}
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)' }}>
                <Phone size={20} color="#10B981" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>PHONE NUMBER</div>
                <a
                  href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`}
                  style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', textDecoration: 'none' }}
                >
                  {PERSONAL_INFO.phone}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)' }}>
                <MapPin size={20} color="#F59E0B" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>LOCATION</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>
                  {PERSONAL_INFO.location}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '14px' }}>CONNECT ON NETWORKS</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Linkedin size={16} color="#00F2FE" /> LinkedIn
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Github size={16} color="#A855F7" /> GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit', marginBottom: '20px' }}>
            SEND DIRECT TRANSMISSION
          </h3>

          {submitted ? (
            <div style={{ padding: '30px', textAlign: 'center', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981' }}>
              <CheckCircle2 size={48} style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Transmission Received!</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '6px' }}>
                Thank you, {formData.name}. Pratheesh Clement will review your message and reach out promptly at {formData.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px', display: 'block' }}>YOUR NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins (Engineering Director)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px', display: 'block' }}>YOUR EMAIL *</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px', display: 'block' }}>SUBJECT</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer Opportunity / Digital Marketing Role"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px', display: 'block' }}>MESSAGE *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Details regarding your role or project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px', padding: '12px' }}>
                <Send size={16} /> Transmit Message to Pratheesh
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
