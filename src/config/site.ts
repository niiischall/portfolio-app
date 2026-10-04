export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://www.nischalnikit.xyz';

export const PERSON_NAME = 'Nischal Nikit';

export const SITE_NAME = 'Nischal Nikit';

export const SITE_DESCRIPTION =
  "hey 👋, i'm nischal nikit. i build things that live on the web. i also talk & write about some of those things. this is my corner of the internet.";

export const SITE_KEYWORDS = 'nischal nikit, personal website, portfolio';

export const OG_IMAGE_PATH = '/og-cover.jpg';

export const SOCIAL_PROFILES = [
  'https://github.com/niiischall',
  'https://www.linkedin.com/in/niiischall',
  'https://x.com/niiischall',
] as const;

/**
 * Facts about the person, used to make the schema.org Person entity
 * resolvable. A Person with only a name and a URL is not much use to a
 * knowledge graph. All of these are already stated on the site.
 */
export const PERSON_JOB_TITLE = 'Product Engineer';

export const PERSON_EMPLOYER = 'Acko';

export const PERSON_LOCATION = {
  city: 'Bangalore',
  country: 'India',
} as const;

export const PERSON_KNOWS_ABOUT = [
  'React',
  'React Native',
  'TypeScript',
  'Next.js',
  'Front-end architecture',
  'Design systems',
  'Web performance',
] as const;
