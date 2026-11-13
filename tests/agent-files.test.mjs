// The build-time Markdown converter, llms.txt guidance, Organization schema
// and the home page's heading order. Build-output checks skip when there is
// no build/ (run `npm run build` first for the full set).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  htmlToMarkdown,
  routeOf,
  isNoindex,
  mainOf,
  absolutize,
} from '../scripts/generate-markdown.mjs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const hasBuild = existsSync(new URL('../build/index.html', import.meta.url));

test('routeOf maps built files to routes', () => {
  assert.equal(routeOf('index.html'), '/');
  assert.equal(routeOf('about.html'), '/about');
  assert.equal(routeOf('blog/a-post.html'), '/blog/a-post');
  assert.equal(routeOf('unhurried-pro/index.html'), '/unhurried-pro/');
});

test('isNoindex and mainOf', () => {
  assert.ok(isNoindex('<meta name="robots" content="noindex, nofollow">'));
  assert.ok(!isNoindex('<meta name="robots" content="index, follow">'));
  assert.equal(mainOf('<body><nav>x</nav><main id="main">hi</main></body>'), 'hi');
  assert.equal(mainOf('<body>no main</body>'), null);
});

test('htmlToMarkdown keeps content, drops chrome and decoration', () => {
  const html = `<nav><a href="/x">Menu</a></nav><main id="main">
    <h1>Title</h1><p>Read <a href="/about">about us</a>.</p>
    <svg><text>drawing</text></svg><button>Play</button>
    <div aria-hidden="true">decor</div><img src="/a.png" alt="">
    <img src="/b.webp" alt="A logo">
    <a href="/services/x"><span>Design</span><span>Explore</span><div>from $750</div></a>
    <h2><span>G</span><span>o</span></h2>
    <script>alert(1)</script></main><footer>foot</footer>`;
  const md = htmlToMarkdown(html, '/about');
  assert.match(md, /^# Title/);
  assert.match(md, /\[about us\]\(https:\/\/switchcasestudio\.com\/about\)/);
  assert.match(md, /!\[A logo\]\(https:\/\/switchcasestudio\.com\/b\.webp\)/);
  assert.match(md, /\[Design Explore from \$750\]\(https:\/\/switchcasestudio\.com\/services\/x\)/);
  assert.match(md, /^## Go$/m); // per-letter spans stay one word
  for (const gone of ['Menu', 'drawing', 'Play', 'decor', 'a.png', 'alert', 'foot']) {
    assert.ok(!md.includes(gone), `${gone} should be dropped`);
  }
  assert.match(md, /Page: https:\/\/switchcasestudio\.com\/about/);
  assert.match(md, /\[Site index for agents \(llms\.txt\)\]\(https:\/\/switchcasestudio\.com\/llms\.txt\)/);
});

test('absolutize leaves protocol-relative and absolute links alone', () => {
  assert.equal(absolutize('[a](/b)'), '[a](https://switchcasestudio.com/b)');
  assert.equal(absolutize('[a](//cdn.x/b)'), '[a](//cdn.x/b)');
  assert.equal(absolutize('[a](https://x.com/b)'), '[a](https://x.com/b)');
});

test('the 404 Markdown explains the error and links llms.txt and the sitemap', () => {
  const md = htmlToMarkdown('<main><h1>This page doesn\'t exist.</h1></main>', null);
  assert.ok(md.length >= 20);
  assert.match(md, /llms\.txt/);
  assert.match(md, /sitemap\.xml/);
});

test('llms.txt tells agents when to use the studio and how to engage', () => {
  const txt = read('public/llms.txt');
  assert.match(txt, /^# Switch Case Studio$/m);
  assert.match(txt, /^## When to use Switch Case Studio$/m);
  assert.match(txt, /How an agent should engage:/);
  assert.match(txt, /https:\/\/switchcasestudio\.com\/contact/);
  assert.match(txt, /\+1 925-323-1356/);
  assert.match(txt, /Accept: text\/markdown/);
  assert.match(txt, /\(from \$\d/); // prices read from pricingData.json
  assert.ok(!/—/.test(txt), 'no em dash');
});

test('Organization JSON-LD has contactPoint and address', () => {
  const m = read('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const org = JSON.parse(m[1])['@graph'].find((n) => n['@type'] === 'Organization');
  assert.equal(org.contactPoint['@type'], 'ContactPoint');
  assert.ok(org.contactPoint.contactType);
  assert.match(org.contactPoint.email, /@switchcasestudio\.com$/);
  assert.equal(org.contactPoint.telephone, '+1-925-323-1356');
  assert.equal(org.telephone, org.contactPoint.telephone);
  assert.deepEqual(org.areaServed.map((a) => a.name), ['United States', 'Worldwide']);
  assert.equal(org.address['@type'], 'PostalAddress');
});

test('built home page: the first heading is the h1, no skipped levels', { skip: !hasBuild }, () => {
  const levels = [...read('build/index.html').matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  assert.equal(levels[0], 1);
  for (let i = 1; i < levels.length; i += 1) {
    assert.ok(levels[i] <= levels[i - 1] + 1, `h${levels[i - 1]} -> h${levels[i]} skips a level`);
  }
});

test('built Markdown exists for home and 404', { skip: !hasBuild }, () => {
  const home = read('build/index.html.md');
  assert.ok(home.length > 500);
  assert.match(home, /^# /m);
  assert.match(read('build/404.md'), /llms\.txt/);
});
