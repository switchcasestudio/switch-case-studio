/**
 * Google Analytics 4 (gtag.js) — dependency-free integration.
 *
 * Configuration is via environment variables (Vite inlines these at BUILD time,
 * so you must rebuild/redeploy after changing them):
 *
 *   VITE_GA_MEASUREMENT_ID   GA4 Measurement ID, e.g. "G-XXXXXXXXXX"
 *   VITE_GA_DEBUG=true       (optional) also send from a local/dev build
 *
 * Analytics is OFF unless a Measurement ID is present AND this is a production
 * build (or VITE_GA_DEBUG=true). This keeps local dev from polluting real
 * reports.
 *
 * The Google-side setup that produces the Measurement ID lives in the private
 * ops notes (a GA4-SETUP.md was referenced here for years but never existed in
 * this repo); the analytics rules that matter for code changes are in CLAUDE.md.
 */

import {
  initMetaPixel,
  trackPixelPageView,
  trackPixelEvent,
  revokePixel,
} from "./metaPixel";

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const FORCE_DEBUG = import.meta.env.VITE_GA_DEBUG === "true";

export const analyticsEnabled =
  Boolean(GA_MEASUREMENT_ID) && (import.meta.env.PROD || FORCE_DEBUG);

// URL fragment that identifies the primary conversion CTA (the booking calendar).
const BOOKING_URL_MATCH = "calendar.app.google";

let scriptInjected = false;

// localStorage key holding the visitor's consent choice ("granted" | "denied").
export const CONSENT_KEY = "scs-analytics-consent";

/** The stored consent choice, or null if the visitor hasn't chosen yet. */
export function getStoredConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

const GRANTED = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
};
const DENIED = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/**
 * Inject gtag.js once and configure the property. page_view is sent manually
 * (send_page_view:false) because this is a single-page app — see trackPageView.
 *
 * Consent Mode v2: consent defaults to DENIED, so until the visitor opts in GA
 * runs cookieless (no analytics/ads cookies — only anonymous, modeled pings).
 * A previously stored "granted" choice is re-applied so returning visitors
 * aren't re-prompted.
 */
export function initGA() {
  if (!analyticsEnabled || scriptInjected || typeof window === "undefined") return;
  scriptInjected = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // Consent Mode v2 setup runs SYNCHRONOUSLY (these are dataLayer pushes only,
  // no network): the gtag stub exists immediately so a live Accept (setConsent)
  // and any queued page_view are never dropped, and the consent default is set
  // before config — preserving the cookieless pre-consent ping (gcs=G100).
  // Must be set before config (and before any event) — queued ahead in dataLayer.
  gtag("consent", "default", { ...DENIED, wait_for_update: 500 });
  if (getStoredConsent() === "granted") {
    gtag("consent", "update", GRANTED);
  }
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false, // SPA: we fire page_view on each route change
    ...(FORCE_DEBUG ? { debug_mode: true } : {}),
  });

  // Defer ONLY the 155KB gtag.js network fetch off the LCP critical path. The
  // commands above are already queued in dataLayer and process IN ORDER once
  // the library loads, so Consent Mode v2 + the cookieless ping are unchanged
  // — just shifted past first paint. Idle callback, with a timeout/fallback so
  // it always loads even on a busy main thread.
  const loadGtag = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(loadGtag, { timeout: 3000 });
  } else {
    setTimeout(loadGtag, 1500);
  }
}

/** Persist the visitor's consent choice and update gtag's consent state live. */
export function setConsent(granted) {
  const previous = getStoredConsent();
  const value = granted ? "granted" : "denied";
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable (private mode) — choice just won't persist */
  }
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", granted ? GRANTED : DENIED);
  }

  // Re-send the landing page_view on the deny→grant transition. RouteAnalytics
  // fires page_view once per route, which for a first-time visitor happens while
  // consent is still DENIED — that hit leaves as a cookieless (gcs=G100) ping
  // GA does NOT count as a view, and no page_view follows unless the visitor
  // navigates. Without this, every accepting visitor's ENTRY page is lost and
  // Realtime shows the session with 0 views (observed 2026-08-03: book_call_click
  // registered, page_view didn't). Guarded on the transition so a returning
  // granted visitor (banner never shown) can't double-count.
  if (granted && previous !== "granted") {
    trackPageView({
      path: window.location.pathname + window.location.search,
      title: document.title,
    });
    // Same entry-page law for Meta: the pixel only loads now (load-on-consent),
    // so fire the landing PageView it never saw. Queued in the fbq stub and
    // replayed once fbevents.js lands — nothing is lost to the idle defer.
    initMetaPixel();
    trackPixelPageView();
  }
  if (!granted) {
    revokePixel();
  }
}

/** Send a SPA page_view. Call after the route (and document.title) has updated. */
export function trackPageView({ path, title } = {}) {
  if (!analyticsEnabled || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

/** Send a custom GA4 event. */
export function trackEvent(name, params = {}) {
  if (!analyticsEnabled || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * One delegated click listener that captures the conversions that matter:
 *   - book_call_click  → any link to the booking calendar (the key conversion)
 *   - email_click      → mailto: links
 *   - phone_click      → tel: links
 *   - file_download    → any anchor carrying the download attribute
 * Centralized so the 13+ scattered "Book a Free Call" CTAs need no edits and
 * any future CTA is covered automatically. Returns a cleanup function.
 */
export function initInteractionTracking() {
  if (!analyticsEnabled || typeof document === "undefined") return () => {};

  const onClick = (e) => {
    const anchor = e.target.closest && e.target.closest("a[href]");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    const shared = {
      link_url: href,
      link_text: (anchor.textContent || "").trim().slice(0, 100),
      page_path: window.location.pathname,
    };

    if (href.includes(BOOKING_URL_MATCH)) {
      trackEvent("book_call_click", shared);
      // Meta STANDARD event names (Schedule/Contact) so ad optimization can
      // use them; no-ops until the pixel is consented+loaded.
      trackPixelEvent("Schedule");
    } else if (href.startsWith("mailto:")) {
      trackEvent("email_click", shared);
      trackPixelEvent("Contact");
    } else if (href.startsWith("tel:")) {
      trackEvent("phone_click", shared);
      trackPixelEvent("Contact");
    } else if (anchor.hasAttribute("download")) {
      // Any downloadable asset (blog giveaways etc). Matched on the download
      // attribute rather than a path prefix so a future download anywhere on
      // the site is covered without touching this file.
      trackEvent("file_download", {
        ...shared,
        file_name: href.split("/").pop(),
      });
    }
  };

  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
