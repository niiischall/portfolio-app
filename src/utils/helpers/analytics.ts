export const ANALYTICS_EVENTS = {
  PAGE_VIEW: '$pageview',
  NAV_CLICK: 'nav_click',
  CTA_CLICK: 'cta_click',
  EXTERNAL_CLICK: 'external_click',
  MENU_TOGGLE: 'menu_toggle',
  SCROLL_DEPTH: 'scroll_depth',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsProperties = Record<string, string | number | boolean>;

export const trackEvent = (
  capture: ((_event: string, _properties?: AnalyticsProperties) => void) | undefined,
  event: AnalyticsEventName,
  properties?: AnalyticsProperties,
) => {
  capture?.(event, properties);
};
