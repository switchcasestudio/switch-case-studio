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
import { BOOK_CALL_LENGTH } from '../../data/cta';
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

// Field checks (2026-11-10). The form is `noValidate`, so these run instead of
// the browser's: every required field is checked on one submit and each
// problem is named under its own field. Before this only consent and phone
// were checked, one per submit, and a bad email came back from the server as
// "Something went wrong". Values are trimmed first; the phone rule allows
// + spaces dashes parens dots and needs 7+ digits. The server checks again.
const STUDIO_EMAIL = 'hello@switchcasestudio.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_ORDER = ['first_name', 'email', 'phone', 'message'];
const CHECKS = {
  first_name: (v) => (v ? '' : 'Please add your name'),
  email: (v) => {
    if (!v) return 'Please add your email';
    return EMAIL_RE.test(v) ? '' : "That email doesn't look complete (name@example.com)";
  },
  phone: (v) => {
    if (!v) return 'Please add a phone number';
    return /^[+\d\s().-]+$/.test(v) && v.replace(/\D/g, '').length >= 7
      ? ''
      : "That phone number doesn't look complete";
  },
  message: (v) => (v ? '' : 'Please tell us a little about your project'),
};
const CONSENT_ERROR = 'Please tick the agreement box first, then send.';

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
  const doneRef = useRef(null);

  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errors, setErrors] = useState({}); // { first_name, email, phone, message, consent }
  // The package a pricing board's "Start" link named (2026-11-10):
  // /contact?service=<id>&package=<id>. Read after mount (the static page has
  // no query) and resolved against pricingData, so only a real package name
  // is ever shown or sent. The data loads only when the link carries a pair.
  const [pkg, setPkg] = useState(null); // { service, name }
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const service = q.get('service');
    const id = q.get('package');
    if (!service || !id) return undefined;
    let live = true;
    import('../../data/fromPrice').then(({ findPackage }) => {
      if (live) setPkg(findPackage(service, id));
    });
    return () => {
      live = false;
    };
  }, []);

  const fieldValue = (name) => formRef.current?.elements?.[name]?.value?.trim() || '';
  const setFieldError = (name, message) =>
    setErrors((prev) => {
      if ((prev[name] || '') === message) return prev;
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  // Typing clears that field's error and a stale send error; leaving a field
  // re-checks it once it holds something (an untouched empty field stays quiet
  // until submit).
  const onFieldChange = (e) => {
    if (errors[e.target.name]) setFieldError(e.target.name, '');
    if (status === 'error') setStatus('idle');
  };
  const onFieldBlur = (e) => {
    const { name } = e.target;
    if (!CHECKS[name]) return;
    const value = e.target.value.trim();
    if (value || errors[name]) setFieldError(name, CHECKS[name](value));
  };
  const fieldProps = (name) => ({
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    onChange: onFieldChange,
    onBlur: onFieldBlur,
  });
  const fieldError = (name) =>
    errors[name] ? (
      <p id={`${name}-error`} className="contact-form__error" role="alert">
        {errors[name]}
      </p>
    ) : null;
  const toggleConsent = () => {
    setAgreed((prev) => !prev);
    setFieldError('consent', '');
  };

  // The confirmation replaces the form, so focus moves to it: a keyboard or
  // screen-reader user is told it worked and is not left on a removed button.
  useEffect(() => {
    if (status === 'success') doneRef.current?.focus();
  }, [status]);

  /* ------------------------------------------------------------------ *
   * Submit handler — posts to /api/contact (netlify/functions/contact.mjs),
   * which records IP, browser, time and consent, then emails via EmailJS
   * with the existing template fields: first_name, email, phone, message
   * (last_name dropped in the 2026-07 refresh, DESIGN_AUDIT P0-3 — the
   * shared template already tolerates absent fields.)
   * ------------------------------------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Every problem at once, each under its own field; focus goes to the
    // first. Phone is REQUIRED (owner, 2026-11-05). Consent gates SUBMISSION,
    // not the button: a disabled-looking primary suppressed attempts
    // (DESIGN_AUDIT P0-3), so it is explained and focused instead.
    const found = {};
    FIELD_ORDER.forEach((name) => {
      const message = CHECKS[name](fieldValue(name));
      if (message) found[name] = message;
    });
    if (!agreed) found.consent = CONSENT_ERROR;
    setErrors(found);
    const firstBad = FIELD_ORDER.find((name) => found[name]);
    if (firstBad) {
      formRef.current?.elements?.[firstBad]?.focus();
      return;
    }
    if (found.consent) {
      consentRef.current?.focus();
      return;
    }

    setStatus('sending');

    // Lead conversion. Fired synchronously in the submit gesture stack (same as
    // book_call_click) — NOT inside the async EmailJS .then, where
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
        // Both outcomes stay on screen (2026-11-10): they used to clear after
        // 5 s, so a visitor who looked away came back to a blank form with no
        // proof it was sent. Success swaps the form for a confirmation; an
        // error stays until the next edit, with the input kept.
        () => {
          setStatus('success');
          setAgreed(false);
        },
        () => setStatus('error'),
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
      {/* InkFill background: desktop gets the 16:9 re-frame (logo centered,
          ~40% of the frame, cover); <=768px gets the vertical cut in its
          own band under the content, never behind the form. Band, scrim
          and edge fades live in contact.scss. */}
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
            {/* The other way in, before the form (UX audit, 2026-11-10): the
                call was a small link under the whole form on a phone, and
                nothing said it is free or that it opens another tab. */}
            {status !== 'success' && (
              <p className="contact-right__talk contact-animate">
                <span>Prefer to talk? The call is free and takes {BOOK_CALL_LENGTH}.</span>
                <BookCallCta className="contact-right__talk-link">
                  <span aria-hidden="true"> ↗</span>
                </BookCallCta>
              </p>
            )}

            {status === 'success' ? (
              <div
                ref={doneRef}
                className="contact-form contact-form__done"
                role="status"
                tabIndex={-1}
              >
                <p className="contact-form__done-title">Message sent.</p>
                <p className="contact-form__done-body">
                  We'll be in touch shortly.
                </p>
                <button
                  type="button"
                  className="contact-form__done-again"
                  onClick={() => setStatus('idle')}
                >
                  Send another message
                </button>
              </div>
            ) : (
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
                  empty. Named so autofill has no reason to fill it: it was
                  `company` / "Company" until 2026-11-10, a field browsers
                  and password managers do fill, and a filled trap dropped
                  the message while the page said "sent". */}
              <div className="contact-form__hp" aria-hidden="true">
                <label htmlFor="contact-hp-ref">Leave empty</label>
                <input
                  type="text"
                  id="contact-hp-ref"
                  name="hp_ref"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {pkg && (
                <p className="contact-form__about">
                  <span>
                    About: <strong>{pkg.name}</strong> ({pkg.service})
                  </span>
                  <button type="button" onClick={() => setPkg(null)}>
                    Remove
                  </button>
                  <input type="hidden" name="project_type" value={pkg.name} />
                </p>
              )}

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
                  {...fieldProps('first_name')}
                />
                {fieldError('first_name')}
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
                  {...fieldProps('email')}
                />
                {fieldError('email')}
              </div>

              <div className="contact-form__field contact-form__field--phone">
                <label htmlFor="phone" className="contact-form__label">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  {...fieldProps('phone')}
                />
                {fieldError('phone')}
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
                  {...fieldProps('message')}
                />
                {fieldError('message')}
              </div>

              {/* Privacy checkbox — gates submission in handleSubmit (with an
                  explanatory error), NOT via a disabled submit button. */}
              <div className="contact-form__consent">
                <button
                  ref={consentRef}
                  type="button"
                  onClick={toggleConsent}
                  className={`contact-form__checkbox ${
                    agreed ? 'contact-form__checkbox--checked' : ''
                  }`}
                  aria-label={CONSENT_TEXT}
                  // A checkbox, announced as one (it was a toggle button).
                  role="checkbox"
                  aria-checked={agreed}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
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
                    toggleConsent();
                  }}
                >
                  {/* Words must stay equal to CONSENT_TEXT (src/data/legal.js):
                      that string is what every submission record stores. */}
                  I agree to the <Link to="/terms">Terms of Use</Link> and
                  the <Link to="/privacy">Privacy Policy</Link>
                </label>
              </div>
              {errors.consent && (
                <p
                  id="consent-error"
                  className="contact-form__error"
                  role="alert"
                >
                  {errors.consent}
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

                {status === 'error' && (
                  <p
                    className="contact-form__status contact-form__status--error"
                    role="alert"
                  >
                    Your message did not send. Please try again, or email{' '}
                    <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
                  </p>
                )}
              </div>
            </form>
            )}
          </div>

          {/* ---------- Contact info + banner graphic (below the form) ---------- */}
          <div className="contact-left">
            <div className="contact-left__details contact-animate">
              <p className="contact-left__address">
                Switch Case Studio
                <br />
                Portland, Oregon
              </p>

              <a className="contact-left__email" href={`mailto:${STUDIO_EMAIL}`}>
                {STUDIO_EMAIL}
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
