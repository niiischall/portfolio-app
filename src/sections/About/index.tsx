import React from 'react';
import { PortableText } from '@portabletext/react';

import type { TypedObject } from 'sanity';
import Button from '../../components/Button';

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

  return (
    <section className="pt-12 px-4 pb-24 md:pb-36 md:px-8" id="about">
      <div className="max-w-4xl flex flex-col justify-center items-start space-y-12 space-x-0 md:mx-auto">
        <div className="text-3xl px-0 text-left md:text-center">
          <PortableText value={headingTitle} />
        </div>
        <div className="md:max-w-xl">
          <div className="text-left">
            <PortableText value={overview} />
            {isCvAvailable ? (
              <div className="mt-8 justify-center items-left md:items-center">
                <Button href={cvLink} external styles="btn" analyticsLabel={`about-${cvTitle}`}>
                  {cvTitle}
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
