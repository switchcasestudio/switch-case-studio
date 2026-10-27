import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { q } from '../servicePoster/usePosterEngine';

/* The Web world's hero (2026-10-26, owner: "give full focus on 'web
   development' ... content, vector, animations, reactions, ui/ux"), the
   brand hero's sibling: that one runs the five kinds of logo, this one the
   five kinds of build, the five things the service sells (landing page,
   website, store, web app, mobile app). The frame, copy, captions, log and
   Pause are the shared `world-hero`; the drawing keeps the outline
   language (cream lines on black, orange the one accent).

   One business, "Your business", on four screens at once: what lands in
   the owner's inbox, the search result, the phone and the laptop. Each
   kind is drawn the way it really behaves on each screen (a landing page
   has no menu, a website's menu folds on the phone, a store's price shows
   in search, a web app's table turns into cards, a mobile app is two
   store buttons on a desk), and the log says what each kind does well and
   where it stops:
   - Live: while on screen it shows the next kind every few seconds. The
     new kind draws itself in, line by line, inbox first and the laptop
     last; four log lines per kind. Pause stops it (WCAG 2.2.2).
   - Reacting: the screens drift toward the pointer, the small ones more;
     hovering a screen or its caption lifts it and dims the rest; a click
     on one shows the next kind; the pills pick one.
   The SSR markup is the rest state (the landing page) and is complete;
   entrances are CSS keyframes from first paint. CSS owns every color, the
   draw-in and which kind shows (`is-k-<kind>` on the root, a `--d` delay
   per screen, a `--j` per line); GSAP writes only the drift. Under reduced
   motion nothing switches on its own. Auto switches are not announced;
   picked ones are. */

const AUTO_FIRST = 2200;
const AUTO_GAP = 4600;

// Log lines stay at about 37 characters: beside the drawing each is one
// line with an ellipsis, and a cut line loses its point.
const KINDS = [
  {
    key: 'landing',
    name: 'Landing page',
    url: 'yourbusiness.com/offer',
    query: 'your offer',
    lines: [
      ['kind', 'landing page: one page, one job'],
      ['desk', 'no menu, nothing to wander off to'],
      ['phone', 'the button stays under the thumb'],
      ['limit', 'a second offer needs a second page'],
    ],
  },
  {
    key: 'site',
    name: 'Website',
    url: 'yourbusiness.com',
    query: 'your business',
    lines: [
      ['kind', 'website: a few pages and a menu'],
      ['phone', 'the menu folds into one button'],
      ['search', 'each page can rank for its topic'],
      ['limit', 'it informs; it takes no payments'],
    ],
  },
  {
    key: 'store',
    name: 'Store',
    url: 'yourbusiness.com/shop',
    query: 'your product',
    lines: [
      ['kind', 'store: products, cart, checkout'],
      ['search', 'price and stock show in results'],
      ['phone', 'checkout is tested on a phone'],
      ['limit', 'stock, tax and shipping need care'],
    ],
  },
  {
    key: 'app',
    name: 'Web app',
    url: 'app.yourbusiness.com',
    query: 'your business login',
    lines: [
      ['kind', 'web app: accounts and your data'],
      ['phone', 'the table turns into cards'],
      ['search', "search can't see past the sign-in"],
      ['limit', 'more to build, more to look after'],
    ],
  },
  {
    key: 'mobile',
    name: 'Mobile app',
    url: 'yourbusiness.com/app',
    query: 'your business app',
    lines: [
      ['kind', 'mobile app: iOS and Android at once'],
      ['phone', 'it lives on the home screen'],
      ['inbox', 'a push reaches people where they are'],
      ['limit', 'each update waits for store review'],
    ],
  },
];

/* ---- Drawing parts ---- */

const INTER = "Inter, 'Inter Fallback', sans-serif";

// A rounded box as a path, so it can draw itself in (pathLength 1).
const rr = (x, y, w, h, r) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${
    y + h
  }H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
const ring = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

// A line that draws itself; `a` draws it in the accent.
const D = ({ d, a }) => <path className={`wb-d${a ? ' wb-d--a' : ''}`} d={d} pathLength="1" />;
const B = ({ x, y, w, h, r = 8 }) => <D d={rr(x, y, w, h, r)} />;
const L = ({ x1, y1, x2, y2, a }) => <D d={`M${x1} ${y1}L${x2} ${y2}`} a={a} />;
const O = ({ cx, cy, r, a }) => <D d={ring(cx, cy, r)} a={a} />;
// An accent plate (the action on each screen), and its label in ink.
const A = ({ x, y, w, h, r = 8, label, size = 20 }) => (
  <g className="wb-f">
    <path className="wb-a" d={rr(x, y, w, h, r)} />
    {label && (
      <text className="wb-t wb-t--on" x={x + w / 2} y={y + h / 2 + size * 0.36} fontSize={size} fontWeight="700" textAnchor="middle">
        {label}
      </text>
    )}
  </g>
);
const T = ({ x, y, size = 20, w = 500, a, anchor, children }) => (
  <text
    className={`wb-t${a ? ' wb-t--a' : ''}`}
    x={x}
    y={y}
    fontSize={size}
    fontWeight={w}
    textAnchor={anchor}
    letterSpacing={size >= 40 ? -1.5 : undefined}
  >
    {children}
  </text>
);
const Mountain = ({ x, y, w, h }) => (
  <D d={`M${x + w * 0.06} ${y + h * 0.88}L${x + w * 0.32} ${y + h * 0.5}L${x + w * 0.52} ${y + h * 0.72}L${x + w * 0.68} ${y + h * 0.56}L${x + w * 0.94} ${y + h * 0.88}`} />
);
const Star = ({ x, y, s = 9 }) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? s * 0.45 : s;
    const t = (Math.PI / 5) * i - Math.PI / 2;
    return `${(x + r * Math.cos(t)).toFixed(1)} ${(y + r * Math.sin(t)).toFixed(1)}`;
  });
  return <path className="wb-a" d={`M${pts.join('L')}Z`} />;
};

/* The laptop's page, 760 x 520 under the address bar. */
const DESK = {
  landing: () => (
    <>
      <T x={36} y={48} size={22} w={700}>Your business</T>
      <T x={36} y={150} size={56} w={800}>Your offer,</T>
      <T x={36} y={214} size={56} w={800}>in one line.</T>
      <B x={36} y={246} w={300} h={16} />
      <B x={36} y={276} w={230} h={16} />
      <A x={36} y={322} w={210} h={62} r={31} label="Book now" size={24} />
      <B x={420} y={84} w={304} h={300} r={22} />
      <Mountain x={420} y={84} w={304} h={300} />
      <O cx={650} cy={150} r={22} />
      <B x={36} y={420} w={214} h={64} r={14} />
      <B x={273} y={420} w={214} h={64} r={14} />
      <B x={510} y={420} w={214} h={64} r={14} />
    </>
  ),
  site: () => (
    <>
      <T x={36} y={48} size={22} w={700}>Your business</T>
      <T x={360} y={46} size={20} w={500}>About</T>
      <T x={440} y={46} size={20} w={500}>Work</T>
      <T x={514} y={46} size={20} w={500}>Prices</T>
      <A x={606} y={18} w={118} h={40} r={20} label="Contact" size={17} />
      <L x1={0} y1={78} x2={760} y2={78} />
      <T x={36} y={160} size={46} w={800}>Who you are,</T>
      <T x={36} y={214} size={46} w={800}>and what you do.</T>
      <B x={36} y={244} w={320} h={16} />
      <B x={36} y={274} w={250} h={16} />
      <B x={452} y={108} w={272} h={190} r={20} />
      <Mountain x={452} y={108} w={272} h={190} />
      <B x={36} y={330} w={214} h={160} r={18} />
      <B x={273} y={330} w={214} h={160} r={18} />
      <B x={510} y={330} w={214} h={160} r={18} />
    </>
  ),
  store: () => (
    <>
      <T x={36} y={48} size={22} w={700}>Your business</T>
      <T x={430} y={46} size={20} w={500}>Shop</T>
      <T x={500} y={46} size={20} w={500}>About</T>
      <B x={640} y={24} w={40} h={34} r={8} />
      <D d="M650 24Q660 6 670 24" />
      <A x={672} y={10} w={28} h={28} r={14} label="2" size={16} />
      <L x1={0} y1={78} x2={760} y2={78} />
      <T x={36} y={128} size={20} w={700}>Filter</T>
      <B x={36} y={150} w={18} h={18} r={4} />
      <B x={64} y={153} w={96} h={12} r={6} />
      <B x={36} y={186} w={18} h={18} r={4} />
      <B x={64} y={189} w={80} h={12} r={6} />
      <B x={36} y={222} w={18} h={18} r={4} />
      <B x={64} y={225} w={104} h={12} r={6} />
      {[214, 386, 558].map((x) => (
        <B key={`a${x}`} x={x} y={100} w={166} h={112} r={14} />
      ))}
      {[214, 386, 558].map((x) => (
        <T key={`p${x}`} x={x} y={246} size={24} w={700}>$24</T>
      ))}
      {[214, 386, 558].map((x) => (
        <B key={`b${x}`} x={x} y={272} w={166} h={112} r={14} />
      ))}
      {[214, 386, 558].map((x) => (
        <T key={`q${x}`} x={x} y={418} size={24} w={700}>$32</T>
      ))}
      <A x={226} y={112} w={64} h={28} r={14} label="Sale" size={15} />
    </>
  ),
  app: () => (
    <>
      <L x1={150} y1={0} x2={150} y2={520} />
      <A x={59} y={44} w={32} h={32} r={16} />
      <O cx={75} cy={120} r={16} />
      <O cx={75} cy={180} r={16} />
      <O cx={75} cy={240} r={16} />
      <T x={186} y={50} size={26} w={800}>Dashboard</T>
      <O cx={704} cy={40} r={20} />
      <B x={186} y={84} w={170} h={110} r={16} />
      <B x={372} y={84} w={170} h={110} r={16} />
      <B x={558} y={84} w={166} h={110} r={16} />
      <T x={206} y={156} size={40} w={800}>128</T>
      <T x={392} y={156} size={40} w={800}>94%</T>
      <T x={578} y={156} size={40} w={800}>12</T>
      <B x={186} y={214} w={538} h={176} r={16} />
      <D a d="M212 360L282 330L352 342L422 298L492 312L562 260L632 276L700 238" />
      <L x1={186} y1={420} x2={724} y2={420} />
      <L x1={186} y1={456} x2={724} y2={456} />
      <L x1={186} y1={492} x2={724} y2={492} />
    </>
  ),
  mobile: () => (
    <>
      <T x={36} y={48} size={22} w={700}>Your business</T>
      <T x={36} y={150} size={50} w={800}>Your business,</T>
      <T x={36} y={210} size={50} w={800}>in your pocket.</T>
      <B x={36} y={242} w={300} h={16} />
      <A x={36} y={300} w={176} h={58} r={29} label="App Store" size={20} />
      <B x={228} y={300} w={192} h={58} r={29} />
      <T x={324} y={336} size={20} w={700} anchor="middle">Google Play</T>
      <B x={500} y={44} w={196} h={420} r={32} />
      <B x={522} y={100} w={152} h={96} r={14} />
      <B x={522} y={212} w={152} h={42} r={10} />
      <B x={522} y={266} w={152} h={42} r={10} />
      <B x={522} y={320} w={152} h={42} r={10} />
      <L x1={500} y1={412} x2={696} y2={412} />
    </>
  ),
};

/* The phone's screen, 194 x 412 under the speaker. */
const PHONE = {
  landing: () => (
    <>
      <T x={14} y={28} size={15} w={700}>Your business</T>
      <T x={14} y={86} size={26} w={800}>Your offer,</T>
      <T x={14} y={118} size={26} w={800}>in one line.</T>
      <B x={14} y={138} w={150} h={10} r={5} />
      <B x={14} y={182} w={166} h={130} r={16} />
      <Mountain x={14} y={182} w={166} h={130} />
      <A x={14} y={344} w={166} h={52} r={26} label="Book now" size={18} />
    </>
  ),
  site: () => (
    <>
      <T x={14} y={28} size={15} w={700}>Your business</T>
      <L x1={154} y1={14} x2={180} y2={14} a />
      <L x1={154} y1={23} x2={180} y2={23} a />
      <L x1={154} y1={32} x2={180} y2={32} a />
      <L x1={0} y1={50} x2={194} y2={50} />
      <T x={14} y={98} size={22} w={800}>Who you are,</T>
      <T x={14} y={126} size={22} w={800}>and what you do.</T>
      <B x={14} y={146} w={150} h={10} r={5} />
      <B x={14} y={174} w={166} h={110} r={16} />
      <Mountain x={14} y={174} w={166} h={110} />
      <B x={14} y={300} w={166} h={96} r={16} />
    </>
  ),
  store: () => (
    <>
      <T x={14} y={28} size={15} w={700}>Your business</T>
      <B x={146} y={12} w={26} h={24} r={6} />
      <A x={164} y={2} w={22} h={22} r={11} label="2" size={13} />
      <B x={14} y={50} w={166} h={160} r={16} />
      <O cx={97} cy={130} r={34} />
      <T x={14} y={240} size={17} w={700}>Your product</T>
      <T x={14} y={274} size={26} w={800}>$24</T>
      <B x={14} y={290} w={48} h={34} r={10} />
      <B x={70} y={290} w={48} h={34} r={10} />
      <B x={126} y={290} w={48} h={34} r={10} />
      <A x={14} y={344} w={166} h={52} r={26} label="Add to cart" size={18} />
    </>
  ),
  app: () => (
    <>
      <T x={14} y={30} size={18} w={800}>Dashboard</T>
      <O cx={172} cy={24} r={12} />
      <B x={14} y={50} w={80} h={72} r={12} />
      <B x={100} y={50} w={80} h={72} r={12} />
      <T x={26} y={98} size={22} w={800}>128</T>
      <T x={112} y={98} size={22} w={800}>94%</T>
      <B x={14} y={136} w={166} h={116} r={14} />
      <D a d="M26 230L52 214L78 220L104 196L130 204L156 176L170 182" />
      <B x={14} y={266} w={166} h={36} r={10} />
      <B x={14} y={310} w={166} h={36} r={10} />
      <L x1={0} y1={362} x2={194} y2={362} />
      <A x={24} y={378} w={18} h={18} r={9} />
      <O cx={74} cy={387} r={9} />
      <O cx={120} cy={387} r={9} />
      <O cx={166} cy={387} r={9} />
    </>
  ),
  mobile: () => (
    <>
      <T x={14} y={30} size={18} w={800}>Good morning</T>
      <B x={14} y={48} w={166} h={96} r={16} />
      <T x={30} y={80} size={13} w={600}>Next booking</T>
      <T x={30} y={120} size={26} w={800}>Tue 10:30</T>
      <A x={14} y={158} w={166} h={46} r={23} label="Book again" size={16} />
      <B x={14} y={218} w={166} h={40} r={10} />
      <B x={14} y={268} w={166} h={40} r={10} />
      <B x={14} y={318} w={166} h={30} r={10} />
      <L x1={0} y1={362} x2={194} y2={362} />
      <O cx={28} cy={387} r={9} />
      <A x={65} y={378} w={18} h={18} r={9} />
      <O cx={120} cy={387} r={9} />
      <O cx={166} cy={387} r={9} />
    </>
  ),
};

/* The search result, 412 x 150 under the query bar (the query sits above,
   in the bar). */
const Fav = () => <O cx={10} cy={14} r={10} />;
const SEARCH = {
  landing: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>your offer</T>
      <Fav />
      <T x={28} y={20} size={18} w={500}>yourbusiness.com › offer</T>
      <T x={0} y={60} size={26} w={700} a>Your offer, in one line</T>
      <B x={0} y={82} w={390} h={12} r={6} />
      <B x={0} y={106} w={300} h={12} r={6} />
    </>
  ),
  site: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>your business</T>
      <Fav />
      <T x={28} y={20} size={18} w={500}>yourbusiness.com</T>
      <T x={0} y={60} size={26} w={700} a>Your business: who you are</T>
      <B x={0} y={82} w={360} h={12} r={6} />
      <T x={0} y={132} size={19} w={600}>About</T>
      <T x={96} y={132} size={19} w={600}>Work</T>
      <T x={182} y={132} size={19} w={600}>Prices</T>
      <T x={276} y={132} size={19} w={600}>Contact</T>
    </>
  ),
  store: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>your product</T>
      <Fav />
      <T x={28} y={20} size={18} w={500}>yourbusiness.com › shop</T>
      <T x={0} y={60} size={26} w={700} a>Your product</T>
      <T x={0} y={96} size={18} w={600}>$24.00 · In stock</T>
      {[180, 202, 224, 246, 268].map((x) => (
        <Star key={x} x={x} y={90} />
      ))}
      <B x={0} y={116} w={330} h={12} r={6} />
    </>
  ),
  app: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>your business login</T>
      <Fav />
      <T x={28} y={20} size={18} w={500}>app.yourbusiness.com</T>
      <T x={0} y={60} size={26} w={700} a>Sign in · Your business</T>
      <T x={0} y={96} size={18} w={400}>Sign in to see your dashboard.</T>
      <B x={0} y={116} w={240} h={12} r={6} />
    </>
  ),
  mobile: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>your business app</T>
      <A x={0} y={6} w={76} h={76} r={20} />
      <T x={96} y={36} size={22} w={700}>Your business</T>
      <T x={96} y={66} size={16} w={500}>iOS and Android</T>
      {[100, 122, 144, 166, 188].map((x) => (
        <Star key={x} x={x} y={96} s={8} />
      ))}
      <B x={318} y={24} w={84} h={42} r={21} />
      <T x={360} y={52} size={18} w={700} anchor="middle">Get</T>
      <B x={0} y={122} w={300} h={12} r={6} />
    </>
  ),
};

/* The inbox: one notification, 412 x 92 inside the card. */
const NOTICE = {
  landing: () => (
    <>
      <D d="M10 14H42V40H10ZM10 14L26 28L42 14" />
      <T x={64} y={26} size={20} w={700}>New lead</T>
      <T x={64} y={58} size={18} w={400}>From your landing page form.</T>
    </>
  ),
  site: () => (
    <>
      <D d="M10 14H42V40H10ZM10 14L26 28L42 14" />
      <T x={64} y={26} size={20} w={700}>New message</T>
      <T x={64} y={58} size={18} w={400}>A question from your contact form.</T>
    </>
  ),
  store: () => (
    <>
      <D d="M12 20H40L37 44H15ZM19 20Q26 4 33 20" />
      <T x={64} y={26} size={20} w={700}>New order #1042</T>
      <T x={64} y={58} size={18} w={400}>Two items, paid. Ship by Friday.</T>
    </>
  ),
  app: () => (
    <>
      <D a d="M10 40L20 28L28 34L42 16" />
      <T x={64} y={26} size={20} w={700}>Weekly report</T>
      <T x={64} y={58} size={18} w={400}>Ready on your dashboard.</T>
    </>
  ),
  mobile: () => (
    <>
      <A x={6} y={6} w={40} h={40} r={11} />
      <T x={64} y={26} size={20} w={700}>Your business</T>
      <T x={64} y={58} size={18} w={400}>Booked: Tuesday at 10:30.</T>
    </>
  ),
};

function Kinds({ art, x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {KINDS.map((k) => {
        const Draw = art[k.key];
        return (
          <g key={k.key} className={`wb-v wb-v--${k.key}`}>
            <Draw />
          </g>
        );
      })}
    </g>
  );
}

// The screens, smallest first: the order the kinds draw in (`--d`) and
// the order the entrance runs. Captions sit in zones no screen reaches
// (viewBox 1600 x 960), short, because the type floors at 12px while the
// drawing shrinks.
const TOUCH = ['notice', 'search', 'phone', 'desk'];
const DRIFT = { notice: 1.4, search: 1.2, phone: 1.3, desk: 0.6 };
const CAPS = [
  { key: 'search', l: 2.5, t: 36.5, w: 28.75, text: ['Search.', 'Two lines to earn the click.'] },
  { key: 'notice', l: 2.5, t: 63.5, w: 28.75, text: ['Inbox.', 'What it sends: a lead, an order, a push.'] },
  { key: 'desk', l: 35, t: 73.5, w: 30, text: ['Desktop.', 'A wide screen, a mouse, more time.'] },
  { key: 'phone', l: 83.75, t: 83.5, w: 14.5, text: ['Phone.', 'One column, one thumb.'] },
];

const lineItems = (k, n) => k.lines.map(([tag, text], i) => ({ tag, text, id: `${n}-${i}` }));

export default function KindsHero() {
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const [kind, setKind] = useState(0);
  const [log, setLog] = useState(() => lineItems(KINDS[0], 1));
  const [hot, setHot] = useState(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState(false);

  // The engine: the schedule, visibility, the log. Built once; everything
  // it reads lives in refs, everything it shows goes through state setters.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { runs: 1, next: 1, timer: 0, tl: null, visible: false, paused: false };

    const canAuto = () => !reduced && st.visible && !st.paused && !document.hidden;
    const sync = () => setLive(canAuto());
    const push = (line) => setLog((l) => [...l, line].slice(-4));

    function schedule(delay) {
      clearTimeout(st.timer);
      if (!canAuto()) return;
      st.timer = setTimeout(() => show(st.next, false), delay);
    }

    // A pick never waits: it cuts the running switch short.
    function show(index, manual) {
      clearTimeout(st.timer);
      if (st.tl) st.tl.kill();
      const i = index % KINDS.length;
      st.next = (i + 1) % KINDS.length;
      st.runs += 1;
      setAnnounce(manual);
      setKind(i);
      const lines = lineItems(KINDS[i], st.runs);
      if (reduced) {
        setLog(lines);
        return;
      }
      // One line per screen as it draws in (inbox, search, phone, laptop).
      const tl = gsap.timeline({
        onComplete: () => {
          st.tl = null;
          schedule(AUTO_GAP);
        },
      });
      st.tl = tl;
      [0, 0.35, 0.8, 1.3].forEach((at, n) => tl.call(() => push(lines[n]), null, at));
      tl.to({}, { duration: 0.8 }, 1.3);
    }

    const io = new IntersectionObserver(
      ([e]) => {
        st.visible = e.isIntersecting;
        sync();
        if (st.visible) schedule(st.runs > 1 ? AUTO_GAP / 2 : AUTO_FIRST);
        else clearTimeout(st.timer);
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    const onVis = () => {
      sync();
      if (document.hidden) clearTimeout(st.timer);
      else schedule(AUTO_GAP / 2);
    };
    document.addEventListener('visibilitychange', onVis);

    engineRef.current = {
      show: (i) => show(i, true),
      next: () => show(st.next, true),
      setPaused: (p) => {
        st.paused = p;
        sync();
        if (p) clearTimeout(st.timer);
        else schedule(600);
      },
    };

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      clearTimeout(st.timer);
      if (st.tl) st.tl.kill();
      engineRef.current = null;
    };
  }, []);

  // The pointer: each screen drifts toward it, the small ones more (the
  // inbox is nearer the eye than the laptop). quickTo tweens settle and
  // stop on their own. Fine pointers only.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root && root.querySelector('.wb-hero__stage');
    const svg = stage && stage.querySelector('svg');
    if (!svg) return undefined;
    const ok = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!ok) return undefined;
    const els = TOUCH.map((k) => q(svg, `drift-${k}`));
    const tos = els.map((el) => [
      gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' }),
      gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' }),
    ]);
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      TOUCH.forEach((k, i) => {
        tos[i][0](x * 16 * DRIFT[k]);
        tos[i][1](y * 12 * DRIFT[k]);
      });
    };
    const onLeave = () =>
      tos.forEach(([tx, ty]) => {
        tx(0);
        ty(0);
      });
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(els);
    };
  }, []);

  const next = () => engineRef.current && engineRef.current.next();
  const pick = (i) => engineRef.current && engineRef.current.show(i);
  const togglePause = () => {
    const p = !paused;
    setPaused(p);
    if (engineRef.current) engineRef.current.setPaused(p);
  };
  const hover = (key) => ({
    onPointerEnter: () => setHot(key),
    onPointerLeave: () => setHot(null),
  });
  const tp = (key) => ({
    className: `wb-hero__tp wb-hero__tp--${key}${hot === key ? ' is-on' : ''}`,
    style: { '--d': `${TOUCH.indexOf(key) * 0.14}s`, '--i': TOUCH.indexOf(key) },
    onClick: next,
    ...hover(key),
  });

  const k = KINDS[kind];
  const cls = ['wb-hero', `is-k-${k.key}`];
  if (live) cls.push('is-live');
  if (hot) cls.push('is-hot', `is-hot-${hot}`);

  return (
    <section ref={rootRef} className={cls.join(' ')} aria-labelledby="wb-hero-title">
      <div className="wb-hero__frame">
        <div className="wb-hero__copy">
          <p className="wb-hero__kicker">Web &amp; mobile</p>
          <h1 id="wb-hero-title" className="wb-hero__title">
            Built to load fast. Kept running.
          </h1>
          <p className="wb-hero__lede">
            Landing pages, websites, stores, web apps and iOS and Android apps, written by engineers and hosted by the
            same team. Pick a kind to see it on every screen.
          </p>
          <div className="wb-hero__ctas">
            <Link to="/contact" className="bw-cta wb-hero__cta">
              Start a project
            </Link>
            <Link to="/pricing/web-development-mobile-apps" className="wb-hero__more">
              Packages and prices
            </Link>
          </div>
        </div>

        <div className="wb-hero__bench">
          <div className="wb-hero__stage">
            <div className="wb-hero__plate">
              <p className="wb-hero__tag">
                <i aria-hidden="true" />
                Five kinds of build
              </p>
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false" fontFamily={INTER}>
                {/* The laptop: the page under its address bar, on a base. */}
                <g data-p="drift-desk">
                  <g {...tp('desk')}>
                    <path className="wb-hero__frm" d={rr(560, 60, 760, 580, 28)} />
                    <path className="wb-hero__thin" d="M560 120H1320" />
                    {[594, 620, 646].map((cx) => (
                      <circle key={cx} className="wb-hero__thin" cx={cx} cy="90" r="7" />
                    ))}
                    <path className="wb-hero__thin" d={rr(690, 74, 470, 32, 16)} />
                    {KINDS.map((x) => (
                      <text key={x.key} className={`wb-hero__url wb-v wb-v--${x.key}`} x="712" y="97" fontSize="19" fontWeight="500">
                        {x.url}
                      </text>
                    ))}
                    <Kinds art={DESK} x={560} y={120} />
                    <path className="wb-hero__frm" d={rr(496, 648, 888, 30, 15)} />
                  </g>
                </g>

                {/* The phone, in front of the laptop's corner. */}
                <g data-p="drift-phone">
                  <g {...tp('phone')}>
                    <path className="wb-hero__frm" d={rr(1340, 300, 230, 480, 40)} />
                    <path className="wb-hero__thin" d="M1430 324H1480" />
                    <Kinds art={PHONE} x={1358} y={350} />
                  </g>
                </g>

                {/* The search result, under its query. */}
                <g data-p="drift-search">
                  <g {...tp('search')}>
                    <path className="wb-hero__frm" d={rr(40, 60, 460, 270, 24)} />
                    <path className="wb-hero__thin" d={rr(64, 84, 412, 48, 24)} />
                    <path className="wb-hero__thin" d={`${ring(94, 106, 10)}M101 113L110 122`} />
                    <Kinds art={SEARCH} x={64} y={150} />
                  </g>
                </g>

                {/* The inbox: what the build sends. */}
                <g data-p="drift-notice">
                  <g {...tp('notice')}>
                    <path className="wb-hero__frm" d={rr(40, 450, 460, 140, 24)} />
                    <text className="wb-hero__now" x="476" y="486" fontSize="15" textAnchor="end">
                      now
                    </text>
                    <Kinds art={NOTICE} x={64} y={474} />
                  </g>
                </g>
              </svg>
            </div>

            <div className="wb-hero__caps">
              {CAPS.map((c, i) => (
                <p
                  key={c.key}
                  className={`wb-hero__cap${hot === c.key ? ' is-on' : ''}`}
                  style={{ left: `${c.l}%`, top: `${c.t}%`, width: `${c.w}%`, '--i': i }}
                  {...hover(c.key)}
                >
                  <strong>{c.text[0]}</strong> {c.text[1]}
                </p>
              ))}
            </div>

            <div className="wb-hero__picks" role="group" aria-label="Show a kind of build">
              {KINDS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  className={`wb-hero__pick${i === kind ? ' is-on' : ''}`}
                  aria-pressed={i === kind}
                  onClick={() => pick(i)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="wb-hero__logbox">
          <div className="wb-hero__meta">
            <span>The build log</span>
            <span className="wb-hero__count">
              {`Kind ${kind + 1} of ${KINDS.length}`}
              <button type="button" className="wb-hero__pause" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </span>
          </div>
          <ol className="wb-hero__log" aria-live={announce ? 'polite' : 'off'}>
            {log.map((l) => (
              <li key={l.id}>
                <b>{l.tag}</b>
                <span>{l.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
