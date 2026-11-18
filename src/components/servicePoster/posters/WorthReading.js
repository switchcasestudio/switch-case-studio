import gsap from "gsap";
import { f, q, qa, writer } from "../usePosterEngine";

/* Poster 05, Content & Social Media: "Worth reading." A page of copy with
   one line marked (the proof) and the heart it earns. The replay writes
   the page again, line by line from the left, then the heart lands. Lines
   only ever scale on x from their left edge, plus a small lean toward the
   cursor; the heart leans the other way. */
const X = 190;
const TOP = 250;
const PITCH = 68;
const BAR_H = 26;
const WIDTHS = [400, 440, 340, 420, 280, 440, 220];
const MARKED = 2;

export function Art() {
  return (
    <>
      <rect width="1000" height="1000" className="sp-f-pink" />
      <g transform="rotate(-4 430 480)">
        <rect x="130" y="170" width="560" height="620" rx="16" className="sp-f-cream" />
        {WIDTHS.map((w, i) => (
          <g key={i} data-p="line" transform={`translate(${X} ${TOP + i * PITCH})`}>
            <rect width={w} height={BAR_H} rx={BAR_H / 2} className={i === MARKED ? "sp-f-terra" : "sp-f-ink"} />
          </g>
        ))}
      </g>
      <g transform="translate(780 330)">
        <g data-p="heart">
          <circle r="104" className="sp-f-ink" />
          <path d="M0 52C-40 22 -56 2 -56 -18A28 28 0 0 1 0 -24A28 28 0 0 1 56 -18C56 2 40 22 0 52Z" className="sp-f-cream" />
        </g>
      </g>
    </>
  );
}

export function create(svg, api) {
  const lines = qa(svg, "line").map((el, i) => ({ s: 1, y: TOP + i * PITCH, w: writer(el) }));
  const wHeart = writer(q(svg, "heart"));
  const heart = { s: 1 };
  let tl = null;
  let armed = true;
  let next = 1.5;

  const play = () => {
    tl = gsap
      .timeline({ onComplete: () => { tl = null; } })
      .to(heart, { s: 0, duration: 0.2, ease: "back.in(2)" })
      .set(lines, { s: 0 })
      .to(lines, { s: 1, duration: 0.34, ease: "power2.out", stagger: 0.1 })
      .to(heart, { s: 1, duration: 0.4, ease: "back.out(2.2)" }, "-=0.08");
  };

  return {
    enter() {
      if (armed && !tl) {
        armed = false;
        play();
      }
    },
    leave() {
      armed = true;
    },
    tick(t) {
      if (api.mode === "ambient" && !tl && t >= next) {
        next = t + 6;
        play();
      }
      const lean = api.pointer.x * 26 * api.hover.v;
      lines.forEach((l, i) => l.w(`translate(${f(X + lean * (1 + i * 0.12))} ${l.y}) scale(${f(l.s)} 1)`));
      wHeart(`translate(${f(-lean * 1.4)} ${f(api.pointer.y * -18 * api.hover.v)}) scale(${f(heart.s)})`);
    },
  };
}
