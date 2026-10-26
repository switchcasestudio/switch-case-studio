import { Suspense, lazy } from 'react';
import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import VideoTile from '../worlds/VideoTile';
import BrandHero from './BrandHero';
import TypeTester from './TypeTester';
import Deliverables from './Deliverables';
import PixelTile from './PixelTile';
import { LowtideColour, SealStar, StudioNote } from './tiles/concepts';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/brandHero.scss';

// three + fiber stay out of the page bundle until the stage is near.
const Card3D = lazy(() => import('./Card3D'));

/* The Graphic Design & Brand Identity world (2026-10-22). Principles from
   the reference analysis (.audit/brand-identity-reference.md): everything
   is a flat plate, density breathes, hover flips color, media lives in
   tiles. Palette stays SCS: ink, cream, lavender, blue, orange, plus the
   poster flats (terra, mint, pink). Since 2026-10-25 (owner: "the
   graphic design page structure similar to the other services") it runs
   in the other worlds' order: the hero (BrandHero, one mark on six
   touchpoints, in place of the scroll collage), the pinned process (the
   type stage is 03 Type, a type tester), deliverables, client bubbles,
   circles, pill. The process stage, the bubbles and the close are the
   shared world parts (components/worlds); this file is the brand content. */
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
    side: 'right',
    corner: 'bl',
    Art: () => <TypeTester />,
    full: true,
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

export default function BrandWorld() {
  return (
    <div className="bw">
      <BrandHero />
      <ProcessStage states={STATES} label="How a brand identity is made here" heading="How it gets made" />
      <Deliverables />
      <Bubbles title="Once it ships, clients say" />
      <WorldClose
        title="Your mark is next."
        note="Every identity starts with a free call. This page is the work; the packages are on the pricing page."
        pricing={{ label: 'See packages and prices.', to: '/pricing/graphic-design-brand-identity' }}
        primary={{ label: 'Start a brand', to: '/contact' }}
        secondary={{ label: 'See client work', to: '/projects' }}
        pill={{ label: 'Book a free call', to: '/contact' }}
      />
    </div>
  );
}
