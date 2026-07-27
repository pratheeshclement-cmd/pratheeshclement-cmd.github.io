import { useState, useCallback } from 'react';
import { Theme } from '../types';

/**
 * useTheme
 * Returns the current theme and a toggle function.
 * Setting a theme adds `data-theme` on the <html> element so CSS custom
 * properties can be overridden for the dark palette defined in index.css.
 */
export function useTheme(initial: Theme = 'light') {
  const [theme, setTheme] = useState<Theme>(initial);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      // Sync with body class for backwards-compat with .dark-theme CSS
      document.body.classList.toggle('dark-theme', next === 'dark');
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
