import { Monitor, Moon, Sun } from '@phosphor-icons/react';
import { usePostHog } from 'posthog-js/react';

import { type ThemeChoice, useTheme } from '../context/ThemeContext';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/helpers/analytics';

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
  const posthog = usePostHog();

  const choose = (next: ThemeChoice) => {
    trackEvent(posthog?.capture.bind(posthog), ANALYTICS_EVENTS.THEME_CHANGE, {
      section: 'header',
      surface: 'theme_toggle',
      choice: next,
      previous: choice,
    });
    setTheme(next);
  };

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
            onChange={() => choose(value)}
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
