import { defineConfig, loadEnv } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';

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
    resolve: {
      dedupe: ['react', 'react-dom', 'react-is', 'styled-components'],
    },
    optimizeDeps: {
      include: [
        'sanity',
        '@sanity/vision',
        '@sanity/ui',
        '@sanity/icons',
        'styled-components',
      ],
    },
    server: {
      proxy: {
        '/api/sanity': {
          target: `https://${process.env.VITE_PROJECT_ID}.api.sanity.io/${process.env.VITE_API_VERSION}/data/query/${process.env.VITE_DATASET}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/sanity/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_API_TOKEN}`);
            });
          },
        },
      },
    },
  };
});
