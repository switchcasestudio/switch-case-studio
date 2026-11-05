import { useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CELLS, OUTLINE, W, H, tileColor } from './pixelInvaderGrid';

/* The three.js half of PixelInvader: rounded glowing tiles on a dark outline
   set back behind them, eyes as one glossy dark capsule each (with a shine) that blink and look toward
   the pointer, a bob, a violet glow behind, and a
   soft shadow under it. `running` false stops the render loop, `still`
   holds one pose. */
const TILE = 0.94;
const cx = (x) => x - (W - 1) / 2;
const cy = (y) => (H - 1) / 2 - y;
const mixColor = (a, b, t) => `#${new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString()}`;

function radialTexture(inner, outer) {
  const s = 128;
  const cv = document.createElement('canvas');
  cv.width = s;
  cv.height = s;
  const g = cv.getContext('2d');
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// One InstancedMesh of tiles at grid cells, each with its own color.
function Tiles({ cells, geometry, material, z = 0, colorOf, meshRef }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    cells.forEach((cell, i) => {
      m.makeTranslation(cx(cell.x), cy(cell.y), z);
      ref.current.setMatrixAt(i, m);
      if (colorOf) ref.current.setColorAt(i, c.set(colorOf(cell)));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    if (meshRef) meshRef.current = ref.current;
  }, [cells, z, colorOf, meshRef]);
  return <instancedMesh ref={ref} args={[geometry, material, cells.length]} />;
}

function Invader({ palette, still }) {
  const group = useRef(null);
  const body = useRef(null);
  const eyes = useRef(null);
  const glow = useRef(null);
  const shadow = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  const parts = useMemo(() => {
    const bodyCells = CELLS.filter((c) => c.kind === 'body' || c.kind === 'highlight');
    const eyeCells = CELLS.filter((c) => c.kind === 'eye');
    // Each eye column becomes one tall rounded shape: [centerX, centerY, rows].
    const cols = [...new Set(eyeCells.map((c) => c.x))];
    const eyeShapes = cols.map((x) => {
      const ys = eyeCells.filter((c) => c.x === x).map((c) => c.y);
      return [cx(x), (cy(Math.min(...ys)) + cy(Math.max(...ys))) / 2, ys.length];
    });
    return { bodyCells, eyeShapes };
  }, []);

  const res = useMemo(() => {
    const tile = new RoundedBoxGeometry(TILE, TILE, 0.9, 4, 0.16);
    const back = new RoundedBoxGeometry(1.06, 1.06, 0.7, 2, 0.06);
    const eyeGeo = new RoundedBoxGeometry(1.1, 2.9, 0.6, 6, 0.42);
    const shine = new THREE.SphereGeometry(0.17, 16, 12);
    const shineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const glowTile = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0,
      emissive: new THREE.Color(palette.bottom),
      emissiveIntensity: 0.35,
    });
    const outline = new THREE.MeshStandardMaterial({ color: palette.outline, roughness: 0.8 });
    const eye = new THREE.MeshPhysicalMaterial({
      color: palette.eye,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const glowTex = radialTexture('rgba(150,90,255,0.55)', 'rgba(150,90,255,0)');
    const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false });
    const shadowTex = radialTexture('rgba(10,5,25,0.6)', 'rgba(10,5,25,0)');
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    return { tile, back, eyeGeo, shine, shineMat, glowTile, outline, eye, glowTex, glowMat, shadowTex, shadowMat };
  }, [palette]);

  useLayoutEffect(() => () => Object.values(res).forEach((r) => r.dispose?.()), [res]);

  const colorOf = useMemo(() => (cell) => tileColor(cell.kind, cell.y, palette, mixColor), [palette]);

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
    const t = still ? 0.4 : clock.elapsedTime;
    const px = still ? -0.45 : pointer.current.x;
    const py = still ? -0.25 : pointer.current.y;
    const k = still ? 1 : 1 - Math.exp(-dt * 5);

    g.rotation.x += (py * 0.4 - 0.08 - g.rotation.x) * k;
    g.rotation.y += (px * 0.6 + Math.sin(t * 0.7) * 0.1 - g.rotation.y) * k;

    const bob = Math.sin(t * 2.2);
    body.current.position.y = bob * 0.25;

    // Eyes glance toward the pointer and blink every few seconds.
    const cycle = t % 3.8;
    const blink = cycle > 3.6 ? Math.abs(Math.cos(((cycle - 3.6) / 0.2) * Math.PI)) : 1;
    if (eyes.current) {
      eyes.current.position.x = px * 0.14;
      eyes.current.position.y = -py * 0.1;
      eyes.current.scale.y = Math.max(0.12, blink);
    }

    glow.current.material.opacity = 0.85 + Math.sin(t * 1.4) * 0.15;
    const s = 1 - bob * 0.06;
    shadow.current.scale.set(14 * s, 2.2 * s, 1);
    shadow.current.material.opacity = 0.8 - bob * 0.15;
  });

  // Eyes blink around their own center, so they live in a group there.
  const eyeY = parts.eyeShapes[0][1];

  return (
    <>
      <mesh ref={glow} position={[0, 0.6, -2]} scale={[22, 20, 1]} material={res.glowMat}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={group}>
        <group ref={body}>
          <Tiles cells={OUTLINE} geometry={res.back} material={res.outline} z={-0.3} />
          <Tiles cells={parts.bodyCells} geometry={res.tile} material={res.glowTile} colorOf={colorOf} />
          <group position={[0, eyeY, 0]}>
            <group ref={eyes}>
              <group position={[0, -eyeY, 0]}>
                {parts.eyeShapes.map(([x, y]) => (
                  <group key={x} position={[x, y, 0.05]}>
                    <mesh geometry={res.eyeGeo} material={res.eye} />
                    <mesh geometry={res.shine} material={res.shineMat} position={[0.2, 0.85, 0.3]} scale={[1, 1.3, 0.4]} />
                  </group>
                ))}
              </group>
            </group>
          </group>
        </group>
      </group>
      <mesh ref={shadow} position={[0, -8.6, -1]} rotation={[-Math.PI / 2.3, 0, 0]} material={res.shadowMat}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
}

export default function PixelInvaderScene({ palette, running, still, onReady }) {
  return (
    <Canvas
      className="pixel-invader__canvas"
      frameloop={running ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, -0.4, 26], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <hemisphereLight args={['#f4eeff', '#2b1a5c', 1.3]} />
      <directionalLight position={[-4, 8, 10]} intensity={2.2} />
      <directionalLight position={[7, -2, 4]} intensity={0.7} color="#c7a8ff" />
      <Invader palette={palette} still={still} />
    </Canvas>
  );
}
