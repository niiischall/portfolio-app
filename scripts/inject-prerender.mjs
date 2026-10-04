#!/usr/bin/env node
/**
 * Post-build: fetch Sanity content and inject crawlable HTML snapshots per route.
 * Run after `vite build`. Requires .env with Sanity credentials.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.nischalnikit.xyz').replace(/\/$/, '');

// Single source of truth, shared with src/config/route-meta.ts. This used to be
// a hand-copied table, and drift between the two was invisible: a wrong title
// here means a wrong <title> and canonical in the crawlable HTML, with no error.
const ROUTES_CONFIG = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/config/routes.json'), 'utf8'));
const ROUTE_META = ROUTES_CONFIG.routes;

const PORTFOLIO_ROUTES = Object.keys(ROUTE_META);

const COMBINED_QUERY = `{
  "hero": *[_type == "hero"][0]{ greeting{ text, link } },
  "about": *[_type == "about"][0]{ heading, overview, cv },
  "work": *[_type == "work"][0]{ heading, collection[]{ designation, description, link } },
  "writings": *[_type == "writings"][0]{ heading, collection[]{ heading, body, link, publishedAt } }
}`;

const blocksToPlainText = (blocks) => {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((block) => (Array.isArray(block?.children) ? block.children.map((child) => child?.text ?? '').join('') : ''))
    .join(' ')
    .trim();
};

// Mirrors the Hero component: heading blocks join into one <h1>, the rest
// becomes the intro paragraph. Keeps the crawlable home page's heading
// structure identical to what the browser renders.
const renderGreetingHtml = (blocks) => {
  if (!Array.isArray(blocks)) return '';
  const text = (block) =>
    (Array.isArray(block?.children) ? block.children.map((child) => child?.text ?? '').join('') : '').trim();
  const isHeading = (block) => String(block?.style ?? '').startsWith('h');
  const headline = blocks.filter(isHeading).map(text).filter(Boolean).join(' ');
  const intro = blocks.filter((block) => !isHeading(block)).map(text).filter(Boolean).join(' ');
  return `${headline ? `<h1>${escapeHtml(headline)}</h1>` : ''}${intro ? `<p>${escapeHtml(intro)}</p>` : ''}`;
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const listItems = (items, renderItem) =>
  items?.length ? `<ul>${items.map((item) => `<li>${renderItem(item)}</li>`).join('')}</ul>` : '';

const renderRouteSnapshot = (route, data) => {
  switch (route) {
    case '/':
      return renderGreetingHtml(data.hero?.greeting?.text);
    case '/about':
      // About absorbed the work timeline; keep that copy crawlable here.
      return `<h1>${escapeHtml(blocksToPlainText(data.about?.heading?.title))}</h1><p>${escapeHtml(
        blocksToPlainText(data.about?.overview),
      )}</p><h2>${escapeHtml(blocksToPlainText(data.work?.heading?.title))}</h2>${listItems(
        data.work?.collection,
        (item) => `<strong>${escapeHtml(item.designation)}</strong> ${escapeHtml(item.description)}`,
      )}`;
    case '/writing':
      return `<h1>${escapeHtml(blocksToPlainText(data.writings?.heading?.title))}</h1>${listItems(
        data.writings?.collection,
        (item) =>
          `<strong>${escapeHtml(item.heading)}</strong> ${escapeHtml(item.body)}${
            item.publishedAt ? ` <time datetime="${escapeHtml(item.publishedAt)}">${escapeHtml(item.publishedAt)}</time>` : ''
          }`,
      )}`;
    default:
      return '';
  }
};

// Generated from the route table so the sitemap can never list a removed or
// redirected URL (which would tell crawlers to fetch redirects).
const writeSitemap = () => {
  const urls = PORTFOLIO_ROUTES.map((route) => {
    const { changefreq, priority } = ROUTE_META[route];
    const loc = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
  console.log(`[prerender] Wrote sitemap.xml (${PORTFOLIO_ROUTES.length} URLs)`);
};

const applyRouteMeta = (html, route, meta) => {
  const canonical = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
  let output = html;
  output = output.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  output = output.replace(
    /<meta name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  );
  output = output.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
  output = output.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
  );
  output = output.replace(
    /<meta property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
  );
  output = output.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  output = output.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
  );
  output = output.replace(
    /<meta name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  );
  return output;
};

const fetchSanityData = async () => {
  const { VITE_PROJECT_ID, VITE_API_VERSION, VITE_DATASET } = process.env;
  // Transitional: falls back to the old name until the env var is renamed.
  const token = process.env.SANITY_API_TOKEN ?? process.env.VITE_API_TOKEN;
  if (!VITE_PROJECT_ID || !VITE_API_VERSION || !VITE_DATASET || !token) {
    console.warn('[prerender] Missing Sanity env vars - skipping static HTML injection.');
    return null;
  }

  const url = `https://${VITE_PROJECT_ID}.api.sanity.io/${VITE_API_VERSION}/data/query/${VITE_DATASET}?query=${encodeURIComponent(
    COMBINED_QUERY,
  )}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Sanity fetch failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.result;
};

const writeRouteHtml = (baseHtml, route, snapshot) => {
  const meta = ROUTE_META[route];
  let html = applyRouteMeta(baseHtml, route, meta);

  // Keep #root empty for visitors; crawlable HTML lives in a visually hidden sibling.
  html = html.replace(/<div id="ssg-fallback"[^>]*>[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
  html = html.replace(
    '<div id="root"></div>',
    `<div id="ssg-fallback" aria-hidden="true" class="ssg-fallback">${snapshot}</div>\n  <div id="root"></div>`,
  );

  const outDir = route === '/' ? distDir : path.join(distDir, route.slice(1));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
};

// Unknown paths must get a real 404 status, not the home page's HTML with a
// 200. vercel.json therefore rewrites only known routes to the SPA; anything
// else falls through to this file, which Vercel serves with status 404. The
// app still boots on it and renders the NotFound route.
const write404 = (baseHtml) => {
  const meta = ROUTES_CONFIG.notFound;
  let html = applyRouteMeta(baseHtml, '/', meta);
  html = html.replace(/<link rel="canonical"[^>]*>\s*/, '');
  html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
  html = html.replace(
    '<div id="root"></div>',
    '<div id="ssg-fallback" aria-hidden="true" class="ssg-fallback"><h1>page not found</h1></div>\n  <div id="root"></div>',
  );
  fs.writeFileSync(path.join(distDir, '404.html'), html);
  console.log('[prerender] Wrote 404.html');
};

// With no catch-all rewrite, a route missing from vercel.json would 404 in
// production whenever its prerendered HTML isn't produced (e.g. Sanity was
// unreachable at build time). Fail the build instead of shipping that.
const assertRewritesCoverRoutes = () => {
  const vercel = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
  const sources = new Set((vercel.rewrites ?? []).map((rewrite) => rewrite.source));
  const missing = PORTFOLIO_ROUTES.filter((route) => route !== '/' && !sources.has(route));
  if (missing.length) {
    throw new Error(`vercel.json has no SPA rewrite for route(s): ${missing.join(', ')}`);
  }
};

const main = async () => {
  const baseHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('[prerender] dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  assertRewritesCoverRoutes();
  writeSitemap();

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
  write404(baseHtml);
  const data = await fetchSanityData();

  if (!data) {
    console.log('[prerender] Skipped.');
    return;
  }

  for (const route of PORTFOLIO_ROUTES) {
    const snapshot = renderRouteSnapshot(route, data);
    writeRouteHtml(baseHtml, route, snapshot);
    console.log(`[prerender] Wrote ${route === '/' ? '/' : route}`);
  }
};

main().catch((error) => {
  console.error('[prerender] Failed:', error);
  process.exit(1);
});
