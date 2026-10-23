import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Scroll engine for a world's collage hero (2026-10-22, revised the same
   day after the owner's review: "entering but not exiting, all the same
   pace, and the cut at the end feels like a mistake"). Each tile gets its
   own vector, pace and distance from a seeded random (deterministic per
   tile, so a reload looks the same): it starts at its SSR position on the
   edge, aims at a random point around the middle, and keeps going on that
   line until it is fully off the opposite side. Starts are staggered,
   durations vary, and every tile has left by 95% of the pin, so the stage
   empties on its own and the headline comes back before the pin releases;
   no hard cut. Translation only (x/y/rotation), never left/top. Same gate
   as the services pan; everything else keeps the static sheet.
   Shared by every world since the AI page (same day): `tiles` and the pin
   length come in from the page's layout file. */
const GATE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

// mulberry32: tiny seeded PRNG, so the choreography is stable per tile.
function rng(seed) {
  let a = seed + 0x6d2b79f5;
  return () => {
    a = Math.imul(a ^ (a >>> 15), a | 1);
    a ^= a + Math.imul(a ^ (a >>> 7), a | 61);
    return ((a ^ (a >>> 14)) >>> 0) / 4294967296;
  };
}

// Where a tile's path leaves the stage: continue from start through aim
// until both edges are cleared by the tile's own size (in % of the stage).
function exitPoint(t, aim, sizeX, sizeY) {
  const dx = aim.x - t.sx;
  const dy = aim.y - t.sy;
  const kx = dx > 0 ? (100 + sizeX - t.sx) / dx : dx < 0 ? (-sizeX - t.sx) / dx : Infinity;
  const ky = dy > 0 ? (100 + sizeY - t.sy) / dy : dy < 0 ? (-sizeY - t.sy) / dy : Infinity;
  const k = Math.min(kx, ky);
  return { x: t.sx + dx * k, y: t.sy + dy * k };
}

export default function useCollageScroll(stageRef, tiles, scrollLength) {
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
          end: `+=${scrollLength}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tiles.forEach((t, i) => {
        const el = stage.querySelector(`[data-tile="${t.id}"]`);
        if (!el) return;
        const r = rng(i * 7919 + 17);
        const aim = { x: 28 + r() * 44, y: 22 + r() * 56 };
        const at = r() * 0.32;
        const dur = Math.min(0.45 + r() * 0.5, 0.95 - at);
        const rot0 = (r() - 0.5) * 12;
        const rot1 = rot0 + (r() - 0.5) * 30;
        tl.fromTo(
          el,
          { x: 0, y: 0, rotation: rot0 },
          {
            x: () => {
              const sizeX = (el.offsetWidth / stage.clientWidth) * 100 + 4;
              const sizeY = (el.offsetHeight / stage.clientHeight) * 100 + 4;
              return ((exitPoint(t, aim, sizeX, sizeY).x - t.sx) / 100) * stage.clientWidth;
            },
            y: () => {
              const sizeX = (el.offsetWidth / stage.clientWidth) * 100 + 4;
              const sizeY = (el.offsetHeight / stage.clientHeight) * 100 + 4;
              return ((exitPoint(t, aim, sizeX, sizeY).y - t.sy) / 100) * stage.clientHeight;
            },
            rotation: rot1,
            duration: dur,
          },
          at,
        );
        // A scrubbed video runs its whole length over the tile's flight.
        if (t.scrub) {
          const video = el.querySelector('video');
          if (video) {
            const proxy = { p: 0 };
            const seek = () => {
              if (video.duration) video.currentTime = proxy.p * (video.duration - 0.05);
            };
            // Metadata may land after the first updates: apply the last
            // position once the file knows its length.
            video.addEventListener('loadedmetadata', seek, { once: true });
            tl.to(proxy, { p: 1, duration: dur, ease: 'none', onUpdate: seek }, at);
          }
        }
      });
      // The copy dims while the tiles run over it and returns as they leave.
      const copy = stage.querySelector('.bw-collage__copy');
      tl.to(copy, { opacity: 0.2, duration: 0.3 }, 0.25);
      tl.to(copy, { opacity: 1, duration: 0.2 }, 0.8);
      return () => tl.scrollTrigger && tl.scrollTrigger.kill();
    });
    return () => mm.revert();
  }, [stageRef, tiles, scrollLength]);
}
