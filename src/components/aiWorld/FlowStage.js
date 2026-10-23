import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { q, qa } from '../servicePoster/usePosterEngine';

gsap.registerPlugin(ScrollTrigger);

/* The workbench (2026-10-22): the owner's reference drawing turned into a
   machine that runs. A trigger, the agent (the outlined "a"), the queue
   (the striped box), the Run pill, and the circle with a slash for what
   stays human, joined by the long open arrows. Scrolling in draws the
   arrows and reveals the captions in order (scrubbed, wide pointer screens
   only). Pressing Run sends one job through: a lavender packet rides the
   route, the queue advances one line, the pill fills, and the log under
   the bench gets the four lines the agent wrote. Under reduced motion the
   lines land at once. The SVG is complete in the static HTML. */
const GATE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const INTER = "Inter, 'Inter Fallback', sans-serif";
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 18, strokeLinecap: 'round', strokeLinejoin: 'round' };
const THIN = { ...S, strokeWidth: 12 };
const LAVENDER = '#dab8ff';
const STEP = 330 / 7;

// What the agent writes per run: seconds after the trigger, and the line.
const RUN_LOG = [
  [0, 'lead in, from the site form'],
  [2, 'context read: 3 past emails, 1 open invoice'],
  [9, 'reply drafted, slot held for Tue 10:00'],
  [41, 'sent to the owner for a yes, logged'],
];

const CAPS = [
  { key: 'trigger', l: 4.4, t: 15, text: ['Trigger.', 'A form, a missed call, a new row in the sheet. Anything that happens can start a run.'] },
  { key: 'queue', l: 62.5, t: 53, text: ['Queue.', 'Jobs wait their turn. Each step is written down before the next one starts.'] },
  { key: 'agent', l: 40, t: 66, text: ['Agent.', 'Reads the context, decides, drafts. It asks a person whenever the rule says so.'] },
  { key: 'human', l: 4.4, t: 80, w: 10, text: ['Kept human.', 'The refund, the apology, the hard call.'] },
  { key: 'run', l: 56.5, t: 90, text: ['Run.', 'One press, a schedule, or an event. Then the log.'] },
];

const stamp = (s) => {
  const h = 3 + Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `0${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function FlowStage() {
  const rootRef = useRef(null);
  const busyRef = useRef(false);
  const [runs, setRuns] = useState(0);
  const [log, setLog] = useState([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const svg = root.querySelector('svg');
    const mm = gsap.matchMedia();
    mm.add(GATE, () => {
      const arrows = qa(svg, 'draw');
      arrows.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const caps = root.querySelectorAll('.aw-flow__cap');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 85%', end: 'top 15%', scrub: 0.5 },
      });
      tl.to(arrows, { strokeDashoffset: 0, duration: 1, stagger: 0.4, ease: 'none' }, 0);
      tl.fromTo(caps, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.25 }, 0.1);
      return () => tl.scrollTrigger && tl.scrollTrigger.kill();
    });
    return () => mm.revert();
  }, []);

  const onRun = () => {
    if (busyRef.current) return;
    const root = rootRef.current;
    const svg = root && root.querySelector('svg');
    if (!svg) return;
    const n = runs + 1;
    setRuns(n);
    const base = (n - 1) * 47;
    const lines = RUN_LOG.map(([s, text]) => ({ at: stamp(base + s), text }));
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setLog((l) => [...l, ...lines].slice(-4));
      return;
    }
    busyRef.current = true;
    const route = q(svg, 'route');
    const pkt = q(svg, 'pkt');
    const qlines = q(svg, 'qlines');
    const pill = q(svg, 'pill');
    const len = route.getTotalLength();
    const proxy = { p: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        busyRef.current = false;
      },
    });
    tl.set(pkt, { attr: { opacity: 1 } }, 0);
    tl.to(
      proxy,
      {
        p: 1,
        duration: 2.4,
        ease: 'power1.inOut',
        onUpdate: () => {
          const pt = route.getPointAtLength(proxy.p * len);
          pkt.setAttribute('transform', `translate(${pt.x - 140} ${pt.y - 520})`);
        },
      },
      0,
    );
    tl.to(qlines, { y: -STEP, duration: 0.45, ease: 'power2.inOut' }, 0.3).set(qlines, { y: 0 });
    tl.to(pill, { attr: { fill: LAVENDER }, duration: 0.15 }, 2.3).to(pill, { attr: { fill: 'none' }, duration: 0.5 }, 3);
    tl.set(pkt, { attr: { opacity: 0 } }, 2.5);
    lines.forEach((line, i) => {
      tl.call(() => setLog((l) => [...l, line].slice(-4)), null, 0.6 + i * 0.6);
    });
  };

  return (
    <section ref={rootRef} className="aw-flow" aria-labelledby="aw-flow-title">
      <div className="aw-flow__head">
        <h2 id="aw-flow-title" className="aw-flow__title">
          The workbench.
        </h2>
        <p className="aw-flow__lede">
          Every automation we ship is these four parts and a rule for what stays with a person. Press Run and watch
          one job go through.
        </p>
      </div>

      <div className="aw-flow__bench">
        <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id="aw-flow-clip">
              <rect x="1000" y="150" width="540" height="330" rx="44" />
            </clipPath>
          </defs>
          {/* The trigger: an outlined pill with its slot. */}
          <rect x="70" y="340" width="140" height="360" rx="70" {...S} />
          <rect x="120" y="400" width="40" height="240" rx="20" {...THIN} />
          <circle cx="300" cy="520" r="28" {...THIN} />
          {/* The agent. */}
          <text x="360" y="640" fontFamily={INTER} fontSize="440" fontWeight="700" letterSpacing="-12" fill="none" stroke="currentColor" strokeWidth="14" strokeLinejoin="round">
            a
          </text>
          {/* The queue. */}
          <g clipPath="url(#aw-flow-clip)">
            <g data-p="qlines" {...THIN}>
              {[1, 2, 3, 4, 5, 6, 7].map((k) => (
                <path key={k} d={`M1000 ${150 + STEP * k}H1540`} />
              ))}
            </g>
          </g>
          <rect x="1000" y="150" width="540" height="330" rx="44" {...S} />
          {/* Queue to agent. */}
          <path data-p="draw" d="M985 300L640 380" {...S} />
          <path data-p="draw" d="M698 320L640 380L718 408" {...S} />
          {/* Agent to Run. */}
          <path data-p="draw" d="M480 700C540 830 740 860 870 750" {...S} />
          <path data-p="draw" d="M788 761L870 750L846 829" {...S} />
          {/* Kept human. */}
          <circle cx="330" cy="850" r="70" {...S} />
          <path d="M280 800L380 900" {...S} />
          {/* Run. */}
          <rect data-p="pill" x="900" y="640" width="520" height="200" rx="100" {...S} />
          <text x="1160" y="780" textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize="110" fontWeight="500" letterSpacing="-3">
            Run
          </text>
          {/* The job's route (invisible) and the packet that rides it. */}
          <path data-p="route" d="M140 520H300L450 480L480 700C540 830 740 860 1160 740" fill="none" stroke="none" />
          <circle data-p="pkt" cx="140" cy="520" r="16" fill={LAVENDER} opacity="0" />
        </svg>

        <div className="aw-flow__caps">
          {CAPS.map((c) => (
            <p key={c.key} className="aw-flow__cap" style={{ left: `${c.l}%`, top: `${c.t}%`, width: c.w ? `${c.w}%` : undefined }}>
              <strong>{c.text[0]}</strong> {c.text[1]}
            </p>
          ))}
        </div>

        <button
          type="button"
          className="aw-flow__run"
          style={{ left: '56.25%', top: '66.6%', width: '32.5%', height: '20.9%' }}
          onClick={onRun}
          aria-label="Run one job through the workbench"
        />
      </div>

      <div className="aw-flow__meta">
        <span>The agent's log</span>
        <span aria-live="polite">{runs ? `${runs} run${runs > 1 ? 's' : ''}` : 'No runs yet'}</span>
      </div>
      <ol className="aw-flow__log" aria-live="polite">
        {log.length ? (
          log.map((l, i) => (
            <li key={`${l.at}-${i}`}>
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
    </section>
  );
}
