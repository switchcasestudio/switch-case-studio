import { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import LiveArt from '../worlds/LiveArt';
import { ReportChart } from './tiles/art';
import { ReportChart as reportLive } from './tiles/live';
import { TITLE_MAX, DESC_MAX } from '../../utils/seoText';

const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The SEO & AI Search deliverables (2026-10-24): the AI world's grid, each
   demo a real control with a real state. Write a title and watch the
   result cut it; ask an AI and see it cite the page, or say it cannot;
   flip structured data; toggle speed fixes against Google's thresholds;
   open the site to AI crawlers in robots.txt; read the report line. The
   business in the demos (Rose City Plumbing) is made up. */

// Search results cut long titles and descriptions; the budgets are the
// house's own (src/utils/seoText.js), the cut is at a word with an ellipsis.
const cut = (text, max) => {
  if (text.length <= max) return text;
  const at = text.lastIndexOf(' ', max - 1);
  return `${text.slice(0, at > max * 0.6 ? at : max - 1).replace(/[\s,;:.|]+$/, '')}…`;
};

function SnippetDemo() {
  const id = useId();
  const [title, setTitle] = useState('Emergency Plumber in Portland, Open 24/7 | Rose City Plumbing');
  const [desc, setDesc] = useState(
    'Licensed plumbers on call day and night across Portland. Burst pipes, water heaters and blocked drains, fixed the same day, with a written price before any work starts.',
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
        <span className="sw-result__url">rosecityplumbing.com</span>
        <span className="sw-result__title">{cut(title, TITLE_MAX)}</span>
        <span className="sw-result__desc">{cut(desc, DESC_MAX)}</span>
      </div>
    </div>
  );
}

/* An AI answer engine reading a made-up plumber's site. It cites the page
   it answers from; the last question is not on any page, so it says so. */
const QA = [
  ['Same day?', 'Do you fix leaks the same day?', 'Yes, for calls that come in before 2 pm.', 'rosecityplumbing.com/same-day'],
  ['Upfront price?', 'Do I get a price before you start?', 'Yes, a written price before any work starts.', 'rosecityplumbing.com/pricing'],
  ['Beaverton?', 'Do you come out to Beaverton?', 'Yes, Beaverton and Tigard are in the service area.', 'rosecityplumbing.com/areas'],
  ['Sundays?', 'Are you open on Sundays?', "That isn't on the site, so I can't cite it. Put it on a page and I can.", null],
];

function AnswerDemo() {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(true);
  const aRef = useRef(null);
  useEffect(() => {
    const el = aRef.current;
    if (!el) return undefined;
    const full = QA[i][2];
    if (reduced()) {
      el.textContent = full;
      setDone(true);
      return undefined;
    }
    const proxy = { n: 0 };
    el.textContent = '';
    setDone(false);
    const tw = gsap.to(proxy, {
      n: full.length,
      duration: full.length * 0.022,
      ease: 'none',
      delay: 0.35,
      onUpdate: () => {
        el.textContent = full.slice(0, Math.round(proxy.n));
      },
      onComplete: () => setDone(true),
    });
    return () => tw.kill();
  }, [i]);
  const source = QA[i][3];
  return (
    <div className="aw-chat sw-answer">
      <p className="aw-chat__q">{QA[i][1]}</p>
      <p className="aw-chat__a" aria-live="polite">
        <span ref={aRef}>{QA[i][2]}</span>
        <span className={`sw-cite${source ? '' : ' sw-cite--none'}${done ? ' is-on' : ''}`}>
          {source ? `Source: ${source}` : 'No source'}
        </span>
      </p>
      <div className="aw-chat__pills" role="group" aria-label="Ask the AI">
        {QA.map((row, k) => (
          <button key={row[0]} type="button" className={`aw-pill${k === i ? ' is-on' : ''}`} aria-pressed={k === i} onClick={() => setI(k)}>
            {row[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Structured data: a BreadcrumbList on or off, and what the result shows. */
function SchemaDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="sw-schema">
      <div className="sw-toggle">
        <button type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)}>
          <span className="sr-only">Breadcrumb structured data</span>
        </button>
        <span aria-hidden="true">BreadcrumbList</span>
      </div>
      <div className="sw-result sw-result--small">
        <span className="sw-result__url">{on ? 'rosecityplumbing.com › Services › Water heaters' : 'rosecityplumbing.com/p?id=4512&cat=7'}</span>
        <span className="sw-result__title">Water Heater Repair and Install in Portland</span>
      </div>
      <pre className="sw-code" aria-label="The page's structured data">
        {on
          ? '{\n  "@type": "BreadcrumbList",\n  "itemListElement": [Services, Water heaters]\n}'
          : '<!-- no structured data -->'}
      </pre>
    </div>
  );
}

/* Speed: three fixes on a made-up page and its Largest Contentful Paint,
   read against Google's published lines (good at 2.5 s or less, poor over
   4 s). */
const FIXES = [
  ['img', 'Compress images', 1.6],
  ['lazy', 'Lazy-load', 0.5],
  ['defer', 'Defer scripts', 0.8],
];
const LCP_BASE = 4.8;
const LCP_MAX = 6;

function VitalsDemo() {
  const [on, setOn] = useState({ img: false, lazy: false, defer: false });
  const lcp = FIXES.reduce((t, [k, , save]) => (on[k] ? t - save : t), LCP_BASE);
  const verdict = lcp <= 2.5 ? 'Good' : lcp <= 4 ? 'Needs work' : 'Poor';
  return (
    <div className="sw-vitals">
      <p className="sw-vitals__read" aria-live="polite">
        <span>LCP</span> {lcp.toFixed(1)} s <em>{verdict}</em>
      </p>
      <div className="sw-vitals__bar" aria-hidden="true">
        <i style={{ left: `${(2.5 / LCP_MAX) * 100}%` }} />
        <i style={{ left: `${(4 / LCP_MAX) * 100}%` }} />
        <b style={{ width: `${(lcp / LCP_MAX) * 100}%` }} />
      </div>
      <div className="sw-vitals__scale" aria-hidden="true">
        <span>0 s</span>
        <span style={{ left: `${(2.5 / LCP_MAX) * 100}%` }}>2.5</span>
        <span style={{ left: `${(4 / LCP_MAX) * 100}%` }}>4</span>
      </div>
      <div className="sw-vitals__fixes" role="group" aria-label="Speed fixes">
        {FIXES.map(([k, label]) => (
          <button key={k} type="button" className={`aw-pill${on[k] ? ' is-on' : ''}`} aria-pressed={on[k]} onClick={() => setOn((o) => ({ ...o, [k]: !o[k] }))}>
            {label}
          </button>
        ))}
      </div>
      <p className="sw-vitals__note">A demo page, measured the way Lighthouse does.</p>
    </div>
  );
}

/* AI crawler access: one switch, the robots.txt it writes. */
function CrawlerDemo() {
  const [open, setOpen] = useState(true);
  const rule = open ? 'Allow: /' : 'Disallow: /';
  return (
    <div className="sw-robots">
      <div className="sw-toggle">
        <button type="button" role="switch" aria-checked={open} onClick={() => setOpen((v) => !v)}>
          <span className="sr-only">Let AI search crawlers read the site</span>
        </button>
        <span aria-hidden="true">AI search crawlers</span>
      </div>
      <pre className="sw-code" aria-label="robots.txt">{`# robots.txt\nUser-agent: OAI-SearchBot\n${rule}\n\nUser-agent: PerplexityBot\n${rule}`}</pre>
      <p className="sw-robots__note" aria-live="polite">
        {open ? 'ChatGPT search and Perplexity can read the site, so they can quote it.' : 'They cannot read the site, so they cannot quote it.'}
      </p>
    </div>
  );
}

export default function Deliverables() {
  return (
    <section className="bw-grid" aria-labelledby="sw-grid-title">
      <h2 id="sw-grid-title" className="bw-grid__title">
        The work runs on this page.
      </h2>
      <ul className="bw-grid__cards">
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool" style={{ aspectRatio: '4/3' }}>
              <SnippetDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Titles and descriptions.</strong> Write one; the preview cuts it where search results usually do.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--mint" style={{ aspectRatio: '4/3' }}>
              <AnswerDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>AI answers.</strong> Ask; it answers from your pages and cites them. What no page says, it cannot cite.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--lilac" style={{ aspectRatio: '4/3' }}>
              <SchemaDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Structured data.</strong> Flip it: the result shows breadcrumbs, and machines know what the page is.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--orange" style={{ aspectRatio: '4/3' }}>
              <VitalsDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>Speed.</strong> Toggle the fixes. The lines are Google&apos;s: good at 2.5 s or less, poor over 4 s.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo bw-grid__demo--tool aw-tone--blue" style={{ aspectRatio: '4/3' }}>
              <CrawlerDemo />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>AI crawler access.</strong> Two lines in robots.txt decide whether AI search can read you.
          </p>
        </li>
        <li className="bw-grid__card">
          <div className="bw-grid__stage">
            <div className="bw-grid__demo aw-tone--pink" style={{ aspectRatio: '4/3' }}>
              <LiveArt Art={ReportChart} create={reportLive} className="aw-live" />
            </div>
          </div>
          <p className="bw-grid__cap">
            <strong>The report.</strong> Clicks, calls and forms, month by month, from Search Console and your analytics.
          </p>
        </li>
      </ul>
    </section>
  );
}
