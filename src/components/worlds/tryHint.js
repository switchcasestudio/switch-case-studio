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
   pulse. Scroll position starts it: the pinned stage calls play/halt (its
   states are stacked, so an observer would see all five), every other frame
   is watched here. Pulse styles in brandWorld.scss. */
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

export function halt(frame) {
  const run = running.get(frame);
  if (!run) return;
  running.delete(frame);
  if (run.tween) run.tween.kill();
  if (run.undo) run.undo();
  if (run.unpulse) run.unpulse();
}

export default function useTryHint(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced()) return undefined;
    const frames = [...root.querySelectorAll(FRAMES)];
    const pinned = (el) => el.matches('.bw-state') && window.matchMedia('(min-width: 1024px)').matches;
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
    const stop = (e) => {
      if (!e.isTrusted) return;
      const frame = e.target.closest && e.target.closest(FRAMES);
      if (!frame) return;
      done.add(frame);
      halt(frame);
    };
    const events = ['pointerdown', 'keydown', 'focusin'];
    events.forEach((t) => root.addEventListener(t, stop, true));
    return () => {
      io.disconnect();
      events.forEach((t) => root.removeEventListener(t, stop, true));
      frames.forEach(halt);
    };
  }, [rootRef]);
}
