import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { TypedObject } from 'sanity';

import Button from '../../components/Button';
import { urlForImage } from '../../lib/sanity.image';
import { getLinkProps } from '../../utils/helpers/link-props';
import { normalizePath } from '../../utils/helpers/routes';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';
import type {
  FooterNavigationCollectionType,
  FooterSocialType,
  HeroSocialType,
  NavigationCollectionType,
} from '../../utils/helpers/types';

type FooterNavLink = {
  _key: string | number;
  title: string;
  slug: {
    current: string;
  };
};

const DEFAULT_FOOTER_LINKS: FooterNavLink[] = [
  { _key: 'about', title: 'about', slug: { current: '/about' } },
  { _key: 'work', title: 'work', slug: { current: '/work' } },
  { _key: 'experiments', title: 'experiments', slug: { current: '/experiments' } },
  { _key: 'writings', title: 'blogs', slug: { current: '/writings' } },
  { _key: 'talks', title: 'talks', slug: { current: '/talks' } },
  { _key: 'contact', title: 'contact', slug: { current: '/contact' } },
];

const resolveFooterLinks = (
  footerLinks: FooterNavigationCollectionType[] | undefined,
  navigationLinks: NavigationCollectionType[] | undefined,
): FooterNavLink[] => {
  if (footerLinks?.length) return footerLinks;
  if (navigationLinks?.length) return navigationLinks;
  return DEFAULT_FOOTER_LINKS;
};

const resolveFooterSocials = (
  footerSocials: FooterSocialType[] | undefined,
  heroSocials: HeroSocialType[] | undefined,
): FooterSocialType[] => {
  if (footerSocials?.length) return footerSocials;
  return (heroSocials ?? []) as FooterSocialType[];
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
  navigation?: {
    collection: NavigationCollectionType[];
  };
  heroSocials?: HeroSocialType[];
}

const FooterLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs font-sans font-bold uppercase tracking-widest text-primary opacity-60 mb-4">{children}</p>
);

const Footer: React.FC<FooterProps> = ({ data, navigation, heroSocials }) => {
  const { pathname } = useLocation();
  const { copyright = '', socials = [], collection = [] } = data ?? {};
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright.replace(/\b20\d{2}\b/, String(currentYear));

  const footerLinks = useMemo(
    () => resolveFooterLinks(collection, navigation?.collection),
    [collection, navigation?.collection],
  );

  const footerSocials = useMemo(() => resolveFooterSocials(socials, heroSocials), [socials, heroSocials]);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer className="px-4 pb-12 pt-4 md:px-8 md:pb-16 bg-light" aria-label="Site footer">
      <div className="max-w-4xl mx-auto border-t border-primary pt-10 md:pt-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
          {footerSocials.length > 0 ? (
            <div className="md:col-span-5">
              <FooterLabel>connect</FooterLabel>
              <div className="flex flex-row flex-wrap items-center gap-3" aria-label="Social links">
                {footerSocials.map((social) => (
                  <Button
                    key={social._key}
                    href={social.url}
                    external
                    styles="icon-link min-w-[44px] min-h-[44px] flex items-center justify-center"
                    analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                    analyticsProperties={{ section: 'footer', surface: 'social', url: social.url }}
                    ariaLabel={social.alt || social.caption}
                  >
                    <img
                      className="w-6 h-6 object-contain"
                      src={urlForImage(social.cover)?.width(24).url()}
                      alt=""
                      aria-hidden="true"
                    />
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
