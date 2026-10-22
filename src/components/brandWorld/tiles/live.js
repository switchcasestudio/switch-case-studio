import { f, q, qa, writer } from '../../servicePoster/usePosterEngine';

/* Live behaviour for the collage tiles (2026-10-22), one `create(svg, api)`
   per art, run by the house poster engine (usePosterEngine): pointer mode
   on a fine pointer, ambient on touch, static under reduced motion. The
   engine gives `api.pointer` (−0.5…0.5, lerped), `api.hover.v` (0…1) and a
   clock; each tick writes SVG attributes through `writer`, which skips
   unchanged values. The SSR drawing is the rest state: every tick returns
   to it when the pointer leaves. */

const P = (api) => ({ x: api.pointer.x, y: api.pointer.y, h: api.hover.v });

export function HatchMark(svg, api) {
  const lines = writer(q(svg, 'hatch'));
  return {
    tick(t) {
      const { x, y, h } = P(api);
      // Idle: the shelves breathe sideways; hover: they follow the hand.
      const ix = Math.sin(t * 1.4) * 6 * (1 - h);
      lines(`translate(${f(ix + x * 70 * h)} ${f(y * 24 * h)})`);
    },
  };
}

export function HatchWord(svg, api) {
  const lines = qa(svg, 'hatch')[0];
  const paths = lines ? [...lines.querySelectorAll('path')] : [];
  const ws = paths.map((p) => writer(p));
  return {
    tick(t) {
      const { x, y, h } = P(api);
      ws.forEach((w, i) => {
        const wave = Math.sin(t * 2 + i * 0.9) * 3 * (1 - h);
        w(`translate(${f(x * 60 * h * (i + 1) * 0.5)} ${f(wave + y * 30 * h * (i + 1) * 0.4)})`);
      });
    },
  };
}

export function LowtideMark(svg, api) {
  const sun = writer(q(svg, 'sun'));
  const tide = qa(svg, 'tide')[0];
  const waves = tide ? [...tide.querySelectorAll('path')].map((p) => writer(p)) : [];
  return {
    tick(t) {
      const { x, y, h } = P(api);
      // The sun rides the pointer's height; the tide runs with its x.
      sun(`translate(${f(x * 30 * h)} ${f(Math.sin(t * 0.8) * 4 * (1 - h) + y * 90 * h)})`);
      waves.forEach((w, i) => {
        const dir = i ? -1 : 1;
        w(`translate(${f(dir * (Math.sin(t * 1.1 + i) * 8 * (1 - h) + x * 50 * h))} 0)`);
      });
    },
  };
}

export function LowtideColour(svg, api) {
  const rows = qa(svg, 'swatch').map((g) => writer(g.querySelector('rect'), 'width'));
  return {
    tick(t) {
      const { x, h } = P(api);
      rows.forEach((w, i) => {
        const idle = Math.sin(t * 1.2 + i * 0.7) * 10 * (1 - h);
        w(String(Math.round(150 + idle + (x + 0.5) * 170 * h * (1 - i * 0.12))));
      });
    },
  };
}

export function MeridianMark(svg, api) {
  const ring = writer(q(svg, 'ring'));
  return {
    tick(t) {
      const { x, h } = P(api);
      // A slow turn on its own (one turn in 8 s, the reference's gear),
      // and the hand spins it.
      const deg = (t / 8) * 360 + x * 180 * h;
      ring(`translate(200 190) rotate(${f(deg)})`);
    },
  };
}

export function MeridianType(svg, api) {
  const texts = [...svg.querySelectorAll('text')].slice(0, 2);
  const ws = texts.map((el) => writer(el, 'font-weight'));
  let last = -1;
  return {
    tick() {
      const { x, h } = P(api);
      // Inter ships static weights: step 300 → 800 across the hand's x.
      const w = h < 0.05 ? -1 : 300 + Math.round(((x + 0.5) * 5)) * 100;
      if (w === last) return;
      last = w;
      ws.forEach((write, i) => write(String(w < 0 ? (i ? 500 : 700) : w)));
    },
  };
}

export function FieldnoteCard(svg, api) {
  const ribbon = writer(q(svg, 'ribbon'));
  return {
    tick(t) {
      const { x, h } = P(api);
      // The bookmark swings from its top edge.
      const deg = Math.sin(t * 1.6) * 2 * (1 - h) + x * 24 * h;
      ribbon(`rotate(${f(deg)} 590 40)`);
    },
  };
}

export function FieldnoteSticker(svg, api) {
  const ribbon = writer(q(svg, 'ribbon'));
  return {
    tick(t) {
      const { y, h } = P(api);
      const s = 1 + Math.sin(t * 1.3) * 0.02 * (1 - h) + (y + 0.5) * 0.3 * h;
      ribbon(`scale(1 ${f(s)})`);
    },
  };
}

export function HumMark(svg, api) {
  const rings = [...q(svg, 'ring').querySelectorAll('circle')].map((c) => writer(c, 'r'));
  const base = [60, 100, 140];
  return {
    tick(t) {
      const { x, y, h } = P(api);
      const d = Math.min(1, Math.hypot(x, y) * 2) * h;
      rings.forEach((w, i) => {
        // Breathing idle; the hand's distance from the centre is volume.
        const pulse = Math.sin(t * 2.2 - i * 0.8) * 6;
        w(f(base[i] + pulse + d * 40 * (i + 1) * 0.5));
      });
    },
  };
}

export function HumGlyph(svg, api) {
  const h = writer(svg.querySelector('text:not([letter-spacing])'));
  return {
    tick(t) {
      const { x, y, h: hov } = P(api);
      const bob = Math.sin(t * 1.5) * 6 * (1 - hov);
      h(`translate(${f(x * 40 * hov)} ${f(bob - y * 60 * hov)}) skewX(${f(-x * 14 * hov)})`);
    },
  };
}

export function Badge(svg, api) {
  const all = writer(svg);
  return {
    tick(t) {
      const { x, h } = P(api);
      // Always turning, a touch faster under the hand.
      all(`rotate(${f(((t / 14) * 360 + x * 60 * h) % 360)} 100 100)`);
    },
  };
}
