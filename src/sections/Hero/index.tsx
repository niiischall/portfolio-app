import React, { useMemo } from 'react';

import type { HeroSocialType, WritingsCollectionType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import IndexSection from '../../components/IndexSection';
import { toWritingItems } from '../Writings';
import { getLinkProps } from '../../utils/helpers/link-props';
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

type Block = { style?: string; children?: { text?: string }[] };

const blockText = (block: Block) => (block.children ?? []).map((child) => child.text ?? '').join('').trim();

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
  // The CMS greeting is heading blocks ("hey 👋, i'm", "nischal") followed by
  // the tagline. The headings join into one <h1> on a single line — they were
  // rendered as an <h2> above the <h1>, an inverted heading order — and the
  // rest becomes the intro paragraph.
  const blocks = greetingText as Block[];
  const headline = blocks
    .filter((block) => block.style?.startsWith('h'))
    .map(blockText)
    .filter(Boolean)
    .join(' ');
  const intro = blocks
    .filter((block) => !block.style?.startsWith('h'))
    .map(blockText)
    .filter(Boolean)
    .join(' ');

  const inlineLink = 'text-primary underline decoration-muted underline-offset-4 hover:decoration-current rounded-sm';

  return (
    <section className="relative w-full md:mx-auto px-4 pt-12 pb-24 flex-1 md:px-8 md:pt-20" id="home">
      <div className="max-w-4xl md:mx-auto">
        <div className="max-w-2xl">
          {headline ? <h1>{headline}</h1> : null}

          {/* Onward links sit inline in the prose instead of as buttons. */}
          <p className="mt-6 font-serif text-[1.25rem] leading-[1.65] text-primary/80 md:text-[1.375rem]">
            {intro ? `${intro} ` : null}
            Read my{' '}
            <Button
              to="/writing"
              styles={inlineLink}
              analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
              analyticsProperties={{ section: 'hero', surface: 'intro', destination: '/writing', label: 'writing' }}
            >
              writing
            </Button>
            {showAboutCrossLink ? (
              <>
                , find out{' '}
                <Button
                  to="/about"
                  styles={inlineLink}
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
              </>
            ) : null}
            {buttonText && ctaLinkProps ? (
              <>
                , or let&apos;s{' '}
                <Button
                  {...ctaLinkProps}
                  styles={inlineLink}
                  analyticsEvent={ANALYTICS_EVENTS.CTA_CLICK}
                  analyticsProperties={{ section: 'hero', label: buttonText, destination: ctaDestination }}
                >
                  {buttonText}
                </Button>
              </>
            ) : null}
            .
          </p>
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
