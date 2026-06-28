import React from 'react';
import { PortableText } from '@portabletext/react';

import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import Click from '../../utils/svgs/Click';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';

export interface ContactProps {
  data: {
    heading: {
      title: TypedObject[];
    };
    text: TypedObject[];
    link: {
      text: string;
      href: string;
    };
  };
}

const Contact: React.FC<ContactProps> = ({ data }) => {
  const { heading, text = [], link } = data ?? {};
  const { title = [] } = heading ?? {};
  const { text: linkText = '', href = '' } = link ?? {};
  const isExternal = href.startsWith('http');

  return (
    <section
      className="w-full max-w-4xl mx-auto px-4 pt-24 pb-24 md:px-8 flex flex-col items-start text-left"
      id="contact"
    >
      <div className="pb-4 md:pb-8 w-full max-w-2xl">
        <PortableText value={title} />
      </div>
      <div className="pb-4 w-full max-w-2xl">
        <PortableText value={text} />
      </div>
      {href && linkText ? (
        <Button
          href={href}
          external={isExternal}
          styles="btn mt-8 lowercase inline-flex items-center gap-1 font-sans text-primary"
          analyticsEvent={isExternal ? ANALYTICS_EVENTS.EXTERNAL_CLICK : ANALYTICS_EVENTS.CTA_CLICK}
          analyticsProperties={{
            section: 'contact',
            label: linkText,
            destination: href,
          }}
        >
          <span className="flex items-center gap-1">
            {linkText}
            {isExternal ? <Click style={{ width: '16px', height: '16px' }} aria-hidden="true" /> : null}
          </span>
        </Button>
      ) : null}
    </section>
  );
};

export default Contact;
