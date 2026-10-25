import gsap from "gsap";
import { clamp, f, q, qa, writer } from "../usePosterEngine";

/* Poster 02, Web Development: "Built to convert." A landing page in a
   browser window. The replay knocks the page's blocks out and drops them
   back in order (nav, headline, copy, CTA, image, cards), then the cursor
   clicks the CTA and a "Booked" toast pops. Hover: blocks lean toward the
   cursor. The SSR frame is the finished page with the toast showing. */
const SANS = "Inter, 'Inter Fallback', sans-serif";
const CURSOR = { x: 350, y: 532 };
const CTA = { x: 295, y: 520 };
const TOAST = { x: 750, y: 812 };

// Block centers, for the hover lean (distance to the cursor).
const CENTERS = [
  [500, 241],
  [380, 351],
  [350, 441],
  [295, 520],
  [700, 420],
  [295, 675],
  [500, 675],
  [705, 675],
];

function Card({ x, fill }) {
  return (
    <g data-p="blk">
      <rect x={x} y="600" width="190" height="150" rx="10" className={fill} />
      <rect x={x + 22} y="700" width="110" height="14" rx="7" className="sp-f-ink" />
      <rect x={x + 22} y="724" width="70" height="10" rx="5" className="sp-f-ink" fillOpacity="0.45" />
    </g>
  );
}

export function Art() {
  return (
    <>
      <rect width="1000" height="1000" className="sp-f-mint" />
      <rect x="188" y="168" width="660" height="620" rx="14" className="sp-f-ink" />
      <rect x="170" y="150" width="660" height="620" rx="14" className="sp-f-cream" />
      <path d="M184 150H816A14 14 0 0 1 830 164V202H170V164A14 14 0 0 1 184 150Z" className="sp-f-ink" />
      <circle cx="202" cy="176" r="8" className="sp-f-cream" />
      <circle cx="230" cy="176" r="8" className="sp-f-cream" />
      <circle cx="258" cy="176" r="8" className="sp-f-cream" />

      <g data-p="blk">
        <rect x="200" y="228" width="92" height="26" rx="13" className="sp-f-terra" />
        <rect x="590" y="235" width="54" height="12" rx="6" className="sp-f-ink" />
        <rect x="660" y="235" width="54" height="12" rx="6" className="sp-f-ink" />
        <rect x="730" y="235" width="54" height="12" rx="6" className="sp-f-ink" />
      </g>
      <g data-p="blk">
        <rect x="200" y="296" width="360" height="46" rx="6" className="sp-f-ink" />
        <rect x="200" y="356" width="260" height="46" rx="6" className="sp-f-ink" />
      </g>
      <g data-p="blk">
        <rect x="200" y="428" width="300" height="12" rx="6" className="sp-f-ink" fillOpacity="0.45" />
        <rect x="200" y="450" width="230" height="12" rx="6" className="sp-f-ink" fillOpacity="0.45" />
      </g>
      <g transform={`translate(${CTA.x} ${CTA.y})`}>
        <g data-p="blk">
          <g data-p="cta">
            <rect x="-95" y="-30" width="190" height="60" rx="30" className="sp-f-terra" />
            <text y="9" textAnchor="middle" fontFamily={SANS} fontSize="24" fontWeight="700" className="sp-f-cream">
              Book a call
            </text>
          </g>
        </g>
      </g>
      <g data-p="blk">
        <rect x="600" y="290" width="200" height="260" rx="10" className="sp-f-pink" />
        <circle cx="742" cy="350" r="28" className="sp-f-cream" />
        <path d="M600 550L668 440L716 500L746 466L800 540V550Z" className="sp-f-ink" />
      </g>
      <Card x={200} fill="sp-f-mint" />
      <Card x={405} fill="sp-f-pink" />
      <Card x={610} fill="sp-f-terra" />

      <g transform={`translate(${CURSOR.x} ${CURSOR.y})`}>
        <g data-p="cursor">
          <path d="M0 0L0 64L17 49L28 76L40 71L29 45L52 45Z" className="sp-f-ink sp-s-cream" strokeWidth="4" strokeLinejoin="round" />
        </g>
      </g>

      <g transform={`translate(${TOAST.x} ${TOAST.y})`}>
        <g data-p="toast">
          <rect x="-120" y="-40" width="240" height="80" rx="40" className="sp-f-ink" />
          <circle cx="-78" r="22" className="sp-f-terra" />
          <path d="M-89 1L-81 9L-66 -7" fill="none" className="sp-s-cream" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="-44" y="10" fontFamily={SANS} fontSize="30" fontWeight="700" className="sp-f-cream">
            Booked
          </text>
        </g>
      </g>
    </>
  );
}

export function create(svg, api) {
  const blocks = qa(svg, "blk").map((el, i) => ({
    el,
    y: 0,
    o: 1,
    cx: CENTERS[i][0],
    cy: CENTERS[i][1],
    w: writer(el),
    wo: writer(el, "opacity"),
  }));
  const cursorEl = q(svg, "cursor");
  const wCursor = writer(cursorEl);
  const wCursorOp = writer(cursorEl, "opacity");
  const wCta = writer(q(svg, "cta"));
  const wToast = writer(q(svg, "toast"));

  // Click ripple: an effect element, created client-side only.
  const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  ring.setAttribute("r", "40");
  ring.setAttribute("fill", "none");
  ring.setAttribute("stroke-width", "5");
  ring.setAttribute("class", "sp-s-ink");
  ring.setAttribute("opacity", "0");
  svg.appendChild(ring);
  const wRing = writer(ring);
  const wRingOp = writer(ring, "opacity");

  const st = { cx: 0, cy: 0, rs: 0, ro: 0, press: 1, toast: 1 };
  let tl = null;
  let armed = true;
  let next = 1.5;

  const play = () => {
    tl = gsap
      .timeline({ onComplete: () => { tl = null; } })
      .to(st, { toast: 0, duration: 0.2, ease: "back.in(2)" })
      .to(st, { cx: 260, cy: 150, duration: 0.3, ease: "power2.in" }, "<")
      .to(blocks, { y: -40, o: 0, duration: 0.25, ease: "power2.in", stagger: 0.02 }, "<")
      .to(blocks, { y: 0, o: 1, duration: 0.55, ease: "back.out(1.8)", stagger: 0.07 })
      .to(st, { cx: 0, cy: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.2")
      .set(st, { rs: 0.2, ro: 1 })
      .to(st, { rs: 1.8, ro: 0, duration: 0.5, ease: "power2.out" })
      .to(st, { press: 0.9, duration: 0.1, ease: "power2.in" }, "<")
      .to(st, { press: 1, duration: 0.3, ease: "back.out(3)" })
      .to(st, { toast: 1, duration: 0.45, ease: "back.out(2)" }, "<");
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
        next = t + 7;
        play();
      }
      const h = api.hover.v;
      const px = (api.pointer.x + 0.5) * 1000;
      const py = (api.pointer.y + 0.5) * 1000;
      blocks.forEach((b) => {
        let lx = 0;
        let ly = 0;
        if (h > 0.01) {
          const dx = px - b.cx;
          const dy = py - b.cy;
          const pull = clamp(1 - Math.hypot(dx, dy) / 260) * h;
          lx = dx * 0.08 * pull;
          ly = dy * 0.08 * pull;
        }
        b.w(`translate(${f(lx)} ${f(b.y + ly)})`);
        b.wo(String(f(b.o)));
      });
      wCursor(`translate(${f(st.cx)} ${f(st.cy)})`);
      wCursorOp(String(f(1 - h)));
      wCta(`scale(${f(st.press)})`);
      wToast(`scale(${f(st.toast)})`);
      wRing(`translate(${CURSOR.x + 10} ${CURSOR.y + 10}) scale(${f(st.rs)})`);
      wRingOp(String(f(st.ro)));
    },
    destroy() {
      ring.remove();
    },
  };
}
