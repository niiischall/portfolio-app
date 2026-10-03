import routesConfig from './routes.json';

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
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (path.startsWith('/studio')) return STUDIO_META;
  // Previously fell back to the home entry, so any unknown URL served the home
  // page's title and a self-referential canonical: a soft 404.
  return ROUTE_META[path] ?? NOT_FOUND_META;
};
