import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { q } from '../servicePoster/usePosterEngine';

/* The engine of a "kinds" hero (2026-10-27), lifted out of the Web world's
   KindsHero so the AI world's runs the same one: the schedule, visibility,
   the log, the header fit and the pointer drift. A hero passes its prefix
   (`wb`, `aw`), its kinds (each with four `lines`), its screens smallest
   first (`touch`, the order they draw in) and how far each drifts.
   - Live: while on screen it shows the next kind every few seconds; four
     log lines per kind, one per screen as it draws in. Pause stops it
     (WCAG 2.2.2). Under reduced motion nothing switches on its own and a
     pick writes the log at once.
   - Reacting: the screens drift toward a fine pointer, hovering one lifts
     it (`hot`), a click on one shows the next kind, the pills pick one.
   Auto switches are not announced; picked ones are. */

const AUTO_FIRST = 2200;
const AUTO_GAP = 4600;

const lineItems = (k, n) => k.lines.map(([tag, text], i) => ({ tag, text, id: `${n}-${i}` }));

export default function useKindsHero({ p, kinds, touch, drift }) {
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const [kind, setKind] = useState(0);
  const [log, setLog] = useState(() => lineItems(kinds[0], 1));
  const [hot, setHot] = useState(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState(false);

  // The engine: the schedule, visibility, the log. Built once; everything
  // it reads lives in refs, everything it shows goes through state setters.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { runs: 1, next: 1, timer: 0, tl: null, visible: false, paused: false };

    const canAuto = () => !reduced && st.visible && !st.paused && !document.hidden;
    const sync = () => setLive(canAuto());
    const push = (line) => setLog((l) => [...l, line].slice(-4));

    function schedule(delay) {
      clearTimeout(st.timer);
      if (!canAuto()) return;
      st.timer = setTimeout(() => show(st.next, false), delay);
    }

    // A pick never waits: it cuts the running switch short.
    function show(index, manual) {
      clearTimeout(st.timer);
      if (st.tl) st.tl.kill();
      const i = index % kinds.length;
      st.next = (i + 1) % kinds.length;
      st.runs += 1;
      setAnnounce(manual);
      setKind(i);
      const lines = lineItems(kinds[i], st.runs);
      if (reduced) {
        setLog(lines);
        return;
      }
      // One line per screen as it draws in, smallest screen first.
      const tl = gsap.timeline({
        onComplete: () => {
          st.tl = null;
          schedule(AUTO_GAP);
        },
      });
      st.tl = tl;
      [0, 0.35, 0.8, 1.3].forEach((at, n) => tl.call(() => push(lines[n]), null, at));
      tl.to({}, { duration: 0.8 }, 1.3);
    }

    const io = new IntersectionObserver(
      ([e]) => {
        st.visible = e.isIntersecting;
        sync();
        if (st.visible) schedule(st.runs > 1 ? AUTO_GAP / 2 : AUTO_FIRST);
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
      show: (i) => show(i, true),
      next: () => show(st.next, true),
      setPaused: (v) => {
        st.paused = v;
        sync();
        if (v) clearTimeout(st.timer);
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
  }, [kinds]);

  // One screen, header included: the hero's height subtracts the header's
  // real height, which wraps taller at some widths.
  useEffect(() => {
    const root = rootRef.current;
    const header = document.querySelector('.site-header');
    if (!root || !header || typeof ResizeObserver === 'undefined') return undefined;
    const fit = () => root.style.setProperty('--wh-header', `${header.offsetHeight}px`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // The pointer: each screen drifts toward it, the small ones more (they
  // sit nearer the eye). quickTo tweens settle and stop on their own. Fine
  // pointers only.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root && root.querySelector(`.${p}-hero__stage`);
    const svg = stage && stage.querySelector('svg');
    if (!svg) return undefined;
    const ok = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!ok) return undefined;
    const els = touch.map((k) => q(svg, `drift-${k}`));
    const tos = els.map((el) => [
      gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' }),
      gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' }),
    ]);
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      touch.forEach((k, i) => {
        tos[i][0](x * 16 * drift[k]);
        tos[i][1](y * 12 * drift[k]);
      });
    };
    const onLeave = () =>
      tos.forEach(([tx, ty]) => {
        tx(0);
        ty(0);
      });
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(els);
    };
  }, [p, touch, drift]);

  const next = () => engineRef.current && engineRef.current.next();
  const pick = (i) => engineRef.current && engineRef.current.show(i);
  const togglePause = () => {
    const v = !paused;
    setPaused(v);
    if (engineRef.current) engineRef.current.setPaused(v);
  };
  const hover = (key) => ({
    onPointerEnter: () => setHot(key),
    onPointerLeave: () => setHot(null),
  });
  // A screen's props: its class, its draw-in delay and entrance order.
  const tp = (key) => ({
    className: `${p}-hero__tp ${p}-hero__tp--${key}${hot === key ? ' is-on' : ''}`,
    style: { '--d': `${touch.indexOf(key) * 0.14}s`, '--i': touch.indexOf(key) },
    onClick: next,
    ...hover(key),
  });

  const cls = [`${p}-hero`, `is-k-${kinds[kind].key}`];
  if (live) cls.push('is-live');
  if (hot) cls.push('is-hot', `is-hot-${hot}`);

  return { rootRef, kind, log, hot, paused, announce, cls: cls.join(' '), pick, togglePause, hover, tp };
}
