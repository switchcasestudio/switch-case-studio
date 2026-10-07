import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';
import armSafetyNet from '../../animation/armSafetyNet';

import '../../styles/components/landingPageProof.scss';

const LandingPageProof = () => {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.lpp-animate', sectionRef.current);

      // House safe-reveal (DESIGN_AUDIT P1-7): the old fromTo+once carried
      // the immediateRender trap (a ScrollTrigger.refresh() during load
      // re-applies the hidden from-state: the old home tiles' bug class),
      // and an already-past `once` trigger never fires onEnter. set →
      // onEnter → in-view fallback → safety net.
      gsap.set(targets, { autoAlpha: 0, y: 28 });

      let played = false;
      const reveal = () => {
        if (played) return;
        played = true;
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: 'auto',
        });
      };

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 78%',
        once: true,
        onEnter: reveal,
      });
      if (st.progress > 0) reveal();

      // Viewport-aware net (see armSafetyNet): the mount-timed net fired
      // during the hero's 4.5s ident, so this heading never animated.
      armSafetyNet(
        sectionRef.current,
        () => played || targets.some((t) => gsap.isTweening(t)),
        () => {
          played = true;
          gsap.set(targets, { autoAlpha: 1, y: 0 });
        },
      );

      // Word-by-word brightness scrub on the heading (the About-heading
      // pattern, monochrome): words sit at 35% white and reach full white
      // as the heading crosses the viewport. Colour on the word spans, never
      // on the h2 the reveal owns, so the two never share a property.
      const words = gsap.utils.toArray('.lpp__word', sectionRef.current);
      gsap.set(words, { color: 'rgba(255,255,255,0.35)' });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 30%',
          scrub: true,
        },
      });
      words.forEach((w, i) => tl.to(w, { color: '#ffffff', duration: 1 }, i * 0.4));
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="what-we-build"
      className="lpp"
      aria-label="What we build"
    >
      {/* M1 (mobile audit): the feature-card grid + "See our work" CTA are
          gone — the cards restated the service rows that follow immediately
          below, so on mobile the home read as the same "what we do" list
          twice. This header now IS the intro to the Services rows; the two
          components render as one section (seam spacing tuned in
          landingPageProof.scss / services.scss). */}
      <div className="lpp__inner">
        <div className="lpp__header">
          <h2 className="lpp__heading lpp-animate">
            {['One', 'studio.'].map((w) => (
              <span className="lpp__word" key={w}>{w}{' '}</span>
            ))}
            <br />
            {['Design,', 'code', '&', 'AI.'].map((w) => (
              <span className="lpp__word" key={w}>{w}{' '}</span>
            ))}
          </h2>
          <p className="lpp__body lpp-animate">
            Every build starts with one question: what turns a visitor into a
            customer? We design it, engineer it, and wire in AI where it moves
            that number.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingPageProof;
