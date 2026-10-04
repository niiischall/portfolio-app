// The explicit .js is required: package.json is "type": "module", so Vercel runs
// this function as native ESM, and Node's ESM loader does not resolve
// extensionless relative imports (ERR_MODULE_NOT_FOUND). Vercel compiles the
// .ts source to the .js file this resolves to.
import { combinedQuery } from '../src/lib/sanity.queries.js';

// The site issues exactly one query, so the query is defined here rather than
// accepted from the caller. This is deliberate: taking it from `req.query` made
// this an open GROQ proxy over the whole dataset (drafts included) backed by a
// privileged token. Do not reintroduce a caller-supplied query.
export const proxyHandler = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { VITE_PROJECT_ID, VITE_API_VERSION, VITE_DATASET } = process.env;
  // Transitional: falls back to the old name until the Vercel env var is renamed.
  const token = process.env.SANITY_API_TOKEN ?? process.env.VITE_API_TOKEN;

  if (!VITE_PROJECT_ID || !VITE_API_VERSION || !VITE_DATASET || !token) {
    console.error('[api/sanity] Missing Sanity environment variables.');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const upstream = new URL(
      `https://${VITE_PROJECT_ID}.api.sanity.io/${VITE_API_VERSION}/data/query/${VITE_DATASET}`,
    );
    // URLSearchParams encodes properly, so a stray `&` cannot split into a
    // second upstream parameter.
    upstream.searchParams.set('query', combinedQuery);

    const response = await fetch(upstream, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`[api/sanity] Upstream ${response.status} ${response.statusText}`);
      return res.status(502).json({ error: 'Upstream error' });
    }

    const data = await response.json();

    // Content is CMS-driven; five minutes stale is invisible and turns this into
    // an edge-cached resource, which is also the rate limiting.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json(data);
  } catch (error) {
    // Never return the upstream message: it leaks hostnames/paths and gives an
    // attacker an oracle for iterating queries.
    console.error('[api/sanity]', error);
    return res.status(502).json({ error: 'Upstream error' });
  }
};

export default proxyHandler;
