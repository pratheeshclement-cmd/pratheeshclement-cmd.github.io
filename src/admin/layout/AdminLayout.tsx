import React, { useState, lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, MessageSquare, BookOpen, Cpu, User } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { StatusBar } from './StatusBar';
import { NotificationProvider } from '../context/NotificationContext';
import { CommandPalette } from '../components/CommandPalette';
import '../design-system/tokens.css';

// Lazy-load modules
const DashboardPage     = lazy(() => import('../modules/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AnalyticsPage     = lazy(() => import('../modules/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const PerformancePage   = lazy(() => import('../modules/performance/PerformancePage').then(m => ({ default: m.PerformancePage })));
const WebsiteMonitorPage= lazy(() => import('../modules/monitor/WebsiteMonitorPage').then(m => ({ default: m.WebsiteMonitorPage })));
const MarketingHubPage  = lazy(() => import('../modules/marketing/MarketingHubPage').then(m => ({ default: m.MarketingHubPage })));
const SEOPage           = lazy(() => import('../modules/seo/SEOPage').then(m => ({ default: m.SEOPage })));
const CRMPage           = lazy(() => import('../modules/crm/CRMPage').then(m => ({ default: m.CRMPage })));
const ContentStudioPage = lazy(() => import('../modules/content-studio/ContentStudioPage').then(m => ({ default: m.ContentStudioPage })));
const CMSPage           = lazy(() => import('../modules/cms/CMSPage').then(m => ({ default: m.CMSPage })));
const ProjectsPage      = lazy(() => import('../modules/projects/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const BlogPage          = lazy(() => import('../modules/blog/BlogPage').then(m => ({ default: m.BlogPage })));
const MediaPage         = lazy(() => import('../modules/media/MediaPage').then(m => ({ default: m.MediaPage })));
const AIPage            = lazy(() => import('../modules/ai/AIPage').then(m => ({ default: m.AIPage })));
const AutomationPage    = lazy(() => import('../modules/automation/AutomationPage').then(m => ({ default: m.AutomationPage })));
const ReportCenterPage  = lazy(() => import('../modules/reports/ReportCenterPage').then(m => ({ default: m.ReportCenterPage })));
const IntegrationsPage  = lazy(() => import('../modules/integrations/IntegrationsPage').then(m => ({ default: m.IntegrationsPage })));
const ConnectionsPage   = lazy(() => import('../modules/connections/ConnectionsPage').then(m => ({ default: m.ConnectionsPage })));
const NotificationsPage = lazy(() => import('../modules/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SettingsPage      = lazy(() => import('../modules/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const UsersPage         = lazy(() => import('../modules/users/UsersPage').then(m => ({ default: m.UsersPage })));
const ProfilePage       = lazy(() => import('../modules/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));

const MODULE_MAP: Record<string, React.FC> = {
  dashboard:        DashboardPage     as React.FC,
  analytics:        AnalyticsPage     as React.FC,
  performance:      PerformancePage   as React.FC,
  monitor:          WebsiteMonitorPage as React.FC,
  marketing:        MarketingHubPage  as React.FC,
  seo:              SEOPage           as React.FC,
  crm:              CRMPage           as React.FC,
  'content-studio': ContentStudioPage as React.FC,
  cms:              CMSPage           as React.FC,
  projects:         ProjectsPage      as React.FC,
  blog:             BlogPage          as React.FC,
  media:            MediaPage         as React.FC,
  ai:               AIPage            as React.FC,
  automation:       AutomationPage    as React.FC,
  reports:          ReportCenterPage  as React.FC,
  integrations:     IntegrationsPage  as React.FC,
  connections:      ConnectionsPage   as React.FC,
  notifications:    NotificationsPage as React.FC,
  settings:         SettingsPage      as React.FC,
  users:            UsersPage         as React.FC,
  profile:          ProfilePage       as React.FC,
};

const MOBILE_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm',       label: 'CRM',       icon: MessageSquare },
  { id: 'blog',      label: 'Blog',      icon: BookOpen },
  { id: 'ai',        label: 'AI Center', icon: Cpu },
  { id: 'profile',   label: 'Profile',   icon: User },
];

function getModuleFromPath(): string {
  const path = window.location.pathname.replace(/\/$/, '');
  const parts = path.split('/admin');
  if (parts.length > 1 && parts[1]) {
    const mod = parts[1].replace(/^\//, '').split('/')[0];
    if (mod && MODULE_MAP[mod]) return mod;
  }
  return 'dashboard';
}

const ModuleFallback: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
    <div style={{ width: 36, height: 36, border: '3px solid var(--dmos-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'dmos-spin 0.8s linear infinite' }} />
    <div style={{ fontSize: '0.84rem', color: 'var(--dmos-text-muted)' }}>Loading {name}…</div>
  </div>
);

export const AdminLayout: React.FC = () => {
  const [activeModule, setActiveModuleState] = useState(getModuleFromPath);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.innerWidth < 768) return true;
    const saved = localStorage.getItem('dmos_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev: boolean) => {
      const next = !prev;
      localStorage.setItem('dmos_sidebar_collapsed', JSON.stringify(next));
      return next;
    });
  };

  const handleNavigate = (moduleId: string) => {
    setActiveModuleState(moduleId);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
    const newPath = moduleId === 'dashboard' ? '/admin/' : `/admin/${moduleId}/`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('px-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    const handlePopState = () => {
      setActiveModuleState(getModuleFromPath());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('popstate', handlePopState);

    const handleToggle = () => setIsCommandPaletteOpen(p => !p);
    window.addEventListener('dmos-toggle-command-palette', handleToggle);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('dmos-toggle-command-palette', handleToggle);
    };
  }, []);

  const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 72 : 260);
  const ActiveComponent = MODULE_MAP[activeModule];

  return (
    <NotificationProvider>
      <div className="dmos-root" style={{ minHeight: '100vh', display: 'flex', background: 'var(--dmos-bg)', overflowX: 'hidden' }}>
        <Sidebar
          activeModule={activeModule}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          mobileOpen={mobileDrawerOpen}
          onMobileClose={() => setMobileDrawerOpen(false)}
        />

        <Topbar
          activeModule={activeModule}
          onNavigate={handleNavigate}
          sidebarWidth={sidebarWidth}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onMobileMenuToggle={() => setMobileDrawerOpen(true)}
        />

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Main Workspace Area */}
        <main style={{
          marginLeft: sidebarWidth,
          marginTop: 60,
          marginBottom: isMobile ? 64 : 28,
          flex: 1,
          minHeight: 'calc(100vh - 88px)',
          background: 'var(--dmos-bg)',
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflowX: 'hidden',
          width: isMobile ? '100vw' : `calc(100vw - ${sidebarWidth}px)`,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
              style={{ minHeight: '100%' }}
            >
              <Suspense fallback={<ModuleFallback name={activeModule} />}>
                {ActiveComponent ? <ActiveComponent /> : (
                  <div style={{ padding: 40, color: 'var(--dmos-text-muted)', fontSize: '0.9rem' }}>
                    Module not found.
                  </div>
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Desktop Status Bar */}
        {!isMobile && <StatusBar sidebarWidth={sidebarWidth} />}

        {/* Mobile Bottom Navigation Bar */}
        {isMobile && (
          <div className="dmos-mobile-nav-bar">
            {MOBILE_NAV_ITEMS.map(nav => {
              const isActive = activeModule === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => handleNavigate(nav.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    color: isActive ? 'var(--dmos-primary-light)' : 'var(--dmos-text-muted)',
                    fontSize: '0.68rem', fontWeight: isActive ? 700 : 500,
                  }}
                >
                  <nav.icon size={20} color={isActive ? 'var(--dmos-primary-light)' : 'var(--dmos-text-muted)'} />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </NotificationProvider>
  );
};
