import React, { useState } from 'react';
import { Sparkles, Bot, Send, X, UserCheck, Code, Briefcase, Mail } from 'lucide-react';

export const AIConciergeWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: "Welcome! I am Pratheesh Clement's Portfolio AI. Select your role or ask me anything about his skills, experience, or projects!" }
  ]);
  const [inputValue, setInputValue] = useState('');

  const roles = [
    { label: 'Recruiter / HR', role: 'recruiter' },
    { label: 'Hiring Manager', role: 'manager' },
    { label: 'Founder / Client', role: 'client' },
    { label: 'Developer', role: 'developer' }
  ];

  const quickPrompts = [
    'Tell me about yourself',
    'Show best project',
    'Skills summary',
    'Contact info',
    'Google Certification'
  ];

  const handleRoleSelect = (roleLabel: string) => {
    setUserRole(roleLabel);
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: `I am visiting as a ${roleLabel}` },
      { sender: 'ai', text: `Great to meet you! As a ${roleLabel}, here is a quick summary: Pratheesh is a Digital Marketing Specialist & AI Enthusiast with expertise in React, Technical SEO, Google Ads, Meta Ads, and AI automation. What would you like to explore first?` }
    ]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInputValue('');

    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = "Pratheesh Clement is a multidisciplinary digital professional specializing in Digital Marketing, UI/UX Design, SEO, Web Development, Branding, and AI-powered solutions. You can reach him at pratheesh.clement@gmail.com.";

      if (q.includes('tell me') || q.includes('about') || q.includes('who')) {
        reply = "Pratheesh Clement is a Digital Marketing Specialist and AI Enthusiast based in Vadalur, Tamil Nadu. Currently a Digital Marketer at JBHL Pvt Ltd, with a BCA degree and Google Skillshop Certification.";
      } else if (q.includes('project') || q.includes('work') || q.includes('case')) {
        reply = "Featured projects: 1. SEO Growth Campaign (340% organic visibility gain), 2. Restaurant Branding Web Layout (100/100 performance score), 3. Social Media B2B Conversion Funnel (4.5x ROAS increase).";
      } else if (q.includes('skill') || q.includes('stack')) {
        reply = "Key Skills: Technical SEO (GA4, Schema, Core Web Vitals), Web Dev (React, Next.js, TS, HTML5/CSS3), Paid Ads (Google Ads, Meta Ads), AI Automation (OpenAI, Gemini, Claude, Zapier), UI/UX (Figma, Photoshop).";
      } else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire')) {
        reply = "Reach Pratheesh via Email: pratheesh.clement@gmail.com | Phone/WhatsApp: +91 8667876102. Available for Open to Work, Freelance, Remote, and Hybrid roles.";
      } else if (q.includes('cert') || q.includes('google')) {
        reply = "Verified Credential: Google Skillshop — Fundamentals of Digital Marketing (Completion ID: 453421024), accredited by IAB Europe & The Open University.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 400);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99000 }}>
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="glass" style={{
          position: 'absolute',
          bottom: '80px',
          right: 0,
          width: '380px',
          height: '520px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          borderRadius: '28px'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-mint)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Portfolio AI Concierge</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Concierge chat"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Role Picker Onboarding */}
          {!userRole && (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '8px' }}>WHO ARE YOU VISITING AS?</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {roles.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRoleSelect(r.label)}
                    className="pill"
                    style={{ fontSize: '0.75rem', padding: '4px 10px', cursor: 'pointer' }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages Log */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className="glass"
                style={{
                  padding: '10px 14px',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'rgba(59, 130, 246, 0.08)',
                  borderColor: m.sender === 'user' ? 'var(--glass-border)' : 'rgba(59, 130, 246, 0.2)',
                  maxWidth: '85%',
                  borderRadius: '16px'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick Reply Prompt Chips */}
          <div style={{ padding: '8px 12px', overflowX: 'auto', display: 'flex', gap: '6px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                style={{
                  fontSize: '0.72rem',
                  whiteSpace: 'nowrap',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Ask me anything about Pratheesh..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.5)',
                border: '1px solid var(--glass-border)',
                padding: '8px 14px',
                borderRadius: '9999px',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              aria-label="Send AI message"
              className="btn-primary"
              style={{ padding: '8px 14px', borderRadius: '9999px' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Orb Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Concierge assistant"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
          transition: 'transform 0.3s ease'
        }}
      >
        <Sparkles size={26} />
      </button>
    </div>
  );
};
