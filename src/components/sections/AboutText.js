import { useRef } from "react";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedMotion from "../../hooks/useReducedMotion";
import armSafetyNet from "../../animation/armSafetyNet";
import {
  DUR_SLOW,
  EASE_OUT_SOFT,
  REVEAL_Y,
} from "../../animation/motionTokens";

const AboutText = () => {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  /* VE-10: migrated off toggleActions:'play none none reverse' (the last
   * reverse-on-scroll-out reveal — the pattern P1-7 removed everywhere
   * else) onto the house safe-reveal: play-once onEnter per paragraph +
   * in-view fallback + safety net + reduced-motion static. */
  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const paragraphs = gsap.utils.toArray(".work-text p");

      gsap.set(paragraphs, { y: REVEAL_Y, autoAlpha: 0 });

      const reveal = (p) =>
        gsap.to(p, {
          y: 0,
          autoAlpha: 1,
          duration: DUR_SLOW,
          ease: EASE_OUT_SOFT,
          overwrite: "auto",
        });

      paragraphs.forEach((p) => {
        ScrollTrigger.create({
          trigger: p,
          start: "top 80%",
          once: true,
          onEnter: () => reveal(p),
        });

        if (p.getBoundingClientRect().top < window.innerHeight * 0.8) {
          reveal(p);
        }
      });

      // Viewport-aware nets (armSafetyNet): a mount-timed net fired during
      // the hero's 4.5s ident and pre-empted every reveal below it.
      paragraphs.forEach((p) => {
        armSafetyNet(
          p,
          () => gsap.getProperty(p, "opacity") >= 1 || gsap.isTweening(p),
          () => reveal(p),
        );
      });
    }, rootRef);

    return () => ctx.revert(); // clean up
  }, [reducedMotion]);

  return (
    <div className="work-text" ref={rootRef}>
      <p className="work-text__kicker">About the studio</p>
      <h3 className="work-text__title">Designed, built and run in-house</h3>
      {/* Two paragraphs, not three (REFRESH-1): the old third one restated
          "small studio / personal attention", and the first restated the
          AboutHeading claim one viewport up. Each paragraph now adds a fact
          the heading didn't: who does the work, and what we run ourselves. */}
      <p>
        Switch Case Studio delivers{" "}
        <span className="highlight-block">
          websites, web apps, brand systems, and AI automation
        </span>{" "}
        for businesses that take their digital presence seriously. Every project,
        from a campaign page to a custom AI agent, is{" "}
        <span className="highlight-block">
          built and measured by the same people,
        </span>{" "}
        so you work directly with whoever is writing the code.
      </p>
      <p>
        We&rsquo;re engineers as much as designers: we run our own servers,
        self-host our own AI agents, and automate our own studio with{" "}
        <span className="highlight-block">
          the same systems we build for clients
        </span>
        : n8n workflows, CRM pipelines, agents on Hermes and OpenClaw, and
        assistants on Claude and OpenAI.
        When we say AI, we mean software that ships, not a buzzword on a deck.
      </p>
    </div>
  );
};

export default AboutText;
