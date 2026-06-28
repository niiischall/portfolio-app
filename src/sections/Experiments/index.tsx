import React, { useMemo } from 'react';

import PortfolioGridSection from '../../components/PortfolioGridSection';
import type { ExperimentCollectionType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';

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

  const items = useMemo(
    () =>
      collection.map((item) => ({
        _key: item._key,
        heading: item.heading,
        body: item.body,
        image: item.image,
        href: item.link?.href || undefined,
      })),
    [collection],
  );

  return (
    <PortfolioGridSection
      id="experiments"
      title={title}
      collection={items}
      analyticsSection="experiments"
    />
  );
};

export default Experiments;
