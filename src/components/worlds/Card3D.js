import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* A card in three dimensions (2026-10-22). The card floats and tilts to
   the pointer; a click flips it. House rules for a per-frame loop: the
   canvas mounts only after hydration (SSR shows the `Still` SVG of the same
   card), only while on screen (IntersectionObserver), never under reduced
   motion, and the loop reads the pointer from a ref, no React state. This
   module pulls in three + fiber, so every world lazy-loads it.
   Shared by the worlds: `front`/`back` paint the two faces on a canvas
   (ctx, w, h), `edge` is the paper's edge color, `Still` the SSR drawing. */

const W = 3.5;
const H = 2;

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

function Card({ pointer, flip, paintFront, paintBack, edgeColor }) {
  const group = useRef(null);
  const [front, back] = useMemo(() => [makeTexture(paintFront), makeTexture(paintBack)], [paintFront, paintBack]);
  // Unlit materials: the card is a flat plate, the page's own rule, so the
  // printed colors stay exactly the brand's under any angle.
  const edge = useMemo(() => new THREE.MeshBasicMaterial({ color: edgeColor }), [edgeColor]);
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

export default function Card3D({ front, back, edge = '#d9cfbf', Still, label, hint = 'Click to turn it over' }) {
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
    <div ref={wrapRef} className={`bw-card3d${live ? ' is-live' : ''}`} role="img" aria-label={label}>
      <Still />
      {live && (
        <Canvas className="bw-card3d__canvas" dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
          <Card pointer={pointer} flip={flip} paintFront={front} paintBack={back} edgeColor={edge} />
        </Canvas>
      )}
      <span className="bw-card3d__hint">{hint}</span>
    </div>
  );
}
