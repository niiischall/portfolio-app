import { useMemo } from 'react';

import {
  OG_IMAGE_PATH,
  PERSON_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
} from '../config/site';
import type { WritingsCollectionType } from '../utils/helpers/types';

interface StructuredDataProps {
  email?: string;
  writings?: WritingsCollectionType[];
}

const StructuredData = ({ email, writings = [] }: StructuredDataProps) => {
  const jsonLd = useMemo(() => {
    const person: Record<string, unknown> = {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON_NAME,
      url: SITE_URL,
      image: `${SITE_URL}${OG_IMAGE_PATH}`,
      sameAs: [...SOCIAL_PROFILES],
    };

    if (email) {
      person.email = email;
    }

    const website = {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#person` },
    };

    const blogPosts = writings
      .filter((item) => item.link && item.heading)
      .map((item) => ({
        '@type': 'BlogPosting',
        headline: item.heading,
        description: item.body,
        url: item.link,
        author: { '@id': `${SITE_URL}/#person` },
        publisher: { '@id': `${SITE_URL}/#person` },
        mainEntityOfPage: item.link,
      }));

    return {
      '@context': 'https://schema.org',
      '@graph': [person, website, ...blogPosts],
    };
  }, [email, writings]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default StructuredData;
