/**
 * Property convention for click events — keep to it so insights can break
 * down by location with a single property:
 *   section     where on the site: header, footer, mobile_menu, hero, home_writing,
 *               writings, about, work, not_found
 *   surface     which kind of element: nav, wordmark, menu_button, social, email,
 *               intro, row, all_link, cv, find_me, company, rich_text, back_home
 *   label       the visible text
 *   destination internal path (nav_click), url  external URL (external_click)
 *
 * cta_click was retired with the hero's "work together" button; insights built
 * on it stop receiving data from the redesign's deploy date.
 */
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: '$pageview',
  NAV_CLICK: 'nav_click',
  EXTERNAL_CLICK: 'external_click',
  MENU_TOGGLE: 'menu_toggle',
  SCROLL_DEPTH: 'scroll_depth',
  THEME_CHANGE: 'theme_change',
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
