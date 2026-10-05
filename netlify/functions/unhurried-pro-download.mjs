// Unhurried Pro download: verifies a paid Stripe Checkout session, then streams
// the zip from the PRIVATE switchcasestudio/unhurried-pro GitHub release.
// The zip is never committed to this (public) repo.
//
// Netlify environment variables (set in the Netlify UI, never in git):
//   STRIPE_SECRET_KEY  restricted key, permission: Checkout Sessions = Read
//   GITHUB_TOKEN       fine-grained token, repo switchcasestudio/unhurried-pro, Contents = Read
const PAYMENT_LINK = 'plink_1UJTLbI7JsbjSmdg8ssdGIN3';
const REPO = 'switchcasestudio/unhurried-pro';
const TAG = 'v1.2.0';
const ASSET = 'unhurried-pro-1.2.0.zip';

const fail = (status, message) =>
  new Response(message, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });

export default async (req) => {
  const sessionId = new URL(req.url).searchParams.get('session_id') || '';
  if (!/^cs_(live|test)_[A-Za-z0-9]{10,}$/.test(sessionId)) {
    return fail(400, 'Missing or malformed purchase reference. Use the link from your Stripe receipt page, or write to hello@switchcasestudio.com.');
  }
  const { STRIPE_SECRET_KEY, GITHUB_TOKEN } = process.env;
  if (!STRIPE_SECRET_KEY || !GITHUB_TOKEN) {
    return fail(503, 'Downloads are being set up. Please write to hello@switchcasestudio.com with your receipt number.');
  }

  const session = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { authorization: `Bearer ${STRIPE_SECRET_KEY}` },
  }).then((r) => (r.ok ? r.json() : null));
  if (!session || session.payment_status !== 'paid' || session.payment_link !== PAYMENT_LINK) {
    return fail(403, 'We could not confirm this purchase. Write to hello@switchcasestudio.com with your receipt number and we will send the file.');
  }

  const gh = { authorization: `Bearer ${GITHUB_TOKEN}`, 'x-github-api-version': '2022-11-28' };
  const release = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${TAG}`, { headers: gh }).then((r) => (r.ok ? r.json() : null));
  const asset = release?.assets?.find((a) => a.name === ASSET);
  if (!asset) return fail(502, 'The download is temporarily unavailable. Please write to hello@switchcasestudio.com.');

  const file = await fetch(asset.url, { headers: { ...gh, accept: 'application/octet-stream' } });
  if (!file.ok || !file.body) return fail(502, 'The download is temporarily unavailable. Please write to hello@switchcasestudio.com.');

  return new Response(file.body, {
    headers: {
      'content-type': 'application/zip',
      'content-disposition': `attachment; filename="${ASSET}"`,
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
};

export const config = { path: '/unhurried-pro/download' };
