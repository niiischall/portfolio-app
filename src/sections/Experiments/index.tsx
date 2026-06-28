import React from 'react';
import { PortableText } from '@portabletext/react';

import type { ExperimentCollectionType } from '../../utils/helpers/types';
import { urlForImage } from '../../lib/sanity.image';
import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import Click from '../../utils/svgs/Click';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';

export interface ExperimentsProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    collection: ExperimentCollectionType[];
  };
}

const Experiments: React.FC<ExperimentsProps> = ({ data }) => {
  const { heading, collection = [] } = data ?? {};
  const { title = [] } = heading ?? {};

  return (
    <section className="pt-12 pb-24 px-4 md:px-8" id="experiments">
      <div className="flex flex-col justify-center items-start space-y-24 max-w-4xl md:mx-auto">
        <div className="text-left md:text-center p-0">
          <PortableText value={title} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 w-full">
          {collection.map((item: ExperimentCollectionType) => {
            const { _key = '', heading = '', body = '', link, image = {} } = item ?? {};
            const { href = '' } = link ?? {};
            return (
              <div key={_key} className="w-full">
                {href ? (
                  <Button
                    href={href}
                    external
                    styles="group"
                    analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                    analyticsProperties={{ section: 'experiments', label: heading, url: href }}
                  >
                    <div className="mb-6 h-[300px] w-auto max-h-[250px] overflow-hidden flex flex-col justify-center items-start">
                      <img
                        src={urlForImage(image)?.height(250).url()}
                        alt={heading}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="flex gap-2 items-start">
                        <h3 className="text-2xl font-sans font-bold mb-4 text-left">{heading}</h3>
                        <Click style={{ width: '18px', height: '18px' }} aria-hidden="true" />
                      </div>
                      <p className="text-base mb-4 text-left">{body}</p>
                    </div>
                  </Button>
                ) : (
                  <div>
                    <div className="mb-6 h-[300px] w-auto max-h-[250px] overflow-hidden flex flex-col justify-center items-start">
                      <img
                        src={urlForImage(image)?.height(250).url()}
                        alt={heading}
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-2xl font-sans font-bold mb-4 text-left">{heading}</h3>
                    <p className="text-base mb-4 text-left">{body}</p>
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

export default Experiments;
