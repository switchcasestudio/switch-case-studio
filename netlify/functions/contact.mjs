// Contact form endpoint (2026-10-08). Both site forms post here instead of
// calling EmailJS from the browser, so the server, not the sender, writes the
// record: connection IP and its Netlify geo lookup, user agent, server
// timestamp, consent with the policy versions in force, and the fields. The
// record lands in Netlify Blobs (store "contact-submissions", private, kept 24
// months by contact-records-purge.mjs, as the privacy policy says), then the
// message is emailed through the EmailJS REST API with the record appended.
// A suspicious submission is still delivered, flagged "⚠" in the subject; a
// filled honeypot is recorded but not emailed (bots would burn the EmailJS quota).
//
// Netlify environment variables (set in the Netlify UI, never in git):
//   VITE_EMAILJS_SERVICE_ID / _TEMPLATE_ID / _USER_ID  same values the browser used
//   EMAILJS_PRIVATE_KEY   EmailJS Account → API keys → Private Key; needs
//                         "Allow EmailJS API for non-browser applications" on
//   CONTACT_DRY_RUN=1     local testing: record, but send no email
//
// Read records: `netlify blobs:list contact-submissions`, then
// `netlify blobs:get contact-submissions <key>`. The key is in every email.
import { getStore } from '@netlify/blobs';
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';
import { randomUUID } from 'node:crypto';
import { CONSENT_TEXT, PRIVACY_UPDATED, TERMS_UPDATED } from '../../src/data/legal.js';

const STORE = 'contact-submissions';
const SOURCES = new Set(['contact', '30-off-promo']);
const LIMITS = { first_name: 200, email: 254, phone: 40, project_type: 60, message: 5000, page: 200 };
const MAX_BODY = 20000;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const originHost = (origin) => {
  try {
    return new URL(origin).host;
  } catch {
    return null; // "null" origins (sandboxed frames) never match
  }
};

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Phone checks against the connection's country. Numbers without a "+" are
// read as US, the studio's market. 555 is the NANP's fiction exchange (TV,
// films); libphonenumber still calls it valid, so it gets its own rule.
function phoneFlags(raw, ipCountry, ipCountryName) {
  if (!raw) return [];
  const parsed = parsePhoneNumberFromString(raw, raw.startsWith('+') ? undefined : 'US');
  if (!parsed || !parsed.isValid()) return [`phone "${raw}" is not a valid number`];
  const flags = [];
  if (parsed.countryCallingCode === '1' && parsed.nationalNumber.slice(3, 6) === '555') {
    flags.push(`phone ${parsed.formatInternational()} uses the fictional 555 exchange`);
  }
  const countries = parsed.getPossibleCountries();
  if (ipCountry && countries.length && !countries.includes(ipCountry)) {
    flags.push(`sent from ${ipCountryName || ipCountry} (${ipCountry}), phone is a ${countries.join('/')} number`);
  }
  return flags;
}

async function sendEmail(params) {
  const { VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_USER_ID, EMAILJS_PRIVATE_KEY } = process.env;
  if (!VITE_EMAILJS_SERVICE_ID || !VITE_EMAILJS_TEMPLATE_ID || !VITE_EMAILJS_USER_ID || !EMAILJS_PRIVATE_KEY) {
    throw new Error('EmailJS environment variables are missing');
  }
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      service_id: VITE_EMAILJS_SERVICE_ID,
      template_id: VITE_EMAILJS_TEMPLATE_ID,
      user_id: VITE_EMAILJS_USER_ID,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: params,
    }),
  });
  if (!res.ok) throw new Error(`EmailJS ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

function recordBlock(r) {
  const where = [r.geo.city, r.geo.region, r.geo.country].filter(Boolean).join(', ');
  return [
    '--- Submission record ---',
    `Record: ${r.id}`,
    `Received: ${r.received_at} (server time, UTC)`,
    `IP: ${r.ip || 'unknown'}${where ? ` (${where})` : ''}`,
    `Browser: ${r.user_agent || 'none sent'}`,
    `Form: ${r.form}, page ${r.page || 'unknown'}`,
    `Consent: "${r.consent.text}" (Terms ${r.consent.terms_version}, Privacy ${r.consent.privacy_version})`,
    `Flags: ${r.flags.length ? r.flags.join('; ') : 'none'}`,
  ].join('\n');
}

export default async (req, context) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  // Browsers always send Origin on a POST fetch. A foreign origin is refused;
  // a missing one (a script, not a browser) is accepted and flagged.
  const origin = req.headers.get('origin');
  const host = new URL(req.url).host;
  if (origin && originHost(origin) !== host) return json(403, { error: 'Forbidden' });

  // A form submitted before hydration arrives as a native urlencoded POST
  // (the forms carry method="post" so their fields never land in a GET URL,
  // server logs or GA's page_location). React never ran, so there is no
  // consent tick to record: send the visitor back to the page to try again.
  if (!(req.headers.get('content-type') || '').includes('application/json')) {
    const referer = req.headers.get('referer') || '';
    const path = originHost(referer) === host ? new URL(referer).pathname : '/contact';
    return new Response(null, { status: 303, headers: { location: `${path}#contact`, 'cache-control': 'no-store' } });
  }

  const text = await req.text();
  if (text.length > MAX_BODY) return json(413, { error: 'Message too long' });
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return json(400, { error: 'Bad request' });
  }

  const fields = Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, clean(body[k], max)]));
  if (!fields.first_name || !fields.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return json(400, { error: 'Name, a valid email and a message are required' });
  }
  if (body.consent !== true) return json(400, { error: 'Consent is required' });

  const now = new Date();
  const received_at = now.toISOString();
  const id = `${received_at.slice(0, 7)}/${received_at.replace(/:/g, '-')}_${randomUUID().slice(0, 8)}`;
  const geo = context.geo || {};
  const honeypot = Boolean(clean(body.company, 200));

  const flags = [
    ...(honeypot ? ['hidden honeypot field was filled (bot)'] : []),
    ...(origin ? [] : ['no Origin header (not sent from a browser)']),
    ...phoneFlags(fields.phone, geo.country?.code, geo.country?.name),
  ];

  const record = {
    id,
    received_at,
    form: SOURCES.has(body.source) ? body.source : 'unknown',
    page: fields.page,
    ip: context.ip || null,
    geo: {
      country: geo.country?.name || null,
      country_code: geo.country?.code || null,
      region: geo.subdivision?.name || null,
      city: geo.city || null,
      timezone: geo.timezone || null,
    },
    user_agent: req.headers.get('user-agent') || null,
    accept_language: req.headers.get('accept-language') || null,
    referer: req.headers.get('referer') || null,
    consent: {
      given: true,
      text: CONSENT_TEXT,
      terms_version: TERMS_UPDATED,
      privacy_version: PRIVACY_UPDATED,
    },
    fields: { name: fields.first_name, email: fields.email, phone: fields.phone, project_type: fields.project_type, message: fields.message },
    flags,
    deploy_id: context.deploy?.id || null,
    request_id: context.requestId || null,
    delivery: { emailed: false },
  };

  const store = getStore({ name: STORE, consistency: 'strong' });
  await store.setJSON(id, record);

  // Tell a bot it worked; it gets no email and no hint.
  if (honeypot) return json(200, { ok: true });

  if (process.env.CONTACT_DRY_RUN === '1') {
    record.delivery = { emailed: false, dry_run: true };
    await store.setJSON(id, record);
    return json(200, { ok: true, id });
  }

  try {
    await sendEmail({
      first_name: flags.length ? `⚠ ${fields.first_name}` : fields.first_name,
      email: fields.email,
      phone: fields.phone,
      project_type: fields.project_type,
      source: record.form,
      message: `${fields.message}\n\n${recordBlock(record)}`,
      record_id: id,
      ip: record.ip || '',
      country: record.geo.country || '',
      user_agent: record.user_agent || '',
      flags: flags.join('; '),
    });
    record.delivery = { emailed: true, at: new Date().toISOString() };
    await store.setJSON(id, record);
    return json(200, { ok: true });
  } catch (err) {
    record.delivery = { emailed: false, error: String(err.message || err).slice(0, 300) };
    await store.setJSON(id, record);
    console.error('contact: email failed', id, record.delivery.error);
    return json(502, { error: 'Could not send' });
  }
};

export const config = { path: '/api/contact' };
