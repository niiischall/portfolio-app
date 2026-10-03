import { defineConfig, loadEnv } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';

import { combinedQuery } from './src/lib/sanity.queries';

// Load environment variables from .env
dotenv.config();

const DEFAULT_SITE_URL = 'https://www.nischalnikit.xyz';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

  return {
    plugins: [
      react(),
      {
        name: 'html-site-url',
        transformIndexHtml(html) {
          return html.replaceAll('__SITE_URL__', siteUrl);
        },
      },
    ],
    define: { 'process.env': {} },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            if (id.includes('posthog-js')) {
              return 'posthog-vendor';
            }

            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }

            if (id.includes('sanity') || id.includes('@sanity/')) {
              return 'sanity-vendor';
            }

            if (
              id.includes('/react/') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('scheduler')
            ) {
              return 'react-vendor';
            }
          },
        },
      },
    },
    resolve: {
      dedupe: ['react', 'react-dom', 'react-is', 'styled-components'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    },
    server: {
      proxy: {
        '/api/sanity': {
          target: `https://${process.env.VITE_PROJECT_ID}.api.sanity.io/${process.env.VITE_API_VERSION}/data/query/${process.env.VITE_DATASET}`,
          changeOrigin: true,
          // Mirrors api/sanity.ts: the query is defined here, never taken from
          // the caller, so dev and production behave identically.
          rewrite: () => `?query=${encodeURIComponent(combinedQuery)}`,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const token = process.env.SANITY_API_TOKEN ?? process.env.VITE_API_TOKEN;
              proxyReq.setHeader('Authorization', `Bearer ${token}`);
            });
          },
        },
      },
    },
  };
});
