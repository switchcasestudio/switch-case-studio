import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

/* The lessons of the Web world's stage (2026-10-26), the brand world's
   "What we know" for the web: one live demo per thing a build has to get
   right, each small enough for a stage tile and plain enough to stack on a
   phone. 01 Speed (a page load on Lighthouse's two test networks, as a
   waterfall), 02 Layout (one page dragged from 320 to 1440 px), 03
   Stability (a page whose ad pushes the text, scored the way Chrome scores
   a layout shift), 04 Response (a filter that freezes the page or works in
   pieces, timed on the visitor's own device), 05 Access (one sign-up card,
   rushed and built right, as a screen reader and a keyboard meet it).
   The only thresholds stated are the published ones: Google's Core Web
   Vitals (LCP 2.5 s / 4 s, INP 200 / 500 ms, CLS 0.1 / 0.25) and WCAG 2.2
   AA. Nothing moves until the visitor does something. Each demo is a
   `bw-lesson` plate with the shared `.bw-ui` controls; the stickers are
   small SVG fact plates. */

const INTER = "Inter, 'Inter Fallback', sans-serif";
const rate = (v, good, poor) => (v <= good ? 'good' : v <= poor ? 'needs work' : 'poor');

/* ---- 01 Speed: weight over distance ---- */

// Lighthouse's own test profiles: mobile is 150 ms round trips at 1.6 Mbps
// with the CPU slowed 4x, desktop 40 ms at 10 Mbps (lighthouse
// constants.js, throttling). KB/s = Mbps x 1024 / 8.
const NETS = [
  { key: 'phone', label: 'Phone, 4G', rtt: 0.15, kbs: 204.8, cpu: 4 },
  { key: 'desk', label: 'Desk, Wi-Fi', rtt: 0.04, kbs: 1280, cpu: 1 },
];
const EXEC = 0.15; // seconds to run the script on a desktop CPU

// A small model, said plainly: three round trips to connect, then every
// file costs a round trip to ask for and shares the line with whatever
// else is downloading. The font waits for the CSS that names it; a
// deferred script waits for the photo. The page paints once its CSS (and
// any blocking script, run) is in; its main content is the photo.
function loadPage(net, sized, deferred) {
  const { rtt, kbs, cpu } = net;
  const jobs = [
    { key: 'html', label: 'HTML', kb: 30, after: null, delay: 3 * rtt + rtt },
    { key: 'css', label: 'CSS', kb: 60, after: 'html', delay: rtt },
    { key: 'img', label: sized ? 'Photo, sized WebP' : 'Photo, from the camera', kb: sized ? 180 : 2400, after: 'html', delay: rtt },
    { key: 'font', label: 'Font', kb: 40, after: 'css', delay: rtt },
    { key: 'js', label: deferred ? 'Script, deferred' : 'Script, blocking', kb: 400, after: deferred ? 'img' : 'html', delay: rtt },
  ].map((j) => ({ ...j, left: j.kb, ask: null, start: null, end: null }));
  const done = {};
  let t = 0;
  for (let guard = 0; guard < 200; guard += 1) {
    jobs.forEach((j) => {
      if (j.start === null && (!j.after || done[j.after] !== undefined)) {
        j.ask = j.after ? done[j.after] : 0;
        j.start = j.ask + j.delay;
      }
    });
    const open = jobs.filter((j) => j.end === null && j.start !== null);
    if (!open.length) break;
    const active = open.filter((j) => j.start <= t + 1e-9);
    const soon = open.filter((j) => j.start > t + 1e-9).map((j) => j.start - t);
    if (!active.length) {
      t += Math.min(...soon);
      continue;
    }
    const share = kbs / active.length;
    const step = Math.min(...active.map((j) => j.left / share), ...soon);
    active.forEach((j) => {
      j.left -= share * step;
    });
    t += step;
    active.forEach((j) => {
      if (j.left <= 1e-6 && j.end === null) {
        j.end = t;
        done[j.key] = t;
      }
    });
  }
  const run = deferred ? 0 : EXEC * cpu;
  const by = Object.fromEntries(jobs.map((j) => [j.key, j]));
  const paint = Math.max(by.css.end, deferred ? 0 : by.js.end + run);
  const lcp = Math.max(paint, by.img.end);
  const kb = jobs.reduce((s, j) => s + j.kb, 0);
  return { jobs, run, paint, lcp, kb };
}

const mb = (kb) => (kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${Math.round(kb)} KB`);

export function PageLoad() {
  const [ni, setNi] = useState(0);
  const [sized, setSized] = useState(false);
  const [deferred, setDeferred] = useState(false);
  const [run, setRun] = useState(0);
  const net = NETS[ni];
  const { jobs, run: exec, lcp, kb } = loadPage(net, sized, deferred);
  const axis = Math.max(4, Math.ceil(lcp + 0.4));
  const pc = (s) => `${(Math.min(s, axis) / axis) * 100}%`;
  const verdict = rate(lcp, 2.5, 4);
  const why = !sized
    ? 'Most of the wait is the photo, straight from the camera.'
    : !deferred
      ? 'The photo is light now; the script still makes the page wait.'
      : 'Photo sized to the screen, script after the content.';
  // Any change replays the load (the visitor asked for it); the bars then
  // grow on one 1.6 s clock, scaled from the model's seconds.
  const again = (fn) => {
    fn();
    setRun((r) => r + 1);
  };
  const ticks = Array.from({ length: Math.floor(axis) + 1 }, (_, i) => i).filter((i) => axis <= 8 || i % 2 === 0);

  return (
    <div className="bw-lesson bw-lesson--light ww-speed">
      <div className="bw-lesson__bar">
        <div className="ww-speed__nets" role="radiogroup" aria-label="Network">
          {NETS.map((n, i) => (
            <button
              key={n.key}
              type="button"
              role="radio"
              aria-checked={ni === i}
              className={`bw-lesson__chip${ni === i ? ' is-on' : ''}`}
              onClick={() => again(() => setNi(i))}
            >
              {n.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`bw-lesson__toggle${sized ? ' is-on' : ''}`}
          aria-pressed={sized}
          onClick={() => again(() => setSized(!sized))}
        >
          Sized photo
        </button>
        <button
          type="button"
          className={`bw-lesson__toggle${deferred ? ' is-on' : ''}`}
          aria-pressed={deferred}
          onClick={() => again(() => setDeferred(!deferred))}
        >
          Deferred script
        </button>
        <button type="button" className="bw-lesson__toggle ww-speed__go" onClick={() => setRun((r) => r + 1)}>
          Reload
        </button>
      </div>

      <div className={`ww-speed__chart${run ? ' is-run' : ''}`} key={run} aria-hidden="true">
        <div className="ww-speed__plot">
          <div className="ww-speed__zones">
            <i style={{ width: pc(2.5) }} />
            <i style={{ left: pc(2.5), width: `calc(${pc(4)} - ${pc(2.5)})` }} />
            <i style={{ left: pc(4), right: 0 }} />
            <span
              className={`ww-speed__lcp${lcp / axis > 0.6 ? ' is-late' : ''}`}
              style={{ left: pc(lcp), '--del': `${(lcp / axis) * 1.6}s` }}
            >
              <b>{lcp.toFixed(1)} s</b>
            </span>
          </div>
          <ol className="ww-speed__rows">
            {jobs.map((j) => (
              <li key={j.key}>
                <span className="ww-speed__name">
                  {j.label} <b>{mb(j.kb)}</b>
                </span>
                <span className="ww-speed__track">
                  <i
                    className="ww-speed__bar"
                    style={{
                      left: pc(j.ask),
                      width: `calc(${pc(j.end)} - ${pc(j.ask)})`,
                      '--wait': `${((j.start - j.ask) / (j.end - j.ask)) * 100}%`,
                      '--del': `${(j.ask / axis) * 1.6}s`,
                      '--dur': `${((j.end - j.ask) / axis) * 1.6}s`,
                    }}
                  />
                  {j.key === 'js' && exec > 0 && (
                    <i
                      className="ww-speed__bar ww-speed__bar--run"
                      style={{
                        left: pc(j.end),
                        width: `calc(${pc(j.end + exec)} - ${pc(j.end)})`,
                        '--del': `${(j.end / axis) * 1.6}s`,
                        '--dur': `${(exec / axis) * 1.6}s`,
                      }}
                    />
                  )}
                </span>
              </li>
            ))}
          </ol>
          <div className="ww-speed__axis">
            {ticks.map((i) => (
              <span key={i} className="ww-speed__tick" style={{ left: pc(i) }}>
                {i}s
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          Main content at {lcp.toFixed(1)} s: {verdict}.
        </strong>{' '}
        {why} Page weight {mb(kb)}.
      </p>
    </div>
  );
}

/* ---- 02 Layout: one page, every width ---- */

const MIN_W = 320;
const MAX_W = 1440;
const PRESETS = [390, 768, 1024, 1440];
// The headline's CSS: clamp(28px, 16px + 2.5vw, 56px).
const headPx = (w) => Math.round(Math.min(56, Math.max(28, 16 + w * 0.025)));
const colsAt = (w) => (w < 600 ? 1 : w < 1024 ? 2 : 3);
const nameAt = (w) => (w < 600 ? 'phone' : w < 1024 ? 'tablet' : 'desktop');

export function Reflow() {
  const id = useId();
  const roomRef = useRef(null);
  const [w, setW] = useState(1024);
  const [k, setK] = useState(0.4);
  const [drag, setDrag] = useState(false);

  // Scale: the widest page (1440) fills the room.
  useEffect(() => {
    const el = roomRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => setK(Math.min(1, (el.clientWidth - 18) / MAX_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const widthAt = (e) => {
    const r = roomRef.current.getBoundingClientRect();
    return Math.round(Math.min(MAX_W, Math.max(MIN_W, (e.clientX - r.left) / k)));
  };
  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag(true);
  };
  const onMove = (e) => {
    if (drag) setW(widthAt(e));
  };
  const onUp = () => setDrag(false);
  const onKey = (e) => {
    const step = { ArrowLeft: -20, ArrowRight: 20 }[e.key];
    if (!step) return;
    e.preventDefault();
    setW((v) => Math.min(MAX_W, Math.max(MIN_W, v + step)));
  };

  const cols = colsAt(w);
  const menu = w < 768;
  const wide = w >= 1024;
  const h = headPx(w);
  return (
    <div className="bw-lesson bw-lesson--dark ww-flow">
      <div className="bw-lesson__bar">
        <div className="bw-lesson__ctl">
          <label className="bw-ui__lab" htmlFor={`${id}-w`}>
            Screen width
          </label>
          <span className="bw-ui__val" aria-hidden="true">
            {w}px
          </span>
          <input
            id={`${id}-w`}
            className="bw-ui__range"
            type="range"
            min={MIN_W}
            max={MAX_W}
            value={w}
            aria-valuetext={`${w} pixels, ${nameAt(w)}`}
            onChange={(e) => setW(+e.target.value)}
          />
        </div>
        <div className="ww-flow__presets" role="group" aria-label="Common widths">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`bw-lesson__chip${w === p ? ' is-on' : ''}`}
              aria-pressed={w === p}
              onClick={() => setW(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div ref={roomRef} className={`ww-flow__room${drag ? ' is-drag' : ''}`}>
        <div
          className={`ww-flow__page${menu ? ' is-menu' : ''}${wide ? ' is-wide' : ''}`}
          style={{ width: w * k, '--k': k, '--cols': cols }}
          aria-hidden="true"
        >
          <div className="ww-flow__nav">
            <i className="ww-flow__logo" />
            {menu ? (
              <span className="ww-flow__burger">
                <i />
                <i />
                <i />
              </span>
            ) : (
              <span className="ww-flow__links">
                <i />
                <i />
                <i />
                <i className="is-cta" />
              </span>
            )}
          </div>
          <div className="ww-flow__hero">
            <div className="ww-flow__copy">
              <p className="ww-flow__h" style={{ fontSize: h * k }}>
                Your headline, at every width.
              </p>
              <i />
              <i />
            </div>
            <span className="ww-flow__img" />
          </div>
          <div className="ww-flow__cards">
            <i />
            <i />
            <i />
          </div>
        </div>
        <button
          type="button"
          className="ww-flow__edge"
          style={{ left: w * k }}
          aria-label={`Window edge at ${w} pixels. Drag it, or use the arrow keys.`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        />
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          {w} px, {nameAt(w)}.
        </strong>{' '}
        {cols} column{cols > 1 ? 's' : ''}, the menu {menu ? 'folded into a button' : 'in full'}, the headline at {h} px:
        clamp(28px, 16px + 2.5vw, 56px).
      </p>
    </div>
  );
}

/* ---- 03 Stability: nothing jumps ---- */

// Chrome's layout shift score: the share of the viewport the moving part
// touches (before and after), times how far it moved over the viewport's
// longer side. Measured here on the demo's own frame, phone-shaped, so the
// longer side is its height, as on a phone.
const shiftOf = (frame, before, after) => {
  const top = Math.max(frame.top, Math.min(before.top, after.top));
  const bottom = Math.min(frame.bottom, Math.max(before.bottom, after.bottom));
  const left = Math.max(frame.left, before.left);
  const right = Math.min(frame.right, before.right);
  const impact = (Math.max(0, bottom - top) * Math.max(0, right - left)) / (frame.width * frame.height);
  const distance = Math.abs(after.top - before.top) / Math.max(frame.width, frame.height);
  return { impact, distance, score: impact * distance };
};
// The load, in steps: the text, then the ad lands, then the banner.
const STEPS = ['text', 'ad', 'banner'];
const WHAT = { ad: 'The ad lands', banner: 'The banner lands' };

export function ShiftTest() {
  const frameRef = useRef(null);
  const restRef = useRef(null);
  const pageRef = useRef(null);
  const pending = useRef(null);
  const timers = useRef([]);
  const [reserve, setReserve] = useState(false);
  const [phase, setPhase] = useState('done');
  const [shifts, setShifts] = useState(null);
  const [hit, setHit] = useState(null);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  // Before a step: note where the part that will move is. After it
  // renders (before paint): measure it again and log the shift.
  const step = (next, el) => {
    pending.current = { next, el, rect: el.current ? el.current.getBoundingClientRect() : null };
    setPhase(next);
  };
  useLayoutEffect(() => {
    const p = pending.current;
    pending.current = null;
    if (!p || !p.rect || !frameRef.current || !p.el.current) return;
    const s = shiftOf(frameRef.current.getBoundingClientRect(), p.rect, p.el.current.getBoundingClientRect());
    // Only a part that moved is a shift.
    if (s.distance > 0.001) setShifts((list) => [...(list || []), { what: WHAT[p.next], ...s }]);
  }, [phase]);

  const load = (res = reserve) => {
    clear();
    setHit(null);
    setShifts([]);
    setPhase('text');
    const slow = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1.6 : 1;
    timers.current.push(setTimeout(() => step('ad', restRef), 900 * slow));
    timers.current.push(setTimeout(() => step('banner', pageRef), 1800 * slow));
    timers.current.push(setTimeout(() => setPhase('done'), 2400 * slow));
  };
  const at = STEPS.indexOf(phase === 'done' ? 'banner' : phase);
  const ad = at >= 1;
  const banner = at >= 2;
  const total = shifts ? shifts.reduce((sum, x) => sum + x.score, 0) : null;
  const verdict = total === null ? null : rate(total, 0.1, 0.25);

  let note;
  if (hit === 'ad') note = 'You pressed the ad: the text moved under your finger as it loaded.';
  else if (hit === 'read') note = 'You pressed Read more, where you aimed.';
  else if (shifts === null) note = 'Press Load, then try to press Read more while the page loads.';
  else if (phase !== 'done') note = 'Loading. Try to press Read more.';
  else if (reserve) note = 'The ad landed in its space and the banner floats over the page. Nothing moved.';
  else note = 'The ad pushed the text down, then the banner pushed everything.';

  return (
    <div className="bw-lesson bw-lesson--light ww-shift">
      <div className="bw-lesson__bar">
        <button type="button" className="bw-lesson__toggle is-on" onClick={() => load()}>
          Load the page
        </button>
        <button
          type="button"
          className={`bw-lesson__toggle${reserve ? ' is-on' : ''}`}
          aria-pressed={reserve}
          onClick={() => {
            setReserve(!reserve);
            load(!reserve);
          }}
        >
          Reserve space
        </button>
      </div>

      <div className="ww-shift__body">
        <div ref={frameRef} className="ww-shift__frame">
          <div className="ww-shift__doc">
            {banner && !reserve && (
              <div className="ww-shift__banner">
                <span>10% off: sign up</span>
                <i />
              </div>
            )}
            <div ref={pageRef} className="ww-shift__page">
              <div className="ww-shift__head">
                <i />
                <b>Your article</b>
              </div>
              <p className="ww-shift__title">How it was made</p>
              {(reserve || ad) && (
                <button type="button" className={`ww-shift__ad${ad ? ' is-in' : ''}`} tabIndex={-1} onClick={() => setHit('ad')}>
                  {ad ? 'Ad' : 'Ad space'}
                </button>
              )}
              <div ref={restRef} className="ww-shift__rest">
                <i />
                <i />
                <button type="button" className="ww-shift__read" onClick={() => setHit('read')}>
                  Read more
                </button>
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
          {banner && reserve && (
            <div className="ww-shift__banner ww-shift__banner--over">
              <span>10% off: sign up</span>
              <i />
            </div>
          )}
        </div>

        <div className="ww-shift__log">
          <p className="ww-shift__lab">Shifts, as Chrome scores them</p>
          <ol>
            {(shifts && shifts.length ? shifts : []).map((x) => (
              <li key={x.what}>
                <span>{x.what}</span>
                <b>
                  {x.impact.toFixed(2)} × {x.distance.toFixed(2)} = {x.score.toFixed(2)}
                </b>
              </li>
            ))}
            {shifts && !shifts.length && phase !== 'text' && <li className="is-quiet">Nothing has moved yet.</li>}
            {shifts === null && <li className="is-quiet">Each shift is listed here as the page loads.</li>}
          </ol>
          <p className={`ww-shift__total${verdict ? ` is-${verdict.replace(' ', '-')}` : ''}`}>
            <span>Total</span>
            <b>{total === null ? '0.00' : total.toFixed(2)}</b>
            <em>{verdict || 'good under 0.1'}</em>
          </p>
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        {verdict && phase === 'done' && <strong>Shift score {total.toFixed(2)}: {verdict}. </strong>}
        {note}
      </p>
    </div>
  );
}

/* ---- 04 Response: a tap answers at once ---- */

const WORK = 600; // ms of work behind the button, either way
const WINDOW = 2000; // ms of frames shown
const PIECES = 20;

const busy = (ms) => {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // The page cannot paint, scroll or answer anything else in here.
  }
};
// Between pieces, a plain task: rendering outranks it, so the page paints.
// (scheduler.yield() resumes ahead of rendering, and Chrome starved the
// paint for ~180 ms; measured 2026-10-26.)
const nextTask = () => new Promise((r) => setTimeout(r, 0));
const nextPaint = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

export function InputDelay() {
  const stripRef = useRef(null);
  const rafRef = useRef(0);
  const [mode, setMode] = useState('block');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [gap, setGap] = useState(null);
  const [results, setResults] = useState(1204);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Every frame the browser paints in the next two seconds is a tick; a
  // frozen page leaves a gap.
  const record = (t0) => {
    cancelAnimationFrame(rafRef.current);
    const path = stripRef.current;
    const frames = [];
    const tick = (now) => {
      frames.push(now - t0);
      if (path) path.setAttribute('d', frames.map((f) => `M${((f / WINDOW) * 600).toFixed(1)} 4V36`).join(''));
      if (now - t0 < WINDOW) rafRef.current = requestAnimationFrame(tick);
      else {
        let g = frames[0] || 0;
        for (let i = 1; i < frames.length; i += 1) g = Math.max(g, frames[i] - frames[i - 1]);
        setGap(Math.round(g));
      }
    };
    if (path) path.setAttribute('d', '');
    rafRef.current = requestAnimationFrame(tick);
  };

  const press = async (e) => {
    if (status === 'working') return;
    const t0 = e.timeStamp || performance.now();
    setAnswer(null);
    setGap(null);
    record(t0);
    // The answer is on screen at the first frame after it: rAF runs just
    // before that paint.
    const measure = () => requestAnimationFrame(() => setAnswer(Math.round(performance.now() - t0)));
    const next = results === 1204 ? 312 : 1204;
    if (mode === 'block') {
      busy(WORK);
      setResults(next);
      setStatus('done');
      measure();
      return;
    }
    setStatus('working');
    setProgress(0);
    measure();
    // Let the answer paint first, then work in pieces.
    await nextPaint();
    for (let i = 1; i <= PIECES; i += 1) {
      await nextTask();
      busy(WORK / PIECES);
      setProgress(i / PIECES);
    }
    setResults(next);
    setStatus('done');
  };

  const verdict = answer === null ? null : rate(answer, 200, 500);
  let note;
  if (answer === null) note = `Press Filter. Behind it is ${WORK / 1000} seconds of work either way.`;
  else if (mode === 'block') note = 'The page froze until the work was done: no paint, no scroll.';
  else note = `The same ${WORK / 1000} seconds of work, cut into ${PIECES} pieces; the page kept painting between them.`;

  return (
    <div className="bw-lesson bw-lesson--dark ww-input">
      <div className="bw-lesson__bar">
        <div className="ww-input__modes" role="radiogroup" aria-label="How the work runs">
          {[
            ['block', 'All at once'],
            ['pieces', 'In pieces'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={mode === key}
              className={`bw-lesson__chip${mode === key ? ' is-on' : ''}`}
              onClick={() => {
                setMode(key);
                setAnswer(null);
                setGap(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="ww-input__shop">
        <div className="ww-input__row">
          <button
            type="button"
            className={`ww-input__btn${status === 'working' ? ' is-busy' : ''}`}
            onClick={press}
            aria-busy={status === 'working'}
          >
            {status === 'working' ? 'Filtering' : results === 1204 ? 'Filter: in stock' : 'Show everything'}
            <i style={{ transform: `scaleX(${status === 'working' ? progress : 0})` }} />
          </button>
          <span className="ww-input__count">{results.toLocaleString('en-US')} products</span>
        </div>
        <div className="ww-input__grid" aria-hidden="true">
          {Array.from({ length: results === 1204 ? 8 : 3 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="ww-input__strip" aria-hidden="true">
          <span className="ww-input__lab">Frames painted, 2 s</span>
          <svg viewBox="0 0 600 40" preserveAspectRatio="none">
            <path ref={stripRef} />
          </svg>
          <span className="ww-input__lab">{gap === null ? ' ' : `Longest gap ${gap} ms`}</span>
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        {verdict && (
          <strong>
            Answered in {answer} ms: {verdict}.{' '}
          </strong>
        )}
        {note}
      </p>
    </div>
  );
}

/* ---- 05 Access: built for every hand and eye ---- */

// WCAG 2 relative luminance and contrast ratio (the brand world's Color
// lesson uses the same math).
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const CARD_BG = '#ffffff';
const BUILDS = {
  rushed: {
    small: '#a8a29e',
    close: 16,
    // What a screen reader says, in reading order; `tab` is the keyboard's
    // stop number, or 0 for a control the keyboard cannot reach.
    say: [
      { part: 'head', text: 'Get our news', note: 'read as plain text, not a heading' },
      { part: 'close', text: 'button', note: 'a button with no name', tab: 1, unnamed: true },
      { part: 'label', text: 'Your email' },
      { part: 'input', text: 'edit text', note: 'the field has no name', tab: 2, unnamed: true },
      { part: 'small', text: 'We never share it.' },
      { part: 'go', text: 'Go', note: 'plain text: a keyboard cannot reach it', tab: 0 },
    ],
  },
  right: {
    small: '#57534e',
    close: 44,
    say: [
      { part: 'head', text: 'Get our news, heading level 2' },
      { part: 'close', text: 'Close, button', tab: 1 },
      { part: 'input', text: 'Email, edit text', tab: 2 },
      { part: 'small', text: 'We never share it.' },
      { part: 'go', text: 'Sign up, button', tab: 3 },
    ],
  },
};

export function A11yCard() {
  const timer = useRef(0);
  const [build, setBuild] = useState('rushed');
  const [tabs, setTabs] = useState(false);
  const [reading, setReading] = useState(-1);
  const b = BUILDS[build];
  const say = b.say;
  const ratio = contrast(b.small, CARD_BG);
  const unnamed = say.filter((s) => s.unnamed).length;
  const unreachable = say.filter((s) => s.tab === 0).length;

  useEffect(() => () => clearTimeout(timer.current), []);
  const stop = () => {
    clearTimeout(timer.current);
    setReading(-1);
  };
  const read = (i = 0) => {
    clearTimeout(timer.current);
    if (i >= say.length) {
      setReading(-1);
      return;
    }
    setReading(i);
    timer.current = setTimeout(() => read(i + 1), 1500);
  };
  const pick = (key) => {
    stop();
    setBuild(key);
  };
  const on = reading >= 0 ? say[reading] : null;
  const ring = (part) => (on && on.part === part ? ' is-read' : '');
  const tabOf = (part) => {
    const s = say.find((x) => x.part === part);
    return s && s.tab !== undefined ? s.tab : null;
  };
  const Badge = ({ part }) => {
    const n = tabOf(part);
    if (!tabs || n === null) return null;
    return <span className={`ww-a11y__tab${n ? '' : ' is-skip'}`}>{n || '×'}</span>;
  };

  return (
    <div className="bw-lesson bw-lesson--light ww-a11y">
      <div className="bw-lesson__bar">
        <div role="radiogroup" aria-label="How the card was built" className="ww-a11y__builds">
          {[
            ['rushed', 'Rushed'],
            ['right', 'Built right'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={build === key}
              className={`bw-lesson__chip${build === key ? ' is-on' : ''}`}
              onClick={() => pick(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className={`bw-lesson__toggle${tabs ? ' is-on' : ''}`} aria-pressed={tabs} onClick={() => setTabs(!tabs)}>
          Tab order
        </button>
        <button
          type="button"
          className={`bw-lesson__toggle${reading >= 0 ? ' is-on' : ''}`}
          aria-pressed={reading >= 0}
          onClick={() => (reading >= 0 ? stop() : read(0))}
        >
          {reading >= 0 ? 'Stop' : 'Screen reader'}
        </button>
      </div>

      <div className="ww-a11y__body">
        <div className={`ww-a11y__card is-${build}`} aria-hidden="true">
          <span className={`ww-a11y__close${ring('close')}`} style={{ '--s': `${b.close}px` }}>
            ×
            <Badge part="close" />
          </span>
          <p className={`ww-a11y__head${ring('head')}`}>Get our news</p>
          <p className={`ww-a11y__label${ring(build === 'rushed' ? 'label' : 'input')}`}>
            {build === 'rushed' ? 'Your email' : 'Email'}
          </p>
          <span className={`ww-a11y__input${ring('input')}`}>
            <Badge part="input" />
          </span>
          <p className={`ww-a11y__small${ring('small')}`} style={{ color: b.small }}>
            We never share it.
          </p>
          <span className={`ww-a11y__go${ring('go')}`}>
            {build === 'rushed' ? 'Go' : 'Sign up'}
            <Badge part="go" />
          </span>
        </div>

        <dl className="ww-a11y__checks">
          <div>
            <dt>Small print</dt>
            <dd className={ratio >= 4.5 ? 'is-ok' : 'is-bad'}>
              {ratio.toFixed(1)}:1, {ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fails'}
            </dd>
          </div>
          <div>
            <dt>Close target</dt>
            <dd className={b.close >= 24 ? 'is-ok' : 'is-bad'}>
              {b.close} px{b.close >= 24 ? '' : ', under 24'}
            </dd>
          </div>
          <div>
            <dt>Keyboard</dt>
            <dd className={unreachable ? 'is-bad' : 'is-ok'}>{unreachable ? 'Go is out of reach' : 'reaches all 3'}</dd>
          </div>
          <div>
            <dt>Names</dt>
            <dd className={unnamed ? 'is-bad' : 'is-ok'}>{unnamed ? `${unnamed} controls unnamed` : 'every control named'}</dd>
          </div>
        </dl>
      </div>

      <p className="bw-lesson__note ww-a11y__say" aria-live="polite">
        {on ? (
          <>
            <strong>Says: “{on.text}”</strong>
            {on.note ? `, ${on.note}.` : ''}
          </>
        ) : build === 'rushed' ? (
          'It looks fine. Press Screen reader, or show the tab order, to meet it the way some visitors do.'
        ) : (
          'Same card: every control has a name, the keyboard reaches all three, and the small print reads.'
        )}
      </p>
    </div>
  );
}

/* ---- Stickers: one fact per plate ---- */

// Sticker plates show at about half their 400 width, so type starts at 18.
const META = { fontFamily: INTER, fontSize: 18, fontWeight: 700, letterSpacing: 2 };

export function VitalsCard() {
  const rows = [
    ['2.5 s', 'LCP', 'the main content shows'],
    ['200 ms', 'INP', 'a tap gets its answer'],
    ['0.1', 'CLS', 'nothing jumps'],
  ];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        GOOD IS UNDER
      </text>
      {rows.map(([v, k, say], i) => (
        <g key={k} transform={`translate(28 ${70 + i * 62})`}>
          <text y="34" className="bw-f-orange" fontFamily={INTER} fontSize="34" fontWeight="800" letterSpacing="-1">
            {v}
          </text>
          <text x="150" y="16" className="bw-f-cream" fontFamily={INTER} fontSize="18" fontWeight="700">
            {k}
          </text>
          <text x="150" y="38" className="bw-f-cream" fontFamily={INTER} fontSize="18" opacity="0.75">
            {say}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        CORE WEB VITALS
      </text>
    </svg>
  );
}

export function Breakpoints() {
  const widths = [390, 768, 1024, 1440];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-lavender" />
      {widths.map((w, i) => (
        <g key={w} transform={`translate(28 ${26 + i * 56})`}>
          <rect width={(w / 1440) * 344} height="34" rx="6" fill="none" className="bw-s-ink" strokeWidth="3" />
          <text x={(w / 1440) * 344 + (w < 1000 ? 12 : -12)} y="24" textAnchor={w < 1000 ? 'start' : 'end'} className="bw-f-ink" fontFamily={INTER} fontSize="19" fontWeight="700">
            {w}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-ink" {...META}>
        ONE LAYOUT, FOUR WIDTHS
      </text>
    </svg>
  );
}

export function ShiftFormula() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <rect x="28" y="28" width="150" height="168" rx="10" fill="none" className="bw-s-cream" strokeWidth="3" />
      <rect x="44" y="48" width="118" height="54" rx="6" fill="none" className="bw-s-cream" strokeWidth="3" strokeDasharray="6 6" opacity="0.6" />
      <rect x="44" y="110" width="118" height="54" rx="6" className="bw-f-orange" />
      <path d="M103 76V100M94 91L103 100L112 91" fill="none" className="bw-s-cream" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="200" y="76" className="bw-f-cream" fontFamily={INTER} fontSize="24" fontWeight="800">
        impact
      </text>
      <text x="200" y="112" className="bw-f-orange" fontFamily={INTER} fontSize="30" fontWeight="800">
        ×
      </text>
      <text x="200" y="152" className="bw-f-cream" fontFamily={INTER} fontSize="24" fontWeight="800">
        distance
      </text>
      <text x="28" y="240" className="bw-f-cream" fontFamily={INTER} fontSize="18" opacity="0.75">
        how much moved, times how far
      </text>
      <text x="28" y="282" className="bw-f-cream" {...META}>
        HOW A SHIFT IS SCORED
      </text>
    </svg>
  );
}

export function FrameBudget() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-cream" />
      <text x="28" y="118" className="bw-f-ink" fontFamily={INTER} fontSize="84" fontWeight="800" letterSpacing="-3">
        16.7
      </text>
      <text x="236" y="118" className="bw-f-ink" fontFamily={INTER} fontSize="30" fontWeight="700">
        ms
      </text>
      <text x="28" y="160" className="bw-f-ink" fontFamily={INTER} fontSize="19" opacity="0.75">
        one frame on a 60 Hz screen
      </text>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={28 + i * 29} y="190" width="20" height="34" rx="4" className={i === 5 ? 'bw-f-orange' : 'bw-f-ink'} opacity={i === 5 ? 1 : 0.85} />
      ))}
      <text x="28" y="282" className="bw-f-ink" {...META}>
        THE TIME A FRAME HAS
      </text>
    </svg>
  );
}

export function WcagCard() {
  const rows = [
    ['4.5:1', 'contrast for text'],
    ['24 px', 'smallest target'],
    ['Tab', 'reaches everything'],
  ];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      {rows.map(([v, say], i) => (
        <g key={v} transform={`translate(28 ${36 + i * 64})`}>
          <text y="34" className="bw-f-orange" fontFamily={INTER} fontSize="34" fontWeight="800" letterSpacing="-1">
            {v}
          </text>
          <text x="128" y="28" className="bw-f-cream" fontFamily={INTER} fontSize="18">
            {say}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        WCAG 2.2, LEVEL AA
      </text>
    </svg>
  );
}
