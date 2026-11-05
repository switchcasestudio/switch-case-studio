import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import hasWebGL from '../../utils/hasWebGL';
import useReducedMotion from '../../hooks/useReducedMotion';
import { CELLS, OUTLINE, W, H, PALETTE, tileColor, mixHex } from './pixelInvaderGrid';

import '../../styles/components/pixelInvader.scss';

/* PixelInvader (2026-11-05): the 👾 emoji as glowing 3D pixel tiles. The SVG
   below IS the poster (static HTML, no WebGL): the three.js scene mounts over
   it only once WebGL is confirmed and the box is near the viewport, and its
   module (three + fiber) loads only then. Reduced motion holds one pose. */
// Each eye column as one tall shape: [x, topY, rows].
const EYE_COLS = [...new Set(CELLS.filter((c) => c.kind === 'eye').map((c) => c.x))].map((x) => {
  const ys = CELLS.filter((c) => c.kind === 'eye' && c.x === x).map((c) => c.y);
  return [x, Math.min(...ys), ys.length];
});
const Scene = lazy(() => import('./PixelInvaderScene'));

const PixelInvader = ({ palette = PALETTE, className = '', label = 'Space invader' }) => {
  const rootRef = useRef(null);
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

  const live = webgl && near;

  return (
    <div
      ref={rootRef}
      className={`pixel-invader${live && ready ? ' is-live' : ''} ${className}`.trim()}
      role="img"
      aria-label={label}
    >
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
          <Scene palette={palette} running={onScreen} still={reducedMotion} onReady={() => setReady(true)} />
        </Suspense>
      )}
    </div>
  );
};

export default PixelInvader;
