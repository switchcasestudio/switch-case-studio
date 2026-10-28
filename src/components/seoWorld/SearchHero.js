import { Link } from 'react-router-dom';
import kindsParts, { INTER, rr, ring } from '../worlds/kindsParts';
import useKindsHero from '../worlds/useKindsHero';

/* The SEO & AI Search world's hero (2026-10-27, owner: "last but not
   least, lets do the SEO & AI search service page", after the brand, Web
   and AI worlds learned to teach), the Web and AI heroes' sibling: they
   run the five kinds of build and of automation, this one the five ways a
   business is found in search (web result, map, rich result, AI answer,
   ad). The frame, copy, captions, log and Pause are the shared
   `world-hero`; the engine (worlds/useKindsHero.js), the drawing parts
   (worlds/kindsParts.js) and the draw-in (`kinds-hero`) are the Web
   hero's, so the three behave alike. It replaces the search desk
   (2026-10-24), which ran one made-up search with made-up rankings; this
   says how each way is earned and where it stops.

   One business, "Your business", under a magnifying glass (2026-10-27,
   owner: "all three services, hero, looking pretty much the same ... we
   need to get a little bit of diversity"): no laptop and no phone, which
   are the Web hero's language. On the left the results page with its five
   places in the order a page shows them (ads, the AI answer, the map, rich
   results, web results); the current kind's place turns orange and a line
   runs from it to the glass, which shows yours up close. On the right
   your side (what makes it show: the head, the Business Profile,
   structured data, a passage, a campaign) and what lands in your inbox.
   The log says how each is earned and its limit; the local factors are
   Google's own (relevance, distance, prominence). The SSR markup is the
   rest state (the web result) and is complete; entrances are CSS
   keyframes from first paint. CSS owns every color, the draw-in, the
   highlight and which kind shows; GSAP writes only the drift. */

// Log lines stay at about 37 characters: beside the drawing each is one
// line with an ellipsis, and a cut line loses its point.
const KINDS = [
  {
    key: 'web',
    name: 'Web result',
    query: 'your service in your city',
    lines: [
      ['kind', 'web result: a link, a title, a line'],
      ['you', 'the title and line come from you'],
      ['how', 'earned: content, links, a fast page'],
      ['limit', 'free per click, but slow to earn'],
    ],
  },
  {
    key: 'map',
    name: 'Map',
    query: 'your service near me',
    lines: [
      ['kind', 'map: three businesses near you'],
      ['you', 'it reads your Business Profile'],
      ['how', 'relevance, distance, prominence'],
      ['limit', 'it only shows near the searcher'],
    ],
  },
  {
    key: 'rich',
    name: 'Rich result',
    query: 'your product price',
    lines: [
      ['kind', 'rich result: stars, price, stock'],
      ['you', 'it comes from structured data'],
      ['how', 'same place, more room on the page'],
      ['limit', 'Google decides whether it shows'],
    ],
  },
  {
    key: 'answer',
    name: 'AI answer',
    query: 'what does your service cost?',
    lines: [
      ['kind', 'AI answer: a summary with sources'],
      ['you', 'it quotes a passage, not a page'],
      ['how', 'its crawler has to be let in'],
      ['limit', 'a citation is not always a click'],
    ],
  },
  {
    key: 'ad',
    name: 'Ad',
    query: 'your service today',
    lines: [
      ['kind', 'ad: paid, on top, marked Sponsored'],
      ['you', 'you pick the words and the budget'],
      ['how', 'it shows the day it starts'],
      ['limit', 'it stops when the budget stops'],
    ],
  },
];

/* ---- Drawing parts (worlds/kindsParts.js) ---- */

const { D, B, L, A, T, Kinds } = kindsParts('sw', KINDS);

const f1 = (n) => Math.round(n * 10) / 10;
// A five-point star around (cx, cy), for ratings.
const star = (cx, cy, r) =>
  `${Array.from({ length: 10 }, (_, i) => {
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const d = i % 2 ? r * 0.45 : r;
    return `${i ? 'L' : 'M'}${f1(cx + d * Math.cos(a))} ${f1(cy + d * Math.sin(a))}`;
  }).join('')}Z`;
const Stars = ({ x, y, r, gap }) => <D a d={[0, 1, 2, 3, 4].map((i) => star(x + i * gap, y, r)).join('')} />;
// A map pin with its tip at (x, y).
const pin = (x, y, s = 1) =>
  `M${x} ${y}C${x - 6 * s} ${y - 12 * s} ${x - 16 * s} ${y - 20 * s} ${x - 16 * s} ${y - 30 * s}a${16 * s} ${16 * s} 0 0 1 ${
    32 * s
  } 0C${x + 16 * s} ${y - 20 * s} ${x + 6 * s} ${y - 12 * s} ${x} ${y}Z${ring(x, y - 30 * s, 6 * s)}`;
const glass = (cx, cy, r) => `${ring(cx, cy, r)}M${cx + r * 0.7} ${cy + r * 0.7}L${cx + r * 1.6} ${cy + r * 1.6}`;

/* The results page: five places, in the order a page shows them. The
   blocks are static; the current kind's block turns orange (CSS) and a
   line runs from it to the glass. */
const BLOCKS = [
  { key: 'ad', y: 132, h: 84, label: 'Sponsored' },
  { key: 'answer', y: 232, h: 128, label: 'AI answer' },
  { key: 'map', y: 376, h: 128, label: 'Map' },
  { key: 'rich', y: 520, h: 76, label: 'Rich result' },
  { key: 'web', y: 612, h: 52, label: 'Web result' },
];
const LENS = { cx: 880, cy: 400, r: 290 };
const mid = (key) => {
  const b = BLOCKS.find((x) => x.key === key);
  return b.y + b.h / 2;
};
const reach = (key) => `M456 ${mid(key)}H500C545 ${mid(key)} 545 ${LENS.cy} ${LENS.cx - LENS.r} ${LENS.cy}`;
// Each block's inside, faint: the shape of what sits there.
const fill = (key, y) =>
  ({
    ad: `M84 ${y + 48}H300M84 ${y + 66}H420`,
    answer: `M84 ${y + 48}H420M84 ${y + 68}H400M84 ${y + 88}H330${rr(84, y + 102, 96, 16, 8)}${rr(192, y + 102, 96, 16, 8)}`,
    map: `${rr(84, y + 40, 150, 72, 10)}M84 ${y + 80}H234M150 ${y + 40}V${y + 112}M252 ${y + 52}H420M252 ${y + 76}H400M252 ${y + 100}H380`,
    rich: `M84 ${y + 44}H380${[0, 1, 2, 3, 4].map((i) => star(92 + i * 16, y + 60, 6)).join('')}`,
    web: `M84 ${y + 38}H400`,
  })[key];

const PAGE = Object.fromEntries(
  KINDS.map((k) => [
    k.key,
    () => (
      <>
        <T x={108} y={95} size={17}>
          {k.query}
        </T>
        <D a d={reach(k.key)} />
      </>
    ),
  ]),
);

/* Under the glass: yours, up close, 440 wide from (660, 250). */
const UP = {
  web: () => (
    <>
      <D a d="M-8 6V214" />
      <T x={0} y={30} size={17}>
        yourbusiness.com › services
      </T>
      <T x={0} y={76} size={30} w={700} a>
        Your service in your city,
      </T>
      <T x={0} y={114} size={30} w={700} a>
        the same day
      </T>
      <T x={0} y={160} size={19}>
        A written price before any work
      </T>
      <T x={0} y={188} size={19}>
        starts. Open Monday to Saturday.
      </T>
    </>
  ),
  map: () => (
    <>
      <B x={0} y={20} w={440} h={150} r={16} />
      <L x1={0} y1={95} x2={440} y2={80} />
      <L x1={150} y1={20} x2={170} y2={170} />
      <D d="M0 140C140 120 300 150 440 110" />
      <D d={pin(80, 70, 0.6)} />
      <D d={pin(380, 64, 0.6)} />
      <D a d={pin(260, 128, 0.95)} />
      <T x={0} y={214} size={24} w={700} a>
        Your business
      </T>
      <T x={0} y={244} size={17}>
        Your service · 0.4 mi · Open now
      </T>
      <A x={330} y={192} w={110} h={44} r={22} label="Call" size={18} />
    </>
  ),
  rich: () => (
    <>
      <T x={0} y={30} size={17}>
        yourbusiness.com › Shop
      </T>
      <T x={0} y={74} size={28} w={700} a>
        Your product, made to order
      </T>
      <Stars x={12} y={110} r={13} gap={30} />
      <T x={162} y={117} size={19}>
        4.8 · 126 reviews
      </T>
      <T x={0} y={162} size={22} w={700}>
        $24.00 · In stock
      </T>
    </>
  ),
  answer: () => (
    <>
      <T x={0} y={30} size={17} w={700}>
        AI answer
      </T>
      <T x={0} y={70} size={20}>
        It depends on the job. Your business
      </T>
      <T x={0} y={98} size={20}>
        lists its prices on one page: from
      </T>
      <T x={0} y={126} size={20}>
        $90, with a written price first.
      </T>
      <T x={0} y={168} size={15} w={700}>
        Sources
      </T>
      <A x={0} y={184} w={220} h={44} r={22} label="yourbusiness.com" size={17} />
      <B x={236} y={184} w={120} h={44} r={22} />
    </>
  ),
  ad: () => (
    <>
      <T x={0} y={30} size={16} w={700}>
        Sponsored
      </T>
      <T x={0} y={58} size={17}>
        yourbusiness.com
      </T>
      <T x={0} y={98} size={28} w={700} a>
        Your service today:
      </T>
      <T x={0} y={134} size={28} w={700} a>
        call for a price
      </T>
      <T x={0} y={172} size={19}>
        Same-day visits, a written price first.
      </T>
      <B x={0} y={194} w={110} h={42} r={21} />
      <T x={55} y={221} size={16} w={600} anchor="middle">
        Prices
      </T>
      <B x={122} y={194} w={100} h={42} r={21} />
      <T x={172} y={221} size={16} w={600} anchor="middle">
        Book
      </T>
      <A x={234} y={194} w={100} h={42} r={21} label="Call" size={17} />
    </>
  ),
};

/* Your side: what makes each one show, 306 wide under its title bar (the
   title sits above, in the bar). */
const STORE = 'M4 18H40V44H4ZM0 18L6 4H38L44 18M16 44V30H28V44';
const Bar = ({ children }) => (
  <T x={48} y={-47} size={16} w={500}>
    {children}
  </T>
);
const YOU = {
  web: () => (
    <>
      <Bar>Your page · the head</Bar>
      <T x={0} y={20} size={15} w={600} a>
        {'<title>Your service…</title>'}
      </T>
      <T x={0} y={52} size={15}>
        {'<meta name="description">'}
      </T>
      <T x={0} y={84} size={15}>
        {'<link rel="canonical">'}
      </T>
      <T x={0} y={116} size={15}>
        {'<h1>Your service…</h1>'}
      </T>
    </>
  ),
  map: () => (
    <>
      <Bar>Business Profile</Bar>
      <D d={STORE} />
      <T x={56} y={22} size={18} w={700}>
        Your business
      </T>
      <T x={56} y={44} size={14}>
        Your service · Your city
      </T>
      <A x={220} y={0} w={86} h={30} r={15} label="Open" size={15} />
      <L x1={0} y1={70} x2={306} y2={70} />
      <T x={0} y={104} size={15}>
        Hours, photos and categories,
      </T>
      <T x={0} y={126} size={15}>
        all filled.
      </T>
    </>
  ),
  rich: () => (
    <>
      <Bar>JSON-LD</Bar>
      <T x={0} y={20} size={15} w={600} a>
        {'"@type": "Product",'}
      </T>
      <T x={0} y={52} size={15}>
        {'"name": "Your product",'}
      </T>
      <T x={0} y={84} size={15}>
        {'"offers": { "price": "24.00" },'}
      </T>
      <T x={0} y={116} size={15}>
        {'"aggregateRating": 4.8'}
      </T>
    </>
  ),
  answer: () => (
    <>
      <Bar>Your page · Prices</Bar>
      <T x={0} y={22} size={17} w={700}>
        How much does it cost?
      </T>
      <T x={0} y={50} size={15}>
        From $90, with a written price
      </T>
      <T x={0} y={72} size={15}>
        before any work starts.
      </T>
      <L x1={0} y1={94} x2={306} y2={94} />
      <T x={0} y={124} size={14} w={600} a>
        OAI-SearchBot · Allow: /
      </T>
    </>
  ),
  ad: () => (
    <>
      <Bar>Campaign · Search</Bar>
      <T x={0} y={22} size={17} w={700}>
        Keywords
      </T>
      <A x={220} y={0} w={86} h={30} r={15} label="Live" size={15} />
      <T x={0} y={50} size={15}>
        your service near me,
      </T>
      <T x={0} y={72} size={15}>
        your service today
      </T>
      <L x1={0} y1={94} x2={306} y2={94} />
      <T x={0} y={124} size={16} w={600}>
        Budget: $30 a day
      </T>
      <T x={0} y={148} size={14}>
        You pay per click.
      </T>
    </>
  ),
};

/* The inbox: what each one brings in, 306 wide inside the card. */
const Note = ({ title, line }) => (
  <>
    <T x={60} y={24} size={18} w={700}>
      {title}
    </T>
    <T x={60} y={54} size={15} w={400}>
      {line}
    </T>
  </>
);
const NOTICE = {
  web: () => (
    <>
      <D d={glass(20, 22, 12)} />
      <Note title="Visit from search" line="Read prices, sent the form." />
    </>
  ),
  map: () => (
    <>
      <D d={pin(24, 48, 0.85)} />
      <Note title="Call from the map" line="Tapped Call on your listing." />
    </>
  ),
  rich: () => (
    <>
      <D d="M6 18H42L38 46H10ZM16 18V12a8 8 0 0 1 16 0V18" />
      <Note title="Order from a result" line="Saw the price, then bought." />
    </>
  ),
  answer: () => (
    <>
      <D d={`${rr(2, 6, 44, 32, 10)}M14 38L12 48L24 38`} />
      <Note title="Visit from an AI answer" line="Clicked the source it named." />
    </>
  ),
  ad: () => (
    <>
      <A x={4} y={8} w={40} h={38} r={8} />
      <Note title="Form from the ad" line="One paid click, one lead." />
    </>
  ),
};

// The parts, smallest first: the order the kinds draw in (`--d`) and the
// order the entrance runs. Captions sit in zones no line crosses, short,
// because the type floors at 12px while the drawing shrinks.
const TOUCH = ['notice', 'you', 'page', 'lens'];
const DRIFT = { notice: 1.4, you: 1.2, page: 0.7, lens: 0.5 };
const CAPS = [
  { key: 'page', l: 2.5, t: 72, w: 27.5, text: ['Results page.', 'Five places, top to bottom.'] },
  { key: 'lens', l: 37.5, t: 74.5, w: 25, text: ['Up close.', 'What yours looks like there.'] },
  { key: 'you', l: 75.6, t: 41, w: 22, text: ['Your side.', 'What makes it show.'] },
  { key: 'notice', l: 75.6, t: 63, w: 22, text: ['Inbox.', 'What it brings in.'] },
];

export default function SearchHero() {
  const { rootRef, kind, log, hot, paused, announce, cls, pick, togglePause, hover, tp } = useKindsHero({
    p: 'sw',
    kinds: KINDS,
    touch: TOUCH,
    drift: DRIFT,
  });

  return (
    <section ref={rootRef} className={cls} aria-labelledby="sw-hero-title">
      <div className="sw-hero__frame">
        <div className="sw-hero__copy">
          <p className="sw-hero__kicker">SEO &amp; AI search</p>
          <h1 id="sw-hero-title" className="sw-hero__title">
            Found on Google. Quoted by AI.
          </h1>
          <p className="sw-hero__lede">
            Web results, the map, rich results, AI answers and ads: five ways to be found, each earned its own
            way.<span className="sw-hero__hint"> Pick one to see where it shows up.</span>
          </p>
          <div className="sw-hero__ctas">
            <Link to="/contact" className="bw-cta sw-hero__cta">
              Start with an audit
            </Link>
            <Link to="/pricing/seo-ai-search" className="sw-hero__more">
              <span className="sw-hero__wide">Packages and prices</span>
              <span className="sw-hero__narrow">Prices</span>
            </Link>
          </div>
        </div>

        <div className="sw-hero__bench">
          <div className="sw-hero__stage">
            <div className="sw-hero__plate">
              <p className="sw-hero__tag">
                <i aria-hidden="true" />
                Five ways to be found
              </p>
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false" fontFamily={INTER}>
                <defs>
                  <clipPath id="sw-hero-lens">
                    <circle cx={LENS.cx} cy={LENS.cy} r={LENS.r - 18} />
                  </clipPath>
                </defs>

                {/* The results page: the query, then the five places. */}
                <g data-p="drift-page">
                  <g {...tp('page')}>
                    <path className="sw-hero__frm" d={rr(40, 40, 440, 640, 24)} />
                    <path className="sw-hero__thin" d={rr(64, 64, 392, 48, 24)} />
                    <path className="sw-hero__thin" d={glass(84, 86, 9)} />
                    {BLOCKS.map((b) => (
                      <g key={b.key}>
                        <path className={`sw-hero__blk sw-hero__blk--${b.key}`} d={rr(64, b.y, 392, b.h, 14)} />
                        <path className="sw-hero__fill" d={fill(b.key, b.y)} />
                        <text className={`sw-hero__lbl sw-hero__lbl--${b.key}`} x="84" y={b.y + 26} fontSize="15" fontWeight="700">
                          {b.label}
                        </text>
                      </g>
                    ))}
                    <Kinds art={PAGE} x={0} y={0} />
                  </g>
                </g>

                {/* The glass: yours, up close. */}
                <g data-p="drift-lens">
                  <g {...tp('lens')}>
                    <path className="sw-hero__frm" d={rr(1090, 588, 160, 44, 22)} transform="rotate(45 1090 610)" />
                    <path className="sw-hero__frm" d={ring(LENS.cx, LENS.cy, LENS.r)} />
                    <path className="sw-hero__rim" d={ring(LENS.cx, LENS.cy, LENS.r - 14)} />
                    <g clipPath="url(#sw-hero-lens)">
                      <Kinds art={UP} x={660} y={250} />
                    </g>
                  </g>
                </g>

                {/* Your side, under its title bar. */}
                <g data-p="drift-you">
                  <g {...tp('you')}>
                    <path className="sw-hero__frm" d={rr(1210, 100, 350, 280, 24)} />
                    <path className="sw-hero__thin" d={rr(1230, 120, 310, 44, 22)} />
                    <path className="sw-hero__thin" d="M1256 132L1248 142L1256 152M1264 132L1272 142L1264 152" />
                    <Kinds art={YOU} x={1232} y={196} />
                  </g>
                </g>

                {/* The inbox: what it brings in. */}
                <g data-p="drift-notice">
                  <g {...tp('notice')}>
                    <path className="sw-hero__frm" d={rr(1210, 470, 350, 120, 24)} />
                    <text className="sw-hero__now" x="1540" y="500" fontSize="15" textAnchor="end">
                      now
                    </text>
                    <Kinds art={NOTICE} x={1232} y={494} />
                  </g>
                </g>
              </svg>
            </div>

            <div className="sw-hero__caps">
              {CAPS.map((c, i) => (
                <p
                  key={c.key}
                  className={`sw-hero__cap${hot === c.key ? ' is-on' : ''}`}
                  style={{ left: `${c.l}%`, top: `${c.t}%`, width: `${c.w}%`, '--i': i }}
                  {...hover(c.key)}
                >
                  <strong>{c.text[0]}</strong> {c.text[1]}
                </p>
              ))}
            </div>

            <div className="sw-hero__picks" role="group" aria-label="Show a way to be found">
              {KINDS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  className={`sw-hero__pick${i === kind ? ' is-on' : ''}`}
                  aria-pressed={i === kind}
                  onClick={() => pick(i)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sw-hero__logbox">
          <div className="sw-hero__meta">
            <span>The search log</span>
            <span className="sw-hero__count">
              {`Kind ${kind + 1} of ${KINDS.length}`}
              <button type="button" className="sw-hero__pause" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </span>
          </div>
          <ol className="sw-hero__log" aria-live={announce ? 'polite' : 'off'}>
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
