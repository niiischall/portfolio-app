import React from 'react';
import { PortableText } from '@portabletext/react';

import { urlForImage } from '../../lib/sanity.image';
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

/** The work timeline, rendered as a section of /about. */
const Work: React.FC<WorkProps> = ({ data }) => {
  const { heading, collection = [] } = data ?? {};
  const { title = [] } = heading ?? {};

  return (
    <section id="work" className="px-4 pb-24 md:px-8">
      <div className="max-w-4xl md:mx-auto">
        <div className="mb-10">
          <PortableText value={title} components={sectionHeadingPortableTextComponents} />
        </div>

        <ol className="ml-1 border-l border-rule">
          {collection.map((item, index) => {
            const { designation = '', description = '', link, cover, duration } = item ?? {};
            const { name: orgName = '', href: orgLink = '' } = link ?? {};
            const { start = '', end = '' } = duration ?? {};
            const logo = cover ? urlForImage(cover)?.width(40).height(40).url() : undefined;

            return (
              <li key={item._key} className="relative pb-12 pl-8 last:pb-0">
                {/* Rail marker; the current role is filled. */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[5px] top-[0.55rem] h-[9px] w-[9px] rounded-full border ${
                    index === 0 ? 'border-primary bg-primary' : 'border-muted bg-light'
                  }`}
                />

                {start || end ? (
                  <p className="text-sm tracking-wide text-muted">
                    {start}
                    {end ? ` – ${end}` : ''}
                  </p>
                ) : null}

                <h3 className="mt-1 font-sans text-[1.125rem] font-semibold leading-snug">
                  {designation}
                  {orgName ? (
                    <>
                      <span className="font-normal text-muted"> at </span>
                      <span className="inline-flex items-center gap-1.5 align-baseline">
                        {logo ? (
                          <img
                            src={logo}
                            alt=""
                            className="h-5 w-5 self-center rounded-sm object-cover"
                            loading="lazy"
                          />
                        ) : null}
                        {orgLink ? (
                          <Button
                            href={orgLink}
                            styles="text-primary underline decoration-muted underline-offset-4 hover:decoration-current rounded-sm"
                            analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                            analyticsProperties={{ section: 'work', label: orgName, url: orgLink }}
                          >
                            {orgName}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </Button>
                        ) : (
                          orgName
                        )}
                      </span>
                    </>
                  ) : null}
                </h3>

                {description ? <p className="mt-3 max-w-2xl text-base text-primary/90">{description}</p> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Work;
