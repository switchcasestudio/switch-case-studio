import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { q } from '../servicePoster/usePosterEngine';
import { Arch, At, Emblem, Lettermark, Name, WordmarkStack } from './marks';

/* The brand world's hero (2026-10-25, owner: "the graphic design page
   structure similar to the other services"; the same day: "leave the five
   Portland made up brand idea aside ... talk about logo in general"). The
   frame, copy, captions, log and Pause are the other worlds' hero
   (`world-hero`, _worldHero.scss); the drawing stays in this world's
   language: flat plates, no outlines.

   The drawing is one brand, "Your brand", on six touchpoints at once: a
   browser tab (the favicon at its real 16px), an app icon, a social
   avatar, a business card, a shop sign and the side of a van. It runs
   through the five kinds of logo (wordmark, lettermark, symbol, emblem,
   combination mark), each drawn the way that kind behaves at each size,
   and the log says what each kind does well and where it struggles:
   - Live: while the hero is on screen it shows the next kind every few
     seconds. The plates flip color smallest first, so the change runs
     from the favicon up to the van; four log lines per kind. Pause stops
     it (WCAG 2.2.2).
   - Reacting: the touchpoints drift toward the pointer, the small ones
     more; hovering a touchpoint or its caption lifts it and dims the rest;
     a click on one shows the next kind; the pills pick one.
   The SSR markup is the rest state (the wordmark) and is complete;
   entrances are CSS keyframes from first paint. CSS owns every color and
   which kind shows (`is-c-<kind>` on the root, a `--d` delay per
   touchpoint); GSAP writes only the drift transforms. Under reduced motion
   nothing switches on its own. Auto switches are not announced; picked
   ones are. */

const AUTO_FIRST = 2200;
const AUTO_GAP = 4200;

// Plate and ink per kind live in brandHero.scss (`$bh-kinds`).
// Log lines stay short: beside the drawing, each is one line.
const KINDS = [
  {
    key: 'wordmark',
    name: 'Wordmark',
    label: 'WORDMARK',
    lines: [
      ['kind', 'wordmark: the name is the mark'],
      ['16 px', 'too small for a name: one letter'],
      ['190 px', 'the name stacks to fit a square'],
      ['13 ft', 'a long van suits a wordmark'],
    ],
  },
  {
    key: 'lettermark',
    name: 'Lettermark',
    label: 'LETTERMARK',
    lines: [
      ['kind', 'lettermark: initials, for long names'],
      ['16 px', 'two letters still read'],
      ['190 px', 'initials fill a square or a circle'],
      ['13 ft', 'letters alone assume people know you'],
    ],
  },
  {
    key: 'symbol',
    name: 'Symbol',
    label: 'SYMBOL',
    lines: [
      ['kind', 'symbol: a shape, earned by being seen'],
      ['16 px', 'the door widens so it stays open'],
      ['24 in', 'once known, it needs no words'],
      ['13 ft', 'a new business still needs its name'],
    ],
  },
  {
    key: 'emblem',
    name: 'Emblem',
    label: 'EMBLEM',
    lines: [
      ['kind', 'emblem: the name inside a shape'],
      ['16 px', 'the words go, the ring stays'],
      ['3.5 in', 'small type needs a good printer'],
      ['24 in', 'at home on a sign, read up close'],
    ],
  },
  {
    key: 'combination',
    name: 'Combination',
    label: 'COMBINATION MARK',
    lines: [
      ['kind', 'combination: symbol and name, locked'],
      ['16 px', 'the symbol goes alone'],
      ['3.5 in', 'the full lockup, side by side'],
      ['13 ft', 'the most flexible kind of logo'],
    ],
  },
];

/* Each slot draws every kind; CSS shows the current one. A slot's art per
   kind: the square slots (icon, avatar), the favicon, and the three
   lockups (card, sign, van), each kind the way it is really used there. */
const SQUARE = {
  wordmark: () => <WordmarkStack />,
  lettermark: () => <Lettermark />,
  symbol: () => <Arch />,
  emblem: () => <Emblem />,
  combination: () => <Arch />,
};
const FAVICON = {
  wordmark: () => <Lettermark size={84} y={80} text="Y" />,
  lettermark: () => <Lettermark size={56} y={70} />,
  symbol: () => <Arch small />,
  emblem: () => <Emblem small />,
  combination: () => <Arch small />,
};
const CARD = {
  wordmark: () => <Name x={1212} y={236} size={54} />,
  lettermark: () => <Name x={1212} y={240} size={100} text="YB" />,
  symbol: () => (
    <At x={1206} y={104} size={140}>
      <Arch />
    </At>
  ),
  emblem: () => (
    <At x={1206} y={96} size={160}>
      <Emblem />
    </At>
  ),
  combination: () => (
    <>
      <At x={1206} y={84} size={96}>
        <Arch />
      </At>
      <Name x={1212} y={246} size={44} />
    </>
  ),
};
const SIGN = {
  wordmark: () => (
    <>
      <Name x={190} y={282} size={50} anchor="middle" text="Your" />
      <Name x={190} y={332} size={50} anchor="middle" text="brand" />
    </>
  ),
  lettermark: () => <Name x={190} y={330} size={118} anchor="middle" text="YB" />,
  symbol: () => (
    <At x={105} y={196} size={170}>
      <Arch />
    </At>
  ),
  emblem: () => (
    <At x={88} y={186} size={204}>
      <Emblem />
    </At>
  ),
  combination: () => (
    <>
      <At x={125} y={180} size={130}>
        <Arch />
      </At>
      <Name x={190} y={376} size={30} anchor="middle" />
    </>
  ),
};
const VAN = {
  wordmark: () => <Name x={680} y={680} size={120} />,
  lettermark: () => <Name x={680} y={690} size={220} text="YB" />,
  symbol: () => (
    <At x={690} y={452} size={250}>
      <Arch />
    </At>
  ),
  emblem: () => (
    <At x={700} y={466} size={244}>
      <Emblem />
    </At>
  ),
  combination: () => (
    <>
      <At x={668} y={472} size={230}>
        <Arch />
      </At>
      <Name x={924} y={690} size={96} />
    </>
  ),
};

function Slot({ art, x = 0, y = 0, size = 100 }) {
  return (
    <At x={x} y={y} size={size}>
      {KINDS.map((k) => {
        const Draw = art[k.key];
        return (
          <g key={k.key} className={`bh-hero__k bh-hero__v bh-hero__v--${k.key}`}>
            <Draw />
          </g>
        );
      })}
    </At>
  );
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

const lineItems = (k, n) => k.lines.map(([size, text], i) => ({ size, text, id: `${n}-${i}` }));

export default function BrandHero() {
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const [kind, setKind] = useState(0);
  const [log, setLog] = useState(() => lineItems(KINDS[0], 1));
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
      const i = index % KINDS.length;
      st.next = (i + 1) % KINDS.length;
      st.runs += 1;
      setAnnounce(manual);
      setKind(i);
      const lines = lineItems(KINDS[i], st.runs);
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

  const cls = ['bh-hero', `is-c-${KINDS[kind].key}`];
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
                Five kinds of logo
              </p>
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false">
                {/* The browser tab: the favicon at its real size. */}
                <g data-p="drift-tab">
                  <g {...tp('tab')}>
                    <rect className="bh-hero__fill" x="40" y="600" width="520" height="92" rx="22" />
                    <Slot art={FAVICON} x={70} y={631} size={30} />
                    <g className="bh-hero__k">
                      <Name x={118} y={656} size={28} weight={500} />
                    </g>
                    <path className="bh-hero__x" d="M514 634L538 658M538 634L514 658" />
                  </g>
                </g>

                {/* The app icon. */}
                <g data-p="drift-icon">
                  <g {...tp('icon')}>
                    <rect className="bh-hero__fill" x="640" y="60" width="190" height="190" rx="44" />
                    <Slot art={SQUARE} x={670} y={90} size={130} />
                  </g>
                </g>

                {/* The avatar, cropped to a circle. */}
                <g data-p="drift-avatar">
                  <g {...tp('avatar')}>
                    <circle className="bh-hero__fill" cx="1000" cy="155" r="95" />
                    <Slot art={SQUARE} x={935} y={90} size={130} />
                  </g>
                </g>

                {/* The business card, 7:4. */}
                <g data-p="drift-card">
                  <g {...tp('card')}>
                    <rect className="bh-hero__fill" x="1180" y="60" width="380" height="217" rx="14" />
                    <Slot art={CARD} />
                    {KINDS.map((k) => (
                      <g key={k.key} className={`bh-hero__k bh-hero__v bh-hero__v--${k.key}`}>
                        <text x="1530" y="100" textAnchor="end" fill="currentColor" fontSize="13" fontWeight="600" letterSpacing="2">
                          {k.label}
                        </text>
                      </g>
                    ))}
                  </g>
                </g>

                {/* The shop sign on its bracket. */}
                <g data-p="drift-sign">
                  <g {...tp('sign')}>
                    <rect className="bh-hero__hw" x="40" y="70" width="300" height="16" rx="8" />
                    <rect className="bh-hero__hw" x="128" y="86" width="8" height="64" />
                    <rect className="bh-hero__hw" x="244" y="86" width="8" height="64" />
                    <circle className="bh-hero__fill" cx="190" cy="288" r="140" />
                    <Slot art={SIGN} />
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
                    <Slot art={VAN} />
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

            <div className="bh-hero__picks" role="group" aria-label="Show a kind of logo">
              {KINDS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  className={`bh-hero__pick${i === kind ? ' is-on' : ''}`}
                  aria-pressed={i === kind}
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
            <span>The logo log</span>
            <span className="bh-hero__count">
              {`Kind ${kind + 1} of ${KINDS.length}`}
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
