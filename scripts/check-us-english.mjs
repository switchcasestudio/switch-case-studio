#!/usr/bin/env node
/* US English check (owner, 2026-10-22: "I live in America... we write
   color, not colour"; 2026-10-25: "US spelling ONLY"). Fails with file and
   word on any British spelling in:
   - every built page: visible text, plus alt / title / aria-label /
     placeholder / meta content and the JSON-LD (search engines and screen
     readers read those; the 2026-10-22 version skipped them and "full
     colour" sat in an alt from 2026-09-24), and the generated text files;
   - the source the bundles are made from (src/, public/, content/), comments
     included, so client-only strings are covered too;
   - file names under public/ (they show in image URLs).
   Text inside images and video is checked by `npm run check:us:images`
   (OCR, needs tesseract, local only). Runs on postbuild. The word list lives
   in british-words.mjs. Code identifiers are not prose: `aria-labelledby`
   is the HTML attribute's real name and is never flagged. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { BRITISH_RE } from './british-words.mjs';

const BUILD = process.argv[2] || 'build';
const SOURCES = ['src', 'public', 'content'];
const TEXT = new Set(['.html', '.txt', '.xml', '.js', '.mjs', '.json', '.scss', '.css', '.svg', '.md']);

function* walk(dir, all = false) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p, all);
    else if (all || TEXT.has(extname(name).toLowerCase())) yield p;
  }
}

const page = (html) => {
  const text = html
    .replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|aria-description|placeholder|content)="([^"]*)"/g)].map((m) => m[1]);
  return `${text} ${attrs.join(' ')}`.replace(/&[a-z#0-9]+;/gi, ' ').replace(/aria-labelledby/g, ' ');
};

const hits = [];
const scan = (label, text) => {
  for (const m of text.matchAll(BRITISH_RE())) hits.push(`${label}: ${m[0]}`);
};

for (const file of walk(BUILD)) {
  if (/\.(html|txt|xml)$/.test(file)) scan(file, file.endsWith('.html') ? page(readFileSync(file, 'utf8')) : readFileSync(file, 'utf8'));
}
for (const root of SOURCES) {
  for (const file of walk(root)) scan(file, readFileSync(file, 'utf8').replace(/aria-labelledby/g, ' '));
}
for (const file of walk('public', true)) scan(`${file} (file name)`, file.replace(/[/_.-]/g, ' '));

if (hits.length) {
  console.error(`US English check: ${hits.length} British spelling(s)\n  ${[...new Set(hits)].join('\n  ')}`);
  process.exit(1);
}
console.log('US English check: clean (built pages, attributes, JSON-LD, src/public/content, file names)');
