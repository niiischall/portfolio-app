/* eslint-disable react/prop-types */
import { usePostHog } from 'posthog-js/react';
import React from 'react';
import { Link } from 'react-router-dom';

export interface ButtonProps {
  children: React.ReactNode;
  analyticsLabel: string;
  analyticsData?: object;
  styles?: string;
  onClick?: () => void;
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    onClick,
    styles,
    analyticsLabel,
    analyticsData,
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
    posthog?.capture(analyticsLabel, analyticsData);
  };

  const handleButtonClick = () => {
    track();
    onClick?.();
  };

  const handleLinkClick = () => {
    track();
    onClick?.();
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
        className={styles}
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
