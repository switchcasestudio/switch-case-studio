import { useId, useState } from 'react';
import { makeSearch, Marked } from '../worlds/retrieve';
import { Range, Toggle } from '../worlds/lessonUi';

/* The lessons of the SEO world's stage (2026-10-27), the brand, Web and AI
   worlds' "What we know" for search: one live demo per way to be found,
   in the hero's order. 01 Crawl (a crawler follows links from Home; a page
   no link reaches is not found, a noindex page is not kept), 02 Local (the
   map ranks by relevance and distance, measured on a small town as the
   searcher moves; prominence is named, not faked), 03 Rich results
   (structured data checked against Google's own required properties), 04
   Quoted (an answer engine scores passages; the same page as written and
   as answers), 05 Cost per lead (cost per click over conversion rate).
   The rules are Google's published ones; every figure is arithmetic or
   computed on the visitor's input, nothing is a market statistic. Nothing
   moves until the visitor does something. Each demo is a `bw-lesson`
   plate with the shared controls (worlds/lessonUi.js); the stickers are
   small SVG fact plates. */

const INTER = "Inter, 'Inter Fallback', sans-serif";
const META = { fontFamily: INTER, fontSize: 18, fontWeight: 700, letterSpacing: 2 };

// A fact plate: a kicker, up to four rows and a footer, cream on ink.
function Plate({ kicker, rows, foot, mark = 'dot' }) {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        {kicker}
      </text>
      {rows.map((s, i) => (
        <g key={s} transform={`translate(28 ${74 + i * 46})`}>
          {mark === 'dot' ? (
            <circle cx="11" cy="14" r="11" className="bw-f-orange" />
          ) : (
            <text y="22" className="bw-f-orange" fontFamily={INTER} fontSize="26" fontWeight="800">
              {i + 1}
            </text>
          )}
          <text x={mark === 'dot' ? 38 : 40} y="21" className="bw-f-cream" fontFamily={INTER} fontSize="20" fontWeight="600">
            {s}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        {foot}
      </text>
    </svg>
  );
}

/* ---- 01 Crawl: links from Home ---- */

// A small site: eight pages, the links between them. The offer is on the
// site but nothing links to it.
const PAGES = [
  ['home', 'Home'],
  ['services', 'Services'],
  ['prices', 'Prices'],
  ['about', 'About'],
  ['blog', 'Blog'],
  ['post', 'A post'],
  ['guide', 'A guide'],
  ['offer', 'Spring offer'],
];
const BASE_LINKS = [
  ['home', 'services'],
  ['home', 'prices'],
  ['home', 'about'],
  ['services', 'prices'],
  ['blog', 'post'],
  ['post', 'guide'],
];
const DEPTHS = ['Home', '1 click', '2 clicks', '3 clicks'];

// Breadth first from Home: each page's depth in clicks, or null.
function crawl(links) {
  const depth = { home: 0 };
  const queue = ['home'];
  while (queue.length) {
    const at = queue.shift();
    links.forEach(([a, b]) => {
      if (a === at && depth[b] === undefined) {
        depth[b] = depth[at] + 1;
        queue.push(b);
      }
    });
  }
  return depth;
}

export function Crawl() {
  const [linked, setLinked] = useState(false);
  const [menu, setMenu] = useState(true);
  const [sitemap, setSitemap] = useState(false);
  const [noindex, setNoindex] = useState(true);

  const links = [...BASE_LINKS];
  if (menu) links.push(['home', 'blog']);
  if (linked) links.push(['home', 'offer']);
  const depth = crawl(links);
  const pages = PAGES.map(([key, name]) => {
    const d = depth[key];
    const found = d !== undefined || sitemap;
    return { key, name, d, found, kept: found && !(noindex && key === 'prices') };
  });
  const found = pages.filter((p) => p.found).length;
  const kept = pages.filter((p) => p.kept).length;
  const deepest = Math.max(...pages.map((p) => p.d ?? 0));
  const lost = pages.filter((p) => p.d === undefined);
  const rows = DEPTHS.map((label, d) => ({ label, pages: pages.filter((p) => p.d === d) }));
  rows.push({ label: sitemap ? 'Sitemap only' : 'No link', pages: lost, off: true });

  let say;
  if (lost.length && !sitemap) {
    say = `${lost.map((p) => p.name).join(', ')}: on the site, but no link leads ${lost.length > 1 ? 'to them' : 'there'}, so a crawler never finds ${lost.length > 1 ? 'them' : 'it'}.`;
  } else if (lost.length) {
    say = `The sitemap lists ${lost.map((p) => p.name).join(', ')}, so Google can find ${lost.length > 1 ? 'them' : 'it'}; a link from a page also brings visitors.`;
  } else if (noindex) {
    say = 'Prices is found, but its noindex tag tells Google not to keep it, so it never shows in results.';
  } else {
    say = `Every page found and kept; the deepest is ${deepest} click${deepest === 1 ? '' : 's'} from Home.`;
  }

  return (
    <div className="bw-lesson bw-lesson--dark sw-crawl">
      <div className="sw-crawl__toggles" role="group" aria-label="The site">
        <Toggle on={linked} onClick={() => setLinked((v) => !v)}>
          Offer linked from Home
        </Toggle>
        <Toggle on={menu} onClick={() => setMenu((v) => !v)}>
          Blog in the menu
        </Toggle>
        <Toggle on={sitemap} onClick={() => setSitemap((v) => !v)}>
          Sitemap
        </Toggle>
        <Toggle on={noindex} onClick={() => setNoindex((v) => !v)}>
          noindex on Prices
        </Toggle>
      </div>

      <div className="sw-crawl__body">
        <ol className="sw-crawl__rows" aria-label="Pages by clicks from Home">
          {rows.map((r) => (
            <li key={r.label} className={r.off ? 'is-off' : ''}>
              <span className="sw-crawl__depth">{r.label}</span>
              <span className="sw-crawl__pages">
                {r.pages.length ? (
                  r.pages.map((p) => (
                    <span key={p.key} className={`sw-crawl__page${p.kept ? ' is-kept' : p.found ? ' is-found' : ''}`}>
                      {p.name}
                      {p.found && !p.kept && <em> noindex</em>}
                    </span>
                  ))
                ) : (
                  <span className="sw-crawl__none">none</span>
                )}
              </span>
            </li>
          ))}
        </ol>

        <div className="sw-crawl__counts" aria-hidden="true">
          <p>
            <b>{`${found}/8`}</b>
            <span>found</span>
          </p>
          <p>
            <b>{`${kept}/8`}</b>
            <span>kept in the index</span>
          </p>
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>{`${found} of 8 found, ${kept} kept.`}</strong> {say}
      </p>
    </div>
  );
}

export function MissingPage() {
  return (
    <Plate
      kicker="WHY A PAGE IS MISSING"
      rows={['No link leads to it', 'It says noindex', 'It returns an error', 'robots.txt blocks it']}
      foot="AN AUDIT CHECKS ALL FOUR"
    />
  );
}

/* ---- 02 Local: relevance and distance ---- */

// A small town, 400 x 200 map units (one unit is 0.02 mi): your business
// and eight others, each with the categories on its profile.
const SHOPS = [
  { key: 'you', x: 170, y: 70, cats: ['bakery'] },
  { key: 'a', x: 60, y: 150, cats: ['bakery', 'cake'] },
  { key: 'b', x: 250, y: 150, cats: ['bakery', 'coffee'] },
  { key: 'c', x: 120, y: 40, cats: ['cake'] },
  { key: 'd', x: 300, y: 60, cats: ['coffee'] },
  { key: 'e', x: 360, y: 160, cats: ['bakery'] },
  { key: 'f', x: 30, y: 60, cats: ['coffee'] },
  { key: 'g', x: 340, y: 30, cats: ['cake'] },
  { key: 'h', x: 290, y: 185, cats: ['bakery'] },
];
const QUERIES = [
  ['bakery', 'bakery near me'],
  ['cake', 'cake shop near me'],
  ['coffee', 'coffee near me'],
];
const MI = 0.02;
const STREET_Y = 110;
const shopName = (s) => (s.key === 'you' ? 'Your business' : `Business ${s.key.toUpperCase()}`);

export function Local() {
  const id = useId();
  const [q, setQ] = useState('bakery');
  const [at, setAt] = useState(45);
  const [extra, setExtra] = useState({ cake: false, coffee: false });
  const sx = 20 + at * 3.6;
  const cats = (s) => (s.key === 'you' ? ['bakery', ...Object.keys(extra).filter((k) => extra[k])] : s.cats);
  const ranked = SHOPS.map((s) => ({ ...s, rel: cats(s).includes(q), mi: Math.hypot(s.x - sx, s.y - STREET_Y) * MI }))
    .filter((s) => s.rel)
    .sort((a, b) => a.mi - b.mi);
  const top = ranked.slice(0, 3);
  const place = top.findIndex((s) => s.key === 'you');
  const youRel = cats(SHOPS[0]).includes(q);
  const query = QUERIES.find(([k]) => k === q)[1];
  const where = at < 34 ? 'west' : at > 66 ? 'east' : 'in the middle';

  let say;
  if (!youRel) say = `Your profile doesn't list "${query.replace(' near me', '')}", so you aren't relevant to the search at any distance.`;
  else if (place < 0) say = `You are relevant, but ${top.length} others are closer to where they stand.`;
  else say = `You are relevant and ${top[place].mi.toFixed(1)} mi away: ${['first', 'second', 'third'][place]} of the three.`;

  return (
    <div className="bw-lesson bw-lesson--dark sw-local">
      <div className="sw-local__qs" role="group" aria-label="The search">
        {QUERIES.map(([k, label]) => (
          <button key={k} type="button" className={`bw-lesson__chip${q === k ? ' is-on' : ''}`} aria-pressed={q === k} onClick={() => setQ(k)}>
            {label}
          </button>
        ))}
      </div>

      <div className="sw-local__body">
        <svg className="sw-local__map" viewBox="0 0 400 200" aria-hidden="true" focusable="false">
          <g className="sw-local__streets">
            <path d={`M0 ${STREET_Y}H400`} />
            <path d="M90 0V200M210 0V200M330 0V200" />
            <path d="M0 30C120 50 260 10 400 40" />
          </g>
          {top.map((s) => (
            <path key={`l-${s.key}`} className="sw-local__reach" d={`M${sx} ${STREET_Y}L${s.x} ${s.y}`} />
          ))}
          {SHOPS.map((s) => {
            const n = top.findIndex((t) => t.key === s.key);
            const cls = `sw-local__shop${s.key === 'you' ? ' is-you' : ''}${cats(s).includes(q) ? ' is-rel' : ''}${n >= 0 ? ' is-top' : ''}`;
            return (
              <g key={s.key} className={cls} transform={`translate(${s.x} ${s.y})`}>
                <circle r={n >= 0 ? 11 : 6} />
                {n >= 0 && (
                  <text y="4.5" textAnchor="middle" fontFamily={INTER} fontSize="13" fontWeight="800">
                    {n + 1}
                  </text>
                )}
              </g>
            );
          })}
          <g className="sw-local__you-are" transform={`translate(${sx} ${STREET_Y})`}>
            <circle r="13" />
            <circle r="4" />
          </g>
        </svg>

        <ol className="sw-local__top" aria-label={`The map's top three for ${query}`}>
          {top.map((s) => (
            <li key={s.key} className={s.key === 'you' ? 'is-you' : ''}>
              <span>{shopName(s)}</span>
              <b>{`${s.mi.toFixed(1)} mi`}</b>
            </li>
          ))}
        </ol>
      </div>

      <div className="sw-local__ctls">
        <Range
          id={`${id}-at`}
          label="Where they search"
          value={at}
          min={0}
          max={100}
          show={where === 'in the middle' ? 'middle' : where}
          text={`Standing ${where} of town`}
          onChange={setAt}
        />
        <div className="sw-local__cats" role="group" aria-label="Your profile also lists">
          <span className="bw-ui__lab">Your profile also lists</span>
          <Toggle on={extra.cake} onClick={() => setExtra((e) => ({ ...e, cake: !e.cake }))}>
            Cake shop
          </Toggle>
          <Toggle on={extra.coffee} onClick={() => setExtra((e) => ({ ...e, coffee: !e.coffee }))}>
            Coffee shop
          </Toggle>
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>{`"${query}"`}</strong> {say}
        {youRel && ' Prominence (reviews, links) moves it too.'}
      </p>
    </div>
  );
}

export function LocalFactors() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        HOW GOOGLE RANKS THE MAP
      </text>
      {[
        ['Relevance', 'how well you match'],
        ['Distance', 'how far from them'],
        ['Prominence', 'reviews, links'],
      ].map(([a, b], i) => (
        <g key={a} transform={`translate(28 ${70 + i * 56})`}>
          <text y="20" className="bw-f-orange" fontFamily={INTER} fontSize="22" fontWeight="800">
            {a}
          </text>
          <text y="44" className="bw-f-cream" fontFamily={INTER} fontSize="18" opacity="0.8">
            {b}
          </text>
        </g>
      ))}
      <text x="28" y="262" className="bw-f-cream" fontFamily={INTER} fontSize="15" fontWeight="600">
        &ldquo;There&rsquo;s no way to pay for a better local ranking.&rdquo;
      </text>
      <text x="28" y="284" className="bw-f-cream" {...META} fontSize="14">
        GOOGLE BUSINESS PROFILE HELP
      </text>
    </svg>
  );
}

/* ---- 03 Rich results: Google's required properties ---- */

// The properties each type takes here, and Google's rule for each:
// Product snippets need `name` and one of `offers`, `aggregateRating` (or
// `review`); LocalBusiness needs `name` and `address`, and gets no stars
// for reviews the business controls about itself.
const TYPES = {
  product: {
    label: 'Product page',
    type: 'Product',
    props: [
      ['name', 'name', '"name": "Your product"'],
      ['offers', 'offers', '"offers": { "price": "24.00", "priceCurrency": "USD" }'],
      ['rating', 'aggregateRating', '"aggregateRating": { "ratingValue": 4.8, "reviewCount": 126 }'],
    ],
    start: { name: true, offers: false, rating: false },
  },
  business: {
    label: 'Your business page',
    type: 'LocalBusiness',
    props: [
      ['name', 'name', '"name": "Your business"'],
      ['address', 'address', '"address": { "addressLocality": "Your city" }'],
      ['rating', 'aggregateRating', '"aggregateRating": { "ratingValue": 4.8, "reviewCount": 126 }'],
    ],
    start: { name: true, address: true, rating: true },
  },
};

function judge(kind, on) {
  if (kind === 'product') {
    const checks = [
      ['name', on.name],
      ['offers or aggregateRating', on.offers || on.rating],
    ];
    const ok = checks.every(([, v]) => v);
    return {
      checks,
      ok,
      stars: ok && on.rating,
      price: ok && on.offers,
      head: ok ? 'Eligible for a product snippet.' : 'Not eligible.',
      say: ok
        ? 'Google decides whether it shows; nothing guarantees it.'
        : `A product snippet needs ${on.name ? 'offers or aggregateRating' : 'a name'}.`,
    };
  }
  const checks = [
    ['name', on.name],
    ['address', on.address],
  ];
  const ok = checks.every(([, v]) => v);
  if (!ok) return { checks, ok, head: 'Not valid.', say: `LocalBusiness needs ${on.name ? 'an address' : 'a name'}.` };
  return on.rating
    ? { checks, ok, head: 'Valid, but no stars.', say: "Google doesn't show them when a business runs the reviews about itself." }
    : { checks, ok, head: 'Valid.', say: 'It tells Google your name and where you are; it adds no stars.' };
}

export function Rich() {
  const [kind, setKind] = useState('product');
  const [on, setOn] = useState({ product: TYPES.product.start, business: TYPES.business.start });
  const t = TYPES[kind];
  const cur = on[kind];
  const v = judge(kind, cur);
  const flip = (k) => setOn((o) => ({ ...o, [kind]: { ...o[kind], [k]: !o[kind][k] } }));
  const lines = [`"@type": "${t.type}"`, ...t.props.filter(([k]) => cur[k]).map(([, , line]) => line)];

  return (
    <div className="bw-lesson bw-lesson--light sw-rich">
      <div className="sw-rich__bar">
        <div className="sw-rich__kinds" role="group" aria-label="The page">
          {Object.keys(TYPES).map((k) => (
            <button key={k} type="button" className={`bw-lesson__chip${kind === k ? ' is-on' : ''}`} aria-pressed={kind === k} onClick={() => setKind(k)}>
              {TYPES[k].label}
            </button>
          ))}
        </div>
        <div className="sw-rich__props" role="group" aria-label="Properties in the markup">
          {t.props.map(([k, label]) => (
            <Toggle key={k} on={cur[k]} onClick={() => flip(k)}>
              {label}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="sw-rich__body">
        <pre className="sw-rich__code" aria-label="The page's structured data">{`{\n  ${lines.join(',\n  ')}\n}`}</pre>
        <div className="sw-rich__out">
          <div className="sw-rich__result">
            <span className="sw-rich__url">{kind === 'product' ? 'yourbusiness.com › Shop › Your product' : 'yourbusiness.com'}</span>
            <span className="sw-rich__title">{kind === 'product' ? 'Your product, made to order' : 'Your business, in your city'}</span>
            {v.stars && (
              <span className="sw-rich__stars">
                <i aria-hidden="true">★★★★★</i> 4.8 (126)
              </span>
            )}
            {v.price && <span className="sw-rich__price">$24.00</span>}
            {!v.stars && !v.price && <span className="sw-rich__plain">A plain result: title and description.</span>}
          </div>
          <ul className="sw-rich__checks" aria-label="Google's required properties">
            {v.checks.map(([label, ok]) => (
              <li key={label} className={ok ? 'is-ok' : 'is-no'}>
                <i aria-hidden="true">{ok ? '✓' : '✕'}</i> {label}
                <span className="sr-only">{ok ? ': present' : ': missing'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>{v.head}</strong> {v.say}
      </p>
    </div>
  );
}

export function RichRules() {
  return (
    <Plate
      kicker="GOOGLE'S RULES"
      rows={['Product: name + price or rating', 'Business: name + address', 'No stars on your own reviews', 'Eligible is not a promise']}
      foot="GOOGLE SEARCH CENTRAL"
    />
  );
}

/* ---- 04 Quoted: passages, as written and as answers ---- */

// The same page twice: as it is often written, and as answers. An answer
// engine quotes the passage that answers the question, from whichever
// version is live.
const WRITTEN = [
  { key: 'welcome', title: 'Welcome', text: 'Welcome to Your business, where quality and care come first. We are passionate about every job, big or small.' },
  { key: 'promise', title: 'Our promise', text: 'Our team brings years of experience and a commitment to excellence to your home.' },
  { key: 'contact', title: 'Get in touch', text: 'Contact us today to learn more about what we can do for you. We look forward to hearing from you.' },
];
const ANSWERS = [
  { key: 'prices', title: 'Prices', text: 'How much does it cost? Most jobs cost $90 to $300, and you get a written price before any work starts.' },
  { key: 'hours', title: 'Hours', text: 'Do you work on weekends? Yes: Monday to Saturday, 8 am to 6 pm. Sunday is for emergencies only.' },
  { key: 'speed', title: 'Response', text: 'How fast can you come? The same day for calls before 2 pm, otherwise the next morning.' },
];
const SEARCH = { written: makeSearch(WRITTEN), answers: makeSearch(ANSWERS) };
const QUOTE_LINE = 0.25;
const QUESTIONS = ['How much does it cost?', 'Do you work on weekends?', 'How fast can you come?'];

export function Quoted() {
  const id = useId();
  const [q, setQ] = useState(QUESTIONS[0]);
  const [answers, setAnswers] = useState(false);
  const ranked = SEARCH[answers ? 'answers' : 'written'](q);
  const top = ranked[0];
  const asked = q.trim().length > 0;
  const quoted = asked && top.score >= QUOTE_LINE;

  return (
    <div className="bw-lesson bw-lesson--light sw-quote">
      <div className="sw-quote__bar">
        <form className="sw-quote__ask" onSubmit={(e) => e.preventDefault()}>
          <label className="bw-ui__lab" htmlFor={`${id}-q`}>
            Ask an AI
          </label>
          <input id={`${id}-q`} className="sw-quote__input" type="text" value={q} maxLength={80} autoComplete="off" onChange={(e) => setQ(e.target.value)} />
        </form>
        <Toggle on={answers} onClick={() => setAnswers((v) => !v)}>
          Written as answers
        </Toggle>
      </div>
      <div className="sw-quote__chips" role="group" aria-label="Questions to try">
        {QUESTIONS.map((a) => (
          <button key={a} type="button" className={`bw-lesson__chip${q === a ? ' is-on' : ''}`} aria-pressed={q === a} onClick={() => setQ(a)}>
            {a}
          </button>
        ))}
      </div>

      <div className="sw-quote__body">
        <ol className="sw-quote__rank" aria-label="How well each passage on your page matches">
          {ranked.map((d) => (
            <li key={d.key} className={quoted && d.key === top.key ? 'is-top' : ''}>
              <span>{d.title}</span>
              <i style={{ '--w': `${Math.min(1, d.score / 0.7) * 100}%` }} aria-hidden="true" />
              <b>{d.score.toFixed(2)}</b>
            </li>
          ))}
        </ol>
        <div className={`sw-quote__answer${quoted ? '' : ' is-out'}`}>
          {quoted ? (
            <>
              <p className="sw-quote__quote">
                <Marked text={top.text} q={q} />
              </p>
              <p className="sw-quote__src">Source: yourbusiness.com · {top.title}</p>
            </>
          ) : (
            <>
              <p className="sw-quote__quote">{asked ? 'Nothing on your page answers it.' : 'Ask it something.'}</p>
              <p className="sw-quote__src">{asked ? 'It quotes another site.' : 'No source yet'}</p>
            </>
          )}
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>{asked ? `Best passage: ${top.title}, ${top.score.toFixed(2)}.` : 'No question yet.'}</strong>{' '}
        {asked &&
          (quoted
            ? 'It answers on its own, so it gets quoted, with your name on it.'
            : `Under ${QUOTE_LINE}: ${answers ? 'no passage answers this one.' : 'the copy never says it. Write it as answers.'}`)}
      </p>
    </div>
  );
}

export function QuotablePassage() {
  return (
    <Plate
      kicker="A PASSAGE THAT GETS QUOTED"
      rows={['The question, as asked', 'The answer, first', 'The facts: prices, hours', 'One question per passage']}
      foot="AND LET THE CRAWLERS IN"
      mark="num"
    />
  );
}

/* ---- 05 Cost per lead: the click and the page ---- */

const money = (n) =>
  n < 10 ? `$${n.toFixed(2)}` : `$${Math.round(n).toLocaleString('en-US')}`;
const leadsOf = (b, c, r) => (b / c) * (r / 100);
const leads = (n) => {
  if (n < 1) return 'under 1 lead';
  const v = n < 10 ? n.toFixed(1).replace(/\.0$/, '') : Math.round(n).toLocaleString('en-US');
  return `${v} ${v === '1' ? 'lead' : 'leads'}`;
};

export function CostPerLead() {
  const id = useId();
  const [budget, setBudget] = useState(1500);
  const [cpc, setCpc] = useState(3);
  const [rate, setRate] = useState(3);
  const cols = [
    ['Now', budget, rate],
    ['Budget x2', budget * 2, rate],
    ['Conversion x2', budget, Math.min(rate * 2, 100)],
  ].map(([label, b, r]) => ({ label, b, r, leads: leadsOf(b, cpc, r), cpl: cpc / (r / 100) }));
  const most = Math.max(...cols.map((c) => c.cpl));

  return (
    <div className="bw-lesson bw-lesson--dark sw-cpl">
      <div className="sw-cpl__ctls">
        <Range
          id={`${id}-b`}
          label="Budget a month"
          value={budget}
          min={300}
          max={10000}
          step={100}
          show={money(budget)}
          text={`${money(budget)} a month`}
          onChange={setBudget}
        />
        <Range
          id={`${id}-c`}
          label="Cost per click"
          value={cpc}
          min={0.5}
          max={20}
          step={0.25}
          show={`$${cpc.toFixed(2)}`}
          text={`$${cpc.toFixed(2)} a click`}
          onChange={setCpc}
        />
        <Range
          id={`${id}-r`}
          label="Page converts"
          value={rate}
          min={0.5}
          max={15}
          step={0.5}
          show={`${rate}%`}
          text={`${rate} percent of visitors become leads`}
          onChange={setRate}
        />
      </div>

      <div className="sw-cpl__cols" aria-hidden="true">
        {cols.map((c, i) => (
          <div key={c.label} className={`sw-cpl__col${i === 2 ? ' is-page' : ''}`}>
            <span className="sw-cpl__label">{c.label}</span>
            <b>{money(c.cpl)}</b>
            <span>a lead</span>
            <i style={{ '--h': `${(c.cpl / most) * 100}%` }} />
            <span className="sw-cpl__sub">
              {`${leads(c.leads)} · ${money(c.b)}`}
            </span>
          </div>
        ))}
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          ${cpc.toFixed(2)} a click, {rate}% converting: {money(cols[0].cpl)} a lead.
        </strong>{' '}
        {`Twice the leads cost ${money(cols[1].b)} by budget, or ${money(cols[2].b)} by a page that converts twice as well.`}
      </p>
    </div>
  );
}

// Cost per lead = cost per click / conversion rate, at $3 a click.
export function LeadMath() {
  const rows = [
    ['$3 a click', '2% convert', '$150'],
    ['$3 a click', '4% convert', '$75'],
    ['$3 a click', '8% convert', '$38'],
  ];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        COST PER LEAD
      </text>
      {rows.map(([a, b, c], i) => (
        <g key={b} transform={`translate(28 ${70 + i * 62})`}>
          <text y="16" className="bw-f-cream" fontFamily={INTER} fontSize="18" fontWeight="700">
            {a}
          </text>
          <text y="38" className="bw-f-cream" fontFamily={INTER} fontSize="18" opacity="0.75">
            {b}
          </text>
          <text x="344" y="34" className="bw-f-orange" fontFamily={INTER} fontSize="34" fontWeight="800" letterSpacing="-1" textAnchor="end">
            {c}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        CLICK PRICE / CONVERSION
      </text>
    </svg>
  );
}
