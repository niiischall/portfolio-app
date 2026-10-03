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

// No hardcoded fallback: a stale literal route list here is one more place for
// route names to drift out of sync. If the CMS has no links, render none.
const resolveFooterLinks = (
  footerLinks: FooterNavigationCollectionType[] | undefined,
  navigationLinks: NavigationCollectionType[] | undefined,
): FooterNavLink[] => {
  if (footerLinks?.length) return footerLinks;
  if (navigationLinks?.length) return navigationLinks;
  return [];
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
  const { email = '', copyright = '', socials = [], collection = [] } = data ?? {};
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
          <div className="md:col-span-5">
            {footerSocials.length > 0 ? (
              <>
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
              </>
            ) : null}

            {/* The address was previously only in the JSON-LD, i.e. readable by
                scrapers but not by people. This is the site's contact path. */}
            {email ? (
              <div className="mt-8">
                <FooterLabel>email</FooterLabel>
                <Button
                  href={`mailto:${email}`}
                  styles="text-link text-base font-sans text-primary hover:text-secondary transition-colors rounded-sm"
                  analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                  analyticsProperties={{ section: 'footer', surface: 'email', url: `mailto:${email}` }}
                >
                  {email}
                </Button>
              </div>
            ) : null}
          </div>

          {footerLinks.length > 0 ? (
            <nav className="md:col-span-7" aria-label="Footer navigation">
              <FooterLabel>pages</FooterLabel>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
                {footerLinks.map((link) => {
                  const isCurrent = pathname === normalizePath(link.slug.current);
                  return (
                    <li key={link._key}>
                      <Button
                        {...getLinkProps(link.slug.current)}
                        styles={`text-base font-sans lowercase transition-colors hover:text-secondary ${
                          isCurrent ? 'text-secondary' : 'text-primary'
                        }`}
                        ariaCurrent={isCurrent ? 'page' : undefined}
                        analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
                        analyticsProperties={{
                          surface: 'footer',
                          destination: normalizePath(link.slug.current),
                          label: link.title,
                        }}
                      >
                        {link.title}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : null}
        </div>

        <div className="mt-10 pt-6 border-t border-gray flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {copyrightText ? <p className="text-sm font-sans text-primary opacity-70">{copyrightText}</p> : null}
          <Button
            onClick={scrollToTop}
            styles="text-sm font-sans text-primary hover:text-secondary transition-colors self-start sm:self-auto rounded-sm"
            analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
            analyticsProperties={{ surface: 'footer', destination: '#top', label: 'back to top' }}
          >
            back to top ↑
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
