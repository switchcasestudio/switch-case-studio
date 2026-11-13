/**
 * Writes a Markdown copy of every built page (postbuild), which the edge
 * function netlify/edge-functions/markdown.js serves to clients that send
 * Accept: text/markdown (is-agentic scan, 2026-11-13).
 *
 *   build/about.html            -> build/about.md
 *   build/index.html            -> build/index.html.md   (llms.txt convention)
 *   build/unhurried-pro/index.html -> build/unhurried-pro.md
 *   build/404.html              -> build/404.md          (the 404 body)
 *
 * The Markdown is the page's <main> only (no menu, footer or cookie banner),
 * with scripts, SVG, controls and aria-hidden decoration removed and every
 * link made absolute. Pages marked noindex are skipped: the edge function
 * then falls back to HTML. Fails the build if a page has no <main> or an
 * em dash comes through (owner rule for anything that renders).
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';
import { markdownPathFor } from '../netlify/lib/agentMarkdown.mjs';

export const SITE = 'https://switchcasestudio.com';

const DROP = [
  'script', 'style', 'noscript', 'template', 'svg', 'canvas', 'video',
  'audio', 'iframe', 'button', 'input', 'select', 'textarea', 'form',
  'dialog', 'picture > source',
];

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
  });
  td.remove(DROP);
  // Decoration the page hides from screen readers is hidden from agents too.
  td.addRule('hidden', {
    filter: (node) =>
      node.nodeType === 1 &&
      (node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('hidden')),
    replacement: () => '',
  });
  // Link text without the padding the spacing pass leaves inside it.
  td.addRule('trimmedLink', {
    filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
    replacement: (content, node) => {
      const text = content.replace(/\s+/g, ' ').trim();
      if (!text) return '';
      const title = node.getAttribute('title');
      return `[${text}](${node.getAttribute('href')}${title ? ` "${title}"` : ''})`;
    },
  });
  // An image with no alt is decorative.
  td.addRule('decorativeImage', {
    filter: (node) => node.nodeName === 'IMG' && !(node.getAttribute('alt') || '').trim(),
    replacement: () => '',
  });
  return td;
}

const td = makeTurndown();

/* Root-relative links and images become absolute, so the Markdown works
   pasted anywhere. */
export function absolutize(md) {
  return md.replace(/\]\(\/(?!\/)/g, `](${SITE}/`);
}

export function mainOf(html) {
  const open = html.search(/<main[\s>]/i);
  if (open < 0) return null;
  const start = html.indexOf('>', open) + 1;
  const end = html.lastIndexOf('</main>');
  return end > start ? html.slice(start, end) : null;
}

export function isNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

const footer = (pagePath) => [
  '---',
  '',
  pagePath === null
    ? 'Find a page:'
    : `Page: ${SITE}${pagePath === '/' ? '/' : pagePath}`,
  '',
  `- [Site index for agents (llms.txt)](${SITE}/llms.txt)`,
  `- [Sitemap](${SITE}/sitemap.xml)`,
  `- [Home](${SITE}/)`,
  '',
].join('\n');

/* Cards stack their parts in sibling spans and divs with no whitespace
   between them, which reads fine on screen and as "DesignExplore the
   service" in text. A space before each closing block tag, and before a
   closing span that holds more than one character, keeps the words apart;
   single-letter spans (per-character title animations) stay joined. */
export function spaceOutBlocks(html) {
  return html
    .replace(/<\/(div|p|h[1-6]|li|dt|dd|figcaption|header|section|article)>/gi, ' </$1>')
    .replace(/([^<>\s][^<>]+)<\/span>/gi, '$1 </span>')
    .replace(/<\/span><\/span>/gi, '</span> </span>');
}

/* pagePath null = the 404 page. */
export function htmlToMarkdown(html, pagePath) {
  const main = mainOf(html);
  if (main === null) throw new Error('no <main> element');
  const body = absolutize(td.turndown(spaceOutBlocks(main)))
    .replace(/\)\[/g, ') [') // two links side by side
    .replace(/([.?:])\[/g, '$1 [') // a link right after a sentence
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return `${body}\n\n${footer(pagePath)}`;
}

/* build/x/y.html -> /x/y, build/index.html -> /, build/a/index.html -> /a/ */
export function routeOf(rel) {
  const p = `/${rel.split('\\').join('/')}`;
  if (p === '/index.html') return '/';
  if (p.endsWith('/index.html')) return p.slice(0, -'index.html'.length);
  return p.replace(/\.html$/, '');
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : d.name.endsWith('.html') ? [join(dir, d.name)] : [],
  );
}

function run(buildDir) {
  let written = 0;
  const skipped = [];
  const failures = [];
  for (const file of walk(buildDir)) {
    const rel = relative(buildDir, file);
    const html = readFileSync(file, 'utf8');
    const route = routeOf(rel);
    const is404 = rel === '404.html';
    if (!is404 && isNoindex(html)) {
      skipped.push(route);
      continue;
    }
    let md;
    try {
      md = htmlToMarkdown(html, is404 ? null : route);
    } catch (e) {
      failures.push(`${rel}: ${e.message}`);
      continue;
    }
    if (/—/.test(md)) failures.push(`${rel}: em dash in the Markdown`);
    const out = is404 ? '/404.md' : markdownPathFor(route);
    writeFileSync(join(buildDir, out), md);
    written += 1;
  }
  if (failures.length) {
    console.error(`markdown: ${failures.length} page(s) failed\n  ${failures.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`markdown: ${written} pages written, ${skipped.length} noindex skipped (${skipped.join(', ')})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  run(resolve(root, process.argv[2] || 'build'));
}
