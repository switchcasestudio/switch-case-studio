/**
 * Regenerates public/sitemap.xml from the same data files that define the
 * routes (src/data/projects.json, src/data/services.json, posts.json), so
 * the sitemap can never drift from what's actually routable. Runs
 * automatically before `npm run build` (see package.json "prebuild").
 *
 * lastmod is PER PAGE (SEO audit fix 13, 2026-10-09). Before, every case
 * study shared projects.json's last commit date and every static page
 * shared the date of any change under src/, so one edit re-dated 24 URLs at
 * once and lastmod said nothing. Now:
 *   - a blog post: its own `date`;
 *   - a case study / a service: the last commit that changed THAT entry
 *     (its object in projects.json; its objects in services.json and
 *     pricingData.json), found by walking the data file's git history;
 *   - a static page: the last commit touching its own source files.
 * Without git (a tarball build) everything falls back to today. Netlify's
 * clone carries history, so the live sitemap gets real dates.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://switchcasestudio.com';
const TODAY = new Date().toISOString().slice(0, 10);

const readJson = (rel) => JSON.parse(readFileSync(resolve(root, rel), 'utf8'));
const projects = readJson('src/data/projects.json');
const services = readJson('src/data/services.json');
const posts = readJson('src/data/posts.json');

const git = (args) => execSync(`git ${args}`, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/** Last commit date (YYYY-MM-DD) touching any of these paths; today without git. */
const lastmodOf = (...paths) => {
  try {
    const out = git(`log -1 --format=%cs -- ${paths.map((p) => `"${p}"`).join(' ')}`).trim();
    if (out) return out;
  } catch {
    /* not a git checkout — fall through */
  }
  return TODAY;
};

/**
 * For a JSON array file, the date each entry (keyed by `keyOf`) last
 * changed: walk the file's commits oldest → newest and record the commit
 * date whenever an entry's serialized form differs from the previous
 * version. Uncommitted edits count as today.
 */
const entryDates = (rel, keyOf) => {
  const dates = new Map();
  try {
    const commits = git(`log --reverse --format="%H %cs" -- "${rel}"`)
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((l) => l.split(' '));
    let prev = new Map();
    for (const [hash, date] of commits) {
      let list;
      try {
        list = JSON.parse(git(`show ${hash}:"${rel}"`));
      } catch {
        continue; // a commit where the file was malformed or absent
      }
      const now = new Map((Array.isArray(list) ? list : list.services || []).map((e) => [keyOf(e), JSON.stringify(e)]));
      for (const [k, v] of now) if (prev.get(k) !== v) dates.set(k, date);
      prev = now;
    }
    // Working-tree edits not yet committed.
    const current = readJson(rel);
    for (const e of Array.isArray(current) ? current : current.services || []) {
      if (prev.get(keyOf(e)) !== JSON.stringify(e)) dates.set(keyOf(e), TODAY);
    }
  } catch {
    /* no git: callers fall back to today */
  }
  return dates;
};

const max = (...ds) => ds.filter(Boolean).sort().pop() || TODAY;

const projectDates = entryDates('src/data/projects.json', (p) => p.slug);
const serviceDates = entryDates('src/data/services.json', (s) => s.slug);
// pricingData keys services by id; one legacy id differs from its slug.
const PRICING_ID = { 'marketing-ads': 'marketing-advertisement' };
const pricingDates = entryDates('src/data/pricingData.json', (s) => s.id);
const newestPost = max(...posts.map((p) => p.date));

const page = (...files) => lastmodOf(...files.map((f) => (f.includes('/') ? f : `src/components/pages/${f}`)));

// NOTE: hidden routes are deliberately NOT listed here — /30-off (promo) and
// the agency-wholesale page (served from an unguessable /p/wm-… slug) are
// noindex and linked only from emails/ads, so they must stay out of the
// sitemap. Adding a PUBLIC page? Add its loc below, with the files it is
// built from.
const urls = [
  { loc: '/', lastmod: lastmodOf('src/routes.js', 'src/components/sections', 'src/data/services.json', 'src/data/testimonials.json', 'src/data/projects.json'), priority: '1.0' },
  { loc: '/about', lastmod: page('AboutPage.js', 'src/data/team.json', 'src/components/sections/Polaroids.js'), priority: '0.8' },
  { loc: '/projects', lastmod: max(page('CaseStudiesPage.js', 'src/data/projectGroups.js'), ...projectDates.values()), priority: '0.8' },
  { loc: '/pricing', lastmod: page('ServiceIndexPage.js', 'src/data/services.json'), priority: '0.8' },
  { loc: '/testimonials', lastmod: page('ReviewsPage.js', 'src/data/testimonials.json'), priority: '0.7' },
  { loc: '/contact', lastmod: page('ContactPage.js', 'src/components/sections/Contact.js'), priority: '0.7' },
  { loc: '/blog', lastmod: newestPost, priority: '0.7' },
  { loc: '/shop', lastmod: page('ShopPage.js', 'src/data/shop.json'), priority: '0.7' },
  { loc: '/unhurried-pro/', lastmod: lastmodOf('public/unhurried-pro/index.html'), priority: '0.6' },
  ...posts.map((p) => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.date || newestPost,
    priority: '0.6',
  })),
  ...services.map((s) => ({
    loc: `/pricing/${s.slug}`,
    lastmod: max(serviceDates.get(s.slug), pricingDates.get(PRICING_ID[s.slug] || s.slug)),
    priority: '0.6',
  })),
  ...projects.map((p) => ({
    loc: `/projects/${p.slug}`,
    lastmod: projectDates.get(p.slug) || TODAY,
    priority: '0.6',
  })),
  { loc: '/privacy', lastmod: page('Privacy.js', 'src/data/legal.js'), priority: '0.3' },
  { loc: '/terms', lastmod: page('Terms.js', 'src/data/legal.js'), priority: '0.3' },
  { loc: '/accessibility', lastmod: page('Accessibility.js'), priority: '0.3' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URLs written`);
