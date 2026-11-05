import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import hasWebGL from '../../utils/hasWebGL';
import useReducedMotion from '../../hooks/useReducedMotion';
import { CELLS, OUTLINE, W, H, PALETTE, tileColor, mixHex } from './pixelInvaderGrid';

import '../../styles/components/pixelInvader.scss';

/* PixelInvader (2026-11-05): the 👾 emoji as glowing 3D pixel tiles. The SVG
   below IS the poster (static HTML, no WebGL): the three.js scene mounts over
   it only once WebGL is confirmed and the box is near the viewport, and its
   module (three + fiber) loads only then. Reduced motion holds one pose.
   `walk` (owner, 2026-11-05): the root becomes a full-width track and the
   invader walks it with the page scroll, edge to edge and back, stepping
   only while the page moves. */
// Each eye column as one tall shape: [x, topY, rows].
const EYE_COLS = [...new Set(CELLS.filter((c) => c.kind === 'eye').map((c) => c.x))].map((x) => {
  const ys = CELLS.filter((c) => c.kind === 'eye' && c.x === x).map((c) => c.y);
  return [x, Math.min(...ys), ys.length];
});
const Scene = lazy(() => import('./PixelInvaderScene'));

// Walk tuning: track pixels per scrolled pixel, and one step's length as a
// share of the invader's own width (so a bigger invader takes longer strides).
// The walk is counted from the moment the track enters the viewport, so the
// visitor always meets it at the left edge (owner, 2026-11-05: starting
// mid-page, "the user can barely see the walking").
const WALK_SPEED = 0.45;
const STEP_SHARE = 0.2;

const PixelInvader = ({ palette = PALETTE, className = '', label = 'Space invader', walk = false }) => {
  const rootRef = useRef(null);
  const boxRef = useRef(null);
  const motion = useRef({ phase: 0, dir: 1, at: 0 });
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setWebgl(hasWebGL());
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        setOnScreen(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll walking: distance = scroll since the track entered × speed,
  // folded into a there-and-back trip across the track. Writes the box's transform directly (no render).
  useEffect(() => {
    if (!walk || reducedMotion) return undefined;
    const root = rootRef.current;
    const box = boxRef.current;
    if (!root || !box) return undefined;
    let raf = 0;
    let first = true;
    const update = () => {
      raf = 0;
      const range = Math.max(1, root.clientWidth - box.offsetWidth);
      const entered = window.innerHeight - root.getBoundingClientRect().top;
      const d = Math.max(0, entered) * WALK_SPEED;
      const m = d % (2 * range);
      const out = m < range;
      box.style.transform = `translate3d(${out ? m : 2 * range - m}px, 0, 0)`;
      const mo = motion.current;
      mo.phase = d / (box.offsetWidth * STEP_SHARE);
      mo.dir = out ? 1 : -1;
      if (!first) mo.at = performance.now();
      first = false;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [walk, reducedMotion]);

  const live = webgl && near;

  return (
    <div
      ref={rootRef}
      className={`pixel-invader${walk ? ' pixel-invader--walk' : ''}${live && ready ? ' is-live' : ''} ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      <div className="pixel-invader__box" ref={boxRef}>
        <svg className="pixel-invader__poster" viewBox={`-1 -1 ${W + 2} ${H + 2}`} aria-hidden="true">
          {OUTLINE.map(({ x, y }) => (
            <rect key={`o${x},${y}`} x={x - 0.01} y={y - 0.01} width="1.02" height="1.02" fill={palette.outline} />
          ))}
          {CELLS.filter((c) => c.kind !== 'eye').map(({ x, y, kind }) => (
            <rect
              key={`${x},${y}`}
              x={x + 0.015}
              y={y + 0.015}
              width="0.97"
              height="0.97"
              rx="0.05"
              fill={tileColor(kind, y, palette, mixHex)}
            />
          ))}
          {EYE_COLS.map(([x, y, rows]) => (
            <rect key={`e${x}`} x={x - 0.05} y={y} width="1.1" height={rows} rx="0.06" fill={palette.eye} />
          ))}
        </svg>
        {live && (
          <Suspense fallback={null}>
            <Scene
              palette={palette}
              running={onScreen}
              still={reducedMotion}
              motion={walk ? motion : undefined}
              onReady={() => setReady(true)}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default PixelInvader;
