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

const ROUTE_META = {
  '/': {
    title: 'hey! i am nischal! 👋',
    description:
      "hey 👋, i'm nischal nikit. i build things that live on the web. i also talk & write about some of those things. this is my corner of the internet.",
  },
  '/about': {
    title: 'about · Nischal Nikit',
    description:
      'Learn about Nischal Nikit - background, interests, and what he is working on in software and the web.',
  },
  '/work': {
    title: 'work · Nischal Nikit',
    description: 'Work experience and roles at companies where Nischal Nikit has built products on the web.',
  },
  '/experiments': {
    title: 'experiments · Nischal Nikit',
    description:
      'Side projects and experiments by Nischal Nikit - prototypes, tools, and ideas explored outside day-to-day work.',
  },
  '/writings': {
    title: 'blogs · Nischal Nikit',
    description:
      'Essays and technical writing by Nischal Nikit on React, full-stack development, and building for the web.',
  },
  '/talks': {
    title: 'talks · Nischal Nikit',
    description: 'Conference talks and presentations by Nischal Nikit on software engineering and web development.',
  },
  '/contact': {
    title: 'contact · Nischal Nikit',
    description: 'Get in touch with Nischal Nikit for collaboration, speaking, or general inquiries.',
  },
};

const PORTFOLIO_ROUTES = Object.keys(ROUTE_META);

const COMBINED_QUERY = `{
  "hero": *[_type == "hero"][0]{ greeting{ text, link } },
  "about": *[_type == "about"][0]{ heading, overview, cv },
  "work": *[_type == "work"][0]{ heading, collection[]{ designation, description, link } },
  "experiments": *[_type == "experiments"][0]{ heading, collection[]{ heading, body } },
  "writings": *[_type == "writings"][0]{ heading, collection[]{ heading, body, link } },
  "talks": *[_type == "talks"][0]{ heading, collection[]{ heading, body } },
  "contact": *[_type == "contact"][0]{ heading, text, link }
}`;

const blocksToPlainText = (blocks) => {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((block) => (Array.isArray(block?.children) ? block.children.map((child) => child?.text ?? '').join('') : ''))
    .join(' ')
    .trim();
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
      return `<main id="main-content"><h1>${escapeHtml(blocksToPlainText(data.hero?.greeting?.text))}</h1></main>`;
    case '/about':
      return `<main id="main-content"><h1>${escapeHtml(
        blocksToPlainText(data.about?.heading?.title),
      )}</h1><p>${escapeHtml(blocksToPlainText(data.about?.overview))}</p></main>`;
    case '/work':
      return `<main id="main-content"><h1>${escapeHtml(blocksToPlainText(data.work?.heading?.title))}</h1>${listItems(
        data.work?.collection,
        (item) => `<strong>${escapeHtml(item.designation)}</strong> ${escapeHtml(item.description)}`,
      )}</main>`;
    case '/experiments':
      return `<main id="main-content"><h1>${escapeHtml(
        blocksToPlainText(data.experiments?.heading?.title),
      )}</h1>${listItems(
        data.experiments?.collection,
        (item) => `<strong>${escapeHtml(item.heading)}</strong> ${escapeHtml(item.body)}`,
      )}</main>`;
    case '/writings':
      return `<main id="main-content"><h1>${escapeHtml(
        blocksToPlainText(data.writings?.heading?.title),
      )}</h1>${listItems(
        data.writings?.collection,
        (item) => `<strong>${escapeHtml(item.heading)}</strong> ${escapeHtml(item.body)}`,
      )}</main>`;
    case '/talks':
      return `<main id="main-content"><h1>${escapeHtml(blocksToPlainText(data.talks?.heading?.title))}</h1>${listItems(
        data.talks?.collection,
        (item) => `<strong>${escapeHtml(item.heading)}</strong> ${escapeHtml(item.body)}`,
      )}</main>`;
    case '/contact':
      return `<main id="main-content"><h1>${escapeHtml(
        blocksToPlainText(data.contact?.heading?.title),
      )}</h1><p>${escapeHtml(blocksToPlainText(data.contact?.text))}</p></main>`;
    default:
      return '<main id="main-content"></main>';
  }
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
  const { VITE_PROJECT_ID, VITE_API_VERSION, VITE_DATASET, VITE_API_TOKEN } = process.env;
  if (!VITE_PROJECT_ID || !VITE_API_VERSION || !VITE_DATASET || !VITE_API_TOKEN) {
    console.warn('[prerender] Missing Sanity env vars - skipping static HTML injection.');
    return null;
  }

  const url = `https://${VITE_PROJECT_ID}.api.sanity.io/${VITE_API_VERSION}/data/query/${VITE_DATASET}?query=${encodeURIComponent(
    COMBINED_QUERY,
  )}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${VITE_API_TOKEN}` },
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
  html = html.replace('<div id="root"></div>', `<div id="root">${snapshot}</div>`);

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
