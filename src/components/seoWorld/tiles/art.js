/* The SEO & AI Search world's drawings (2026-10-24). The AI world's
   language: thin outlines in `currentColor` (so the process stage recolors
   each drawing with its field), captions that open in bold, and one filled
   accent per drawing, painted by CSS through `.sw-acc` (seoWorld.scss picks
   a color that reads on each field). Pure SVG, SSR-safe, presentation
   attributes only; `data-p` hooks mark the parts tiles/live.js moves. The
   SSR drawing is the rest state. */
const INTER = "Inter, 'Inter Fallback', sans-serif";
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 4.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const THIN = { ...S, strokeWidth: 4 };

export const Label = ({ x, y, children, anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} fill="currentColor" fontFamily={INTER} fontSize="14" fontWeight="500" letterSpacing="2">
    {children}
  </text>
);

const Tick = ({ x, y, k }) => <path data-p="tick" data-k={k} d={`M${x - 11} ${y}l8 8l15 -16`} {...THIN} opacity="0" />;

/* The audit: the site as a tree of pages, a lens that walks it, a tick on
   every page it has read. */
export const CRAWL = [
  { x: 300, y: 75, w: 96, h: 54 },
  { x: 130, y: 200, w: 96, h: 54 },
  { x: 300, y: 200, w: 96, h: 54 },
  { x: 470, y: 200, w: 96, h: 54 },
  { x: 70, y: 325, w: 84, h: 48 },
  { x: 190, y: 325, w: 84, h: 48 },
  { x: 300, y: 325, w: 84, h: 48 },
  { x: 410, y: 325, w: 84, h: 48 },
  { x: 530, y: 325, w: 84, h: 48 },
];
const LINKS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 4],
  [1, 5],
  [2, 6],
  [3, 7],
  [3, 8],
];
export function Crawl() {
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <g {...THIN}>
        {LINKS.map(([a, b]) => (
          <path key={`${a}-${b}`} d={`M${CRAWL[a].x} ${CRAWL[a].y + CRAWL[a].h / 2}V${(CRAWL[a].y + CRAWL[b].y) / 2 + 10}H${CRAWL[b].x}V${CRAWL[b].y - CRAWL[b].h / 2}`} />
        ))}
      </g>
      {CRAWL.map((n, i) => (
        <g key={i}>
          <rect x={n.x - n.w / 2} y={n.y - n.h / 2} width={n.w} height={n.h} rx="12" fill="none" {...S} />
          <Tick x={n.x - 2} y={n.y - 2} k={i} />
        </g>
      ))}
      <g data-p="lens">
        <circle cx="0" cy="0" r="40" className="sw-acc" fillOpacity="0.35" {...S} />
        <path d="M29 29L58 58" {...S} strokeWidth="7" />
      </g>
    </svg>
  );
}

/* The fix list: a clipboard whose boxes tick in order. */
export function Checklist() {
  const rows = [0, 1, 2, 3];
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect x="80" y="60" width="240" height="300" rx="26" {...S} />
      <rect x="150" y="40" width="100" height="40" rx="14" className="sw-acc" {...THIN} />
      {rows.map((r) => (
        <g key={r}>
          <rect x="115" y={120 + r * 56} width="30" height="30" rx="8" {...THIN} />
          <path data-p="check" d={`M121 ${136 + r * 56}l7 7l13 -15`} {...THIN} opacity="0" />
          <path d={`M165 ${135 + r * 56}H${r % 2 ? 250 : 285}`} {...THIN} />
        </g>
      ))}
      <Label x={200} y={392} anchor="middle">EVERY FIX, SHIPPED</Label>
    </svg>
  );
}

/* AI answers: a bubble that writes itself and the chip that cites you. */
export function AnswerCard() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <path d="M50 30h300a30 30 0 0 1 30 30v130a30 30 0 0 1-30 30H110l-44 36v-36H50a30 30 0 0 1-30-30V60a30 30 0 0 1 30-30z" {...S} />
      {[
        [70, 330],
        [70, 300],
        [70, 250],
      ].map(([x1, x2], i) => (
        <path key={i} data-p="ln" d={`M${x1} ${78 + i * 32}H${x2}`} {...THIN} pathLength="1" strokeDasharray="1" />
      ))}
      <g data-p="chip">
        <rect x="70" y="164" width="150" height="36" rx="18" className="sw-acc" {...THIN} />
        <text x="145" y="188" textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize="16" fontWeight="600">
          your page
        </text>
      </g>
    </svg>
  );
}

/* Structured data: the braces of a JSON-LD block, keys and values. */
export function Braces() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <path data-p="bl" d="M130 80c-40 0-40 20-40 60s-6 60-36 60c30 0 36 20 36 60s0 60 40 60" {...S} />
      <path data-p="br" d="M270 80c40 0 40 20 40 60s6 60 36 60c-30 0-36 20-36 60s0 60-40 60" {...S} />
      {[0, 1, 2].map((r) => (
        <g key={r} data-p="kv">
          <circle cx="150" cy={150 + r * 50} r="8" className="sw-acc" {...THIN} />
          <path d={`M172 ${150 + r * 50}H${r === 1 ? 230 : 250}`} {...THIN} />
        </g>
      ))}
      <Label x={200} y={392} anchor="middle">SCHEMA.ORG</Label>
    </svg>
  );
}

/* Speed: a dial in three zones, the needle and the filled arc. */
export function Gauge() {
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <path d="M100 320A200 200 0 0 1 500 320" {...S} />
      <path data-p="arc" d="M100 320A200 200 0 0 1 500 320" fill="none" className="sw-acc-line" strokeWidth="18" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="0.15" />
      {[-90, -54, -18, 18, 54, 90].map((a) => (
        <path key={a} d="M300 92V112" {...THIN} transform={`rotate(${a} 300 320)`} />
      ))}
      <g data-p="needle" transform="rotate(63 300 320)">
        <path d="M300 320V150" {...S} strokeWidth="6" />
      </g>
      <circle cx="300" cy="320" r="16" fill="currentColor" />
      <Label x={300} y={378} anchor="middle">LIGHTHOUSE, BEFORE AND AFTER</Label>
    </svg>
  );
}

/* A stopwatch: the hand laps, the hand of the visitor speeds it. */
export function Stopwatch() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="200" cy="215" r="130" {...S} />
      <rect x="175" y="45" width="50" height="34" rx="10" className="sw-acc" {...THIN} />
      <path d="M200 79V85" {...S} />
      <path data-p="hand" d="M200 215V112" {...S} strokeWidth="6" />
      <circle cx="200" cy="215" r="10" fill="currentColor" />
    </svg>
  );
}

/* Ads: a search ad, the click, and the phone that rings for it. */
export function AdCard() {
  return (
    <svg viewBox="0 0 640 360" aria-hidden="true" focusable="false">
      <rect x="30" y="60" width="370" height="200" rx="22" {...S} />
      <rect x="60" y="92" width="56" height="30" rx="10" className="sw-acc" {...THIN} />
      <text x="88" y="113" textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize="16" fontWeight="700">
        Ad
      </text>
      <path d="M135 107H340M60 160H360M60 196H300" {...THIN} />
      <path d="M60 228H200" {...THIN} />
      <path data-p="wire" d="M300 214C420 214 430 180 490 180" {...THIN} strokeDasharray="2 14" />
      <g data-p="phone">
        <rect x="500" y="100" width="100" height="180" rx="20" {...S} />
        <path d="M535 118H565" {...THIN} />
        <circle data-p="ring" cx="550" cy="190" r="22" className="sw-acc" {...THIN} />
      </g>
      <g data-p="cursor" transform="translate(250 190)">
        <path d="M0 0L0 46L12 35L22 56L32 51L22 31L38 30Z" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/* A target and the arrow that keeps finding it. */
export function Target() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="200" cy="200" r="140" {...S} />
      <circle cx="200" cy="200" r="92" {...THIN} />
      <circle cx="200" cy="200" r="44" className="sw-acc" {...THIN} />
      <g data-p="arrow">
        <path d="M200 200L330 70" {...S} />
        <path d="M330 70l-6 30M330 70l-30 6M316 84l-6 30M316 84l-30 6" {...THIN} />
      </g>
    </svg>
  );
}

/* Conversion: two versions of a page, A and B, and how each one does. */
export function ABTest() {
  const page = (x, k) => (
    <g key={k}>
      <rect x={x} y="40" width="250" height="230" rx="20" {...S} />
      <path d={`M${x + 30} 82H${x + 200}M${x + 30} 112H${x + 160}`} {...THIN} />
      <rect x={x + 30} y="160" width={k === 'B' ? 150 : 110} height="46" rx="23" className={k === 'B' ? 'sw-acc' : undefined} {...THIN} />
      <text x={x + 125} y="250" textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize="22" fontWeight="700">
        {k}
      </text>
      <rect x={x} y="300" width="250" height="26" rx="13" {...THIN} />
      <rect data-p={`bar${k}`} x={x + 4} y="304" width="80" height="18" rx="9" fill="currentColor" />
    </g>
  );
  return (
    <svg viewBox="0 0 700 400" aria-hidden="true" focusable="false">
      {page(70, 'A')}
      {page(380, 'B')}
      <Label x={350} y={372} anchor="middle">ONE CHANGE, ONE TEST</Label>
    </svg>
  );
}

/* A pointer that presses the button. */
export function Press() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect data-p="btn" x="70" y="140" width="260" height="90" rx="45" className="sw-acc-soft" {...S} />
      <text x="200" y="196" textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize="30" fontWeight="600">
        Book a call
      </text>
      <g data-p="cursor" transform="translate(250 230)">
        <path d="M0 0L0 64L17 49L31 78L45 71L31 43L53 42Z" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/* The report: weekly clicks as a line, illustrative, no numbers on it. */
export const CLICKS = [210, 222, 205, 196, 184, 190, 170, 158, 162, 140, 128, 118];
export function ReportChart() {
  const pts = CLICKS.map((y, i) => `${50 + i * 29} ${y}`).join(' L');
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <path d="M40 40V250H370" {...THIN} />
      {[100, 150, 200].map((y) => (
        <path key={y} d={`M44 ${y}H366`} {...THIN} strokeWidth="1.5" strokeDasharray="4 8" />
      ))}
      <path data-p="line" d={`M${pts}`} {...S} pathLength="1" strokeDasharray="1" />
      <circle data-p="dot" cx="50" cy={CLICKS[0]} r="9" className="sw-acc" {...THIN} />
      <Label x={46} y={282}>CLICKS, WEEK BY WEEK</Label>
    </svg>
  );
}
