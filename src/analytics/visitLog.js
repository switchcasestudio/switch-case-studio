// Cookie-free visit log: reports each page view to /api/visit
// (netlify/functions/visit.mjs). Runs for every visitor, consent or not,
// because it sets no cookie and the server stores no IP; the privacy policy
// describes it. Production hosts only, so local dev, draft deploys and
// previews never write records.
//
// Owner opt-out (per browser): open any page with ?visits=off to stop this
// browser from being logged, ?visits=on to undo. Stored in localStorage.
const HOSTS = new Set(["switchcasestudio.com", "www.switchcasestudio.com"]);
const OPT_OUT_KEY = "scs-visits-off";

let entry = true;

function optedOut() {
  try {
    const flag = new URLSearchParams(window.location.search).get("visits");
    if (flag === "off") localStorage.setItem(OPT_OUT_KEY, "1");
    if (flag === "on") localStorage.removeItem(OPT_OUT_KEY);
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function logVisit(path) {
  if (typeof window === "undefined" || !HOSTS.has(window.location.hostname)) return;
  if (optedOut()) return;
  const body = JSON.stringify({
    path,
    entry,
    referrer: entry ? document.referrer : "",
  });
  entry = false;
  try {
    if (navigator.sendBeacon?.("/api/visit", new Blob([body], { type: "text/plain" }))) return;
  } catch {
    // fall through to fetch
  }
  fetch("/api/visit", { method: "POST", body, keepalive: true }).catch(() => {});
}
