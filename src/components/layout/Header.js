import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import HeaderCTA from "./HeaderCTA";
import HeaderLogo from "../ui/HeaderLogo";
import StaggeredMenu from "./StaggeredMenu";
import { PRICING_LINKS, PROJECT_LINKS, SERVICE_LINKS } from "../../data/navigation";
import useReducedMotion from "../../hooks/useReducedMotion";
import "../../styles/components/header.scss";

// Scroll distance after which the header gets a `is-scrolled` class.
const SCROLL_THRESHOLD = 8;

const Header = () => {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [textLines, setTextLines] = useState(["Menu", "Close"]);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  // Home: the hero owns the first viewport, so the header is display:none
  // while #hero is on screen and returns (fixed) once it has scrolled past.
  // The initial value comes from the ROUTE, not the viewport, so the static
  // HTML and the first client render agree (no hydration mismatch).
  const isHome = pathname === "/";
  const [heroInView, setHeroInView] = useState(isHome);
  const reducedMotion = useReducedMotion();

  const openRef = useRef(false);
  const iconRef = useRef(null);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const textInnerRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);

  // When the user clicks a trigger to close it, the click also focuses the
  // button — which would re-fire onFocus and re-open the submenu. This ref
  // tells the next onFocus to skip its open call.
  const skipNextFocusOpenRef = useRef(false);

  /* ── Initial GSAP setup for toggle icon ─────── */
  useEffect(() => {
    const plusH = plusHRef.current;
    const plusV = plusVRef.current;
    const icon = iconRef.current;
    const textInner = textInnerRef.current;
    if (!plusH || !plusV || !icon || !textInner) return;

    // The icon lines are centred by a CSS translate(-50%, -50%). GSAP must
    // claim the FULL transform (percent + px + rotate) here, not just rotate:
    // on the home route this effect runs while the header is display:none,
    // and a partial set makes GSAP parse the centring from a box that does
    // not exist (it came back as translate(-195px, -1px): -50% of the
    // viewport, the icon sat 190px left of its label after the hero).
    gsap.set(plusH, { transformOrigin: "50% 50%", xPercent: -50, yPercent: -50, x: 0, y: 0, rotate: 0 });
    gsap.set(plusV, { transformOrigin: "50% 50%", xPercent: -50, yPercent: -50, x: 0, y: 0, rotate: 90 });
    gsap.set(icon, { x: 0, y: 0, rotate: 0, transformOrigin: "50% 50%" });
    gsap.set(textInner, { x: 0, y: 0, yPercent: 0 });
  }, []);

  /* ── Scroll-state listener ──────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Home hero watcher ──────────────────────── */
  useEffect(() => {
    if (!isHome || typeof IntersectionObserver === "undefined") {
      setHeroInView(false);
      return undefined;
    }
    const hero = document.getElementById("hero");
    if (!hero) {
      setHeroInView(false);
      return undefined;
    }
    setHeroInView(true);
    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [isHome]);

  /* ── Icon spin animation ────────────────────── */
  const animateIcon = useCallback(
    (opening) => {
      const icon = iconRef.current;
      if (!icon) return;
      spinTweenRef.current?.kill();

      if (reducedMotion) {
        gsap.set(icon, { rotate: opening ? 225 : 0 });
        return;
      }

      spinTweenRef.current = opening
        ? gsap.to(icon, {
            rotate: 225,
            duration: 0.8,
            ease: "power4.out",
            overwrite: "auto",
          })
        : gsap.to(icon, {
            rotate: 0,
            duration: 0.35,
            ease: "power3.inOut",
            overwrite: "auto",
          });
    },
    [reducedMotion],
  );

  /* ── Text cycling animation ─────────────────── */
  const animateText = useCallback(
    (opening) => {
      const inner = textInnerRef.current;
      if (!inner) return;
      textCycleAnimRef.current?.kill();

      const targetLabel = opening ? "Close" : "Menu";

      if (reducedMotion) {
        setTextLines([targetLabel]);
        gsap.set(inner, { yPercent: 0 });
        return;
      }

      const currentLabel = opening ? "Menu" : "Close";
      const cycles = 3;
      const seq = [currentLabel];
      let last = currentLabel;
      for (let i = 0; i < cycles; i++) {
        last = last === "Menu" ? "Close" : "Menu";
        seq.push(last);
      }
      if (last !== targetLabel) seq.push(targetLabel);
      seq.push(targetLabel);
      setTextLines(seq);

      gsap.set(inner, { yPercent: 0 });
      const lineCount = seq.length;
      const finalShift = ((lineCount - 1) / lineCount) * 100;
      textCycleAnimRef.current = gsap.to(inner, {
        yPercent: -finalShift,
        duration: 0.5 + lineCount * 0.07,
        ease: "power4.out",
      });
    },
    [reducedMotion],
  );

  /* ── Toggle / close handlers ────────────────── */
  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    animateIcon(target);
    animateText(target);
  }, [animateIcon, animateText]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    animateIcon(false);
    animateText(false);
  }, [animateIcon, animateText]);

  /* ── Auto-close on route change ─────────────── */
  useEffect(() => {
    closeMenu();
    setActiveSubmenu(null);
  }, [pathname, hash, closeMenu]);

  /* ── Active-route helpers ───────────────────── */
  const isActive = useCallback(
    (to) => {
      if (to.startsWith("/#")) {
        return pathname === "/" && hash === to.slice(1);
      }
      if (to === "/") return pathname === "/";
      return pathname === to || pathname.startsWith(`${to}/`);
    },
    [pathname, hash],
  );

  const isSectionActive = useCallback(
    (prefix) => pathname.startsWith(prefix),
    [pathname],
  );

  /* ── Submenu controls ───────────────────────────
     Single source of truth: `activeSubmenu` state.
     Mouse, focus, and click all funnel into these handlers.
     The CSS reads ONLY the .is-open class.

     IMPORTANT: route-match (e.g. on /pricing/*) controls the
     trigger's *visual active* state via .is-active — it must
     NOT control submenu visibility (.is-open), or the dropdown
     becomes permanently visible while on those routes.
     ─────────────────────────────────────────────── */
  const handleSubmenuEnter = (id) => () => setActiveSubmenu(id);

  const handleSubmenuLeave = () => setActiveSubmenu(null);

  // Close on focus-out, but only when focus has actually left the entire <li>.
  const handleSubmenuBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setActiveSubmenu(null);
    }
  };

  // Open on focus, unless the focus came from a just-completed close click.
  const handleTriggerFocus = (id) => () => {
    if (skipNextFocusOpenRef.current) {
      skipNextFocusOpenRef.current = false;
      return;
    }
    setActiveSubmenu(id);
  };

  const renderSubmenu = (id, links) => (
    <ul className="submenu" role="menu" id={`submenu-${id}`}>
      {links.map((link) => (
        <li className="submenu__item" key={link.to} role="none">
          <Link
            to={link.to}
            className="submenu__link"
            role="menuitem"
            onClick={() => setActiveSubmenu(null)}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* The logo is detached from the header: fixed to the top-left on every
          route and stacked above everything but the cursor, so it stays put
          while the header hides over the home hero or turns translucent. */}
      <div className={`site-brand ${isHome ? "is-home" : ""} ${heroInView ? "is-hero" : ""}`}>
        <Link to="/" className="brand_link" aria-label="Switch Case Studio home">
          <HeaderLogo className="header_logo" />
        </Link>
      </div>
      <header
        className={`site-header ${scrolled ? "is-scrolled" : ""} ${isHome ? "is-home" : ""} ${heroInView ? "is-hero" : ""}`}
        role="banner"
      >
        <div className="site-header_inner">
          {/* Mobile toggle */}
          <button
            className="site-header_menuBtn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>

          <nav className="site-header_nav" aria-label="Primary">
            <ul className="nav_list">
              <li className="nav_item">
                <Link
                  to="/about"
                  className={`nav_link ${isActive("/about") ? "is-active" : ""}`}
                  aria-current={isActive("/about") ? "page" : undefined}
                >
                  About
                </Link>
              </li>
              {/* Pricing — disclosure submenu (button, not link).
                  .is-open ONLY reflects activeSubmenu state.
                  Route-match highlights the trigger via .is-active below. */}
              {/* Services and Pricing are two menus since 2026-10-22: a service
                  page sells the work, a pricing page the packages. Both
                  triggers open the services index until a /services index
                  exists. */}
              <li
                className={`nav_item nav_item--has-submenu ${
                  activeSubmenu === "services" ? "is-open" : ""
                }`}
                onMouseEnter={handleSubmenuEnter("services")}
                onMouseLeave={handleSubmenuLeave}
                onBlur={handleSubmenuBlur}
              >
                <Link
                  to="/pricing"
                  className={`nav_link nav_link--trigger ${
                    isSectionActive("/services") ? "is-active" : ""
                  }`}
                  aria-haspopup="true"
                  aria-expanded={activeSubmenu === "services"}
                  aria-controls="submenu-services"
                  onFocus={handleTriggerFocus("services")}
                  onClick={() => setActiveSubmenu(null)}
                >
                  Services
                  <span className="nav_caret" aria-hidden="true" />
                </Link>
                {renderSubmenu("services", SERVICE_LINKS)}
              </li>

              <li
                className={`nav_item nav_item--has-submenu ${
                  activeSubmenu === "pricing" ? "is-open" : ""
                }`}
                onMouseEnter={handleSubmenuEnter("pricing")}
                onMouseLeave={handleSubmenuLeave}
                onBlur={handleSubmenuBlur}
              >
                <Link
                  to="/pricing"
                  className={`nav_link nav_link--trigger ${
                    isSectionActive("/pricing") ? "is-active" : ""
                  }`}
                  aria-haspopup="true"
                  aria-expanded={activeSubmenu === "pricing"}
                  aria-controls="submenu-pricing"
                  onFocus={handleTriggerFocus("pricing")}
                  onClick={() => setActiveSubmenu(null)}
                >
                  Pricing
                  <span className="nav_caret" aria-hidden="true" />
                </Link>
                {renderSubmenu("pricing", PRICING_LINKS)}
              </li>

              {/* Case Studies — disclosure with a primary route */}
              <li
                className={`nav_item nav_item--has-submenu ${
                  activeSubmenu === "projects" ? "is-open" : ""
                }`}
                onMouseEnter={handleSubmenuEnter("projects")}
                onMouseLeave={handleSubmenuLeave}
                onBlur={handleSubmenuBlur}
              >
                <Link
                  to="/projects"
                  className={`nav_link nav_link--trigger ${
                    isSectionActive("/projects") ? "is-active" : ""
                  }`}
                  aria-haspopup="true"
                  aria-expanded={activeSubmenu === "projects"}
                  aria-controls="submenu-projects"
                  onFocus={handleTriggerFocus("projects")}
                  onClick={() => setActiveSubmenu(null)}
                >
                  Case Studies
                  <span className="nav_caret" aria-hidden="true" />
                </Link>
                {renderSubmenu("projects", PROJECT_LINKS)}
              </li>

              <li className="nav_item">
                <Link
                  to="/testimonials"
                  className={`nav_link ${isActive("/testimonials") ? "is-active" : ""}`}
                  aria-current={isActive("/testimonials") ? "page" : undefined}
                >
                  Reviews
                </Link>
              </li>
              <li className="nav_item">
                <Link
                  to="/blog"
                  className={`nav_link ${isSectionActive("/blog") ? "is-active" : ""}`}
                  aria-current={isActive("/blog") ? "page" : undefined}
                >
                  Blog
                </Link>
              </li>
              <li className="nav_item">
                <Link
                  to="/shop"
                  className={`nav_link ${isActive("/shop") ? "is-active" : ""}`}
                  aria-current={isActive("/shop") ? "page" : undefined}
                >
                  Shop
                </Link>
              </li>
              <li className="nav_item">
                <Link
                  to="/contact"
                  className={`nav_link ${isActive("/contact") ? "is-active" : ""}`}
                  aria-current={isActive("/contact") ? "page" : undefined}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <HeaderCTA />
        </div>
      </header>

      {/* StaggeredMenu — visible on tablet/mobile only */}
      <StaggeredMenu
        open={open}
        onClose={closeMenu}
        position="right"
        colors={["#1a1a1a", "#2a1a35"]}
        accentColor="#ff834a"
      />
    </>
  );
};

export default Header;
