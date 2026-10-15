// Cookie-free visit log (2026-10-15). GA4 only counts visitors who accept the
// cookie banner, so most visits never reach it. This endpoint records every
// page view the site's own script reports (src/analytics/visitLog.js) with no
// cookie and no stored IP: time, page, referrer host, UTM tags, the Netlify
// geo lookup (city, region, country), device class, and a visitor hash that
// changes every day (sha256 of a random daily salt + IP + user agent, the
// Plausible method). The salt is deleted by visits-purge.mjs after its day,
// so the hash cannot be traced back; it only says "same visitor, same day".
// Records are kept 12 months, as the privacy policy says.
//
// Store "site-visits", key "YYYY-MM-DD/<ISO time>_<id>". Read with
// `node scripts/visits.mjs` (see its header).
//
// VISITS_IGNORE_IPS (Netlify env, never in git: this repo is public): comma-
// separated IPv4/IPv6 addresses or CIDR ranges whose visits are dropped, the
// studio's own networks. Home ISPs reassign addresses, so the per-browser
// ?visits=off opt-out (visitLog.js) is the reliable one; this list catches
// devices that never opened it.
import { getStore } from '@netlify/blobs';
import { createHash, randomBytes, randomUUID } from 'node:crypto';

const STORE = 'site-visits';
const MAX_BODY = 2000;
const BOT_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|python|curl|wget|httpclient|phantom|puppeteer|playwright|selenium/i;

const noContent = () => new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });

const host = (url) => {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
};

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function device(ua) {
  const os = /iPhone|iPad|iPod/.test(ua)
    ? 'iOS'
    : /Android/.test(ua)
      ? 'Android'
      : /Mac OS X/.test(ua)
        ? 'macOS'
        : /Windows/.test(ua)
          ? 'Windows'
          : /CrOS/.test(ua)
            ? 'ChromeOS'
            : /Linux/.test(ua)
              ? 'Linux'
              : 'other';
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /OPR\//.test(ua)
      ? 'Opera'
      : /SamsungBrowser/.test(ua)
        ? 'Samsung'
        : /Firefox|FxiOS/.test(ua)
          ? 'Firefox'
          : /Chrome|CriOS/.test(ua)
            ? 'Chrome'
            : /Safari/.test(ua)
              ? 'Safari'
              : 'other';
  const type = /iPad|Tablet/.test(ua) ? 'tablet' : /Mobi|iPhone|Android/.test(ua) ? 'mobile' : 'desktop';
  return { type, os, browser };
}

// IP → [BigInt, bit length], or null. IPv6 handles "::" and drops a zone id;
// IPv4-mapped IPv6 ("::ffff:1.2.3.4") is read as IPv4.
function ipBits(ip) {
  const s = ip.trim().replace(/%.*$/, '').replace(/^::ffff:(?=\d+\.)/i, '');
  if (/^\d+\.\d+\.\d+\.\d+$/.test(s)) {
    const parts = s.split('.').map(Number);
    if (parts.some((p) => p > 255)) return null;
    return [parts.reduce((n, p) => (n << 8n) + BigInt(p), 0n), 32];
  }
  if (!s.includes(':')) return null;
  const [head, tail] = s.split('::');
  const h = head ? head.split(':') : [];
  const t = tail !== undefined && tail ? tail.split(':') : [];
  const groups = tail === undefined ? h : [...h, ...Array(8 - h.length - t.length).fill('0'), ...t];
  if (groups.length !== 8 || groups.some((g) => !/^[0-9a-f]{1,4}$/i.test(g))) return null;
  return [groups.reduce((n, g) => (n << 16n) + BigInt(parseInt(g, 16)), 0n), 128];
}

function ignored(ip) {
  const list = (process.env.VISITS_IGNORE_IPS || '').split(',').filter((x) => x.trim());
  const addr = ip && ipBits(ip);
  if (!addr || !list.length) return false;
  return list.some((entry) => {
    const [base, len] = entry.trim().split('/');
    const net = ipBits(base);
    if (!net || net[1] !== addr[1]) return false;
    const prefix = len === undefined ? net[1] : Number(len);
    const shift = BigInt(net[1] - prefix);
    return net[0] >> shift === addr[0] >> shift;
  });
}

// One random salt per UTC day, created on first use. Two requests racing on a
// new day may each write one; the last write wins and a visitor's first hit of
// the day can carry a different hash. Acceptable for counting.
async function dailySalt(store, day) {
  const key = `salt/${day}`;
  const existing = await store.get(key);
  if (existing) return existing;
  const salt = randomBytes(32).toString('hex');
  await store.set(key, salt);
  return salt;
}

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const siteHost = new URL(req.url).host;
  const origin = req.headers.get('origin');
  if (!origin || host(origin) !== siteHost) return noContent();

  const ua = req.headers.get('user-agent') || '';
  if (!ua || BOT_UA.test(ua)) return noContent();
  if (ignored(context.ip)) return noContent();

  const text = await req.text();
  if (text.length > MAX_BODY) return noContent();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return noContent();
  }

  const path = clean(body.path, 300);
  if (!path.startsWith('/')) return noContent();

  const ref = clean(body.referrer, 500);
  const refHost = host(ref);
  const params = new URLSearchParams(path.split('?')[1] || '');

  const now = new Date();
  const at = now.toISOString();
  const day = at.slice(0, 10);
  const store = getStore({ name: STORE, consistency: 'strong' });
  const salt = await dailySalt(store, day);
  const visitor = createHash('sha256')
    .update(`${salt}|${context.ip || ''}|${ua}`)
    .digest('hex')
    .slice(0, 16);

  const geo = context.geo || {};
  const record = {
    at,
    path: path.split('?')[0],
    entry: body.entry === true,
    referrer: refHost && refHost !== siteHost ? refHost : null,
    utm: {
      source: params.get('utm_source')?.slice(0, 100) || null,
      medium: params.get('utm_medium')?.slice(0, 100) || null,
      campaign: params.get('utm_campaign')?.slice(0, 100) || null,
    },
    city: geo.city || null,
    region: geo.subdivision?.name || null,
    country: geo.country?.name || null,
    country_code: geo.country?.code || null,
    timezone: geo.timezone || null,
    device: device(ua),
    language: clean(req.headers.get('accept-language'), 100).split(',')[0] || null,
    visitor,
    deploy_context: context.deploy?.context || null,
  };

  await store.setJSON(`${day}/${at.replace(/:/g, '-')}_${randomUUID().slice(0, 8)}`, record);
  return noContent();
};

export const config = { path: '/api/visit' };
