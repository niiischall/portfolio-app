import React, { useMemo } from 'react';
import { PortableText } from '@portabletext/react';

import type { HeroSocialType, WritingsCollectionType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import IndexSection from '../../components/IndexSection';
import { toWritingItems } from '../Writings';
import { getLinkProps } from '../../utils/helpers/link-props';
import { heroPortableTextComponents } from '../../components/portableText/hero';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';
import { isExternalUrl, isLiveRoute, resolvePath } from '../../utils/helpers/routes';

export interface HeroProps {
  data: {
    socials: HeroSocialType[];
    greeting: {
      link: {
        text: string;
        slug: {
          current: string;
        };
      };
      text: TypedObject[];
    };
    cover?: {
      asset: {
        _type: string;
        _ref: string;
      };
      _type: string;
    };
  };
  /** Fallback target for a CTA that pointed at the removed /contact page. */
  footerEmail?: string;
  writings?: WritingsCollectionType[];
}

// The home page is an index: greeting, then the most recent writing. "Recent"
// is the order authored in Studio — reorder there to change what shows.
const RECENT_COUNT = 3;

const Hero: React.FC<HeroProps> = ({ data, footerEmail, writings = [] }) => {
  const recentWriting = useMemo(() => toWritingItems(writings).slice(0, RECENT_COUNT), [writings]);
  const { greeting } = data ?? {};
  const { link, text: greetingText = [] } = greeting ?? {};
  const { text: buttonText = '', slug } = link ?? {};
  const { current: buttonSlug = '' } = slug ?? {};
  // The CTA slug lives in Sanity. If it targets a route that no longer exists
  // (it pointed at /contact, which was removed), send it to email instead —
  // that's where contact moved — rather than linking to a 404.
  const resolvedCta = buttonSlug ? resolvePath(buttonSlug) : '';
  const ctaIsDead = Boolean(resolvedCta) && !isExternalUrl(resolvedCta) && !isLiveRoute(resolvedCta);
  const ctaDestination = ctaIsDead ? (footerEmail ? `mailto:${footerEmail}` : '') : resolvedCta;
  const ctaLinkProps = ctaDestination ? getLinkProps(ctaDestination) : null;
  const showAboutCrossLink = ctaDestination !== '/about';
  const heroBtnStyles = 'btn lowercase !mt-0';

  return (
    <section
      className="relative w-full md:mx-auto px-4 pt-10 pb-24 flex-1 md:px-8 md:pt-16"
      id="home"
    >
      <div className="max-w-4xl md:mx-auto">
        <div className="max-w-lg w-full min-w-0 lg:max-w-lg">
          <PortableText value={greetingText} components={heroPortableTextComponents} />
          <div className="flex flex-col gap-3 mt-6 w-full md:flex-row md:flex-wrap md:items-center md:gap-4 md:mt-8">
            {buttonText && ctaLinkProps ? (
              <Button
                {...ctaLinkProps}
                styles={heroBtnStyles}
                analyticsEvent={ANALYTICS_EVENTS.CTA_CLICK}
                analyticsProperties={{
                  section: 'hero',
                  label: buttonText,
                  destination: ctaDestination,
                }}
              >
                {buttonText}
              </Button>
            ) : null}
            {showAboutCrossLink ? (
              <Button
                to="/about"
                styles={heroBtnStyles}
                analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
                analyticsProperties={{
                  section: 'hero',
                  surface: 'cross_link',
                  destination: '/about',
                  label: 'more about me',
                }}
              >
                more about me
              </Button>
            ) : null}
          </div>
        </div>
        {recentWriting.length > 0 ? (
          <div className="mt-16 md:mt-24">
            <IndexSection
              id="recent-writing"
              label="writing"
              items={recentWriting}
              analyticsSection="home_writing"
              allLink={{ to: '/writing', text: 'All writing' }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Hero;
