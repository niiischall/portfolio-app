import { useEffect } from 'react';

import { OG_IMAGE_PATH, SITE_NAME, SITE_URL } from '../config/site';
import type { RouteMeta } from '../config/route-meta';

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const upsertRobots = (content: string | null) => {
  const existing = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!content) {
    existing?.remove();
    return;
  }
  upsertMeta('name', 'robots', content);
};

export interface PageMetaProps {
  meta: RouteMeta;
  pathname: string;
  noIndex?: boolean;
}

const PageMeta = ({ meta, pathname, noIndex = false }: PageMetaProps) => {
  useEffect(() => {
    const canonicalPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    const ogImage = `${SITE_URL}${OG_IMAGE_PATH}`;

    document.title = meta.title;
    upsertMeta('name', 'description', meta.description);
    upsertCanonical(canonicalUrl);
    upsertRobots(noIndex ? 'noindex, nofollow' : null);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', ogImage);
  }, [meta.description, meta.title, noIndex, pathname]);

  return null;
};

export default PageMeta;
