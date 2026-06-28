# Portfolio

Personal portfolio for [nischalnikit.xyz](https://www.nischalnikit.xyz). Built with React, Vite, and Tailwind. Content is managed in an embedded Sanity Studio at `/studio`.

## Stack

- **Frontend:** React 18, React Router 7, Tailwind CSS
- **CMS:** Sanity 3 (embedded Studio, lazy-loaded on `/studio`)
- **Data:** TanStack Query + `/api/sanity` proxy in production
- **Analytics:** PostHog
- **SEO:** Per-route meta tags, JSON-LD structured data, build-time HTML injection, `sitemap.xml`, `llms.txt`
- **PWA:** Web manifest and app icons

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

One process serves both the site and the CMS. In dev, Sanity content is proxied through Vite (`/api/sanity`).

## Scripts

| Command        | Description                                              |
| -------------- | -------------------------------------------------------- |
| `pnpm dev`     | Start Vite dev server                                    |
| `pnpm build`   | Production build + post-build Sanity HTML injection      |
| `pnpm preview` | Preview production build locally                         |
| `pnpm lint`    | Run ESLint on `.ts` / `.tsx` files                       |

## Routes

| Path           | Content                          |
| -------------- | -------------------------------- |
| `/`            | Hero and CTAs                    |
| `/about`       | About page                       |
| `/work`        | Work experience                  |
| `/experiments` | Side projects                    |
| `/writings`    | Blog highlights (links external) |
| `/talks`       | Talks and presentations          |
| `/contact`     | Contact info and CTA             |
| `/studio`      | Sanity Studio (CMS)              |

## Project structure

```
src/
  components/       Shared UI (Layout, PageMeta, StructuredData, PortfolioGridSection, …)
  sections/         Page sections (Hero, Work, Footer, …)
  config/           Site URL, route meta, social profiles
  lib/              Sanity client, queries, image URL builder
  sanity/
    schemas/        Sanity document and object schemas
    Studio.tsx      Embedded Studio wrapper (lazy-loaded)
scripts/
  inject-prerender.mjs   Post-build crawlable HTML injection per route
api/
  sanity.ts         Serverless Sanity proxy (Vercel)
public/
  fonts/            Ovo webfont (woff2)
  icons/            PWA icons
  manifest.webmanifest
sanity.config.ts    Sanity Studio configuration
vercel.json         SPA rewrites, security headers
```

## Build and prerender

`pnpm build` runs two steps:

1. **Vite build** - bundles the app with manual chunks (React, Sanity, PostHog, React Query).
2. **`inject-prerender.mjs`** - fetches Sanity content and writes per-route `index.html` snapshots under `dist/` for crawlers. Requires all four Sanity env vars at build time.

If Sanity env vars are missing, the build still succeeds but prerender is skipped (check logs for `[prerender] Wrote …`).

## Deployment (Vercel)

Deploy `portfolio-client` as a single app. Set these environment variables for **Production**, **Preview**, and **Development**:

| Variable                   | Required | Purpose                              |
| -------------------------- | -------- | ------------------------------------ |
| `VITE_PROJECT_ID`          | Yes      | Sanity project ID                    |
| `VITE_DATASET`             | Yes      | Sanity dataset                       |
| `VITE_API_VERSION`         | Yes      | Sanity API version                   |
| `VITE_API_TOKEN`           | Yes      | Sanity read token (build + runtime)  |
| `VITE_PUBLIC_POSTHOG_KEY`  | Yes      | PostHog project key                  |
| `VITE_PUBLIC_POSTHOG_HOST` | Yes      | PostHog ingest host                  |
| `VITE_SITE_URL`            | Optional | Canonical URL (defaults to production domain) |

After deploy:

- Confirm portfolio routes and `/studio` load on your domain.
- Check the build log for prerender output.
- `vercel.json` and `public/_redirects` provide SPA fallbacks for direct route links.
- Security headers ship via `vercel.json` and `public/_headers`.

## CMS notes

- **Footer** supports its own nav links and social icons; falls back to navigation/hero socials when empty.
- **Social icons** are Sanity image uploads (`cover` field on each social entry).
- Upload an X logo in Studio and point the URL to your `x.com` profile.
