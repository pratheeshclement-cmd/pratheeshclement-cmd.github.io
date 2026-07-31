import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { AIMessage, UserRole } from '../../types';
import { ROLE_QUICK_CHIPS, queryAIConcierge } from '../../data/aiKnowledgeBase';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';

const ROLES: { id: UserRole; label: string; emoji: string }[] = [
  { id: 'recruiter',  label: 'Recruiter',    emoji: '🎯' },
  { id: 'founder',    label: 'Founder',       emoji: '🚀' },
  { id: 'client',     label: 'Client',        emoji: '🤝' },
  { id: 'developer',  label: 'Developer',     emoji: '💻' },
  { id: 'browsing',   label: 'Just Browsing', emoji: '👀' },
];

const SESSION_KEY = 'px-ai-session';

function loadMessages(): AIMessage[] {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]'); } catch { return []; }
}
function saveMessages(msgs: AIMessage[]) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(msgs.slice(-40)));
}

const AIConcierge: React.FC = () => {
  const [open, setOpen]       = useState(false);
  const [role, setRole]       = useState<UserRole | null>(null);
  const [input, setInput]     = useState('');
  const [msgs, setMsgs]       = useState<AIMessage[]>(loadMessages);
  const [typing, setTyping]   = useState(false);
  const panelRef              = useRef<HTMLDivElement>(null);
  const messagesRef           = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);
  const reduced               = useReducedMotion();

  // Lock main page scrolling when AI Concierge panel is open
  useScrollLock(open, panelRef);

  // Animate panel in/out
  useEffect(() => {
    if (!panelRef.current || reduced) return;
    if (open) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, [open, reduced]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    saveMessages(msgs);
  }, [msgs]);

  // Focus input on open
  useEffect(() => {
    if (open && role) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, role]);

  const closePanel = () => {
    if (!reduced && panelRef.current) {
      gsap.to(panelRef.current, { opacity: 0, y: 20, duration: 0.25, onComplete: () => setOpen(false) });
    } else {
      setOpen(false);
    }
  };

  const selectRole = (r: UserRole) => {
    setRole(r);
    const greeting: AIMessage = {
      id: `m-${Date.now()}`,
      role: 'assistant',
      content: `Hi! I'm Pratheesh's Portfolio AI. How can I help you today?`,
      timestamp: Date.now(),
    };
    setMsgs(prev => [...prev, greeting]);
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIMessage = { id: `m-${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulated 600ms response delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    const answer = await queryAIConcierge(text, msgs.map(m => ({ role: m.role, content: m.content })));
    const botMsg: AIMessage = { id: `m-${Date.now() + 1}`, role: 'assistant', content: answer, timestamp: Date.now() };
    setMsgs(prev => [...prev, botMsg]);
    setTyping(false);
  }, []);

  const chips = role ? ROLE_QUICK_CHIPS[role] ?? [] : [];

  return (
    <>
      {/* Trigger orb */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close AI Concierge' : 'Open AI Concierge'}
        aria-expanded={open}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="AI Concierge chat"
          style={{
            position: 'fixed',
            bottom: window.innerWidth <= 640 ? 0 : 96,
            right: window.innerWidth <= 640 ? 0 : 28,
            left: window.innerWidth <= 640 ? 0 : 'auto',
            top: window.innerWidth <= 640 ? 0 : 'auto',
            zIndex: 99999,
            width: window.innerWidth <= 640 ? '100vw' : 'min(380px, calc(100vw - 56px))',
            height: window.innerWidth <= 640 ? '100dvh' : 520,
            maxHeight: '100dvh',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            borderRadius: window.innerWidth <= 640 ? 0 : 24,
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid var(--glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
            paddingTop: window.innerWidth <= 640 ? 'max(16px, env(safe-area-inset-top))' : 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Portfolio AI</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-mint)', fontWeight: 600 }}>● Online</div>
              </div>
            </div>
            <button onClick={closePanel} aria-label="Close chat" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 8 }}>
              <X size={20} />
            </button>
          </div>

          {/* Role picker */}
          {!role && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12, overflowY: 'auto' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 4 }}>
                I'm here to help! Who are you?
              </div>
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => selectRole(r.id)}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 12,
                    background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)',
                    cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 500,
                    color: 'var(--text-primary)', transition: 'all 0.15s ease',
                    minHeight: 48,
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          {role && (
            <>
              <div
                ref={messagesRef}
                style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 12, WebkitOverflowScrolling: 'touch' }}
              >
                {msgs.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                        : 'var(--bg-secondary)',
                      color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                      fontSize: '0.92rem', lineHeight: 1.6,
                      border: msg.role === 'assistant' ? '1px solid var(--bg-tertiary)' : 'none',
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
                {typing && (
                  <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', fontSize: '0.88rem', color: 'var(--text-tertiary)' }}>
                    Thinking…
                  </div>
                )}
              </div>

              {/* Quick chips */}
              {chips.length > 0 && msgs.length <= 2 && (
                <div style={{ padding: '8px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid var(--bg-tertiary)' }}>
                  {chips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      style={{
                        padding: '8px 14px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 500,
                        background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)',
                        color: 'var(--accent-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                        minHeight: 36,
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Form with safe area bottom padding */}
              <form
                onSubmit={e => { e.preventDefault(); sendMessage(input); }}
                style={{
                  padding: '12px 16px',
                  paddingBottom: window.innerWidth <= 640 ? 'max(16px, env(safe-area-inset-bottom))' : 12,
                  borderTop: '1px solid var(--bg-tertiary)',
                  display: 'flex',
                  gap: 8,
                  background: 'var(--bg-primary)',
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything…"
                  aria-label="Message input"
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 12,
                    border: '1px solid var(--bg-tertiary)', background: 'var(--bg-secondary)',
                    fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-primary)',
                    outline: 'none', minHeight: 44,
                  }}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!input.trim()}
                  style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: input.trim() ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', transition: 'background 0.15s ease',
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIConcierge;
