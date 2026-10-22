import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { detectMode } from '../servicePoster/usePosterEngine';

/* The favicon test (2026-10-22): a mark has to survive 16 pixels. This tile
   draws the Hatch mark into an N×N canvas and blows it up with
   image-rendering: pixelated, so the viewer watches it fall apart and come
   back. Idle: N breathes between 10 and 64; the pointer's x sets N directly;
   the label reads the live size. SSR ships the SVG mark; the canvas paints
   over it after mount and is skipped under reduced motion. */
const MIN = 8;
const MAX = 72;

function drawMark(ctx, n) {
  const u = n / 400; // design units: the 400-box the SVG tiles use
  ctx.clearRect(0, 0, n, n);
  ctx.fillStyle = '#fef7ed';
  ctx.fillRect(0, 0, n, n);
  ctx.fillStyle = '#141414';
  ctx.beginPath();
  ctx.arc(200 * u, 200 * u, 150 * u, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef7ed';
  ctx.fillRect(118 * u, 110 * u, 34 * u, 180 * u);
  ctx.fillRect(248 * u, 110 * u, 34 * u, 180 * u);
  ctx.strokeStyle = '#fef7ed';
  ctx.lineWidth = Math.max(1, 7 * u);
  for (let i = 0; i < 4; i += 1) {
    const y = (176 + i * 14) * u;
    ctx.beginPath();
    ctx.moveTo(152 * u, y);
    ctx.lineTo(248 * u, y);
    ctx.stroke();
  }
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
    const state = { n: 24, target: 24, hover: 0 };
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
    const tick = (time) => {
      if (state.hover < 0.5) {
        // Idle: a slow breath between MIN and MAX.
        const t = time / 1000;
        nTo(MIN + ((Math.sin(t * 0.6) + 1) / 2) * (MAX - MIN));
      }
      paint(Math.round(state.n));
    };
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
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio >= 0.15 ? run() : halt()), { threshold: [0, 0.15] });
    io.observe(wrap);

    const onMove = (e) => {
      if (!rect) rect = wrap.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      nTo(MIN + x * (MAX - MIN));
    };
    const onEnter = (e) => {
      rect = wrap.getBoundingClientRect();
      state.hover = 1;
      onMove(e);
    };
    const onLeave = () => {
      state.hover = 0;
    };
    if (mode === 'pointer') {
      wrap.addEventListener('pointerenter', onEnter, { passive: true });
      wrap.addEventListener('pointermove', onMove, { passive: true });
      wrap.addEventListener('pointerleave', onLeave, { passive: true });
    }
    return () => {
      halt();
      io.disconnect();
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="bw-pixel">
      <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false" className="bw-pixel__still">
        <rect width="400" height="400" className="bw-f-cream" />
        <circle cx="200" cy="200" r="150" className="bw-f-ink" />
        <rect x="118" y="110" width="34" height="180" className="bw-f-cream" />
        <rect x="248" y="110" width="34" height="180" className="bw-f-cream" />
        <path d="M152 176H248M152 190H248M152 204H248M152 218H248" className="bw-s-cream" strokeWidth="7" />
      </svg>
      <canvas ref={canvasRef} className="bw-pixel__canvas" width="24" height="24" aria-hidden="true" />
      <span className="bw-pixel__label">
        <span ref={labelRef}>24 px</span>
      </span>
    </div>
  );
}
