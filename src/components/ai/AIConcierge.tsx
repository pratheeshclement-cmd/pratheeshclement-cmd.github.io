import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { X, Send, Bot, RefreshCw, ChevronDown, RotateCcw } from 'lucide-react';
import { AIMessage, UserRole } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import {
  queryConversationalAI,
  INITIAL_PERSONA_QUESTIONS,
} from '../../services/aiConciergeService';
import { AINetworkCanvas } from './AINetworkCanvas';

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

function formatTime(timestamp?: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const AIConcierge: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(loadStoredRole);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<AIMessage[]>(loadStoredMessages);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isNearBottomRef = useRef(true);
  const reduced = useReducedMotion();

  // Scroll lock background while chat modal is open
  useScrollLock(open, panelRef);

  // Sync follow-up suggestions with initial role greeting if needed
  useEffect(() => {
    if (role && msgs.length === 1 && followUps.length === 0) {
      setFollowUps(INITIAL_PERSONA_QUESTIONS[role] || []);
    }
  }, [role, msgs.length, followUps.length]);

  // Animate panel open/close
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

  // Session persistence
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(msgs.slice(-40)));
      if (role) sessionStorage.setItem(ROLE_KEY, role);
    } catch {
      // Storage unavailable
    }
  }, [msgs, role]);

  // Focus input when opened or role selected
  useEffect(() => {
    if (open && role) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [open, role]);

  const closePanel = useCallback(() => {
    if (!reduced && panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.18,
        onComplete: () => setOpen(false),
      });
    } else {
      setOpen(false);
    }
  }, [reduced]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closePanel]);

  // Listen for global open-ai-concierge custom event
  useEffect(() => {
    const handleOpenAI = () => setOpen(true);
    window.addEventListener('open-ai-concierge', handleOpenAI);
    return () => window.removeEventListener('open-ai-concierge', handleOpenAI);
  }, []);

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
    setTimeout(() => {
      scrollToBottom(false);
    }, 50);
  };

  const resetRole = () => {
    setRole(null);
    setMsgs([]);
    setFollowUps([]);
    setShowScrollBottom(false);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ROLE_KEY);
  };

  // Scroll detection handler
  const handleScroll = useCallback(() => {
    const el = messagesRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNear = distanceToBottom < 75;
    isNearBottomRef.current = isNear;

    if (isNear && showScrollBottom) {
      setShowScrollBottom(false);
    }
  }, [showScrollBottom]);

  // Scroll to bottom helper
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesRef.current) {
      if (smooth && !reduced) {
        messagesRef.current.scrollTo({
          top: messagesRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
      setShowScrollBottom(false);
    }
  }, [reduced]);

  // Unified message pipeline
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
      setFollowUps([]);

      // User just sent a message; always smooth scroll to bottom
      setTimeout(() => scrollToBottom(true), 30);

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

        // If user was reading older messages, show jump button; otherwise auto-scroll
        setTimeout(() => {
          if (isNearBottomRef.current) {
            scrollToBottom(true);
          } else {
            setShowScrollBottom(true);
          }
        }, 50);
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

        setTimeout(() => {
          if (isNearBottomRef.current) {
            scrollToBottom(true);
          } else {
            setShowScrollBottom(true);
          }
        }, 50);
      } finally {
        setTyping(false);
      }
    },
    [msgs, role, typing, scrollToBottom]
  );

  // Retry last question on network failure
  const handleRetryLastQuestion = useCallback(() => {
    const lastUserMsg = [...msgs].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleUserMessage(lastUserMsg.content);
    }
  }, [msgs, handleUserMessage]);

  return (
    <>
      <style>{`
        @keyframes pxBounceDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes pxFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Floating Trigger Orb */}
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
          boxShadow: '0 4px 24px rgba(59,130,246,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = '';
        }}
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat Modal Panel */}
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
            width: window.innerWidth <= 640 ? '100vw' : 'min(410px, calc(100vw - 48px))',
            height: window.innerWidth <= 640 ? '100dvh' : 580,
            maxHeight: '100dvh',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(36px) saturate(190%)',
            WebkitBackdropFilter: 'blur(36px) saturate(190%)',
            borderRadius: window.innerWidth <= 640 ? 0 : 24,
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Background Digital Architecture Canvas */}
          <AINetworkCanvas isOpen={open} />

          {/* Header */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '16px 20px',
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
              paddingTop: window.innerWidth <= 640 ? 'max(16px, env(safe-area-inset-top))' : 16,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(59,130,246,0.3)',
                }}
              >
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Pratheesh AI Concierge
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-mint)', fontWeight: 600 }}>
                  ● Active {role ? `• ${role.charAt(0).toUpperCase() + role.slice(1)}` : '• Digital Architect'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {role && (
                <button
                  onClick={resetRole}
                  aria-label="Switch persona"
                  title="Switch Persona"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '';
                  }}
                >
                  <RefreshCw size={16} />
                </button>
              )}
              <button
                onClick={closePanel}
                aria-label="Close chat"
                title="Close chat (Esc)"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '';
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Persona Picker Screen */}
          {!role && (
            <div
              data-lenis-prevent="true"
              data-scrollable="true"
              style={{
                position: 'relative',
                zIndex: 1,
                flex: '1 1 0%',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 20px',
                gap: 12,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  marginBottom: 6,
                }}
              >
                Welcome! How would you like to explore?
              </div>
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => selectRole(r.id)}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: 14,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    transition: 'all 0.15s ease',
                    minHeight: 48,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--bg-tertiary)';
                    (e.currentTarget as HTMLElement).style.transform = '';
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Conversation Interface */}
          {role && (
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                flex: '1 1 0%',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Message List - Fully independent, non-chaining scroll container */}
              <div
                ref={messagesRef}
                onScroll={handleScroll}
                data-lenis-prevent="true"
                data-scrollable="true"
                style={{
                  flex: '1 1 0%',
                  minHeight: 0,
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  touchAction: 'pan-y',
                  WebkitOverflowScrolling: 'touch',
                  padding: '16px 16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {msgs.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      animation: 'pxFadeIn 0.25s ease-out',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius:
                          msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                            : 'var(--bg-secondary)',
                        color: msg.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        border: msg.role === 'assistant' ? '1px solid var(--bg-tertiary)' : 'none',
                        boxShadow:
                          msg.role === 'user'
                            ? '0 2px 12px rgba(59,130,246,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.04)',
                        whiteSpace: 'pre-line',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}

                      {/* Offline Fallback Retry Action */}
                      {msg.source === 'fallback' && (
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--bg-tertiary)' }}>
                          <button
                            onClick={handleRetryLastQuestion}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '5px 10px',
                              borderRadius: 8,
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              background: 'rgba(59,130,246,0.12)',
                              border: '1px solid rgba(59,130,246,0.3)',
                              color: 'var(--accent-primary)',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            <RotateCcw size={12} />
                            Retry Connection
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Compact Timestamp */}
                    <div
                      style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        fontSize: '0.68rem',
                        color: 'var(--text-tertiary)',
                        padding: '0 4px',
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                ))}

                {/* Polished Typing Indicator */}
                {typing && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      padding: '10px 16px',
                      borderRadius: '18px 18px 18px 4px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      animation: 'pxFadeIn 0.2s ease-out',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        animation: 'pxBounceDot 1.2s infinite ease-in-out',
                        animationDelay: '0ms',
                      }}
                    />
                    <span
                      style={{
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        animation: 'pxBounceDot 1.2s infinite ease-in-out',
                        animationDelay: '200ms',
                      }}
                    />
                    <span
                      style={{
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        animation: 'pxBounceDot 1.2s infinite ease-in-out',
                        animationDelay: '400ms',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-tertiary)',
                        marginLeft: 6,
                        fontWeight: 500,
                      }}
                    >
                      Thinking…
                    </span>
                  </div>
                )}

                {/* Scroll Bottom Anchor */}
                <div ref={bottomAnchorRef} style={{ height: 1, flexShrink: 0 }} />
              </div>

              {/* Jump to Latest Floating Affordance */}
              {showScrollBottom && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: followUps.length > 0 && !typing ? 140 : 70,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    animation: 'pxFadeIn 0.2s ease-out',
                  }}
                >
                  <button
                    onClick={() => scrollToBottom(true)}
                    aria-label="Jump to latest messages"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: 'var(--accent-primary)',
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <span>New messages</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              )}

              {/* Contextual Follow-Up Suggestions */}
              {followUps.length > 0 && !typing && (
                <div
                  data-lenis-prevent="true"
                  data-scrollable="true"
                  style={{
                    flexShrink: 0,
                    padding: '10px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    borderTop: '1px solid var(--bg-tertiary)',
                    background: 'rgba(59,130,246,0.03)',
                    maxHeight: 120,
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
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
                          padding: '7px 12px',
                          borderRadius: 999,
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          background: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.22)',
                          color: 'var(--accent-primary)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          minHeight: 34,
                          textAlign: 'left',
                          transition: 'background 0.15s ease, border-color 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background =
                            'rgba(59,130,246,0.16)';
                          (e.currentTarget as HTMLElement).style.borderColor =
                            'var(--accent-primary)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background =
                            'rgba(59,130,246,0.08)';
                          (e.currentTarget as HTMLElement).style.borderColor =
                            'rgba(59,130,246,0.22)';
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Composer */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleUserMessage(input);
                }}
                style={{
                  flexShrink: 0,
                  padding: '12px 16px',
                  paddingBottom:
                    window.innerWidth <= 640 ? 'max(14px, env(safe-area-inset-bottom))' : 14,
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
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleUserMessage(input);
                    }
                  }}
                  placeholder="Ask about skills, services, SEO, tech stack…"
                  aria-label="Message input"
                  disabled={typing}
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: 12,
                    border: isFocused
                      ? '1px solid var(--accent-primary)'
                      : '1px solid var(--bg-tertiary)',
                    boxShadow: isFocused ? '0 0 0 2px rgba(59,130,246,0.2)' : 'none',
                    background: 'var(--bg-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    minHeight: 44,
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  title="Send message"
                  disabled={!input.trim() || typing}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    flexShrink: 0,
                    background:
                      input.trim() && !typing
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                        : 'var(--bg-tertiary)',
                    border: 'none',
                    cursor: input.trim() && !typing ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                    opacity: input.trim() && !typing ? 1 : 0.6,
                  }}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIConcierge;
