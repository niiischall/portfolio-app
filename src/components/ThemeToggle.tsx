import { Moon, Sun } from '@phosphor-icons/react';

import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle header-icon-btn text-secondary hover:opacity-75 transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 rounded-sm"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      {isDark ? <Sun size={24} weight="regular" /> : <Moon size={24} weight="regular" />}
    </button>
  );
};

export default ThemeToggle;
