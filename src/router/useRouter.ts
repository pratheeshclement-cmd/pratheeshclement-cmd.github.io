// Lightweight SPA router for GitHub Pages static hosting.
// Handles path decoding, normalization, browser history (pushState/popstate), and link navigation.

import { useState, useEffect, useCallback } from 'react';

export function normalisePath(p: string): string {
  if (!p) return '/';
  // Strip query string & hash
  const clean = p.split('?')[0].split('#')[0];
  if (clean === '' || clean === '/' || clean === '/index.html') return '/';
  return clean.endsWith('/') ? clean : clean + '/';
}

function decodePath(): string {
  // On initial load, GitHub Pages 404.html may have redirected here with ?p=/path
  const search = window.location.search;
  if (search) {
    const params = new URLSearchParams(search);
    const p = params.get('p');
    if (p) {
      // Restore the actual URL without reloading the page
      const q = params.get('q') ? '?' + params.get('q')!.replace(/~and~/g, '&') : '';
      const restoredPath = p.replace(/~and~/g, '&') + q + window.location.hash;
      window.history.replaceState(null, '', restoredPath || '/');
      return normalisePath(restoredPath.split('?')[0]);
    }
  }
  return normalisePath(window.location.pathname);
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(decodePath);

  const navigate = useCallback((to: string) => {
    const path = normalisePath(to);
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalisePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);

    const handleNavigate = (e: Event) => {
      const path = (e as CustomEvent<string>).detail;
      if (path) navigate(path);
    };
    window.addEventListener('navigate', handleNavigate);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleNavigate);
    };
  }, [navigate]);

  const isHome = currentPath === '/';

  const getSlug = (prefix: string): string | null => {
    const normPrefix = normalisePath(prefix);
    if (!currentPath.startsWith(normPrefix)) return null;
    const rest = currentPath.slice(normPrefix.length).replace(/\/$/, '');
    return rest || null;
  };

  return { currentPath, navigate, isHome, getSlug };
}

// Global convenience function to trigger SPA navigation from anywhere
export function navigateTo(path: string) {
  window.dispatchEvent(new CustomEvent('navigate', { detail: path }));
}
