import React, { useCallback, useState } from 'react';
import { PortableText } from '@portabletext/react';
import { useNavigate } from 'react-router-dom';

import { urlForImage } from '../../lib/sanity.image';
import type { HeroSocialType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import { getLinkProps } from '../../utils/helpers/link-props';
import { heroPortableTextComponents } from '../../components/portableText/hero';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';
import { normalizePath } from '../../utils/helpers/routes';

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
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const { socials = [], greeting } = data ?? {};
  const { link, text: greetingText = [] } = greeting ?? {};
  const { text: buttonText = '', slug } = link ?? {};
  const { current: buttonSlug = '' } = slug ?? {};
  const ctaLinkProps = buttonSlug ? getLinkProps(buttonSlug) : null;
  const ctaDestination = buttonSlug ? normalizePath(buttonSlug) : '';
  const showAboutCrossLink = ctaDestination !== '/about';
  const heroBtnStyles = 'btn lowercase !mt-0';
  const navigate = useNavigate();
  const [aboutBtnPressed, setAboutBtnPressed] = useState(false);

  const handleMoreAboutClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (aboutBtnPressed) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        navigate('/about', { state: { pageEnter: true } });
        return;
      }

      setAboutBtnPressed(true);
      window.setTimeout(() => {
        navigate('/about', { state: { pageEnter: true } });
        setAboutBtnPressed(false);
      }, 220);
    },
    [aboutBtnPressed, navigate],
  );

  return (
    <section
      className="bg-light relative w-full md:mx-auto px-4 pt-6 pb-12 flex-1 md:px-8 md:pt-12 md:pb-48 "
      id="home"
    >
      <div className="max-w-4xl flex flex-col items-start justify-start md:flex-row md:items-start md:space-x-6 lg:space-x-12 md:mx-auto">
        <div className="flex flex-col absolute top-15 left-4 md:relative md:top-auto md:left-auto">
          {socials.map((social: HeroSocialType) => {
            return (
              <Button
                key={social._key}
                href={social.url}
                external
                styles="mb-6 min-w-[44px] min-h-[44px] flex items-center justify-center md:w-12"
                analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                analyticsProperties={{ section: 'hero', surface: 'social', url: social.url }}
                ariaLabel={social.alt}
              >
                <img src={urlForImage(social.cover)?.width(24).url()} alt="" aria-hidden="true" />
              </Button>
            );
          })}
        </div>
        <div className="max-w-lg pl-12 md:pl-0 lg:max-w-lg">
          <PortableText value={greetingText} components={heroPortableTextComponents} />
          <div className="flex flex-row flex-wrap items-center gap-4 mt-8 w-full">
            {buttonText && ctaLinkProps ? (
              <Button
                {...ctaLinkProps}
                styles={heroBtnStyles}
                analyticsEvent={ANALYTICS_EVENTS.CTA_CLICK}
                analyticsProperties={{
                  section: 'hero',
                  label: buttonText,
                  destination: normalizePath(buttonSlug),
                }}
              >
                {buttonText}
              </Button>
            ) : null}
            {showAboutCrossLink ? (
              <Button
                to="/about"
                styles={`${heroBtnStyles} btn-press ${aboutBtnPressed ? 'is-pressed' : ''}`}
                onClick={handleMoreAboutClick}
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
      </div>
    </section>
  );
};

export default Hero;
