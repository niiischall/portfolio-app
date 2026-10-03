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

const renderBlocksHtml = (blocks) => {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((block) => {
      const text = Array.isArray(block?.children)
        ? block.children.map((child) => child?.text ?? '').join('')
        : '';
      if (!text) return '';
      const style = block?.style || 'normal';
      const tag = style === 'h1' || style === 'h2' ? 'h1' : style === 'h3' ? 'h2' : 'p';
      return `<${tag}>${escapeHtml(text)}</${tag}>`;
    })
    .join('');
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
      return renderBlocksHtml(data.hero?.greeting?.text);
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

const main = async () => {
  const baseHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('[prerender] dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  writeSitemap();

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
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
