import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faThreads,
  faLinkedinIn,
  faFacebookF,
  faXTwitter,
  faBluesky,
  faGoogle,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import SCSLogo from '../ui/SCSLogo';
import {
  SERVICE_LINKS,
  PROJECT_LINKS,
  LEGAL_LINKS,
  EXPLORE_LINKS,
} from '../../data/navigation';
import SOCIAL_PROFILES from '../../data/social';
import { BOOK_CALL_URL, BOOK_CALL_LABEL } from '../../data/cta';
import '../../styles/components/footer.scss';


/* ------------------------------------------------------------------ *
 * Social links — FontAwesome brand icons, rendered under Connect.
 *
 * The PROFILES come from src/data/social.js, which is also what the
 * Organization JSON-LD `sameAs` array mirrors — a hardcoded copy here would
 * drift out of sync with the structured data (exactly how SERVICES_LINKS
 * drifted before it was derived from services.json). Only the icon mapping
 * and the internal blog link live here.
 * ------------------------------------------------------------------ */
const SOCIAL_ICONS = {
  gh: faGithub,
  ig: faInstagram,
  th: faThreads,
  x: faXTwitter,
  bs: faBluesky,
  fb: faFacebookF,
  li: faLinkedinIn,
  gb: faGoogle,
};

const SOCIALS = [
  ...SOCIAL_PROFILES.map(({ key, label, url }) => ({
    key,
    label,
    icon: SOCIAL_ICONS[key],
    href: url,
  })),
  // Internal, so it is deliberately NOT a `sameAs` entry — sameAs is for
  // profiles on OTHER domains that represent the same entity.
  { key: 'blog', label: 'Blog', icon: faRss, to: '/blog' },
];
const liveSocials = SOCIALS.filter((s) => (s.href || s.to) && (s.icon || s.to));

/* ------------------------------------------------------------------ *
 * In-page anchor helper
 *
 * Why: <a href="#services"> only works on the home route. From any
 * other route (e.g. /projects/zahav, /pricing/...) it does nothing.
 * Using <Link to="/#services"> + a manual scroll-into-view handler
 * makes section anchors work from anywhere.
 * ------------------------------------------------------------------ */
const handleAnchorClick = (e, hash) => {
  // If we're already on home, prevent the route push and just scroll.
  if (window.location.pathname === '/') {
    e.preventDefault();
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  // If on another route, the <Link to="/#services"> default behavior
  // navigates home; ScrollToTop + the browser's hash handling pick it up.
};

/* ------------------------------------------------------------------ *
 * Column data
 * ------------------------------------------------------------------ */
// Shared with the nav menu (navigation.js) — one source of truth for the
// service list; a hardcoded copy here drifted when services were renamed.
// Service pages where they exist, pricing pages otherwise (2026-10-22).
const SERVICES_LINKS = SERVICE_LINKS;

const CONNECT_LINKS = [
  {
    // Unified CTA (label + URL from src/data/cta.js): "Book a strategy
    // call" since 2026-09-11, no 'free' badge.
    label: BOOK_CALL_LABEL,
    href: BOOK_CALL_URL,
    external: true,
  },
  { label: 'Email Us', href: 'mailto:hello@switchcasestudio.com' },
];

const CALENDAR_URL = BOOK_CALL_URL;
const CONTACT_EMAIL = 'hello@switchcasestudio.com';

const Footer = () => {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Column reveal, built so the footer can NEVER stay invisible (see
  // CLAUDE.md): the old fromTo + toggleActions:reverse left the columns stuck
  // at opacity 0 on mobile (a tall blank void above the footer).
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const cols = gsap.utils.toArray('.footer-col-animate', footer);
    if (!cols.length) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      gsap.set(cols, { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      // gsap.set (not fromTo immediateRender, which re-hides on refresh).
      gsap.set(cols, { opacity: 0, y: 16 });

      const reveal = () =>
        gsap.to(cols, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          overwrite: 'auto',
        });

      const trigger = ScrollTrigger.create({
        trigger: footer,
        start: 'top 90%',
        once: true,
        onEnter: reveal,
      });

      // Already in view at mount? An already-past `once` trigger won't fire.
      if (footer.getBoundingClientRect().top < window.innerHeight * 0.9) {
        reveal();
      }

      // Lazy images shift layout after the trigger is measured.
      footer.querySelectorAll('img').forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', () => ScrollTrigger.refresh(), {
            once: true,
          });
        }
      });

      // Safety net: the footer must never stay hidden.
      const safety = gsap.delayedCall(2.5, () => {
        if (cols.some((c) => gsap.getProperty(c, 'opacity') < 1)) reveal();
      });

      // VE-4: the stenciled wordmark drifts sideways with scroll.
      // Position-only scrub (never opacity — content stays visible at
      // every scroll position); decorative aria-hidden element; GSAP is
      // the sole transform owner (no CSS transform on it). Skipped
      // entirely under reduced motion via the early return above.
      const word = footer.querySelector('.footer-wordmark__text');
      let drift;
      if (word) {
        drift = gsap.fromTo(
          word,
          { xPercent: 2.5 },
          {
            xPercent: -2.5,
            ease: 'none',
            scrollTrigger: {
              trigger: '.footer-wordmark',
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          },
        );
      }

      return () => {
        trigger.kill();
        safety.kill();
        if (drift) {
          drift.scrollTrigger?.kill();
          drift.kill();
        }
      };
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="site-footer"
      role="contentinfo"
    >
      <div className="site-footer__inner">
        {/* ============================================================
         * CTA band — giant email + "Start New Project" button
         * ============================================================ */}
        <div className="footer-cta footer-col-animate">
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-cta__email">
            {CONTACT_EMAIL}
          </a>
          <br />
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-cta__button"
          >
            Start New Project
          </a>
        </div>

        {/* ============================================================
         * Main grid — Brand | Services | Explore | Case Studies | Connect
         * ============================================================ */}
        <div className="site-footer__grid">
          {/* Brand + tagline + socials */}
          <div className="footer-col footer-col-animate footer-brand">
            <SCSLogo />
            <p className="footer-brand__tagline">
              Websites, apps, and AI systems built to convert, designed from
              scratch, engineered for real, shipped fast.
            </p>
          </div>

          {/* Services */}
          <div className="footer-col footer-col-animate">
            <h4 className="footer-col__title">Services</h4>
            <ul className="footer-nav">
              {SERVICES_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Case Studies: top 6 + the index link (mobile audit M5): the
              full 8-project list (also in the header dropdown) was half of
              why the mobile footer scrolled forever. */}
          <div className="footer-col footer-col-animate">
            <h4 className="footer-col__title">Case Studies</h4>
            <ul className="footer-nav">
              {PROJECT_LINKS.slice(0, 6).map((proj) => (
                <li key={proj.to}>
                  <Link to={proj.to}>{proj.label}</Link>
                </li>
              ))}
              <li>
                <Link to="/projects" className="footer-nav__viewall">
                  All case studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-col footer-col-animate">
            <h4 className="footer-col__title">Connect</h4>
            <ul className="footer-nav">
              {CONNECT_LINKS.map((link) => (
                <li key={link.label} className="footer-nav__item">
                  <a
                    href={link.href}
                    {...(link.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {link.label}
                  </a>
                  {link.badge && (
                    <span className="footer-nav__badge">{link.badge}</span>
                  )}
                </li>
              ))}
            </ul>
            {liveSocials.length > 0 && (
              <div className="footer-socials">
                {liveSocials.map((s) =>
                  s.to ? (
                    <Link
                      key={s.key}
                      to={s.to}
                      aria-label={s.label}
                      className="footer-socials__item"
                    >
                      <FontAwesomeIcon icon={s.icon} />
                    </Link>
                  ) : (
                    <a
                      key={s.key}
                      href={s.href}
                      aria-label={s.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-socials__item"
                    >
                      <FontAwesomeIcon icon={s.icon} />
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Explore — one compact inline row (mobile audit M5): the old
            Explore COLUMN duplicated the header nav wholesale and stretched
            the phone footer; the links survive as a utility strip. */}
        <nav
          className="footer-explore footer-col-animate"
          aria-label="Explore the site"
        >
          {EXPLORE_LINKS.map((link) =>
            link.hash ? (
              <Link
                key={link.hash}
                to={`/${link.hash}`}
                onClick={(e) => handleAnchorClick(e, link.hash)}
              >
                {link.label}
              </Link>
            ) : (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ),
          )}
        </nav>

        {/* Stenciled wordmark — per-letter spans so each letter can fill with
            the purple→black gradient on hover (see footer.scss) */}
        <div className="footer-wordmark" aria-hidden="true">
          <span className="footer-wordmark__text">
            {'switch case'.split('').map((ch, i) => {
              const c = ch === ' ' ? '\u00A0' : ch;
              return (
                <span className="footer-wordmark__letter" data-char={c} key={i}>
                  {c}
                </span>
              );
            })}
          </span>
        </div>

        {/* ============================================================
         * Bottom bar — Legal | © Copyright | Built in Portland
         * ============================================================ */}
        <div className="footer-bottom">
          <ul className="footer-bottom__legal">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <p className="footer-bottom__copy">
            &copy; {currentYear} Switch Case Studio LLC
          </p>

          <p className="footer-bottom__tagline">
            Built in Portland, OR · delivered worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
