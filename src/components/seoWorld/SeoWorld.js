import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import SearchHero from './SearchHero';
import Deliverables from './Deliverables';
import { Crawl, MissingPage, Local, LocalFactors, Rich, RichRules, Quoted, QuotablePassage, CostPerLead, LeadMath } from './lessons';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/seoWorld.scss';

/* The SEO & AI Search world (2026-10-24), the AI world's sibling, built
   from the same kit (components/worlds) and the outline worlds' sheet
   (_worldOutline.scss): hero, pinned stage, deliverables, client bubbles,
   circles, pill; black with orange in the hero, the full studio palette
   outside it. Since 2026-10-27 it teaches the way the brand, Web and AI
   worlds do (owner: "last but not least, lets do the SEO & AI search
   service page"): the hero runs the five ways to be found on four
   screens, and the stage is five lessons with a demo each, one per way,
   in the hero's order (01 Crawl, 02 Local, 03 Rich results, 04 Quoted, 05
   Cost per lead). The rules are Google's published ones; every figure is
   arithmetic or computed on the visitor's own input. */
const STATES = [
  {
    key: 'crawl',
    field: '#79ccb6',
    ink: '#141414',
    title: 'Crawl',
    copy: 'Google finds a page by following a link to it, then keeps it unless the page says not to. A page no link reaches is never found, however good it is.',
    side: 'right',
    corner: 'bl',
    Art: () => <Crawl />,
    Sticker: () => <MissingPage />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'local',
    field: '#fef7ed',
    ink: '#141414',
    title: 'Local',
    copy: 'Google ranks the map by relevance, distance and prominence. Relevance is yours to set, in the categories on your Business Profile; distance is where the searcher stands.',
    side: 'left',
    corner: 'tr',
    Art: () => <Local />,
    Sticker: () => <LocalFactors />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'rich',
    field: '#1748ef',
    ink: '#fef7ed',
    title: 'Rich results',
    copy: "Structured data tells Google what a page is: a product, its price, its rating. Meet Google's required properties and the page is eligible for a richer result; Google still decides whether it shows.",
    side: 'right',
    corner: 'bl',
    Art: () => <Rich />,
    Sticker: () => <RichRules />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'quoted',
    field: '#ff834a',
    ink: '#141414',
    title: 'Quoted',
    copy: 'An AI answer quotes a passage, not a page. The passage that answers one question on its own, with the facts in it, is the one it quotes, with your name on it.',
    side: 'left',
    corner: 'tr',
    Art: () => <Quoted />,
    Sticker: () => <QuotablePassage />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
  {
    key: 'cost',
    field: '#eaa8c6',
    ink: '#141414',
    title: 'Cost per lead',
    copy: "An ad's cost per lead is the price of a click divided by the page's conversion rate. Twice the budget buys twice the leads at the same price; a page that converts twice as well halves the price of every lead.",
    side: 'right',
    corner: 'bl',
    Art: () => <CostPerLead />,
    Sticker: () => <LeadMath />,
    artRatio: '16/10',
    stickerRatio: '4/3',
    tool: true,
  },
];

export default function SeoWorld() {
  return (
    <div className="bw bw--outline bw--seo">
      <SearchHero />
      <ProcessStage states={STATES} label="What each way to be found takes" heading="What we know" />
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
