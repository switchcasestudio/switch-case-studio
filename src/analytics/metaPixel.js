/**
 * Meta Pixel — dependency-free, LOAD-ON-CONSENT integration.
 *
 * Configuration (Vite inlines at BUILD time — rebuild/redeploy after changes):
 *
 *   VITE_META_PIXEL_ID   Pixel ID from Meta Events Manager, e.g. "1234567890"
 *   VITE_GA_DEBUG=true   (optional, shared with GA) also run from a dev build
 *
 * Consent model — stricter than GA's on purpose: GA runs cookieless pings
 * pre-consent under Consent Mode v2, but Meta has no cookieless mode worth
 * having, so fbevents.js is NOT FETCHED AT ALL until the visitor accepts the
 * banner (or returns with a stored "granted"). Decliners never load a byte of
 * Meta code and never get an _fbp cookie. Wiring lives in ga.js (initGA +
 * setConsent) so consent has one choke point; SPA PageViews flow through
 * RouteAnalytics' send() like GA page_views.
 *
 * This module deliberately does NOT import from ga.js (callers pass nothing
 * and decide when to init) — keeps the dependency one-directional, no cycle.
 */

export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

const FORCE_DEBUG = import.meta.env.VITE_GA_DEBUG === "true";

export const pixelEnabled =
  Boolean(META_PIXEL_ID) && (import.meta.env.PROD || FORCE_DEBUG);

let pixelInjected = false;

/**
 * Create the fbq stub, init the pixel, and defer the fbevents.js network
 * fetch to idle (same LCP discipline as gtag.js — the stub queues everything
 * and replays in order once the library lands). Idempotent. Callers must
 * only invoke this once consent is GRANTED.
 *
 * No automatic PageView here: the SPA fires PageView per route via
 * trackPixelPageView (RouteAnalytics.send / ga.setConsent's grant re-send),
 * so an auto-fire would double-count the landing page.
 */
export function initMetaPixel() {
  if (!pixelEnabled || pixelInjected || typeof window === "undefined") return;
  pixelInjected = true;

  if (!window.fbq) {
    const n = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    window.fbq = n;
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
  }
  window.fbq("init", META_PIXEL_ID);

  const loadPixel = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(loadPixel, { timeout: 3000 });
  } else {
    setTimeout(loadPixel, 1500);
  }
}

/** SPA PageView. No-ops until initMetaPixel has run (i.e. until consent). */
export function trackPixelPageView() {
  if (!pixelEnabled || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "PageView");
}

/**
 * Meta STANDARD event (Schedule, Contact, Lead, …) — standard names get
 * proper ad-optimization treatment; don't invent custom ones here.
 */
export function trackPixelEvent(name, params = {}) {
  if (!pixelEnabled || typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
}

/**
 * Belt-and-braces for the rare in-session grant→deny flip (banner reshown
 * after clearing site data, then declined): if fbevents.js is already live,
 * tell it to stop. Decliners who never granted never loaded it at all.
 */
export function revokePixel() {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("consent", "revoke");
}
