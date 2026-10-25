import gsap from "gsap";
import { f, q, qa, writer } from "../usePosterEngine";

/* Poster 01, Brand Identity: "In register." Two plates of one giant "Aa",
   terra multiplied over pink. The cursor pulls them out of register; center
   it and they lock, the crosshairs pulse and the headline says so. */
const SANS = "Inter, 'Inter Fallback', sans-serif";
const SERIF = "'SCS Display', 'SCS Display Fallback', sans-serif";
const GLYPH = { x: 500, y: 650, textAnchor: "middle", fontSize: 500, fontWeight: 500, letterSpacing: -18, fontFamily: SANS };

function Cross({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g data-p="cross">
        <circle r="26" fill="none" className="sp-s-ink" strokeWidth="3" />
        <path d="M-46 0H46M0-46V46" className="sp-s-ink" strokeWidth="3" />
      </g>
    </g>
  );
}

export function Art() {
  return (
    <>
      <rect width="1000" height="1000" className="sp-f-cream" />
      <Cross x={120} y={210} />
      <Cross x={880} y={790} />
      <g data-p="pink">
        <text data-p="glyph" className="sp-f-pink" {...GLYPH}>Aa</text>
      </g>
      <g data-p="terra">
        <text data-p="glyph" className="sp-f-terra sp-multiply" {...GLYPH}>Aa</text>
      </g>
    </>
  );
}

export function create(svg, api) {
  const MAX = 70; // 7% of the viewBox
  const LOCK = 2.5; // 0.25% of the viewBox
  const wT = writer(q(svg, "terra"));
  const wP = writer(q(svg, "pink"));
  const glyphs = qa(svg, "glyph");
  const headline = q(svg, "headline");
  const pulses = qa(svg, "cross").map((el) => ({ s: 1, w: writer(el) }));

  // Safari fallback: no blend support -> terra at 0.85 opacity.
  if (!(window.CSS && CSS.supports && CSS.supports("mix-blend-mode", "multiply"))) {
    glyphs[1].classList.remove("sp-multiply");
    glyphs[1].setAttribute("fill-opacity", "0.85");
  }

  let locked = true;
  let serif = false;
  let weight = GLYPH.fontWeight;

  const pulse = () => {
    pulses.forEach((p) => {
      gsap.killTweensOf(p);
      gsap
        .timeline()
        .to(p, { s: 1.4, duration: 0.15, ease: "power2.out" })
        .to(p, { s: 1, duration: 0.25, ease: "power2.in" });
    });
  };

  return {
    tick(t) {
      // Idle drift: an envelope that returns to zero every 4s, so the
      // poster locks (and pulses) on its own once per cycle.
      const env = Math.sin(Math.PI * ((t % 4) / 4)) ** 2;
      const ix = env * MAX * 0.7 * Math.cos(t * 1.3);
      const iy = env * MAX * 0.7 * Math.sin(t * 0.9);
      const h = api.hover.v;
      let x = ix * (1 - h) + api.pointer.x * 2 * MAX * h;
      let y = iy * (1 - h) + api.pointer.y * 2 * MAX * h;
      let m = Math.hypot(x, y);
      if (m < LOCK) {
        x = 0;
        y = 0;
        m = 0;
      }

      const nowLocked = m === 0;
      if (nowLocked !== locked) {
        locked = nowLocked;
        headline.textContent = locked ? "In register." : "Out of register.";
        if (locked) pulse();
      }

      // Face swap with hysteresis (on past 40%, off below 30%).
      const r = m / MAX;
      const nextSerif = serif ? r > 0.3 : r > 0.4;
      if (nextSerif !== serif) {
        serif = nextSerif;
        glyphs.forEach((g) => g.setAttribute("font-family", serif ? SERIF : SANS));
      }
      // Inter ships static weights: step 500 -> 800 with the offset.
      const w = serif ? weight : 500 + Math.round(Math.min(r / 0.4, 1) * 3) * 100;
      if (w !== weight) {
        weight = w;
        glyphs.forEach((g) => g.setAttribute("font-weight", String(w)));
      }

      wT(`translate(${f(x)} ${f(y)})`);
      wP(`translate(${f(-x)} ${f(-y)})`);
      pulses.forEach((p) => p.w(`scale(${f(p.s)})`));
    },
  };
}
