import React from 'react';
import { PortableText } from '@portabletext/react';
import { useLocation } from 'react-router-dom';

import type { TypedObject } from 'sanity';
import Button from '../../components/Button';
import Click from '../../utils/svgs/Click';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';

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
}

const About: React.FC<AboutProps> = ({ data }) => {
  const { heading, overview = [], cv } = data ?? {};
  const { title: headingTitle = [] } = heading ?? {};
  const { link: cvLink = '', title: cvTitle = '' } = cv ?? {};

  const isCvAvailable = cvTitle && cvLink;
  const aboutBtnStyles = 'btn lowercase !mt-0';
  const location = useLocation();
  const pageEnter = Boolean((location.state as { pageEnter?: boolean } | null)?.pageEnter);

  return (
    <section
      className={`pt-12 px-4 pb-24 md:pb-36 md:px-8 ${pageEnter ? 'animate-page-enter' : ''}`}
      id="about"
    >
      <div className="max-w-4xl flex flex-col justify-center items-start space-y-12 space-x-0 md:mx-auto">
        <div className="text-3xl px-0 text-left">
          <PortableText value={headingTitle} />
        </div>
        <div className="md:max-w-xl">
          <div className="text-left">
            <PortableText value={overview} />
            {isCvAvailable ? (
              <div className="mt-8">
                <Button
                  href={cvLink}
                  external
                  styles={`${aboutBtnStyles} inline-flex items-center gap-1`}
                  analyticsEvent={ANALYTICS_EVENTS.EXTERNAL_CLICK}
                  analyticsProperties={{ section: 'about', label: cvTitle, url: cvLink }}
                >
                  <span className="flex items-center gap-1">
                    {cvTitle}
                    <Click style={{ width: '16px', height: '16px' }} aria-hidden="true" />
                  </span>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
