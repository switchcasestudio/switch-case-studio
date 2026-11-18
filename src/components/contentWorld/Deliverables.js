import { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';

const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The deliverables grid of the Content & Social Media world (2026-11-18),
   the AI world's "everything you get runs on this page" for words: six
   cards, each a real control with a real state, and nothing leaves the
   page. Flip the copy, hear one fact in three voices, plan the month, cut
   one post for three places, put your own name on the email, tap a tagged
   link and watch the report count it. They are "Your business" pieces, as
   in the other outline worlds: no invented client, and the only numbers
   are the visitor's own taps. The shared demo controls (`.aw-pill`,
   `.aw-chat`, `.aw-tasks`, `.aw-switch`) are the outline worlds'
   (_worldOutline.scss); the three demos that are this world's own are
   styled in contentWorld.scss. */

/* Website copy: the same business, said two ways. */
function CopyDemo() {
  const [clear, setClear] = useState(true);
  return (
    <div className="aw-switch">
      <button type="button" role="switch" aria-checked={clear} onClick={() => setClear((v) => !v)}>
        <span className="sr-only">Plain words</span>
      </button>
      <p className="aw-switch__label">{clear ? 'Roof repairs in one day.' : 'Excellence in roofing solutions.'}</p>
      <p className="aw-switch__note">{clear ? 'What it is and how long it takes, in five words.' : 'True of every roofer, so it says nothing about this one.'}</p>
    </div>
  );
}

/* The voice guide: one fact, three voices. The answer types itself out. */
const VOICES = [
  ['Plain', 'Closed Monday. Back Tuesday at 9.'],
  ['Warm', "We're taking Monday off to rest. See you Tuesday at 9!"],
  ['Formal', 'Please note that we will be closed on Monday and will reopen on Tuesday at 9 am.'],
];
function VoiceDemo() {
  const [i, setI] = useState(0);
  const aRef = useRef(null);
  useEffect(() => {
    const el = aRef.current;
    if (!el) return undefined;
    const full = VOICES[i][1];
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
      <p className="aw-chat__q">The fact: closed Monday, open Tuesday at 9.</p>
      <p className="aw-chat__a" ref={aRef} aria-live="polite">
        {VOICES[i][1]}
      </p>
      <p className="aw-chat__src">Voice: {VOICES[i][0]}</p>
      <div className="aw-chat__pills" role="group" aria-label="Pick a voice">
        {VOICES.map((row, k) => (
          <button key={row[0]} type="button" className={`aw-pill${k === i ? ' is-on' : ''}`} aria-pressed={k === i} onClick={() => setI(k)}>
            {row[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* The calendar: a month planned in five steps, ticked in order. */
const STEPS = ['Pick the topics', 'Write the batch', 'Design the images', 'You approve', 'Schedule every post'];
function PlanDemo() {
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
          {done === STEPS.length ? 'Plan again' : 'Plan the month'}
        </button>
        <span aria-live="polite">{done === STEPS.length ? 'Done: the month is scheduled' : busy ? 'Working' : 'Idle'}</span>
      </div>
    </div>
  );
}

/* Social posts: one idea, cut for each place it goes. */
const CROPS = [
  ['Square', '1 / 1', 'Feed'],
  ['Story', '9 / 16', 'Story'],
  ['Wide', '16 / 9', 'Link preview'],
];
function CropDemo() {
  const [i, setI] = useState(0);
  return (
    <div className="cw-crop">
      <div className="cw-crop__stage">
        <div className="cw-crop__frame" style={{ aspectRatio: CROPS[i][1] }}>
          <span className="cw-crop__brand">Your business</span>
          <span className="cw-crop__line">Open Saturdays from March.</span>
        </div>
      </div>
      <p className="cw-crop__where" aria-live="polite">
        {CROPS[i][2]}, {CROPS[i][1].replace(' / ', ':')}
      </p>
      <div className="cw-crop__pills" role="group" aria-label="Pick a format">
        {CROPS.map((c, k) => (
          <button key={c[0]} type="button" className={`aw-pill${k === i ? ' is-on' : ''}`} aria-pressed={k === i} onClick={() => setI(k)}>
            {c[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Email: it goes out from you. Type a name; the inbox row follows. */
function MailDemo() {
  const id = useId();
  const [name, setName] = useState('Your business');
  const from = name.trim() || 'Your business';
  return (
    <div className="cw-mail">
      <label className="cw-mail__lab" htmlFor={`${id}-n`}>
        Sent from
      </label>
      <input id={`${id}-n`} className="cw-mail__input" type="text" value={name} maxLength={28} autoComplete="off" onChange={(e) => setName(e.target.value)} />
      <div className="cw-mail__row" aria-live="polite">
        <b>{from}</b>
        <span>Spring hours, and one new thing</span>
        <em>9:00</em>
      </div>
      <p className="cw-mail__body">
        Hi there, a short note from {from}. One piece of news, one thing to do, and a way to stop hearing from us.
      </p>
    </div>
  );
}

/* The report: every link carries a tag, so each tap is counted for the
   piece it came from. The only numbers here are the visitor's own taps. */
const LINKS = ['Instagram post', 'Email', 'Profile update'];
function ReportDemo() {
  const [taps, setTaps] = useState([0, 0, 0]);
  const total = taps.reduce((a, b) => a + b, 0);
  const most = Math.max(1, ...taps);
  return (
    <div className="cw-report">
      <ul className="cw-report__rows">
        {LINKS.map((label, k) => (
          <li key={label}>
            <button type="button" className="aw-pill" onClick={() => setTaps((t) => t.map((n, j) => (j === k ? n + 1 : n)))}>
              Tap: {label}
            </button>
            <i style={{ '--w': `${(taps[k] / most) * 100}%` }} aria-hidden="true" />
            <b>{taps[k]}</b>
          </li>
        ))}
      </ul>
      <p className="cw-report__msg" aria-live="polite">
        {total ? `${total} ${total === 1 ? 'visit' : 'visits'}, each counted for the piece that sent it.` : 'Three links to one page. Tap one.'}
      </p>
    </div>
  );
}

export default function Deliverables() {
  return (
    <section className="bw-grid" aria-labelledby="bw-grid-title">
      <h2 id="bw-grid-title" className="bw-grid__title">
        Everything you get works on this page.
      </h2>
      <ul className="bw-grid__cards">
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--mint" style={{ aspectRatio: '4/3' }}>
              <CopyDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Website copy.</strong> Flip it. The same business, said so a stranger gets it in one line.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--orange" style={{ aspectRatio: '4/3' }}>
              <VoiceDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Voice guide.</strong> One fact in three voices. Yours is written down, so every piece sounds like you.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--pink" style={{ aspectRatio: '4/3' }}>
              <PlanDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Content calendar.</strong> Press Plan. Topics, writing, design, your approval, then every post scheduled.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--blue" style={{ aspectRatio: '4/3' }}>
              <CropDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Social posts.</strong> One idea, cut for each place it goes: the feed, a story and a link preview.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--lilac" style={{ aspectRatio: '4/3' }}>
              <MailDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Email.</strong> Type your name. It goes out from you, with one piece of news and one thing to do.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--ink" style={{ aspectRatio: '4/3' }}>
              <ReportDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Monthly report.</strong> Tap a link. Every piece carries a tag, so the report says which one sent the visit.
          </p>
        </li>
      </ul>
    </section>
  );
}
