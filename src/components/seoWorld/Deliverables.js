import { useId, useState } from 'react';
import { TITLE_MAX, DESC_MAX } from '../../utils/seoText';

/* The SEO & AI Search deliverables (2026-10-24; since 2026-10-27 for "Your
   business", no made-up client): the AI world's grid, each demo a real
   control with a real state, one per thing the sprint ships. Write a title
   and watch the result cut it; turn on share tags; fold sixteen addresses
   into one; fix a sample page's LCP part by part; set AI search and AI
   training apart in robots.txt; press the buttons and see which count as
   leads. The rules are Google's, OpenAI's and GA4's own. */

// Search results cut long titles and descriptions; the budgets are the
// house's own (src/utils/seoText.js), the cut is at a word with an ellipsis.
const cut = (text, max) => {
  if (text.length <= max) return text;
  const at = text.lastIndexOf(' ', max - 1);
  return `${text.slice(0, at > max * 0.6 ? at : max - 1).replace(/[\s,;:.|]+$/, '')}…`;
};

function SnippetDemo() {
  const id = useId();
  const [title, setTitle] = useState('Your service in your city, the same day, with a written price | Your business');
  const [desc, setDesc] = useState(
    'Your business does your service across your city, the same day for calls before 2 pm, with a written price before any work starts. Open Monday to Saturday, 8 am to 6 pm.',
  );
  const tOver = title.length > TITLE_MAX;
  const dOver = desc.length > DESC_MAX;
  return (
    <div className="sw-snip">
      <label className="sw-snip__field" htmlFor={`${id}-t`}>
        <span>
          Title <b className={tOver ? 'is-over' : ''}>{`${title.length} / ${TITLE_MAX}`}</b>
        </span>
        <input id={`${id}-t`} value={title} maxLength={110} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="sw-snip__field" htmlFor={`${id}-d`}>
        <span>
          Description <b className={dOver ? 'is-over' : ''}>{`${desc.length} / ${DESC_MAX}`}</b>
        </span>
        <textarea id={`${id}-d`} rows={2} value={desc} maxLength={260} onChange={(e) => setDesc(e.target.value)} />
      </label>
      <div className="sw-result" aria-label="How the result shows in search">
        <span className="sw-result__url">yourbusiness.com</span>
        <span className="sw-result__title">{cut(title, TITLE_MAX)}</span>
        <span className="sw-result__desc">{cut(desc, DESC_MAX)}</span>
      </div>
    </div>
  );
}

/* Share cards: Open Graph tags on or off, and the link as a chat shows it.
   Without them the app builds what it can from the page. */
function ShareDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="sw-share">
      <div className="sw-toggle">
        <button type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)}>
          <span className="sr-only">Open Graph tags</span>
        </button>
        <span aria-hidden="true">Open Graph tags</span>
      </div>
      <div className="sw-share__chat" aria-label="The link, shared in a chat">
        <p className="sw-share__msg">Is this them?</p>
        {on ? (
          <div className="sw-share__card">
            <span className="sw-share__img" aria-hidden="true">
              <b>Your business</b>
            </span>
            <span className="sw-share__text">
              <span className="sw-share__title">Your service in your city, the same day</span>
              <span className="sw-share__site">yourbusiness.com</span>
            </span>
          </div>
        ) : (
          <div className="sw-share__card is-bare">
            <span className="sw-share__text">
              <span className="sw-share__title">Home | Your business</span>
              <span className="sw-share__site">yourbusiness.com</span>
            </span>
          </div>
        )}
      </div>
      <pre className="sw-code" aria-label="The page's share tags">
        {on
          ? '<meta property="og:title" content="…">\n<meta property="og:image" content="…">'
          : '<!-- no Open Graph tags: the app guesses -->'}
      </pre>
    </div>
  );
}

/* One address per page: each way a URL can vary doubles the copies a
   crawler can find; a redirect folds three of them, the canonical tag
   names the one to keep for the fourth. */
const VARIANTS = [
  ['https', 'https only', ['http://', 'https://'], 'https://'],
  ['host', 'One host', ['www.', ''], ''],
  ['slash', 'One slash', ['', '/'], '/'],
  ['utm', 'Canonical tag', ['', '?utm_source=mail'], ''],
];

function AddressDemo() {
  const [fix, setFix] = useState({ https: false, host: false, slash: false, utm: false });
  let urls = [''];
  VARIANTS.forEach(([k, , opts, one], i) => {
    const parts = fix[k] ? [one] : opts;
    urls = urls.flatMap((u) => parts.map((p) => (i === 1 ? `${u}${p}yourbusiness.com/prices` : `${u}${p}`)));
  });
  const n = urls.length;
  return (
    <div className="sw-addr">
      <p className="sw-addr__read" aria-live="polite">
        <b>{n}</b> {n === 1 ? 'address' : 'addresses'} <span>for one page</span>
      </p>
      <ul className="sw-addr__list" aria-hidden="true">
        {urls.slice(0, 3).map((u) => (
          <li key={u}>{u}</li>
        ))}
        {n > 3 && <li className="is-more">{`and ${n - 3} more`}</li>}
      </ul>
      <div className="sw-addr__fixes" role="group" aria-label="Fixes">
        {VARIANTS.map(([k, label]) => (
          <button key={k} type="button" className={`aw-pill${fix[k] ? ' is-on' : ''}`} aria-pressed={fix[k]} onClick={() => setFix((f) => ({ ...f, [k]: !f[k] }))}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Speed: a sample page's Largest Contentful Paint in its four parts (time
   to first byte, load delay, load time, render delay), three fixes that
   each shorten one part, read against Google's lines (good at 2.5 s or
   less, poor over 4 s). The image's load time scales with its weight. */
const PARTS = [
  ['ttfb', 'Server', 0.8, null],
  ['delay', 'Found late', 1.2, ['preload', 'Preload the image', 0.1]],
  ['load', 'Image download', 2.0, ['img', 'Compress the image', 0.5]],
  ['render', 'Blocked render', 0.8, ['defer', 'Defer scripts', 0.1]],
];
const LCP_MAX = 6;

function VitalsDemo() {
  const [on, setOn] = useState({ preload: false, img: false, defer: false });
  const parts = PARTS.map(([k, label, s, fixIt]) => ({ k, label, s: fixIt && on[fixIt[0]] ? fixIt[2] : s }));
  const lcp = parts.reduce((t, p) => t + p.s, 0);
  const verdict = lcp <= 2.5 ? 'Good' : lcp <= 4 ? 'Needs work' : 'Poor';
  return (
    <div className="sw-vitals">
      <p className="sw-vitals__read" aria-live="polite">
        <span>LCP</span> {lcp.toFixed(1)} s <em>{verdict}</em>
      </p>
      <div className="sw-vitals__bar" aria-hidden="true">
        {parts.map((p) => (
          <b key={p.k} className={`is-${p.k}`} style={{ width: `${(p.s / LCP_MAX) * 100}%` }} />
        ))}
        <i style={{ left: `${(2.5 / LCP_MAX) * 100}%` }} />
        <i style={{ left: `${(4 / LCP_MAX) * 100}%` }} />
      </div>
      <div className="sw-vitals__scale" aria-hidden="true">
        <span>0 s</span>
        <span style={{ left: `${(2.5 / LCP_MAX) * 100}%` }}>2.5</span>
        <span style={{ left: `${(4 / LCP_MAX) * 100}%` }}>4</span>
      </div>
      <ul className="sw-vitals__parts" aria-label="The four parts of LCP">
        {parts.map((p) => (
          <li key={p.k} className={`is-${p.k}`}>
            <i aria-hidden="true" />
            {p.label} <b>{`${p.s.toFixed(1)} s`}</b>
          </li>
        ))}
      </ul>
      <div className="sw-vitals__fixes" role="group" aria-label="Speed fixes">
        {PARTS.filter((p) => p[3]).map(([, , , [k, label]]) => (
          <button key={k} type="button" className={`aw-pill${on[k] ? ' is-on' : ''}`} aria-pressed={on[k]} onClick={() => setOn((o) => ({ ...o, [k]: !o[k] }))}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* AI crawlers: search and training are separate bots, set separately.
   OAI-SearchBot and PerplexityBot read for search answers; GPTBot and
   Google-Extended for training, and Google-Extended does not touch Google
   Search. */
function CrawlerDemo() {
  const [search, setSearch] = useState(true);
  const [train, setTrain] = useState(false);
  const rule = (v) => (v ? 'Allow: /' : 'Disallow: /');
  const say = search
    ? `AI search can read and quote the site; ${train ? 'models can also train on it.' : 'models do not train on it.'}`
    : `ChatGPT search and Perplexity cannot read the site, so they cannot quote it${train ? ', though models can still train on it' : ''}.`;
  return (
    <div className="sw-robots">
      <div className="sw-robots__switches">
        <div className="sw-toggle">
          <button type="button" role="switch" aria-checked={search} onClick={() => setSearch((v) => !v)}>
            <span className="sr-only">Let AI search crawlers read the site</span>
          </button>
          <span aria-hidden="true">AI search</span>
        </div>
        <div className="sw-toggle">
          <button type="button" role="switch" aria-checked={train} onClick={() => setTrain((v) => !v)}>
            <span className="sr-only">Let AI training crawlers read the site</span>
          </button>
          <span aria-hidden="true">AI training</span>
        </div>
      </div>
      <pre className="sw-code" aria-label="robots.txt">{`# robots.txt\nUser-agent: OAI-SearchBot\nUser-agent: PerplexityBot\n${rule(search)}\n\nUser-agent: GPTBot\nUser-agent: Google-Extended\n${rule(train)}`}</pre>
      <p className="sw-robots__note" aria-live="polite">
        {say} Google Search is not affected either way.
      </p>
    </div>
  );
}

/* Key events: the visitor's own presses on a small page, counted the way
   GA4 counts them. Every press is an event; the ones marked key events
   (a call, a form) are the leads. */
const ACTS = [
  ['call', 'Call', true],
  ['form', 'Send the form', true],
  ['prices', 'Read prices', false],
];

function EventsDemo() {
  const [n, setN] = useState({ call: 0, form: 0, prices: 0 });
  const events = n.call + n.form + n.prices;
  const keys = n.call + n.form;
  return (
    <div className="sw-events">
      <div className="sw-events__page" role="group" aria-label="Your page">
        <span className="sw-events__site">yourbusiness.com</span>
        <div className="sw-events__acts">
          {ACTS.map(([k, label]) => (
            <button key={k} type="button" className="aw-pill" onClick={() => setN((c) => ({ ...c, [k]: c[k] + 1 }))}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <ul className="sw-events__report" aria-label="The report">
        {ACTS.map(([k, , key]) => (
          <li key={k} className={key ? 'is-key' : ''}>
            <span>{k === 'call' ? 'phone_call' : k === 'form' ? 'form_submit' : 'page_view'}</span>
            {key && <em>key event</em>}
            <b>{n[k]}</b>
          </li>
        ))}
      </ul>
      <p className="sw-events__sum" aria-live="polite">
        <b>{keys}</b> {keys === 1 ? 'lead' : 'leads'} from {events} {events === 1 ? 'event' : 'events'}
      </p>
    </div>
  );
}

const TILES = [
  [SnippetDemo, '', 'Titles and descriptions.', 'Write one; the preview cuts it where search results usually do.'],
  [ShareDemo, 'aw-tone--mint', 'Share cards.', 'With Open Graph tags a shared link shows the picture and words you chose; without them, the app guesses.'],
  [AddressDemo, 'aw-tone--lilac', 'One address per page.', 'Each fix halves the copies Google can find; the canonical tag names the one to keep.'],
  [VitalsDemo, 'aw-tone--orange', 'Speed.', "A sample page's load in LCP's four parts. The lines are Google's: good at 2.5 s or less, poor over 4 s."],
  [CrawlerDemo, 'aw-tone--blue', 'AI crawler access.', 'Search crawlers read to quote you, training crawlers to train models; robots.txt sets each apart.'],
  [EventsDemo, 'aw-tone--pink', 'Key events.', 'Press the buttons: calls and forms count as leads, reading a page does not.'],
];

export default function Deliverables() {
  return (
    <section className="bw-grid" aria-labelledby="sw-grid-title">
      <h2 id="sw-grid-title" className="bw-grid__title">
        The work runs on this page.
      </h2>
      <ul className="bw-grid__cards">
        {TILES.map(([Demo, tone, name, cap]) => (
          <li key={name} className="bw-grid__card">
            <div className="bw-grid__stage">
              <div className={`bw-grid__demo bw-grid__demo--tool${tone ? ` ${tone}` : ''}`} style={{ aspectRatio: '4/3' }}>
                <Demo />
              </div>
            </div>
            <p className="bw-grid__cap">
              <strong>{name}</strong> {cap}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
