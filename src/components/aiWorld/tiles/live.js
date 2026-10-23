import { f, q, qa, writer } from '../../servicePoster/usePosterEngine';
import { LOG } from './art';

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

export function NoCircle(svg, api) {
  const slash = writer(q(svg, 'slash'));
  return {
    tick(t) {
      const { x, h } = P(api);
      const deg = Math.sin(t * 0.9) * 6 * (1 - h) + x * 90 * h;
      slash(`rotate(${f(deg)} 200 200)`);
    },
  };
}

export function LongArrow(svg, api) {
  const line = writer(q(svg, 'line'), 'stroke-dashoffset');
  const head = writer(q(svg, 'head'));
  return {
    tick(t) {
      const { x, h } = P(api);
      // The line draws itself, holds, and draws again; the hand pulls the
      // head further along.
      const c = (t % 3.2) / 3.2;
      const drawn = c < 0.5 ? Math.min(1, c / 0.4) : 1;
      line(String(f(730 * (1 - drawn))));
      head(`translate(${f(x * 80 * h)} 0)`);
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
      agent(String(c > 0.4 && c < 0.55 ? 24 : 16));
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

export function Terminal(svg, api) {
  const lines = [...q(svg, 'log').querySelectorAll('path')].map((p) => writer(p, 'd'));
  const cur = writer(q(svg, 'cur'));
  const curOn = writer(q(svg, 'cur'), 'opacity');
  return {
    tick(t) {
      const { h } = P(api);
      // The log types itself in 6 s, rests, clears. The hand types faster.
      const period = 7 - 3 * h;
      const c = (t % period) / period;
      let endX = 70;
      let endY = 150;
      lines.forEach((w, i) => {
        const from = (i / LOG.length) * 0.75;
        const u = c < 0.95 ? Math.max(0, Math.min(1, (c - from) / 0.14)) : 0;
        const x2 = 70 + LOG[i] * u;
        w(`M70 ${150 + i * 50}H${f(x2)}`);
        if (u > 0) {
          endX = x2;
          endY = 150 + i * 50;
        }
      });
      cur(`translate(${f(endX + 14 - 470)} ${f(endY - 350)})`);
      curOn(Math.floor(t * 2) % 2 ? '1' : '0.25');
    },
  };
}

export function Switch(svg, api) {
  const knob = writer(q(svg, 'knob'), 'cx');
  const track = writer(q(svg, 'track'), 'fill');
  const state = q(svg, 'state');
  let on = 0;
  let lastT = 0;
  let shown = -1;
  return {
    tick(t) {
      const { x, h } = P(api);
      // It flips every 3 s on its own; the hand decides which side.
      const target = h > 0.5 ? (x > 0 ? 1 : 0) : Math.floor(t / 3) % 2;
      const dt = Math.min(0.05, t - lastT);
      lastT = t;
      on += (target - on) * Math.min(1, dt * 10);
      knob(String(f(180 + on * 440)));
      track(on > 0.5 ? LAVENDER : 'none');
      const s = on > 0.5 ? 1 : 0;
      if (s !== shown) {
        shown = s;
        state.textContent = s ? 'ON' : 'OFF';
      }
    },
  };
}

export function Trigger(svg, api) {
  const fill = writer(q(svg, 'bolt'), 'fill');
  const op = writer(q(svg, 'bolt'), 'opacity');
  return {
    tick(t) {
      const { h } = P(api);
      // It flickers like a pilot light; the hand lights it.
      const flick = 0.55 + 0.45 * Math.abs(Math.sin(t * 2.1) * Math.sin(t * 0.7));
      op(String(f(h > 0.5 ? 1 : flick)));
      fill(h > 0.5 ? LAVENDER : 'none');
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
