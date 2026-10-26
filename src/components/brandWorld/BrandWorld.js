import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import BrandHero from './BrandHero';
import TypeTester from './TypeTester';
import Deliverables from './Deliverables';
import PixelTile from './PixelTile';
import { LogoSize, ColorMix, TypeScale, Composition, PaletteCard, SpacingScale, ReadingOrder } from './lessons';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/brandHero.scss';

/* The Graphic Design & Brand Identity world (2026-10-22). Principles from
   the reference analysis (.audit/brand-identity-reference.md): everything
   is a flat plate, density breathes, hover flips color, media lives in
   tiles. Palette stays SCS: ink, cream, lavender, blue, orange, plus the
   poster flats (terra, mint, pink). Since 2026-10-25 it runs in the other
   worlds' order (owner: "the graphic design page structure similar to the
   other services"), and it teaches instead of showing made-up clients
   (owner, same day: "We are authority in what we're doing ... let's talk
   about logo in general, fonts in general, type in general"): the hero
   runs the five kinds of logo on six touchpoints, and the pinned stage is
   five lessons, each with a demo to touch (01 Logo, 02 Type, 03 Color,
   04 Rhythm, 05 Composition). Then deliverables, client bubbles, circles,
   pill. The stage, the bubbles and the close are the shared world parts
   (components/worlds); this file is the brand content. */
const STATES = [
  {
    key: 'logo',
    field: '#fef7ed',
    ink: '#141414',
    title: 'Logo',
    copy: 'A logo is the smallest part of an identity and the most used. It has to hold at 16 pixels and at 13 feet, so it ships in cuts, each drawn for its size, with the clear space written down.',
    side: 'right',
    corner: 'bl',
    Art: () => <LogoSize />,
    Sticker: () => <PixelTile />,
    artRatio: '16/10',
    stickerRatio: '1',
    tool: true,
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
    copy: 'Color is a proportion, not a list. One color carries most of the surface, one supports it, one is the accent, and every text pairing passes WCAG contrast before it ships.',
    side: 'left',
    corner: 'tr',
    Art: () => <ColorMix />,
    Sticker: () => <PaletteCard />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'rhythm',
    field: '#ff834a',
    ink: '#141414',
    title: 'Rhythm',
    copy: 'Rhythm is one interval, repeated. Type sizes step by one ratio and spacing by one unit, so a page reads as one voice instead of twenty guesses.',
    side: 'right',
    corner: 'bl',
    Art: () => <TypeScale />,
    Sticker: () => <SpacingScale />,
    artRatio: '4/3',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'composition',
    field: '#141414',
    ink: '#fef7ed',
    title: 'Composition',
    copy: 'Composition decides where the eye lands first, second and third. A grid holds the edges, the thirds place the focus, and empty space is what lets anything stand out.',
    side: 'left',
    corner: 'tr',
    Art: () => <Composition />,
    Sticker: () => <ReadingOrder />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
];

export default function BrandWorld() {
  return (
    <div className="bw">
      <BrandHero />
      <ProcessStage states={STATES} label="What a brand identity is made of" heading="What we know" />
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
