import React from 'react';
import { PortableText } from '@portabletext/react';
import type { Image, TypedObject } from 'sanity';

import Button from './Button';
import Click from '../utils/svgs/Click';
import { urlForImage } from '../lib/sanity.image';
import { ANALYTICS_EVENTS } from '../utils/helpers/analytics';

export type PortfolioGridItem = {
  _key: string;
  heading: string;
  body: string;
  image: Image;
  href?: string;
};

export interface PortfolioGridSectionProps {
  id: string;
  title: TypedObject[];
  collection: PortfolioGridItem[];
  analyticsSection: 'experiments' | 'writings' | 'talks';
}

const PortfolioGridCard: React.FC<{
  item: PortfolioGridItem;
  analyticsSection: PortfolioGridSectionProps['analyticsSection'];
}> = ({ item, analyticsSection }) => {
  const { heading, body, image, href = '' } = item;

  const content = (
    <>
      <div className="mb-6 h-[300px] w-full max-h-[250px] overflow-hidden flex flex-col justify-center items-start">
        <img
          className="max-h-[250px] w-auto object-contain"
          src={urlForImage(image)?.height(250).url()}
          alt={heading}
          loading="lazy"
        />
      </div>
      <div>
        <h3 className="text-2xl font-sans font-bold mb-4 text-left">
          {heading}
          {href ? (
            <>
              {' '}
              <Click
                className="inline-block align-[-0.2em] ml-0.5"
                style={{ width: '18px', height: '18px' }}
                aria-hidden="true"
              />
            </>
          ) : null}
        </h3>
        <p className="text-base mb-4 text-left">{body}</p>
      </div>
    </>
  );

  if (!href) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <Button
      href={href}
      external
      styles="group block w-full"
      analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
      analyticsProperties={{ section: analyticsSection, label: heading, url: href }}
    >
      {content}
    </Button>
  );
};

const PortfolioGridSection: React.FC<PortfolioGridSectionProps> = ({
  id,
  title,
  collection,
  analyticsSection,
}) => (
  <section className="pt-12 pb-24 px-4 md:px-8" id={id}>
    <div className="flex flex-col justify-center items-start space-y-24 max-w-4xl md:mx-auto">
      <div className="text-left p-0 w-full">
        <PortableText value={title} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 w-full">
        {collection.map((item) => (
          <PortfolioGridCard key={item._key} item={item} analyticsSection={analyticsSection} />
        ))}
      </div>
    </div>
  </section>
);

export default PortfolioGridSection;
