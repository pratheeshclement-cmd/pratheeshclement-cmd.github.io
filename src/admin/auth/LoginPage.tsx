import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, BarChart2, Search, Globe, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthProvider';
import '../design-system/tokens.css';

const FEATURES = [
  { icon: BarChart2, label: 'Analytics Dashboard', desc: 'GA4 + GSC unified view' },
  { icon: Search, label: 'SEO Command Center', desc: 'Keywords, audits, vitals' },
  { icon: Globe, label: 'Portfolio CMS', desc: 'Edit every section live' },
  { icon: Zap, label: 'AI Insights', desc: 'Gemini-powered recommendations' },
];

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, isLoading, error } = useAuth();
  const [email, setEmail] = useState('pratheesh.clement@gmail.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="dmos-root" style={{ minHeight: '100vh', display: 'flex', background: 'var(--dmos-bg)' }}>
      {/* ── Left Panel ── */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0f1c3a 0%, #0B1220 50%, #0d1f3c 100%)',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }} className="dmos-login-left">
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--dmos-border) 1px, transparent 1px), linear-gradient(90deg, var(--dmos-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,90,255,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--dmos-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>D</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dmos-text)' }}>DMOS Enterprise</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-muted)', letterSpacing: '0.08em' }}>OPERATING SYSTEM v3.0</div>
              </div>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
              style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.15, color: 'var(--dmos-text)', marginBottom: 16 }}
            >
              Enterprise Digital<br />Marketing OS.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0, 0, 0.2, 1] }}
              style={{ fontSize: '1rem', color: 'var(--dmos-text-muted)', lineHeight: 1.65, maxWidth: 400 }}
            >
              Unified Firebase & Express production engine with Email/Password & Google Authentication.
            </motion.p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--dmos-border)',
                  borderRadius: 'var(--dmos-radius-md)',
                  padding: '16px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(46,90,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={16} color="var(--dmos-primary-light)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dmos-text)', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-muted)' }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--dmos-text-subtle)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} color="var(--dmos-success)" />
            Firebase Authenticated Production Session
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        background: 'var(--dmos-surface)',
        minHeight: '100vh',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--dmos-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>D</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--dmos-text)' }}>DMOS Admin</div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--dmos-text)', marginBottom: 8 }}>Sign In to DMOS</h2>
          <p style={{ color: 'var(--dmos-text-muted)', fontSize: '0.9rem', marginBottom: 28 }}>Select your authentication method</p>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--dmos-text-muted)', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--dmos-text-subtle)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@pratheeshclement.com"
                  style={{
                    width: '100%', padding: '11px 14px 11px 42px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--dmos-border-strong)',
                    borderRadius: 'var(--dmos-radius)',
                    color: 'var(--dmos-text)', fontSize: '0.9rem',
                    outline: 'none', fontFamily: 'var(--dmos-font-sans)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--dmos-text-muted)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--dmos-text-subtle)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '11px 44px 11px 42px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--dmos-border-strong)',
                    borderRadius: 'var(--dmos-radius)',
                    color: 'var(--dmos-text)', fontSize: '0.9rem',
                    outline: 'none', fontFamily: 'var(--dmos-font-sans)',
                    boxSizing: 'border-box',
                  }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <EyeOff size={16} color="var(--dmos-text-subtle)" /> : <Eye size={16} color="var(--dmos-text-subtle)" />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'var(--dmos-danger-bg)', border: '1px solid var(--dmos-danger-border)', borderRadius: 'var(--dmos-radius)', fontSize: '0.82rem', color: 'var(--dmos-danger)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '12px 16px',
                background: isLoading ? 'rgba(46,90,255,0.5)' : 'var(--dmos-primary)',
                border: 'none',
                borderRadius: 'var(--dmos-radius)',
                color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--dmos-font-sans)',
                boxShadow: 'var(--dmos-shadow-primary)',
                transition: 'background 0.2s',
              }}
            >
              {isLoading ? 'Signing In…' : 'Sign In with Email'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--dmos-border)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--dmos-border)' }} />
          </div>

          {/* Google Button */}
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--dmos-border-strong)',
              borderRadius: 'var(--dmos-radius)',
              color: 'var(--dmos-text)',
              fontSize: '0.9rem', fontWeight: 500,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 0.2s',
              fontFamily: 'var(--dmos-font-sans)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.75rem', color: 'var(--dmos-text-subtle)' }}>
            ← <a href="/" style={{ color: 'var(--dmos-text-muted)', textDecoration: 'none' }}>Back to Public Portfolio</a>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .dmos-login-left { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
