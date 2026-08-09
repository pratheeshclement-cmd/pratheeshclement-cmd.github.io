import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from './AuthProvider';
import '../design-system/tokens.css';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div
      className="dmos-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--admin-bg, #080B12)',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 16px',
        fontFamily: 'var(--dmos-font-sans)',
      }}
    >
      {/* ── Background Subtle Ambient Grid & Glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 440,
          height: 440,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,99,255,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Centered Auth Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--admin-surface, #0D111A)',
          border: '1px solid var(--admin-border, rgba(255,255,255,0.08))',
          borderRadius: 24,
          padding: 'clamp(24px, 6vw, 36px) clamp(20px, 5vw, 32px)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 99, 255, 0.05)',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
        }}
      >
        {/* Header: Personal Identity Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              position: 'relative',
              width: 56,
              height: 56,
              borderRadius: '50%',
              padding: 2,
              background: 'linear-gradient(135deg, var(--admin-accent, #3B63FF), rgba(139,92,246,0.6))',
              boxShadow: '0 8px 24px rgba(59, 99, 255, 0.25)',
              marginBottom: 16,
            }}
          >
            <img
              src="/assets/pratheesh4k1.jpeg"
              alt="Pratheesh Clement"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                // Fallback icon if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--admin-text, #F5F7FA)',
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: 4,
            }}
          >
            Pratheesh Admin
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted, #697386)', margin: 0 }}>
            Portfolio Control Center
          </p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-text, #F5F7FA)', margin: 0, marginBottom: 4 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary, #A7B0C0)', margin: 0 }}>
            Sign in to manage your digital ecosystem
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '12px 14px',
              marginBottom: 20,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 12,
              fontSize: '0.82rem',
              color: '#F87171',
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--admin-text-secondary, #A7B0C0)',
                marginBottom: 8,
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                color="var(--admin-text-muted, #697386)"
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                
                style={{
                  width: '100%',
                  height: 48,
                  padding: '0 14px 0 42px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--admin-border, rgba(255, 255, 255, 0.08))',
                  borderRadius: 12,
                  color: 'var(--admin-text, #F5F7FA)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--admin-accent, #3B63FF)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--admin-border, rgba(255, 255, 255, 0.08))';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--admin-text-secondary, #A7B0C0)',
                marginBottom: 8,
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                color="var(--admin-text-muted, #697386)"
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                
                style={{
                  width: '100%',
                  height: 48,
                  padding: '0 44px 0 42px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--admin-border, rgba(255, 255, 255, 0.08))',
                  borderRadius: 12,
                  color: 'var(--admin-text, #F5F7FA)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--admin-accent, #3B63FF)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--admin-border, rgba(255, 255, 255, 0.08))';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 6,
                  color: 'var(--admin-text-muted, #697386)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: 48,
              marginTop: 4,
              background: isLoading ? 'rgba(59, 99, 255, 0.5)' : 'var(--admin-accent, #3B63FF)',
              border: 'none',
              borderRadius: 12,
              color: '#FFFFFF',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(59, 99, 255, 0.35)',
              transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#4F73FF';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'var(--admin-accent, #3B63FF)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--admin-border, rgba(255,255,255,0.08))' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted, #697386)', fontWeight: 600, letterSpacing: '0.06em' }}>
            OR
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--admin-border, rgba(255,255,255,0.08))' }} />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={loginWithGoogle}
          disabled={isLoading}
          style={{
            width: '100%',
            height: 48,
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--admin-border, rgba(255, 255, 255, 0.08))',
            borderRadius: 12,
            color: 'var(--admin-text, #F5F7FA)',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'var(--admin-border, rgba(255, 255, 255, 0.08))';
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer Return Link */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.8rem',
              color: 'var(--admin-text-muted, #697386)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--admin-text, #F5F7FA)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--admin-text-muted, #697386)')}
          >
            <ArrowLeft size={14} />
            Return to portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
};
