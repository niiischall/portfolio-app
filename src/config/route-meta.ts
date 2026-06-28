import { PERSON_NAME, SITE_DESCRIPTION, SITE_TITLE } from './site';

export interface RouteMeta {
  title: string;
  description: string;
}

const pageTitle = (label: string) => `${label} · ${PERSON_NAME}`;

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  '/about': {
    title: pageTitle('about'),
    description:
      'Learn about Nischal Nikit - background, interests, and what he is working on in software and the web.',
  },
  '/work': {
    title: pageTitle('work'),
    description:
      'Work experience and roles at companies where Nischal Nikit has built products on the web.',
  },
  '/experiments': {
    title: pageTitle('experiments'),
    description:
      'Side projects and experiments by Nischal Nikit - prototypes, tools, and ideas explored outside day-to-day work.',
  },
  '/writings': {
    title: pageTitle('blogs'),
    description:
      'Essays and technical writing by Nischal Nikit on React, full-stack development, and building for the web.',
  },
  '/talks': {
    title: pageTitle('talks'),
    description:
      'Conference talks and presentations by Nischal Nikit on software engineering and web development.',
  },
  '/contact': {
    title: pageTitle('contact'),
    description: 'Get in touch with Nischal Nikit for collaboration, speaking, or general inquiries.',
  },
};

export const STUDIO_META: RouteMeta = {
  title: pageTitle('studio'),
  description: 'Content management for nischalnikit.xyz.',
};

export const getRouteMeta = (pathname: string): RouteMeta => {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (path.startsWith('/studio')) return STUDIO_META;
  return ROUTE_META[path] ?? ROUTE_META['/'];
};
