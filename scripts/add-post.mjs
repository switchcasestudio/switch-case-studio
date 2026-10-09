/**
 * add-post.mjs — safely insert a blog post into src/data/posts.json.
 *
 * This is the publish muscle for the Studio Journal Factory: Beau (the SCS
 * OpenClaw agent) writes a post as JSON, then runs this script to splice it
 * into the data file that drives /blog and /blog/:slug. Doing the insert here
 * — rather than hand-editing JSON in the shell — means the file can never be
 * left malformed and a bad post is rejected instead of shipped.
 *
 * Usage:
 *   node scripts/add-post.mjs path/to/new-post.json
 *   node scripts/add-post.mjs path/to/new-post.json --dry-run
 *
 * Exit codes: 0 = inserted (or dry-run OK), 1 = validation/IO error.
 *
 * Contract for the incoming post object (matches BlogPostPage.js / posts.json):
 *   slug         string, kebab-case, unique         (required)
 *   title        string                             (required)
 *   excerpt      string, ~1-2 sentences             (required)
 *   category     string  e.g. "Web Development"     (required)
 *   body         array of blocks                    (required, >=1)
 *                 { type: 'paragraph', text }   text may carry inline links: [label](url)
 *                 { type: 'heading',   text }
 *                 { type: 'list',      items: [] } items may carry inline links too
 *                 (url = root-absolute path or https; anything else is rejected.
 *                 Since 2026-10-09; a statistic or a quoted fact links its source
 *                 this way: "[Google says](https://developers.google.com/...)".)
 *                 { type: 'quote',     text, cite? }
 *                 { type: 'video',     url, caption?/title? }
 *                 { type: 'download',  url, label, note? }
 *                 { type: 'link',      url, label, note? }  (a button link: root-absolute or https)
 *   author       string  (default "Moses Atia Poston")
 *   authorRole   string  (default "Founder")
 *   date         "YYYY-MM-DD" (default: today, America/Los_Angeles)
 *   kicker       string  (default: category)
 *   readingTime  string  (default: derived from word count)
 *   coverImage   string  (default "" — the list page renders a branded fallback)
 *   imageAlt     string  (default "")
 *   tags         string[] (default [])
 *   featured     boolean (default false)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// The renderer's own link parser, so the gate and the page agree.
import { badLinks, plainText } from '../src/components/blog/inlineLinks.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = resolve(root, 'src/data/posts.json');
const BLOCK_TYPES = new Set(['paragraph', 'heading', 'list', 'quote', 'video', 'download', 'link']);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const inputPath = args.find((a) => !a.startsWith('--'));

const die = (msg) => {
  console.error(`add-post: ${msg}`);
  process.exit(1);
};

if (!inputPath) die('usage: node scripts/add-post.mjs <post.json> [--dry-run]');

/* ── today in PT, as YYYY-MM-DD ── */
const todayPT = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

/* ── reading time from the body text (~200 wpm) ── */
const readingTimeFrom = (body) => {
  const words = body
    .map((b) => plainText(b.text || (b.items || []).join(' ') || ''))
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

const isKebab = (s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

/* ── validate one body block ── */
const validateBlock = (b, i) => {
  if (!b || typeof b !== 'object') return `body[${i}] is not an object`;
  if (!BLOCK_TYPES.has(b.type)) return `body[${i}].type "${b.type}" is not one of ${[...BLOCK_TYPES].join('/')}`;
  if (b.type === 'list') {
    if (!Array.isArray(b.items) || b.items.length === 0)
      return `body[${i}] (list) needs a non-empty items array`;
    const bad = b.items.flatMap((item) => badLinks(item));
    if (bad.length) return `body[${i}] (list) has an inline link whose url is not root-absolute or https: ${bad[0]}`;
  } else if (b.type === 'paragraph') {
    if (typeof b.text !== 'string' || !b.text.trim())
      return `body[${i}] (paragraph) needs non-empty text`;
    const bad = badLinks(b.text);
    if (bad.length) return `body[${i}] (paragraph) has an inline link whose url is not root-absolute or https: ${bad[0]}`;
  } else if (b.type === 'video') {
    if (typeof b.url !== 'string' || !b.url.trim())
      return `body[${i}] (video) needs a url`;
  } else if (b.type === 'download') {
    if (typeof b.url !== 'string' || !b.url.startsWith('/'))
      return `body[${i}] (download) needs a root-absolute url into public/`;
    if (typeof b.label !== 'string' || !b.label.trim())
      return `body[${i}] (download) needs a label`;
  } else if (b.type === 'link') {
    if (typeof b.url !== 'string' || !(b.url.startsWith('/') || b.url.startsWith('https://')))
      return `body[${i}] (link) needs a root-absolute or https url`;
    if (typeof b.label !== 'string' || !b.label.trim())
      return `body[${i}] (link) needs a label`;
  } else if (typeof b.text !== 'string' || !b.text.trim()) {
    return `body[${i}] (${b.type}) needs non-empty text`;
  }
  return null;
};

/* ── read + parse input ── */
let post;
try {
  post = JSON.parse(readFileSync(resolve(inputPath), 'utf8'));
} catch (e) {
  die(`could not read/parse ${inputPath}: ${e.message}`);
}

/* ── validate required fields ── */
for (const f of ['slug', 'title', 'excerpt', 'category', 'body']) {
  if (post[f] === undefined || post[f] === null || post[f] === '')
    die(`missing required field: ${f}`);
}
if (!isKebab(post.slug)) die(`slug "${post.slug}" must be kebab-case (a-z, 0-9, hyphens)`);
if (!Array.isArray(post.body) || post.body.length === 0)
  die('body must be a non-empty array of blocks');
for (let i = 0; i < post.body.length; i++) {
  const err = validateBlock(post.body[i], i);
  if (err) die(err);
}
if (post.date && !/^\d{4}-\d{2}-\d{2}$/.test(post.date))
  die(`date "${post.date}" must be YYYY-MM-DD`);

/* ── read existing posts ── */
let posts;
try {
  posts = JSON.parse(readFileSync(POSTS, 'utf8'));
} catch (e) {
  die(`could not read ${POSTS}: ${e.message}`);
}
if (!Array.isArray(posts)) die('posts.json is not an array');
if (posts.some((p) => p.slug === post.slug))
  die(`a post with slug "${post.slug}" already exists — pick a new slug`);

/* ── normalize with defaults ── */
const normalized = {
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  kicker: post.kicker || post.category,
  category: post.category,
  author: post.author || 'Moses Atia Poston',
  authorRole: post.authorRole || 'Founder',
  date: post.date || todayPT(),
  readingTime: post.readingTime || readingTimeFrom(post.body),
  coverImage: post.coverImage || '',
  imageAlt: post.imageAlt || '',
  tags: Array.isArray(post.tags) ? post.tags : [],
  featured: Boolean(post.featured),
  body: post.body,
};

/* ── insert newest-first (the page sorts by date too, but keep the file tidy) ── */
posts.unshift(normalized);

if (dryRun) {
  console.log(`add-post: DRY RUN ok — "${normalized.title}" (${normalized.slug}), ${normalized.date}, ${normalized.readingTime}`);
  console.log(`add-post: posts.json would grow to ${posts.length} entries`);
  process.exit(0);
}

writeFileSync(POSTS, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`add-post: inserted "${normalized.title}" (${normalized.slug}) — posts.json now ${posts.length} entries`);
