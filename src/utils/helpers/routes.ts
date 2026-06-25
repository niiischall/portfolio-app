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
