import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { detectMode } from '../servicePoster/usePosterEngine';

/* The favicon test (2026-10-22; redrawn 2026-10-25 for "Your brand"): a
   mark has to survive 16 pixels. The tile draws the symbol into an N x N
   canvas and blows it up with image-rendering: pixelated, so the viewer
   sees what a browser tab really gets. Under 32 px it draws the small cut
   (the wider door), the way the shipped favicon would be. It rests at 16;
   the pointer's x sets N while it is over the tile, and it settles back to
   16 when the pointer leaves (no idle motion, owner: "doing too much").
   SSR ships the SVG mark; the canvas paints over it after mount and is
   skipped under reduced motion. */
const MIN = 8;
const MAX = 72;
const REST = 16;
const ARCH = 'M14 90V48A36 36 0 0 1 86 48V90Z';
const DOOR = 'M39 90V63A11 11 0 0 1 61 63V90Z';
const DOOR_SMALL = 'M33 90V60A17 17 0 0 1 67 60V90Z';

// Cream on an ink plate, the mark at 72% and lifted, so the label under
// it never sits on the drawing.
function drawMark(ctx, n) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, n, n);
  ctx.fillStyle = '#141414';
  ctx.fillRect(0, 0, n, n);
  const k = (n / 100) * 0.72;
  ctx.setTransform(k, 0, 0, k, n * 0.14, n * 0.02);
  ctx.fillStyle = '#fef7ed';
  ctx.fill(new Path2D(`${ARCH}${n < 32 ? DOOR_SMALL : DOOR}`), 'evenodd');
}

export default function PixelTile() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const mode = detectMode();
    if (mode === 'static') return undefined;

    const ctx = canvas.getContext('2d');
    const state = { n: REST };
    let last = -1;
    let rect = null;
    const paint = (n) => {
      if (n === last) return;
      last = n;
      canvas.width = n;
      canvas.height = n;
      drawMark(ctx, n);
      if (labelRef.current) labelRef.current.textContent = `${n} px`;
    };
    paint(state.n);
    canvas.classList.add('is-live');

    const nTo = gsap.quickTo(state, 'n', { duration: 0.35, ease: 'power2.out' });
    let running = false;
    let stop = 0;
    const tick = () => paint(Math.round(state.n));
    const run = () => {
      if (!running) {
        running = true;
        gsap.ticker.add(tick);
      }
    };
    const halt = () => {
      if (running) {
        running = false;
        gsap.ticker.remove(tick);
      }
    };
    const onMove = (e) => {
      if (!rect) rect = wrap.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      nTo(MIN + x * (MAX - MIN));
    };
    // The ticker runs only while the pointer is over the tile and the
    // tween back to rest is settling.
    const onEnter = (e) => {
      clearTimeout(stop);
      rect = wrap.getBoundingClientRect();
      run();
      onMove(e);
    };
    const onLeave = () => {
      nTo(REST);
      clearTimeout(stop);
      stop = setTimeout(halt, 500);
    };
    if (mode === 'pointer') {
      wrap.addEventListener('pointerenter', onEnter, { passive: true });
      wrap.addEventListener('pointermove', onMove, { passive: true });
      wrap.addEventListener('pointerleave', onLeave, { passive: true });
    }
    return () => {
      halt();
      clearTimeout(stop);
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="bw-pixel">
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="bw-pixel__still">
        <rect width="100" height="100" className="bw-f-ink" />
        <path d={`${ARCH}${DOOR_SMALL}`} fillRule="evenodd" className="bw-f-cream" transform="translate(14 2) scale(0.72)" />
      </svg>
      <canvas ref={canvasRef} className="bw-pixel__canvas" width={REST} height={REST} aria-hidden="true" />
      <span className="bw-pixel__label">
        <span ref={labelRef}>{REST} px</span>
      </span>
    </div>
  );
}
