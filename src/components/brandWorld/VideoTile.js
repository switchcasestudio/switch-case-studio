import { useEffect, useRef } from 'react';

/* A video tile (2026-10-22): the reference's media unit. Muted, looping,
   no controls, a poster in the static HTML, and it only plays while on
   screen (IntersectionObserver) and never under reduced motion, where the
   poster is the tile. `preload="none"` so a dozen tiles do not fetch on
   load; the browser pulls the file when play() is called.
   `scrub`: the scroll owns the playhead (useCollageScroll sets
   currentTime), so it never plays on its own and preloads for seeking. */
export default function VideoTile({ src, poster, label, className = '', scrub = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || scrub || !window.matchMedia) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const p = el.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scrub]);
  return (
    <video
      ref={ref}
      className={`bw-video ${className}`}
      src={src}
      poster={poster}
      muted
      loop={!scrub}
      playsInline
      preload={scrub ? 'auto' : 'none'}
      aria-label={label}
      disablePictureInPicture
    />
  );
}
