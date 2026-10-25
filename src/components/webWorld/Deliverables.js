import { useState } from 'react';
import gsap from 'gsap';

const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The Web world's deliverables (2026-10-24): six cards whose demos are
   the thing, the AI world's grid in the Web world's terms. Every demo is a
   real control with a real state; nothing leaves the page. One studio
   color per demo (`aw-tone--*`, _worldOutline.scss). */

/* Responsive: one page at three widths. The slider is the browser's edge;
   the columns follow it. */
function ResponsiveDemo() {
  const [w, setW] = useState(100);
  const cols = w < 45 ? 1 : w < 75 ? 2 : 3;
  const name = ['Phone', 'Tablet', 'Desktop'][cols - 1];
  return (
    <div className="ww-resp">
      <div className="ww-resp__room">
        <div className="ww-resp__page" style={{ width: `${w}%`, '--cols': cols }}>
          <span className="ww-resp__bar" />
          <span className="ww-resp__hero" />
          <span className="ww-resp__cards">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      <label className="ww-resp__ctl">
        <span>
          Screen width <b>{name}</b>
        </span>
        <input type="range" min="30" max="100" value={w} onChange={(e) => setW(Number(e.target.value))} />
      </label>
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
              <p className="ww-app__big">Ana R.</p>
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
        <p className="ww-store__name">Cold brew, 12 oz</p>
        <span className="ww-store__cart" aria-label={`${n} in cart`}>
          Cart <b>{n}</b>
        </span>
      </div>
      <div className="ww-store__shot" aria-hidden="true">
        <svg viewBox="0 0 200 120">
          <rect x="80" y="14" width="40" height="92" rx="10" fill="none" stroke="currentColor" strokeWidth="4.5" />
          <path d="M80 44H120" fill="none" stroke="currentColor" strokeWidth="4" />
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

/* A deploy: four steps, ticked in order, with the time it took. */
const STEPS = ['Install', 'Build', 'Test', 'Deploy'];
function DeployDemo() {
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
        <span aria-live="polite">{done === STEPS.length ? 'Live in 52 s' : busy ? 'Working' : 'Idle'}</span>
      </div>
    </div>
  );
}

/* A design system: one set of tokens, light and dark. */
function ThemeDemo() {
  const [dark, setDark] = useState(false);
  return (
    <div className={`ww-theme${dark ? ' is-dark' : ''}`}>
      <div className="ww-theme__card">
        <p className="ww-theme__h">Spring menu</p>
        <p className="ww-theme__p">Six new plates, one new room.</p>
        <span className="ww-theme__btn">Reserve</span>
      </div>
      <div className="aw-switch ww-theme__switch">
        <button type="button" role="switch" aria-checked={dark} onClick={() => setDark((v) => !v)}>
          <span className="sr-only">Dark theme</span>
        </button>
        <p className="aw-switch__note">{dark ? 'Dark' : 'Light'}</p>
      </div>
    </div>
  );
}

const CARDS = [
  { tone: 'mint', tool: true, Demo: ResponsiveDemo, cap: ['Responsive.', 'Drag the edge. The same page reflows from three columns to one.'] },
  { tone: 'lilac', tool: true, Demo: AppDemo, cap: ['Mobile apps.', 'Tap the tabs. iOS and Android from one React Native codebase.'] },
  { tone: 'orange', tool: true, Demo: StoreDemo, cap: ['Stores.', 'Add to cart. WooCommerce, with checkout tested on a phone.'] },
  { tone: 'pink', tool: true, Demo: FormDemo, cap: ['Forms.', 'Type a bad email. It says so before you press Send.'] },
  { tone: 'blue', tool: true, Demo: DeployDemo, cap: ['Deploys.', 'Press Deploy. Every release is built, tested and logged.'] },
  { tone: null, tool: true, Demo: ThemeDemo, cap: ['Design systems.', 'Flip the theme. One set of tokens, light and dark.'] },
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
