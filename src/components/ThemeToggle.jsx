import React from 'react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle({ compact }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className={`btn btn-outline ${compact ? 'px-2 py-1 text-[10px]' : ''}`}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
