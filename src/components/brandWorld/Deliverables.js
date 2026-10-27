import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Arch, At, Emblem, INTER, Name } from './marks';

gsap.registerPlugin(Draggable);

/* The deliverables grid (2026-10-22): cards whose demos are the thing.
   Drag a sticker, hover for a hand, press play on the loop. Draggable from
   GSAP (free since 3.13), bounds the card, inertia off. Since 2026-10-25
   every piece is "Your brand" (marks.js), not a made-up client; nothing
   moves until the visitor does something. */

// The drawings show at about 60% size, so type starts at 18.
const META = { fontFamily: INTER, fontSize: 18, fontWeight: 700, letterSpacing: 2 };

function Sticker() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="96" className="bw-f-ink" />
      <g className="bw-c-cream">
        <At x={45} y={34} size={110}>
          <Arch />
        </At>
      </g>
    </svg>
  );
}

// A guide page: the lockup with its clear space measured in x, the door's width.
function GuidePage() {
  return (
    <svg viewBox="0 0 640 360" aria-hidden="true" focusable="false">
      <rect width="640" height="360" className="bw-f-cream" />
      <text x="32" y="44" className="bw-f-ink" {...META}>
        CLEAR SPACE
      </text>
      <text x="608" y="44" textAnchor="end" className="bw-f-ink" {...META}>
        2 / 12
      </text>
      <rect x="150" y="100" width="340" height="150" fill="none" className="bw-s-ink" strokeWidth="1.5" strokeDasharray="6 6" />
      <g className="bw-c-ink">
        <At x={182} y={128} size={96}>
          <Arch />
        </At>
        <Name x={290} y={198} size={36} />
      </g>
      {[
        [150, 100],
        [458, 100],
        [150, 218],
        [458, 218],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="32" height="32" className="bw-f-lavender" />
          <text x={x + 16} y={y + 21} textAnchor="middle" className="bw-f-ink" fontFamily={INTER} fontSize="14" fontWeight="700">
            x
          </text>
        </g>
      ))}
      <text x="32" y="322" className="bw-f-ink" fontFamily={INTER} fontSize="21" fontWeight="500">
        Keep x clear on every side. x is the door&apos;s width.
      </text>
    </svg>
  );
}

// The logo files: four colorways on one sheet, the small cut in the last.
function Colorways() {
  const cells = [
    ['bw-f-cream', 'bw-c-ink', 'POSITIVE'],
    ['bw-f-ink', 'bw-c-cream', 'NEGATIVE'],
    ['bw-f-lavender', 'bw-c-ink', 'ONE COLOR'],
    ['bw-f-orange', 'bw-c-ink', '16 PX CUT'],
  ];
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      {cells.map(([plate, ink, label], i) => {
        const x = (i % 2) * 200;
        const y = Math.floor(i / 2) * 200;
        return (
          <g key={label}>
            <rect x={x} y={y} width="200" height="200" className={plate} />
            <g className={ink}>
              <At x={x + 60} y={y + 44} size={80}>
                <Arch small={i === 3} />
              </At>
              <text x={x + 20} y={y + 180} fill="currentColor" {...META} fontSize="16">
                {label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

// A poster with its crop marks: print-ready means the printer's marks too.
function Poster() {
  const marks = [
    'M20 40H36M40 20V36',
    'M380 40H364M360 20V36',
    'M20 520H36M40 540V524',
    'M380 520H364M360 540V524',
  ];
  return (
    <svg viewBox="0 0 400 560" aria-hidden="true" focusable="false">
      <rect width="400" height="560" className="bw-f-ink" />
      <rect x="40" y="40" width="320" height="480" className="bw-f-pink" />
      <g className="bw-s-cream" strokeWidth="1.5">
        {marks.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="bw-c-ink">
        <At x={70} y={70} size={150}>
          <Emblem />
        </At>
        <Name x={68} y={420} size={62} text="Open" />
        <Name x={68} y={476} size={62} text="Friday." />
      </g>
      <text x="40" y="550" className="bw-f-cream" {...META} fontSize="13">
        A2 POSTER, CROP MARKS IN
      </text>
    </svg>
  );
}

// The motion loop plays only when pressed (owner, 2026-10-25: "doing too much").
function MotionCard() {
  const [play, setPlay] = useState(false);
  return (
    <button
      type="button"
      className={`bw-grid__demo bw-motion${play ? ' is-play' : ''}`}
      aria-pressed={play}
      aria-label={play ? 'Stop the logo animation' : 'Play the logo animation'}
      onClick={() => setPlay(!play)}
    >
      <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
        <rect width="400" height="400" className="bw-f-ink" />
        <g className="bw-c-cream">
          <g className="bw-motion__mark">
            <At x={110} y={84} size={180}>
              <Arch />
            </At>
          </g>
          <g className="bw-motion__name">
            <Name x={200} y={330} size={40} anchor="middle" />
          </g>
        </g>
      </svg>
      <span className="bw-motion__hint">{play ? 'Stop' : 'Play'}</span>
    </button>
  );
}

// Touch has no cursor (owner, 2026-10-26: a tap version for phones), so a
// press puts one under the finger: the tile turns orange and a ring follows
// until the finger lifts, then fades. A mouse keeps the global cursor's wrap.
function HoverCard() {
  const ringRef = useRef(null);
  const [on, setOn] = useState(false);
  const place = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ringRef.current.style.translate = `${e.clientX - r.left}px ${e.clientY - r.top}px`;
  };
  const off = () => setOn(false);
  return (
    <div
      className={`bw-grid__demo bw-grid__demo--hover${on ? ' is-on' : ''}`}
      data-cursor-color="#ff834a"
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse') return;
        place(e);
        setOn(true);
      }}
      onPointerMove={(e) => on && place(e)}
      onPointerUp={off}
      onPointerCancel={off}
    >
      <span className="bw-grid__big">
        <span className="bw-grid__verb">Hover</span>
        <span className="bw-grid__verb bw-grid__verb--touch">Tap</span> me
      </span>
      <span ref={ringRef} className="bw-grid__ring" aria-hidden="true" />
    </div>
  );
}

function DragCard() {
  const boxRef = useRef(null);
  const stickerRef = useRef(null);
  useEffect(() => {
    if (!boxRef.current || !stickerRef.current) return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const [d] = Draggable.create(stickerRef.current, {
      type: 'x,y',
      bounds: boxRef.current,
      edgeResistance: 0.8,
      onPress() {
        gsap.to(this.target, { scale: 1.06, rotation: -4, duration: 0.2 });
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, rotation: 0, duration: 0.3, ease: 'back.out(1.5)' });
      },
    });
    return () => d.kill();
  }, []);
  return (
    <div ref={boxRef} className="bw-grid__demo bw-grid__demo--drag">
      <div ref={stickerRef} className="bw-grid__sticker" data-cursor-color="#dab8ff">
        <Sticker />
      </div>
    </div>
  );
}

export default function Deliverables() {
  return (
    <section className="bw-grid" aria-labelledby="bw-grid-title">
      <h2 id="bw-grid-title" className="bw-grid__title">
        Everything you get is on this page.
      </h2>
      <ul className="bw-grid__cards">
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <DragCard />
          </div>
          <p className="bw-grid__cap">
            <strong>Stickers and merch.</strong> Drag it. It comes back the same, which is the whole point of a mark.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <HoverCard />
          </div>
          <p className="bw-grid__cap">
            <strong>Custom cursor and hover rules.</strong> The small things a site does when nobody is watching.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--paper" style={{ aspectRatio: '16/9' }}>
            <GuidePage />
          </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Guidelines.</strong> A short PDF that says what to do, with the reasons, so it gets read.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo" style={{ aspectRatio: '1' }}>
            <Colorways />
          </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Logo files.</strong> SVG, PNG, PDF, in every colorway, with the clear space drawn in.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tall" style={{ aspectRatio: '400/560' }}>
            <Poster />
          </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Print.</strong> Posters, cards, labels, with the die lines ready for the printer.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <MotionCard />
          </div>
          <p className="bw-grid__cap">
            <strong>Motion.</strong> A short loop for the site, the socials and the door screen. Press it to play.
          </p>
        </li>
      </ul>
    </section>
  );
}
