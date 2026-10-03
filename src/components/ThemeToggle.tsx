import { Monitor, Moon, Sun } from '@phosphor-icons/react';

import { type ThemeChoice, useTheme } from '../context/ThemeContext';

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'system', label: 'Match system theme', Icon: Monitor },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
];

/**
 * Three-way light / system / dark switch.
 *
 * A native radio group: one tab stop, arrow keys move between options, and
 * screen readers announce it as a group — all from the platform. A single
 * aria-pressed button (the previous control) cannot express three states.
 */
const ThemeToggle = () => {
  const { choice, setTheme } = useTheme();

  return (
    <fieldset className="flex items-center gap-0.5 rounded-full border border-rule p-0.5">
      <legend className="sr-only">Theme</legend>
      {OPTIONS.map(({ value, label, Icon }) => (
        <label
          key={value}
          title={label}
          className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors [&:has(:focus-visible)]:outline [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-secondary ${
            choice === value ? 'bg-rule text-primary' : 'text-muted hover:text-primary'
          }`}
        >
          <input
            type="radio"
            name="theme"
            value={value}
            checked={choice === value}
            onChange={() => setTheme(value)}
            className="sr-only"
          />
          <Icon size={15} weight="regular" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </label>
      ))}
    </fieldset>
  );
};

export default ThemeToggle;
