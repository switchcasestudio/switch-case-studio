import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import armSafetyNet from '../../animation/armSafetyNet';
import bannerVideo from '../../assets/videos/switch-case-studio-banner.webm';
import inkWideWebm from '../../assets/videos/contact-ink-wide.webm';
import inkWideMp4 from '../../assets/videos/contact-ink-wide.mp4';
import inkTallWebm from '../../assets/videos/contact-ink-tall.webm';
import inkTallMp4 from '../../assets/videos/contact-ink-tall.mp4';
import inkPoster from '../../assets/videos/contact-ink-poster.jpg';
import useReducedMotion from '../../hooks/useReducedMotion';
import playMuted from '../../utils/playMuted';
import BookCallCta from '../ui/BookCallCta';
import { trackEvent } from '../../analytics/ga';
import sendContact from '../../utils/sendContact';
import { CONSENT_TEXT } from '../../data/legal';
import '../../styles/components/contact.scss';

/* ------------------------------------------------------------------ *
 * Social links (left column)
 * Commented out until accounts exist. ESLint disabled for the unused
 * `socials` array so Netlify CI doesn't fail on `no-unused-vars`.
 * ------------------------------------------------------------------ */
// eslint-disable-next-line no-unused-vars
const socials = [
  // { key: 'li', label: 'LinkedIn',  href: 'https://linkedin.com/company/your-handle' },
  // { key: 'ig', label: 'Instagram', href: 'https://instagram.com/your-handle' },
  // { key: 'x',  label: 'X',         href: 'https://x.com/your-handle' },
  // { key: 'yt', label: 'YouTube',   href: 'https://youtube.com/@your-handle' },
];

// headingTag: 'h1' when Contact IS the page (/contact), 'h2' when it's a
// section on the home page — a page must have exactly one h1.
const Contact = ({ headingTag: HeadingTag = 'h2' }) => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const videoRef = useRef(null);
  const bgVideoRef = useRef(null);
  const [bgOn, setBgOn] = useState(false);
  const reducedMotion = useReducedMotion();

  const consentRef = useRef(null);

  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [phoneError, setPhoneError] = useState('');
  const [consentError, setConsentError] = useState('');

  /* ------------------------------------------------------------------ *
   * Submit handler — posts to /api/contact (netlify/functions/contact.mjs),
   * which records IP, browser, time and consent, then emails via EmailJS
   * with the existing template fields: first_name, email, phone, message
   * (last_name dropped in the 2026-07 refresh, DESIGN_AUDIT P0-3 — the
   * shared template already tolerates absent fields: the promo form sends
   * no last_name to the same template.)
   * ------------------------------------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Consent gates SUBMISSION, not the button — a disabled-looking primary
    // suppressed attempts (DESIGN_AUDIT P0-3). Explain + focus instead.
    if (!agreed) {
      setConsentError('Please tick the agreement box first, then send.');
      consentRef.current?.focus();
      return;
    }

    // Phone is OPTIONAL (required cost completions); when provided, check
    // the format: allow + spaces dashes parens dots, need ~7+ digits.
    // Form has noValidate, so this gate (not the browser) does the work.
    const phone = formRef.current?.elements?.phone?.value?.trim() || '';
    const phoneValid =
      /^[+\d\s().-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 7;
    if (phone && !phoneValid) {
      setPhoneError("That phone number doesn't look complete");
      formRef.current?.elements?.phone?.focus();
      return;
    }
    setPhoneError('');

    setStatus('sending');

    // Lead conversion. Fired synchronously in the submit gesture stack (same as
    // PromoPage + book_call_click) — NOT inside the async EmailJS .then, where
    // an event fired after the network round-trip was being lost. Counts a
    // valid submit (passed consent + phone validation). Consent-safe: with
    // Consent Mode v2 denied this still leaves as a cookieless ping.
    // page_path separates the /contact page from the home-page section, since
    // this component serves both.
    trackEvent('generate_lead', {
      source: 'contact_form',
      page_path: window.location.pathname,
    });

    sendContact(formRef.current, { source: 'contact', consent: agreed })
      .then(
        () => {
          setStatus('success');
          formRef.current?.reset();
          setAgreed(false);
          // Auto-revert to idle after 5s so the form is reusable
          setTimeout(() => setStatus('idle'), 5000);
        },
        () => {
          setStatus('error');
          setTimeout(() => setStatus('idle'), 5000);
        },
      );
  };

  /* ------------------------------------------------------------------ *
   * Fade-up entrance, house safe-reveal pattern (CLAUDE.md; DESIGN_AUDIT
   * P1-7). The old fromTo + toggleActions:'reverse' was caught LIVE
   * frozen mid-flight on /contact (opacities stuck at 0.55/0.30/0/0 —
   * ScrollTrigger refreshes from late layout (video/fonts) interrupt the
   * tween and re-toggle it), leaving the conversion page half-invisible.
   * Now: set hidden → onEnter play-ONCE → already-in-view fallback →
   * timed safety net; reduced-motion never hides anything.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined; // SSG content is visible by default — leave it be
    }

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.contact-animate');
      if (!targets.length) return;

      gsap.set(targets, { autoAlpha: 0, y: 16 });

      const reveal = () =>
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          overwrite: 'auto',
        });

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: reveal,
      });

      // Already past the trigger at mount (direct /contact load) — an
      // unfired `once` trigger never calls onEnter.
      if (st.progress > 0) reveal();

      // Whatever happens, the form ends fully visible, viewport-aware
      // (armSafetyNet): on /contact it is on screen at once and forces at
      // 2.5s; on the home page it waits below the hero for its trigger.
      armSafetyNet(
        sectionRef.current,
        () => targets.every((t) => gsap.getProperty(t, 'opacity') >= 1) || targets.some((t) => gsap.isTweening(t)),
        () => gsap.set(targets, { autoAlpha: 1, y: 0 }),
        { delay: 2.5 },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------ *
   * Respect prefers-reduced-motion: pause the looping banner if the
   * user has motion sensitivity enabled at the OS level.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
      return undefined;
    }
    return playMuted(videoRef.current);
  }, []);

  // Low Power Mode refuses autoplay; playMuted retries on the first tap.
  useEffect(() => {
    if (!bgOn || reducedMotion) return undefined;
    return playMuted(bgVideoRef.current);
  }, [bgOn, reducedMotion]);

  /* ------------------------------------------------------------------ *
   * Background video (owner, 2026-09-13: the InkFill ident). IO-gated so
   * nothing downloads until the section nears the viewport; SSR and the
   * first client render are the same plain black section, so there is no
   * hydration divergence. Reduced motion gets the poster (the finished
   * logo) and never plays.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setBgOn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setBgOn(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only an in-flight send disables the button. Consent is enforced in
  // handleSubmit with a visible explanation — a permanently disabled-looking
  // primary button read as dead and suppressed attempts (DESIGN_AUDIT P0-3).
  const canSubmit = status !== 'sending';

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      {/* InkFill background: desktop gets the 16:9 re-frame (logo centred,
          ~40% of the frame, cover); <=768px gets the vertical cut shown
          whole (contain) on the video's own #141414 field, so the logo is
          never cropped on a tall phone section. Scrim + edge fades live in
          contact.scss. */}
      {bgOn && (
        <div className="contact-section__bg" aria-hidden="true">
          <video
            ref={bgVideoRef}
            className="contact-section__bg-video"
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload={reducedMotion ? 'none' : 'auto'}
            poster={inkPoster}
            tabIndex={-1}
          >
            <source media="(max-width: 768px)" src={inkTallWebm} type="video/webm" />
            <source media="(max-width: 768px)" src={inkTallMp4} type="video/mp4" />
            <source src={inkWideWebm} type="video/webm" />
            <source src={inkWideMp4} type="video/mp4" />
          </video>
        </div>
      )}
      <div className="contact-section__inner">
        {/* Phones: form first, then info + animated card. >= 769px: one row,
            form left, card + info right (owner, 2026-09-12). The form stays
            first in DOM so it leads on phones. */}
        <div className="contact-grid">
          {/* ---------- Form (first) ---------- */}
          <div className="contact-right">
            <HeadingTag className="contact-right__heading contact-animate">
              Contact us
            </HeadingTag>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              // Before hydration the browser submits natively: POST keeps the
              // fields out of the URL; the function sends the visitor back.
              method="post"
              action="/api/contact"
              className="contact-form contact-animate"
              noValidate
            >
              {/* Honeypot: off screen and off the tab order. A person leaves it
                  empty; the function records a filled one and emails nothing. */}
              <div className="contact-form__hp" aria-hidden="true">
                <label htmlFor="contact-company">Company</label>
                <input
                  type="text"
                  id="contact-company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Visible persistent labels (placeholder-only labels vanish on
                  focus and doubled as the only affordance — P0-3). Field name
                  stays `first_name` for EmailJS-template compatibility; it now
                  carries the full name (autoComplete="name"). */}
              <div className="contact-form__field">
                <label htmlFor="first_name" className="contact-form__label">
                  Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="contact-form__field">
                <label htmlFor="email" className="contact-form__label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="contact-form__field contact-form__field--phone">
                <label htmlFor="phone" className="contact-form__label">
                  Phone <span className="contact-form__optional">(optional, if you'd rather talk)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={phoneError ? 'true' : undefined}
                  aria-describedby={phoneError ? 'phone-error' : undefined}
                  onChange={() => phoneError && setPhoneError('')}
                />
                {phoneError && (
                  <p
                    id="phone-error"
                    className="contact-form__error"
                    role="alert"
                  >
                    {phoneError}
                  </p>
                )}
              </div>

              <div className="contact-form__field">
                <label htmlFor="message" className="contact-form__label">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Tell us about your project…"
                  rows={3}
                  required
                />
              </div>

              {/* Privacy checkbox — gates submission in handleSubmit (with an
                  explanatory error), NOT via a disabled submit button. */}
              <div className="contact-form__consent">
                <button
                  ref={consentRef}
                  type="button"
                  onClick={() => {
                    setAgreed((prev) => !prev);
                    setConsentError('');
                  }}
                  className={`contact-form__checkbox ${
                    agreed ? 'contact-form__checkbox--checked' : ''
                  }`}
                  aria-label={CONSENT_TEXT}
                  aria-pressed={agreed}
                  aria-describedby={consentError ? 'consent-error' : undefined}
                >
                  {agreed && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                {/* Clicking the words toggles too — a text-adjacent checkbox
                    that ignores its own label reads as broken. */}
                <label
                  className="contact-form__consent-label"
                  onClick={(e) => {
                    // Let the links navigate; toggle on any other click.
                    if (e.target.closest('a')) return;
                    setAgreed((prev) => !prev);
                    setConsentError('');
                  }}
                >
                  {/* Words must stay equal to CONSENT_TEXT (src/data/legal.js):
                      that string is what every submission record stores. */}
                  I agree to the <Link to="/terms">Terms of Use</Link> and
                  the <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>
              {consentError && (
                <p
                  id="consent-error"
                  className="contact-form__error"
                  role="alert"
                >
                  {consentError}
                </p>
              )}

              {/* Submit + status */}
              <div className="contact-form__submit-row">
                <button
                  type="submit"
                  className="contact-form__submit"
                  disabled={!canSubmit}
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>

                {status === 'success' && (
                  <p
                    className="contact-form__status contact-form__status--success"
                    role="status"
                  >
                    Message sent. We'll be in touch shortly.
                  </p>
                )}
                {status === 'error' && (
                  <p
                    className="contact-form__status contact-form__status--error"
                    role="alert"
                  >
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* ---------- Contact info + banner graphic (below the form) ---------- */}
          <div className="contact-left">
            <div className="contact-left__details contact-animate">
              <p className="contact-left__address">
                Switch Case Studio
                <br />
                Portland, Oregon
              </p>

              <a
                className="contact-left__email"
                href="mailto:hello@switchcasestudio.com"
              >
                hello@switchcasestudio.com
              </a>

              <BookCallCta className="contact-left__cta"> →</BookCallCta>

              {socials.length > 0 && (
                <div className="contact-left__socials">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="contact-left__media contact-animate">
              {/* Frame owns the sticker presentation (tilt/border/shadow) in
                  CSS; GSAP owns the outer .contact-animate reveal — one
                  transform owner per element. */}
              <div className="contact-left__media-frame">
                <video
                  ref={videoRef}
                  className="contact-left__video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                >
                  <source src={bannerVideo} type="video/webm" />
                  {/* Add an mp4 fallback here once you've encoded one:
                  <source src={bannerVideoMp4} type="video/mp4" />
                  */}
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
