import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import VideoTile from './VideoTile';
import { HumPoster, LowtideMark, StickerSheet } from './tiles/concepts';

gsap.registerPlugin(Draggable);

/* The deliverables grid (2026-10-22): cards whose demos are the thing.
   Drag a sticker, hover for a hand, watch a loop. Draggable from GSAP
   (free since 3.13), bounds the card, inertia off. */
function DragCard() {
  const boxRef = useRef(null);
  const stickerRef = useRef(null);
  useEffect(() => {
    if (!boxRef.current || !stickerRef.current) return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const [d] = Draggable.create(stickerRef.current, {
      type: 'x,y',
      bounds: boxRef.current,
      edgeResistance: 0.8,
      onPress() {
        gsap.to(this.target, { scale: 1.06, rotation: -4, duration: 0.2 });
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, rotation: 0, duration: 0.3, ease: 'back.out(1.5)' });
      },
    });
    return () => d.kill();
  }, []);
  return (
    <div ref={boxRef} className="bw-grid__demo bw-grid__demo--drag">
      <div ref={stickerRef} className="bw-grid__sticker" data-cursor-color="#dab8ff">
        <LowtideMark />
      </div>
    </div>
  );
}

export default function Deliverables() {
  return (
    <section className="bw-grid" aria-labelledby="bw-grid-title">
      <h2 id="bw-grid-title" className="bw-grid__title">
        <span className="bw-plate bw-plate--lavender">Everything you get</span> is on this page.
      </h2>
      <ul className="bw-grid__cards">
        <li className="bw-grid__card">
          <DragCard />
          <p className="bw-grid__cap">
            <strong>Sticker sheets.</strong> Drag it. It comes back the same, which is the whole point of a mark.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__demo bw-grid__demo--hover" data-cursor-color="#ff834a">
            <span className="bw-grid__big">Hover me</span>
          </div>
          <p className="bw-grid__cap">
            <strong>Custom cursor and hover rules.</strong> The small things a site does when nobody is watching.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__demo" style={{ aspectRatio: '16/9' }}>
            <VideoTile src="/brand-world/guide-loop.mp4" poster="/brand-world/guide-loop.jpg" label="Brand guide pages turning" />
          </div>
          <p className="bw-grid__cap">
            <strong>Guidelines.</strong> A short PDF that says what to do, with the reasons, so it gets read.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__demo" style={{ aspectRatio: '1' }}>
            <StickerSheet />
          </div>
          <p className="bw-grid__cap">
            <strong>Logo files.</strong> SVG, PNG, PDF, in every colourway, with the clear space drawn in.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__demo bw-grid__demo--tall" style={{ aspectRatio: '400/560' }}>
            <HumPoster />
          </div>
          <p className="bw-grid__cap">
            <strong>Print.</strong> Posters, cards, labels, with the die lines ready for the printer.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__demo" style={{ aspectRatio: '1' }}>
            <VideoTile src="/brand-world/hum-loop.mp4" poster="/brand-world/hum-loop.jpg" label="Hum loop" />
          </div>
          <p className="bw-grid__cap">
            <strong>Motion.</strong> A short loop for the site, the socials and the door screen.
          </p>
        </li>
      </ul>
    </section>
  );
}
