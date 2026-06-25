import React from 'react';
import { PortableText } from '@portabletext/react';

import { urlForImage } from '../../lib/sanity.image';
import type { HeroSocialType } from '../../utils/helpers/types';
import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import Click from '../../utils/svgs/Click';
import { getLinkProps } from '../../utils/helpers/link-props';

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
                styles="mb-6 w-[40px] flex justify-center md:w-12"
                analyticsLabel={`hero-social--${social.url}`}
                ariaLabel={social.alt}
              >
                <img src={urlForImage(social.cover)?.width(24).url()} alt="" aria-hidden="true" />
              </Button>
            );
          })}
        </div>
        <div className="max-w-lg pl-12 md:pl-0 lg:max-w-lg">
          <PortableText value={greetingText} />
          {buttonText && ctaLinkProps ? (
            <Button {...ctaLinkProps} styles="btn mt-8 lowercase" analyticsLabel={`hero-${buttonSlug}`}>
              <div className="flex gap-1">
                {buttonText}
                <Click style={{ width: '16px', height: '16px' }} />
              </div>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Hero;
