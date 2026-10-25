import { f, q, qa, writer } from '../../servicePoster/usePosterEngine';
import { CRAWL, CLICKS } from './art';

/* Live behavior for the SEO & AI Search world's drawings (2026-10-24), one
   `create(svg, api)` per art, run by the house poster engine
   (usePosterEngine): pointer mode on a fine pointer, ambient on touch,
   static under reduced motion. `api.pointer` (-0.5..0.5, lerped),
   `api.hover.v` (0..1) and a clock; each tick writes SVG attributes through
   `writer`, which skips unchanged values. The AI world's rule holds: every
   drawing is a machine that runs on its own and runs faster, or
   differently, under the hand. */

const P = (api) => ({ x: api.pointer.x, y: api.pointer.y, h: api.hover.v });
const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
const lerp = (a, b, u) => a + (b - a) * u;

export function Crawl(svg, api) {
  const lens = writer(q(svg, 'lens'));
  const ticks = qa(svg, 'tick').map((el) => writer(el, 'opacity'));
  const order = [0, 1, 4, 5, 2, 6, 3, 7, 8];
  const hop = 0.75;
  return {
    tick(t) {
      const { x, y, h } = P(api);
      // The lens walks the pages in crawl order and ticks each one; a full
      // pass, a breath, again. Under the hand it follows the hand instead.
      const cycle = order.length * hop + 1.5;
      const c = t % cycle;
      const i = Math.min(order.length - 1, Math.floor(c / hop));
      const u = ease(Math.min(1, (c - i * hop) / (hop * 0.6)));
      const a = CRAWL[order[Math.max(0, i - 1)]];
      const b = CRAWL[order[i]];
      const wx = i === 0 ? b.x : lerp(a.x, b.x, u);
      const wy = i === 0 ? b.y : lerp(a.y, b.y, u);
      const px = 300 + x * 560;
      const py = 200 + y * 360;
      lens(`translate(${f(lerp(wx, px, h))} ${f(lerp(wy, py, h))})`);
      const done = c > order.length * hop ? order.length : i;
      order.forEach((n, k) => ticks[n](k < done || (k === i && u > 0.9) ? '1' : '0'));
    },
  };
}

export function Checklist(svg) {
  const checks = qa(svg, 'check').map((el) => writer(el, 'opacity'));
  return {
    tick(t) {
      const n = Math.floor((t % 6) / 1.1);
      checks.forEach((w, i) => w(i < n ? '1' : '0'));
    },
  };
}

export function AnswerCard(svg, api) {
  const lines = qa(svg, 'ln').map((el) => writer(el, 'stroke-dashoffset'));
  const chip = writer(q(svg, 'chip'));
  return {
    tick(t) {
      const { h } = P(api);
      // The answer writes line by line, then the citation lands; the hand
      // makes it write faster.
      const period = 4.5 - 2 * h;
      const c = (t % period) / period;
      lines.forEach((w, i) => w(String(f(1 - Math.max(0, Math.min(1, (c - i * 0.2) / 0.2))))));
      const pop = c > 0.62 ? Math.min(1, (c - 0.62) / 0.08) : 0;
      const s = 1 + 0.08 * Math.sin(pop * Math.PI);
      chip(`translate(${f(145 - 145 * s)} ${f(182 - 182 * s)}) scale(${f(s)})`);
    },
  };
}

export function Braces(svg, api) {
  const bl = writer(q(svg, 'bl'));
  const br = writer(q(svg, 'br'));
  const kv = qa(svg, 'kv').map((el) => writer(el));
  return {
    tick(t) {
      const { h } = P(api);
      const open = Math.sin(t * 1.2) * 6 * (1 - h) + 22 * h;
      bl(`translate(${f(-open)} 0)`);
      br(`translate(${f(open)} 0)`);
      kv.forEach((w, i) => w(`translate(${f(Math.sin(t * 2 - i) * 4)} 0)`));
    },
  };
}

export function Gauge(svg, api) {
  const needle = writer(q(svg, 'needle'));
  const arc = writer(q(svg, 'arc'), 'stroke-dashoffset');
  return {
    tick(t) {
      const { x, h } = P(api);
      // Before, then after: the needle climbs out of the red and holds;
      // the hand sets it directly.
      const c = (t % 6) / 6;
      const run = c < 0.2 ? -60 : c < 0.55 ? lerp(-60, 63, ease((c - 0.2) / 0.35)) : 63;
      const a = lerp(run, x * 180, h);
      needle(`rotate(${f(a)} 300 320)`);
      arc(String(f(1 - (a + 90) / 180)));
    },
  };
}

export function Stopwatch(svg, api) {
  const hand = writer(q(svg, 'hand'));
  return {
    tick(t) {
      const { h } = P(api);
      hand(`rotate(${f(((t * (60 + 240 * h)) % 360))} 200 215)`);
    },
  };
}

export function AdCard(svg, api) {
  const cursor = writer(q(svg, 'cursor'));
  const wire = writer(q(svg, 'wire'), 'stroke-dashoffset');
  const phone = writer(q(svg, 'phone'));
  const ring = writer(q(svg, 'ring'), 'r');
  return {
    tick(t) {
      const { h } = P(api);
      // The cursor comes in, clicks the ad, the click runs to the phone,
      // the phone rings. The hand makes it busier.
      const period = 3.2 - 1.4 * h;
      const c = (t % period) / period;
      const cx = c < 0.3 ? lerp(330, 250, ease(c / 0.3)) : 250;
      const cy = c < 0.3 ? lerp(300, 190, ease(c / 0.3)) : 190;
      const press = c > 0.3 && c < 0.38 ? 0.9 : 1;
      cursor(`translate(${f(cx)} ${f(cy)}) scale(${press})`);
      wire(String(f(-t * 60)));
      const shake = c > 0.55 && c < 0.85 ? Math.sin(t * 60) * 3 : 0;
      phone(`rotate(${f(shake)} 550 190)`);
      ring(String(f(c > 0.55 && c < 0.85 ? 22 + Math.sin(t * 20) * 5 : 22)));
    },
  };
}

export function Target(svg, api) {
  const arrow = writer(q(svg, 'arrow'));
  return {
    tick(t) {
      const { h } = P(api);
      const period = 2.6 - h;
      const c = (t % period) / period;
      // Out of frame, in fast, a little shiver in the middle.
      const d = c < 0.3 ? lerp(160, 0, ease(c / 0.3)) : 0;
      const s = c > 0.3 && c < 0.42 ? Math.sin((c - 0.3) * 120) * 2 : 0;
      arrow(`translate(${f(d + s)} ${f(-d)})`);
    },
  };
}

export function ABTest(svg, api) {
  const a = writer(q(svg, 'barA'), 'width');
  const b = writer(q(svg, 'barB'), 'width');
  return {
    tick(t) {
      const { h } = P(api);
      // Both versions fill as the test runs; B ends ahead. The hand runs
      // the test to its end.
      const c = Math.max(h, (t % 7) / 5);
      const u = ease(Math.min(1, c));
      a(String(f(lerp(30, 120, u))));
      b(String(f(lerp(30, 220, u))));
    },
  };
}

export function Press(svg, api) {
  const cursor = writer(q(svg, 'cursor'));
  const btn = writer(q(svg, 'btn'), 'class');
  return {
    tick(t) {
      const { h } = P(api);
      const period = 2.4 - 0.8 * h;
      const c = (t % period) / period;
      const down = c > 0.45 && c < 0.6;
      const lift = c < 0.45 ? lerp(40, 0, ease(c / 0.45)) : c > 0.6 ? lerp(0, 40, ease((c - 0.6) / 0.4)) : 0;
      cursor(`translate(${f(250 + lift)} ${f(230 + lift)}) scale(${down ? 0.9 : 1})`);
      btn(down ? 'sw-acc' : 'sw-acc-soft');
    },
  };
}

export function ReportChart(svg, api) {
  const line = writer(q(svg, 'line'), 'stroke-dashoffset');
  const dot = writer(q(svg, 'dot'));
  const last = CLICKS.length - 1;
  return {
    tick(t) {
      const { x, h } = P(api);
      // The line draws itself week by week; the hand reads along it.
      const c = Math.min(1, (t % 6) / 4);
      const u = h > 0.05 ? lerp(c, x + 0.5, h) : c;
      const k = Math.max(0, Math.min(last, u * last));
      const i = Math.floor(k);
      const fr = k - i;
      const yy = lerp(CLICKS[i], CLICKS[Math.min(last, i + 1)], fr);
      line(String(f(1 - Math.max(c, u))));
      dot(`translate(${f(k * 29)} ${f(yy - CLICKS[0])})`);
    },
  };
}
