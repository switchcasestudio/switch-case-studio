// No internal link takes a detour (2026-11-13): /reviews was a 301 to
// /testimonials and the Unhurried guide linked /shop/ (a 301 to /shop). A
// link that hits a redirect costs a hop for every visitor, crawler and agent,
// so every link the site ships must point at the final URL.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const build = join(root, 'build');
const hasBuild = existsSync(join(build, 'index.html'));
const toml = readFileSync(join(root, 'netlify.toml'), 'utf8');

const redirects = [...toml.matchAll(/from = "([^"]+)"\s*\n\s*to = "([^"]+)"/g)].map((m) => ({
  from: m[1],
  to: m[2],
}));

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)],
  );

/* Internal paths in href="", Markdown links and sitemap <loc>. */
function internalLinks(text) {
  const out = [];
  const re = /(?:href="|\]\(|<loc>)(?:https:\/\/switchcasestudio\.com)?(\/[^"\s)<#?]*)/g;
  for (const m of text.matchAll(re)) if (!m[1].startsWith('//')) out.push(m[1]);
  return out;
}

test('/testimonials redirects to /reviews in one hop, and /reviews is not a redirect', () => {
  const r = redirects.find((x) => x.from === '/testimonials');
  assert.equal(r?.to, '/reviews');
  assert.ok(!redirects.some((x) => x.from === '/reviews'));
  // No chains: no redirect lands on another redirect's source.
  const sources = new Set(redirects.map((x) => x.from));
  for (const x of redirects) assert.ok(!sources.has(x.to), `${x.from} -> ${x.to} chains`);
});

test('no built page, Markdown copy, llms.txt or sitemap links through a redirect', { skip: !hasBuild }, () => {
  const sources = new Set(redirects.map((x) => x.from));
  const files = walk(build).filter((f) => /\.(html|md|txt|xml)$/.test(f));
  const bad = [];
  for (const f of files) {
    for (const link of internalLinks(readFileSync(f, 'utf8'))) {
      const bare = link.length > 1 ? link.replace(/\/+$/, '') : link;
      // Netlify 301s /page/ to /page unless /page/ is a real directory index.
      const slashHop = link !== '/' && link.endsWith('/') && !existsSync(join(build, link, 'index.html'));
      if (sources.has(bare) || slashHop) bad.push(`${f.slice(build.length)} -> ${link}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('the reviews page is built at /reviews', { skip: !hasBuild }, () => {
  assert.ok(existsSync(join(build, 'reviews.html')));
  assert.ok(!existsSync(join(build, 'testimonials.html')));
  const html = readFileSync(join(build, 'reviews.html'), 'utf8');
  assert.match(html, /<link[^>]+rel="canonical"[^>]+href="https:\/\/switchcasestudio\.com\/reviews"/);
});
