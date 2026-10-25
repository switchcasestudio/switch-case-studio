/* The Web Development & Mobile Apps world's drawings (2026-10-24), in the
   outline worlds' language: thin `currentColor` strokes (4.5 / 4 viewBox
   units), lavender as the only fill, nothing else. The same drawing is
   cream on the blue field and ink on the light ones. Pure SVG, SSR-safe,
   presentation attributes only; `data-p` hooks mark the parts
   tiles/live.js moves. Every drawing is one step of a build. */
const INTER = "Inter, 'Inter Fallback', sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const LAVENDER = '#dab8ff';
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 4.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const THIN = { ...S, strokeWidth: 4 };

const Label = ({ x, y, children, anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} fill="currentColor" fontFamily={INTER} fontSize="14" fontWeight="500" letterSpacing="2">
    {children}
  </text>
);

/* Scope: the wireframe. A page's bones with crossed placeholders; the
   blocks trade places while the hand is near. */
export function Wireframe() {
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <rect x="40" y="30" width="520" height="340" rx="22" {...S} />
      <path d="M40 76H560" {...THIN} />
      <circle cx="70" cy="53" r="6" {...THIN} />
      <circle cx="92" cy="53" r="6" {...THIN} />
      <circle cx="114" cy="53" r="6" {...THIN} />
      <g data-p="hero">
        <rect x="70" y="100" width="460" height="110" rx="12" {...THIN} />
        <path d="M70 100L530 210M530 100L70 210" {...THIN} strokeDasharray="6 10" />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} data-p="card">
          <rect x={70 + i * 158} y="232" width="144" height="110" rx="12" {...THIN} />
          <path d={`M${88 + i * 158} 262H${196 + i * 158}M${88 + i * 158} 286H${170 + i * 158}`} {...THIN} />
        </g>
      ))}
    </svg>
  );
}

/* Scope sticker: the sitemap, a home and three pages. */
export function Sitemap() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect data-p="root" x="150" y="60" width="100" height="64" rx="14" fill={LAVENDER} stroke="currentColor" strokeWidth="4" />
      <path d="M200 124V170M90 170H310M90 170V214M200 170V214M310 170V214" {...THIN} />
      {[90, 200, 310].map((x) => (
        <rect key={x} data-p="leaf" x={x - 42} y="214" width="84" height="56" rx="12" {...THIN} />
      ))}
      <Label x={200} y={330} anchor="middle">
        SITEMAP, FOUR PAGES
      </Label>
    </svg>
  );
}

/* Design: the grid. Twelve columns, blocks that snap to them. */
export function LayoutGrid() {
  const cols = [...Array(12)].map((_, i) => 40 + i * 43.3);
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <g opacity="0.35">
        {cols.map((x) => (
          <rect key={x} x={x} y="30" width="34" height="340" rx="4" {...THIN} />
        ))}
      </g>
      <rect data-p="b0" x="40" y="60" width="337" height="120" rx="12" fill={LAVENDER} stroke="currentColor" strokeWidth="4.5" />
      <rect data-p="b1" x="386" y="60" width="164" height="120" rx="12" {...S} />
      <rect data-p="b2" x="40" y="210" width="164" height="130" rx="12" {...S} />
      <rect data-p="b3" x="213" y="210" width="337" height="130" rx="12" {...S} />
    </svg>
  );
}

/* Design sticker: type, a specimen that changes weight. */
export function TypeSpecimen() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <text data-p="aa" x="200" y="250" textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize="190" fontWeight="500" letterSpacing="-6">
        Aa
      </text>
      <path d="M60 300H340" {...THIN} />
      <Label x={200} y={340} anchor="middle">
        ONE FACE, TWO WEIGHTS
      </Label>
    </svg>
  );
}

/* Build: the editor. Lines of code that write themselves. */
export const CODE = [
  { indent: 0, w: 210, kw: 'export' },
  { indent: 1, w: 260, kw: 'return' },
  { indent: 2, w: 180, kw: '<Hero' },
  { indent: 2, w: 240, kw: '<Pricing' },
  { indent: 2, w: 150, kw: '<Form' },
  { indent: 1, w: 60, kw: ')' },
];
export function Editor() {
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <rect x="40" y="30" width="520" height="340" rx="22" {...S} />
      <path d="M40 76H560" {...THIN} />
      <circle cx="70" cy="53" r="6" {...THIN} />
      <circle cx="92" cy="53" r="6" {...THIN} />
      <circle cx="114" cy="53" r="6" {...THIN} />
      {CODE.map((l, i) => (
        <g key={i}>
          <text x="70" y={124 + i * 40} fill="currentColor" fontFamily={MONO} fontSize="15" opacity="0.5">
            {i + 1}
          </text>
          <path data-p="line" d={`M${110 + l.indent * 30} ${119 + i * 40}H${110 + l.indent * 30 + l.w}`} {...S} />
        </g>
      ))}
      <rect data-p="caret" x="110" y="104" width="4" height="26" fill={LAVENDER} />
    </svg>
  );
}

/* Build sticker: the braces, holding a component. */
export function Braces() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <path data-p="l" d="M150 80C110 80 120 150 110 190C105 205 90 200 80 200C90 200 105 195 110 210C120 250 110 320 150 320" {...S} />
      <path data-p="r" d="M250 80C290 80 280 150 290 190C295 205 310 200 320 200C310 200 295 195 290 210C280 250 290 320 250 320" {...S} />
      <rect data-p="core" x="160" y="170" width="80" height="60" rx="14" fill={LAVENDER} stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

/* Launch: the address bar. The lock closes, the page loads. */
export function AddressBar() {
  return (
    <svg viewBox="0 0 700 400" aria-hidden="true" focusable="false">
      <rect x="40" y="40" width="620" height="320" rx="22" {...S} />
      <rect x="70" y="70" width="560" height="56" rx="28" {...THIN} />
      <g data-p="lock">
        <rect x="96" y="90" width="26" height="22" rx="5" {...THIN} />
        <path data-p="shackle" d="M101 90V83a8 8 0 0 1 16 0V90" {...THIN} />
      </g>
      <text x="138" y="106" fill="currentColor" fontFamily={MONO} fontSize="20">
        https://yourbusiness.com
      </text>
      <rect x="70" y="160" width="560" height="10" rx="5" {...THIN} />
      <rect data-p="bar" x="70" y="160" width="560" height="10" rx="5" fill={LAVENDER} />
      <rect x="70" y="200" width="270" height="130" rx="12" {...THIN} />
      <path d="M370 214H630M370 246H590M370 278H610M370 310H540" {...THIN} />
    </svg>
  );
}

/* Launch sticker: the DNS record, one row. */
export function DnsRow() {
  return (
    <svg viewBox="0 0 400 200" aria-hidden="true" focusable="false">
      <rect x="20" y="40" width="360" height="120" rx="20" {...S} />
      <text x="48" y="92" fill="currentColor" fontFamily={MONO} fontSize="22" fontWeight="600">
        A
      </text>
      <text x="90" y="92" fill="currentColor" fontFamily={MONO} fontSize="22">
        @ → your server
      </text>
      <circle data-p="ok" cx="56" cy="128" r="9" fill={LAVENDER} stroke="currentColor" strokeWidth="3" />
      <text x="78" y="135" fill="currentColor" fontFamily={INTER} fontSize="16" fontWeight="500" letterSpacing="2">
        PROPAGATED
      </text>
    </svg>
  );
}

/* Care: the uptime line. A heartbeat that keeps coming. */
export function Uptime() {
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <rect x="40" y="40" width="520" height="320" rx="22" {...S} />
      <defs>
        <clipPath id="ww-uptime-clip">
          <rect x="60" y="80" width="480" height="220" />
        </clipPath>
      </defs>
      <g clipPath="url(#ww-uptime-clip)">
        <path
          data-p="beat"
          d="M60 200H160L180 150L200 250L220 120L240 200H360L380 150L400 250L420 120L440 200H560L580 150L600 250L620 120L640 200H760L780 150L800 250L820 120L840 200H960"
          {...S}
        />
      </g>
      <circle data-p="dot" cx="88" cy="330" r="8" fill={LAVENDER} stroke="currentColor" strokeWidth="3" />
      <Label x={108} y={335}>
        UP, CHECKED EVERY MINUTE
      </Label>
    </svg>
  );
}

/* Care sticker: the server, three racks with their lights. */
export function Rack() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="80" y={70 + i * 90} width="240" height="70" rx="14" {...S} />
          <path d={`M120 ${105 + i * 90}H220`} {...THIN} />
          <circle data-p="led" cx="280" cy={105 + i * 90} r="9" fill={LAVENDER} stroke="currentColor" strokeWidth="3" />
        </g>
      ))}
      <Label x={200} y={370} anchor="middle">
        YOUR VPS OR OURS
      </Label>
    </svg>
  );
}
