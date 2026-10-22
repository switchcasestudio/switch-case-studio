import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* A business card in three dimensions (2026-10-22). Front: the Hatch mark
   on cream; back: ink with the contact lines. The card floats and tilts to
   the pointer; a click flips it. House rules for a per-frame loop: the
   canvas mounts only after hydration (SSR shows a flat SVG of the same
   card), only while on screen (IntersectionObserver), never under reduced
   motion, and the loop reads the pointer from a ref, no React state. This
   module pulls in three + fiber, so Collage lazy-loads it. */

const W = 3.5;
const H = 2;

function paintFront(ctx, w, h) {
  ctx.fillStyle = '#fef7ed';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#141414';
  ctx.beginPath();
  ctx.arc(w * 0.26, h * 0.5, h * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef7ed';
  const bx = w * 0.26;
  const by = h * 0.5;
  ctx.fillRect(bx - h * 0.17, by - h * 0.18, h * 0.07, h * 0.36);
  ctx.fillRect(bx + h * 0.1, by - h * 0.18, h * 0.07, h * 0.36);
  ctx.lineWidth = h * 0.014;
  ctx.strokeStyle = '#fef7ed';
  for (let i = 0; i < 4; i += 1) {
    const y = by - h * 0.05 + i * h * 0.03;
    ctx.beginPath();
    ctx.moveTo(bx - h * 0.1, y);
    ctx.lineTo(bx + h * 0.1, y);
    ctx.stroke();
  }
  ctx.fillStyle = '#141414';
  ctx.font = `700 ${h * 0.16}px Inter, sans-serif`;
  ctx.fillText('Hatch', w * 0.52, h * 0.48);
  ctx.font = `500 ${h * 0.065}px Inter, sans-serif`;
  ctx.fillText('CERAMICS, PORTLAND', w * 0.52, h * 0.6);
}

function paintBack(ctx, w, h) {
  ctx.fillStyle = '#141414';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff834a';
  ctx.fillRect(0, 0, w, h * 0.12);
  ctx.fillStyle = '#fef7ed';
  ctx.font = `700 ${h * 0.11}px Inter, sans-serif`;
  ctx.fillText('Mara Osei', w * 0.08, h * 0.42);
  ctx.font = `500 ${h * 0.065}px Inter, sans-serif`;
  ctx.fillText('Studio lead', w * 0.08, h * 0.54);
  ctx.fillStyle = '#dab8ff';
  ctx.fillText('hatchceramics.example', w * 0.08, h * 0.78);
  ctx.fillText('503 000 0000', w * 0.08, h * 0.88);
}

function makeTexture(paint) {
  const c = document.createElement('canvas');
  c.width = 1050;
  c.height = 600;
  paint(c.getContext('2d'), c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Card({ pointer, flip }) {
  const group = useRef(null);
  const [front, back] = useMemo(() => [makeTexture(paintFront), makeTexture(paintBack)], []);
  // Unlit materials: the card is a flat plate, the page's own rule, so the
  // printed colors stay exactly the brand's under any angle.
  const edge = useMemo(() => new THREE.MeshBasicMaterial({ color: '#d9cfbf' }), []);
  const mats = useMemo(
    () => [edge, edge, edge, edge, new THREE.MeshBasicMaterial({ map: front }), new THREE.MeshBasicMaterial({ map: back })],
    [front, back, edge],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = pointer.current;
    const targetX = -p.y * 0.6 + Math.sin(t * 0.7) * 0.06;
    const targetY = p.x * 0.9 + Math.cos(t * 0.5) * 0.08 + (flip.current ? Math.PI : 0);
    g.rotation.x += (targetX - g.rotation.x) * 0.08;
    g.rotation.y += (targetY - g.rotation.y) * 0.08;
    g.position.y = Math.sin(t * 0.9) * 0.05;
  });

  return (
    <group ref={group}>
      <mesh material={mats} castShadow>
        <boxGeometry args={[W, H, 0.04]} />
      </mesh>
    </group>
  );
}

export default function Card3D() {
  const wrapRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const flip = useRef(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !window.matchMedia) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(([e]) => setLive(e.intersectionRatio >= 0.15), { threshold: [0, 0.15] });
    io.observe(wrap);
    let rect = null;
    const onMove = (e) => {
      if (!rect) rect = wrap.getBoundingClientRect();
      pointer.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.current.y = (e.clientY - rect.top) / rect.height - 0.5;
    };
    const onEnter = () => {
      rect = wrap.getBoundingClientRect();
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };
    const onClick = () => {
      flip.current = !flip.current;
    };
    wrap.addEventListener('pointerenter', onEnter, { passive: true });
    wrap.addEventListener('pointermove', onMove, { passive: true });
    wrap.addEventListener('pointerleave', onLeave, { passive: true });
    wrap.addEventListener('click', onClick);
    return () => {
      io.disconnect();
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`bw-card3d${live ? ' is-live' : ''}`} role="img" aria-label="A Hatch Ceramics business card, front and back">
      <svg viewBox="0 0 700 400" aria-hidden="true" focusable="false" className="bw-card3d__still">
        <rect width="700" height="400" className="bw-f-ink" />
        <rect x="87" y="80" width="525" height="300" rx="10" className="bw-f-cream" transform="rotate(-6 350 230)" />
        <circle cx="230" cy="230" r="80" className="bw-f-ink" transform="rotate(-6 350 230)" />
        <text x="330" y="246" className="bw-f-ink" fontFamily="Inter, sans-serif" fontSize="48" fontWeight="700" transform="rotate(-6 350 230)">
          Hatch
        </text>
      </svg>
      {live && (
        <Canvas className="bw-card3d__canvas" dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
          <Card pointer={pointer} flip={flip} />
        </Canvas>
      )}
      <span className="bw-card3d__hint">Click to turn it over</span>
    </div>
  );
}
