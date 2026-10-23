import { Suspense, lazy } from 'react';
import Collage from '../worlds/Collage';
import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import VideoTile from '../worlds/VideoTile';
import LiveArt from '../worlds/LiveArt';
import FlowStage from './FlowStage';
import Deliverables from './Deliverables';
import { TILES, SCROLL_LENGTH } from './tiles/layout';
import * as ART from './tiles/art';
import * as LIVE from './tiles/live';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/aiWorld.scss';

// three + fiber stay out of the page bundle until the stage is near.
const AgentCard3D = lazy(() => import('./AgentCard3D'));

/* The AI & Automation world (2026-10-22): the brand world's sibling, same
   parts in the same order (collage, breath, the stage that shows the
   craft, the pinned process, deliverables, client bubbles, circles, pill),
   drawn in the owner's reference language instead of flat color plates:
   thick outlines on black, one accent (lavender), captions that open in
   bold, and every drawing a machine that runs. The type stage of the brand
   world becomes the workbench here. */
const COPY = {
  kicker: 'AI & automation',
  title: 'It works the night shift.',
  lede: 'Assistants trained on your docs, agents that do the follow-ups, workflows wired into the tools you already pay for. Built, hosted and watched like production software.',
  cta: { label: 'Start an automation', to: '/contact' },
};

const live = (name, cls = 'aw-live') => () => <LiveArt Art={ART[name]} create={LIVE[name]} className={cls} />;

const STATES = [
  {
    key: 'roadmap',
    field: '#000000',
    ink: '#fef7ed',
    title: 'Roadmap',
    copy: 'A week inside your tools, finding the hours that leak between them. The sprint ends with one automation running, not a slide deck.',
    side: 'right',
    corner: 'bl',
    Art: live('NodeGraph'),
    Sticker: live('Clock'),
    artRatio: '3/2',
    stickerRatio: '1',
  },
  {
    key: 'assistant',
    field: '#dab8ff',
    ink: '#141414',
    title: 'The assistant',
    copy: "A chatbot that answers from your docs, your site and your FAQs. When it doesn't know, it says so and hands the question to a person.",
    side: 'left',
    corner: 'tr',
    Art: live('ChatCard'),
    Sticker: live('AgentA'),
    artRatio: '4/3',
    stickerRatio: '1',
  },
  {
    key: 'agent',
    field: '#fef7ed',
    ink: '#141414',
    title: 'The agent',
    copy: 'It reads the lead, drafts the reply, books the slot and writes down what it did. You read the log, not a promise.',
    side: 'right',
    corner: 'bl',
    Art: () => <VideoTile src="/ai-world/flow-loop.mp4" poster="/ai-world/flow-loop.jpg" label="A packet through the workflow" />,
    Sticker: live('RunPill'),
    artRatio: '1',
    stickerRatio: '5/2',
    narrow: true,
  },
  {
    key: 'wiring',
    field: '#f0d7ff',
    ink: '#141414',
    title: 'The wiring',
    copy: 'n8n, Zapier, Make or GoHighLevel, wired into the tools you already pay for. Nothing new to log into.',
    side: 'left',
    corner: 'tr',
    Art: () => <VideoTile src="/ai-world/night-loop.mp4" poster="/ai-world/night-loop.jpg" label="Three in the morning, a reply in forty seconds" />,
    Sticker: live('QueueBox'),
    artRatio: '16/9',
    stickerRatio: '2/1',
  },
  {
    key: 'hosted',
    field: '#141414',
    ink: '#fef7ed',
    title: 'Hosted and watched',
    copy: 'On your own VPS when the data should stay yours. Monitored like production software, because that is what it is.',
    side: 'right',
    corner: 'bl',
    Art: () => (
      <Suspense fallback={null}>
        <AgentCard3D />
      </Suspense>
    ),
    Sticker: live('Stack'),
    artRatio: '7/4',
    stickerRatio: '1',
    lazy: true,
  },
];

export default function AiWorld() {
  return (
    <div className="bw bw--ai">
      <Collage tiles={TILES} scrollLength={SCROLL_LENGTH} art={ART} live={LIVE} label="AI and automation" copy={COPY} />

      <section className="bw-breath" aria-label="About this page">
        <p>
          Everything on this page runs. Press the buttons, drag the nodes, read the logs. An automation you cannot
          inspect is a liability, so ours are built to be looked at.
        </p>
      </section>

      <FlowStage />
      <ProcessStage states={STATES} label="How an automation is built here" heading="How it gets built" />
      <Deliverables />
      <Bubbles title="Once it runs, clients say" offset={3} />
      <WorldClose
        title="Your first automation is next."
        note="Every automation starts with a free call. This page is what they do; the packages are on the pricing page."
        pricing={{ label: 'See packages and prices.', to: '/pricing/ai-development' }}
        primary={{ label: 'Start an automation', to: '/contact' }}
        secondary={{ label: 'See Scout, a studio product', to: '/projects/scout' }}
        pill={{ label: 'Book a free call', to: '/contact' }}
      />
    </div>
  );
}
