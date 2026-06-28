import type { PortableTextComponents } from '@portabletext/react';

/** Hero greeting: ensure a single page-level h1 on the home route. */
export const heroPortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h1>{children}</h1>,
    h3: ({ children }) => <h2>{children}</h2>,
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    link: ({ children }) => <span>{children}</span>,
  },
};
