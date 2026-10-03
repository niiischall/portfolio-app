import routesConfig from '../../config/routes.json';

/** Normalize CMS slug values (#/about, #about, /about) to a BrowserRouter path. */
export const normalizePath = (slug: string | undefined): string => {
  if (!slug) return '/';
  const trimmed = slug.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }
  const withoutHash = trimmed.replace(/^#+/, '');
  const path = withoutHash.startsWith('/') ? withoutHash : `/${withoutHash}`;
  return path === '' ? '/' : path;
};

export const isExternalUrl = (url: string): boolean =>
  url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:');

const REDIRECTS: Record<string, string> = routesConfig.redirects;

/**
 * normalizePath, then follow renamed routes (e.g. /writings -> /writing).
 * Nav and CTA slugs live in Sanity, so this keeps links correct whether or not
 * the Studio edits have been made yet, without a client-side redirect hop.
 */
export const resolvePath = (slug: string | undefined): string => {
  const path = normalizePath(slug);
  if (isExternalUrl(path)) return path;
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  return REDIRECTS[clean] ?? clean;
};

/** True for routes the site actually serves. Removed sections return false. */
export const isLiveRoute = (path: string): boolean => path in routesConfig.routes;
