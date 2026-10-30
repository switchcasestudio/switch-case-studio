// Cookie-free visit log for the static Unhurried Pro pages (2026-10-30): the
// same beacon src/analytics/visitLog.js sends from the app, so these pages
// show up in `npm run visits` (netlify/functions/visit.mjs). No cookie, no
// stored IP. Only utm_* query keys are forwarded, so a Stripe session id on
// the thank-you page never leaves the browser. Opt-out per browser:
// ?visits=off (the app's key), ?visits=on to undo.
(function () {
  var HOSTS = { 'switchcasestudio.com': 1, 'www.switchcasestudio.com': 1 };
  if (!HOSTS[location.hostname]) return;
  var q = new URLSearchParams(location.search);
  try {
    var flag = q.get('visits');
    if (flag === 'off') localStorage.setItem('scs-visits-off', '1');
    if (flag === 'on') localStorage.removeItem('scs-visits-off');
    if (localStorage.getItem('scs-visits-off') === '1') return;
  } catch (e) {}
  var keep = new URLSearchParams();
  q.forEach(function (v, k) { if (k.indexOf('utm_') === 0) keep.set(k, v); });
  var path = location.pathname + (keep.toString() ? '?' + keep.toString() : '');
  var body = JSON.stringify({ path: path, entry: true, referrer: document.referrer });
  try {
    if (navigator.sendBeacon && navigator.sendBeacon('/api/visit', new Blob([body], { type: 'text/plain' }))) return;
  } catch (e) {}
  fetch('/api/visit', { method: 'POST', body: body, keepalive: true }).catch(function () {});
})();
