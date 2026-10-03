import React, { useMemo } from 'react';
import { GithubLogo, Globe, LinkedinLogo, XLogo, type Icon } from '@phosphor-icons/react';
import type { TypedObject } from 'sanity';

import Button from '../../components/Button';
import { PERSON_NAME } from '../../config/site';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';
import type { FooterNavigationCollectionType, FooterSocialType, HeroSocialType } from '../../utils/helpers/types';

const resolveFooterSocials = (
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

const networkFor = (url: string) => {
  try {
    const host = new URL(url).hostname;
    return NETWORKS.find((network) => network.match.test(host));
  } catch {
    return undefined;
  }
};

export interface FooterProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    email: string;
    copyright: string;
    socials?: FooterSocialType[];
    collection?: FooterNavigationCollectionType[];
  };
  heroSocials?: HeroSocialType[];
}

const Footer: React.FC<FooterProps> = ({ data, heroSocials }) => {
  const { email = '', copyright = '', socials = [] } = data ?? {};
  const copyrightText = copyright.replace(/\b20\d{2}\b/, String(new Date().getFullYear()));
  const footerSocials = useMemo(() => resolveFooterSocials(socials, heroSocials), [socials, heroSocials]);

  return (
    <footer className="px-4 pt-8 pb-16 md:px-8" aria-label="Site footer">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="h-px w-24 bg-rule" aria-hidden="true" />

        {footerSocials.length > 0 ? (
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Social links">
            {footerSocials.map((social) => {
              const network = networkFor(social.url);
              const Icon = network?.Icon ?? Globe;
              const label = network ? `${PERSON_NAME} on ${network.name}` : social.alt || social.caption;
              return (
                <li key={social._key}>
                  <Button
                    href={social.url}
                    external
                    styles="flex h-11 w-11 items-center justify-center rounded-sm text-muted transition-colors hover:text-primary"
                    analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                    analyticsProperties={{ section: 'footer', surface: 'social', url: social.url }}
                    ariaLabel={label}
                  >
                    <Icon size={26} weight="fill" aria-hidden="true" />
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {copyrightText ? <p className="mt-6 text-base text-muted">{copyrightText}</p> : null}

        {/* With the contact page gone, this is the site's contact path. */}
        {email ? (
          <Button
            href={`mailto:${email}`}
            styles="mt-4 text-base text-muted underline decoration-rule underline-offset-[6px] transition-colors hover:text-primary hover:decoration-current rounded-sm"
            analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
            analyticsProperties={{ section: 'footer', surface: 'email', url: `mailto:${email}` }}
          >
            {email}
          </Button>
        ) : null}
      </div>
    </footer>
  );
};

export default Footer;
