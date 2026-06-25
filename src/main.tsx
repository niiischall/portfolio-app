/* eslint-disable import/no-named-as-default */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import App from './App';

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  capture_pageview: false,
});

const rootElement = document.getElementById('root') ?? document.createElement('div');

const queryClient = new QueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <Router>
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PostHogProvider>
    </Router>
  </StrictMode>,
);
