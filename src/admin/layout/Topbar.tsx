// ─── DMOS Topbar v6 — Enterprise Header ──────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import {
  Bell, Search, Plus, ChevronDown, User, Settings, LogOut,
  FileText, FolderOpen, MessageSquare, Menu, Zap, Check, Sun, Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthProvider';
import { ConnectionService } from '../services/ConnectionService';

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard', analytics: 'Analytics', performance: 'Performance',
  monitor: 'Website Monitor', marketing: 'Marketing Hub', seo: 'SEO Center',
  crm: 'CRM & Leads', 'content-studio': 'Content Studio', cms: 'Portfolio CMS',
  projects: 'Projects', blog: 'Blog CMS', media: 'Media Library',
  ai: 'AI Center', automation: 'Automation', reports: 'Reports',
  integrations: 'Integrations', connections: 'Connections',
  notifications: 'Notifications', settings: 'Settings',
  users: 'User Management', profile: 'Profile',
};

interface TopbarProps {
  activeModule: string;
  onNavigate: (id: string) => void;
  sidebarWidth: number;
  onOpenCommandPalette: () => void;
  onMobileMenuToggle?: () => void;
}

const DROPDOWN_ITEM_STYLE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 13px', borderRadius: 7, cursor: 'pointer',
  fontSize: '0.80rem', color: 'var(--dmos-text)',
  transition: 'background 0.12s',
};

export const Topbar: React.FC<TopbarProps> = ({
  activeModule, onNavigate, sidebarWidth, onOpenCommandPalette, onMobileMenuToggle,
}) => {
  const { user, logout } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('px-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    document.body.classList.toggle('dark-theme', next === 'dark');
    localStorage.setItem('px-theme', next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
      }
      if (e.key === 'Escape') { setCreateOpen(false); setProfileOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette]);

  const overview = ConnectionService.getHealthOverview();
  const systemStatus = overview.authRequired > 0 || overview.disconnected > 2 ? 'warning' : 'healthy';
  const pageTitle = MODULE_LABELS[activeModule] || 'DMOS';
  const avatarChar = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A';

  return (
    <header style={{
      position: 'fixed', top: 0,
      left: isMobile ? 0 : sidebarWidth, right: 0,
      height: 60,
      background: 'rgba(7, 12, 24, 0.94)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid var(--dmos-border)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 12, zIndex: 90,
      transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
    }}>

      {/* ── Mobile Hamburger ── */}
      {isMobile && (
        <button
          onClick={onMobileMenuToggle}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--dmos-border)',
            borderRadius: 8, color: 'var(--dmos-text)', cursor: 'pointer',
            padding: '7px 8px', display: 'flex', alignItems: 'center',
          }}
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
      )}

      {/* ── Page Breadcrumb (Desktop) ── */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--dmos-text-subtle)', fontWeight: 500 }}>DMOS</span>
          <span style={{ color: 'var(--dmos-border-strong)', fontSize: '0.7rem' }}>/</span>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--dmos-text)' }}>{pageTitle}</span>
        </div>
      )}

      {/* ── Global Search ── */}
      <div style={{ flex: 1, maxWidth: isMobile ? '100%' : 400, margin: '0 auto' }}>
        <button
          onClick={onOpenCommandPalette}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '7px 12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--dmos-border)',
            borderRadius: 9, cursor: 'pointer',
            color: 'var(--dmos-text-subtle)', fontSize: '0.78rem',
            transition: 'all 0.15s', minHeight: 36,
            fontFamily: 'var(--dmos-font-sans)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--dmos-border-strong)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dmos-border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Search size={14} />
            <span>{isMobile ? 'Search…' : 'Search commands, pages, actions…'}</span>
          </div>
          {!isMobile && (
            <kbd style={{
              padding: '2px 6px', background: 'rgba(255,255,255,0.07)',
              borderRadius: 5, fontSize: '0.64rem', color: 'var(--dmos-text-subtle)',
              border: '1px solid var(--dmos-border)', fontFamily: 'var(--dmos-font-mono)',
            }}>
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* ── Right Action Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

        {/* + Create */}
        {!isMobile && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCreateOpen(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                background: 'var(--dmos-primary)',
                border: 'none', borderRadius: 9,
                color: '#fff', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', minHeight: 36,
                boxShadow: 'var(--dmos-shadow-primary)',
                transition: 'all 0.15s',
                fontFamily: 'var(--dmos-font-sans)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--dmos-primary-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--dmos-primary)')}
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Create</span>
              <ChevronDown size={12} style={{ opacity: 0.75 }} />
            </button>

            <AnimatePresence>
              {createOpen && (
                <>
                  <div onClick={() => setCreateOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 210,
                      background: 'var(--dmos-card-elevated)',
                      border: '1px solid var(--dmos-border-strong)',
                      borderRadius: 12, boxShadow: 'var(--dmos-shadow-lg)',
                      zIndex: 99, overflow: 'hidden', padding: '5px',
                    }}
                  >
                    {[
                      { label: 'New Blog Post', icon: FileText, action: () => onNavigate('blog') },
                      { label: 'Add Project',   icon: FolderOpen, action: () => onNavigate('projects') },
                      { label: 'New CRM Lead',  icon: MessageSquare, action: () => onNavigate('crm') },
                      { label: 'Run SEO Audit', icon: Search, action: () => onNavigate('seo') },
                      { label: 'AI Generate',   icon: Zap, action: () => onNavigate('ai') },
                    ].map(item => (
                      <div
                        key={item.label}
                        onClick={() => { item.action(); setCreateOpen(false); }}
                        style={DROPDOWN_ITEM_STYLE}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--dmos-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <item.icon size={13} color="var(--dmos-primary-light)" />
                        </div>
                        {item.label}
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* System Status Pill */}
        {!isMobile && (
          <button
            onClick={() => onNavigate('connections')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${systemStatus === 'healthy' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
              borderRadius: 20, cursor: 'pointer', minHeight: 32,
              transition: 'all 0.15s',
              fontFamily: 'var(--dmos-font-sans)',
            }}
          >
            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: systemStatus === 'healthy' ? 'var(--dmos-success)' : 'var(--dmos-warning)',
              }} />
              {systemStatus === 'healthy' && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'var(--dmos-success)',
                  animation: 'dmos-ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                }} />
              )}
            </div>
            <span style={{
              fontSize: '0.73rem', fontWeight: 600,
              color: systemStatus === 'healthy' ? 'var(--dmos-success)' : 'var(--dmos-warning)',
            }}>
              {systemStatus === 'healthy' ? 'All Systems' : 'Notice'}
            </span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => onNavigate('notifications')}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)',
            borderRadius: 8, cursor: 'pointer', padding: '7px 8px',
            color: 'var(--dmos-text-muted)', display: 'flex', alignItems: 'center',
            position: 'relative', minHeight: 36, transition: 'all 0.15s',
          }}
          aria-label="Notifications"
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--dmos-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--dmos-text-muted)'; }}
        >
          <Bell size={17} />
          <div style={{
            position: 'absolute', top: 5, right: 5, width: 7, height: 7,
            borderRadius: '50%', background: 'var(--dmos-danger)',
            border: '1.5px solid var(--dmos-bg)',
          }} />
        </button>

        {/* Theme Toggle (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)',
            borderRadius: 8, cursor: 'pointer', padding: '7px 8px',
            color: 'var(--dmos-text-muted)', display: 'flex', alignItems: 'center',
            position: 'relative', minHeight: 36, transition: 'all 0.15s',
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--dmos-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--dmos-text-muted)'; }}
        >
          {theme === 'dark' ? <Sun size={17} color="var(--dmos-warning)" /> : <Moon size={17} color="var(--dmos-primary-light)" />}
        </button>

        {/* Profile Avatar */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setProfileOpen(p => !p)}
            style={{
              width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--dmos-primary), var(--dmos-accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.82rem', fontWeight: 700, color: '#fff',
              boxShadow: '0 2px 8px rgba(46,90,255,0.35)',
              border: '2px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            {user?.photoURL
              ? <img src={user.photoURL} alt={avatarChar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : avatarChar}
          </div>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 220,
                    background: 'var(--dmos-card-elevated)',
                    border: '1px solid var(--dmos-border-strong)',
                    borderRadius: 13, boxShadow: 'var(--dmos-shadow-lg)',
                    zIndex: 99, overflow: 'hidden', padding: '5px',
                  }}
                >
                  {/* User Info */}
                  <div style={{ padding: '12px 13px 10px', borderBottom: '1px solid var(--dmos-border)', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--dmos-primary), var(--dmos-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.88rem', fontWeight: 700, color: '#fff', overflow: 'hidden',
                      }}>
                        {user?.photoURL
                          ? <img src={user.photoURL} alt={avatarChar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : avatarChar}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--dmos-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.displayName || 'Admin User'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--dmos-text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user?.email || 'admin@dmos.app'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dmos-success)' }} />
                      <span style={{ fontSize: '0.68rem', color: 'var(--dmos-success)', fontWeight: 600 }}>Active Session</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  {[
                    { label: 'Profile', icon: User, action: () => onNavigate('profile') },
                    { label: 'Settings', icon: Settings, action: () => onNavigate('settings') },
                  ].map(item => (
                    <div
                      key={item.label}
                      onClick={() => { item.action(); setProfileOpen(false); }}
                      style={DROPDOWN_ITEM_STYLE}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <item.icon size={15} color="var(--dmos-text-muted)" />
                      {item.label}
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid var(--dmos-border)', margin: '4px 0' }} />

                  <div
                    onClick={() => { logout(); setProfileOpen(false); }}
                    style={{ ...DROPDOWN_ITEM_STYLE, color: 'var(--dmos-danger-light)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--dmos-danger-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={15} color="var(--dmos-danger)" />
                    Sign Out
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
