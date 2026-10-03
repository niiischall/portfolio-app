import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/** What the user picked. 'system' follows the OS, live. */
export type ThemeChoice = 'light' | 'dark' | 'system';
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

type ThemeContextValue = {
  /** The user's choice, for the toggle. */
  choice: ThemeChoice;
  /** What is actually applied. */
  theme: Theme;
  setTheme: (_choice: ThemeChoice) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

const systemTheme = (): Theme => (typeof window !== 'undefined' && darkQuery().matches ? 'dark' : 'light');

// Absent key means 'system'. Matches the pre-paint script in index.html, which
// treats anything other than 'light'/'dark' as "follow the OS".
const readStoredChoice = (): ThemeChoice => {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');

  // Read the live token rather than hardcoding hex, so the address bar can
  // never drift from the palette.
  const background = getComputedStyle(root).getPropertyValue('--color-light').trim();
  if (background) {
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', `rgb(${background})`);
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [choice, setChoice] = useState<ThemeChoice>(readStoredChoice);
  const [system, setSystem] = useState<Theme>(systemTheme);
  const theme: Theme = choice === 'system' ? system : choice;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow OS changes live. Harmless when an explicit choice is set: `theme`
  // simply ignores `system` then.
  useEffect(() => {
    const query = darkQuery();
    const onChange = () => setSystem(query.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Storage is written only on an explicit choice. The previous version wrote
  // it from an effect on every mount, which silently pinned first-time
  // visitors to whatever their OS was at that moment and lost "follow system".
  const setTheme = useCallback((next: ThemeChoice) => {
    setChoice(next);
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage: the choice still applies for this visit.
    }
  }, []);

  const value = useMemo(() => ({ choice, theme, setTheme }), [choice, theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
