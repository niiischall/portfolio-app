/* eslint-disable react/prop-types */
import { usePostHog } from 'posthog-js/react';
import React from 'react';
import { Link } from 'react-router-dom';

import type { AnalyticsEventName, AnalyticsProperties } from '../utils/helpers/analytics';
import { trackEvent } from '../utils/helpers/analytics';

export interface ButtonProps {
  children: React.ReactNode;
  analyticsEvent: AnalyticsEventName;
  analyticsProperties?: AnalyticsProperties;
  styles?: string;
  onClick?: (_event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  to?: string;
  external?: boolean;
  type?: 'button' | 'submit';
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
}

const isExternalHref = (href: string) =>
  href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:');

const mergeStyles = (styles: string | undefined, extra?: string) =>
  [styles, extra].filter(Boolean).join(' ');

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    onClick,
    styles,
    analyticsEvent,
    analyticsProperties,
    children,
    href,
    to,
    external,
    type = 'button',
    ariaLabel,
    ariaExpanded,
    ariaControls,
  },
  ref,
) {
  const posthog = usePostHog();

  const track = () => {
    trackEvent(posthog?.capture.bind(posthog), analyticsEvent, analyticsProperties);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    track();
    onClick?.(event);
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    track();
    onClick?.(event);
  };

  if (to) {
    return (
      <Link to={to} className={styles} onClick={handleLinkClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (href) {
    const opensNewTab = external ?? isExternalHref(href);
    return (
      <a
        href={href}
        className={mergeStyles(styles, opensNewTab ? 'external-link' : undefined)}
        onClick={handleLinkClick}
        aria-label={ariaLabel}
        {...(opensNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={styles}
      onClick={handleButtonClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {children}
    </button>
  );
});

export default Button;
