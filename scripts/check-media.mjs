/**
 * Prebuild guard: every media path projects.json and team.json name must
 * exist under public/, including the siblings the pages DERIVE by filename,
 * and every og:image must be a format social scrapers decode.
 *
 * Why: every one of these renders a perfect-looking page when it is wrong.
 * A missing `long-700.webp` (derived by CaseStudyPage for phones, SEO audit
 * fix 12) is a broken image inside srcset, which has no fallback; a missing
 * `preview-600.webp` is the same on /projects; a dead `imageSrc` ships a 404
 * social card; an AVIF `imageSrc` is a blank card on Facebook, X and LinkedIn
 * (CLAUDE.md, "Adding a project" rule). Exits 1 and names each problem.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => resolve(root, 'public', p.replace(/^\//, ''));
const readJson = (rel) => JSON.parse(readFileSync(resolve(root, rel), 'utf8'));

const problems = [];
const need = (owner, field, p) => {
  if (typeof p !== 'string' || !p.startsWith('/')) return;
  if (!existsSync(pub(p))) problems.push(`${owner}: ${field} ${p} does not exist under public/`);
};

for (const p of readJson('src/data/projects.json')) {
  const who = `projects/${p.slug}`;
  for (const f of ['coverTile', 'imageSrc', 'preview', 'longWeb', 'diagram', 'clientLogo', 'mediaMobile', 'mediaCopy', 'mediaCta']) need(who, f, p[f]);
  if (p.preview?.endsWith('preview.webp')) need(who, 'preview (600w sibling)', p.preview.replace(/preview\.webp$/, 'preview-600.webp'));
  if (p.longWeb?.endsWith('/long.webp')) need(who, 'longWeb (700w sibling)', p.longWeb.replace(/long\.webp$/, 'long-700.webp'));
  for (const c of p.comparisons || []) need(who, 'comparisons[].src', c.src);
  for (const b of p.brandKit || []) { need(who, 'brandKit[].src', b.src); need(who, 'brandKit[].srcSmall', b.srcSmall); }
  if (p.imageSrc && !/\.(jpe?g|png|webp)$/i.test(p.imageSrc)) problems.push(`${who}: imageSrc ${p.imageSrc} is the og:image and must be JPEG, PNG or WebP`);
}
for (const t of readJson('src/data/team.json')) need(`team/${t.name}`, 'photo', t.photo);
for (const post of readJson('src/data/posts.json')) need(`blog/${post.slug}`, 'coverImage', post.coverImage);

if (problems.length) {
  console.error(`check:media — ${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('check:media — OK (every referenced file exists; og images are scraper-safe)');
