import { useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CELLS, OUTLINE, W, H, tileColor } from './pixelInvaderGrid';

/* The three.js half of PixelInvader: rounded glowing tiles on a dark outline
   set back behind them, eyes as one dark pixel column each (with a square shine) that blink and look toward
   the pointer, feet that shuffle like a crab under a swaying body, a violet glow behind, and a
   soft shadow under it. `running` false stops the render loop, `still`
   holds one pose. */
const TILE = 0.97;
const FOOT_ROW = 12;
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
  const feet = useRef([]);
  const glow = useRef(null);
  const shadow = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  const parts = useMemo(() => {
    const tiles = CELLS.filter((c) => c.kind === 'body' || c.kind === 'highlight');
    // The feet (from FOOT_ROW down) step on their own, left and right.
    const isFoot = (c) => c.y >= FOOT_ROW;
    const left = (c) => c.x < W / 2;
    const bodyCells = tiles.filter((c) => !isFoot(c));
    const bodyOutline = OUTLINE.filter((c) => !isFoot(c));
    const footParts = [true, false].map((side) => ({
      cells: tiles.filter((c) => isFoot(c) && left(c) === side),
      outline: OUTLINE.filter((c) => isFoot(c) && left(c) === side),
    }));
    const eyeCells = CELLS.filter((c) => c.kind === 'eye');
    // Each eye column becomes one tall rounded shape: [centerX, centerY, rows].
    const cols = [...new Set(eyeCells.map((c) => c.x))];
    const eyeShapes = cols.map((x) => {
      const ys = eyeCells.filter((c) => c.x === x).map((c) => c.y);
      return [cx(x), (cy(Math.min(...ys)) + cy(Math.max(...ys))) / 2, ys.length];
    });
    return { bodyCells, bodyOutline, footParts, eyeShapes };
  }, []);

  const res = useMemo(() => {
    const tile = new RoundedBoxGeometry(TILE, TILE, 0.3, 2, 0.05);
    const back = new RoundedBoxGeometry(1.02, 1.02, 0.24, 1, 0.02);
    const eyeGeo = new RoundedBoxGeometry(1.0, 3.0, 0.26, 2, 0.06);
    const shine = new THREE.PlaneGeometry(0.32, 0.32);
    const shineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const glowTile = new THREE.MeshStandardMaterial({
      roughness: 0.75,
      metalness: 0,
      emissive: new THREE.Color(palette.bottom),
      emissiveIntensity: 0.3,
    });
    const outline = new THREE.MeshStandardMaterial({ color: palette.outline, roughness: 0.8 });
    const eye = new THREE.MeshPhysicalMaterial({
      color: palette.eye,
      roughness: 0.6,
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

    g.rotation.x += (py * 0.22 - 0.04 - g.rotation.x) * k;
    g.rotation.y += (px * 0.32 + Math.sin(t * 0.7) * 0.06 - g.rotation.y) * k;

    // Crab shuffle: the feet take turns sliding out and lifting, the body
    // sways over whichever foot is planted and bounces once per step.
    const w = 5;
    const step = Math.sin(t * w);
    feet.current.forEach((f, i) => {
      if (!f) return;
      const ph = t * w + (i === 0 ? 0 : Math.PI);
      f.position.x = Math.sin(ph) * 0.45;
      f.position.y = Math.max(0, Math.cos(ph)) * 0.4;
    });
    const bob = Math.abs(step);
    body.current.position.x = step * 0.32;
    body.current.position.y = bob * 0.14;
    body.current.rotation.z = -step * 0.045;

    // Eyes glance toward the pointer and blink every few seconds.
    const cycle = t % 3.8;
    const blink = cycle > 3.6 ? Math.abs(Math.cos(((cycle - 3.6) / 0.2) * Math.PI)) : 1;
    if (eyes.current) {
      eyes.current.position.x = px * 0.14;
      eyes.current.position.y = -py * 0.1;
      eyes.current.scale.y = Math.max(0.12, blink);
    }

    glow.current.material.opacity = 0.85 + Math.sin(t * 1.4) * 0.15;
    const s = 1 - bob * 0.04;
    shadow.current.scale.set(14 * s, 2.2 * s, 1);
    shadow.current.position.x = step * 0.3;
    shadow.current.material.opacity = 0.8 - bob * 0.1;
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
          <Tiles cells={parts.bodyOutline} geometry={res.back} material={res.outline} z={-0.14} />
          <Tiles cells={parts.bodyCells} geometry={res.tile} material={res.glowTile} colorOf={colorOf} />
          <group position={[0, eyeY, 0]}>
            <group ref={eyes}>
              <group position={[0, -eyeY, 0]}>
                {parts.eyeShapes.map(([x, y]) => (
                  <group key={x} position={[x, y, 0.05]}>
                    <mesh geometry={res.eyeGeo} material={res.eye} />
                    <mesh geometry={res.shine} material={res.shineMat} position={[0.18, 1.05, 0.14]} />
                  </group>
                ))}
              </group>
            </group>
          </group>
        </group>
        {parts.footParts.map((foot, i) => (
          <group
            key={i}
            ref={(g) => {
              feet.current[i] = g;
            }}
          >
            <Tiles cells={foot.outline} geometry={res.back} material={res.outline} z={-0.14} />
            <Tiles cells={foot.cells} geometry={res.tile} material={res.glowTile} colorOf={colorOf} />
          </group>
        ))}
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
      <hemisphereLight args={['#ffffff', '#6a55a8', 2.2]} />
      <directionalLight position={[-2, 4, 12]} intensity={0.9} />
      <directionalLight position={[7, -2, 4]} intensity={0.3} color="#c7a8ff" />
      <Invader palette={palette} still={still} />
    </Canvas>
  );
}
