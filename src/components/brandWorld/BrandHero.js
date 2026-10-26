import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { q } from '../servicePoster/usePosterEngine';

/* The brand world's hero (2026-10-25, owner: "the graphic design page
   structure similar to the other services"). It replaced the scroll
   collage, the last page that used it; the frame, copy, captions, log and
   Pause are the other worlds' hero (`world-hero`, _worldHero.scss), the
   drawing stays in this world's language: flat plates, no outlines.

   The drawing is one mark on six touchpoints at once: a browser tab (the
   favicon at its real 16px), an app icon, a social avatar, a business
   card, a shop sign and the side of a van. It is a machine that runs:
   - Live: while the hero is on screen it switches concept every few
     seconds (Hatch, Lowtide, Meridian, Fieldnote, Hum). The plates flip
     color smallest first, so the change runs from the favicon up to the
     van; the brand log gets four lines per concept, one per size checked.
     The favicon is each mark's small cut (fewer parts), which the log
     names. Pause stops all of it (WCAG 2.2.2).
   - Reacting: the touchpoints drift toward the pointer, the small ones
     more; hovering a touchpoint or its caption lifts it and dims the rest;
     a click on one shows the next concept; the concept pills pick one.
   The SSR markup is the rest state (Hatch) and is complete; entrances are
   CSS keyframes from first paint. CSS owns every color and which concept
   shows (`is-c-<key>` on the root, a `--d` delay per touchpoint); GSAP
   writes only the drift transforms. Under reduced motion nothing switches
   on its own. Auto switches are not announced; picked ones are. */

const INTER = "Inter, 'Inter Fallback', sans-serif";
const AUTO_FIRST = 2200;
const AUTO_GAP = 4200;

// Fields per concept live in brandHero.scss (`$bh-concepts`).
const CONCEPTS = [
  {
    key: 'hatch',
    name: 'Hatch',
    full: 'Hatch Ceramics',
    word: 'bw-f-ink',
    lines: [
      ['mark', 'Hatch Ceramics: the H in a kiln shelf'],
      ['16 px', 'favicon: hatching dropped, the H stays'],
      ['3.5 in', 'card: printed on a bad printer, holds'],
      ['13 ft', 'van side: read at 30 mph, logged'],
    ],
  },
  {
    key: 'lowtide',
    name: 'Lowtide',
    full: 'Lowtide Coffee',
    word: 'bw-f-cream',
    lines: [
      ['mark', 'Lowtide Coffee: a sun over the tide'],
      ['16 px', 'favicon: two waves cut to one'],
      ['190 px', 'app icon and avatar: centered for the crop'],
      ['13 ft', 'van side: the blue holds in daylight, logged'],
    ],
  },
  {
    key: 'meridian',
    name: 'Meridian',
    full: 'Meridian Bike Repair',
    word: 'bw-f-ink',
    lines: [
      ['mark', 'Meridian Bike Repair: a chainring, one line'],
      ['16 px', 'favicon: the teeth go solid, the line stays'],
      ['24 in', 'shop sign: reads from across the street'],
      ['13 ft', 'van side: lavender matched to the vinyl, logged'],
    ],
  },
  {
    key: 'fieldnote',
    name: 'Fieldnote',
    full: 'Fieldnote Books',
    word: 'bw-f-ink',
    lines: [
      ['mark', 'Fieldnote Books: the ribbon is the mark'],
      ['16 px', 'favicon: the rules go, the ribbon grows'],
      ['3.5 in', 'card: the ruled lines print at half a point'],
      ['13 ft', 'van side: mint and terra on one plate, logged'],
    ],
  },
  {
    key: 'hum',
    name: 'Hum',
    full: 'Hum Sound Studio',
    word: 'bw-f-ink',
    lines: [
      ['mark', 'Hum Sound Studio: rings leaving an h'],
      ['16 px', 'favicon: three rings cut to one'],
      ['190 px', 'avatar: the rings centered for the circle crop'],
      ['13 ft', 'van side: pink holds next to traffic, logged'],
    ],
  },
];

/* Each mark in a 100 x 100 box, drawn from the concept tiles; `small` is
   the favicon cut. Colors are the concept's own (its plate is the field). */
function Hatch({ small }) {
  return (
    <>
      <circle cx="50" cy="50" r="44" className="bw-f-ink" />
      <rect x="30" y="28" width="8" height="44" className="bw-f-cream" />
      <rect x="62" y="28" width="8" height="44" className="bw-f-cream" />
      {small ? (
        <rect x="38" y="45" width="24" height="10" className="bw-f-cream" />
      ) : (
        <path d="M38 43H62M38 48.5H62M38 54H62" className="bw-s-cream" strokeWidth="2.6" />
      )}
    </>
  );
}

function Lowtide({ small }) {
  return (
    <>
      <circle cx="68" cy="30" r={small ? 13 : 11} className="bw-f-cream" />
      <rect x="26" y="20" width="12" height="52" rx="1.5" className="bw-f-cream" />
      <path
        d="M26 74c8 0 8-6 16-6s8 6 16 6 8-6 16-6"
        fill="none"
        className="bw-s-cream"
        strokeWidth={small ? 8 : 5.5}
        strokeLinecap="round"
      />
      {!small && (
        <path
          d="M38 87c6.5 0 6.5-4.5 13-4.5s6.5 4.5 13 4.5 6.5-4.5 13-4.5"
          fill="none"
          className="bw-s-cream"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      )}
    </>
  );
}

function Meridian({ small }) {
  return (
    <>
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        className="bw-s-ink"
        strokeWidth={small ? 11 : 8}
        strokeDasharray={small ? undefined : '6 4'}
      />
      <circle cx="50" cy="50" r="11" className="bw-f-ink" />
      <rect x="47" y="6" width="6" height="88" rx="3" className="bw-f-ink" />
    </>
  );
}

function Fieldnote({ small }) {
  return (
    <>
      <rect x="12" y="22" width="76" height="56" rx="5" className="bw-f-cream" />
      {!small && (
        <>
          <path d="M20 42H80M20 52H80M20 62H80" className="bw-s-mint" strokeWidth="1.8" />
          <path d="M28 22V78" className="bw-s-terra" strokeWidth="1.4" />
        </>
      )}
      <path d={small ? 'M54 22h22v40l-11-9-11 9z' : 'M62 22h13v27l-6.5-5.5-6.5 5.5z'} className="bw-f-terra" />
    </>
  );
}

function Hum({ small }) {
  return (
    <>
      <g fill="none" className="bw-s-ink">
        {small ? (
          <circle cx="50" cy="50" r="38" strokeWidth="7" />
        ) : (
          <>
            <circle cx="50" cy="50" r="24" strokeWidth="3.5" />
            <circle cx="50" cy="50" r="35" strokeWidth="3.5" opacity="0.6" />
            <circle cx="50" cy="50" r="46" strokeWidth="3.5" opacity="0.3" />
          </>
        )}
      </g>
      <text x="50" y="68" textAnchor="middle" className="bw-f-ink" fontFamily={INTER} fontSize={small ? 60 : 50} fontWeight="700">
        h
      </text>
    </>
  );
}

const MARKS = { hatch: Hatch, lowtide: Lowtide, meridian: Meridian, fieldnote: Fieldnote, hum: Hum };

// All five marks sit in every slot; CSS shows the current concept's.
function Mark({ x, y, size, small = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 100})`}>
      {CONCEPTS.map((c) => {
        const M = MARKS[c.key];
        return (
          <g key={c.key} className={`bh-hero__v bh-hero__v--${c.key}`}>
            <M small={small} />
          </g>
        );
      })}
    </g>
  );
}

function Words({ x, y, size, weight = 700, anchor = 'start', full = false, spacing = 0 }) {
  return CONCEPTS.map((c) => (
    <text
      key={c.key}
      className={`bh-hero__v bh-hero__v--${c.key} ${c.word}`}
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={INTER}
      fontSize={size}
      fontWeight={weight}
      letterSpacing={spacing}
    >
      {full ? c.full : c.name}
    </text>
  ));
}

// The touchpoints, smallest first: that is the order the plates flip in
// (`--d`) and the order the entrance runs. Each caption sits in a zone no
// plate reaches (viewBox 1600 x 960), short, because the type floors at
// 12px while the drawing shrinks.
const TOUCH = ['tab', 'icon', 'avatar', 'card', 'sign', 'van'];
const DRIFT = { tab: 1.5, icon: 1.3, avatar: 1.2, card: 1, sign: 0.8, van: 0.55 };
const CAPS = [
  { key: 'tab', l: 2.5, t: 74, w: 32, text: ['Favicon.', '16 pixels, and it still reads.'] },
  { key: 'icon', l: 38.5, t: 28.5, w: 15.5, text: ['App icon.', 'One square on a full home screen.'] },
  { key: 'avatar', l: 55.5, t: 28.5, w: 14.5, text: ['Avatar.', 'Every app crops it to a circle.'] },
  { key: 'card', l: 73.75, t: 30, w: 23.75, text: ['Business card.', '3.5 inches, tested on a bad printer.'] },
  { key: 'sign', l: 2.5, t: 46.5, w: 21, text: ['Shop sign.', 'Read from across the street.'] },
  { key: 'van', l: 56.25, t: 92.5, w: 40, text: ['Van.', '13 feet long, read at 30 mph.'] },
];

const lineItems = (c, n) => c.lines.map(([size, text], i) => ({ size, text, id: `${n}-${i}` }));

export default function BrandHero() {
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const [concept, setConcept] = useState(0);
  const [runs, setRuns] = useState(1);
  const [log, setLog] = useState(() => lineItems(CONCEPTS[0], 1));
  const [hot, setHot] = useState(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState(false);

  // The engine: the schedule, visibility, the log. Built once; everything
  // it reads lives in refs, everything it shows goes through state setters.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { runs: 1, next: 1, timer: 0, tl: null, visible: false, paused: false };

    const canAuto = () => !reduced && st.visible && !st.paused && !document.hidden;
    const sync = () => setLive(canAuto());
    const push = (line) => setLog((l) => [...l, line].slice(-4));

    function schedule(delay) {
      clearTimeout(st.timer);
      if (!canAuto()) return;
      st.timer = setTimeout(() => show(st.next, false), delay);
    }

    // A pick never waits: it cuts the running switch short.
    function show(index, manual) {
      clearTimeout(st.timer);
      if (st.tl) st.tl.kill();
      const i = index % CONCEPTS.length;
      st.next = (i + 1) % CONCEPTS.length;
      st.runs += 1;
      setRuns(st.runs);
      setAnnounce(manual);
      setConcept(i);
      const lines = lineItems(CONCEPTS[i], st.runs);
      if (reduced) {
        setLog(lines);
        return;
      }
      // One line per size as its plate lands (the flip runs 0 to 0.6s).
      const tl = gsap.timeline({
        onComplete: () => {
          st.tl = null;
          schedule(AUTO_GAP);
        },
      });
      st.tl = tl;
      [0, 0.3, 0.75, 1.15].forEach((at, n) => tl.call(() => push(lines[n]), null, at));
      tl.to({}, { duration: 0.6 }, 1.15);
    }

    const io = new IntersectionObserver(
      ([e]) => {
        st.visible = e.isIntersecting;
        sync();
        if (st.visible) schedule(st.runs > 1 ? AUTO_GAP / 2 : AUTO_FIRST);
        else clearTimeout(st.timer);
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    const onVis = () => {
      sync();
      if (document.hidden) clearTimeout(st.timer);
      else schedule(AUTO_GAP / 2);
    };
    document.addEventListener('visibilitychange', onVis);

    engineRef.current = {
      show: (i) => show(i, true),
      next: () => show(st.next, true),
      setPaused: (p) => {
        st.paused = p;
        sync();
        if (p) clearTimeout(st.timer);
        else schedule(600);
      },
    };

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      clearTimeout(st.timer);
      if (st.tl) st.tl.kill();
      engineRef.current = null;
    };
  }, []);

  // The pointer: each touchpoint drifts toward it, the small ones more (a
  // favicon is nearer the eye than a van). quickTo tweens settle and stop
  // on their own. Fine pointers only.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root && root.querySelector('.bh-hero__stage');
    const svg = stage && stage.querySelector('svg');
    if (!svg) return undefined;
    const ok = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!ok) return undefined;
    const els = TOUCH.map((k) => q(svg, `drift-${k}`));
    const tos = els.map((el) => [
      gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' }),
      gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' }),
    ]);
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      TOUCH.forEach((k, i) => {
        tos[i][0](x * 16 * DRIFT[k]);
        tos[i][1](y * 12 * DRIFT[k]);
      });
    };
    const onLeave = () =>
      tos.forEach(([tx, ty]) => {
        tx(0);
        ty(0);
      });
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(els);
    };
  }, []);

  const next = () => engineRef.current && engineRef.current.next();
  const pick = (i) => engineRef.current && engineRef.current.show(i);
  const togglePause = () => {
    const p = !paused;
    setPaused(p);
    if (engineRef.current) engineRef.current.setPaused(p);
  };
  const hover = (key) => ({
    onPointerEnter: () => setHot(key),
    onPointerLeave: () => setHot(null),
  });
  const tp = (key) => ({
    className: `bh-hero__tp${hot === key ? ' is-on' : ''}`,
    style: { '--d': `${TOUCH.indexOf(key) * 0.12}s`, '--i': TOUCH.indexOf(key) },
    onClick: next,
    ...hover(key),
  });

  const cls = ['bh-hero', `is-c-${CONCEPTS[concept].key}`];
  if (live) cls.push('is-live');
  if (hot) cls.push('is-hot', `is-hot-${hot}`);

  return (
    <section ref={rootRef} className={cls.join(' ')} aria-labelledby="bh-hero-title">
      <div className="bh-hero__frame">
        <div className="bh-hero__copy">
          <p className="bh-hero__kicker">Graphic design &amp; brand identity</p>
          <h1 id="bh-hero-title" className="bh-hero__title">
            A mark that holds up when it moves.
          </h1>
          <p className="bh-hero__lede">
            Logo, color, type and the rules that keep them together. Drawn by a designer, built for web, print and
            packaging.
          </p>
          <div className="bh-hero__ctas">
            <Link to="/contact" className="bw-cta bh-hero__cta">
              Start a brand
            </Link>
            <Link to="/pricing/graphic-design-brand-identity" className="bh-hero__more">
              Packages and prices
            </Link>
          </div>
        </div>

        <div className="bh-hero__bench">
          <div className="bh-hero__stage">
            <div className="bh-hero__plate">
              <p className="bh-hero__tag">
                <i aria-hidden="true" />
                One mark, six places
              </p>
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false">
                {/* The browser tab: the favicon at its real size. */}
                <g data-p="drift-tab">
                  <g {...tp('tab')}>
                    <rect className="bh-hero__fill" x="40" y="600" width="520" height="92" rx="22" />
                    <Mark x={70} y={631} size={30} small />
                    <Words x={118} y={656} size={28} weight={500} full />
                    <path className="bh-hero__x" d="M514 634L538 658M538 634L514 658" />
                  </g>
                </g>

                {/* The app icon. */}
                <g data-p="drift-icon">
                  <g {...tp('icon')}>
                    <rect className="bh-hero__fill" x="640" y="60" width="190" height="190" rx="44" />
                    <Mark x={670} y={90} size={130} />
                  </g>
                </g>

                {/* The avatar, cropped to a circle. */}
                <g data-p="drift-avatar">
                  <g {...tp('avatar')}>
                    <circle className="bh-hero__fill" cx="1000" cy="155" r="95" />
                    <Mark x={935} y={90} size={130} />
                  </g>
                </g>

                {/* The business card, 7:4. */}
                <g data-p="drift-card">
                  <g {...tp('card')}>
                    <rect className="bh-hero__fill" x="1180" y="60" width="380" height="217" rx="14" />
                    <Mark x={1212} y={90} size={86} />
                    <Words x={1212} y={246} size={44} spacing={-1.5} />
                    <Words x={1530} y={108} size={15} weight={500} anchor="end" spacing={1} full />
                  </g>
                </g>

                {/* The shop sign on its bracket. */}
                <g data-p="drift-sign">
                  <g {...tp('sign')}>
                    <rect className="bh-hero__hw" x="40" y="70" width="300" height="16" rx="8" />
                    <rect className="bh-hero__hw" x="128" y="86" width="8" height="64" />
                    <rect className="bh-hero__hw" x="244" y="86" width="8" height="64" />
                    <circle className="bh-hero__fill" cx="190" cy="288" r="140" />
                    <Mark x={125} y={186} size={130} />
                    <Words x={190} y={376} size={34} anchor="middle" spacing={-1} />
                  </g>
                </g>

                {/* The van, side on, facing right. */}
                <g data-p="drift-van">
                  <g {...tp('van')}>
                    <path
                      className="bh-hero__fill"
                      d="M620 488Q620 440 668 440H1340Q1380 440 1402 470L1502 600Q1540 622 1540 668V752Q1540 800 1492 800H668Q620 800 620 752Z"
                    />
                    <path className="bh-hero__cut" d="M1352 478H1394L1470 588H1352Z" />
                    {[780, 1360].map((cx) => (
                      <g key={cx}>
                        <circle className="bh-hero__cut" cx={cx} cy="800" r="84" />
                        <circle className="bh-hero__wheel" cx={cx} cy="800" r="66" />
                        <circle className="bh-hero__hub" cx={cx} cy="800" r="24" />
                      </g>
                    ))}
                    <Mark x={668} y={484} size={220} />
                    <Words x={924} y={690} size={96} spacing={-4} />
                  </g>
                </g>
              </svg>
            </div>

            <div className="bh-hero__caps">
              {CAPS.map((c, i) => (
                <p
                  key={c.key}
                  className={`bh-hero__cap${hot === c.key ? ' is-on' : ''}`}
                  style={{ left: `${c.l}%`, top: `${c.t}%`, width: `${c.w}%`, '--i': i }}
                  {...hover(c.key)}
                >
                  <strong>{c.text[0]}</strong> {c.text[1]}
                </p>
              ))}
            </div>

            <div className="bh-hero__picks" role="group" aria-label="Show a concept">
              {CONCEPTS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  className={`bh-hero__pick${i === concept ? ' is-on' : ''}`}
                  aria-pressed={i === concept}
                  onClick={() => pick(i)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bh-hero__logbox">
          <div className="bh-hero__meta">
            <span>The brand log</span>
            <span className="bh-hero__count">
              {`${runs} mark${runs > 1 ? 's' : ''} tested`}
              <button type="button" className="bh-hero__pause" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </span>
          </div>
          <ol className="bh-hero__log" aria-live={announce ? 'polite' : 'off'}>
            {log.map((l) => (
              <li key={l.id}>
                <b>{l.size}</b>
                <span>{l.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
