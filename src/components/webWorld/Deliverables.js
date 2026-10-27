import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The Web world's deliverables (2026-10-24): six cards whose demos are
   the thing, the AI world's grid in the Web world's terms. Every demo is a
   real control with a real state; nothing leaves the page. One studio
   color per demo (`aw-tone--*`, _worldOutline.scss). Since 2026-10-26 they
   are "Your business" pieces, no made-up shops or people, and responsive
   lives in the stage's 02 Layout: here a CMS edit and a care check take
   the responsive and theme cards' places. */

/* A CMS: the owner changes the headline and publishes it. */
const LIVE_HEAD = 'Your headline, live';
function CmsDemo() {
  const [live, setLive] = useState(LIVE_HEAD);
  const [draft, setDraft] = useState(LIVE_HEAD);
  const [at, setAt] = useState(null);
  const changed = draft.trim() && draft !== live;
  return (
    <div className="ww-cms">
      <div className="ww-cms__page" aria-live="polite">
        <span className={`ww-cms__badge${changed ? ' is-draft' : ''}`}>{changed ? 'Draft' : 'Live'}</span>
        <p className="ww-cms__h">{changed ? draft : live}</p>
        <i />
        <i />
      </div>
      <form
        className="ww-cms__edit"
        onSubmit={(e) => {
          e.preventDefault();
          if (!changed) return;
          setLive(draft.trim());
          setAt(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
        }}
      >
        <label className="ww-form__field">
          <span>Headline</span>
          <input type="text" value={draft} maxLength={40} onChange={(e) => setDraft(e.target.value)} />
        </label>
        <div className="ww-cms__row">
          <button type="submit" className="aw-pill is-on" disabled={!changed}>
            Publish
          </button>
          <span className="ww-cms__note">{at ? `Published at ${at}, by you.` : 'Edit it, then publish.'}</span>
        </div>
      </form>
    </div>
  );
}

/* A mobile app: three tabs, three screens, one codebase. */
const SLOTS = ['9:00', '10:30', '1:15', '4:00'];
function AppDemo() {
  const [tab, setTab] = useState('home');
  const [slot, setSlot] = useState(null);
  return (
    <div className="ww-app">
      <div className="ww-app__phone">
        <div className="ww-app__screen" aria-live="polite">
          {tab === 'home' && (
            <>
              <p className="ww-app__h">Next visit</p>
              <p className="ww-app__big">{slot ? `Tue ${slot}` : 'None yet'}</p>
              <button type="button" className="aw-pill" onClick={() => setTab('book')}>
                Book a time
              </button>
            </>
          )}
          {tab === 'book' && (
            <>
              <p className="ww-app__h">Tuesday</p>
              <div className="ww-app__slots">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`aw-pill${slot === s ? ' is-on' : ''}`}
                    aria-pressed={slot === s}
                    onClick={() => setSlot(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
          {tab === 'account' && (
            <>
              <p className="ww-app__h">Account</p>
              <p className="ww-app__big">Signed in</p>
              <p className="ww-app__note">Reminders on, one day before.</p>
            </>
          )}
        </div>
        <nav className="ww-app__tabs" aria-label="App tabs">
          {[
            ['home', 'Home'],
            ['book', 'Book'],
            ['account', 'Account'],
          ].map(([k, label]) => (
            <button key={k} type="button" className={tab === k ? 'is-on' : ''} aria-pressed={tab === k} onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* A store: a cart that counts, a checkout that knows when it can run. */
function StoreDemo() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const add = () => {
    setDone(false);
    setN((v) => Math.min(9, v + 1));
  };
  return (
    <div className="ww-store">
      <div className="ww-store__top">
        <p className="ww-store__name">Your product, $24</p>
        <span className="ww-store__cart" aria-label={`${n} in cart`}>
          Cart <b>{n}</b>
        </span>
      </div>
      <div className="ww-store__shot" aria-hidden="true">
        <svg viewBox="0 0 200 120">
          <path d="M62 34H138L130 106H70Z" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M84 34Q100 6 116 34" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="ww-store__row">
        <button type="button" className="aw-pill" onClick={add}>
          Add to cart
        </button>
        <button
          type="button"
          className="aw-pill is-on"
          disabled={!n}
          onClick={() => {
            setDone(true);
            setN(0);
          }}
        >
          Checkout
        </button>
      </div>
      <p className="ww-store__msg" aria-live="polite">
        {done ? 'Order placed. A demo: nothing was charged.' : n ? 'Ready to check out.' : 'The cart is empty.'}
      </p>
    </div>
  );
}

/* A form that says what is wrong before you send it. One field, so it
   fits a 4:3 card at every width. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function FormDemo() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const ok = EMAIL.test(email);
  const bad = touched && email && !ok;
  if (sent) {
    return (
      <div className="ww-form ww-form--sent" aria-live="polite">
        <p className="ww-form__done">Sent.</p>
        <p className="ww-form__note">Nothing left this page; it is a demo.</p>
        <button
          type="button"
          className="aw-pill"
          onClick={() => {
            setSent(false);
            setEmail('');
            setTouched(false);
          }}
        >
          Try again
        </button>
      </div>
    );
  }
  return (
    <form
      className="ww-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) setSent(true);
        else setTouched(true);
      }}
    >
      <label className="ww-form__field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          placeholder="you@business.com"
          aria-invalid={bad ? 'true' : 'false'}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
        />
      </label>
      <p className={`ww-form__msg${bad ? ' is-bad' : ''}`} aria-live="polite">
        {bad ? 'Check the email address.' : ok ? 'Looks right.' : ''}
      </p>
      <button type="submit" className="aw-pill is-on" disabled={!ok}>
        Send
      </button>
    </form>
  );
}

/* A deploy: four steps, ticked in order, and a roll back to the version
   before it. */
const STEPS = ['Install', 'Build', 'Test', 'Deploy'];
function DeployDemo() {
  const [done, setDone] = useState(0);
  const [busy, setBusy] = useState(false);
  const [ver, setVer] = useState(12);
  const [back, setBack] = useState(false);
  const run = () => {
    if (busy) return;
    setDone(0);
    setBack(false);
    if (reduced()) {
      setDone(STEPS.length);
      setVer((v) => v + 1);
      return;
    }
    setBusy(true);
    const tl = gsap.timeline({
      onComplete: () => {
        setBusy(false);
        setVer((v) => v + 1);
      },
    });
    STEPS.forEach((_, k) => tl.call(() => setDone(k + 1), null, 0.3 + k * 0.55));
  };
  const rollBack = () => {
    setVer((v) => v - 1);
    setDone(0);
    setBack(true);
  };
  let status = 'Idle';
  if (busy) status = 'Working';
  else if (back) status = `Rolled back: v${ver} is live`;
  else if (done === STEPS.length) status = `v${ver} is live, in 52 s`;
  return (
    <div className="aw-tasks ww-deploy">
      <ol>
        {STEPS.map((s) => (
          <li key={s} className={STEPS.indexOf(s) < done ? 'is-done' : ''}>
            <i aria-hidden="true" />
            {s}
          </li>
        ))}
      </ol>
      <div className="aw-tasks__foot">
        <button type="button" className="aw-pill is-on" onClick={run} disabled={busy}>
          {done === STEPS.length ? 'Deploy again' : 'Deploy'}
        </button>
        <button type="button" className="aw-pill" onClick={rollBack} disabled={busy || back || done < STEPS.length}>
          Roll back
        </button>
        <span aria-live="polite">{status}</span>
      </div>
    </div>
  );
}

/* Care: the site goes down, the uptime check sees it, the last backup
   brings it back. Thirty days of checks, one bar a day. */
function CareDemo() {
  const [state, setState] = useState('up');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const breakIt = () => {
    setState('down');
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setState('restored'),
      reduced() ? 0 : 1600,
    );
  };
  const msg = {
    up: 'All checks green for 30 days.',
    down: 'Down. The check failed and the team has the alert.',
    restored: 'Back up from the last backup. Logged.',
  }[state];
  return (
    <div className={`ww-care is-${state}`}>
      <div className="ww-care__top">
        <p className="ww-care__site">yourbusiness.com</p>
        <span className="ww-care__status">{state === 'down' ? 'Down' : 'Up'}</span>
      </div>
      <div className="ww-care__bars" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <i key={i} className={i === 29 && state !== 'up' ? `is-${state}` : ''} />
        ))}
      </div>
      <p className="ww-care__msg" aria-live="polite">
        {msg}
      </p>
      <div className="ww-care__row">
        <button type="button" className="aw-pill is-on" onClick={breakIt} disabled={state === 'down'}>
          {state === 'restored' ? 'Break it again' : 'Break the site'}
        </button>
        <span className="ww-care__note">Backups on every care plan.</span>
      </div>
    </div>
  );
}

const CARDS = [
  { tone: 'mint', tool: true, Demo: CmsDemo, cap: ['Content.', 'Change the headline, press Publish. You edit your own site.'] },
  { tone: 'lilac', tool: true, Demo: AppDemo, cap: ['Mobile apps.', 'Tap the tabs. iOS and Android from one React Native codebase.'] },
  { tone: 'orange', tool: true, Demo: StoreDemo, cap: ['Stores.', 'Add to cart. WooCommerce, with checkout tested on a phone.'] },
  { tone: 'pink', tool: true, Demo: FormDemo, cap: ['Forms.', 'Type a bad email. It says so before you press Send.'] },
  { tone: 'blue', tool: true, Demo: DeployDemo, cap: ['Deploys.', 'Deploy, then roll back. Every release is built, tested and logged.'] },
  { tone: null, tool: true, Demo: CareDemo, cap: ['Care.', 'Break the site. The check sees it; the last backup brings it back.'] },
];

export default function Deliverables() {
  return (
    <section className="bw-grid" aria-labelledby="bw-grid-title">
      <h2 id="bw-grid-title" className="bw-grid__title">
        Everything you get runs on this page.
      </h2>
      <ul className="bw-grid__cards">
        {CARDS.map(({ tone, tool, Demo, cap }) => (
          <li key={cap[0]} className="bw-grid__card">
            <div className="bw-grid__stage">
              <div
                className={`bw-grid__demo${tool ? ' bw-grid__demo--tool' : ''}${tone ? ` aw-tone--${tone}` : ''}`}
                style={{ aspectRatio: '4/3' }}
              >
                <Demo />
              </div>
            </div>
            <p className="bw-grid__cap">
              <strong>{cap[0]}</strong> {cap[1]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
