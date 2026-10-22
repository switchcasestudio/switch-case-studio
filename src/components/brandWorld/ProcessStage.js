import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoTile from './VideoTile';
import PixelTile from './PixelTile';
import { LowtideColour, SealStar, MeridianType, StudioNote } from './tiles/concepts';

gsap.registerPlugin(ScrollTrigger);

// three + fiber stay out of the page bundle until the stage is near.
const Card3D = lazy(() => import('./Card3D'));

/* The process stage (2026-10-22): what the reference builds from 67 fixed
   layers. One pinned viewport, five states; per state the field color
   fades over the last, the artefact scales in, the text card lands on the
   other side, the sticker comes in from the other corner. Timeline on a
   pinned ScrollTrigger (house pattern), same gate as the collage. Under
   1024px or reduced motion the states stack as plain sections. */
const STATES = [
  {
    key: 'discovery',
    field: '#fef7ed',
    ink: '#141414',
    title: 'Discovery',
    copy: 'We start with what the business sells, who buys it and what they need to feel before they pay. The logo waits.',
    side: 'right',
    corner: 'bl',
    Art: () => <StudioNote />,
    Sticker: () => <PixelTile />,
    artRatio: '4/3',
    stickerRatio: '1',
  },
  {
    key: 'mark',
    field: '#ff834a',
    ink: '#141414',
    title: 'The mark',
    copy: 'Three directions, drawn by hand first. One survives being shrunk to a favicon and stretched across a van.',
    side: 'left',
    corner: 'tr',
    Art: () => <VideoTile src="/brand-world/hatch-loop.mp4" poster="/brand-world/hatch-loop.jpg" label="Hatch mark, drawn then recoloured" />,
    Sticker: () => <SealStar />,
    artRatio: '16/9',
    stickerRatio: '776/748',
  },
  {
    key: 'type',
    field: '#dab8ff',
    ink: '#141414',
    title: 'Type',
    copy: 'One face for headlines, one for everything else, and the sizes written down so nobody guesses later.',
    side: 'right',
    corner: 'bl',
    Art: () => <VideoTile src="/brand-world/meridian-loop.mp4" poster="/brand-world/meridian-loop.jpg" label="Meridian clock, 7 to 12" />,
    Sticker: () => <MeridianType />,
    artRatio: '16/9',
    stickerRatio: '3/2',
  },
  {
    key: 'color',
    field: '#1748ef',
    ink: '#fef7ed',
    title: 'Color',
    copy: 'Five swatches with names and codes, tested on a bad printer and a cheap phone before they are final.',
    side: 'left',
    corner: 'tr',
    Art: () => <VideoTile src="/brand-world/lowtide-sticker.mp4" poster="/brand-world/lowtide-sticker.jpg" label="Lowtide, the sun over the tide" />,
    Sticker: () => <LowtideColour />,
    artRatio: '9/16',
    stickerRatio: '4/3',
  },
  {
    key: 'system',
    field: '#141414',
    ink: '#fef7ed',
    title: 'The system',
    copy: 'Cards, stickers, a sound for the door. Rules a new hire can follow on day one without asking.',
    side: 'right',
    corner: 'bl',
    Art: () => (
      <Suspense fallback={null}>
        <Card3D />
      </Suspense>
    ),
    Sticker: () => <VideoTile src="/brand-world/hum-loop.mp4" poster="/brand-world/hum-loop.jpg" label="Hum, ripples in time" />,
    artRatio: '7/4',
    stickerRatio: '1',
  },
];

const GATE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

export default function ProcessStage() {
  const stageRef = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    // Mount the 3D card only once the stage is within a viewport of view.
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
      const states = [...stage.querySelectorAll('.bw-state')];
      // The site header is fixed on this route: pin under it, not behind it.
      const header = document.querySelector('.site-header');
      const top = header ? header.offsetHeight : 0;
      stage.style.setProperty('--bw-top', `${top}px`);
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: stage,
          start: `top top+=${top}`,
          end: `+=${STATES.length * 120}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });
      // Hold the last state as long as the others: the timeline runs to
      // STATES.length seconds, one per state.
      tl.to({}, { duration: 0.01 }, STATES.length);
      states.forEach((el, i) => {
        const s = STATES[i];
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
        if (i < STATES.length - 1) {
          tl.to([art, card, title], { autoAlpha: 0, duration: 0.2 }, at + 0.8);
          tl.to(sticker, { autoAlpha: 0, x: -stX, y: -stY, duration: 0.2 }, at + 0.8);
          tl.set(el, { pointerEvents: 'none' }, at + 1);
        }
      });
      return () => tl.scrollTrigger && tl.scrollTrigger.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={stageRef} className="bw-stage" aria-label="How a brand identity is made here">
      <h2 className="bw-stage__h">How it gets made</h2>
      {STATES.map((s, i) => (
        <article key={s.key} className={`bw-state bw-state--${s.side} bw-state--${s.corner}`} data-state={s.key}>
          <p className="bw-state__title">
            <span className="bw-state__n">0{i + 1}</span> {s.title}
          </p>
          <div className="bw-state__art" style={{ aspectRatio: s.artRatio }}>
            {s.key === 'system' ? near && <s.Art /> : <s.Art />}
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
