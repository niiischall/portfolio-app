import type { PortableTextComponents } from '@portabletext/react';
import { usePostHog } from 'posthog-js/react';
import type { ReactNode } from 'react';

import { ANALYTICS_EVENTS, trackEvent } from '../../utils/helpers/analytics';
import { isExternalUrl, normalizePath } from '../../utils/helpers/routes';

type LinkValue = {
  href?: string;
};

const getChildText = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getChildText).join('');
  return '';
};

function TrackedLink({
  value,
  children,
  section,
}: {
  value?: LinkValue;
  children: ReactNode;
  section: string;
}) {
  const posthog = usePostHog();
  const href = value?.href ?? '';
  const external = isExternalUrl(href);
  const label = getChildText(children) || href;

  const handleClick = () => {
    const capture = posthog?.capture.bind(posthog);

    if (external) {
      trackEvent(capture, ANALYTICS_EVENTS.EXTERNAL_CLICK, {
        section,
        url: href,
        label,
      });
      return;
    }

    trackEvent(capture, ANALYTICS_EVENTS.NAV_CLICK, {
      section,
      destination: normalizePath(href),
      label,
    });
  };

  if (!href) {
    return <span>{children}</span>;
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={external ? 'external-link' : undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

export const trackedPortableTextComponents = (section: string): PortableTextComponents => ({
  marks: {
    link: ({ children, value }) => (
      <TrackedLink value={value} section={section}>
        {children}
      </TrackedLink>
    ),
  },
});
