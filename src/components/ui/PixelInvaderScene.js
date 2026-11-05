import { useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cellsOf } from './pixelInvaderGrid';

/* The three.js half of PixelInvader. Cells both frames share are one
   InstancedMesh; each frame's own cells are another, toggled to swap legs.
   The model tilts toward the pointer (anywhere on the page), bobs, and
   steps; `running` false stops the render loop, `still` holds one pose. */
const W = 11;
const H = 8;
const GAP = 0.9;
const STEP_S = 0.5;
const box = new THREE.BoxGeometry(GAP, GAP, GAP);

const key = ([x, y]) => `${x},${y}`;

function Cells({ cells, material, visibleRef }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    cells.forEach(([x, y], i) => {
      m.makeTranslation(x - (W - 1) / 2, (H - 1) / 2 - y, 0);
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (visibleRef) visibleRef.current = ref.current;
  }, [cells, visibleRef]);
  return <instancedMesh ref={ref} args={[box, material, cells.length]} />;
}

function Invader({ color, frames, still }) {
  const group = useRef(null);
  const legA = useRef(null);
  const legB = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { shared, onlyA, onlyB } = useMemo(() => {
    const a = cellsOf(frames[0]);
    const b = cellsOf(frames[1]);
    const inB = new Set(b.map(key));
    const inA = new Set(a.map(key));
    return {
      shared: a.filter((c) => inB.has(key(c))),
      onlyA: a.filter((c) => !inB.has(key(c))),
      onlyB: b.filter((c) => !inA.has(key(c))),
    };
  }, [frames]);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.1 }),
    [color],
  );
  useLayoutEffect(() => () => material.dispose(), [material]);

  useLayoutEffect(() => {
    const move = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    if (still) {
      g.rotation.set(-0.15, -0.45, 0);
      if (legA.current) legA.current.visible = true;
      if (legB.current) legB.current.visible = false;
      return;
    }
    // Idle sway when the pointer rests near center, pointer tilt otherwise.
    const tx = pointer.current.y * 0.45 - 0.12;
    const ty = pointer.current.x * 0.7 + Math.sin(t * 0.6) * 0.25;
    const k = 1 - Math.exp(-dt * 4);
    g.rotation.x += (tx - g.rotation.x) * k;
    g.rotation.y += (ty - g.rotation.y) * k;
    g.position.y = Math.sin(t * 1.6) * 0.25;
    const stepA = Math.floor(t / STEP_S) % 2 === 0;
    if (legA.current) legA.current.visible = stepA;
    if (legB.current) legB.current.visible = !stepA;
  });

  return (
    <group ref={group}>
      <Cells cells={shared} material={material} />
      <Cells cells={onlyA} material={material} visibleRef={legA} />
      <Cells cells={onlyB} material={material} visibleRef={legB} />
    </group>
  );
}

export default function PixelInvaderScene({ color, running, still, frames, onReady }) {
  return (
    <Canvas
      className="pixel-invader__canvas"
      frameloop={running ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 16], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} />
      <directionalLight position={[-6, -2, 4]} intensity={0.6} color="#f0d7ff" />
      <Invader color={color} frames={frames} still={still} />
    </Canvas>
  );
}
