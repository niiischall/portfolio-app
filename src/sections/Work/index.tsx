import React from 'react';
import { PortableText } from '@portabletext/react';

import { WorkCollectionType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';
import { sectionHeadingPortableTextComponents } from '../../components/portableText/pageHeading';

export interface WorkProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    collection: WorkCollectionType[];
  };
}

// Highlights are entered one per line in Studio. A single line (how the
// existing entries are written) stays a paragraph.
const toHighlights = (description = '') =>
  description
    .split('\n')
    .map((line) => line.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean);

/** The work timeline, rendered as a section of /about. */
const Work: React.FC<WorkProps> = ({ data }) => {
  const { heading, collection = [] } = data ?? {};
  const { title = [] } = heading ?? {};

  return (
    <section id="work" className="px-4 pb-24 md:px-8">
      <div className="max-w-4xl md:mx-auto">
        <div className="mb-12">
          <PortableText value={title} components={sectionHeadingPortableTextComponents} />
        </div>

        <ol className="ml-[7px] border-l border-rule">
          {collection.map((item, index) => {
            const { designation = '', description = '', meta = '', link, duration } = item ?? {};
            const { name: orgName = '', href: orgLink = '' } = link ?? {};
            const { start = '', end = '' } = duration ?? {};
            const highlights = toHighlights(description);
            const isCurrent = index === 0;

            return (
              <li key={item._key} className="relative pb-14 pl-9 last:pb-0">
                {/* Rail marker: the current role is filled with a soft halo,
                    past roles are hollow rings. */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[7px] top-[0.35rem] h-[13px] w-[13px] rounded-full ${
                    isCurrent ? 'bg-primary ring-4 ring-primary/20' : 'border-2 border-muted bg-light'
                  }`}
                />

                {start || end ? (
                  <p className="font-[ui-monospace,SFMono-Regular,Menlo,monospace] text-[0.8125rem] tracking-[0.04em] text-muted">
                    {start}
                    {end ? ` – ${end}` : ''}
                  </p>
                ) : null}

                <h3 className="mt-2 font-sans text-[1.1875rem] font-semibold leading-snug">
                  {designation}
                  {orgName ? (
                    <>
                      <span className="font-normal text-muted"> at </span>
                      {orgLink ? (
                        <Button
                          href={orgLink}
                          styles="underline decoration-muted underline-offset-4 hover:decoration-current rounded-sm"
                          analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                          analyticsProperties={{ section: 'work', label: orgName, url: orgLink }}
                        >
                          {orgName}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </Button>
                      ) : (
                        orgName
                      )}
                    </>
                  ) : null}
                </h3>

                {meta ? <p className="mt-1 text-[0.9375rem] text-muted">{meta}</p> : null}

                {highlights.length > 1 ? (
                  <ul className="mt-4 max-w-2xl space-y-2.5">
                    {highlights.map((line) => (
                      <li
                        key={line}
                        className="relative pl-6 font-serif text-[1.0625rem] leading-relaxed text-primary/90 before:absolute before:left-0 before:top-[0.6em] before:h-[7px] before:w-[7px] before:rounded-full before:border before:border-muted"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : highlights.length === 1 ? (
                  <p className="mt-4 max-w-2xl font-serif text-[1.0625rem] leading-relaxed text-primary/90">
                    {highlights[0]}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Work;
