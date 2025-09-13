import { useEffect, useState, useCallback } from 'react';

const THEME_KEY = 'envoyou_theme';
const prefersDark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else {
      setTheme(prefersDark() ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, setTheme };
}
