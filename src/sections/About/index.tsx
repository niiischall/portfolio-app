import React from 'react';
import { PortableText } from '@portabletext/react';
import { useLocation } from 'react-router-dom';

import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import { networkFor } from '../../components/SocialLinks';
import { trackedPortableTextComponents } from '../../components/portableText/tracked';
import { pageHeadingPortableTextComponents } from '../../components/portableText/pageHeading';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';
import type { FooterSocialType } from '../../utils/helpers/types';

export interface AboutProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    overview: TypedObject[];
    cv: {
      link: string;
      title: string;
    };
  };
  socials?: FooterSocialType[];
  email?: string;
}

const inlineLink =
  'whitespace-nowrap text-primary underline decoration-muted underline-offset-4 hover:decoration-current rounded-sm';

/** "A", "A and B", "A, B and C" */
const joinWithAnd = (parts: React.ReactNode[]) =>
  parts.map((part, index) => (
    <React.Fragment key={index}>
      {index === 0 ? null : index === parts.length - 1 ? ' and ' : ', '}
      {part}
    </React.Fragment>
  ));

const About: React.FC<AboutProps> = ({ data, socials = [], email = '' }) => {
  const { heading, overview = [], cv } = data ?? {};
  const { title: headingTitle = [] } = heading ?? {};
  const { link: cvLink = '', title: cvTitle = '' } = cv ?? {};

  const location = useLocation();
  const pageEnter = Boolean((location.state as { pageEnter?: boolean } | null)?.pageEnter);
  const portableTextComponents = trackedPortableTextComponents('about');

  // Built from the same social links and email as the footer, so the sentence
  // can't name a profile the site doesn't link to.
  const socialLinks = socials
    .map((social) => ({ social, network: networkFor(social.url) }))
    .filter(({ network }) => network)
    .map(({ social, network }) => (
      <Button
        key={social._key}
        href={social.url}
        external
        styles={inlineLink}
        analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
        analyticsProperties={{ section: 'about', surface: 'find_me', url: social.url }}
      >
        {network?.name}
      </Button>
    ));

  return (
    <section className={`pt-12 px-4 pb-20 md:px-8 ${pageEnter ? 'animate-page-enter' : ''}`} id="about">
      <div className="max-w-4xl md:mx-auto">
        <PortableText value={headingTitle} components={pageHeadingPortableTextComponents} />

        <div className="about-prose mt-8 max-w-3xl font-serif text-[1.1875rem] leading-[1.75] md:text-[1.3125rem]">
          <PortableText value={overview} components={portableTextComponents} />

          {socialLinks.length > 0 || email || cvLink ? (
            <p>
              {socialLinks.length > 0 ? <>Find me on {joinWithAnd(socialLinks)}</> : null}
              {email ? (
                <>
                  {socialLinks.length > 0 ? ', or at ' : 'Write to me at '}
                  <Button
                    href={`mailto:${email}`}
                    styles={inlineLink}
                    analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                    analyticsProperties={{ section: 'about', surface: 'find_me', url: `mailto:${email}` }}
                  >
                    {email}
                  </Button>
                </>
              ) : null}
              {socialLinks.length > 0 || email ? '. ' : null}
              {cvLink ? (
                <>
                  You can also read my{' '}
                  <Button
                    href={cvLink}
                    external
                    styles={inlineLink}
                    analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                    analyticsProperties={{ section: 'about', label: cvTitle || 'cv', url: cvLink }}
                  >
                    CV
                  </Button>
                  .
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default About;
