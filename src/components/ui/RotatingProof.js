import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

import '../../styles/components/rotatingProof.scss';

/**
 * RotatingProof: one client quote at a time, auto-rotating, with dots to
 * pick. Extracted from SinglePricingCard (2026-09-26) so the package board
 * on /pricing/:slug can show the proof once under the board instead of
 * once per tier card. Markup and motion are the card's, unchanged.
 *
 * 2026-11-10 (UX audit, WCAG 2.2.2): the rotation can be stopped. It holds
 * while the pointer or focus is on it, has a Pause button, stops for good
 * once the visitor picks a dot, and never starts under reduced motion. The
 * stage is as tall as its longest quote (hidden sizer copies share its grid
 * cell), so a long quote no longer runs into the dots. Dots are 24px targets.
 */
const QuoteBody = ({ t, sizer = false }) => (
  <>
    <figcaption className="rp__head">
      {t.avatar &&
        (sizer ? (
          <span className="rp__avatar" />
        ) : (
          <img
            src={t.avatar}
            alt=""
            className="rp__avatar"
            loading="lazy"
            width="32"
            height="32"
          />
        ))}
      <span className="rp__meta">
        <span className="rp__name">{t.name}</span>
        {t.role && <span className="rp__role">{t.role}</span>}
      </span>
    </figcaption>
    <blockquote className="rp__text">“{t.content}”</blockquote>
  </>
);

const RotatingProof = ({ testimonials = [], rotationSpeed = 5000, className = '' }) => {
  const reduced = useReducedMotion();
  const [tIndex, setTIndex] = useState(0);
  const [paused, setPaused] = useState(false); // the visitor's choice
  const [held, setHeld] = useState(false); // pointer or focus is on it

  // Set in an effect, not in the first render: the server cannot know the
  // setting, and the button's label must match the static HTML at hydration.
  useEffect(() => {
    if (reduced) setPaused(true);
  }, [reduced]);

  useEffect(() => {
    if (testimonials.length <= 1 || paused || held) return undefined;
    const id = setInterval(
      () => setTIndex((p) => (p + 1) % testimonials.length),
      rotationSpeed
    );
    return () => clearInterval(id);
  }, [testimonials.length, rotationSpeed, paused, held]);

  // A visitor who chose a quote is reading it.
  const pick = (i) => {
    setTIndex(i);
    setPaused(true);
  };

  if (!testimonials.length) return null;

  return (
    <div
      className={`rp ${className}`.trim()}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
      }}
    >
      <div className="rp__stage">
        {testimonials.map((t, i) => (
          <div key={`sizer-${t.id ?? i}`} className="rp__quote rp__quote--sizer" aria-hidden="true">
            <QuoteBody t={t} sizer />
          </div>
        ))}
        <AnimatePresence mode="wait">
          {testimonials.map(
            (t, i) =>
              i === tIndex && (
                <motion.figure
                  key={t.id ?? i}
                  className="rp__quote"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.45 }}
                >
                  <QuoteBody t={t} />
                </motion.figure>
              )
          )}
        </AnimatePresence>
      </div>

      {testimonials.length > 1 && (
        <div className="rp__dots">
          {testimonials.map((t, i) => (
            <button
              key={t.id ?? i}
              type="button"
              className={`rp__dot${i === tIndex ? ' is-active' : ''}`}
              onClick={() => pick(i)}
              aria-label={`View testimonial ${i + 1}`}
              aria-current={i === tIndex ? 'true' : undefined}
            />
          ))}
          <button
            type="button"
            className="carousel-pause rp__pause"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play the client quotes' : 'Pause the client quotes'}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RotatingProof;
