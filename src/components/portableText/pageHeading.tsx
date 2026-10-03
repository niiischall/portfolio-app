import type { PortableTextComponents } from '@portabletext/react';

/**
 * Promotes a CMS section heading to the page-level <h1>.
 *
 * Every route except the home page previously started at <h2>: the only <h1>
 * was the one the prerender snapshot emits inside `#ssg-fallback`, which is
 * `aria-hidden`, so assistive tech saw a document with no level-1 heading.
 *
 * Apply this to the *heading* field only — never to body copy, or headings
 * inside the prose get promoted too.
 */
export const pageHeadingPortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h1>{children}</h1>,
    h3: ({ children }) => <h2>{children}</h2>,
  },
};

export default pageHeadingPortableTextComponents;
