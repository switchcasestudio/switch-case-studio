/**
 * Markdown content negotiation (https://acceptmarkdown.com), shared by the
 * edge function (netlify/edge-functions/markdown.js), the build script that
 * writes the .md files (scripts/generate-markdown.mjs) and the tests.
 * Plain ESM with no Node or Deno imports: it runs in both.
 */

export const MARKDOWN = 'text/markdown';
export const HTML = 'text/html';

/* Parse an Accept header into [{ type, q, order }]. Type names are
   case-insensitive; q defaults to 1; a malformed q counts as 0. */
export function parseAccept(header) {
  return String(header || '')
    .split(',')
    .map((raw, order) => {
      const [type, ...params] = raw.split(';').map((s) => s.trim());
      let q = 1;
      for (const p of params) {
        const [k, v] = p.split('=').map((s) => s.trim());
        if (k.toLowerCase() === 'q') {
          const n = Number(v);
          q = Number.isFinite(n) && n >= 0 && n <= 1 ? n : 0;
        }
      }
      return { type: type.toLowerCase(), q, order };
    })
    .filter((e) => e.type.includes('/'));
}

/* The entry that governs `target`: the most specific match wins
   (exact 3 > type/* 2 > *\/* 1), as RFC 9110 12.5.1 says. */
function match(entries, target) {
  const [major] = target.split('/');
  let best = null;
  for (const e of entries) {
    const spec = e.type === target ? 3 : e.type === `${major}/*` ? 2 : e.type === '*/*' ? 1 : 0;
    if (spec && (!best || spec > best.spec)) best = { q: e.q, spec, order: e.order };
  }
  return best || { q: 0, spec: 0, order: Infinity };
}

/**
 * 'markdown' | 'html' | 'none' (none means 406).
 * No Accept header, or one that names no media type, means no constraint:
 * HTML, the default. Higher q wins; on equal q the more specific match wins
 * (so `*\/*` or `text/*` alone stay HTML); two exact matches at equal q go to
 * the one listed first.
 */
export function negotiate(header) {
  const entries = parseAccept(header);
  if (!entries.length) return 'html';
  const md = match(entries, MARKDOWN);
  const html = match(entries, HTML);
  if (md.q === 0 && html.q === 0) return 'none';
  if (md.q !== html.q) return md.q > html.q ? 'markdown' : 'html';
  if (md.spec !== html.spec) return md.spec > html.spec ? 'markdown' : 'html';
  return md.order < html.order ? 'markdown' : 'html';
}

/* True when the client would take HTML (no header means anything goes). */
export function acceptsHtml(header) {
  const entries = parseAccept(header);
  return !entries.length || match(entries, HTML).q > 0;
}

/* Where a page's Markdown lives, by the llms.txt convention: the page URL
   plus .md, and /index.html.md for the home page. */
export function markdownPathFor(pathname) {
  const p = String(pathname || '/').replace(/\/+$/, '');
  return p === '' ? '/index.html.md' : `${p}.md`;
}

export const NOT_FOUND_MARKDOWN = '/404.md';
