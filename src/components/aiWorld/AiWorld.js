import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import AutomationHero from './AutomationHero';
import Deliverables from './Deliverables';
import { Payback, PaybackTable, Grounding, AnswerSteps, Handoff, KeptHuman, Retries, Backoff, Masking, WhatLeaves } from './lessons';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/aiWorld.scss';

/* The AI & Automation world (2026-10-22), an outline world: the shared
   kit, the same order (hero, pinned stage, deliverables, client bubbles,
   circles, pill), thin cream lines, orange the one accent in the hero and
   the full studio palette everywhere else (owner, 2026-10-24). Since
   2026-10-27 it teaches the way the brand and Web worlds do (owner: "match
   the content of 'services/ai-automation' in the same way we did for
   'services/graphic-design-brand-identity' and
   'services/web-development-mobile-apps'"): the hero runs the five kinds
   of automation on four screens, and the stage is five lessons with a demo
   each, on the things every automation has to get right (01 Payback, 02
   Grounding, 03 Handoff, 04 Retries, 05 Privacy). Every figure the copy
   states is arithmetic or measured on the visitor's own input. */
const STATES = [
  {
    key: 'payback',
    field: '#ff834a',
    ink: '#141414',
    title: 'Payback',
    copy: "Automate the task that repeats, not the one that's interesting. Minutes a time, times a week, weeks in a year: that is what it gives back, and how long it can take to build.",
    side: 'right',
    corner: 'bl',
    Art: () => <Payback />,
    Sticker: () => <PaybackTable />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'grounding',
    field: '#79ccb6',
    ink: '#141414',
    title: 'Grounding',
    copy: 'An assistant should answer from your notes, not from memory. It finds the passage first, writes the answer from it and names the source.',
    side: 'left',
    corner: 'tr',
    Art: () => <Grounding />,
    Sticker: () => <AnswerSteps />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'handoff',
    field: '#fef7ed',
    ink: '#141414',
    title: 'Handoff',
    copy: 'It has to know when to stop. Every answer carries a match score, and under the line a person takes the question. Too low and wrong answers go out; too high and you answer everything.',
    side: 'right',
    corner: 'bl',
    Art: () => <Handoff />,
    Sticker: () => <KeptHuman />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'retries',
    field: '#1748ef',
    ink: '#fef7ed',
    title: 'Retries',
    copy: "Every automation meets a service that's down. A good one tries again, waits longer each time, never saves the same job twice and tells a person when it gives up.",
    side: 'left',
    corner: 'tr',
    Art: () => <Retries />,
    Sticker: () => <Backoff />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'privacy',
    field: '#eaa8c6',
    ink: '#141414',
    title: 'Privacy',
    copy: 'Send a model only what the job needs. Names, emails, phone and card numbers are masked on your server before the text goes out, and filled back in when the answer returns.',
    side: 'right',
    corner: 'bl',
    Art: () => <Masking />,
    Sticker: () => <WhatLeaves />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
];

export default function AiWorld() {
  return (
    <div className="bw bw--outline bw--ai">
      <AutomationHero />
      <ProcessStage states={STATES} label="What every automation has to get right" heading="What we know" />
      <Deliverables />
      <Bubbles title="Once it runs, clients say" offset={3} />
      <WorldClose
        title="Your first automation is next."
        note="Every automation starts with a free call. This page is what they do; the packages are on the pricing page."
        pricing={{ label: 'See packages and prices.', to: '/pricing/ai-automation' }}
        primary={{ label: 'Start an automation', to: '/contact' }}
        secondary={{ label: 'See Scout, a studio product', to: '/projects/scout' }}
        pill={{ label: 'Book a free call', to: '/contact' }}
      />
    </div>
  );
}
