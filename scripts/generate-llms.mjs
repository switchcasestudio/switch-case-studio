/**
 * Generates public/llms.txt (https://llmstxt.org) from the data files that
 * define the site, so it cannot drift from what is routable or claimed.
 * Runs before every build (package.json "prebuild"), like the sitemap.
 *
 * Why (SEO audit fix 13, 2026-10-09): /pricing/marketing-ads sells llms.txt
 * as part of AI-search readiness while switchcasestudio.com/llms.txt was a
 * 404. Google says it does not need the file; other AI tools read it, and a
 * studio that sells it should ship one.
 *
 * Rules: every figure comes from projects.json (`indexMetric`, itself a
 * verbatim `metrics[]` value), nothing is typed here, and the output may not
 * contain an em dash (owner rule for anything that renders); the script
 * exits non-zero if one sneaks in through the data.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://switchcasestudio.com';
const readJson = (rel) => JSON.parse(readFileSync(resolve(root, rel), 'utf8'));

const projects = readJson('src/data/projects.json');
const services = readJson('src/data/services.json');
const posts = readJson('src/data/posts.json')
  .slice()
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

const clean = (s = '') => String(s).replace(/\s+/g, ' ').trim().replace(/\.$/, '');
const link = (title, path, note) => `- [${title}](${SITE}${path})${note ? `: ${note}` : ''}`;

const caseNote = (p) => {
  const parts = [clean(p.subtitle || p.indexLine)];
  if (p.studioProject) parts.push('Studio project');
  if (p.indexMetric?.value) parts.push(`${p.indexMetric.value} ${clean(p.indexMetric.label)}`);
  return parts.filter(Boolean).join('. ');
};

const out = `# Switch Case Studio

> An engineer-led design and development studio in Portland, Oregon. Websites, online stores, web apps and AI systems, designed, built and measured by the people you talk to.

The studio offers ${services.length} services, each with published package prices. Where a case study has a measured figure it is listed below; each case study page says how it was measured.

## Services

${services.map((s) => link(s.title, `/pricing/${s.slug}`, clean(s.subTitle))).join('\n')}

## Case studies

${projects.map((p) => link(p.title, `/projects/${p.slug}`, caseNote(p))).join('\n')}

## Pages

${[
  link('About', '/about', 'The team, how a project runs, and the stack'),
  link('Case studies', '/projects', 'Every project, grouped by type'),
  link('Services and pricing', '/pricing', `All ${services.length} services and their packages`),
  link('Client reviews', '/testimonials'),
  link('Shop', '/shop', 'WordPress themes and one-to-one office hours'),
  link('Contact', '/contact', 'Book a strategy call or send a message'),
].join('\n')}

## Journal

${posts.map((p) => link(p.title, `/blog/${p.slug}`, clean(p.excerpt))).join('\n')}

## Optional

${[
  link('Privacy Policy', '/privacy'),
  link('Terms of Use', '/terms'),
  link('Accessibility Statement', '/accessibility'),
].join('\n')}
`;

if (/—/.test(out)) {
  console.error('llms.txt: an em dash came through the data; fix the source text.');
  process.exit(1);
}

writeFileSync(resolve(root, 'public/llms.txt'), out);
console.log(`llms.txt: ${services.length} services, ${projects.length} case studies, ${posts.length} posts`);
