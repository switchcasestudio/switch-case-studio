import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsEnabled, getStoredConsent, setConsent } from "./ga";
import { pixelEnabled } from "./metaPixel";
import "../styles/components/consentBanner.scss";

/**
 * Cookie-consent banner for GA4 Consent Mode v2. Shows only when analytics is
 * actually enabled (a Measurement ID is configured) AND the visitor hasn't yet
 * chosen. Accept/Decline calls setConsent(), which persists the choice and
 * updates gtag's consent state live — no reload needed.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Either tracker being configured warrants the banner — gating on GA alone
    // would leave the Meta Pixel unable to ever receive consent if the GA ID
    // were removed (the pixel is load-on-consent, so no banner = no pixel).
    if ((analyticsEnabled || pixelEnabled) && !getStoredConsent()) setVisible(true);
  }, []);

  /* The banner's footprint as `--consent-h` on <html> (UX audit,
     2026-11-10): it sat on top of the home hero's proof line and, at full
     scroll, on the footer's legal links. Whatever it would cover reads the
     variable and steps out of the way; it is 0 once a choice is made. */
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!visible || !el) return undefined;
    const root = document.documentElement;
    const publish = () => {
      const gap = window.innerHeight - el.getBoundingClientRect().bottom;
      root.style.setProperty("--consent-h", `${Math.round(el.offsetHeight + Math.max(gap, 0))}px`);
    };
    publish();
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(publish) : null;
    ro?.observe(el);
    window.addEventListener("resize", publish);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", publish);
      root.style.removeProperty("--consent-h");
    };
  }, [visible]);

  if (!visible) return null;

  const choose = (granted) => {
    setConsent(granted);
    setVisible(false);
  };

  return (
    <div
      ref={ref}
      className="consent-banner"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <p className="consent-banner__text">
        We use cookies to measure how visitors use this site (Google Analytics)
        and how our ads perform (Meta Pixel). Accept to allow both, or decline;
        declining keeps all tracking off.{" "}
        <Link to="/privacy" className="consent-banner__link">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="consent-banner__actions">
        <button
          type="button"
          className="consent-banner__btn consent-banner__btn--ghost"
          onClick={() => choose(false)}
        >
          Decline
        </button>
        <button
          type="button"
          className="consent-banner__btn consent-banner__btn--primary"
          onClick={() => choose(true)}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
