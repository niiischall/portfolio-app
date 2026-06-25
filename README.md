# Portfolio

Personal portfolio site built with React, Vite, and Tailwind. Content is managed in an embedded Sanity Studio at `/studio`.

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/)

## Setup

1. Clone the repo and install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file in the project root:

   ```env
   VITE_PROJECT_ID=your_sanity_project_id
   VITE_DATASET=production
   VITE_API_VERSION=v2023-10-01
   VITE_API_TOKEN=your_sanity_api_token
   VITE_PUBLIC_POSTHOG_KEY=your_posthog_key
   VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   VITE_SITE_URL=https://www.nischalnikit.xyz
   ```

   The Studio reads `VITE_PROJECT_ID` and `VITE_DATASET` from the same file. No separate Sanity Studio env vars are required.

3. In the [Sanity manage console](https://www.sanity.io/manage), add your dev and production origins to **CORS origins** with credentials enabled (e.g. `http://localhost:5173`).

## Development

```bash
pnpm dev
```

- Portfolio: [http://localhost:5173/](http://localhost:5173/)
- Sanity Studio: [http://localhost:5173/studio](http://localhost:5173/studio)

One process serves both the site and the CMS.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start Vite dev server    |
| `pnpm build`   | Production build         |
| `pnpm preview` | Preview production build |
| `pnpm lint`    | Run ESLint               |

## Project structure

```
src/
  components/     Shared UI
  sections/       Portfolio page sections
  lib/            Sanity queries and data fetching
  sanity/
    schemas/      Sanity document and object schemas
    Studio.tsx    Embedded Studio wrapper
sanity.config.ts  Sanity Studio configuration
api/              Serverless Sanity proxy (deploy target)
```

## Deployment

Build and deploy `portfolio-client` as a single app. Set the same `VITE_*` environment variables in your hosting provider (including `VITE_SITE_URL` for canonical URLs, Open Graph tags, and `sitemap.xml`). After deploy, confirm the portfolio routes and `/studio` both load on your production domain. `vercel.json` and `public/_redirects` include SPA fallbacks so direct links to routes work without hash URLs. Security headers ship via `vercel.json` and `public/_headers`.
