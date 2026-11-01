import { useEffect } from 'react';

/* The "try me" pulse (owner, 2026-11-01: hint that the elements in every
   frame "can do something"). When a frame is in view its real controls pulse
   one after the other: two passes, all motion over within 5 s (WCAG 2.2.2),
   and pressing, typing or focusing in a frame stops it for good. Only what
   does something pulses, so the pulse stays true. Scroll position starts it:
   the pinned stage calls play/halt (its states are stacked, so an observer
   would see all five), every other frame is watched here. Written as a data
   attribute, which React's className never overwrites; `scale` composes with
   GSAP's transform. Styles in brandWorld.scss. */
const TARGETS = [
  'button:not(:disabled)',
  'input',
  'textarea',
  '[contenteditable]',
  '[data-p="node"]',
  '[class*="-hero__tp"]',
  '.bw-grid__demo--hover',
  '.bw-grid__sticker',
  '.bw-pixel',
  '.bw-circle',
]
  .map((s) => `${s}:not([class*="__pause"])`)
  .join(', ');
const FRAMES = '.bw-grid__card, .bw-circles, .bw-state, [class*="-hero"]:not([class*="-hero__"])';

const PULSE = 900; // ms, the keyframes' length
const GAP = 3000; // ms, start of pass one to start of pass two
const SPREAD = 1100; // ms, the last target's delay at most

const running = new WeakMap();
const done = new WeakSet();

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function clear(targets) {
  targets.forEach((el) => {
    el.removeAttribute('data-hint');
    el.style.removeProperty('--hint-at');
  });
}

function pass(targets) {
  const step = Math.min(120, SPREAD / targets.length);
  targets.forEach((el, i) => {
    el.style.setProperty('--hint-at', `${Math.round(i * step)}ms`);
    el.setAttribute('data-hint', '');
  });
  return setTimeout(() => clear(targets), PULSE + step * targets.length);
}

export function play(frame) {
  if (done.has(frame) || running.has(frame) || reduced()) return;
  const targets = [...frame.querySelectorAll(TARGETS)].filter((el) => el.getBoundingClientRect().width > 0);
  if (!targets.length) return;
  const run = { targets, timers: [pass(targets)] };
  run.timers.push(
    setTimeout(() => {
      clear(targets);
      run.timers.push(pass(targets));
    }, GAP),
  );
  running.set(frame, run);
}

export function halt(frame) {
  const run = running.get(frame);
  if (!run) return;
  run.timers.forEach(clearTimeout);
  clear(run.targets);
  running.delete(frame);
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
    const stop = (e) => {
      const frame = e.target.closest && e.target.closest(FRAMES);
      if (!frame) return;
      done.add(frame);
      halt(frame);
    };
    const events = ['pointerdown', 'keydown', 'focusin', 'input'];
    events.forEach((t) => root.addEventListener(t, stop, true));
    return () => {
      io.disconnect();
      events.forEach((t) => root.removeEventListener(t, stop, true));
      frames.forEach(halt);
    };
  }, [rootRef]);
}
