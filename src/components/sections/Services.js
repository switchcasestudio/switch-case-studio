import { Fragment, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import servicesData from "../../data/services.json";
import { servicePath } from "../../data/navigation";
import armSafetyNet from "../../animation/armSafetyNet";
import ServicePoster from "../servicePoster/ServicePoster";
import "../../styles/components/servicePoster.scss";
import "../../styles/components/services.scss";


function ServiceItem({ service, index, delay = 0 }) {
  const itemRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    /* Typographic build (owner, 2026-09-10: the old x-slide "felt like
       nothing"). Per entry, on its own trigger so scrolling reads as a
       sequence: the hairline draws left → right, the title rises out of a
       mask, kicker + pricing link fade in, subtitle and includes follow.
       All hidden at runtime only (static HTML ships visible), one timeline
       per entry, a timed net that forces every piece visible. The entry
       itself carries no reveal transform any more: `y` on the item belongs
       to the column parallax in Services below. */
    const rule = el.querySelector(".services__item-rule");
    const meta = el.querySelectorAll(".services__item-kicker, .services__item-cta");
    const title = el.querySelector(".services__item-title");
    const body = el.querySelectorAll(".services__item-subtitle, .services__item-includes");
    const pieces = [rule, ...meta, title, ...body];

    const ctx = gsap.context(() => {
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(meta, { autoAlpha: 0, y: 8 });
      gsap.set(title, { yPercent: 110 });
      gsap.set(body, { autoAlpha: 0, y: 16 });

      let played = false;
      // Once built, the title mask stops clipping so the hover letter
      // bounce can rise above it.
      const built = () => el.classList.add("is-built");
      const reveal = () => {
        if (played) return;
        played = true;
        el.dataset.revealed = "1";
        gsap
          .timeline({ delay, defaults: { overwrite: "auto" }, onComplete: built })
          .to(rule, { scaleX: 1, duration: 0.7, ease: "power3.out" }, 0)
          .to(title, { yPercent: 0, duration: 0.8, ease: "power4.out" }, 0.1)
          .to(meta, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.15)
          .to(body, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 }, 0.35);
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: reveal,
      });
      if (st.progress > 0) reveal();

      // Viewport-aware net: forces the end state only if the entry is on
      // screen and still hidden; entries below the fold keep their build.
      const disarm = armSafetyNet(
        el,
        () => played || pieces.some((p) => gsap.isTweening(p)),
        () => {
          played = true;
          gsap.set(rule, { scaleX: 1 });
          gsap.set(title, { yPercent: 0 });
          gsap.set([...meta, ...body], { autoAlpha: 1, y: 0 });
          built();
        },
      );
      return () => disarm();
    }, itemRef);

    return () => ctx.revert();
  }, [index, delay]);

  // Hover: the title's letters hop in sequence (the lilac overlay wipe
  // left with the posters, 2026-09-11: the poster is the hover response).
  const handleMouseEnter = () => {
    if (!itemRef.current?.classList.contains("is-built")) return;
    gsap
      .timeline()
      .fromTo(
        charsRef.current,
        { y: 0 },
        { y: -12, duration: 0.15, ease: "sine.out", stagger: { each: 0.01 } },
      )
      .to(
        charsRef.current,
        { y: 0, duration: 0.2, ease: "sine.inOut", stagger: { each: 0.01 } },
        0.15,
      );
  };

  // Letters sit in a no-wrap span per word: every inline-block letter is a
  // line-break opportunity, so a long name broke mid-word on a phone
  // ("Web Developme / nt", iOS 27 simulator pass, 2026-10-26).
  let ci = 0;
  const chars = service.title.split(" ").map((word, w) => (
    <Fragment key={w}>
      {w > 0 && " "}
      <span className="services__title-word">
        {word.split("").map((char) => {
          const i = ci++;
          return (
            <span
              key={i}
              ref={(el) => {
                if (el) charsRef.current[i] = el;
              }}
              className="services__title-char"
            >
              {char}
            </span>
          );
        })}
      </span>
    </Fragment>
  ));

  return (
    <div ref={itemRef} className="services__item">
      {/* A card lands on the service's own page where one exists and on its
          pricing page until then (owner, 2026-10-22); `cta` in services.json
          says which. */}
      <Link
        to={servicePath(service.slug)}
        className="services__link cursor-black"
        aria-label={service.title}
        onMouseEnter={handleMouseEnter}
      >
        {/* Kicker row, then the service name as the dominant element and one
            line under it. The included-items line was cut (owner, 2026-09-10:
            the services are the product; the detail lives one click away on
            each pricing page). */}
        <span className="services__item-meta">
          <span className="services__item-kicker">{service.kicker}</span>
          <span className="services__item-cta">{service.cta}</span>
          <span className="services__item-rule" aria-hidden="true" />
        </span>
        {/* Inner parallax layer (name + line). The entrance build animates
            the children; the parallax moves only this wrapper, so the two
            never write the same property on the same element. */}
        <span className="services__item-body">
          <span className="services__item-title-mask">
            <span className="services__item-title">{chars}</span>
          </span>
          <span className="services__item-subtitle">{service.subTitle}</span>
        </span>
        {/* The live poster sits last, under the name and line (owner,
            2026-09-11); the card element is still its hover area. */}
        <ServicePoster slug={service.slug} cardRef={itemRef} />
      </Link>
    </div>
  );
}

/* The end card's art is the whole set, not a fifth service: the four
   posters as a contact sheet of thumbnails. Pure CSS hover (the prints
   square up), decorative, SSR-complete. */
const DECK = [
  { n: 1, bg: "cream", art: (
    <>
      <text x="50" y="66" textAnchor="middle" fontSize="54" fontWeight="600" letterSpacing="-3" className="sp-f-pink" transform="translate(-3 -2)">Aa</text>
      <text x="50" y="66" textAnchor="middle" fontSize="54" fontWeight="600" letterSpacing="-3" className="sp-f-terra sp-multiply" transform="translate(3 2)">Aa</text>
    </>
  ) },
  { n: 2, bg: "mint", art: (
    <>
      <rect x="20" y="26" width="60" height="50" rx="3" className="sp-f-cream" />
      <rect x="20" y="26" width="60" height="9" rx="3" className="sp-f-ink" />
      <rect x="27" y="42" width="26" height="6" rx="2" className="sp-f-ink" />
      <rect x="27" y="54" width="18" height="7" rx="3.5" className="sp-f-terra" />
      <rect x="58" y="42" width="15" height="19" rx="2" className="sp-f-pink" />
    </>
  ) },
  { n: 3, bg: "ink", art: (
    <>
      <path d="M30 50H50M50 50C60 50 58 34 70 34M50 50H70M50 50C60 50 58 66 70 66" fill="none" className="sp-s-cream" strokeOpacity="0.4" strokeWidth="2.5" />
      <rect x="20" y="42" width="16" height="16" rx="4" className="sp-f-cream" />
      <rect x="40" y="38" width="24" height="24" rx="6" className="sp-f-pink" />
      <rect x="68" y="28" width="12" height="12" rx="3" className="sp-f-terra" />
      <rect x="68" y="44" width="12" height="12" rx="3" className="sp-f-mint" />
      <rect x="68" y="60" width="12" height="12" rx="3" className="sp-f-cream" />
    </>
  ) },
  { n: 4, bg: "terra", art: (
    <>
      <rect x="20" y="28" width="52" height="9" rx="2" className="sp-f-cream" />
      <rect x="20" y="42" width="44" height="9" rx="2" className="sp-f-ink" />
      <rect x="20" y="56" width="56" height="9" rx="2" className="sp-f-ink" />
      <rect x="20" y="70" width="38" height="9" rx="2" className="sp-f-ink" />
    </>
  ) },
];

const EndDeck = () => (
  <span className="services__end-deck" aria-hidden="true">
    {DECK.map((c) => (
      <span key={c.n} className={`services__end-thumb sp-bg-${c.bg}`}>
        <svg viewBox="0 0 100 100" focusable="false" fontFamily="Inter, 'Inter Fallback', sans-serif">
          <text x="10" y="15" fontSize="7" fontWeight="500" letterSpacing="0.6" className={c.bg === "ink" ? "sp-f-cream" : "sp-f-ink"}>{`SCS·0${c.n}`}</text>
          {c.art}
        </svg>
      </span>
    ))}
  </span>
);

const Services = () => {
  const listRef = useRef(null);

  /* Pinned horizontal pan (owner's reference recording, 2026-09-10): on
     desktop the whole services block pins, and vertical scroll slides the
     card row left under the "One studio." heading until the end card, then
     releases. The pan tween uses ease "none" so scroll maps 1:1 to travel.
     Layer: each card's name block drifts on x as that card crosses the
     screen (containerAnimation). Owners: the pan owns the LIST's x; the
     depth tween owns each `.services__item-body`'s x; the entrance build
     owns the children's y/opacity. Below 1024px or with reduced motion:
     no pin, no pan, the static grid (CSS gates the row layout the same way). */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const block = list.closest(".services-block") || list;
      const distance = () => Math.max(0, list.scrollWidth - list.clientWidth);
      const pan = gsap.to(list, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: block,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      gsap.utils.toArray(".services__item-body", list).forEach((body) => {
        gsap.fromTo(
          body,
          { x: 36 },
          {
            x: -36,
            ease: "none",
            scrollTrigger: {
              containerAnimation: pan,
              trigger: body.closest(".services__item"),
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="services" className="services">
      <div id="services-menu" className="services__menu">
        <div
          className="services__list"
          ref={listRef}
        >
          {servicesData.map((service, index) => (
            <ServiceItem
              key={service.slug}
              service={service}
              index={index}
              // One row of four: left to right, a beat apart.
              delay={index * 0.08}
            />
          ))}
          {/* Row end (the reference's "Explore more"): only in the desktop
              pan; the static grid hides it (CSS). */}
          <Link to="/services" className="services__end">
            <EndDeck />
            <span className="services__end-label">All services</span>
            <span className="services__end-arrow" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
