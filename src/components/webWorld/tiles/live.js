import { f, q, qa, writer } from '../../servicePoster/usePosterEngine';

/* Live behavior for the Web world's drawings (2026-10-24), one
   `create(svg, api)` per art, run by the house poster engine
   (usePosterEngine): pointer mode on a fine pointer, ambient on touch,
   static under reduced motion, where the SSR drawing is the rest state.
   `api.pointer` is -0.5...0.5 (lerped), `api.hover.v` 0...1, plus a clock.
   Same rule as the AI world: every drawing runs on its own and runs
   faster, or differently, under the hand. */

const P = (api) => ({ x: api.pointer.x, y: api.pointer.y, h: api.hover.v });

export function Wireframe(svg, api) {
  const hero = writer(q(svg, 'hero'));
  const cards = qa(svg, 'card').map((el) => writer(el));
  return {
    tick(t) {
      const { x, h } = P(api);
      // Idle: the cards bob in turn. Hover: they slide toward the hand,
      // the way a layout gets argued over.
      cards.forEach((w, i) => {
        const bob = Math.sin(t * 1.4 - i * 0.8) * 4 * (1 - h);
        w(`translate(${f(x * 40 * h * (i - 1))} ${f(bob)})`);
      });
      hero(`translate(0 ${f(Math.sin(t * 0.9) * 2)})`);
    },
  };
}

export function Sitemap(svg, api) {
  const root = writer(q(svg, 'root'));
  const leaves = qa(svg, 'leaf').map((el) => writer(el));
  return {
    tick(t) {
      const { x, y, h } = P(api);
      root(`translate(${f(x * 16 * h)} ${f(Math.sin(t * 1.1) * 3 - y * 12 * h)})`);
      leaves.forEach((w, i) => w(`translate(0 ${f(Math.sin(t * 1.6 - i) * 4 * (1 + h))})`));
    },
  };
}

export function LayoutGrid(svg, api) {
  const b0 = writer(q(svg, 'b0'));
  const b1 = writer(q(svg, 'b1'));
  const b2 = writer(q(svg, 'b2'));
  const b3 = writer(q(svg, 'b3'));
  return {
    tick(t) {
      const { x, h } = P(api);
      // The blocks snap one column (43.3 units) at a time, never between.
      const step = Math.round(Math.sin(t * 0.8) * 1.5 + x * 4 * h);
      const dx = f(step * 43.3);
      b0(`translate(${dx} 0)`);
      b1(`translate(${f(-step * 43.3)} 0)`);
      b2(`translate(${f(-step * 43.3)} 0)`);
      b3(`translate(${dx} 0)`);
    },
  };
}

export function TypeSpecimen(svg, api) {
  const aa = q(svg, 'aa');
  const weight = writer(aa, 'font-weight');
  return {
    tick(t) {
      const { h } = P(api);
      // Two weights only, the way a brand uses them: 500 and 800.
      const on = h > 0.5 || Math.sin(t * 1.2) > 0.6;
      weight(on ? '800' : '500');
    },
  };
}

export function Editor(svg, api) {
  const lines = qa(svg, 'line');
  const lens = lines.map((el) => el.getTotalLength());
  const draw = lines.map((el) => writer(el, 'stroke-dashoffset'));
  lines.forEach((el, i) => {
    el.setAttribute('stroke-dasharray', `${lens[i]} ${lens[i]}`);
  });
  const caret = writer(q(svg, 'caret'));
  const blink = writer(q(svg, 'caret'), 'opacity');
  return {
    tick(t) {
      const { h } = P(api);
      // One line every 0.7 s at rest, twice as fast under the hand; the
      // whole file rewrites itself after a pause.
      const per = 0.7 - 0.35 * h;
      const total = lines.length * per + 1.4;
      const c = t % total;
      lines.forEach((_, i) => {
        const u = Math.max(0, Math.min(1, (c - i * per) / per));
        draw[i](String(f(lens[i] * (1 - u))));
      });
      const row = Math.min(lines.length - 1, Math.floor(c / per));
      caret(`translate(0 ${f(row * 40)})`);
      blink(Math.sin(t * 8) > 0 ? '1' : '0.2');
    },
  };
}

export function Braces(svg, api) {
  const l = writer(q(svg, 'l'));
  const r = writer(q(svg, 'r'));
  const core = writer(q(svg, 'core'));
  return {
    tick(t) {
      const { x, h } = P(api);
      // The braces open under the hand to show what they hold.
      const open = 10 * Math.sin(t * 1.3) * (1 - h) + 40 * h;
      l(`translate(${f(-open)} 0)`);
      r(`translate(${f(open)} 0)`);
      core(`translate(${f(x * 20 * h)} ${f(Math.cos(t * 1.3) * 3)})`);
    },
  };
}

export function AddressBar(svg, api) {
  const bar = q(svg, 'bar');
  const width = writer(bar, 'width');
  const shackle = writer(q(svg, 'shackle'));
  return {
    tick(t) {
      const { h } = P(api);
      // The page loads in 2.4 s at rest, at once under the hand; the lock
      // closes when it lands.
      const c = h > 0.5 ? 1 : Math.min(1, (t % 3.4) / 2.4);
      width(String(f(560 * c)));
      shackle(c >= 1 ? 'translate(0 0)' : 'translate(0 -6)');
    },
  };
}

export function DnsRow(svg, api) {
  const ok = writer(q(svg, 'ok'));
  return {
    tick(t) {
      const { h } = P(api);
      const s = 1 + Math.max(0, Math.sin(t * 2.2)) * 0.25 * (1 - h) + 0.3 * h;
      ok(`translate(${f(56 - 56 * s)} ${f(128 - 128 * s)}) scale(${f(s)})`);
    },
  };
}

export function Uptime(svg, api) {
  const beat = writer(q(svg, 'beat'));
  const dot = writer(q(svg, 'dot'), 'opacity');
  let pos = 0;
  let last = 0;
  return {
    tick(t) {
      const { h } = P(api);
      // The line scrolls left one beat (200 units) every 2.5 s; the hand
      // speeds the pulse up, the way an alert would.
      const speed = 80 + 220 * h;
      pos += speed * Math.max(0, Math.min(0.05, t - last));
      last = t;
      beat(`translate(${f(-(pos % 200))} 0)`);
      dot(Math.sin(t * 3) > -0.2 ? '1' : '0.4');
    },
  };
}

export function Rack(svg, api) {
  const leds = qa(svg, 'led').map((el) => writer(el, 'opacity'));
  return {
    tick(t) {
      const { h } = P(api);
      leds.forEach((w, i) => w(Math.sin(t * (2 + h * 6) - i * 1.7) > 0 ? '1' : '0.25'));
    },
  };
}
