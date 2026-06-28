import React, { useMemo } from 'react';

import PortfolioGridSection from '../../components/PortfolioGridSection';
import type { TalkCollectionType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';

export interface TalksProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    collection: TalkCollectionType[];
  };
}

const Talks: React.FC<TalksProps> = ({ data }) => {
  const { heading, collection = [] } = data ?? {};
  const { title = [] } = heading ?? {};

  const items = useMemo(
    () =>
      collection.map((item) => ({
        _key: item._key,
        heading: item.heading,
        body: item.body,
        image: item.cover,
        href: item.link?.url || undefined,
      })),
    [collection],
  );

  return <PortfolioGridSection id="talks" title={title} collection={items} analyticsSection="talks" />;
};

export default Talks;
