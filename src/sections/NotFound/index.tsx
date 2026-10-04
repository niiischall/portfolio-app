import React from 'react';

import Button from '../../components/Button';
import { ANALYTICS_EVENTS } from '../../utils/helpers/analytics';

const NotFound: React.FC = () => (
  <section className="pt-12 px-4 pb-24 md:px-8" id="not-found">
    <div className="max-w-4xl md:mx-auto space-y-6">
      <h1>page not found</h1>
      <p className="text-muted">This page doesn&apos;t exist, or it has moved.</p>
      <Button
        to="/"
        styles="btn lowercase"
        analyticsEvent={ANALYTICS_EVENTS.NAV_CLICK}
        analyticsProperties={{ section: 'not_found', surface: 'back_home', destination: '/', label: 'back home' }}
      >
        back home
      </Button>
    </div>
  </section>
);

export default NotFound;
