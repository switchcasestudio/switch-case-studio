import ProcessStage from '../worlds/ProcessStage';
import Bubbles from '../worlds/Bubbles';
import WorldClose from '../worlds/WorldClose';
import LiveArt from '../worlds/LiveArt';
import BuildHero from './BuildHero';
import Deliverables from './Deliverables';
import * as ART from './tiles/art';
import * as LIVE from './tiles/live';
import '../../styles/components/brandWorld.scss';
import '../../styles/components/webWorld.scss';

/* The Web Development & Mobile Apps world (2026-10-24), the third outline
   world after AI & Automation: same shared kit, same order (hero, pinned
   process, deliverables, client bubbles, circles, pill), same language
   (thin cream lines, one orange accent in the hero, the studio palette
   everywhere else, every drawing a machine that runs). Its hero is the
   build (BuildHero): a commit to a live site, previewed on a desktop and
   a phone at once. */
const live = (name) => () => <LiveArt Art={ART[name]} create={LIVE[name]} className="aw-live" />;

const STATES = [
  {
    key: 'scope',
    field: '#1748ef',
    ink: '#fef7ed',
    title: 'Scope',
    copy: 'A call, a sitemap and a wireframe before a pixel is drawn. You see the bones of every page and the price before anything is built.',
    side: 'right',
    corner: 'bl',
    Art: live('Wireframe'),
    Sticker: live('Sitemap'),
    artRatio: '3/2',
    stickerRatio: '1',
  },
  {
    key: 'design',
    field: '#fef7ed',
    ink: '#141414',
    title: 'Design',
    copy: "Layouts on a grid, drawn for the phone first and the desktop second, in your brand's type and color.",
    side: 'left',
    corner: 'tr',
    Art: live('LayoutGrid'),
    Sticker: live('TypeSpecimen'),
    artRatio: '3/2',
    stickerRatio: '1',
  },
  {
    key: 'build',
    field: '#ff834a',
    ink: '#141414',
    title: 'Build',
    copy: 'React and Next.js, WordPress and WooCommerce, or React Native for iOS and Android. Code your next developer can read.',
    side: 'right',
    corner: 'bl',
    Art: live('Editor'),
    Sticker: live('Braces'),
    artRatio: '3/2',
    stickerRatio: '1',
  },
  {
    key: 'launch',
    field: '#79ccb6',
    ink: '#141414',
    title: 'Launch',
    copy: 'Domain, SSL, DNS and email authentication set up, old links redirected, then it goes live.',
    side: 'left',
    corner: 'tr',
    Art: live('AddressBar'),
    Sticker: live('DnsRow'),
    artRatio: '7/4',
    stickerRatio: '2/1',
  },
  {
    key: 'care',
    field: '#eaa8c6',
    ink: '#141414',
    title: 'Care',
    copy: 'Managed hosting or your own VPS, updates, backups and uptime checks. The team that built it keeps it running.',
    side: 'right',
    corner: 'bl',
    Art: live('Uptime'),
    Sticker: live('Rack'),
    artRatio: '3/2',
    stickerRatio: '1',
  },
];

export default function WebWorld() {
  return (
    <div className="bw bw--outline bw--web">
      <BuildHero />
      <ProcessStage states={STATES} label="How a site or app is built here" heading="How it gets built" />
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
