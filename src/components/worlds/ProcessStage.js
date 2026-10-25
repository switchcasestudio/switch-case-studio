import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* A world's process stage (2026-10-22): what the reference builds from 67
   fixed layers. One pinned viewport, five states; per state the field color
   fades over the last, the artefact scales in, the text card lands on the
   other side, the sticker comes in from the other corner. Timeline on a
   pinned ScrollTrigger (house pattern), same gate as the collage. Under
   1024px or reduced motion the states stack as plain sections.
   Shared by the worlds: `states` come from the page. A state:
     { key, field, ink, title, copy, side: 'left'|'right', corner: 'tr'|'bl',
       Art, Sticker, artRatio, stickerRatio, narrow?, lazy? }
   `narrow` keeps a portrait artefact from filling the stage; `lazy` mounts
   the Art only once the stage is within a viewport (a three.js piece). */
const GATE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

export default function ProcessStage({ states, label, heading }) {
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
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: stage,
          start: `top top+=${top}`,
          end: `+=${states.length * 120}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });
      // Hold the last state as long as the others: the timeline runs to
      // states.length seconds, one per state.
      tl.to({}, { duration: 0.01 }, states.length);
      els.forEach((el, i) => {
        const s = states[i];
        const art = el.querySelector('.bw-state__art');
        const card = el.querySelector('.bw-state__card');
        const sticker = el.querySelector('.bw-state__sticker');
        const title = el.querySelector('.bw-state__title');
        const at = i;
        const cardX = s.side === 'right' ? 80 : -80;
        const stX = s.corner === 'tr' ? 120 : -120;
        const stY = s.corner === 'tr' ? -80 : 80;
        if (i === 0) {
          // The first state is already on when the stage pins; it only
          // leaves. (A scrubbed entrance at progress 0 is a blank stage.)
          gsap.set(stage, { backgroundColor: s.field, color: s.ink });
          gsap.set(el, { autoAlpha: 1, pointerEvents: 'auto' });
          gsap.set([art, card, title, sticker], { autoAlpha: 1 });
        } else {
          tl.to(stage, { backgroundColor: s.field, color: s.ink, duration: 0.3 }, at);
          tl.set(el, { autoAlpha: 1, pointerEvents: 'auto' }, at);
          tl.fromTo(art, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at);
          tl.fromTo(card, { autoAlpha: 0, x: cardX }, { autoAlpha: 1, x: 0, duration: 0.3 }, at + 0.05);
          tl.fromTo(title, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.05);
          tl.fromTo(sticker, { autoAlpha: 0, x: stX, y: stY }, { autoAlpha: 1, x: 0, y: 0, duration: 0.35 }, at + 0.15);
        }
        if (i < states.length - 1) {
          tl.to([art, card, title], { autoAlpha: 0, duration: 0.2 }, at + 0.8);
          tl.to(sticker, { autoAlpha: 0, x: -stX, y: -stY, duration: 0.2 }, at + 0.8);
          tl.set(el, { pointerEvents: 'none' }, at + 1);
        }
      });
      return () => tl.scrollTrigger && tl.scrollTrigger.kill();
    });
    return () => mm.revert();
  }, [states]);

  return (
    <section ref={stageRef} className="bw-stage" aria-label={label}>
      <h2 className="bw-stage__h">{heading}</h2>
      {states.map((s, i) => (
        <article
          key={s.key}
          className={`bw-state bw-state--${s.side} bw-state--${s.corner}${s.narrow ? ' bw-state--narrow' : ''}`}
          data-state={s.key}
          style={{ '--bw-field': s.field, '--bw-ink': s.ink }}
        >
          <p className="bw-state__title">
            <span className="bw-state__n">0{i + 1}</span> {s.title}
          </p>
          <div className="bw-state__art" style={{ aspectRatio: s.artRatio }}>
            {s.lazy ? near && <s.Art /> : <s.Art />}
          </div>
          <div className="bw-state__card">
            <p>{s.copy}</p>
          </div>
          <div className="bw-state__sticker" style={{ aspectRatio: s.stickerRatio }}>
            <s.Sticker />
          </div>
        </article>
      ))}
    </section>
  );
}
