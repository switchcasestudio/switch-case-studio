import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import armSafetyNet from '../../animation/armSafetyNet';

import TestimonialHeading from './TestimonialHeading';
import BookCallCta from '../ui/BookCallCta';
import MagneticButton from '../ui/MagneticButton';
import testimonialsData from '../../data/testimonials.json';
import {
  DUR_MED,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_SAFETY_DELAY,
} from '../../animation/motionTokens';

gsap.registerPlugin(ScrollTrigger);
import '../../styles/components/testimonials.scss';

const AUTO_ADVANCE_MS = 10000;
const CURSOR_HIDE_CLASS = 'is-carousel-hover';

const Reviews = () => {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // The visitor's own stop (2026-11-10, WCAG 2.2.2): the Pause button, any
  // touch on the card, or reduced motion. Hover and focus only hold it.
  const [userPaused, setUserPaused] = useState(false);
  const containerRef = useRef(null);

  const total = testimonialsData.length;
  const prefersReducedMotion = useReducedMotion();

  /* ── Cursor follow (spring-smoothed) ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  /* Which half the pointer is over decides the pill label AND the click:
     left half = previous, right half = next. */
  const [side, setSide] = useState('next');

  const trackPointer = (e, jump = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    // On entry, snap the springs to the pointer: without this the pill
    // springs in from wherever it last was (0,0 on first hover) while the
    // global cursor has already faded out, which read as a blink.
    if (jump) {
      cursorX.jump(x);
      cursorY.jump(y);
    }
    setSide(x < rect.width / 2 ? 'prev' : 'next');
  };

  const handleMouseMove = (e) => trackPointer(e);

  /* ── Navigation ── */
  const goTo = useCallback(
    (i) => {
      setCurrent(((i % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  /* ── Auto-advance every 10s. Holds on hover and focus; stops on Pause,
        on touch (a phone reader lost reviews mid-sentence) and never runs
        under reduced motion. ── */
  useEffect(() => {
    if (prefersReducedMotion) setUserPaused(true);
  }, [prefersReducedMotion]);
  const running = !isHovering && !isFocused && !userPaused;
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [next, running, current]);

  /* ── VE-7: "Ready to be next?" beat entrance — house safe-reveal.
   * Primary CTA, so strand-proof is non-negotiable: SSG HTML ships
   * visible, hidden state applied only at runtime via gsap.set, revealed
   * play-once onEnter with in-view fallback + timed safety net; reduced
   * motion never hides it. Same proven shape as AboutCTA. ── */
  useEffect(() => {
    const el = document.querySelector('.testimonials-cta');
    if (!el) return undefined;

    if (prefersReducedMotion) {
      gsap.set(el, { clearProps: 'all' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0, y: REVEAL_Y });

      const reveal = () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: DUR_MED,
          ease: EASE_OUT_SOFT,
          overwrite: 'auto',
        });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: reveal,
      });

      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        reveal();
      }

      // Viewport-aware net (armSafetyNet): forces only an on-screen card.
      const disarm = armSafetyNet(
        el,
        () => gsap.getProperty(el, 'opacity') >= 1 || gsap.isTweening(el),
        reveal,
        { delay: REVEAL_SAFETY_DELAY },
      );

      return () => {
        trigger.kill();
        disarm();
      };
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  /* ── Hide global cursor while hovering the carousel ── */
  const handleMouseEnter = (e) => {
    trackPointer(e, true);
    setIsHovering(true);
    document.body.classList.add(CURSOR_HIDE_CLASS);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    document.body.classList.remove(CURSOR_HIDE_CLASS);
  };

  // Belt-and-suspenders: ensure the class never sticks if the component
  // unmounts mid-hover (route change, etc.)
  useEffect(() => {
    return () => {
      document.body.classList.remove(CURSOR_HIDE_CLASS);
    };
  }, []);

  const item = testimonialsData[current];

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading">
      <div className="testimonials-inner">
        <div className="panel-heading">
          <TestimonialHeading id="testimonials-heading" />
        </div>

        <div
          ref={containerRef}
          className="testimonial-carousel"
          onClick={side === 'prev' ? prev : next}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={(e) => {
            // The Pause button toggles on its own click; a touch anywhere
            // else on the card means someone is reading.
            if (!e.target.closest('.testimonial-pause')) setUserPaused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setIsFocused(false);
          }}
          role="button"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Client testimonials. Press Enter or the right arrow for the next one, the left arrow for the previous one."
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              next();
            }
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
          }}
        >
          {/* Floating Prev/Next cursor. Always mounted (no remount flash);
              visibility is animated, position is snapped on entry. */}
          <motion.div
            className="next-pill"
            aria-hidden="true"
            initial={false}
            animate={
              isHovering
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.6 }
            }
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              translateX: cursorX,
              translateY: cursorY,
            }}
          >
            <span className="next-pill-label">
              {side === 'prev' ? 'Previous' : 'Next'}
            </span>
          </motion.div>

          <div className="testimonial-row">
            {/* Image column */}
            <div className="testimonial-image-col">
              <div className="testimonial-image-frame">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current}
                    src={item.image}
                    alt=""
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 1.05 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                    className="testimonial-image"
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Quote column */}
            <div className="testimonial-quote-col">
              <div className="testimonial-quote-top">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -10 }
                    }
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                  >
                    <blockquote className="testimonial-quote">
                      &ldquo;{item.highlight}&rdquo;
                    </blockquote>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="testimonial-quote-bottom">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    className="testimonial-attrib"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -10 }
                    }
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                  >
                    <h3 className="testimonial-name">{item.name}</h3>
                    <p className="testimonial-role">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="testimonial-role-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="testimonial-progress">
                  {testimonialsData.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="testimonial-progress-track"
                      aria-label={`Go to testimonial ${idx + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(idx);
                      }}
                    >
                      <motion.span
                        className="testimonial-progress-fill"
                        initial={{ width: 0 }}
                        animate={{
                          width: idx === current ? '100%' : '0%',
                        }}
                        transition={{
                          duration:
                            idx === current && running
                              ? AUTO_ADVANCE_MS / 1000
                              : 0,
                          ease: 'linear',
                        }}
                      />
                    </button>
                  ))}
                  <button
                    type="button"
                    className="carousel-pause testimonial-pause"
                    aria-label={userPaused ? 'Play the reviews' : 'Pause the reviews'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserPaused((p) => !p);
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {userPaused ? 'Play' : 'Pause'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="testimonials-cta">
        <p className="testimonials-cta-text">Ready to be next?</p>
        <div className="testimonials-cta-actions">
          <Link
            to="/testimonials"
            className="testimonials-cta-button testimonials-cta-button--ghost"
          >
            Read all reviews
          </Link>
          <MagneticButton distance={0.35}>
            <BookCallCta className="testimonials-cta-button" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
