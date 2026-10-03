import React from 'react';
import { PortableText } from '@portabletext/react';
import type { TypedObject } from 'sanity';

import Button from './Button';
import { ANALYTICS_EVENTS } from '../utils/helpers/analytics';
import { pageHeadingPortableTextComponents } from './portableText/pageHeading';

export type IndexItem = {
  _key: string;
  heading: string;
  /** Right-hand slot: a date when there is one, else a short description. */
  meta?: string;
  href?: string;
};

export interface IndexSectionProps {
  id: string;
  items: IndexItem[];
  analyticsSection: string;
  /** Full page: the CMS heading becomes the page's <h1>. */
  title?: TypedObject[];
  /** Embedded section (e.g. on home): a tracked uppercase label as <h2>. */
  label?: string;
  /** "All writing →" style link to the full page. */
  allLink?: { to: string; text: string };
}

const IndexRow: React.FC<{ item: IndexItem; analyticsSection: string }> = ({ item, analyticsSection }) => {
  const content = (
    <>
      <span className="text-[1.0625rem] leading-snug text-primary decoration-muted underline-offset-4 group-hover:underline">
        {item.heading}
      </span>
      {item.meta ? (
        <span className="text-sm leading-relaxed text-muted sm:max-w-[45%] sm:shrink-0 sm:text-right">
          {item.meta}
        </span>
      ) : null}
    </>
  );
  const rowStyles = 'flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10';

  return (
    <li className="border-b border-rule">
      {item.href ? (
        // One anchor per row: a single tab stop, and the whole row is clickable.
        <Button
          href={item.href}
          styles={`group ${rowStyles} rounded-sm`}
          analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
          analyticsProperties={{ section: analyticsSection, label: item.heading, url: item.href }}
        >
          {content}
          {/^https?:/i.test(item.href) ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </Button>
      ) : (
        <div className={rowStyles}>{content}</div>
      )}
    </li>
  );
};

const IndexSection: React.FC<IndexSectionProps> = ({ id, items, analyticsSection, title, label, allLink }) => (
  <section id={id} className="w-full">
    {title ? (
      <div className="mb-8">
        <PortableText value={title} components={pageHeadingPortableTextComponents} />
      </div>
    ) : null}

    {label || allLink ? (
      <div className="flex items-baseline justify-between border-b border-rule pb-3">
        {label ? <h2 className="label !text-sm">{label}</h2> : <span />}
        {allLink ? (
          <Button
            to={allLink.to}
            styles="font-sans text-sm text-secondary hover:underline underline-offset-4 rounded-sm"
            analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
            analyticsProperties={{ surface: analyticsSection, destination: allLink.to, label: allLink.text }}
          >
            {allLink.text} <span aria-hidden="true">→</span>
          </Button>
        ) : null}
      </div>
    ) : (
      <div className="border-b border-rule" />
    )}

    <ul>
      {items.map((item) => (
        <IndexRow key={item._key} item={item} analyticsSection={analyticsSection} />
      ))}
    </ul>
  </section>
);

export default IndexSection;
