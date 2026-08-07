// ─── DMOS Sidebar v6 — Enterprise Navigation Shell ──────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart2, Search, FileText, Folder,
  BookOpen, Image, Users, Cpu, Zap, Link2, Bell, Settings,
  User, ChevronLeft, ChevronRight, TrendingUp, Globe,
  MessageSquare, LogOut, Activity, Printer, Sparkles, X, Monitor,
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
  badge?: string | number;
  badgeColor?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary';
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
      { id: 'notifications', label: 'Notifications',   icon: Bell, badge: 3, badgeColor: 'danger' },
    ],
  },
  {
    section: 'Analytics & Health',
    items: [
      { id: 'analytics',   label: 'Analytics',        icon: BarChart2 },
      { id: 'performance', label: 'Performance',      icon: Zap },
      { id: 'monitor',     label: 'Website Monitor',  icon: Activity, badge: '99.9%', badgeColor: 'success' },
    ],
  },
  {
    section: 'Marketing & CRM',
    items: [
      { id: 'marketing', label: 'Marketing Hub',  icon: TrendingUp },
      { id: 'seo',       label: 'SEO Center',    icon: Search, badge: '87', badgeColor: 'warning' },
      { id: 'crm',       label: 'CRM & Leads',   icon: MessageSquare, badge: 2, badgeColor: 'success' },
    ],
  },
  {
    section: 'Content',
    items: [
      { id: 'content-studio', label: 'Content Studio', icon: FileText },
      { id: 'cms',            label: 'Portfolio CMS',  icon: Globe },
      { id: 'projects',       label: 'Projects',       icon: Folder },
      { id: 'blog',           label: 'Blog CMS',       icon: BookOpen },
      { id: 'media',          label: 'Media Library',  icon: Image },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { id: 'ai',         label: 'AI Center',     icon: Cpu },
      { id: 'automation', label: 'AI Automation', icon: Sparkles, badge: 'n8n', badgeColor: 'neutral' },
    ],
  },
  {
    section: 'System',
    items: [
      { id: 'connections', label: 'Connections',     icon: Link2, badge: '12', badgeColor: 'neutral' },
      { id: 'reports',     label: 'Report Center',   icon: Printer },
      { id: 'users',       label: 'User Management', icon: Users },
      { id: 'settings',    label: 'Settings',        icon: Settings },
      { id: 'profile',     label: 'Profile',         icon: User },
    ],
  },
];

const BADGE_COLORS: Record<string, string> = {
  success:  'rgba(34,197,94,0.18)',
  warning:  'rgba(245,158,11,0.18)',
  danger:   'rgba(239,68,68,0.18)',
  primary:  'rgba(46,90,255,0.18)',
  neutral:  'rgba(255,255,255,0.08)',
};

const BADGE_TEXT_COLORS: Record<string, string> = {
  success: 'var(--dmos-success-light)',
  warning: 'var(--dmos-warning-light)',
  danger:  'var(--dmos-danger-light)',
  primary: 'var(--dmos-primary-light)',
  neutral: 'var(--dmos-text-muted)',
};

interface SidebarProps {
  activeModule: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule, onNavigate, collapsed, onToggle, mobileOpen = false, onMobileClose,
}) => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number } | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen && onMobileClose) onMobileClose();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, onMobileClose]);

  const handleItemHover = (itemId: string) => {
    setHoveredItem(itemId);
    const btn = buttonRefs.current[itemId];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setTooltipPos({ top: rect.top + rect.height / 2 });
    }
  };

  const avatarChar = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Admin';
  const userRole = (user as any)?.role || 'Owner';

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>

      {/* ── Logo Header ── */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center',
        justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
        padding: collapsed && !isMobile ? '0 12px' : '0 16px',
        borderBottom: '1px solid var(--dmos-border)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--dmos-primary) 0%, var(--dmos-secondary) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '0.88rem', color: '#fff',
            boxShadow: '0 2px 8px rgba(46,90,255,0.4)',
          }}>D</div>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--dmos-text)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                DMOS
              </div>
              <div style={{ fontSize: '0.58rem', color: 'var(--dmos-text-subtle)', letterSpacing: '0.10em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Enterprise OS
              </div>
            </motion.div>
          )}
        </div>

        {/* Toggle Button */}
        {isMobile ? (
          <button
            onClick={onMobileClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--dmos-border)',
              borderRadius: 7, color: 'var(--dmos-text-muted)', cursor: 'pointer',
              padding: 7, display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)',
              borderRadius: 7, color: 'var(--dmos-text-subtle)', cursor: 'pointer',
              padding: 7, display: 'flex', alignItems: 'center',
              transition: 'all 0.15s',
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}
      </div>

      {/* ── Navigation List ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 0' }}>
        {NAV.map(section => (
          <div key={section.section} style={{ marginBottom: 4 }}>
            {(!collapsed || isMobile) && (
              <div style={{
                padding: '10px 20px 5px',
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.09em', textTransform: 'uppercase',
                color: 'var(--dmos-text-disabled)',
              }}>
                {section.section}
              </div>
            )}
            {collapsed && !isMobile && <div style={{ height: 6 }} />}

            {section.items.map(item => {
              const isActive = activeModule === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <div key={item.id} style={{ position: 'relative', padding: '0 8px' }}>
                  <button
                    ref={el => { buttonRefs.current[item.id] = el; }}
                    onClick={() => { onNavigate(item.id); if (isMobile && onMobileClose) onMobileClose(); }}
                    onMouseEnter={() => handleItemHover(item.id)}
                    onMouseLeave={() => { setHoveredItem(null); setTooltipPos(null); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: collapsed && !isMobile ? 0 : 10,
                      padding: collapsed && !isMobile ? '10px 0' : '9px 12px',
                      justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                      background: isActive
                        ? 'linear-gradient(90deg, rgba(46,90,255,0.18), rgba(46,90,255,0.08))'
                        : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                      border: 'none',
                      borderRadius: 9,
                      color: isActive ? 'var(--dmos-primary-light)' : 'var(--dmos-text-muted)',
                      fontSize: '0.82rem', fontWeight: isActive ? 600 : 450,
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s cubic-bezier(0.4,0,0.2,1)',
                      position: 'relative',
                      minHeight: 38,
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Active left bar */}
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: -8, top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3, height: '60%',
                        background: 'var(--dmos-primary)',
                        borderRadius: '0 2px 2px 0',
                      }} />
                    )}

                    <item.icon
                      size={17}
                      color={isActive ? 'var(--dmos-primary-light)' : isHovered ? 'var(--dmos-text)' : 'var(--dmos-text-subtle)'}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />

                    {(!collapsed || isMobile) && (
                      <span style={{ flex: 1, lineHeight: 1 }}>{item.label}</span>
                    )}

                    {(!collapsed || isMobile) && item.badge !== undefined && (
                      <span style={{
                        fontSize: '0.62rem', fontWeight: 700,
                        padding: '2px 6px', borderRadius: 'var(--dmos-radius-full)',
                        background: BADGE_COLORS[item.badgeColor ?? 'neutral'],
                        color: BADGE_TEXT_COLORS[item.badgeColor ?? 'neutral'],
                        lineHeight: 1,
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* Collapsed Tooltip */}
                  {collapsed && !isMobile && isHovered && tooltipPos && (
                    <div style={{
                      position: 'fixed', left: 82, top: tooltipPos.top,
                      transform: 'translateY(-50%)',
                      background: 'var(--dmos-card-elevated)',
                      border: '1px solid var(--dmos-border-strong)',
                      padding: '5px 11px', borderRadius: 7,
                      fontSize: '0.78rem', fontWeight: 600,
                      color: 'var(--dmos-text)',
                      boxShadow: 'var(--dmos-shadow-md)',
                      zIndex: 9999, pointerEvents: 'none', whiteSpace: 'nowrap',
                    }}>
                      {item.label}
                      {item.badge !== undefined && (
                        <span style={{ marginLeft: 6, fontSize: '0.62rem', opacity: 0.7 }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── User Footer ── */}
      <div style={{
        padding: 12, borderTop: '1px solid var(--dmos-border)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
        gap: 8, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, overflow: 'hidden' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--dmos-primary), var(--dmos-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.82rem', color: '#fff',
            boxShadow: '0 2px 8px rgba(46,90,255,0.35)',
          }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt={avatarChar} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            ) : avatarChar}
          </div>
          {(!collapsed || isMobile) && (
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dmos-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userName}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--dmos-text-subtle)', textTransform: 'capitalize' }}>
                {userRole}
              </div>
            </div>
          )}
        </div>
        {(!collapsed || isMobile) && (
          <button
            onClick={logout}
            style={{
              background: 'none', border: 'none', color: 'var(--dmos-text-subtle)',
              cursor: 'pointer', padding: 6, borderRadius: 6, flexShrink: 0,
              display: 'flex', alignItems: 'center',
              transition: 'color 0.15s',
            }}
            title="Sign out"
            aria-label="Sign out"
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--dmos-danger)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--dmos-text-subtle)')}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Mobile Drawer ──
  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                zIndex: 198,
              }}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.26, ease: [0, 0, 0.2, 1] }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: 280,
                background: 'var(--dmos-surface)',
                borderRight: '1px solid var(--dmos-border)',
                zIndex: 199, overflow: 'hidden',
                boxShadow: '8px 0 40px rgba(0,0,0,0.5)',
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // ── Desktop Sidebar ──
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, bottom: 28,
        background: 'var(--dmos-surface)',
        borderRight: '1px solid var(--dmos-border)',
        display: 'flex', flexDirection: 'column',
        zIndex: 100, overflow: 'hidden',
        boxShadow: '1px 0 0 var(--dmos-border)',
      }}
    >
      {sidebarContent}
    </motion.aside>
  );
};
