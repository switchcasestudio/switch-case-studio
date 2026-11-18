import { useRef } from 'react';
import ProcessStage from '../worlds/ProcessStage';
import StageLead, { LEAD_HOW } from '../worlds/StageLead';
import ClientRow, { workFor } from '../worlds/ClientRow';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import { BOOK_CALL_KIND } from '../../data/cta';
import useTryHint from '../worlds/tryHint';
import ContentHero from './ContentHero';
import Deliverables from './Deliverables';
import { PlainWords, PlainRules, FirstLine, LineOrder, Proof, ProofNeeds, Rhythm, OneBecomes, Measure, TagAnswers } from './lessons';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/contentWorld.scss';

/* The Content & Social Media world (2026-11-18), the fifth service and the
   fourth outline world (owner: "build the new service in the exact
   formation, animation, rhythm, style the other services are in"): the
   shared kit (components/worlds) and the outline worlds' sheet
   (_worldOutline.scss), in the same order: hero, lead, pinned stage,
   deliverables, client row, client bubbles, circles, pill. Black with
   orange in the hero, the full studio palette outside it. It teaches the
   way the other four do: the hero runs the five kinds of content, and the
   stage is five lessons with a demo each, in the order a piece is made
   (01 Plain words, 02 First line, 03 Proof, 04 Rhythm, 05 Measure).
   Every figure is arithmetic on the visitor's own input. The clients in
   the row and the bubbles are the ones the owner named for this work
   (`servicePages` in projects.json). */
const SLUG = 'content-social-media';

const STATES = [
  {
    key: 'plain',
    field: '#dab8ff',
    ink: '#141414',
    title: 'Plain words',
    copy: 'Short sentences and short words are easier to read, for every reader. The grade here is counted from your own paragraph: letters per word and words per sentence, nothing else.',
    side: 'right',
    corner: 'bl',
    Art: () => <PlainWords />,
    Sticker: () => <PlainRules />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'line',
    field: '#fef7ed',
    ink: '#141414',
    title: 'First line',
    copy: 'A feed, an inbox and a search result all cut a line short. Whatever comes after the cut is read only by people who tap, so the point goes first and the history goes last.',
    side: 'left',
    corner: 'tr',
    Art: () => <FirstLine />,
    Sticker: () => <LineOrder />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'proof',
    field: '#ff834a',
    ink: '#141414',
    title: 'Proof',
    copy: 'Any business can call itself the best. A number, a name or a date is something a reader can check, and something a competitor cannot copy. We print a figure only with its source.',
    side: 'right',
    corner: 'bl',
    Art: () => <Proof />,
    Sticker: () => <ProofNeeds />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'rhythm',
    field: '#79ccb6',
    ink: '#141414',
    title: 'Rhythm',
    copy: 'A calendar is arithmetic. Three posts a week is 156 a year, and each one has to be planned, written, designed and posted. Set the pace you can keep; the count follows.',
    side: 'left',
    corner: 'tr',
    Art: () => <Rhythm />,
    Sticker: () => <OneBecomes />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'measure',
    field: '#1748ef',
    ink: '#fef7ed',
    title: 'Measure',
    copy: 'One page can be reached from a post, an email and a profile. A tag on each link tells the report which piece sent the visit, so next month has more of what worked.',
    side: 'right',
    corner: 'bl',
    Art: () => <Measure />,
    Sticker: () => <TagAnswers />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
];

export default function ContentWorld() {
  const rootRef = useRef(null);
  useTryHint(rootRef);
  return (
    <div ref={rootRef} className="bw bw--outline bw--content">
      <ContentHero />
      <StageLead
        breath="Every piece does the same five jobs: say it plainly, lead with the point, prove it, keep a rhythm and measure what came back."
        how={LEAD_HOW}
        line="What every piece has to get right."
        field="#eaa8c6"
        ink="#141414"
      />
      <ProcessStage states={STATES} label="What every piece has to get right" heading="What we know" />
      <Deliverables />
      <ClientRow id="cw-row-title" title="Words and posts for real businesses" items={workFor(SLUG)} />
      <Bubbles title="Once the words are right, clients say" service={SLUG} offset={0} />
      <WorldClose
        title="Your first piece is next."
        note={`Every content engagement starts with a ${BOOK_CALL_KIND}. This page is what the work does; the packages are on the pricing page.`}
        pricing={{ label: 'See packages and prices', to: `/pricing/${SLUG}` }}
        primary={{ label: 'Start with a plan', to: '/contact' }}
        secondary={{ label: "See Zahav's story", to: '/projects/zahav-medspa' }}
      />
    </div>
  );
}
