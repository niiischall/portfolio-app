import React from 'react';
import { GithubLogo, Globe, LinkedinLogo, XLogo, type Icon } from '@phosphor-icons/react';

import Button from './Button';
import { PERSON_NAME } from '../config/site';
import { ANALYTICS_EVENTS } from '../utils/helpers/analytics';
import type { FooterSocialType, HeroSocialType } from '../utils/helpers/types';

/** Footer socials if set in the CMS, otherwise the hero's. */
export const resolveSocials = (
  footerSocials: FooterSocialType[] | undefined,
  heroSocials: HeroSocialType[] | undefined,
): FooterSocialType[] => {
  if (footerSocials?.length) return footerSocials;
  return (heroSocials ?? []) as FooterSocialType[];
};

// The CMS stores each social as a fixed-colour image, which was nearly
// invisible in dark mode. Icons are picked from the URL instead, so they take
// the text colour in both themes and get a proper accessible name (the CMS
// captions read "LinkedIn URL").
const NETWORKS: { match: RegExp; name: string; Icon: Icon }[] = [
  { match: /(^|\.)linkedin\.com$/, name: 'LinkedIn', Icon: LinkedinLogo },
  { match: /(^|\.)(x|twitter)\.com$/, name: 'X', Icon: XLogo },
  { match: /(^|\.)github\.com$/, name: 'GitHub', Icon: GithubLogo },
];

export const networkFor = (url: string) => {
  try {
    const host = new URL(url).hostname;
    return NETWORKS.find((network) => network.match.test(host));
  } catch {
    return undefined;
  }
};

interface SocialLinksProps {
  socials: FooterSocialType[];
  /** Analytics surface, e.g. 'header' or 'footer'. */
  surface: string;
  iconSize?: number;
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socials, surface, iconSize = 24, className = '' }) => {
  if (socials.length === 0) return null;

  return (
    <ul className={`flex items-center ${className}`} aria-label="Social links">
      {socials.map((social) => {
        const network = networkFor(social.url);
        const NetworkIcon = network?.Icon ?? Globe;
        const label = network ? `${PERSON_NAME} on ${network.name}` : social.alt || social.caption;
        return (
          <li key={social._key}>
            <Button
              href={social.url}
              external
              styles="flex h-11 w-11 items-center justify-center rounded-sm text-muted transition-colors hover:text-primary"
              analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
              analyticsProperties={{ section: surface, surface: 'social', url: social.url }}
              ariaLabel={label}
            >
              <NetworkIcon size={iconSize} weight="fill" aria-hidden="true" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialLinks;
