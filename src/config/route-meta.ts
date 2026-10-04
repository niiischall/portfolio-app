import routesConfig from './routes.json';
import { resolvePath } from '../utils/helpers/routes';

export interface RouteMeta {
  title: string;
  description: string;
}

// routes.json is the single source of truth, shared with
// scripts/inject-prerender.mjs so the crawler and the browser can't disagree.
export const ROUTE_META: Record<string, RouteMeta> = routesConfig.routes;

export const NOT_FOUND_META: RouteMeta = routesConfig.notFound;

export const STUDIO_META: RouteMeta = {
  title: 'studio · Nischal Nikit',
  description: 'Content management for nischalnikit.xyz.',
};

export const getRouteMeta = (pathname: string): RouteMeta => {
  if (pathname.startsWith('/studio')) return STUDIO_META;
  // resolvePath strips the trailing slash and follows redirects, so /writings
  // reports /writing's meta during its client-side redirect instead of
  // flashing the 404 title and noindex.
  const path = resolvePath(pathname);
  // Previously fell back to the home entry, so any unknown URL served the home
  // page's title and a self-referential canonical: a soft 404.
  return ROUTE_META[path] ?? NOT_FOUND_META;
};
