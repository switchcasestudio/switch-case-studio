import { f, q, qa, writer } from '../../servicePoster/usePosterEngine';

/* Live behavior for the AI world's drawings (2026-10-22), one
   `create(svg, api)` per art, run by the house poster engine
   (usePosterEngine): pointer mode on a fine pointer, ambient on touch,
   static under reduced motion. The engine gives `api.pointer` (−0.5…0.5,
   lerped), `api.hover.v` (0…1) and a clock; each tick writes SVG
   attributes through `writer`, which skips unchanged values. The SSR
   drawing is the rest state. The rule for this page: every drawing is a
   machine that runs on its own and runs faster, or differently, under the
   hand. */

const P = (api) => ({ x: api.pointer.x, y: api.pointer.y, h: api.hover.v });
const LAVENDER = '#dab8ff';
const INK = '#141414';

export function AgentA(svg, api) {
  const a = writer(q(svg, 'a'));
  return {
    tick(t) {
      const { x, y, h } = P(api);
      // Idle: it breathes; hover: it leans toward the hand.
      const bob = Math.sin(t * 1.3) * 5 * (1 - h);
      a(`translate(${f(x * 36 * h)} ${f(bob - y * 40 * h)}) skewX(${f(-x * 12 * h)})`);
    },
  };
}

export function QueueBox(svg, api) {
  const lines = writer(q(svg, 'lines'));
  const step = 352 / 7;
  let pos = 0;
  let last = 0;
  return {
    tick(t) {
      const { y, h } = P(api);
      // The log scrolls up on its own; the hand's height sets the pace.
      const speed = 22 + (0.5 - y) * 120 * h;
      pos += speed * Math.max(0, Math.min(0.05, t - last));
      last = t;
      lines(`translate(0 ${f(-(pos % step))})`);
    },
  };
}

export function RunPill(svg, api) {
  const pill = writer(q(svg, 'pill'), 'fill');
  const txt = writer(q(svg, 'txt'), 'fill');
  const runner = writer(q(svg, 'runner'), 'stroke-dashoffset');
  return {
    tick(t) {
      const { h } = P(api);
      // A short dash circles the pill forever; the hand fills it in.
      runner(String(f(-((t * 420) % 1890))));
      pill(h > 0.5 ? LAVENDER : 'none');
      txt(h > 0.5 ? INK : 'currentColor');
    },
  };
}

export function Clock(svg, api) {
  const hour = writer(q(svg, 'hour'));
  const min = writer(q(svg, 'min'));
  return {
    tick(t) {
      const { x, h } = P(api);
      // A minute hand turn every 8 s; the hand winds it.
      const m = (t / 8) * 360 + x * 180 * h;
      min(`rotate(${f(m)} 200 190)`);
      hour(`rotate(${f(90 + m / 12)} 200 190)`);
    },
  };
}

// A packet along SVG paths, by path length: no plugin, no React state.
function runner(paths) {
  const lens = paths.map((p) => (p ? p.getTotalLength() : 0));
  return (i, u) => {
    const p = paths[i];
    if (!p) return null;
    return p.getPointAtLength(lens[i] * Math.max(0, Math.min(1, u)));
  };
}

export function NodeGraph(svg, api) {
  const at = runner([q(svg, 'win'), q(svg, 'w0'), q(svg, 'w1'), q(svg, 'w2')]);
  const pkt = writer(q(svg, 'pkt'));
  const agent = writer(q(svg, 'agent'), 'stroke-width');
  return {
    tick(t) {
      const { h } = P(api);
      // One packet per 2.4 s at rest, one per second under the hand; the
      // output alternates so every wire gets used.
      const period = 2.4 - 1.4 * h;
      const n = Math.floor(t / period);
      const c = (t % period) / period;
      let pt;
      if (c < 0.4) pt = at(0, c / 0.4);
      else if (c < 0.55) pt = at(0, 1);
      else pt = at(1 + (n % 3), (c - 0.55) / 0.45);
      if (pt) pkt(`translate(${f(pt.x - 100)} ${f(pt.y - 200)})`);
      agent(String(c > 0.4 && c < 0.55 ? 11 : 7));
    },
  };
}

export function ChatCard(svg, api) {
  const b2 = writer(q(svg, 'b2'));
  const dots = [...q(svg, 'dots').querySelectorAll('circle')].map((c) => writer(c));
  return {
    tick(t) {
      const { h } = P(api);
      dots.forEach((w, i) => w(`translate(0 ${f(Math.sin(t * 6 - i * 0.9) * 6)})`));
      b2(`translate(${f(-245 * 0.08 * h)} ${f(-205 * 0.08 * h)}) scale(${f(1 + 0.08 * h)})`);
    },
  };
}

export function Stack(svg, api) {
  const layers = qa(svg, 'layer').map((el, i) => ({ w: writer(el), d: 4 - i }));
  const top = writer(q(svg, 'top'));
  return {
    tick(t) {
      const { x, y, h } = P(api);
      // Idle: a slow wobble; hover: the stack fans out toward the hand.
      const ox = Math.sin(t * 0.9) * 2 * (1 - h) + x * 30 * h;
      const oy = Math.cos(t * 0.7) * 2 * (1 - h) - y * 30 * h;
      layers.forEach((l) => l.w(`translate(${f(l.d * 14 + ox * l.d)} ${f(-l.d * 14 + oy * l.d)})`));
      top(`translate(${f(-ox * 0.6)} ${f(-oy * 0.6)})`);
    },
  };
}

export function Envelope(svg, api) {
  const flap = writer(q(svg, 'flap'), 'd');
  return {
    tick(t) {
      const { h } = P(api);
      const lift = Math.sin(t * 1.1) * 8 * (1 - h) + 230 * h;
      flap(`M40 92L200 ${f(206 - lift)}L360 92`);
    },
  };
}
