import { useState, useCallback, useEffect } from 'react';
import { Theme } from '../types';

export function useTheme(initial: Theme = 'light') {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('px-theme');
    return (saved as Theme) || initial;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('px-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}
