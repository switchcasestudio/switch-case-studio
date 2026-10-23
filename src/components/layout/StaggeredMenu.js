import {
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  SERVICE_LINKS,
  PROJECT_LINKS,
  LEGAL_LINKS,
} from '../../data/navigation';
import useScrollLock from '../../hooks/useScrollLock';
import useReducedMotion from '../../hooks/useReducedMotion';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/StaggeredMenu.scss';

/* ──────────────────────────────────────────────
   Accordion sub-component (CSS-only transition)
   ────────────────────────────────────────────── */
const MenuAccordion = ({ label, labelTo, items, isOpen, onToggle, onNavClick }) => (
  <li className="sm-panel-itemWrap">
    <button
      type="button"
      className={`sm-panel-item sm-accordion-trigger${isOpen ? ' is-open' : ''}`}
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      {labelTo ? (
        <Link
          to={labelTo}
          className="sm-panel-itemLabel"
          onClick={(e) => { e.stopPropagation(); onNavClick(); }}
        >
          {label}
        </Link>
      ) : (
        <span className="sm-panel-itemLabel">{label}</span>
      )}
      <span className="sm-accordion-caret" aria-hidden="true" />
    </button>

    <ul className={`sm-accordion-submenu${isOpen ? ' is-open' : ''}`}>
      {items.map((item) => (
        <li key={item.to} className="sm-accordion-subitem">
          <Link to={item.to} className="sm-accordion-link" onClick={onNavClick}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </li>
);

/* ──────────────────────────────────────────────
   StaggeredMenu — headless, controlled via
   `open` / `onClose`. Tablet/mobile only.
   ────────────────────────────────────────────── */
const StaggeredMenu = ({
  open,
  onClose,
  position = 'right',
  colors = ['#1a1a1a', '#2a1a35'],
  accentColor = '#ff834a',
}) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const busyRef = useRef(false);
  const prevOpenRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  // Scroll lock — preserves position across iOS + desktop
  useScrollLock(open);

  /* ── GSAP initial setup ─────────────────────────
     useEffect, not useLayoutEffect: the offscreen start position lives in CSS
     (see staggeredMenu.scss) so the SSG HTML paints the menu closed without
     JS; this just re-asserts it inline for the GSAP timelines. useLayoutEffect
     warns on every server-rendered route ("does nothing on the server"). */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      // x: 0 is load-bearing — GSAP parses the CSS `translateX(100%)` base via
      // getComputedStyle, which resolves it to a PIXEL matrix (x: <panelWidth>,
      // xPercent: 0). Without clearing x, every later xPercent tween adds to
      // that stale pixel offset and the panel animates offscreen → offscreen.
      gsap.set([panel, ...preLayers], { x: 0, xPercent: offscreen });
    });
    return () => ctx.revert();
  }, [position]);

  /* ── Build open timeline ────────────────────── */
  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    // Reduced motion: snap everything to its end state instantly.
    if (reducedMotion) {
      gsap.set([...layers, panel], { xPercent: 0 });
      if (itemEls.length) gsap.set(itemEls, { yPercent: 0, rotate: 0 });
      if (socialTitle) gsap.set(socialTitle, { opacity: 1 });
      if (socialLinks.length) gsap.set(socialLinks, { y: 0, opacity: 1 });
      return null;
    }

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, 'xPercent')),
    }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: 'power4.out' },
        i * 0.07,
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' },
        },
        itemsStart,
      );
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: 'power2.out' },
          socialsStart,
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
          },
          socialsStart + 0.04,
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [reducedMotion]);

  /* ── Play open ──────────────────────────────── */
  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      // Reduced motion path — no timeline returned
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  /* ── Play close ─────────────────────────────── */
  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;

    const resetItems = () => {
      const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
      const socialTitle = panel.querySelector('.sm-socials-title');
      const socialLinks = Array.from(
        panel.querySelectorAll('.sm-socials-link'),
      );
      if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
      if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
      if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
      busyRef.current = false;
    };

    if (reducedMotion) {
      gsap.set(all, { xPercent: offscreen });
      resetItems();
      return;
    }

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: resetItems,
    });
  }, [position, reducedMotion]);

  /* ── React to open prop changes ─────────────── */
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      playOpen();
    } else if (!open && prevOpenRef.current) {
      setOpenAccordion(null);
      playClose();
    }
    prevOpenRef.current = open;
  }, [open, playOpen, playClose]);

  /* ── Auto-close on route change ─────────────── */
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash]);

  /* ── Click-away close ───────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        if (e.target.closest('.site-header_menuBtn')) return;
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  /* ── Escape key close ───────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  /* ── Navigation handler (delays nav so the close
        animation has time to start before the new
        page mounts) ────────────────────────────── */
  const handleNavClick = useCallback(
    (to) => (e) => {
      e.preventDefault();
      onClose();
      const delay = reducedMotion ? 0 : 80;
      setTimeout(() => navigate(to), delay);
    },
    [onClose, navigate, reducedMotion],
  );

  /* ── Accordion toggle ───────────────────────── */
  const toggleAccordion = (id) =>
    setOpenAccordion((prev) => (prev === id ? null : id));

  /* ── Pre-layer colors ───────────────────────── */
  const preLayers = (() => {
    const raw =
      colors && colors.length ? colors.slice(0, 4) : ['#1a1a1a', '#2a1a35'];
    const arr = [...raw];
    if (arr.length >= 3) {
      const mid = Math.floor(arr.length / 2);
      arr.splice(mid, 1);
    }
    return arr;
  })();

  return (
    <div
      className="staggered-menu-wrapper"
      style={accentColor ? { '--sm-accent': accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {preLayers.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
      >
        <div className="sm-panel-inner">
          <ul className="sm-panel-list">
            <li className="sm-panel-itemWrap">
              <Link
                to="/about"
                className="sm-panel-item"
                onClick={handleNavClick('/about')}
              >
                <span className="sm-panel-itemLabel">About</span>
              </Link>
            </li>

            <MenuAccordion
              label="Services"
              labelTo="/services"
              items={SERVICE_LINKS}
              isOpen={openAccordion === 'services'}
              onToggle={() => toggleAccordion('services')}
              onNavClick={onClose}
            />

            <li className="sm-panel-itemWrap">
              <Link
                to="/pricing"
                className="sm-panel-item"
                onClick={handleNavClick('/pricing')}
              >
                <span className="sm-panel-itemLabel">Pricing</span>
              </Link>
            </li>

            <MenuAccordion
              label="Case Studies"
              labelTo="/projects"
              items={PROJECT_LINKS}
              isOpen={openAccordion === 'projects'}
              onToggle={() => toggleAccordion('projects')}
              onNavClick={onClose}
            />

            <li className="sm-panel-itemWrap">
              <Link
                to="/testimonials"
                className="sm-panel-item"
                onClick={handleNavClick('/testimonials')}
              >
                <span className="sm-panel-itemLabel">Testimonials</span>
              </Link>
            </li>

            <li className="sm-panel-itemWrap">
              <Link
                to="/blog"
                className="sm-panel-item"
                onClick={handleNavClick('/blog')}
              >
                <span className="sm-panel-itemLabel">Blog</span>
              </Link>
            </li>

            <li className="sm-panel-itemWrap">
              <Link
                to="/shop"
                className="sm-panel-item"
                onClick={handleNavClick('/shop')}
              >
                <span className="sm-panel-itemLabel">Shop</span>
              </Link>
            </li>

            <li className="sm-panel-itemWrap">
              <Link
                to="/contact"
                className="sm-panel-item"
                onClick={handleNavClick('/contact')}
              >
                <span className="sm-panel-itemLabel">Contact Us</span>
              </Link>
            </li>
          </ul>

          <div className="sm-socials" aria-label="Quick links">
            <h3 className="sm-socials-title">Quick Links</h3>
            <ul className="sm-socials-list">
              <li className="sm-socials-item">
                <BookCallCta className="sm-socials-link sm-cta-link" />
              </li>
              {LEGAL_LINKS.map((link) => (
                <li key={link.to} className="sm-socials-item">
                  <Link
                    to={link.to}
                    className="sm-socials-link"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
