import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TILES, SCROLL_LENGTH } from './tiles/layout';

gsap.registerPlugin(ScrollTrigger);

/* Scroll engine for the collage (2026-10-22). What the reference does, read
   from its data: every tile has its own vector (dx, dy), its own speed and
   a pixel delay, eased both ways, scrubbed to scroll. Here: one timeline,
   pinned on the stage, scrub with a short lag; each tile tweens from its
   CSS start (left/top, the SSR state) by (ex - sx, ey - sy) of the stage
   size, with `at` as the delay and `dur` as the speed. Translation only
   (x/y), never left/top, so the SSR position is the fallback and GSAP owns
   the transform. Same gate as the services pan: wide pointer screens with
   motion allowed; everything else keeps the static sheet. */
const GATE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

export default function useCollageScroll(stageRef) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const mm = gsap.matchMedia();
    mm.add(GATE, () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: `+=${SCROLL_LENGTH}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      TILES.forEach((t) => {
        const el = stage.querySelector(`[data-tile="${t.id}"]`);
        if (!el) return;
        tl.fromTo(
          el,
          { x: 0, y: 0, rotation: t.r0 || 0 },
          {
            x: () => ((t.ex - t.sx) / 100) * stage.clientWidth,
            y: () => ((t.ey - t.sy) / 100) * stage.clientHeight,
            rotation: t.r1 || 0,
            duration: t.dur,
          },
          t.at,
        );
      });
      // The copy stays put and dims as the tiles run over it.
      tl.to(stage.querySelector('.bw-collage__copy'), { opacity: 0.25, duration: 0.5 }, 0.45);
      return () => tl.scrollTrigger && tl.scrollTrigger.kill();
    });
    return () => mm.revert();
  }, [stageRef]);
}
