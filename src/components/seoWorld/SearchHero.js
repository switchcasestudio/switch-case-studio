import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { f, q, qa } from '../servicePoster/usePosterEngine';

/* The SEO & AI Search world's hero (2026-10-24): the search desk, the AI
   world's workbench rebuilt for search. Same frame (`world-hero` in
   _worldHero.scss), same rules: black field, cream lines, orange as the
   only accent, no glow, captions in zones no line crosses.

   The drawing is the path a search takes to your business: the query (a
   search bar with the Search button), your page (read line by line, each
   line ticked), the index (striped box), the results (five rows; yours is
   the orange one) and the AI answer (a bubble that writes itself and the
   chip that cites your page). It is a machine that runs:
   - Live: while the hero is on screen it runs a search on its own every
     few seconds. The query types, the packet reads the page, the index
     takes it, your row climbs a place or two, the answer writes and cites
     you, or honestly does not. The crawl log gets four lines per search,
     stamped in weeks, because search work is counted in weeks. A Pause
     button stops all of it (WCAG 2.2.2).
   - Reacting: the page's read line follows the pointer, hovering a part or
     its caption lights both, Search runs the next search, and the query
     bar, the page and the answer each start one.
   The SSR markup is the rest state and is complete; the entrance is CSS
   keyframes from first paint. Under reduced motion nothing moves on its
   own and Search writes the log at once. Auto runs are not announced;
   pressed runs are. Your row never reaches first place: nobody can promise
   it, and the caption says so. */

const INTER = "Inter, 'Inter Fallback', sans-serif";
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const THIN = { ...S, strokeWidth: 5 };
const ORANGE = '#ff834a';
const STEP = 300 / 7;
const AUTO_FIRST = 1700;
const AUTO_GAP = 3600;
const ROW_Y = (slot) => 40 + slot * 76;
const REST_SLOT = 2;
const OTHERS = [0, 1, 2, 3];
const PAGE_LINES = [0, 1, 2, 3, 4, 5];
const SCAN = { top: 330, bottom: 650 };

// One search per kind: the query, where your row starts and lands (0 is
// first place, never reached), whether the answer cites you, and the log
// (weeks after the query, then the line).
const JOBS = [
  {
    query: 'emergency plumber portland',
    from: 4,
    to: 2,
    cited: true,
    span: 8,
    lines: [
      [0, 'query: emergency plumber portland'],
      [1, 'page read: title 74 chars, cut to 58'],
      [5, 'rank: 5th to 3rd for the query'],
      [7, 'cited in an AI answer, logged'],
    ],
  },
  {
    query: 'med spa near me',
    from: 3,
    to: 1,
    cited: true,
    span: 7,
    lines: [
      [0, 'query: med spa near me'],
      [1, 'page read: no business schema, added'],
      [4, 'rank: 4th to 2nd for the query'],
      [6, 'cited in an AI answer, logged'],
    ],
  },
  {
    query: 'website cost for a bakery',
    from: 4,
    to: 3,
    cited: false,
    span: 6,
    lines: [
      [0, 'query: website cost for a bakery'],
      [1, 'page read: no prices on the page'],
      [4, 'rank: 5th to 4th for the query'],
      [5, 'not cited: prices added to the list'],
    ],
  },
  {
    query: 'roof repair tampa',
    from: 4,
    to: 2,
    cited: true,
    span: 9,
    lines: [
      [0, 'query: roof repair tampa'],
      [1, 'page read: images 3 MB, compressed'],
      [6, 'rank: 5th to 3rd for the query'],
      [8, 'cited in an AI answer, logged'],
    ],
  },
];

// Each caption sits in a zone no line crosses (viewBox 1600 x 960): under
// the Search button, under the page, under the index, beside the arrow
// under the results, beside the answer's tail. Short copy, because the type
// floors at 12px while the drawing keeps shrinking.
const CAPS = [
  { key: 'query', l: 23.75, t: 20, w: 26, text: ['Query.', 'What a customer types into Google, or asks an AI.'] },
  { key: 'page', l: 2.5, t: 74.5, w: 26, text: ['Your page.', 'Title, schema, speed: read first, then fixed.'] },
  { key: 'index', l: 30, t: 71.5, w: 26, text: ['Index.', 'A fixed page gets read again.'] },
  { key: 'rank', l: 70, t: 44, w: 27.5, text: ['Rank.', 'It climbs. Nobody can promise first.'] },
  { key: 'answer', l: 73.75, t: 89, w: 24, text: ['Answer.', 'Your page, cited as the source.'] },
];

const week = (n) => `wk ${String(((n - 1) % 52) + 1).padStart(2, '0')}`;

const place = (el, path, len) => {
  const pt = path.getPointAtLength(len);
  el.setAttribute('transform', `translate(${f(pt.x)} ${f(pt.y)})`);
};

// Where the other four rows sit when yours is in `slot`.
const slotsAround = (slot) => [0, 1, 2, 3, 4].filter((s) => s !== slot);

export default function SearchHero() {
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const [runs, setRuns] = useState(0);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState(null);
  const [cite, setCite] = useState('yes');
  const [hot, setHot] = useState(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState(false);

  // The engine: searches, the schedule, visibility. Built once; everything
  // it reads lives in refs, everything it shows goes through state setters.
  useEffect(() => {
    const root = rootRef.current;
    const svg = root && root.querySelector('.sw-hero__stage svg');
    if (!svg) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { busy: false, runs: 0, weeks: 0, next: 0, timer: 0, tl: null, visible: false, paused: false };

    const canAuto = () => !reduced && st.visible && !st.paused && !document.hidden;
    const sync = () => setLive(!reduced && st.visible && !st.paused && !document.hidden);
    const push = (line) => setLog((l) => [...l, line].slice(-4));

    const qtext = q(svg, 'qtext');
    const pkt = q(svg, 'pkt');
    const trail = qa(svg, 'trail');
    const ilines = q(svg, 'ilines');
    const you = q(svg, 'you');
    const others = qa(svg, 'row');
    const answer = qa(svg, 'aln');
    const routes = ['r1', 'r2', 'r3', 'r4'].map((k) => q(svg, k));

    const arrange = (slot, duration) => {
      const spots = slotsAround(slot);
      const targets = [[you, slot], ...others.map((row, i) => [row, spots[i]])];
      if (!duration) {
        targets.forEach(([row, s]) => gsap.set(row, { y: ROW_Y(s) }));
        return null;
      }
      const tl = gsap.timeline();
      targets.forEach(([row, s]) => tl.to(row, { y: ROW_Y(s), duration, ease: 'power2.inOut' }, 0));
      return tl;
    };
    gsap.set([you, ...others], { x: 0 });
    arrange(REST_SLOT, 0);

    function schedule(delay) {
      clearTimeout(st.timer);
      if (!canAuto()) return;
      st.timer = setTimeout(() => runJob(st.next, false), delay);
    }

    function runJob(index, manual) {
      if (st.busy) return;
      clearTimeout(st.timer);
      const job = JOBS[index % JOBS.length];
      st.next = (index + 1) % JOBS.length;
      st.runs += 1;
      setRuns(st.runs);
      setAnnounce(manual);
      const base = st.weeks;
      st.weeks += job.span;
      const lines = job.lines.map(([w, text]) => ({ at: week(base + w + 1), text, id: `${st.runs}-${w}` }));
      if (reduced) {
        qtext.textContent = job.query;
        arrange(job.to, 0);
        setCite(job.cited ? 'yes' : 'no');
        setLog((l) => [...l, ...lines].slice(-4));
        return;
      }
      st.busy = true;
      const ride = (path, duration) => {
        const len = path.getTotalLength();
        const o = { p: 0 };
        return gsap.to(o, {
          p: 1,
          duration,
          ease: 'power1.inOut',
          onUpdate: () => {
            place(pkt, path, o.p * len);
            trail.forEach((t, i) => place(t, path, Math.max(0, o.p * len - (i + 1) * 30)));
          },
        });
      };
      const typed = { n: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          st.busy = false;
          st.tl = null;
          setPhase(null);
          schedule(AUTO_GAP);
        },
      });
      st.tl = tl;
      // The query types itself while the results reset for it.
      tl.call(
        () => {
          setPhase('type');
          setCite('pending');
          push(lines[0]);
          qtext.textContent = '';
        },
        null,
        0,
      );
      tl.add(arrange(job.from, 0.35), 0);
      tl.set(answer, { attr: { 'stroke-dashoffset': 1 } }, 0);
      tl.to(
        typed,
        {
          n: job.query.length,
          duration: job.query.length * 0.03,
          ease: 'none',
          onUpdate: () => {
            qtext.textContent = job.query.slice(0, Math.round(typed.n));
          },
        },
        0.05,
      );
      // The page is read, line by line.
      tl.set(pkt, { attr: { opacity: 1 } }, 0.9);
      trail.forEach((t, i) => tl.set(t, { attr: { opacity: [0.5, 0.28, 0.14][i] } }, 0.9));
      tl.add(ride(routes[0], 0.45), 0.9);
      tl.call(
        () => {
          setPhase('crawl');
          push(lines[1]);
        },
        null,
        1.35,
      );
      // Into the index; the stripes take it.
      tl.add(ride(routes[1], 0.6), 2.0);
      tl.call(() => setPhase('index'), null, 2.6);
      tl.to(ilines, { y: -STEP, duration: 0.45, ease: 'power2.inOut' }, 2.6).set(ilines, { y: 0 });
      // Out to the results; your row climbs.
      tl.add(ride(routes[2], 0.7), 3.1);
      tl.call(
        () => {
          setPhase('rank');
          push(lines[2]);
        },
        null,
        3.8,
      );
      tl.add(arrange(job.to, 0.6), 3.8);
      // Down to the answer, which writes itself and cites you, or not.
      tl.add(ride(routes[3], 0.6), 4.5);
      tl.set([pkt, ...trail], { attr: { opacity: 0 } }, 5.1);
      tl.call(() => setPhase('answer'), null, 5.1);
      answer.forEach((ln, i) => tl.to(ln, { attr: { 'stroke-dashoffset': 0 }, duration: 0.35, ease: 'none' }, 5.1 + i * 0.3));
      tl.call(
        () => {
          setCite(job.cited ? 'yes' : 'no');
          setPhase('cite');
          push(lines[3]);
        },
        null,
        6.1,
      );
      tl.to({}, { duration: 0.9 }, 6.1);
    }

    const io = new IntersectionObserver(
      ([e]) => {
        st.visible = e.isIntersecting;
        sync();
        if (st.visible) schedule(st.runs ? AUTO_GAP / 2 : AUTO_FIRST);
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
      run: (index) => runJob(index ?? st.next, true),
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
      gsap.killTweensOf([you, ...others, ilines, ...answer]);
      engineRef.current = null;
    };
  }, []);

  // The pointer: the page's read line follows it. quickTo settles and
  // stops on its own, so nothing ticks while the pointer is still or away.
  // Fine pointers only.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root && root.querySelector('.sw-hero__stage');
    const svg = stage && stage.querySelector('svg');
    if (!svg) return undefined;
    const ok = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!ok) return undefined;
    const scan = q(svg, 'scan');
    const sy = gsap.quickTo(scan, 'y', { duration: 0.45, ease: 'power3' });
    const onMove = (e) => {
      const m = svg.getScreenCTM();
      if (!m) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      sy(Math.max(SCAN.top, Math.min(SCAN.bottom, p.y)) - SCAN.top);
    };
    const onLeave = () => sy(0);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(scan);
    };
  }, []);

  const run = () => engineRef.current && engineRef.current.run();
  const togglePause = () => {
    const p = !paused;
    setPaused(p);
    if (engineRef.current) engineRef.current.setPaused(p);
  };
  const hover = (key) => ({
    onPointerEnter: () => setHot(key),
    onPointerLeave: () => setHot(null),
  });

  const cls = ['sw-hero'];
  if (live) cls.push('is-live');
  if (phase) cls.push(`is-${phase}`);
  if (cite !== 'yes') cls.push(`is-cite-${cite}`);
  if (hot) cls.push('is-hot', `is-hot-${hot}`);

  return (
    <section ref={rootRef} className={cls.join(' ')} aria-labelledby="sw-hero-title">
      <div className="sw-hero__frame">
        <div className="sw-hero__copy">
          <p className="sw-hero__kicker">SEO &amp; AI search</p>
          <h1 id="sw-hero-title" className="sw-hero__title">
            Found on Google. Quoted by AI.
          </h1>
          <p className="sw-hero__lede">
            Technical SEO and AI-search readiness, with every fix shipped on your site. This desk is running now: run a
            search, or click a part.
          </p>
          <div className="sw-hero__ctas">
            <Link to="/contact" className="bw-collage__cta sw-hero__cta">
              Start with an audit
            </Link>
            <Link to="/pricing/marketing-ads" className="sw-hero__more">
              Packages and prices
            </Link>
          </div>
        </div>

        <div className="sw-hero__bench">
          <div className="sw-hero__stage">
            <div className="sw-hero__plate">
              <p className="sw-hero__tag">
                <i aria-hidden="true" />
                The search desk
              </p>
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false">
                <defs>
                  <clipPath id="sw-hero-qclip">
                    <rect x="140" y="75" width="405" height="80" />
                  </clipPath>
                  <clipPath id="sw-hero-iclip">
                    <rect x="460" y="360" width="400" height="300" rx="40" />
                  </clipPath>
                </defs>

                {/* The query: the search bar and its button. */}
                <g data-part="query">
                  <rect className="sw-hero__qbg" x="40" y="70" width="520" height="90" rx="45" {...S} />
                  <circle cx="98" cy="111" r="19" {...THIN} />
                  <path d="M112 125L128 141" {...THIN} />
                  <text
                    data-p="qtext"
                    className="sw-hero__qtext"
                    x="145"
                    y="125"
                    clipPath="url(#sw-hero-qclip)"
                    fontFamily={INTER}
                    fontSize="28"
                    fontWeight="500"
                  >
                    roof repair tampa
                  </text>
                  <rect className="sw-hero__go" x="580" y="70" width="220" height="90" rx="45" {...S} />
                  <text
                    className="sw-hero__goword"
                    x="690"
                    y="127"
                    textAnchor="middle"
                    fontFamily={INTER}
                    fontSize="36"
                    fontWeight="600"
                    letterSpacing="-1"
                  >
                    Search
                  </text>
                </g>

                {/* Your page: read line by line, each line ticked. */}
                <g data-part="page">
                  <rect className="sw-hero__pbg" x="40" y="250" width="300" height="440" rx="24" {...S} />
                  <path d="M40 300H340" {...THIN} />
                  {[70, 94, 118].map((x) => (
                    <circle key={x} cx={x} cy="275" r="6" fill="currentColor" />
                  ))}
                  {PAGE_LINES.map((r) => (
                    <g key={r}>
                      <circle className="sw-hero__tick" cx="80" cy={350 + r * 56} r="13" style={{ '--n': r }} {...THIN} />
                      <path d={`M108 ${350 + r * 56}H${[300, 260, 290, 230, 280, 250][r]}`} {...THIN} />
                    </g>
                  ))}
                  <path data-p="scan" className="sw-hero__scan" d={`M58 ${SCAN.top}H322`} {...THIN} />
                </g>

                {/* The index: the stripes advance one page per search. */}
                <g data-part="index">
                  <g clipPath="url(#sw-hero-iclip)">
                    <rect className="sw-hero__ibg" x="460" y="360" width="400" height="300" />
                    <rect className="sw-hero__inext" x="460" y="360" width="400" height={STEP} />
                    <g data-p="ilines" className="sw-hero__ilines" {...THIN}>
                      {[1, 2, 3, 4, 5, 6, 7].map((k) => (
                        <path key={k} d={`M460 ${360 + STEP * k}H860`} />
                      ))}
                    </g>
                  </g>
                  <rect x="460" y="360" width="400" height="300" rx="40" {...S} />
                </g>

                {/* The results: five rows, yours in orange. */}
                <g data-part="rank">
                  {OTHERS.map((k) => (
                    <g key={k} data-p="row" transform={`translate(0 ${ROW_Y(slotsAround(REST_SLOT)[k])})`}>
                      <rect x="1040" y="0" width="520" height="62" rx="20" {...THIN} />
                      <path d={`M1072 22H${[1330, 1280, 1350, 1300][k]}M1072 42H${[1210, 1240, 1190, 1225][k]}`} {...THIN} />
                    </g>
                  ))}
                  <g data-p="you" className="sw-hero__you" transform={`translate(0 ${ROW_Y(REST_SLOT)})`}>
                    <rect className="sw-hero__yourow" x="1040" y="0" width="520" height="62" rx="20" {...THIN} />
                    <path className="sw-hero__youln" d="M1072 22H1360M1072 42H1250" {...THIN} />
                  </g>
                </g>

                {/* The AI answer: it writes itself and cites your page. */}
                <g data-part="answer">
                  <path
                    className="sw-hero__abg"
                    d="M1070 560H1530a30 30 0 0 1 30 30V790a30 30 0 0 1-30 30H1150l-50 40v-40H1070a30 30 0 0 1-30-30V590a30 30 0 0 1 30-30z"
                    {...S}
                  />
                  {[1500, 1460, 1380].map((x2, i) => (
                    <path key={x2} data-p="aln" d={`M1080 ${615 + i * 40}H${x2}`} pathLength="1" strokeDasharray="1" {...THIN} />
                  ))}
                  <rect className="sw-hero__chip" x="1080" y="732" width="250" height="50" rx="25" {...THIN} />
                  <text className="sw-hero__chipword" x="1205" y="765" textAnchor="middle" fontFamily={INTER} fontSize="24" fontWeight="600">
                    your-site.com
                  </text>
                </g>

                {/* The arrows, and the current that runs along them. */}
                <g className="sw-hero__arrows">
                  <path className="sw-hero__draw" pathLength="1" d="M190 172V236" {...S} />
                  <path className="sw-hero__draw" pathLength="1" d="M172 218L190 236L208 218" {...S} />
                  <path className="sw-hero__draw" pathLength="1" d="M352 470H446" {...S} />
                  <path className="sw-hero__draw" pathLength="1" d="M428 452L446 470L428 488" {...S} />
                  <path className="sw-hero__draw" pathLength="1" d="M872 410C960 410 940 230 1024 230" {...S} />
                  <path className="sw-hero__draw" pathLength="1" d="M1006 212L1024 230L1006 248" {...S} />
                  <path className="sw-hero__draw" pathLength="1" d="M1080 418V538" {...S} />
                  <path className="sw-hero__draw" pathLength="1" d="M1062 520L1080 538L1098 520" {...S} />
                </g>
                <g className="sw-hero__currents" fill="none" stroke={ORANGE} strokeWidth="5" strokeLinecap="round">
                  <path pathLength="1" d="M352 470H440" />
                  <path pathLength="1" d="M872 410C960 410 940 230 1018 230" />
                  <path pathLength="1" d="M1080 418V530" />
                </g>

                {/* The search's routes (invisible), the packet and its trail. */}
                <path data-p="r1" d="M300 115H190V300" fill="none" stroke="none" />
                <path data-p="r2" d="M190 300V470H660V510" fill="none" stroke="none" />
                <path data-p="r3" d="M660 510V410H872C960 410 940 230 1024 230H1300" fill="none" stroke="none" />
                <path data-p="r4" d="M1300 230H1080V757H1205" fill="none" stroke="none" />
                {[11, 8, 5].map((r) => (
                  <circle key={r} data-p="trail" r={r} fill={ORANGE} opacity="0" />
                ))}
                <circle data-p="pkt" r="16" fill={ORANGE} opacity="0" />

                {/* Hit areas: hover lights a part; the query, the page and the answer run a search. */}
                <rect
                  className="sw-hero__hit sw-hero__hit--act"
                  x="30"
                  y="60"
                  width="540"
                  height="110"
                  fill="transparent"
                  {...hover('query')}
                  onClick={run}
                />
                <rect
                  className="sw-hero__hit sw-hero__hit--act"
                  x="30"
                  y="240"
                  width="320"
                  height="460"
                  fill="transparent"
                  {...hover('page')}
                  onClick={run}
                />
                <rect className="sw-hero__hit" x="450" y="350" width="420" height="320" fill="transparent" {...hover('index')} />
                <rect className="sw-hero__hit" x="1030" y="30" width="540" height="390" fill="transparent" {...hover('rank')} />
                <rect
                  className="sw-hero__hit sw-hero__hit--act"
                  x="1030"
                  y="550"
                  width="540"
                  height="280"
                  fill="transparent"
                  {...hover('answer')}
                  onClick={run}
                />
              </svg>

              <button
                type="button"
                className="sw-hero__run"
                style={{ left: '36.25%', top: '7.29%', width: '13.75%', height: '9.375%' }}
                onClick={run}
                onFocus={() => setHot('query')}
                onBlur={() => setHot(null)}
                {...hover('query')}
                aria-label="Run one search through the desk"
              />
            </div>

            <div className="sw-hero__caps">
              {CAPS.map((c, i) => (
                <p
                  key={c.key}
                  className={`sw-hero__cap sw-hero__cap--${c.key}${hot === c.key ? ' is-on' : ''}`}
                  style={{ left: `${c.l}%`, top: `${c.t}%`, width: `${c.w}%`, '--i': i }}
                  {...hover(c.key)}
                >
                  <strong>{c.text[0]}</strong> {c.text[1]}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="sw-hero__logbox">
          <div className="sw-hero__meta">
            <span>The crawl log</span>
            <span className="sw-hero__count">
              {runs ? `${runs} search${runs > 1 ? 'es' : ''}` : 'No searches yet'}
              <button type="button" className="sw-hero__pause" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </span>
          </div>
          <ol className="sw-hero__log" aria-live={announce ? 'polite' : 'off'}>
            {log.length ? (
              log.map((l) => (
                <li key={l.id}>
                  <time>{l.at}</time>
                  <span>{l.text}</span>
                </li>
              ))
            ) : (
              <li>
                <time>wk 00</time>
                <span>waiting for a search</span>
              </li>
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}
