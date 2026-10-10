import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import PropTypes from 'prop-types';
import useReducedMotion from '../../hooks/useReducedMotion';
import '../../styles/components/scrollingShot.scss';

/**
 * Frameless auto-scrolling website preview.
 * The tall screenshot (`src`) scrolls inside an overflow-hidden viewport —
 * down, hold, back up, hold — on a loop. Pauses on hover and when off-screen.
 * Reduced-motion users get a static top-of-page view (no animation).
 * Replaces the old laptop-framed DeviceMockup inside the bento gallery.
 */
const ScrollingShot = ({
  src,
  srcSet,
  sizes,
  // The case-study band is on the first screen and is the page's LCP
  // element: it must not wait for lazy loading (SEO audit fix 12).
  priority = false,
  // Called when the image the browser actually chose fails to load. The
  // caller removes the band; a separate `new Image()` probe of `src` would
  // download the full-size original on phones that never display it.
  onFail,
  alt = '',
  speed = 38,
  hold = 0.8,
  pauseOnHover = true,
  chrome = true,
  className = '',
}) => {
  const wrapRef = useRef(null);
  const viewRef = useRef(null);
  const imgRef = useRef(null);
  const tlRef = useRef(null);
  const onFailRef = useRef(onFail);
  onFailRef.current = onFail;
  const distanceRef = useRef(0);
  const inViewRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect-based (starts false, updates after mount) — never read matchMedia
  // in the render body: the SSG render must produce environment-independent
  // output, and all consumers of this flag are effects anyway.
  const prefersReduced = useReducedMotion();

  const killTL = () => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
  };

  const buildLoop = useCallback(() => {
    const img = imgRef.current;
    const d = distanceRef.current;
    if (!img || d <= 1) return null;

    const dur = d / speed;

    return gsap
      .timeline({ paused: true, repeat: -1, defaults: { ease: 'none' } })
      .to(img, { y: -d, duration: dur }) // scroll down
      .to({}, { duration: hold + 1 }) // pause at bottom
      .to(img, { y: 0, duration: dur }) // scroll up
      .to({}, { duration: hold }); // pause at top
  }, [speed, hold]);

  // Measure scroll distance once the image + viewport are sized, then autoplay.
  useEffect(() => {
    const content = imgRef.current;
    const viewportEl = viewRef.current;
    if (!content || !viewportEl) return;

    const calc = () => {
      const vH = viewRef.current.getBoundingClientRect().height;
      const iH = imgRef.current.getBoundingClientRect().height;
      distanceRef.current = Math.max(0, Math.round(iH - vH));
      if (distanceRef.current <= 1) {
        killTL();
        gsap.set(imgRef.current, { y: 0 });
        setIsPlaying(false);
      }
    };

    const onLoad = () => {
      calc();
      gsap.set(imgRef.current, { y: 0 });
      if (!prefersReduced && distanceRef.current > 1) {
        killTL();
        const tl = buildLoop();
        if (tl) {
          tlRef.current = tl;
          // Only run when actually visible; the observer flips this on.
          if (inViewRef.current) {
            tl.play(0);
            setIsPlaying(true);
          }
        }
      }
    };

    // A failed image is also `complete`, with no natural size. It may have
    // failed before hydration (the img is in the static HTML), so check now
    // and listen for a later failure too.
    const onError = () => onFailRef.current?.();
    if (content.complete && content.naturalWidth === 0) onError();
    else if (content.complete) onLoad();
    else content.addEventListener('load', onLoad, { once: true });
    content.addEventListener('error', onError);

    const ro = new ResizeObserver(calc);
    ro.observe(viewportEl);

    return () => {
      content.removeEventListener('load', onLoad);
      content.removeEventListener('error', onError);
      ro.disconnect();
      killTL();
    };
  }, [src, buildLoop, prefersReduced]);

  // Play only while in view; pause when scrolled away.
  useEffect(() => {
    if (prefersReduced) return;
    const host = wrapRef.current;
    if (!host) return;

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          inViewRef.current = e.isIntersecting;
          const tl = tlRef.current;
          if (!tl) return;
          if (e.isIntersecting) {
            tl.resume();
            setIsPlaying(true);
          } else {
            tl.pause();
            setIsPlaying(false);
          }
        }),
      { threshold: 0.4 }
    );
    io.observe(host);

    let onEnter, onLeave;
    if (pauseOnHover) {
      onEnter = () => {
        if (tlRef.current) tlRef.current.pause();
        setIsPlaying(false);
      };
      onLeave = () => {
        if (tlRef.current && inViewRef.current) {
          tlRef.current.resume();
          setIsPlaying(true);
        }
      };
      host.addEventListener('mouseenter', onEnter);
      host.addEventListener('mouseleave', onLeave);
    }

    return () => {
      io.disconnect();
      if (pauseOnHover) {
        host.removeEventListener('mouseenter', onEnter);
        host.removeEventListener('mouseleave', onLeave);
      }
    };
  }, [prefersReduced, pauseOnHover]);

  return (
    <div
      className={`scrolling-shot ${className}`}
      ref={wrapRef}
      data-playing={isPlaying}
    >
      {chrome && (
        <div className="scrolling-shot__bar" aria-hidden="true">
          <span className="scrolling-shot__dot" />
          <span className="scrolling-shot__dot" />
          <span className="scrolling-shot__dot" />
        </div>
      )}
      <div className="scrolling-shot__viewport" ref={viewRef}>
        <img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          className="scrolling-shot__img"
          draggable="false"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
        />
      </div>
    </div>
  );
};

ScrollingShot.propTypes = {
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string,
  sizes: PropTypes.string,
  priority: PropTypes.bool,
  onFail: PropTypes.func,
  alt: PropTypes.string,
  speed: PropTypes.number,
  hold: PropTypes.number,
  pauseOnHover: PropTypes.bool,
  chrome: PropTypes.bool,
  className: PropTypes.string,
};

export default ScrollingShot;
