import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import '../../styles/components/textLoop.scss';

/* TextLoop (React Bits component, owner's settings 2026-09-13): text riding
   a looping SVG path on a ribbon. House changes to the stock component:
   - useLayoutEffect falls back to useEffect on the server (SSG renders in
     Node, where useLayoutEffect warns; CLAUDE.md SSR-safety rule);
   - the tween runs only while the band is on screen (IntersectionObserver),
     not forever from hydration (CLAUDE.md animation-loop rule);
   - styles are local SCSS (textLoop.scss), not the stock TextLoop.css.
   The SSR markup is the resting frame (offset 0), so static HTML reads
   correctly and nothing is ever hidden. */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;

const buildPath = (shape, curviness, ribbonWidth) => {
  const c = Math.max(0, curviness);
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);

  switch (shape) {
    case 'circle': {
      const r = Math.min(90 + c * 0.95, room);
      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;
    }
    case 'infinity': {
      const r = 150 + c * 1.4;
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${CX} ${CY}`,
        `C ${CX + r * 0.55} ${CY - h} ${CX + r} ${CY - h} ${CX + r} ${CY}`,
        `C ${CX + r} ${CY + h} ${CX + r * 0.55} ${CY + h} ${CX} ${CY}`,
        `C ${CX - r * 0.55} ${CY - h} ${CX - r} ${CY - h} ${CX - r} ${CY}`,
        `C ${CX - r} ${CY + h} ${CX - r * 0.55} ${CY + h} ${CX} ${CY}`,
        'Z',
      ].join(' ');
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2);
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case 'line':
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2);
      return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;
    }
  }
};

const TextLoop = ({
  text = 'React ✦ Bits',
  shape = 'wave',
  path,
  speed = 90,
  direction = 'forward',
  separator = '✦',
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = '#ffffff',
  ribbon = true,
  ribbonColor = '#5227FF',
  ribbonWidth = 86,
  pauseOnHover = true,
  // House addition: crop the viewBox to the wave's own height (wave/line
  // only). Computed from the same numbers as the path, so SSR and client
  // agree; the stock 1200×520 box left ~40% of the band empty.
  trim = false,
  className = '',
  style = {},
}) => {
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const measureRef = useRef(null);
  const headRef = useRef(null);
  const tailRef = useRef(null);

  const [metrics, setMetrics] = useState({ length: 0, reps: 1 });

  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/:/g, '')}`;

  const d = useMemo(() => path || buildPath(shape, curviness, ribbonWidth), [path, shape, curviness, ribbonWidth]);

  const viewBox = useMemo(() => {
    if (!trim || path || (shape !== 'wave' && shape !== 'line')) return `0 0 ${VIEW_W} ${VIEW_H}`;
    const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);
    // A quadratic segment peaks at half its control offset.
    const peak = shape === 'wave' ? Math.min(Math.max(0, curviness) * 2.2, room * 2) / 2 : 0;
    const half = peak + Math.max(ribbonWidth, fontSize) / 2 + EDGE_PAD;
    return `0 ${CY - half} ${VIEW_W} ${half * 2}`;
  }, [trim, path, shape, curviness, ribbonWidth, fontSize]);

  const unit = useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    const gap = separator ? ` ${separator} ` : '   ';
    return `${base}${gap}`;
  }, [text, separator, uppercase]);

  const textStyle = useMemo(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }),
    [fontSize, fontWeight, letterSpacing],
  );

  useIsoLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return undefined;

    let canceled = false;

    const measure = () => {
      if (canceled) return;
      let length = 0;
      let unitWidth = 0;
      try {
        length = pathEl.getTotalLength();
        unitWidth = measureEl.getComputedTextLength();
      } catch {
        return;
      }
      if (!length) return;

      const reps = unitWidth > 0 ? Math.max(1, Math.round(length / unitWidth)) : 1;
      setMetrics((prev) => (prev.length === length && prev.reps === reps ? prev : { length, reps }));
    };

    measure();
    // Re-measure once the web font lands: Inter's advance widths differ from
    // the fallback's, and a stale unit width leaves a gap at the loop seam.
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      canceled = true;
    };
  }, [d, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    const root = rootRef.current;
    if (!head || !tail || !root || !length) return undefined;

    const apply = (offset) => {
      const partner = offset >= 0 ? offset - length : offset + length;
      head.setAttribute('startOffset', String(offset));
      tail.setAttribute('startOffset', String(partner));
    };

    apply(0);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || speed <= 0) return undefined;

    const state = { offset: 0 };
    const tween = gsap.to(state, {
      offset: direction === 'reverse' ? -length : length,
      duration: length / speed,
      ease: 'none',
      repeat: -1,
      paused: true,
      onUpdate: () => apply(state.offset),
    });

    // Two reasons to stop, tracked separately so neither un-pauses the other.
    let onScreen = false;
    let hovered = false;
    const sync = () => (onScreen && !hovered ? tween.resume() : tween.pause());

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(root);

    const pause = () => {
      hovered = true;
      sync();
    };
    const resume = () => {
      hovered = false;
      sync();
    };
    if (pauseOnHover) {
      root.addEventListener('pointerenter', pause);
      root.addEventListener('pointerleave', resume);
    }

    return () => {
      io.disconnect();
      tween.kill();
      if (pauseOnHover) {
        root.removeEventListener('pointerenter', pause);
        root.removeEventListener('pointerleave', resume);
      }
    };
  }, [metrics, speed, direction, pauseOnHover]);

  const loopText = unit.repeat(metrics.reps);
  const fitLength = metrics.length || undefined;

  return (
    <div ref={rootRef} className={`text-loop ${className}`.trim()} style={style}>
      <svg
        className="text-loop__svg"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
      >
        <path
          ref={pathRef}
          id={pathId}
          d={d}
          fill="none"
          stroke={ribbon ? ribbonColor : 'none'}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text ref={measureRef} className="text-loop__measure" style={textStyle} aria-hidden="true">
          {unit}
        </text>

        <text
          className="text-loop__text"
          style={textStyle}
          fill={color}
          dominantBaseline="central"
          aria-hidden="true"
          textLength={fitLength}
          lengthAdjust="spacing"
        >
          <textPath ref={headRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>

        <text
          className="text-loop__text"
          style={textStyle}
          fill={color}
          dominantBaseline="central"
          aria-hidden="true"
          textLength={fitLength}
          lengthAdjust="spacing"
        >
          <textPath ref={tailRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default TextLoop;
