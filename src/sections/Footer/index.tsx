import React, { useMemo } from 'react';
import type { TypedObject } from 'sanity';

import Button from '../../components/Button';
import SocialLinks, { resolveSocials } from '../../components/SocialLinks';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';
import type { FooterNavigationCollectionType, FooterSocialType, HeroSocialType } from '../../utils/helpers/types';

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
  const footerSocials = useMemo(() => resolveSocials(socials, heroSocials), [socials, heroSocials]);

  return (
    <footer className="px-4 pt-8 pb-16 md:px-8" aria-label="Site footer">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="h-px w-24 bg-rule" aria-hidden="true" />

        <SocialLinks socials={footerSocials} surface="footer" iconSize={26} className="mt-10 flex-wrap justify-center gap-2" />

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
