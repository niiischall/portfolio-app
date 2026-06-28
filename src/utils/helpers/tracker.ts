import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';

import { ANALYTICS_EVENTS, trackEvent } from './analytics';

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

const PostHogPageViewTracker = () => {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    trackEvent(posthog?.capture.bind(posthog), ANALYTICS_EVENTS.PAGE_VIEW, {
      path: location.pathname,
    });
  }, [location.pathname, posthog]);

  return null;
};

export const ScrollDepthTracker = () => {
  const location = useLocation();
  const posthog = usePostHog();
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current.clear();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const depth = Math.min(100, Math.round((window.scrollY / scrollHeight) * 100));

      for (const threshold of SCROLL_THRESHOLDS) {
        if (depth >= threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold);
          trackEvent(posthog?.capture.bind(posthog), ANALYTICS_EVENTS.SCROLL_DEPTH, {
            path: location.pathname,
            depth: threshold,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, posthog]);

  return null;
};

export default PostHogPageViewTracker;
