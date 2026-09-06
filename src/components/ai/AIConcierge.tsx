import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { X, Send, Bot, RefreshCw } from 'lucide-react';
import { AIMessage, UserRole } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import {
  queryConversationalAI,
  INITIAL_PERSONA_QUESTIONS,
} from '../../services/aiConciergeService';

const ROLES: { id: UserRole; label: string; emoji: string }[] = [
  { id: 'recruiter', label: 'Recruiter', emoji: '🎯' },
  { id: 'founder', label: 'Founder', emoji: '🚀' },
  { id: 'client', label: 'Client', emoji: '🤝' },
  { id: 'developer', label: 'Developer', emoji: '💻' },
  { id: 'browsing', label: 'Just Browsing', emoji: '👀' },
];

const SESSION_KEY = 'px-ai-session';
const ROLE_KEY = 'px-ai-role';

function loadStoredMessages(): AIMessage[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadStoredRole(): UserRole | null {
  try {
    return (sessionStorage.getItem(ROLE_KEY) as UserRole) || null;
  } catch {
    return null;
  }
}

const AIConcierge: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(loadStoredRole);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<AIMessage[]>(loadStoredMessages);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  // Scroll lock background when chat modal is open
  useScrollLock(open, panelRef);

  // Sync follow-up suggestions with current state
  useEffect(() => {
    if (role && msgs.length === 1 && followUps.length === 0) {
      setFollowUps(INITIAL_PERSONA_QUESTIONS[role] || []);
    }
  }, [role, msgs.length, followUps.length]);

  // Animate panel in/out
  useEffect(() => {
    if (!panelRef.current || reduced) return;
    if (open) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [open, reduced]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(msgs.slice(-40)));
      if (role) sessionStorage.setItem(ROLE_KEY, role);
    } catch {
      // Storage unavailable
    }
  }, [msgs, role]);

  // Auto-focus input when panel opens or role is selected
  useEffect(() => {
    if (open && role) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [open, role]);

  // Listen for global open-ai-concierge custom event
  useEffect(() => {
    const handleOpenAI = () => setOpen(true);
    window.addEventListener('open-ai-concierge', handleOpenAI);
    return () => window.removeEventListener('open-ai-concierge', handleOpenAI);
  }, []);

  const closePanel = () => {
    if (!reduced && panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        onComplete: () => setOpen(false),
      });
    } else {
      setOpen(false);
    }
  };

  const selectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    const greeting: AIMessage = {
      id: `m-${Date.now()}`,
      role: 'assistant',
      content: `Hi! I'm Pratheesh's Portfolio AI. How can I help you today?`,
      timestamp: Date.now(),
      suggestedQuestions: INITIAL_PERSONA_QUESTIONS[selectedRole] || [],
      topic: 'intro',
    };
    setMsgs([greeting]);
    setFollowUps(INITIAL_PERSONA_QUESTIONS[selectedRole] || []);
  };

  const resetRole = () => {
    setRole(null);
    setMsgs([]);
    setFollowUps([]);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ROLE_KEY);
  };

  /**
   * Unified message handler:
   * Both manual user typing and quick question clicks funnel through this identical pipeline.
   */
  const handleUserMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing || !role) return;

      const userMsg: AIMessage = {
        id: `m-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      const updatedHistory = [...msgs, userMsg];
      setMsgs(updatedHistory);
      setInput('');
      setTyping(true);
      // Clear visible follow-ups while the assistant is processing
      setFollowUps([]);

      try {
        const result = await queryConversationalAI(
          role,
          updatedHistory.map(m => ({ role: m.role, content: m.content }))
        );

        const botMsg: AIMessage = {
          id: `m-${Date.now() + 1}`,
          role: 'assistant',
          content: result.answer,
          timestamp: Date.now(),
          suggestedQuestions: result.suggestedQuestions,
          topic: result.topic,
          source: result.source,
        };

        setMsgs(prev => [...prev, botMsg]);
        setFollowUps(result.suggestedQuestions);
      } catch {
        const fallbackMsg: AIMessage = {
          id: `m-${Date.now() + 1}`,
          role: 'assistant',
          content:
            "I'm having trouble connecting to my conversation service right now. You can still explore the portfolio or contact Pratheesh directly at pratheesh.clement@gmail.com.",
          timestamp: Date.now(),
          suggestedQuestions: [
            "What are Pratheesh's strongest skills?",
            "What services does he provide?",
            "How can I contact Pratheesh?",
          ],
          source: 'fallback',
        };
        setMsgs(prev => [...prev, fallbackMsg]);
        setFollowUps(fallbackMsg.suggestedQuestions || []);
      } finally {
        setTyping(false);
      }
    },
    [msgs, role, typing]
  );

  return (
    <>
      {/* Floating trigger orb */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close AI Concierge' : 'Open AI Concierge'}
        aria-expanded={open}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 9000,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = '';
        }}
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat modal panel */}
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
            width: window.innerWidth <= 640 ? '100vw' : 'min(400px, calc(100vw - 56px))',
            height: window.innerWidth <= 640 ? '100dvh' : 560,
            maxHeight: '100dvh',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            borderRadius: window.innerWidth <= 640 ? 0 : 24,
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
              paddingTop: window.innerWidth <= 640 ? 'max(16px, env(safe-area-inset-top))' : 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Portfolio AI
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-mint)', fontWeight: 600 }}>
                  ● Online {role ? `• ${role.charAt(0).toUpperCase() + role.slice(1)}` : ''}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {role && (
                <button
                  onClick={resetRole}
                  aria-label="Switch persona"
                  title="Switch Persona"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                    padding: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  <RefreshCw size={16} />
                </button>
              )}
              <button
                onClick={closePanel}
                aria-label="Close chat"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Persona picker */}
          {!role && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                gap: 12,
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  marginBottom: 4,
                }}
              >
                I'm here to help! Who are you?
              </div>
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => selectRole(r.id)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    transition: 'all 0.15s ease',
                    minHeight: 48,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--bg-tertiary)';
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Conversation view */}
          {role && (
            <>
              <div
                ref={messagesRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px 16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {msgs.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius:
                        msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                          : 'var(--bg-secondary)',
                      color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      border: msg.role === 'assistant' ? '1px solid var(--bg-tertiary)' : 'none',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </div>
                ))}

                {typing && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      padding: '12px 16px',
                      borderRadius: '18px 18px 18px 4px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--bg-tertiary)',
                      fontSize: '0.88rem',
                      color: 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        animation: 'pulse 1.2s infinite',
                      }}
                    />
                    Thinking…
                  </div>
                )}
              </div>

              {/* Contextual Follow-Up Suggestions */}
              {followUps.length > 0 && !typing && (
                <div
                  style={{
                    padding: '10px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    borderTop: '1px solid var(--bg-tertiary)',
                    background: 'rgba(59,130,246,0.03)',
                    maxHeight: 160,
                    overflowY: 'auto',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Suggested Follow-ups
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {followUps.map(question => (
                      <button
                        key={question}
                        onClick={() => handleUserMessage(question)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 999,
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          background: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.25)',
                          color: 'var(--accent-primary)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          minHeight: 38,
                          textAlign: 'left',
                          transition: 'background 0.15s ease, border-color 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background =
                            'rgba(59,130,246,0.18)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background =
                            'rgba(59,130,246,0.08)';
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form with safe area bottom padding */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleUserMessage(input);
                }}
                style={{
                  padding: '12px 16px',
                  paddingBottom:
                    window.innerWidth <= 640 ? 'max(16px, env(safe-area-inset-bottom))' : 12,
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
                  disabled={typing}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--bg-tertiary)',
                    background: 'var(--bg-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    minHeight: 44,
                  }}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!input.trim() || typing}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: input.trim() && !typing ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    border: 'none',
                    cursor: input.trim() && !typing ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    transition: 'background 0.15s ease',
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
