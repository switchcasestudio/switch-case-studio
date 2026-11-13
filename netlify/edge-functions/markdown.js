/**
 * Serves every page as Markdown to clients that ask for it
 * (Accept: text/markdown), from the same URL that serves HTML to browsers
 * (is-agentic scan, 2026-11-13; protocol: https://acceptmarkdown.com).
 *
 * - The .md files are written at build time next to each page
 *   (scripts/generate-markdown.mjs, postbuild): /about -> /about.md, / ->
 *   /index.html.md, the 404 page -> /404.md.
 * - Every HTML response gets `Vary: Accept`, Markdown or not, so a cache
 *   never hands one client the other's representation.
 * - A missing page asked for as Markdown keeps its 404 status and gets a
 *   Markdown body that points at /llms.txt and the sitemap.
 * - 406 only when the client rules out both Markdown and HTML.
 * - Redirects, non-HTML responses and errors pass through untouched.
 */
import {
  negotiate,
  acceptsHtml,
  markdownPathFor,
  NOT_FOUND_MARKDOWN,
} from '../lib/agentMarkdown.mjs';

const MD_TYPE = 'text/markdown; charset=utf-8';

function withVary(res) {
  const out = new Response(res.body, res);
  const vary = out.headers.get('vary');
  if (!vary || !/(^|,)\s*accept\s*(,|$)/i.test(vary)) {
    out.headers.set('vary', vary ? `${vary}, Accept` : 'Accept');
  }
  return out;
}

async function fetchMarkdown(origin, path) {
  const res = await fetch(new URL(path, origin));
  return res.ok ? res.text() : null;
}

function markdownResponse(request, body, status) {
  return new Response(request.method === 'HEAD' ? null : body, {
    status,
    headers: {
      'content-type': MD_TYPE,
      vary: 'Accept',
      'cache-control': 'public, max-age=0, must-revalidate',
      'x-robots-tag': 'noindex',
    },
  });
}

function notAcceptable(request) {
  const body = `This page is available as:\n- text/html\n- text/markdown\n\nYou asked for: ${request.headers.get('accept')}\n`;
  return new Response(body, {
    status: 406,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      vary: 'Accept',
      'cache-control': 'no-store',
    },
  });
}

export default async function markdown(request, context) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return;
  const url = new URL(request.url);
  // A file (has an extension) is not a page: leave it alone, which also
  // keeps the .md fetch below from looping back through this function.
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return;

  const want = negotiate(request.headers.get('accept'));
  const res = await context.next();
  const isHtml = (res.headers.get('content-type') || '').includes('text/html');
  if (!isHtml) return res;
  if (want === 'html') return withVary(res);
  if (want === 'none') return notAcceptable(request);

  // want === 'markdown'
  if (res.status === 404) {
    const md = await fetchMarkdown(url.origin, NOT_FOUND_MARKDOWN);
    if (md) return markdownResponse(request, md, 404);
    return withVary(res);
  }
  if (res.status !== 200) return withVary(res);
  const md = await fetchMarkdown(url.origin, markdownPathFor(url.pathname));
  if (md) return markdownResponse(request, md, 200);
  // No Markdown for this page (noindex pages are skipped at build time):
  // fall back to HTML unless the client ruled HTML out.
  return acceptsHtml(request.headers.get('accept')) ? withVary(res) : notAcceptable(request);
}

export const config = {
  path: '/*',
  // Media and function paths are never pages; skip the invocation.
  excludedPath: [
    '/assets/*', '/images/*', '/fonts/*', '/photos/*', '/polaroids/*',
    '/stickers/*', '/clients/*', '/downloads/*', '/ident/*', '/social/*',
    '/brand/*', '/api/*', '/.netlify/*',
  ],
};
