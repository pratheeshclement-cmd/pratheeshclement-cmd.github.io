import React, { Suspense, lazy } from 'react';
import { useRouter, normalisePath } from '../router/useRouter';

// ── DMOS Admin App ─────────────────────────────────────────────────────────
// Lazy-loaded, completely isolated render tree — no shared styles with portfolio
const AdminApp = lazy(() => import('../admin/AdminApp').then(m => ({ default: m.AdminApp })));

const AboutPage = lazy(() => import('../pages/AboutPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const SEOPage = lazy(() => import('../pages/SEOPage'));
const DigitalMarketingPage = lazy(() => import('../pages/DigitalMarketingPage'));
const MetaAdsPage = lazy(() => import('../pages/MetaAdsPage'));
const GoogleAdsPage = lazy(() => import('../pages/GoogleAdsPage'));
const WebDevelopmentPage = lazy(() => import('../pages/WebDevelopmentPage'));
const AIAutomationPage = lazy(() => import('../pages/AIAutomationPage'));
const UIUXDesignPage = lazy(() => import('../pages/UIUXDesignPage'));
const GoogleSearchConsolePage = lazy(() => import('../pages/GoogleSearchConsolePage'));
const FreelancingPage = lazy(() => import('../pages/FreelancingPage'));
const CertificationsPage = lazy(() => import('../pages/CertificationsPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogArticlePage = lazy(() => import('../pages/BlogArticlePage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const CookiePolicyPage = lazy(() => import('../pages/CookiePolicyPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

interface AppRouterProps {
  homeComponent: React.ReactNode;
}

export const AppRouter: React.FC<AppRouterProps> = ({ homeComponent }) => {
  const { currentPath, getSlug } = useRouter();
  const normPath = normalisePath(currentPath);

  // ── /admin/* → DMOS admin panel (isolated render tree) ─────────────────
  if (normPath.startsWith('/admin')) {
    return (
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1220', color: '#94A3B8', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', flexDirection: 'column', gap: 16 }}>
          <div style={{ width: 36, height: 36, border: '3px solid #2E5AFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading DMOS…
        </div>
      }>
        <AdminApp />
      </Suspense>
    );
  }

  // If at root '/', render main Pratheesh OS cinematic homepage
  if (normPath === '/') {
    return <>{homeComponent}</>;
  }

  // Dynamic route matches (slugs under /projects/, /case-studies/, /blog/)
  const projectSlug = getSlug('/projects/');
  if (projectSlug) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <ProjectDetailPage slug={projectSlug} />
      </Suspense>
    );
  }

  const caseStudySlug = getSlug('/case-studies/');
  if (caseStudySlug) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <ProjectDetailPage slug={caseStudySlug} />
      </Suspense>
    );
  }

  const blogSlug = getSlug('/blog/');
  if (blogSlug) {
    return (
      <Suspense fallback={<RouteLoading />}>
        <BlogArticlePage slug={blogSlug} />
      </Suspense>
    );
  }

  // Static route matches
  switch (normPath) {
    case '/about/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <AboutPage />
        </Suspense>
      );
    case '/services/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <ServicesPage />
        </Suspense>
      );
    case '/seo/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <SEOPage />
        </Suspense>
      );
    case '/digital-marketing/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <DigitalMarketingPage />
        </Suspense>
      );
    case '/meta-ads/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <MetaAdsPage />
        </Suspense>
      );
    case '/google-ads/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <GoogleAdsPage />
        </Suspense>
      );
    case '/web-development/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <WebDevelopmentPage />
        </Suspense>
      );
    case '/ai-automation/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <AIAutomationPage />
        </Suspense>
      );
    case '/ui-ux-design/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <UIUXDesignPage />
        </Suspense>
      );
    case '/google-search-console/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <GoogleSearchConsolePage />
        </Suspense>
      );
    case '/freelancing/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <FreelancingPage />
        </Suspense>
      );
    case '/certifications/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <CertificationsPage />
        </Suspense>
      );
    case '/projects/':
    case '/case-studies/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <ProjectsPage />
        </Suspense>
      );
    case '/blog/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <BlogPage />
        </Suspense>
      );
    case '/contact/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <ContactPage />
        </Suspense>
      );
    case '/privacy-policy/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <PrivacyPolicyPage />
        </Suspense>
      );
    case '/terms/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <TermsPage />
        </Suspense>
      );
    case '/cookie-policy/':
      return (
        <Suspense fallback={<RouteLoading />}>
          <CookiePolicyPage />
        </Suspense>
      );
    default:
      return (
        <Suspense fallback={<RouteLoading />}>
          <NotFoundPage />
        </Suspense>
      );
  }
};

const RouteLoading: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-body)',
      fontSize: '0.9rem',
    }}
  >
    Loading Pratheesh OS content...
  </div>
);
