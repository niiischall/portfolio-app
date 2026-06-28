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
          <nav className="md:col-span-7" aria-label="Footer navigation">
            <FooterLabel>explore</FooterLabel>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
              {footerLinks.map((item) => {
                const path = normalizePath(item.slug?.current);
                const isActive = pathname === path;
                const linkProps = getLinkProps(item.slug?.current);

                return (
                  <li key={item._key}>
                    <Button
                      {...linkProps}
                      styles={`text-base font-sans font-bold lowercase tracking-wide transition-colors duration-200 !mt-0 ${
                        isActive ? 'text-secondary' : 'text-primary hover:text-secondary'
                      }`}
                      analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
                      analyticsProperties={{
                        surface: 'footer',
                        destination: path,
                        label: item.title,
                      }}
                    >
                      {item.title}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

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

        <div className="mt-10 pt-6 border-t border-gray flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-ovo text-primary opacity-80">{copyrightText}</p>
          <Button
            type="button"
            styles="text-sm font-sans font-bold lowercase text-primary hover:text-secondary transition-colors duration-200 !mt-0"
            onClick={scrollToTop}
            analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
            analyticsProperties={{ surface: 'footer', destination: 'top', label: 'back to top' }}
          >
            back to top ↑
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
