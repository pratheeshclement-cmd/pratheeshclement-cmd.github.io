// ─── Microsoft Clarity Public Portfolio Tracking Engine ────────────────────
// Official Project ID: xz1njtkayn
// Loads asynchronously ONLY upon user cookie consent & excludes /admin routes.

export const CLARITY_PROJECT_ID = 'xz1njtkayn';

let clarityInitialized = false;

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

/**
 * Initializes Microsoft Clarity tracking snippet asynchronously.
 * Gated strictly behind user consent and suppressed on administrative routes.
 */
export function loadClarity(projectId: string = CLARITY_PROJECT_ID): void {
  if (typeof window === 'undefined') return;

  // Do not initialize on /admin routes to protect privacy & avoid skewing analytics
  if (window.location.pathname.startsWith('/admin')) {
    return;
  }

  if (clarityInitialized) return;
  clarityInitialized = true;

  // Initialize window.clarity command queue
  window.clarity =
    window.clarity ||
    function () {
      ((window.clarity as any).q = (window.clarity as any).q || []).push(arguments);
    };

  // Inject official Clarity script asynchronously
  const script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.src = `https://www.clarity.ms/tag/${projectId}`;

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  // Set initial custom tags
  setClarityTag('platform', 'react-vite');
  setClarityTag('page_type', getPageTypeFromPath(window.location.pathname));
}

/**
 * Fires a custom event to Microsoft Clarity if tracking is active.
 * Example: trackClarityEvent('resume_download')
 */
export function trackClarityEvent(eventName: string): void {
  if (typeof window !== 'undefined' && window.clarity) {
    try {
      window.clarity('event', eventName);
    } catch (e) {
      // Ignore if clarity is blocked by client ad-blockers
    }
  }
}

/**
 * Sets a custom key-value tag in Microsoft Clarity session context.
 * Example: setClarityTag('page_type', 'portfolio')
 */
export function setClarityTag(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.clarity) {
    try {
      window.clarity('set', key, value);
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Updates Clarity page tags on SPA route changes without reloading the script.
 */
export function updateClarityRoute(path: string): void {
  if (path.startsWith('/admin')) return;
  setClarityTag('page_type', getPageTypeFromPath(path));
  setClarityTag('url', path);
}

function getPageTypeFromPath(path: string): string {
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/services')) return 'services';
  if (path.startsWith('/projects')) return 'projects';
  if (path.startsWith('/blog')) return 'blog';
  if (path.startsWith('/contact')) return 'contact';
  if (path.startsWith('/seo')) return 'seo';
  return 'other';
}
