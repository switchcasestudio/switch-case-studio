// Markdown content negotiation (acceptmarkdown.com) and the agent-facing
// files. Run: npm test (node --test, no dependencies).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  negotiate,
  acceptsHtml,
  markdownPathFor,
} from '../netlify/lib/agentMarkdown.mjs';
import markdown from '../netlify/edge-functions/markdown.js';

const CHROME =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';

test('negotiate: acceptmarkdown.com test vectors', () => {
  assert.equal(negotiate('text/markdown'), 'markdown');
  assert.equal(negotiate('text/markdown, text/html;q=0.8'), 'markdown');
  assert.equal(negotiate('text/html'), 'html');
  assert.equal(negotiate('text/markdown;q=0, text/html'), 'html');
  assert.equal(negotiate(null), 'html');
  assert.equal(negotiate(''), 'html');
  assert.equal(negotiate('*/*'), 'html');
});

test('negotiate: real browsers and wildcards stay HTML', () => {
  assert.equal(negotiate(CHROME), 'html');
  assert.equal(negotiate('text/*'), 'html');
  assert.equal(negotiate('application/json, text/plain, */*'), 'html');
});

test('negotiate: q-values and specificity', () => {
  assert.equal(negotiate('text/html;q=0.5, text/markdown;q=0.9'), 'markdown');
  assert.equal(negotiate('text/markdown, */*;q=0.1'), 'markdown');
  assert.equal(negotiate('text/markdown, */*'), 'markdown'); // exact beats wildcard
  assert.equal(negotiate('TEXT/Markdown'), 'markdown');
  assert.equal(negotiate('text/markdown, text/html'), 'markdown'); // listed first
  assert.equal(negotiate('text/html, text/markdown'), 'html');
  assert.equal(negotiate('text/markdown;q=0, */*'), 'html');
});

test('negotiate: 406 only when both are ruled out', () => {
  assert.equal(negotiate('application/pdf'), 'none');
  assert.equal(negotiate('text/markdown;q=0, text/html;q=0'), 'none');
  assert.equal(negotiate('image/webp'), 'none');
  assert.equal(acceptsHtml('text/markdown'), false);
  assert.equal(acceptsHtml('text/markdown, */*;q=0.1'), true);
  assert.equal(acceptsHtml(null), true);
});

test('markdownPathFor follows the llms.txt convention', () => {
  assert.equal(markdownPathFor('/'), '/index.html.md');
  assert.equal(markdownPathFor(''), '/index.html.md');
  assert.equal(markdownPathFor('/about'), '/about.md');
  assert.equal(markdownPathFor('/blog/some-post'), '/blog/some-post.md');
  assert.equal(markdownPathFor('/unhurried-pro/'), '/unhurried-pro.md');
});

// ---- the edge function, with Netlify's context.next() and fetch faked ----

const HOME_MD = '# Home\n\nThe studio.\n';
const NOT_FOUND_MD = '# This page does not exist.\n\n- [llms.txt](https://switchcasestudio.com/llms.txt)\n';
const files = { '/index.html.md': HOME_MD, '/404.md': NOT_FOUND_MD };

function html(status = 200, extra = {}) {
  return new Response('<!doctype html><title>x</title>', {
    status,
    headers: { 'content-type': 'text/html; charset=UTF-8', vary: 'Accept-Encoding', ...extra },
  });
}

async function call(path, accept, origin = html(), method = 'GET') {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (u) => {
    const body = files[new URL(u).pathname];
    return new Response(body ?? 'nope', { status: body ? 200 : 404 });
  };
  try {
    const headers = accept === undefined ? {} : { accept };
    const req = new Request(`https://switchcasestudio.com${path}`, { method, headers });
    return await markdown(req, { next: async () => origin });
  } finally {
    globalThis.fetch = realFetch;
  }
}

test('edge: home page as Markdown, with Vary: Accept', async () => {
  const res = await call('/', 'text/markdown');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /^text\/markdown; charset=utf-8$/);
  assert.equal(res.headers.get('vary'), 'Accept');
  assert.equal(await res.text(), HOME_MD);
});

test('edge: browsers get the HTML, now with Vary: Accept', async () => {
  for (const accept of ['text/html', CHROME, '*/*', undefined]) {
    const res = await call('/', accept);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    assert.equal(res.headers.get('vary'), 'Accept-Encoding, Accept');
  }
});

test('edge: a missing page keeps 404 and gets a Markdown body', async () => {
  const res = await call('/no-such-page', 'text/markdown', html(404));
  assert.equal(res.status, 404);
  assert.match(res.headers.get('content-type'), /^text\/markdown/);
  const body = await res.text();
  assert.ok(body.length >= 20);
  assert.match(body, /llms\.txt/);
});

test('edge: a missing page asked for as HTML is untouched', async () => {
  const res = await call('/no-such-page', 'text/html', html(404));
  assert.equal(res.status, 404);
  assert.match(res.headers.get('content-type'), /text\/html/);
});

test('edge: 406 when neither representation is acceptable', async () => {
  const res = await call('/', 'application/pdf');
  assert.equal(res.status, 406);
  assert.match(await res.text(), /text\/markdown/);
});

test('edge: page with no Markdown falls back to HTML, or 406 if HTML is ruled out', async () => {
  const soft = await call('/partners', 'text/markdown, */*;q=0.1');
  assert.match(soft.headers.get('content-type'), /text\/html/);
  assert.match(soft.headers.get('vary'), /Accept$/);
  const strict = await call('/partners', 'text/markdown');
  assert.equal(strict.status, 406);
});

test('edge: redirects and files pass through', async () => {
  const redirect = new Response(null, { status: 301, headers: { location: '/testimonials' } });
  const r = await call('/reviews', 'text/markdown', redirect);
  assert.equal(r.status, 301);
  assert.equal(r.headers.get('location'), '/testimonials');
  assert.equal(await call('/llms.txt', 'text/markdown'), undefined);
  assert.equal(await call('/', 'text/markdown', html(), 'POST'), undefined);
});

test('edge: HEAD gets Markdown headers and no body', async () => {
  const res = await call('/', 'text/markdown', html(), 'HEAD');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /^text\/markdown/);
  assert.equal(await res.text(), '');
});
