import React, { useMemo } from 'react';
import type { TypedObject } from 'sanity';

import IndexSection, { type IndexItem } from '../../components/IndexSection';
import { formatDate } from '../../utils/helpers/date';
import type { WritingsCollectionType } from '../../utils/helpers/types';

export interface WritingsProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    collection: WritingsCollectionType[];
  };
}

/** Shared by /writing and the home index so both rows render identically. */
export const toWritingItems = (collection: WritingsCollectionType[] = []): IndexItem[] =>
  collection.map((item) => ({
    _key: item._key,
    heading: item.heading,
    // Date when one is set in Studio, otherwise the summary.
    meta: formatDate(item.publishedAt) || item.body,
    href: item.link || undefined,
  }));

const Writings: React.FC<WritingsProps> = ({ data }) => {
  const { heading, collection = [] } = data ?? {};
  const items = useMemo(() => toWritingItems(collection), [collection]);

  return (
    <div className="px-4 pt-12 pb-24 md:px-8">
      <div className="max-w-4xl md:mx-auto">
        <IndexSection id="writing" title={heading?.title ?? []} items={items} analyticsSection="writings" />
      </div>
    </div>
  );
};

export default Writings;
