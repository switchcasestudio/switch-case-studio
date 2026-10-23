import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { f, q, qa } from '../servicePoster/usePosterEngine';

/* The AI world's hero (2026-10-23, owner: "this should be the hero of this
   page ... 100vh, add some purple, live and reacting animation"). It
   replaced the scroll collage, which belongs to the brand world.

   The drawing is the owner's workbench: a trigger, the agent (the outlined
   "a"), the queue (the striped box), the Run pill and the circle with a
   slash for what stays human, joined by long open arrows. It is a machine
   that runs:
   - Live: while the hero is on screen it runs a job on its own every few
     seconds (a form lead, a missed call, a refund, a new sheet row). The
     packet leaves the queue, the agent thinks, the job lands on Run, or on
     the human circle when the rule says a person decides. The log under
     the headline gets the agent's four lines per job. Purple current runs
     along the arrows. A Pause button stops all of it (WCAG 2.2.2).
   - Reacting: the agent leans toward the pointer and glows as it nears,
     its dot follows the pointer, hovering a part or its caption lights
     both, Run runs the next job, the trigger starts one, the human circle
     sends a refund through.
   The SSR markup is the rest state and is complete; the entrance (arrows
   drawing, captions arriving) is CSS keyframes from first paint (the house
   rule for first-screen content). Under reduced motion nothing moves on
   its own and Run writes the log at once. Auto runs are not announced;
   pressed runs are. */

const INTER = "Inter, 'Inter Fallback', sans-serif";
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 18, strokeLinecap: 'round', strokeLinejoin: 'round' };
const THIN = { ...S, strokeWidth: 12 };
const LAVENDER = '#dab8ff';
const STEP = 330 / 7;
const AUTO_FIRST = 1700;
const AUTO_GAP = 3600;
const AGENT = { x: 530, y: 500 };
const DOT = { x: 300, y: 520 };

// One job per trigger kind: where it lands, and what the agent writes
// (seconds after the trigger, then the line).
const JOBS = [
  {
    to: 'run',
    span: 47,
    lines: [
      [0, 'lead in, from the site form'],
      [2, 'context read: 3 emails, 1 open invoice'],
      [9, 'reply drafted, slot held for Tue 10:00'],
      [41, 'sent to the owner for a yes, logged'],
    ],
  },
  {
    to: 'run',
    span: 31,
    lines: [
      [0, 'missed call, 3:12 am'],
      [1, 'caller matched: returning client'],
      [6, 'text sent: we call back at 9:00'],
      [8, 'callback booked, logged'],
    ],
  },
  {
    to: 'human',
    span: 26,
    lines: [
      [0, 'email in: a refund request'],
      [3, 'rule: refunds stay with a person'],
      [4, 'handed to the owner, nothing sent'],
      [5, 'logged, waiting on a yes'],
    ],
  },
  {
    to: 'run',
    span: 38,
    lines: [
      [0, 'new row in the orders sheet'],
      [2, 'invoice drafted from the row'],
      [5, 'invoice sent, pay link attached'],
      [6, 'sheet updated, logged'],
    ],
  },
];
const REFUND = 2;

const CAPS = [
  {
    key: 'trigger',
    l: 4.4,
    t: 15,
    text: ['Trigger.', 'A form, a missed call, a new row in the sheet. Anything that happens can start a run.'],
  },
  {
    key: 'queue',
    l: 62.5,
    t: 53,
    text: ['Queue.', 'Jobs wait their turn. Each step is written down before the next one starts.'],
  },
  {
    key: 'agent',
    l: 38.5,
    t: 66,
    w: 16.5,
    text: ['Agent.', 'Reads the context, decides, drafts. It asks a person whenever the rule says so.'],
  },
  { key: 'human', l: 4.4, t: 80, w: 11, text: ['Kept human.', 'The refund, the apology, the hard call.'] },
  { key: 'run', l: 56.5, t: 90, text: ['Run.', 'One press, a schedule, or an event. Then the log.'] },
];

const stamp = (s) => {
  const h = 3 + Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `0${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const place = (el, path, len) => {
  const pt = path.getPointAtLength(len);
  el.setAttribute('transform', `translate(${f(pt.x)} ${f(pt.y)})`);
};

export default function WorkbenchHero() {
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const [runs, setRuns] = useState(0);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState(null);
  const [hot, setHot] = useState(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState(false);

  // The engine: jobs, the schedule, visibility. Built once; everything it
  // reads lives in refs, everything it shows goes through state setters.
  useEffect(() => {
    const root = rootRef.current;
    const svg = root && root.querySelector('.aw-hero__stage svg');
    if (!svg) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { busy: false, runs: 0, clock: 0, next: 0, timer: 0, tl: null, visible: false, paused: false };

    const canAuto = () => !reduced && st.visible && !st.paused && !document.hidden;
    const sync = () => setLive(!reduced && st.visible && !st.paused && !document.hidden);
    const push = (line) => setLog((l) => [...l, line].slice(-4));

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
      const base = st.clock;
      st.clock += job.span;
      const lines = job.lines.map(([s, text]) => ({ at: stamp(base + s), text, id: `${st.runs}-${s}` }));
      if (reduced) {
        setLog((l) => [...l, ...lines].slice(-4));
        return;
      }
      st.busy = true;
      const pkt = q(svg, 'pkt');
      const trail = qa(svg, 'trail');
      const qlines = q(svg, 'qlines');
      const routeIn = q(svg, 'route-in');
      const routeOut = q(svg, job.to === 'human' ? 'route-human' : 'route-run');
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
      const tl = gsap.timeline({
        onComplete: () => {
          st.busy = false;
          st.tl = null;
          setPhase(null);
          schedule(AUTO_GAP);
        },
      });
      st.tl = tl;
      tl.call(
        () => {
          setPhase('fire');
          push(lines[0]);
        },
        null,
        0,
      );
      tl.to(qlines, { y: -STEP, duration: 0.45, ease: 'power2.inOut' }, 0.25).set(qlines, { y: 0 });
      tl.call(() => setPhase('queue'), null, 0.45);
      tl.set(pkt, { attr: { opacity: 1 } }, 0.55);
      trail.forEach((t, i) => tl.set(t, { attr: { opacity: [0.5, 0.28, 0.14][i] } }, 0.55));
      tl.add(ride(routeIn, 0.8), 0.55);
      tl.call(
        () => {
          setPhase('think');
          push(lines[1]);
        },
        null,
        1.35,
      );
      tl.add(ride(routeOut, 1.1), 2.05);
      tl.call(
        () => {
          setPhase(job.to === 'human' ? 'human' : 'land');
          push(lines[2]);
        },
        null,
        3.15,
      );
      tl.set([pkt, ...trail], { attr: { opacity: 0 } }, 3.2);
      tl.call(() => push(lines[3]), null, 3.65);
      tl.to({}, { duration: 0.75 }, 3.65);
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
      runAny: () => runJob(st.next === REFUND ? REFUND + 1 : st.next, true),
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

  // The pointer: the agent leans toward it and glows as it nears, the dot
  // follows it. quickTo tweens settle and stop on their own, so nothing
  // ticks while the pointer is still or away. Fine pointers only.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root && root.querySelector('.aw-hero__stage');
    const svg = stage && stage.querySelector('svg');
    if (!svg) return undefined;
    const ok = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!ok) return undefined;
    const agent = q(svg, 'agent');
    const glow = q(svg, 'glow');
    const dot = q(svg, 'dot');
    gsap.set(agent, { svgOrigin: `${AGENT.x} 640` });
    const lean = gsap.quickTo(agent, 'rotation', { duration: 0.8, ease: 'power3' });
    const glowTo = gsap.quickTo(glow, 'opacity', { duration: 0.5, ease: 'power2' });
    const dx = gsap.quickTo(dot, 'x', { duration: 0.5, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.5, ease: 'power3' });
    const onMove = (e) => {
      const m = svg.getScreenCTM();
      if (!m) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      const ax = p.x - AGENT.x;
      const ay = p.y - AGENT.y;
      lean(Math.max(-1, Math.min(1, ax / 800)) * 7);
      glowTo(Math.max(0, 1 - Math.hypot(ax, ay) / 650) * 0.9);
      const ox = p.x - DOT.x;
      const oy = p.y - DOT.y;
      const d = Math.hypot(ox, oy) || 1;
      const reach = Math.min(20, d * 0.05);
      dx((ox / d) * reach);
      dy((oy / d) * reach);
    };
    const onLeave = () => {
      lean(0);
      glowTo(0);
      dx(0);
      dy(0);
    };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf([agent, glow, dot]);
    };
  }, []);

  const run = (index) => engineRef.current && engineRef.current.run(index);
  const togglePause = () => {
    const p = !paused;
    setPaused(p);
    if (engineRef.current) engineRef.current.setPaused(p);
  };
  const hover = (key) => ({
    onPointerEnter: () => setHot(key),
    onPointerLeave: () => setHot(null),
  });

  const cls = ['aw-hero'];
  if (live) cls.push('is-live');
  if (phase) cls.push(`is-${phase}`);
  if (hot) cls.push('is-hot', `is-hot-${hot}`);

  return (
    <section ref={rootRef} className={cls.join(' ')} aria-labelledby="aw-hero-title">
      <div className="aw-hero__frame">
        <div className="aw-hero__copy">
          <p className="aw-hero__kicker">AI &amp; automation</p>
          <h1 id="aw-hero-title" className="aw-hero__title">
            It works the night shift.
          </h1>
          <p className="aw-hero__lede">
            Assistants trained on your docs, agents that do the follow-ups, workflows wired into your tools. This bench
            is running now: press Run, or click a part.
          </p>
          <div className="aw-hero__ctas">
            <Link to="/contact" className="bw-collage__cta aw-hero__cta">
              Start an automation
            </Link>
            <Link to="/pricing/ai-development" className="aw-hero__more">
              Packages and prices
            </Link>
          </div>
        </div>

        <div className="aw-hero__bench">
          <div className="aw-hero__stage">
            <div className="aw-hero__plate">
              <p className="aw-hero__tag">
                <i aria-hidden="true" />
                The workbench
              </p>
              <div className="aw-hero__aura" aria-hidden="true" />
              <div className="aw-hero__aura aw-hero__aura--think" aria-hidden="true" />
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false">
                <defs>
                  <clipPath id="aw-hero-clip">
                    <rect x="1000" y="150" width="540" height="330" rx="44" />
                  </clipPath>
                  <filter id="aw-hero-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="16" />
                  </filter>
                </defs>

                {/* The trigger: an outlined pill with its slot. */}
                <g data-part="trigger">
                  <rect x="70" y="340" width="140" height="360" rx="70" {...S} />
                  <rect
                    data-p="slot"
                    className="aw-hero__slot"
                    x="120"
                    y="400"
                    width="40"
                    height="240"
                    rx="20"
                    {...THIN}
                  />
                </g>

                {/* The agent, its glow, and the dot that watches. */}
                <g data-part="agent">
                  <circle data-p="dot" cx={DOT.x} cy={DOT.y} r="28" {...THIN} />
                  <g data-p="agent">
                    <text
                      data-p="glow"
                      x="360"
                      y="640"
                      fontFamily={INTER}
                      fontSize="440"
                      fontWeight="700"
                      letterSpacing="-12"
                      fill="none"
                      stroke={LAVENDER}
                      strokeWidth="34"
                      strokeLinejoin="round"
                      filter="url(#aw-hero-glow)"
                      opacity="0"
                    >
                      a
                    </text>
                    <text
                      className="aw-hero__a"
                      x="360"
                      y="640"
                      fontFamily={INTER}
                      fontSize="440"
                      fontWeight="700"
                      letterSpacing="-12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="14"
                      strokeLinejoin="round"
                    >
                      a
                    </text>
                  </g>
                </g>

                {/* The queue: the lines advance one job per run. */}
                <g data-part="queue">
                  <g clipPath="url(#aw-hero-clip)">
                    <rect className="aw-hero__qnext" x="1000" y="150" width="540" height={STEP} fill={LAVENDER} />
                    <g data-p="qlines" {...THIN}>
                      {[1, 2, 3, 4, 5, 6, 7].map((k) => (
                        <path key={k} d={`M1000 ${150 + STEP * k}H1540`} />
                      ))}
                    </g>
                  </g>
                  <rect x="1000" y="150" width="540" height="330" rx="44" {...S} />
                </g>

                {/* The arrows, and the purple current that runs along them. */}
                <g className="aw-hero__arrows">
                  <path className="aw-hero__draw" pathLength="1" d="M985 300L640 380" {...S} />
                  <path className="aw-hero__draw" pathLength="1" d="M698 320L640 380L718 408" {...S} />
                  <path className="aw-hero__draw" pathLength="1" d="M480 700C540 830 740 860 870 750" {...S} />
                  <path className="aw-hero__draw" pathLength="1" d="M788 761L870 750L846 829" {...S} />
                </g>
                <g className="aw-hero__currents" fill="none" stroke={LAVENDER} strokeWidth="9" strokeLinecap="round">
                  <path pathLength="1" d="M985 300L660 375" />
                  <path pathLength="1" d="M480 700C540 830 740 860 860 758" />
                </g>

                {/* Kept human. */}
                <g data-part="human">
                  <circle className="aw-hero__no" cx="330" cy="850" r="70" {...S} />
                  <path d="M280 800L380 900" {...S} />
                </g>

                {/* Run. */}
                <g data-part="run">
                  <rect className="aw-hero__pill" x="900" y="640" width="520" height="200" rx="100" {...S} />
                  <text
                    className="aw-hero__runword"
                    x="1160"
                    y="780"
                    textAnchor="middle"
                    fill="currentColor"
                    fontFamily={INTER}
                    fontSize="110"
                    fontWeight="500"
                    letterSpacing="-3"
                  >
                    Run
                  </text>
                </g>

                {/* The job's routes (invisible), the packet and its trail. */}
                <path data-p="route-in" d="M1000 296L640 380L540 500" fill="none" stroke="none" />
                <path
                  data-p="route-run"
                  d="M540 500L480 700C540 830 740 860 870 750L1160 740"
                  fill="none"
                  stroke="none"
                />
                <path data-p="route-human" d="M540 500L470 690L330 850" fill="none" stroke="none" />
                {[11, 8, 5].map((r) => (
                  <circle key={r} data-p="trail" r={r} fill={LAVENDER} opacity="0" />
                ))}
                <circle data-p="pkt" r="18" fill={LAVENDER} opacity="0" />

                {/* Hit areas: hover lights a part, the trigger and the human circle run a job. */}
                <rect
                  className="aw-hero__hit aw-hero__hit--act"
                  x="50"
                  y="320"
                  width="180"
                  height="400"
                  fill="transparent"
                  {...hover('trigger')}
                  onClick={() => engineRef.current && engineRef.current.runAny()}
                />
                <rect
                  className="aw-hero__hit"
                  x="250"
                  y="320"
                  width="470"
                  height="350"
                  fill="transparent"
                  {...hover('agent')}
                />
                <rect
                  className="aw-hero__hit"
                  x="990"
                  y="140"
                  width="560"
                  height="350"
                  fill="transparent"
                  {...hover('queue')}
                />
                <rect
                  className="aw-hero__hit aw-hero__hit--act"
                  x="240"
                  y="760"
                  width="180"
                  height="180"
                  fill="transparent"
                  {...hover('human')}
                  onClick={() => run(REFUND)}
                />
              </svg>

              <button
                type="button"
                className="aw-hero__run"
                style={{ left: '56.25%', top: '66.6%', width: '32.5%', height: '20.9%' }}
                onClick={() => run()}
                onFocus={() => setHot('run')}
                onBlur={() => setHot(null)}
                {...hover('run')}
                aria-label="Run one job through the workbench"
              />
            </div>

            <div className="aw-hero__caps">
              {CAPS.map((c, i) => (
                <p
                  key={c.key}
                  className={`aw-hero__cap${hot === c.key ? ' is-on' : ''}`}
                  style={{ left: `${c.l}%`, top: `${c.t}%`, width: c.w ? `${c.w}%` : undefined, '--i': i }}
                  {...hover(c.key)}
                >
                  <strong>{c.text[0]}</strong> {c.text[1]}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="aw-hero__logbox">
          <div className="aw-hero__meta">
            <span>The agent&apos;s log</span>
            <span className="aw-hero__count">
              {runs ? `${runs} run${runs > 1 ? 's' : ''}` : 'No runs yet'}
              <button type="button" className="aw-hero__pause" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </span>
          </div>
          <ol className="aw-hero__log" aria-live={announce ? 'polite' : 'off'}>
            {log.length ? (
              log.map((l) => (
                <li key={l.id}>
                  <time>{l.at}</time>
                  <span>{l.text}</span>
                </li>
              ))
            ) : (
              <li>
                <time>03:00:00</time>
                <span>waiting for a trigger</span>
              </li>
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}
