#!/usr/bin/env node
// Reads the cookie-free visit log (netlify/functions/visit.mjs) and prints a
// summary: totals, visitors per day, where they came from, cities, pages, and
// a timeline of each visitor's pages.
//
//   node scripts/visits.mjs                 last 7 days
//   node scripts/visits.mjs --days 30
//   node scripts/visits.mjs --where Irvine  only visits whose city/region/country matches
//   node scripts/visits.mjs --from linkedin only visits whose referrer or utm_source matches
//   node scripts/visits.mjs --json          raw records
//
// Auth: NETLIFY_AUTH_TOKEN, else the token `netlify login` saved. Site id from
// .netlify/state.json (`netlify link`). Times print in this machine's time zone.
import { getStore } from '@netlify/blobs';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE = 'site-visits';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const days = Number(opt('days', 7));
const where = opt('where', '')?.toLowerCase();
const from = opt('from', '')?.toLowerCase();
const asJson = args.includes('--json');

function token() {
  if (process.env.NETLIFY_AUTH_TOKEN) return process.env.NETLIFY_AUTH_TOKEN;
  const paths = [
    join(homedir(), 'Library/Preferences/netlify/config.json'),
    join(homedir(), '.config/netlify/config.json'),
  ];
  for (const p of paths) {
    try {
      const c = JSON.parse(readFileSync(p, 'utf8'));
      const t = c.users?.[c.userId]?.auth?.token;
      if (t) return t;
    } catch {
      // try the next path
    }
  }
  throw new Error('No Netlify token: run `netlify login` or set NETLIFY_AUTH_TOKEN');
}

const siteID = JSON.parse(readFileSync(new URL('../.netlify/state.json', import.meta.url), 'utf8')).siteId;
const store = getStore({ name: STORE, siteID, token: token() });

const dayKeys = [];
for (let i = days - 1; i >= 0; i -= 1) {
  dayKeys.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
}

const keys = [];
for (const day of dayKeys) {
  const { blobs } = await store.list({ prefix: `${day}/` });
  keys.push(...blobs.map((b) => b.key));
}

const records = [];
for (let i = 0; i < keys.length; i += 20) {
  const batch = await Promise.all(keys.slice(i, i + 20).map((k) => store.get(k, { type: 'json' })));
  records.push(...batch.filter(Boolean));
}

const source = (r) => r.utm?.source || r.referrer || 'direct';
const place = (r) => [r.city, r.region, r.country_code].filter(Boolean).join(', ') || 'unknown';

let rows = records.filter((r) => !r.deploy_context || r.deploy_context === 'production');
if (where) rows = rows.filter((r) => place(r).toLowerCase().includes(where) || (r.country || '').toLowerCase().includes(where));
if (from) {
  // Keep every page of a visitor whose entry matched, not just the entry hit.
  const ids = new Set(rows.filter((r) => source(r).toLowerCase().includes(from)).map((r) => `${r.at.slice(0, 10)}|${r.visitor}`));
  rows = rows.filter((r) => ids.has(`${r.at.slice(0, 10)}|${r.visitor}`));
}
rows.sort((a, b) => a.at.localeCompare(b.at));

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const fmt = (iso, o) => new Date(iso).toLocaleString('en-US', o);
const count = (list, fn) => {
  const m = new Map();
  for (const x of list) m.set(fn(x), (m.get(fn(x)) || 0) + 1);
  return [...m].sort((a, b) => b[1] - a[1]);
};
const table = (title, pairs, n = 15) => {
  console.log(`\n${title}`);
  if (!pairs.length) console.log('  (none)');
  for (const [k, v] of pairs.slice(0, n)) console.log(`  ${String(v).padStart(4)}  ${k}`);
};

// A "visit" is one visitor on one day (the hash resets daily by design).
const visits = new Map();
for (const r of rows) {
  const id = `${r.at.slice(0, 10)}|${r.visitor}`;
  if (!visits.has(id)) visits.set(id, []);
  visits.get(id).push(r);
}
const firsts = [...visits.values()].map((v) => v.find((r) => r.entry) || v[0]);

const filters = [where && `where "${where}"`, from && `from "${from}"`].filter(Boolean).join(', ');
console.log(`Visit log, last ${days} days${filters ? ` (${filters})` : ''}`);
console.log(`  ${visits.size} visitor-days, ${rows.length} page views`);

table(
  'Visitors per day',
  dayKeys.map((d) => [d, firsts.filter((r) => r.at.startsWith(d)).length]).reverse(),
  days,
);
table('Came from', count(firsts, source));
table('Where', count(firsts, place));
table('Device', count(firsts, (r) => `${r.device?.type} · ${r.device?.os} · ${r.device?.browser}`), 8);
table('Pages', count(rows, (r) => r.path));

console.log('\nTimeline (newest first)');
for (const v of [...visits.values()].reverse().slice(0, 40)) {
  const f = v.find((r) => r.entry) || v[0];
  const when = fmt(f.at, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  console.log(`  ${when} · ${place(f)} · ${source(f)} · ${f.device?.type}`);
  console.log(`      ${v.map((r) => r.path).join(' → ')}`);
}
