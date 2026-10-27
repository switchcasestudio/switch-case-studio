import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import KindsHero from './KindsHero';
import Deliverables from './Deliverables';
import { PageLoad, Reflow, ShiftTest, InputDelay, A11yCard, VitalsCard, Breakpoints, ShiftFormula, FrameBudget, WcagCard } from './lessons';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/webWorld.scss';

/* The Web Development & Mobile Apps world (2026-10-24), an outline world:
   the shared kit, the same order (hero, pinned stage, deliverables, client
   bubbles, circles, pill), the same language (thin cream lines, one orange
   accent in the hero, the studio palette everywhere else). Since
   2026-10-26 it teaches the way the brand world does (owner: "you did an
   amazing job with modifying the 'graphic design' service page. now lets
   give full focus on 'web development'"): the hero runs the five kinds of
   build on four screens, and the stage is five lessons with a demo each,
   on the things every build has to get right (01 Speed, 02 Layout, 03
   Stability, 04 Response, 05 Access). Every figure the copy states is a
   published threshold (Core Web Vitals, WCAG 2.2) or arithmetic. */
const STATES = [
  {
    key: 'speed',
    field: '#1748ef',
    ink: '#fef7ed',
    title: 'Speed',
    copy: 'Speed is weight over distance. Most slow pages are one photo saved too big, or a script the page waits for. Google counts a page as good when its main content shows within 2.5 seconds.',
    side: 'right',
    corner: 'bl',
    Art: () => <PageLoad />,
    Sticker: () => <VitalsCard />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'layout',
    field: '#fef7ed',
    ink: '#141414',
    title: 'Layout',
    copy: "Responsive is one layout that rearranges, not three sites. The columns, the menu and the type follow the screen's width, so the same page reads on a phone, a tablet and a desk.",
    side: 'left',
    corner: 'tr',
    Art: () => <Reflow />,
    Sticker: () => <Breakpoints />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'stability',
    field: '#ff834a',
    ink: '#141414',
    title: 'Stability',
    copy: "Nothing should move once someone starts reading. Every image, ad and banner gets its space before it loads, so a tap lands where it was aimed. Google's line for good is a shift score of 0.1.",
    side: 'right',
    corner: 'bl',
    Art: () => <ShiftTest />,
    Sticker: () => <ShiftFormula />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'response',
    field: '#79ccb6',
    ink: '#141414',
    title: 'Response',
    copy: "A tap should answer at once, even when the work behind it takes longer. Long jobs are cut into pieces so the page keeps painting. Google's line for good is 200 milliseconds.",
    side: 'left',
    corner: 'tr',
    Art: () => <InputDelay />,
    Sticker: () => <FrameBudget />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'access',
    field: '#eaa8c6',
    ink: '#141414',
    title: 'Access',
    copy: 'Accessible means it works with a keyboard, a screen reader and a zoomed screen. Every control has a name, text has the contrast to be read, and every target is big enough for a thumb.',
    side: 'right',
    corner: 'bl',
    Art: () => <A11yCard />,
    Sticker: () => <WcagCard />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
];

export default function WebWorld() {
  return (
    <div className="bw bw--outline bw--web">
      <KindsHero />
      <ProcessStage states={STATES} label="What every web build has to get right" heading="What we know" />
      <Deliverables />
      <Bubbles title="Once it's live, clients say" offset={2} />
      <WorldClose
        title="Your build is next."
        note="Every build starts with a free call. This page is what we build; the packages are on the pricing page."
        pricing={{ label: 'See packages and prices.', to: '/pricing/web-development-mobile-apps' }}
        primary={{ label: 'Start a project', to: '/contact' }}
        secondary={{ label: 'See client work', to: '/projects' }}
        pill={{ label: 'Book a free call', to: '/contact' }}
      />
    </div>
  );
}
