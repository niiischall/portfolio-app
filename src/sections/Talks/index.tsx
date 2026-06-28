import React from 'react';

import { PortableText } from '@portabletext/react';
import { urlForImage } from '../../lib/sanity.image';
import { TalkCollectionType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import Click from '../../utils/svgs/Click';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';

export interface TalksProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    collection: TalkCollectionType[];
  };
}

const Talks: React.FC<TalksProps> = ({ data }) => {
  const { heading, collection } = data ?? {};
  const { title = [] } = heading ?? {};

  return (
    <section className="px-4 pt-12 pb-24 md:px-8" id="talks">
      <div className="flex flex-col justify-center items-start space-y-24 max-w-4xl mx-auto">
        <div className="text-left md:text-center p-0">
          <PortableText value={title} />
        </div>
        <div className="flex flex-col space-y-24 justify-center">
          {collection?.map((item: TalkCollectionType) => {
            const { _key = '', heading = '', body = '', link, cover = {} } = item ?? {};
            const { url = '' } = link ?? {};
            return (
              <div key={_key} className="w-full py-2">
                {url ? (
                  <Button
                    href={url}
                    external
                    styles="group"
                    analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                    analyticsProperties={{ section: 'talks', label: heading, url }}
                  >
                    <div className="mb-12 w-auto overflow-hidden flex flex-col justify-start items-start">
                      <img
                        className="rounded-md shadow-xl"
                        src={urlForImage(cover)?.height(350).width(450).url()}
                        alt={heading}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <h3 className="text-2xl font-sans font-bold mb-4 text-left">{heading}</h3>
                        <Click style={{ width: '18px', height: '18px' }} aria-hidden="true" />
                      </div>
                      <p className="text-base mb-4 text-left max-w-2xl">{body}</p>
                    </div>
                  </Button>
                ) : (
                  <div>
                    <div className="mb-12 w-auto overflow-hidden flex flex-col justify-start items-start">
                      <img
                        className="rounded-md shadow-xl"
                        src={urlForImage(cover)?.height(350).width(450).url()}
                        alt={heading}
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-2xl font-sans font-bold mb-4 text-left">{heading}</h3>
                    <p className="text-base mb-4 text-left max-w-2xl">{body}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Talks;
