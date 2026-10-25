import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import VideoTile from '../worlds/VideoTile';
import LiveArt from '../worlds/LiveArt';
import { Envelope } from './tiles/art';
import { Envelope as envelopeLive } from './tiles/live';

gsap.registerPlugin(Draggable);

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 4.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The deliverables grid (2026-10-22): cards whose demos are the thing, the
   AI world's answer to the brand world's drag-a-sticker. Ask the assistant,
   run the agent, drag a node, flip the hosting switch, watch the log, lift
   the envelope. Every demo is a real control with a real state. */

/* The assistant, trained on a fictional coffee shop's notes. The last
   question is the one it cannot answer, on purpose. */
const QA = [
  ['Oat milk?', 'Do you have oat milk?', 'Yes. Oat, almond and whole, and oat costs the same.'],
  ['Sunday?', 'Are you open on Sunday?', 'Sunday 7 am to 2 pm. Last pour at 1:45.'],
  ['Back room?', 'Can I book the back room?', 'It seats twelve and is free with an order. Want me to hold a date?'],
  ['Wholesale?', 'Do you sell beans wholesale?', "That isn't in my notes. I've passed it to Ana; she answers within the hour."],
];

function ChatDemo() {
  const [i, setI] = useState(0);
  const aRef = useRef(null);
  useEffect(() => {
    const el = aRef.current;
    if (!el) return undefined;
    const full = QA[i][2];
    if (reduced()) {
      el.textContent = full;
      return undefined;
    }
    const proxy = { n: 0 };
    el.textContent = '';
    const tw = gsap.to(proxy, {
      n: full.length,
      duration: full.length * 0.022,
      ease: 'none',
      delay: 0.35,
      onUpdate: () => {
        el.textContent = full.slice(0, Math.round(proxy.n));
      },
    });
    return () => tw.kill();
  }, [i]);
  return (
    <div className="aw-chat">
      <p className="aw-chat__q">{QA[i][1]}</p>
      <p className="aw-chat__a" ref={aRef} aria-live="polite">
        {QA[i][2]}
      </p>
      <div className="aw-chat__pills" role="group" aria-label="Ask the assistant">
        {QA.map((row, k) => (
          <button key={row[0]} type="button" className={`aw-pill${k === i ? ' is-on' : ''}`} aria-pressed={k === i} onClick={() => setI(k)}>
            {row[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* The agent: four steps, ticked in order, with the time it took. */
const STEPS = ['Read the inquiry', 'Check the calendar', 'Draft the reply', 'Write the log'];
function TaskDemo() {
  const [done, setDone] = useState(0);
  const [busy, setBusy] = useState(false);
  const run = () => {
    if (busy) return;
    setDone(0);
    if (reduced()) {
      setDone(STEPS.length);
      return;
    }
    setBusy(true);
    const tl = gsap.timeline({ onComplete: () => setBusy(false) });
    STEPS.forEach((_, k) => tl.call(() => setDone(k + 1), null, 0.3 + k * 0.55));
  };
  return (
    <div className="aw-tasks">
      <ol>
        {STEPS.map((s, k) => (
          <li key={s} className={k < done ? 'is-done' : ''}>
            <i aria-hidden="true" />
            {s}
          </li>
        ))}
      </ol>
      <div className="aw-tasks__foot">
        <button type="button" className="aw-pill is-on" onClick={run} disabled={busy}>
          {done === STEPS.length ? 'Run again' : 'Run'}
        </button>
        <span aria-live="polite">{done === STEPS.length ? 'Done in 41 s' : busy ? 'Working' : 'Idle'}</span>
      </div>
    </div>
  );
}

/* The workflow: drag the node, the wires follow. */
function DragDemo() {
  const svgRef = useRef(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reduced()) return undefined;
    const node = svg.querySelector('[data-p="node"]');
    const w1 = svg.querySelector('[data-p="w1"]');
    const w2 = svg.querySelector('[data-p="w2"]');
    const wire = (x, y) => {
      const cx = 200 + x;
      const cy = 150 + y;
      w1.setAttribute('d', `M90 150C${(90 + cx - 55) / 2} 150 ${(90 + cx - 55) / 2} ${cy} ${cx - 55} ${cy}`);
      w2.setAttribute('d', `M${cx + 55} ${cy}C${(cx + 55 + 310) / 2} ${cy} ${(cx + 55 + 310) / 2} 150 310 150`);
    };
    const [d] = Draggable.create(node, {
      type: 'x,y',
      bounds: { minX: -80, maxX: 80, minY: -95, maxY: 95 },
      onDrag() {
        wire(this.x, this.y);
      },
      onPress() {
        gsap.to(node, { scale: 1.06, transformOrigin: 'center', duration: 0.2 });
      },
      onRelease() {
        gsap.to(node, { scale: 1, duration: 0.3, ease: 'back.out(1.5)' });
      },
    });
    return () => d.kill();
  }, []);
  return (
    <svg ref={svgRef} className="aw-drag" viewBox="0 0 400 300" aria-label="A workflow node you can drag; the wires follow" role="img">
      <circle cx="60" cy="150" r="30" {...S} />
      <path data-p="w1" d="M90 150C117.5 150 117.5 150 145 150" {...S} />
      <path data-p="w2" d="M255 150C282.5 150 282.5 150 310 150" {...S} />
      <rect x="310" y="120" width="60" height="60" rx="14" {...S} />
      <g data-p="node" style={{ cursor: 'grab' }}>
        <rect x="145" y="115" width="110" height="70" rx="18" fill="#fff" {...S} />
        <text x="200" y="166" textAnchor="middle" fill="currentColor" fontFamily="Inter, 'Inter Fallback', sans-serif" fontSize="44" fontWeight="700">
          a
        </text>
      </g>
    </svg>
  );
}

/* Hosting: a switch that means something. */
function HostDemo() {
  const [own, setOwn] = useState(true);
  return (
    <div className="aw-switch">
      <button type="button" role="switch" aria-checked={own} onClick={() => setOwn((v) => !v)}>
        <span className="sr-only">Self-hosted</span>
      </button>
      <p className="aw-switch__label">{own ? 'Your VPS' : 'Studio cloud'}</p>
      <p className="aw-switch__note">{own ? 'The data stays on your server. We get a login, not a copy.' : 'Runs on ours. One bill, and we watch it.'}</p>
    </div>
  );
}

export default function Deliverables() {
  return (
    <section className="bw-grid" aria-labelledby="bw-grid-title">
      <h2 id="bw-grid-title" className="bw-grid__title">
        Everything you get runs on this page.
      </h2>
      <ul className="bw-grid__cards">
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--mint" style={{ aspectRatio: '4/3' }}>
              <ChatDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>The assistant.</strong> Trained on your notes. It answers what it knows and says when it doesn't.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--orange" style={{ aspectRatio: '4/3' }}>
              <TaskDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Agents.</strong> Press Run. Each step is ticked in order and the log says how long it took.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo aw-tone--pink" style={{ aspectRatio: '4/3' }}>
              <DragDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Workflows.</strong> Drag the node; the wires follow. Built in n8n, Zapier, Make or GoHighLevel.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--blue" style={{ aspectRatio: '4/3' }}>
              <HostDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Hosting.</strong> Your VPS or ours. Flip it; the data stays where you put it.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo" style={{ aspectRatio: '16/9' }}>
              <VideoTile src="/ai-world/log-loop.mp4" poster="/ai-world/log-loop.jpg" label="The agent's log, writing itself" />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Monitoring.</strong> A log you can read, an alert when something stops, a person who answers it.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo aw-tone--lilac" style={{ aspectRatio: '4/3' }}>
              <LiveArt Art={Envelope} create={envelopeLive} className="aw-live" />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Email and lifecycle.</strong> Sequences written once, sent on their own, measured every send.
          </p>
        </li>
      </ul>
    </section>
  );
}
