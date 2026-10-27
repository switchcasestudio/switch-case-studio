import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 4.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The deliverables grid (2026-10-22): cards whose demos are the thing, the
   AI world's answer to the brand world's drag-a-sticker. Ask the assistant,
   run the agent, drag a node, flip the hosting switch, break the CRM and
   watch the alert, send a follow-up and reply to it. Every demo is a real
   control with a real state; nothing leaves the page. Since 2026-10-27
   they are "Your business" pieces, as in the Web world: the made-up coffee
   shop, "Ana", the "41 s" and the three videos (lavender, from before the
   palette) are gone. The assistant's answers agree with the stage's notes
   (lessons.js `NOTES`). */

/* The assistant, on Your business's notes. The last question is the one
   the notes do not answer, on purpose. */
const QA = [
  ['Saturday?', 'Are you open on Saturday?', 'Yes, 10 am to 2 pm. Weekdays 9 am to 6 pm.', 'Hours'],
  ['Delivery?', 'Is delivery free?', 'On orders over $50, within 25 miles.', 'Delivery'],
  ['Sale items?', 'Can I return a sale item?', 'Sale items can be exchanged, not refunded.', 'Returns'],
  ['Gift cards?', 'Do you sell gift cards?', "That isn't in my notes, so I've passed your question to the team.", null],
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
      <p className="aw-chat__src">{QA[i][3] ? `From your notes: ${QA[i][3]}` : 'Handed to a person'}</p>
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

/* The agent: five steps, ticked in order, each one written to the log. */
const STEPS = ['Read the lead', 'Check the calendar', 'Hold the first open slot', 'Draft the reply', 'Write the log'];
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
        <span aria-live="polite">{done === STEPS.length ? `Done: ${STEPS.length} steps, all logged` : busy ? 'Working' : 'Idle'}</span>
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

/* Monitoring: thirty days of runs, one bar a day. Break the CRM and the
   runs wait (one more each second, on the visitor's clock) while the alert
   goes out; fix it and the waiting runs go through. */
function WatchDemo() {
  const [down, setDown] = useState(false);
  const [waiting, setWaiting] = useState(0);
  const [sent, setSent] = useState(null);
  useEffect(() => {
    if (!down) return undefined;
    const t = setInterval(() => setWaiting((w) => w + 1), 1000);
    return () => clearInterval(t);
  }, [down]);
  const toggle = () => {
    if (down) {
      setSent(waiting);
      setWaiting(0);
    } else {
      setSent(null);
      setWaiting(1);
    }
    setDown(!down);
  };
  const msg = down
    ? `The CRM step is failing. ${waiting} run${waiting === 1 ? '' : 's'} waiting and retrying; you were emailed.`
    : sent !== null
      ? `Fixed. The ${sent} waiting run${sent === 1 ? '' : 's'} went through, in order.`
      : 'Every run is checked. If a step stops answering, you hear about it first.';
  return (
    <div className={`aw-watch${down ? ' is-down' : ''}`}>
      <div className="aw-watch__top">
        <p className="aw-watch__name">New lead flow</p>
        <span className="aw-watch__status">{down ? 'Alert' : 'Running'}</span>
      </div>
      <div className="aw-watch__bars" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <i key={i} className={i === 29 && down ? 'is-down' : i === 29 && sent !== null ? 'is-back' : ''} />
        ))}
      </div>
      <p className="aw-watch__msg" aria-live="polite">
        {msg}
      </p>
      <button type="button" className="aw-pill is-on" onClick={toggle}>
        {down ? 'Fix it' : 'Break the CRM'}
      </button>
    </div>
  );
}

/* Follow-ups: three emails on a schedule; a reply stops the rest. */
const MAILS = [
  [0, 'Your quote'],
  [2, 'Any questions?'],
  [7, 'Last note from us'],
];
function SequenceDemo() {
  const [day, setDay] = useState(0);
  const [replied, setReplied] = useState(null);
  const sentOn = (d) => d <= day && (replied === null || d <= replied);
  const stopped = replied !== null;
  const reset = () => {
    setDay(0);
    setReplied(null);
  };
  const msg = stopped
    ? `They replied on day ${replied}. The rest stopped, and the lead is yours.`
    : day >= 7
      ? 'All three sent. No reply, so the sequence ends here.'
      : `Day ${day}. The next one goes on day ${MAILS.find(([d]) => d > day)[0]}, unless they reply.`;
  return (
    <div className="aw-seq">
      <ol className="aw-seq__mails">
        {MAILS.map(([d, subject]) => (
          <li key={d} className={sentOn(d) ? 'is-sent' : stopped && d > replied ? 'is-off' : ''}>
            <b>Day {d}</b>
            <span>{subject}</span>
            <em>{sentOn(d) ? 'sent' : stopped ? 'stopped' : 'waiting'}</em>
          </li>
        ))}
      </ol>
      <p className="aw-seq__msg" aria-live="polite">
        {msg}
      </p>
      <div className="aw-seq__row">
        {stopped || day >= 7 ? (
          <button type="button" className="aw-pill is-on" onClick={reset}>
            Start over
          </button>
        ) : (
          <>
            <button type="button" className="aw-pill is-on" onClick={() => setDay((d) => d + 1)}>
              Next day
            </button>
            <button type="button" className="aw-pill" onClick={() => setReplied(day)}>
              They reply
            </button>
          </>
        )}
      </div>
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
            <strong>The assistant.</strong> It answers from your notes, names the note, and passes on what it can&apos;t answer.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--orange" style={{ aspectRatio: '4/3' }}>
              <TaskDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Agents.</strong> Press Run. Each step is ticked in order and written to the log.
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
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--ink" style={{ aspectRatio: '4/3' }}>
              <WatchDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Monitoring.</strong> Break the CRM. The runs wait and retry, you get the alert, and nothing is lost.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--lilac" style={{ aspectRatio: '4/3' }}>
              <SequenceDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Email and lifecycle.</strong> Follow-ups written once, sent on schedule, stopped the moment someone replies.
          </p>
        </li>
      </ul>
    </section>
  );
}
