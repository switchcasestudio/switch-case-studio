import { useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

/* The frames show themselves (owner, 2026-11-01: "an initial movement should
   happen in front of the user's eyes"). When a frame is in view it works its
   own real controls, one after the other: a slider slides, a chip is picked,
   a toggle flips, a field retypes, a handle moves, and the demo answers
   because the control really changed (events go through React). Everything
   goes back when it ends. A run is capped at 5 s (WCAG 2.2.2), and a real
   press, key or focus in the frame undoes it and stops it for good. Heroes
   already run themselves and links do nothing to show, so those two only
   pulse. The stage's own states are not run here: the visitor's scroll runs
   them (`scrub`, below, called by ProcessStage); every other frame is
   watched here and gets its one run. Pulse styles in brandWorld.scss. */
const PULSE_ONLY = '[class*="-hero__tp"], [class*="-hero__pick"], .bw-circle';
const CONTROLS = [
  'button:not(:disabled)',
  'input',
  'textarea',
  '[data-p="node"]',
  '.bw-grid__sticker',
  '.bw-grid__demo--hover',
  '.bw-pixel',
].join(', ');
const HANDLES = '.bw-comp__focal, .ww-flow__edge';
const GROUP = '[role="group"], [role="radiogroup"]';
const FRAMES = '.bw-grid__card, .bw-circles, .bw-state, [class*="-hero"]:not([class*="-hero__"])';

const BUDGET = 5; // s, every step of a run together
const LEAD = 0.5; // s, for the eyes to land on the frame

const running = new WeakMap();
const done = new WeakSet();

/* A run is the page working its own controls, so nothing it changes is news
   to a screen-reader user (UX audit, 2026-11-10: 23 to 38 polite updates in
   6 s, "63 px, 62 px, 61 px"). The frame's live regions go quiet for the
   run and come back a beat after it ends, once React has painted the reset.
   A real press gets them back at once. */
const LIVE = '[aria-live], [role="status"], [role="alert"], [role="log"], output';
const hushed = new WeakMap();
function hush(frame) {
  const h = hushed.get(frame);
  if (h) {
    clearTimeout(h.timer);
    h.timer = 0;
    return;
  }
  const els = [...frame.querySelectorAll(LIVE)].map((el) => [el, el.getAttribute('aria-live')]);
  els.forEach(([el]) => el.setAttribute('aria-live', 'off'));
  hushed.set(frame, { els, timer: 0 });
}
function unhush(frame, wait = 400) {
  const h = hushed.get(frame);
  if (!h) return;
  clearTimeout(h.timer);
  h.timer = setTimeout(() => {
    h.els.forEach(([el, was]) => (was === null ? el.removeAttribute('aria-live') : el.setAttribute('aria-live', was)));
    hushed.delete(frame);
  }, wait);
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nativeValue = (el) =>
  Object.getOwnPropertyDescriptor(el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set;

// Set a controlled field the way typing does, so React's onChange fires.
function setValue(el, v) {
  nativeValue(el).call(el, v);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

const isOn = (el) =>
  el.getAttribute('aria-pressed') === 'true' || el.getAttribute('aria-checked') === 'true' || el.classList.contains('is-on');
const press = (el) => el.isConnected && !el.disabled && el.click();

const pointer = (el, type, x = 0.5, extra = {}) => {
  const r = el.getBoundingClientRect();
  el.dispatchEvent(
    new PointerEvent(type, { bubbles: true, clientX: r.left + r.width * x, clientY: r.top + r.height / 2, ...extra }),
  );
};

/* A run's clock: gsap, so halt can kill whatever is in flight. A killed step
   never resolves and the run's loop just ends there. */
const hold = (run, s) =>
  new Promise((resolve) => {
    run.tween = gsap.delayedCall(s, resolve);
  });
const sweep = (run, s, onUpdate) =>
  new Promise((resolve) => {
    const p = { t: 0 };
    run.tween = gsap.to(p, { t: 1, duration: s, ease: 'none', onUpdate: () => onUpdate(p.t), onComplete: resolve });
  });

/* Each step: its length in seconds and what it does. `undo` is what puts the
   control back if the run is cut short. */
function rangeStep(el) {
  return {
    el,
    time: 1.4,
    async go(run) {
      const start = +el.value;
      const min = +el.min;
      const max = +el.max;
      const span = (max - min) * 0.35;
      const to = start + span <= max ? span : -span;
      const snap = (v) => min + Math.round((v - min) / (+el.step || 1)) * (+el.step || 1);
      run.undo = () => setValue(el, String(start));
      await sweep(run, 1.4, (t) => setValue(el, String(snap(start + to * Math.sin(t * Math.PI)))));
      run.undo();
    },
  };
}

function textStep(el) {
  return {
    el,
    time: 1.6,
    async go(run) {
      const start = el.value;
      const bit = start ? start.slice(-Math.min(8, start.length)) : 'you@';
      const base = start ? start.slice(0, -bit.length) : '';
      run.undo = () => setValue(el, start);
      await sweep(run, 1.6, (t) => {
        // A word out and back in; an empty field the other way round.
        const k = Math.abs(2 * t - 1);
        const n = Math.round(bit.length * (start ? k : 1 - k));
        const v = base + bit.slice(0, n);
        if (v !== el.value) setValue(el, v);
      });
      run.undo();
    },
  };
}

function pressStep(el, group) {
  // A group's next choice; alone or forced by data-try="twice", the same one.
  const items = group ? [...group.querySelectorAll('button:not(:disabled)')] : [];
  const next = items.find((b) => !isOn(b)) || el;
  return {
    el: next,
    time: 1.2,
    async go(run) {
      // What was on across the frame: a selection can span several groups.
      const on = [...next.closest(FRAMES).querySelectorAll('button')].filter(isOn);
      press(next);
      const back = () => {
        // One choice at a time: re-press the old one. Independent: flip it back.
        const lost = on.filter((b) => !isOn(b));
        if (lost.length) lost.forEach(press);
        else press(next);
      };
      run.undo = back;
      await hold(run, 1.2);
      back();
    },
  };
}

function handleStep(el) {
  return {
    el,
    time: 1.2,
    async go(run) {
      const key = (k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
      let moved = 0;
      const to = (n) => {
        for (; moved < n; moved += 1) key('ArrowLeft');
        for (; moved > n; moved -= 1) key('ArrowRight');
      };
      run.undo = () => to(0);
      await sweep(run, 1.2, (t) => to(Math.round(8 * Math.sin(t * Math.PI))));
      to(0);
    },
  };
}

function dragStep(el) {
  return {
    el,
    time: 1.2,
    async go(run) {
      const d = Draggable.get(el);
      if (!d) return;
      const x = gsap.getProperty(el, 'x');
      const y = gsap.getProperty(el, 'y');
      const put = (px, py) => {
        gsap.set(el, { x: px, y: py });
        d.update();
        if (d.vars.onDrag) d.vars.onDrag.call(d);
      };
      run.undo = () => put(x, y);
      await sweep(run, 1.2, (t) => {
        const k = Math.sin(t * Math.PI);
        put(x + 34 * k, y - 22 * k);
      });
      put(x, y);
    },
  };
}

function hoverStep(el) {
  return {
    el,
    time: 1.2,
    async go(run) {
      pointer(el, 'pointerdown', 0.5, { pointerType: 'touch' });
      run.undo = () => pointer(el, 'pointerup');
      await sweep(run, 1.2, (t) => pointer(el, 'pointermove', 0.25 + t / 2));
      run.undo();
    },
  };
}

function pixelStep(el) {
  return {
    el,
    time: 1.4,
    async go(run) {
      el.dispatchEvent(new PointerEvent('pointerenter', { clientX: 0, clientY: 0 }));
      run.undo = () => el.dispatchEvent(new PointerEvent('pointerleave'));
      await sweep(run, 1.4, (t) => {
        const r = el.getBoundingClientRect();
        el.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width * Math.sin(t * Math.PI), clientY: r.top }));
      });
      run.undo();
    },
  };
}

function stepsFor(frame) {
  const steps = [];
  const groups = new Set();
  let lone = null;
  frame.querySelectorAll(CONTROLS).forEach((el) => {
    if (!el.getBoundingClientRect().width || el.className.toString().includes('__pause')) return;
    if (el.matches(HANDLES)) steps.push(handleStep(el));
    else if (el.matches('input[type="range"]')) steps.push(rangeStep(el));
    else if (el.matches('input, textarea')) steps.push(textStep(el));
    else if (el.matches('[data-p="node"], .bw-grid__sticker')) steps.push(dragStep(el));
    else if (el.matches('.bw-grid__demo--hover')) steps.push(hoverStep(el));
    else if (el.matches('.bw-pixel')) steps.push(pixelStep(el));
    else if (el.dataset.try === 'run') steps.push({ el, time: 1.2, go: (run) => (press(el), hold(run, 1.2)) });
    else if (el.dataset.try === 'twice' || el.matches('[role="switch"]')) steps.push(pressStep(el));
    else if (el.closest(GROUP)) {
      const g = el.closest(GROUP);
      if (!groups.has(g)) {
        groups.add(g);
        steps.push(pressStep(el, g));
      }
    } else if (el.hasAttribute('aria-pressed') || el.matches('.bw-lesson__toggle.is-on, .bw-lesson__toggle')) {
      if (el.hasAttribute('aria-pressed')) steps.push(pressStep(el));
      else if (!lone) lone = el;
    } else if (!lone) lone = el;
  });
  // A frame whose one control is an action button: press it, and keep the
  // result, since that is what the button is for.
  if (!steps.length && lone) steps.push({ el: lone, time: 1.2, go: (run) => (press(lone), hold(run, 1.2)) });
  let left = BUDGET;
  return steps.filter((s) => {
    if (s.time > left) return false;
    left -= s.time;
    return true;
  });
}

function pulse(el) {
  el.setAttribute('data-hint', '');
  return () => el.removeAttribute('data-hint');
}

async function rehearse(frame, run, steps) {
  hush(frame);
  await hold(run, LEAD);
  for (const s of steps) {
    run.unpulse = pulse(s.el);
    // eslint-disable-next-line no-await-in-loop
    await s.go(run);
    run.undo = null;
    run.unpulse();
    run.unpulse = null;
  }
  running.delete(frame);
  unhush(frame);
  // One full showing per frame: it replayed on every scroll back.
  done.add(frame);
}

async function pulses(frame, run) {
  const els = [...frame.querySelectorAll(PULSE_ONLY)];
  for (const el of els) {
    run.unpulse = pulse(el);
    // eslint-disable-next-line no-await-in-loop
    await hold(run, 0.28);
    gsap.delayedCall(0.7, run.unpulse);
  }
  running.delete(frame);
}

export function play(frame) {
  if (done.has(frame) || running.has(frame) || reduced()) return;
  const run = {};
  if (frame.querySelector(PULSE_ONLY)) {
    running.set(frame, run);
    pulses(frame, run);
    return;
  }
  const steps = stepsFor(frame);
  if (!steps.length) return;
  running.set(frame, run);
  rehearse(frame, run, steps);
}

/* Scroll runs the demos (2026-11-15, the continuous stage). In the owner's
   reference every demo plays for as long as its state is on screen; here the
   visitor's own scroll is the clock, so it is not motion that starts by
   itself (no 5 s cap, no pause control) and scrolling back runs it backward.
   `scrub(frame, u)` takes a hold's progress, 0 to 1, and seeks the frame's
   controls one after the other, each out and back to where it started: a
   slider sweeps, a choice steps through its options, a toggle flips, a field
   retypes. Only what can be sought and comes back: an action button that
   starts a timed demo, a drag, a hover and a snapping handle are left to
   the visitor. A track
   keeps its own count of what it pressed and writes only on a change. A real
   press, key or focus in the frame ends it for good (`done`), as it ends a
   run. */
const SCRUB_MAX = 4;

/* A track reads where its control stands at the moment it leaves rest, never
   at build: the type tester fits its size to its width after mount, and a
   start read early (110px) swept a phone's 44px sample to 178px and "rested"
   it at 110. Every track in a frame reads it at once, as the frame leaves
   rest (`prime`): two controls can set the same state (AI Grounding's field
   and chips), and on a fast scroll back one step carried the chips home and
   the field into its sweep together, so the field read the chips' pick as
   its rest and kept it. */
function rangeTrack(el) {
  let start = null;
  const seek = (u) => {
    if (u <= 0 || u >= 1) {
      if (start !== null && +el.value !== start) setValue(el, String(start));
      return;
    }
    if (start === null) start = +el.value;
    const min = +el.min || 0;
    const max = el.max === '' ? 100 : +el.max;
    const step = +el.step || 1;
    const span = (max - min) * 0.35;
    const to = start + span <= max ? span : -span;
    const v = min + Math.round((start + to * Math.sin(u * Math.PI) - min) / step) * step;
    if (Math.abs(v - +el.value) > step / 2) setValue(el, String(+v.toFixed(6)));
  };
  seek.prime = () => (start = +el.value);
  seek.release = () => (start = null);
  return seek;
}

function textTrack(el) {
  let start = null;
  const seek = (u) => {
    if (u <= 0 || u >= 1) {
      if (start !== null && el.value !== start) setValue(el, start);
      return;
    }
    if (start === null) start = el.value;
    const bit = start ? start.slice(-Math.min(8, start.length)) : 'you@';
    const base = start ? start.slice(0, -bit.length) : '';
    const k = Math.abs(2 * u - 1);
    const v = base + bit.slice(0, Math.round(bit.length * (start ? k : 1 - k)));
    if (v !== el.value) setValue(el, v);
  };
  seek.prime = () => (start = el.value);
  seek.release = () => (start = null);
  return seek;
}

function toggleTrack(el) {
  let flipped = false;
  return (u) => {
    const want = u > 0.25 && u < 0.75;
    if (want === flipped) return;
    flipped = want;
    press(el);
  };
}

function groupTrack(group) {
  const items = [...group.querySelectorAll('button:not(:disabled)')];
  const rest = items.filter(isOn);
  // Several on, or none: the buttons are independent, so flip one.
  if (rest.length !== 1) return items.length ? toggleTrack(items.find((b) => !isOn(b)) || items[0]) : null;
  const stops = [rest[0], ...items.filter((b) => b !== rest[0]), rest[0]];
  let cur = 0;
  return (u) => {
    const k = Math.round(u * (stops.length - 1));
    if (k === cur) return;
    cur = k;
    const want = stops[k];
    // One on at rest does not make it one-at-a-time: independent buttons
    // keep the last pick on, so take that back before the next.
    items.forEach((b) => {
      if (b !== want && b !== rest[0] && isOn(b)) press(b);
    });
    if (!isOn(want)) press(want);
  };
}

function pixelTrack(el) {
  let inside = false;
  return (u) => {
    if (u <= 0 || u >= 1) {
      if (inside) el.dispatchEvent(new PointerEvent('pointerleave'));
      inside = false;
      return;
    }
    if (!inside) el.dispatchEvent(new PointerEvent('pointerenter', { clientX: 0, clientY: 0 }));
    inside = true;
    const r = el.getBoundingClientRect();
    el.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width * Math.sin(u * Math.PI), clientY: r.top }));
  };
}

const TYPED = ['', 'text', 'email', 'search', 'tel', 'url'];

// A list of pressed buttons with exactly one on is a pick, even without a
// group role (AI Handoff's questions): pressing a pick again keeps it, so a
// toggle track had no way back and Safari's pass left the wrong one open.
function pickList(el) {
  if (!el.hasAttribute('aria-pressed')) return null;
  const list = el.closest('ul, ol');
  if (!list) return null;
  const items = [...list.querySelectorAll('button[aria-pressed]')];
  return items.length > 1 && items.filter(isOn).length === 1 ? list : null;
}

function tracksFor(frame) {
  const tracks = [];
  const groups = new Set();
  frame.querySelectorAll(CONTROLS).forEach((el) => {
    if (tracks.length >= SCRUB_MAX) return;
    if (!el.getBoundingClientRect().width || el.className.toString().includes('__pause')) return;
    let t = null;
    // A handle snaps to what it is dragged near, so it has no way back: skip.
    if (el.matches(HANDLES)) t = null;
    else if (el.matches('input[type="range"]')) t = rangeTrack(el);
    else if (el.matches('textarea') || (el.matches('input') && TYPED.includes(el.getAttribute('type') || ''))) t = textTrack(el);
    else if (el.matches('.bw-pixel')) t = pixelTrack(el);
    else if (el.matches('input') || el.dataset.try === 'run') t = null;
    else if (el.dataset.try === 'twice' || el.matches('[role="switch"]')) t = toggleTrack(el);
    else if (el.closest(GROUP) || pickList(el)) {
      const g = el.closest(GROUP) || pickList(el);
      if (!groups.has(g)) {
        groups.add(g);
        t = groupTrack(g);
      }
    } else if (el.hasAttribute('aria-pressed')) t = toggleTrack(el);
    if (t) tracks.push(t);
  });
  return tracks;
}

const scrubs = new WeakMap();

// Returns whether the frame is still scroll's to run (false once a visitor
// has taken it, or there is nothing in it to seek).
export function scrub(frame, u) {
  if (!frame || done.has(frame) || reduced()) return false;
  let s = scrubs.get(frame);
  if (!s) {
    // Built at rest, the first time the frame has somewhere to go: at mount
    // a demo may not have settled into its layout yet.
    if (u <= 0 || u >= 1) return true;
    s = { tracks: tracksFor(frame), live: false };
    scrubs.set(frame, s);
  }
  const n = s.tracks.length;
  if (!n) return false;
  const on = u > 0 && u < 1;
  if (on && !s.live) {
    hush(frame);
    s.tracks.forEach((seek) => seek.prime && seek.prime());
  }
  s.tracks.forEach((seek, k) => seek(Math.min(1, Math.max(0, u * n - k))));
  if (!on && s.live) {
    unhush(frame);
    s.tracks.forEach((seek) => seek.release && seek.release());
  }
  s.live = on;
  return true;
}

export function halt(frame, wait) {
  const run = running.get(frame);
  if (!run) return;
  running.delete(frame);
  if (run.tween) run.tween.kill();
  if (run.undo) run.undo();
  if (run.unpulse) run.unpulse();
  unhush(frame, wait);
}

export default function useTryHint(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced()) return undefined;
    const frames = [...root.querySelectorAll(FRAMES)];
    // The stage runs its own states, by scroll (ProcessStage calls `scrub`).
    const pinned = (el) => el.matches('.bw-state');
    // The middle half of the viewport: a frame taller than a phone still counts.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (pinned(e.target)) return;
          if (e.isIntersecting) play(e.target);
          else halt(e.target);
        });
      },
      { rootMargin: '-25% 0px -25% 0px' },
    );
    frames.forEach((el) => io.observe(el));
    // isTrusted: the run's own events must not stop the run.
    const own = (e) => {
      const frame = e.target.closest && e.target.closest(FRAMES);
      if (!frame) return;
      done.add(frame);
      halt(frame, 0);
      // A scrubbed frame has no run to halt, but its live regions are quiet.
      unhush(frame, 0);
    };
    // A finger that lands on a frame is usually on its way to scroll the
    // page, and every swipe starts with a pointerdown: on a phone that ended
    // each demo before it began. A touch owns the frame only if it lifts
    // without having become a scroll (the browser cancels the pointer then).
    let touch = null;
    const stop = (e) => {
      if (!e.isTrusted) return;
      if (e.type === 'pointerdown' && e.pointerType === 'touch') {
        touch = e.pointerId;
        return;
      }
      if (e.type === 'pointercancel') {
        if (e.pointerId === touch) touch = null;
        return;
      }
      if (e.type === 'pointerup') {
        if (e.pointerId !== touch) return;
        touch = null;
      }
      own(e);
    };
    const events = ['pointerdown', 'pointerup', 'pointercancel', 'keydown', 'focusin'];
    events.forEach((t) => root.addEventListener(t, stop, true));
    return () => {
      io.disconnect();
      events.forEach((t) => root.removeEventListener(t, stop, true));
      frames.forEach(halt);
    };
  }, [rootRef]);
}
