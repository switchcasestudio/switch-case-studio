import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import BookCallCta from "../ui/BookCallCta";
import { HERO_LINKS } from "../../data/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedMotion from "../../hooks/useReducedMotion";
import {
  DUR_SLOW,
  EASE_OUT_SOFT,
  REVEAL_STAGGER,
  REVEAL_SAFETY_DELAY,
} from "../../animation/motionTokens";

gsap.registerPlugin(ScrollTrigger);



import "../../styles/components/hero.scss";
import playMuted from "../../utils/playMuted";

// Hero nav (owner, 2026-09-11): the header is hidden over the hero, so the
// hero carries its own way in. Links and order live in navigation.js
// (HERO_LINKS): pages only, no section hashes.

/* The studio ident: 4.5s of hard-cut plates that settle on the wordmark.
   Rendered from ~/Desktop/scs-ident (Remotion, private: licensed fonts);
   only the encoded video ships here (public/ident/, limited-range BT.709:
   full-range VP9 fails in Chrome's decoder mid-stream). The poster IS the
   final frame, so a paused or blocked video shows what the video ends on.
   It loops: 2s on the wordmark, then the plates run again. */

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const identRef = useRef(null);
  const rootRef = useRef(null);

  /* Copy motion. Static HTML ships visible; the hide happens at runtime only
     (never-invisible rule), then the four corner blocks rise in a stagger
     half a second after mount so the ident's first plates lead. On scroll-out
     the blocks drift apart, scrubbed. The entrance owns `yPercent`, the
     scrub owns `y`: separate transform components, so one tween per
     property holds. The video is never touched. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const items = gsap.utils.toArray(".hero-top, .hero-nav, .hero-note, .hero-scroll", root);
    if (reducedMotion) {
      gsap.set(items, { clearProps: "all" });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, yPercent: 6 });
      gsap.to(items, {
        autoAlpha: 1,
        yPercent: 0,
        duration: DUR_SLOW,
        stagger: REVEAL_STAGGER,
        ease: EASE_OUT_SOFT,
        delay: 0.5,
        overwrite: "auto",
      });
      const safety = gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        if (
          !items.some((el) => gsap.isTweening(el)) &&
          items.some((el) => gsap.getProperty(el, "opacity") < 1)
        ) {
          gsap.set(items, { autoAlpha: 1, yPercent: 0 });
        }
      });

      const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to(gsap.utils.toArray(".hero-top, .hero-nav", root), { y: -60, ease: "none", scrollTrigger: scrub });
      gsap.to(gsap.utils.toArray(".hero-note, .hero-scroll", root), {
        y: 60,
        ease: "none",
        scrollTrigger: { ...scrub },
      });

      // "Scroll" is an instruction for the first moment only: the first
      // scroll fades it out for good (owner, 2026-09-11). The pulse is CSS on
      // an inner span, so it never touches the opacity GSAP owns here.
      const cue = root.querySelector(".hero-scroll");
      const cueST = cue
        ? ScrollTrigger.create({
            start: 40,
            end: "max",
            onEnter: (self) => {
              gsap.to(cue, {
                autoAlpha: 0,
                duration: 0.3,
                ease: "power1.out",
                overwrite: "auto",
                onComplete: () => {
                  cue.hidden = true;
                },
              });
              self.kill();
            },
          })
        : null;

      return () => {
        safety.kill();
        if (cueST) cueST.kill();
      };
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const video = identRef.current?.querySelector("video");
    if (!video) return undefined;
    video.muted = true;
    // The poster attribute can't vary by media query; match the cut the
    // <source> list picks (same queries, same order).
    if (window.matchMedia("(max-aspect-ratio: 4/5)").matches) {
      video.poster = "/ident/ident-9x16-poster.webp";
    } else if (window.matchMedia("(max-width: 768px)").matches) {
      video.poster = "/ident/ident-1x1-poster.webp";
    }
    if (reducedMotion) {
      // No motion: park on the end card (the wordmark) instead of playing.
      const toEnd = () => {
        video.pause();
        if (Number.isFinite(video.duration)) {
          video.currentTime = Math.max(0, video.duration - 0.05);
        }
      };
      if (video.readyState >= 1) toEnd();
      else video.addEventListener("loadedmetadata", toEnd, { once: true });
      return () => video.removeEventListener("loadedmetadata", toEnd);
    }
    return playMuted(video);
  }, [reducedMotion]);

  return (
    <section id="hero" aria-label="Switch Case Studio introduction" ref={rootRef}>
      <div className="hero-frame">
        <div className="hero-top">
          {/* Spine lockup (owner picked option 3, 2026-09-10): "DESIGN" is one
              heavy word turned to run up the left edge like a book spine;
              "DEVELOPMENT" is its light counterpart across the top. Words set
              as words, never spelled letter by letter. Single h1. */}
          <h1 className="hero-headline">
            <span className="hero-spine">Design</span>{" "}
            <span className="hero-across">&amp;Development</span>
          </h1>
        </div>

        <nav className="hero-nav" aria-label="Hero">
          <ul>
            {HERO_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hero-nav__link">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <BookCallCta className="hero-nav__link" />
            </li>
          </ul>
        </nav>

        <div className="hero-ident" ref={identRef}>
          {/* Static HTML must carry autoplay+muted+playsinline so phones start
              the ident before hydration; the effect above only re-asserts
              muted and handles reduced motion. */}
          <video
            className="hero-ident__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/ident/ident-16x9-poster.webp"
            aria-hidden="true"
            tabIndex={-1}
          >
            {/* Portrait screens get the 9:16 cut so the ident covers the full
                width without cropping the wordmark; near-square gets 1:1. */}
            <source src="/ident/ident-9x16.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
            <source src="/ident/ident-9x16.mp4" type="video/mp4" media="(max-aspect-ratio: 4/5)" />
            <source src="/ident/ident-1x1.webm" type="video/webm" media="(max-width: 768px)" />
            <source src="/ident/ident-1x1.mp4" type="video/mp4" media="(max-width: 768px)" />
            <source src="/ident/ident-16x9.webm" type="video/webm" />
            <source src="/ident/ident-16x9.mp4" type="video/mp4" />
          </video>
        </div>

        <p className="hero-note hero-note--left">
          We make websites, online stores and{" "}
          <span className="caps-trim">AI</span> assistants for businesses that
          need them to actually bring in work. We design it, build it, and
          stick around after launch so it keeps running.
        </p>

        <HashLink to="/#projects" smooth className="hero-scroll">
          <span className="hero-scroll__pulse">
            Scroll
            <span className="hero-scroll__arrow" aria-hidden="true">
              &darr;
            </span>
          </span>
        </HashLink>

        <p className="hero-note hero-note--right">
          Don't take our word for it.{" "}
          <Link to="/projects" className="hero-note__link">
            <u>Every case study</u>
          </Link>{" "}
          below puts the old site next to ours, with page weight and load time measured on the live
          pages.
        </p>
      </div>
    </section>
  );
};

export default Hero;
