import React, { useMemo } from 'react';

import PortfolioGridSection from '../../components/PortfolioGridSection';
import type { WritingsCollectionType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';

export interface WritingsProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    collection: WritingsCollectionType[];
  };
}

const Writings: React.FC<WritingsProps> = ({ data }) => {
  const { heading, collection = [] } = data ?? {};
  const { title = [] } = heading ?? {};

  const items = useMemo(
    () =>
      collection.map((item) => ({
        _key: item._key,
        heading: item.heading,
        body: item.body,
        image: item.image,
        href: item.link || undefined,
      })),
    [collection],
  );

  return (
    <PortfolioGridSection id="writings" title={title} collection={items} analyticsSection="writings" />
  );
};

export default Writings;
