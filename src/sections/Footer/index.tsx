import React from 'react';
import { PortableText } from '@portabletext/react';
import type { TypedObject } from 'sanity';

import Button from '../../components/Button';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';

export interface FooterProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    email: string;
    copyright: string;
  };
}

const Footer: React.FC<FooterProps> = ({ data }) => {
  const { email = '', copyright = '', heading } = data ?? {};
  const { title = [] } = heading ?? {};
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright.replace(/\b20\d{2}\b/, String(currentYear));

  return (
    <footer className="px-4 pb-24 md:px-8 bg-light">
      <div className="max-w-4xl mx-auto border-t border-primary pt-12">
        <div className="flex flex-col space-y-2 text-left">
          <Button
            to="/"
            styles="text-2xl font-sans font-bold text-secondary text-left"
            analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
            analyticsProperties={{ surface: 'footer', destination: '/', label: 'home' }}
          >
            <PortableText value={title} />
          </Button>
          <p className="text-sm font-ovo text-primary">{email}</p>
          <p className="text-sm font-ovo text-primary">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
