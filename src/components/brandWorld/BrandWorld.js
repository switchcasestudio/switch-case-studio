import { Suspense, lazy } from 'react';
import Collage from '../worlds/Collage';
import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import VideoTile from '../worlds/VideoTile';
import TypeStage from './TypeStage';
import Deliverables from './Deliverables';
import PixelTile from './PixelTile';
import { TILES, SCROLL_LENGTH } from './tiles/layout';
import * as ART from './tiles/concepts';
import * as LIVE from './tiles/live';
import { LowtideColour, SealStar, MeridianType, StudioNote } from './tiles/concepts';
import '../../styles/components/brandWorld.scss';

// three + fiber stay out of the page bundle until the stage is near.
const Card3D = lazy(() => import('./Card3D'));

/* The Graphic Design & Brand Identity world (2026-10-22). Principles from
   the reference analysis (.audit/brand-identity-reference.md): everything
   is a flat plate, scroll is the clock, density breathes, hover flips
   color, media lives in tiles. Palette stays SCS: ink, cream, lavender,
   blue, orange, plus the poster flats (terra, mint, pink). Order: collage,
   breath, type stage, process stage, deliverables, client bubbles, circles,
   pill. The collage, the process stage, the bubbles and the close are the
   shared world parts (components/worlds); this file is the brand content. */
const COPY = {
  kicker: 'Graphic design & brand identity',
  title: 'A mark that holds up when it moves.',
  lede: 'Logo, color, type and the rules that keep them together. Drawn by a designer, built for web, print and packaging.',
  cta: { label: 'Start a brand', to: '/contact' },
};

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
    Art: () => <VideoTile src="/brand-world/hatch-loop.mp4" poster="/brand-world/hatch-loop.jpg" label="Hatch mark, drawn then recolored" />,
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
    narrow: true,
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
    lazy: true,
  },
];

const KINDS = { pixel: PixelTile };

export default function BrandWorld() {
  return (
    <div className="bw">
      <Collage tiles={TILES} scrollLength={SCROLL_LENGTH} art={ART} live={LIVE} kinds={KINDS} label="Brand identity" copy={COPY} />

      <section className="bw-breath" aria-label="About the concepts">
        <p>
          Five made-up Portland businesses live on this page. Scroll and their pieces come apart; every one is a vector
          you can push around. An identity has to survive being moved.
        </p>
      </section>

      <TypeStage />
      <ProcessStage states={STATES} label="How a brand identity is made here" heading="How it gets made" />
      <Deliverables />
      <Bubbles title="Once it ships, clients say" />
      <WorldClose
        title="Your mark is next."
        note="Every identity starts with a free call. This page is the work; the packages are on the pricing page."
        pricing={{ label: 'See packages and prices.', to: '/pricing/brand-identity' }}
        primary={{ label: 'Start a brand', to: '/contact' }}
        secondary={{ label: 'See client work', to: '/projects' }}
        pill={{ label: 'Book a free call', to: '/contact' }}
      />
    </div>
  );
}
