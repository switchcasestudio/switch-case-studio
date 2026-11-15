import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { play, halt, scrub } from './tryHint';

gsap.registerPlugin(ScrollTrigger);

/* A world's process stage (2026-10-22): what the reference builds from 67
   fixed layers. One pinned viewport, five states; per state the field color
   fades over the last, the artifact scales in, the text card lands on the
   other side, the sticker comes in from the other corner. Timeline on a
   pinned ScrollTrigger (house pattern), same gate as the collage. Under
   1024px or reduced motion the states stack as plain sections.
   Shared by the worlds: `states` come from the page. A state:
     { key, field, ink, title, copy, side: 'left'|'right', corner: 'tr'|'bl',
       Art, Sticker, artRatio, stickerRatio, narrow?, lazy? }
   `narrow` keeps a portrait artifact from filling the stage; `lazy` mounts
   the Art only once the stage is within a viewport (a three.js piece);
   `full` gives the Art the whole stage under the title, with no card and
   no sticker (the brand world's type tester, 2026-10-25); `tool` marks an
   Art with controls in it: it steps away from its card so no control sits
   under it, and stacked it takes the height its content needs. */
const GATE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/* The continuous stage (2026-11-15, `continuous` prop; the brand world first).
   Read against the owner's reference recording frame by frame, the classic
   timeline below is a slideshow: every part fades to nothing, the field
   crossfades on an empty screen, the next state fades in, and about 30% of a
   state's scroll shows a ghosted or empty stage. The reference is one shot:
   a plate is on screen at full strength on every frame. So here nothing
   fades. The next plate grows out of the middle of the one before it while
   both slide to the new side, the field flips under them, a card leaves by
   its edge before the next comes in by the other, and a sticker drifts up
   its lane for the whole hold. A `full` state's plate is its whole article:
   the world grows out of the plate before it and shrinks back into the next.
   The stage arrives with its first plate large and settles as it pins.
   Every clip-path tween is a fromTo with both strings written out: the
   computed value comes back shortened ("inset(0px round 14px)") and GSAP
   cannot pair its numbers with a four-value target. */
const INTRO = 0.5; // timeline units before the first hold; a state is 1
const R = 14; // a plate's corner radius, px
const inset = (t, r, b, l, round = R) => `inset(${t}px ${r}px ${b}px ${l}px round ${round}px)`;

// A plate's own color: the art's, or the demo's inside it.
const paint = (el) => {
  for (const x of [el, el.firstElementChild]) {
    const c = x && getComputedStyle(x).backgroundColor;
    if (c && gsap.utils.splitColor(c)[3] !== 0 && c !== 'transparent') return c;
  }
  return null;
};
const alike = (a, b) => {
  if (!a || !b) return false;
  const [x, y] = [gsap.utils.splitColor(a), gsap.utils.splitColor(b)];
  return Math.max(Math.abs(x[0] - y[0]), Math.abs(x[1] - y[1]), Math.abs(x[2] - y[2])) < 40;
};

function buildContinuous(stage, els, states, tl) {
  const W = () => stage.clientWidth;
  const H = () => stage.clientHeight;
  const P = els.map((el, i) => ({
    el,
    full: !!states[i].full,
    plate: states[i].full ? el : el.querySelector('.bw-state__art'),
    card: el.querySelector('.bw-state__card'),
    sticker: el.querySelector('.bw-state__sticker'),
    title: el.querySelector('.bw-state__title'),
  }));
  // Two stage layouts share this timeline: the brand world centers its art
  // and card on a point with a -50% translate; the outline worlds place them
  // by their edges, no transform. Read which, once, before GSAP writes any.
  const centered = (el, axis) => {
    if (!el) return false;
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return axis === 'x' ? Math.abs(m.e + el.offsetWidth / 2) < 2 : Math.abs(m.f + el.offsetHeight / 2) < 2;
  };
  P.forEach((p) => {
    p.cx = !p.full && centered(p.plate, 'x');
    p.cy = !p.full && centered(p.plate, 'y');
    p.cardY = centered(p.card, 'y');
  });
  // An element's box at rest, in stage pixels, read from layout (transforms
  // do not move offsetLeft): { l, t, w, h }.
  const rest = (el, cx, cy) => ({
    l: el.offsetLeft - (cx ? el.offsetWidth / 2 : 0),
    t: el.offsetTop - (cy ? el.offsetHeight / 2 : 0),
    w: el.offsetWidth,
    h: el.offsetHeight,
  });
  // A plate's box by its center.
  const box = (p) => {
    if (p.full) return { cx: W() / 2, cy: H() / 2, w: W(), h: H() };
    const r = rest(p.plate, p.cx, p.cy);
    return { cx: r.l + r.w / 2, cy: r.t + r.h / 2, w: r.w, h: r.h };
  };
  const whole = (p) => (p.full ? inset(0, 0, 0, 0, 0) : inset(0, 0, 0, 0));
  // How far a card or a sticker travels to clear the nearer edge of the stage.
  const off = (r) => (r.l + r.w / 2 > W() / 2 ? W() - r.l + 24 : -(r.l + r.w + 24));
  const cardOff = (p) => () => off(rest(p.card, false, p.cardY));
  const stickerOff = (p) => () => off(rest(p.sticker));
  // A sticker's ride: up to 24% of the stage, ending as high above its place
  // as the lane is free (its own card or the title row may sit above it) and
  // starting the rest of the way below, never more than a third cut off.
  const label = stage.querySelector('.bw-stage__h');
  const lane = (p) => {
    const D = H() * 0.24;
    const st = rest(p.sticker);
    const above = [p.card && rest(p.card, false, p.cardY), p.title && rest(p.title), label && rest(label)]
      .filter((r) => r && r.l < st.l + st.w && r.l + r.w > st.l && r.t + r.h <= st.t + 8)
      .map((r) => r.t + r.h);
    const up = Math.max(0, Math.min(D, st.t - Math.max(0, ...above) - 16));
    const down = Math.max(0, Math.min(D - up, H() - (st.t + st.h) + st.h * 0.33));
    return { from: down, to: -up };
  };

  // Take the CSS percentage transforms over, or a later x tween is poisoned.
  P.forEach((p) => {
    if (!p.full) {
      gsap.set(p.plate, { xPercent: p.cx ? -50 : 0, yPercent: p.cy ? -50 : 0, x: 0, y: 0, clipPath: whole(p) });
    }
    if (p.card) gsap.set(p.card, { yPercent: p.cardY ? -50 : 0, x: 0, y: 0 });
  });
  gsap.set(stage, { backgroundColor: states[0].field, color: states[0].ink });
  gsap.set(P[0].el, { autoAlpha: 1, pointerEvents: 'auto' });

  const last = P.length - 1;
  const intro = P[0].full ? 0 : INTRO;
  const at = (i) => intro + i;

  // The first plate arrives large, in the middle, and settles as the stage pins.
  if (intro) {
    const p = P[0];
    const big = () => {
      const b = box(p);
      return Math.max(1, Math.min((W() * 0.9) / b.w, (H() - 132) / b.h));
    };
    tl.fromTo(
      p.plate,
      { scale: big, x: () => W() / 2 - box(p).cx },
      { scale: 1, x: 0, duration: 0.36, ease: 'power2.inOut' },
      0.04,
    );
    tl.fromTo(p.title, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.32);
    if (p.card) tl.fromTo(p.card, { x: cardOff(p) }, { x: 0, duration: 0.2, ease: 'power2.out' }, 0.26);
  }

  P.forEach((p, i) => {
    // A sticker rides up its lane for the whole hold, in from its edge and out by it.
    if (p.sticker) {
      const from = i === 0 ? 0.3 : at(i) + 0.08;
      const to = i === last ? at(i) + 1 : at(i) + 0.98;
      tl.fromTo(p.sticker, { y: () => lane(p).from }, { y: () => lane(p).to, duration: to - from, ease: 'none' }, from);
      tl.fromTo(p.sticker, { x: stickerOff(p) }, { x: 0, duration: 0.16, ease: 'power2.out' }, from);
      if (i < last) {
        tl.fromTo(p.sticker, { x: 0 }, { x: stickerOff(p), duration: 0.12, ease: 'power2.in', immediateRender: false }, to - 0.12);
      }
    }
    if (i === last) return;

    // The hand-off to the next state, around the boundary B.
    const n = P[i + 1];
    const B = at(i + 1);
    const s = states[i + 1];
    const move = { duration: 0.18, ease: 'power2.inOut' };
    const t0 = B - 0.09;

    tl.set(n.el, { autoAlpha: 1 }, B - 0.17);
    if (p.card) tl.fromTo(p.card, { x: 0 }, { x: cardOff(p), duration: 0.11, ease: 'power2.in', immediateRender: false }, B - 0.16);
    if (!n.full) {
      tl.fromTo(p.title, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -24, duration: 0.05, ease: 'power2.in', immediateRender: false }, t0);
      tl.fromTo(n.title, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.07 }, B - 0.02);
    }
    // The field flips under the plates. Into a full state it is the state's
    // own article that grows over the stage, so the stage follows once covered;
    // out of one, the stage changes first, hidden under it.
    // A cut, never a blend (a tween here showed a muddy frame between two
    // fields). Between two plates it lands mid-wipe, once the new plate holds
    // the middle; unless a plate would sit on a field of its own color: the
    // old plate on the new field waits until it is covered, the new plate on
    // the old field gets its own field first.
    let cut = B - 0.02;
    if (n.full) cut = B + 0.09;
    else if (p.full) cut = t0;
    else if (alike(paint(p.plate), s.field)) cut = B + 0.09;
    else if (alike(paint(n.plate), states[i].field)) cut = t0;
    tl.set(stage, { backgroundColor: s.field }, cut);
    tl.set(stage, { color: s.ink }, B);

    if (!p.full && !n.full) {
      // Two plates, one center: the old one carries to the new side, the new
      // one starts that far back, and grows out of the old one's middle.
      const dx = () => box(n).cx - box(p).cx;
      const dy = () => box(n).cy - box(p).cy;
      tl.fromTo(p.plate, { x: 0, y: 0 }, { x: dx, y: dy, ...move, immediateRender: false }, t0);
      tl.fromTo(n.plate, { x: () => -dx(), y: () => -dy() }, { x: 0, y: 0, ...move }, t0);
      // A smaller newcomer: the old plate closes in to its size.
      tl.fromTo(
        p.plate,
        { clipPath: whole(p) },
        {
          clipPath: () => {
            const a = box(p);
            const b = box(n);
            const ix = Math.max(0, (a.w - b.w) / 2);
            const iy = Math.max(0, (a.h - b.h) / 2);
            return inset(iy, ix, iy, ix);
          },
          ...move,
          immediateRender: false,
        },
        t0,
      );
      tl.fromTo(n.plate, { clipPath: () => inset(box(n).h / 2, box(n).w / 2, box(n).h / 2, box(n).w / 2) }, { clipPath: whole(n), ...move }, t0);
    } else if (n.full) {
      // The world grows out of the middle of the plate before it.
      tl.fromTo(
        n.el,
        {
          clipPath: () => {
            const a = box(p);
            return inset(a.cy, W() - a.cx, H() - a.cy, a.cx);
          },
        },
        { clipPath: whole(n), ...move },
        t0,
      );
    } else {
      // Out of a full state: the world closes in to the next plate's box,
      // and the plate grows out of its own middle to meet it.
      tl.fromTo(
        p.el,
        { clipPath: whole(p) },
        {
          clipPath: () => {
            const b = box(n);
            return inset(b.cy - b.h / 2, W() - b.cx - b.w / 2, H() - b.cy - b.h / 2, b.cx - b.w / 2);
          },
          ...move,
          immediateRender: false,
        },
        t0,
      );
      tl.fromTo(n.plate, { clipPath: () => inset(box(n).h / 2, box(n).w / 2, box(n).h / 2, box(n).w / 2) }, { clipPath: whole(n), ...move }, t0);
    }

    if (n.card) tl.fromTo(n.card, { x: cardOff(n) }, { x: 0, duration: 0.12, ease: 'power2.out' }, B + 0.06);
    tl.set(p.el, { pointerEvents: 'none' }, t0);
    tl.set(n.el, { pointerEvents: 'auto' }, B + 0.09);
    tl.set(p.el, { autoAlpha: 0 }, B + 0.1);
  });
  // The last state holds as long as the others.
  tl.to({}, { duration: 0.01 }, at(last) + 0.99);
  return { total: at(last) + 1, intro };
}

export default function ProcessStage({ states, label, heading, continuous = false }) {
  const stageRef = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    // Mount the heavy piece only once the stage is within a viewport of view.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const mm = gsap.matchMedia();
    mm.add(GATE, () => {
      const els = [...stage.querySelectorAll('.bw-state')];
      // The site header is fixed on this route: pin under it, not behind it.
      const header = document.querySelector('.site-header');
      const top = header ? header.offsetHeight : 0;
      stage.style.setProperty('--bw-top', `${top}px`);
      // The state on screen, once its entrance has landed, gets the try-me pulse.
      let hinted = -1;
      // Timeline units: one per state, after `intro` units of arrival.
      const span = { total: states.length, intro: 0 };
      // The continuous stage: scroll is each demo's clock for as long as its
      // state holds (the first one from the moment the stage arrives).
      const seen = states.map(() => 0);
      const run = (self) => {
        const t = self.progress * span.total - span.intro;
        els.forEach((el, i) => {
          const a = i === 0 ? 0.04 - span.intro : i + 0.2;
          const u = Math.min(1, Math.max(0, (t - a) / (i + 0.84 - a)));
          if (u === seen[i]) return;
          seen[i] = u;
          scrub(el, u);
        });
      };
      const hint = (self) => {
        if (continuous) {
          run(self);
          return;
        }
        const t = Math.max(0, self.progress * span.total - span.intro);
        const i = Math.min(Math.floor(t), states.length - 1);
        const f = t - i;
        const on = self.isActive && (i === 0 || f > 0.3) && (f < 0.8 || i === states.length - 1) ? i : -1;
        if (on === hinted) return;
        if (hinted >= 0) halt(els[hinted]);
        hinted = on;
        if (on >= 0) play(els[on]);
      };
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: stage,
          start: `top top+=${top}`,
          end: `+=${(states.length + (continuous && !states[0].full ? INTRO : 0)) * 120}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: hint,
          onToggle: hint,
        },
      });
      if (continuous) {
        stage.classList.add('is-continuous');
        Object.assign(span, buildContinuous(stage, els, states, tl));
        return () => {
          els.forEach((el) => scrub(el, 0));
          if (tl.scrollTrigger) tl.scrollTrigger.kill();
          stage.classList.remove('is-continuous');
        };
      }
      // Hold the last state as long as the others: the timeline runs to
      // states.length seconds, one per state.
      tl.to({}, { duration: 0.01 }, states.length);
      els.forEach((el, i) => {
        const s = states[i];
        const art = el.querySelector('.bw-state__art, .bw-state__full');
        // A full state has no card and no sticker.
        const card = el.querySelector('.bw-state__card');
        const sticker = el.querySelector('.bw-state__sticker');
        const title = el.querySelector('.bw-state__title');
        const parts = [art, card, title].filter(Boolean);
        const at = i;
        const cardX = s.side === 'right' ? 80 : -80;
        const stX = s.corner === 'tr' ? 120 : -120;
        const stY = s.corner === 'tr' ? -80 : 80;
        if (i === 0) {
          // The first state is already on when the stage pins; it only
          // leaves. (A scrubbed entrance at progress 0 is a blank stage.)
          gsap.set(stage, { backgroundColor: s.field, color: s.ink });
          gsap.set(el, { autoAlpha: 1, pointerEvents: 'auto' });
          gsap.set([...parts, sticker].filter(Boolean), { autoAlpha: 1 });
        } else {
          tl.to(stage, { backgroundColor: s.field, color: s.ink, duration: 0.3 }, at);
          tl.set(el, { autoAlpha: 1, pointerEvents: 'auto' }, at);
          tl.fromTo(art, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at);
          if (card) tl.fromTo(card, { autoAlpha: 0, x: cardX }, { autoAlpha: 1, x: 0, duration: 0.3 }, at + 0.05);
          tl.fromTo(title, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.05);
          if (sticker) tl.fromTo(sticker, { autoAlpha: 0, x: stX, y: stY }, { autoAlpha: 1, x: 0, y: 0, duration: 0.35 }, at + 0.15);
        }
        if (i < states.length - 1) {
          tl.to(parts, { autoAlpha: 0, duration: 0.2 }, at + 0.8);
          if (sticker) tl.to(sticker, { autoAlpha: 0, x: -stX, y: -stY, duration: 0.2 }, at + 0.8);
          tl.set(el, { pointerEvents: 'none' }, at + 1);
        }
      });
      return () => {
        if (hinted >= 0) halt(els[hinted]);
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
      };
    });
    return () => mm.revert();
  }, [states, continuous]);

  return (
    <section ref={stageRef} className="bw-stage" aria-label={label}>
      <h2 className="bw-stage__h">{heading}</h2>
      {states.map((s, i) => (
        <article
          key={s.key}
          className={`bw-state bw-state--${s.side} bw-state--${s.corner}${s.narrow ? ' bw-state--narrow' : ''}${
            s.full ? ' bw-state--full' : ''
          }${s.tool ? ' bw-state--tool' : ''}`}
          data-state={s.key}
          style={{ '--bw-field': s.field, '--bw-ink': s.ink }}
        >
          <p className="bw-state__title">
            <span className="bw-state__n">
              0{i + 1}
              <span className="bw-state__of"> / 0{states.length}</span>
            </span>{' '}
            {s.title}
          </p>
          {s.full ? (
            <div className="bw-state__full">
              <s.Art />
            </div>
          ) : (
            <>
              <div className="bw-state__art" style={{ aspectRatio: s.artRatio }}>
                {s.lazy ? near && <s.Art /> : <s.Art />}
              </div>
              <div className="bw-state__card">
                <p>{s.copy}</p>
              </div>
              <div className="bw-state__sticker" style={{ aspectRatio: s.stickerRatio }}>
                <s.Sticker />
              </div>
            </>
          )}
        </article>
      ))}
    </section>
  );
}
