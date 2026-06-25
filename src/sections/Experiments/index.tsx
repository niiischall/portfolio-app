import React from 'react';
import { PortableText } from '@portabletext/react';

import type { ExperimentCollectionType } from '../../utils/helpers/types';
import { urlForImage } from '../../lib/sanity.image';
import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import Click from '../../utils/svgs/Click';

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
        <div className="flex flex-col space-y-24 justify-between">
          {collection.map((item: ExperimentCollectionType) => {
            const { _key = '', heading = '', body = '', link, image = {} } = item ?? {};
            const { href = '' } = link ?? {};
            return (
              <div key={_key} className="w-full md:w-1/3">
                {href ? (
                  <Button href={href} external styles="group" analyticsLabel={`navigation-experiments-${heading}`}>
                    <div className="mb-6 h-[300px] w-auto max-h-[250px] overflow-hidden flex flex-col justify-center items-start">
                      <img src={urlForImage(image)?.height(250).url()} alt={heading} />
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <h3 className="text-2xl font-sans font-bold mb-4 group-hover:text-secondary text-left">
                          {heading}
                        </h3>
                        <Click style={{ width: '18px', height: '18px' }} />
                      </div>
                      <p className="text-md mb-4 group-hover:text-secondary text-left">{body}</p>
                    </div>
                  </Button>
                ) : (
                  <div>
                    <div className="mb-6 h-[300px] w-auto max-h-[250px] overflow-hidden flex flex-col justify-center items-start">
                      <img src={urlForImage(image)?.height(250).url()} alt={heading} />
                    </div>
                    <h3 className="text-2xl font-sans font-bold mb-4 text-left">{heading}</h3>
                    <p className="text-md mb-4 text-left">{body}</p>
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
