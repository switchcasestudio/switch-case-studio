import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import hasWebGL from '../../utils/hasWebGL';
import useReducedMotion from '../../hooks/useReducedMotion';
import { FRAME_A, FRAME_B, cellsOf } from './pixelInvaderGrid';

import '../../styles/components/pixelInvader.scss';

/* PixelInvader (2026-11-05): the 👾 emoji as voxels, our own 11×8 drawing.
   The SVG below IS the poster (static HTML, no WebGL, reduced motion): the
   three.js scene mounts over it only once WebGL is confirmed and the box is
   near the viewport, and its module (three + fiber) loads only then. */
const FRAMES = [FRAME_A, FRAME_B];
const Scene = lazy(() => import('./PixelInvaderScene'));

const PixelInvader = ({ color = '#d99cff', className = '', label = 'Pixel space invader' }) => {
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
      style={{ '--pi-color': color }}
    >
      <svg className="pixel-invader__poster" viewBox="0 0 11 8" aria-hidden="true">
        {cellsOf(FRAME_A).map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x + 0.04} y={y + 0.04} width="0.92" height="0.92" />
        ))}
      </svg>
      {live && (
        <Suspense fallback={null}>
          <Scene color={color} running={onScreen} still={reducedMotion} frames={FRAMES} onReady={() => setReady(true)} />
        </Suspense>
      )}
    </div>
  );
};

export default PixelInvader;
