import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import LiveArt from '../worlds/LiveArt';
import SearchHero from './SearchHero';
import Deliverables from './Deliverables';
import * as ART from './tiles/art';
import * as LIVE from './tiles/live';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/seoWorld.scss';

/* The SEO & AI Search world (2026-10-24): the AI world's sibling, built
   from the same kit (components/worlds) and the outline worlds' sheet
   (_worldOutline.scss): thin outlines, captions that open in bold, every
   drawing a machine that runs on the poster engine. The hero is the
   search desk (SearchHero), black with orange as its only accent; outside
   it the full studio palette. The stage runs mint, cream, blue, orange,
   pink. Then deliverables, client bubbles, circles, pill. */
const live = (name, cls = 'aw-live') => () => <LiveArt Art={ART[name]} create={LIVE[name]} className={cls} />;

const STATES = [
  {
    key: 'audit',
    field: '#79ccb6',
    ink: '#141414',
    title: 'The audit',
    copy: 'Every page crawled the way Google reads it: titles, links, schema, speed, whatever keeps a page out of the index. Then every fix shipped, not a PDF.',
    side: 'right',
    corner: 'bl',
    Art: live('Crawl'),
    Sticker: live('Checklist'),
    artRatio: '3/2',
    stickerRatio: '1',
  },
  {
    key: 'ai-search',
    field: '#fef7ed',
    ink: '#141414',
    title: 'Ready for AI answers',
    copy: 'llms.txt, structured data and pages written to be quoted. For the customers who ask ChatGPT before they ask Google.',
    side: 'left',
    corner: 'tr',
    Art: live('AnswerCard'),
    Sticker: live('Braces'),
    artRatio: '4/3',
    stickerRatio: '1',
  },
  {
    key: 'speed',
    field: '#1748ef',
    ink: '#fef7ed',
    title: 'Speed',
    copy: 'Core Web Vitals to 89+ at handoff, measured in Lighthouse before and after, on the same day.',
    side: 'right',
    corner: 'bl',
    Art: live('Gauge'),
    Sticker: live('Stopwatch'),
    artRatio: '3/2',
    stickerRatio: '1',
  },
  {
    key: 'ads',
    field: '#ff834a',
    ink: '#141414',
    title: 'Ads that land',
    copy: 'Google and Meta campaigns, run by the people who built the page they land on. Every click followed to a call or a form.',
    side: 'left',
    corner: 'tr',
    Art: live('AdCard'),
    Sticker: live('Target'),
    artRatio: '16/9',
    stickerRatio: '1',
  },
  {
    key: 'convert',
    field: '#eaa8c6',
    ink: '#141414',
    title: 'Then it converts',
    copy: 'Conversion work on the pages that get the traffic: one clear action per page, forms that ask less, a test before every change.',
    side: 'right',
    corner: 'bl',
    Art: live('ABTest'),
    Sticker: live('Press'),
    artRatio: '7/4',
    stickerRatio: '1',
  },
];

export default function SeoWorld() {
  return (
    <div className="bw bw--outline bw--seo">
      <SearchHero />
      <ProcessStage states={STATES} label="How SEO and AI-search work is done here" heading="How it gets done" />
      <Deliverables />
      <Bubbles title="Once they find you, clients say" offset={0} />
      <WorldClose
        title="Your first fix is next."
        note="Every SEO engagement starts with a free call. This page is what the work does; the packages are on the pricing page."
        pricing={{ label: 'See packages and prices.', to: '/pricing/seo-ai-search' }}
        primary={{ label: 'Start with an audit', to: '/contact' }}
        secondary={{ label: "See Zahav's calls", to: '/projects/zahav-medspa' }}
        pill={{ label: 'Book a free call', to: '/contact' }}
      />
    </div>
  );
}
