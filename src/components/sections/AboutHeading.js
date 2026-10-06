import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useReducedMotion from '../../hooks/useReducedMotion';

const AboutHeading = () => {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    // gsap.context + a root: every selector here is scoped to THIS heading
    // (REFRESH-1) — an unscoped '.word' would silently pull any future
    // component reusing the class into this scrub timeline.
    const ctx = gsap.context(() => {
    const words = gsap.utils.toArray('.word', root);

    // M3: colors come from the design tokens (:root exports in app.scss);
    // literals are the sync'd fallbacks per the token-mirror convention.
    const rootStyles = getComputedStyle(document.documentElement);
    const scrubFrom =
      rootStyles.getPropertyValue('--about-scrub-from').trim() || '#e9add7';
    const scrubTo =
      rootStyles.getPropertyValue('--about-scrub-to').trim() || '#ff8347';

    // VE-10: reduced motion skips the scrub — words rest at the END color
    // (the highlighted state), never animating.
    if (reducedMotion) {
      gsap.set(words, { color: scrubTo });
      return undefined;
    }

    gsap.set(words, { color: scrubFrom }); // initial color

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    });

    words.forEach((word, i) => {
      tl.to(word, { color: scrubTo }, i * 0.05); // highlight one by one
    });

    }, root);

    // ctx.revert() kills only this context's tweens + triggers (never
    // ScrollTrigger.getAll() — that once nuked every component's triggers
    // on route change).
    return () => ctx.revert();
  }, [reducedMotion]);

  const text = `We build websites, apps, and AI systems that convert: designed from scratch, engineered by people who ship real code, and automated so your business runs while you sleep`;

  const wrappedWords = text.split(' ').map((word, idx) => (
    <span
      key={idx}
      // caps-trim: optical size reduction for the all-caps "AI" token
      // (see app.scss) — scrub still targets .word.
      className={word === 'AI' ? 'word caps-trim' : 'word'}
    >
      {word}&nbsp;
    </span>
  ));

  return (
    <div className="work-heading" ref={rootRef}>
      <p>{wrappedWords}</p>
    </div>
  );
};

export default AboutHeading;
