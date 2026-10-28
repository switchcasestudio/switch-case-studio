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

   One business, "Your business", on four screens at once: the results
   page on a laptop, the same search on a phone, your side (what makes it
   show: the head, the Business Profile, structured data, a passage, a
   campaign) and what lands in your inbox. The log says how each is earned
   and its limit; the local factors are Google's own (relevance, distance,
   prominence). The SSR markup is the rest state (the web result) and is
   complete; entrances are CSS keyframes from first paint. CSS owns every
   color, the draw-in and which kind shows; GSAP writes only the drift. */

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
const lens = (cx, cy, r) => `${ring(cx, cy, r)}M${cx + r * 0.7} ${cy + r * 0.7}L${cx + r * 1.6} ${cy + r * 1.6}`;
// A photo placeholder: a frame, a hill and a sun.
const photo = (x, y, w, h) => `${rr(x, y, w, h, 12)}M${x + 14} ${y + h - 14}L${x + w * 0.38} ${y + h * 0.45}L${x + w * 0.6} ${
  y + h * 0.7
}L${x + w * 0.74} ${y + h * 0.58}L${x + w - 14} ${y + h - 14}${ring(x + w * 0.74, y + h * 0.28, Math.min(w, h) * 0.08)}`;

// The page's search box, with the query in words.
const Ask = ({ q }) => (
  <>
    <B x={36} y={22} w={600} h={52} r={26} />
    <D d={lens(66, 46, 10)} />
    <T x={92} y={55} size={19}>
      {q}
    </T>
  </>
);
// Somebody else's result, as bars: url, title, line.
const Other = ({ y, w = 420 }) => (
  <>
    <B x={36} y={y} w={190} h={12} r={6} />
    <B x={36} y={y + 22} w={w} h={20} r={8} />
    <B x={36} y={y + 52} w={600} h={10} r={5} />
  </>
);
const Bars = ({ y, w = 150 }) => (
  <>
    <B x={14} y={y} w={96} h={8} r={4} />
    <B x={14} y={y + 14} w={w} h={12} r={6} />
    <B x={14} y={y + 34} w={166} h={8} r={4} />
  </>
);
const PhoneAsk = ({ q }) => (
  <>
    <B x={14} y={14} w={166} h={34} r={17} />
    <T x={28} y={36} size={12}>
      {q}
    </T>
  </>
);

/* The laptop: the results page, 760 x 520 under the address bar. */
const DESK = {
  web: () => (
    <>
      <Ask q="your service in your city" />
      <Other y={104} />
      <D a d="M18 200V312" />
      <T x={36} y={214} size={16}>
        yourbusiness.com › services
      </T>
      <T x={36} y={250} size={26} w={700} a>
        Your service in your city, same day
      </T>
      <T x={36} y={284} size={17}>
        A written price before any work starts. Open
      </T>
      <T x={36} y={308} size={17}>
        Monday to Saturday, 9 am to 6 pm.
      </T>
      <Other y={350} w={440} />
      <Other y={440} w={380} />
    </>
  ),
  map: () => (
    <>
      <Ask q="your service near me" />
      <B x={36} y={96} w={688} h={236} r={16} />
      <L x1={36} y1={196} x2={724} y2={170} />
      <L x1={250} y1={96} x2={290} y2={332} />
      <L x1={540} y1={96} x2={490} y2={332} />
      <D d="M36 290C200 262 420 300 724 252" />
      <D d={pin(160, 178, 0.8)} />
      <D d={pin(630, 150, 0.8)} />
      <D d={pin(410, 292, 0.8)} />
      <D a d={pin(350, 232, 1.15)} />
      <T x={36} y={382} size={21} w={700} a>
        Your business
      </T>
      <T x={36} y={408} size={16}>
        Your service · 0.4 mi · Open now
      </T>
      <A x={604} y={358} w={120} h={44} r={22} label="Call" size={18} />
      <B x={36} y={436} w={220} h={16} r={8} />
      <B x={36} y={460} w={300} h={10} r={5} />
      <B x={604} y={434} w={120} h={40} r={20} />
      <B x={36} y={488} w={180} h={14} r={7} />
      <B x={36} y={508} w={260} h={8} r={4} />
    </>
  ),
  rich: () => (
    <>
      <Ask q="your product price" />
      <Other y={104} />
      <D a d="M18 200V330" />
      <T x={36} y={214} size={16}>
        yourbusiness.com › Shop › Your product
      </T>
      <T x={36} y={250} size={26} w={700} a>
        Your product, made to order
      </T>
      <Stars x={48} y={280} r={11} gap={26} />
      <T x={172} y={287} size={17}>
        4.8 · 126 reviews
      </T>
      <T x={36} y={322} size={18} w={600}>
        $24.00 · In stock
      </T>
      <D d={photo(584, 196, 140, 140)} />
      <Other y={370} w={440} />
      <Other y={450} w={380} />
    </>
  ),
  answer: () => (
    <>
      <Ask q="what does your service cost?" />
      <B x={36} y={96} w={688} h={300} r={18} />
      <T x={64} y={138} size={18} w={700}>
        AI answer
      </T>
      <T x={64} y={178} size={19}>
        It depends on the job. Your business lists its
      </T>
      <T x={64} y={206} size={19}>
        prices on one page: from $90, with a written
      </T>
      <T x={64} y={234} size={19}>
        price before any work starts.
      </T>
      <T x={64} y={286} size={16} w={700}>
        Sources
      </T>
      <A x={64} y={304} w={230} h={44} r={22} label="yourbusiness.com" size={17} />
      <B x={310} y={304} w={170} h={44} r={22} />
      <B x={496} y={304} w={140} h={44} r={22} />
      <Other y={420} />
    </>
  ),
  ad: () => (
    <>
      <Ask q="your service today" />
      <T x={36} y={124} size={16} w={700}>
        Sponsored
      </T>
      <D a d="M18 136V286" />
      <T x={36} y={154} size={16}>
        yourbusiness.com
      </T>
      <T x={36} y={190} size={26} w={700} a>
        Your service today: call for a price
      </T>
      <T x={36} y={224} size={17}>
        Same-day visits, a written price first.
      </T>
      <B x={36} y={244} w={110} h={40} r={20} />
      <T x={91} y={270} size={16} w={600} anchor="middle">
        Prices
      </T>
      <B x={158} y={244} w={110} h={40} r={20} />
      <T x={213} y={270} size={16} w={600} anchor="middle">
        Book
      </T>
      <A x={280} y={244} w={110} h={40} r={20} label="Call" size={17} />
      <T x={36} y={326} size={16} w={700}>
        Sponsored
      </T>
      <B x={36} y={340} w={190} h={12} r={6} />
      <B x={36} y={362} w={380} h={20} r={8} />
      <L x1={0} y1={410} x2={760} y2={410} />
      <Other y={432} />
    </>
  ),
};

/* The phone's screen, 194 x 412 under the speaker. */
const PHONE = {
  web: () => (
    <>
      <PhoneAsk q="your service" />
      <Bars y={62} />
      <D a d="M6 106V188" />
      <T x={14} y={116} size={11}>
        yourbusiness.com
      </T>
      <T x={14} y={140} size={16} w={700} a>
        Your service in
      </T>
      <T x={14} y={160} size={16} w={700} a>
        your city
      </T>
      <T x={14} y={182} size={12}>
        A written price first.
      </T>
      <Bars y={212} w={160} />
      <Bars y={276} w={130} />
    </>
  ),
  map: () => (
    <>
      <B x={14} y={14} w={166} h={196} r={14} />
      <L x1={14} y1={92} x2={180} y2={72} />
      <L x1={70} y1={14} x2={100} y2={210} />
      <D d="M14 172C80 152 120 182 180 142" />
      <D d={pin(48, 70, 0.55)} />
      <D d={pin(150, 176, 0.55)} />
      <D a d={pin(128, 128, 0.8)} />
      <A x={14} y={222} w={166} h={92} r={14} />
      <T x={28} y={250} size={15} w={700} on>
        Your business
      </T>
      <T x={28} y={272} size={12} on>
        0.4 mi · Open now
      </T>
      <T x={28} y={294} size={12} on>
        Your service
      </T>
      <B x={14} y={326} w={78} h={38} r={19} />
      <T x={53} y={350} size={13} w={700} anchor="middle">
        Call
      </T>
      <B x={102} y={326} w={78} h={38} r={19} />
      <T x={141} y={350} size={13} w={700} anchor="middle">
        Route
      </T>
    </>
  ),
  rich: () => (
    <>
      <PhoneAsk q="your product price" />
      <B x={14} y={62} w={166} h={232} r={14} />
      <D d={photo(24, 72, 146, 100)} />
      <T x={24} y={196} size={14} w={700}>
        Your product
      </T>
      <Stars x={31} y={214} r={7} gap={16} />
      <T x={110} y={219} size={11}>
        4.8 (126)
      </T>
      <T x={24} y={246} size={15} w={700} a>
        $24.00
      </T>
      <T x={24} y={270} size={12}>
        In stock
      </T>
      <Bars y={308} />
    </>
  ),
  answer: () => (
    <>
      <T x={14} y={28} size={15} w={700}>
        AI chat
      </T>
      <L x1={0} y1={46} x2={194} y2={46} />
      <B x={44} y={62} w={136} h={58} r={16} />
      <T x={56} y={86} size={13}>
        How much does
      </T>
      <T x={56} y={106} size={13}>
        it cost?
      </T>
      <B x={14} y={134} w={166} h={86} r={16} />
      <T x={26} y={160} size={13}>
        From $90, with a
      </T>
      <T x={26} y={180} size={13}>
        written price before
      </T>
      <T x={26} y={200} size={13}>
        any work starts.
      </T>
      <A x={14} y={232} w={150} h={30} r={15} label="yourbusiness.com" size={12} />
      <B x={14} y={356} w={166} h={40} r={20} />
    </>
  ),
  ad: () => (
    <>
      <PhoneAsk q="your service today" />
      <T x={14} y={72} size={11} w={700}>
        Sponsored
      </T>
      <T x={14} y={92} size={11}>
        yourbusiness.com
      </T>
      <T x={14} y={116} size={16} w={700} a>
        Your service
      </T>
      <T x={14} y={136} size={16} w={700} a>
        today
      </T>
      <T x={14} y={158} size={12}>
        Call for a price.
      </T>
      <A x={14} y={172} w={166} h={40} r={20} label="Call" size={15} />
      <Bars y={236} w={160} />
      <Bars y={300} w={130} />
    </>
  ),
};

/* Your side: what makes each one show, 412 x 160 under its title bar
   (the title sits above, in the bar). */
const STORE = 'M4 18H40V44H4ZM0 18L6 4H38L44 18M16 44V30H28V44';
const YOU = {
  web: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Your page · the head
      </T>
      <T x={0} y={20} size={17} w={600} a>
        {'<title>Your service in your city</title>'}
      </T>
      <T x={0} y={56} size={16}>
        {'<meta name="description" content="…">'}
      </T>
      <T x={0} y={92} size={16}>
        {'<link rel="canonical" href="…">'}
      </T>
      <T x={0} y={128} size={16}>
        {'<h1>Your service in your city</h1>'}
      </T>
    </>
  ),
  map: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Business Profile
      </T>
      <D d={STORE} />
      <T x={58} y={26} size={20} w={700}>
        Your business
      </T>
      <T x={58} y={54} size={16}>
        Your service · Your city
      </T>
      <A x={296} y={10} w={116} h={36} r={18} label="Open" size={16} />
      <L x1={0} y1={84} x2={412} y2={84} />
      <T x={0} y={120} size={17}>
        Hours, photos and categories, all filled.
      </T>
    </>
  ),
  rich: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        product.html · JSON-LD
      </T>
      <T x={0} y={20} size={17} w={600} a>
        {'"@type": "Product",'}
      </T>
      <T x={0} y={52} size={16}>
        {'"name": "Your product",'}
      </T>
      <T x={0} y={84} size={16}>
        {'"offers": { "price": "24.00" },'}
      </T>
      <T x={0} y={116} size={16}>
        {'"aggregateRating": { "ratingValue": 4.8 }'}
      </T>
    </>
  ),
  answer: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Your page · Prices
      </T>
      <T x={0} y={22} size={19} w={700}>
        How much does it cost?
      </T>
      <T x={0} y={54} size={16}>
        From $90, with a written price before
      </T>
      <T x={0} y={78} size={16}>
        any work starts.
      </T>
      <L x1={0} y1={100} x2={412} y2={100} />
      <T x={0} y={134} size={16} w={600} a>
        User-agent: OAI-SearchBot · Allow: /
      </T>
    </>
  ),
  ad: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Campaign · Search
      </T>
      <T x={0} y={24} size={18} w={700}>
        Keywords
      </T>
      <A x={296} y={0} w={116} h={36} r={18} label="Live" size={16} />
      <T x={0} y={54} size={16}>
        your service near me, your service today
      </T>
      <L x1={0} y1={78} x2={412} y2={78} />
      <T x={0} y={112} size={17} w={600}>
        Budget: $30 a day
      </T>
      <T x={0} y={142} size={16}>
        You pay when someone clicks.
      </T>
    </>
  ),
};

/* The inbox: what each one brings in, 412 x 92 inside the card. */
const NOTICE = {
  web: () => (
    <>
      <D d={lens(22, 24, 13)} />
      <T x={64} y={26} size={20} w={700}>
        Visit from search
      </T>
      <T x={64} y={58} size={18} w={400}>
        Read your prices, then sent the form.
      </T>
    </>
  ),
  map: () => (
    <>
      <D d={pin(26, 50, 0.9)} />
      <T x={64} y={26} size={20} w={700}>
        Call from the map
      </T>
      <T x={64} y={58} size={18} w={400}>
        They tapped Call on your listing.
      </T>
    </>
  ),
  rich: () => (
    <>
      <D d="M8 18H44L40 48H12ZM18 18V12a8 8 0 0 1 16 0V18" />
      <T x={64} y={26} size={20} w={700}>
        Order from a result
      </T>
      <T x={64} y={58} size={18} w={400}>
        They saw the price, then bought.
      </T>
    </>
  ),
  answer: () => (
    <>
      <D d={`${rr(4, 6, 44, 32, 10)}M16 38L14 48L26 38`} />
      <T x={64} y={26} size={20} w={700}>
        Visit from an AI answer
      </T>
      <T x={64} y={58} size={18} w={400}>
        They clicked the source it named.
      </T>
    </>
  ),
  ad: () => (
    <>
      <A x={6} y={8} w={40} h={38} r={8} />
      <T x={64} y={26} size={20} w={700}>
        Form from the ad
      </T>
      <T x={64} y={58} size={18} w={400}>
        One paid click, one lead.
      </T>
    </>
  ),
};

// The screens, smallest first: the order the kinds draw in (`--d`) and
// the order the entrance runs. Captions sit in the Web hero's zones (the
// screens share its frames), short, because the type floors at 12px while
// the drawing shrinks.
const TOUCH = ['notice', 'crm', 'phone', 'desk'];
const DRIFT = { notice: 1.4, crm: 1.2, phone: 1.3, desk: 0.6 };
const CAPS = [
  { key: 'crm', l: 2.5, t: 36.5, w: 28.75, text: ['Your side.', 'What makes each one show.'] },
  { key: 'notice', l: 2.5, t: 63.5, w: 28.75, text: ['Inbox.', 'What each one brings in.'] },
  { key: 'desk', l: 35, t: 73.5, w: 30, text: ['Results page.', 'Where it shows on a laptop.'] },
  { key: 'phone', l: 83.75, t: 83.5, w: 14.5, text: ['Phone.', 'The same search, smaller.'] },
];
const url = (q) => `search?q=${q.replace(/\?/g, '').split(' ').join('+')}`;

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
                {/* The laptop: the results page under its address bar, on a base. */}
                <g data-p="drift-desk">
                  <g {...tp('desk')}>
                    <path className="sw-hero__frm" d={rr(560, 60, 760, 580, 28)} />
                    <path className="sw-hero__thin" d="M560 120H1320" />
                    {[594, 620, 646].map((cx) => (
                      <circle key={cx} className="sw-hero__thin" cx={cx} cy="90" r="7" />
                    ))}
                    <path className="sw-hero__thin" d={rr(690, 74, 470, 32, 16)} />
                    {KINDS.map((x) => (
                      <text key={x.key} className={`sw-hero__url sw-v sw-v--${x.key}`} x="712" y="97" fontSize="19" fontWeight="500">
                        {url(x.query)}
                      </text>
                    ))}
                    <Kinds art={DESK} x={560} y={120} />
                    <path className="sw-hero__frm" d={rr(496, 648, 888, 30, 15)} />
                  </g>
                </g>

                {/* The phone, in front of the laptop's corner. */}
                <g data-p="drift-phone">
                  <g {...tp('phone')}>
                    <path className="sw-hero__frm" d={rr(1340, 300, 230, 480, 40)} />
                    <path className="sw-hero__thin" d="M1430 324H1480" />
                    <Kinds art={PHONE} x={1358} y={350} />
                  </g>
                </g>

                {/* Your side, under its title bar. */}
                <g data-p="drift-crm">
                  <g {...tp('crm')}>
                    <path className="sw-hero__frm" d={rr(40, 60, 460, 270, 24)} />
                    <path className="sw-hero__thin" d={rr(64, 84, 412, 48, 24)} />
                    <path className="sw-hero__thin" d="M86 98L76 108L86 118M96 98L106 108L96 118" />
                    <Kinds art={YOU} x={64} y={150} />
                  </g>
                </g>

                {/* The inbox: what it brings in. */}
                <g data-p="drift-notice">
                  <g {...tp('notice')}>
                    <path className="sw-hero__frm" d={rr(40, 450, 460, 140, 24)} />
                    <text className="sw-hero__now" x="476" y="486" fontSize="15" textAnchor="end">
                      now
                    </text>
                    <Kinds art={NOTICE} x={64} y={474} />
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
