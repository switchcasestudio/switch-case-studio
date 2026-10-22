/* The five studio concepts (owner pick, 2026-10-22): Hatch (ceramics),
   Lowtide (coffee), Meridian (bike repair), Fieldnote (bookshop), Hum (sound
   studio). Pure SVG, SSR-safe, presentation attributes only; `data-p` hooks
   mark the parts a later engine moves. Fills are classes from
   brandWorld.scss so the palette stays on tokens. Each tile is a plate:
   flat colour, rounded corners come from the tile box, no shadows. */
const INTER = "Inter, 'Inter Fallback', sans-serif";
const DISPLAY = "'SCS Display', 'SCS Display Fallback', sans-serif";
const META = { fontFamily: INTER, fontSize: 14, fontWeight: 500, letterSpacing: 2 };

const Label = ({ x, y, children, cls = 'bw-f-ink', anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} className={cls} {...META}>
    {children}
  </text>
);

/* Hatch: the H is drawn in hatching, the kiln's grid of shelves. */
export function HatchMark() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect width="400" height="400" className="bw-f-cream" />
      <circle cx="200" cy="190" r="128" className="bw-f-ink" />
      <rect x="128" y="112" width="30" height="156" className="bw-f-cream" />
      <rect x="242" y="112" width="30" height="156" className="bw-f-cream" />
      <g data-p="hatch" className="bw-s-cream" strokeWidth="6" strokeLinecap="round">
        <path d="M158 170H242M158 182H242M158 194H242M158 206H242" />
      </g>
      <Label x={28} y={366}>HATCH CERAMICS</Label>
      <Label x={372} y={366} anchor="end">PDX</Label>
    </svg>
  );
}

export function HatchWord() {
  return (
    <svg viewBox="0 0 800 400" aria-hidden="true" focusable="false">
      <rect width="800" height="400" className="bw-f-orange" />
      <text x="40" y="250" className="bw-f-ink" fontFamily={INTER} fontSize="230" fontWeight="700" letterSpacing="-14">
        Hatch
      </text>
      <g data-p="hatch" className="bw-s-ink" strokeWidth="4">
        <path d="M40 300H760M40 314H760M40 328H760" />
      </g>
      <Label x={40} y={372}>CERAMICS, PORTLAND</Label>
      <Label x={760} y={372} anchor="end">01</Label>
    </svg>
  );
}

/* Lowtide: an L whose foot is the tide line, a sun over it. */
export function LowtideMark() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect width="400" height="400" className="bw-f-blue" />
      <circle data-p="sun" cx="262" cy="118" r="38" className="bw-f-cream" />
      <rect x="110" y="96" width="38" height="190" rx="4" className="bw-f-cream" />
      <g data-p="tide" fill="none" className="bw-s-cream" strokeWidth="18" strokeLinecap="round">
        <path d="M110 286c30 0 30-22 60-22s30 22 60 22 30-22 60-22" />
        <path d="M150 334c24 0 24-16 48-16s24 16 48 16 24-16 48-16" strokeWidth="12" opacity="0.6" />
      </g>
      <Label x={28} y={372} cls="bw-f-cream">LOWTIDE COFFEE</Label>
    </svg>
  );
}

export function LowtideColour() {
  const rows = [
    ['Deep', '#1748ef', 'bw-f-blue'],
    ['Foam', '#fef7ed', 'bw-f-cream'],
    ['Kelp', '#79ccb6', 'bw-f-mint'],
    ['Ember', '#ff834a', 'bw-f-orange'],
    ['Dusk', '#dab8ff', 'bw-f-lavender'],
  ];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      {rows.map(([name, hex, cls], i) => (
        <g key={name} data-p="swatch" transform={`translate(28 ${26 + i * 46})`}>
          <rect width="150" height="34" rx="6" className={cls} />
          <text x="170" y="23" className="bw-f-cream" fontFamily={INTER} fontSize="16" fontWeight="500">
            {name}
          </text>
          <text x="372" y="23" textAnchor="end" className="bw-f-cream" fontFamily={INTER} fontSize="13" opacity="0.6">
            {hex}
          </text>
        </g>
      ))}
      <Label x={28} y={282} cls="bw-f-cream">LOWTIDE, 5 OF 5</Label>
    </svg>
  );
}

/* Meridian: a chainring with the meridian line through it. */
export function MeridianMark() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect width="400" height="400" className="bw-f-lavender" />
      <g data-p="ring" transform="translate(200 190)">
        <circle r="118" fill="none" className="bw-s-ink" strokeWidth="26" strokeDasharray="20 13" />
        <circle r="42" className="bw-f-ink" />
      </g>
      <rect x="193" y="40" width="14" height="300" rx="7" className="bw-f-ink" />
      <Label x={28} y={372}>MERIDIAN BIKE REPAIR</Label>
    </svg>
  );
}

export function MeridianType() {
  const lines = [];
  for (let y = 40; y < 400; y += 40) lines.push(y);
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <rect width="600" height="400" className="bw-f-ink" />
      <g className="bw-s-lavender" strokeWidth="1" opacity="0.35">
        {lines.map((y) => (
          <path key={y} d={`M0 ${y}H600`} />
        ))}
      </g>
      <text x="32" y="150" className="bw-f-cream" fontFamily={INTER} fontSize="104" fontWeight="700" letterSpacing="-5">
        Meridian
      </text>
      <text x="32" y="236" className="bw-f-cream" fontFamily={INTER} fontSize="60" fontWeight="500" letterSpacing="-2">
        Aa Bb Cc 0123
      </text>
      <text x="32" y="300" className="bw-f-lavender" fontFamily={INTER} fontSize="30" fontWeight="500">
        Fixed at 7 am. Rolling by noon.
      </text>
      <Label x={32} y={372} cls="bw-f-cream">INTER 700 AND 500</Label>
      <Label x={568} y={372} cls="bw-f-cream" anchor="end">TYPE</Label>
    </svg>
  );
}

/* Fieldnote: a ruled card, a bookmark ribbon for the mark. */
export function FieldnoteCard() {
  const rules = [];
  for (let y = 150; y < 350; y += 28) rules.push(y);
  return (
    <svg viewBox="0 0 700 400" aria-hidden="true" focusable="false">
      <rect width="700" height="400" className="bw-f-mint" />
      <rect x="40" y="40" width="620" height="320" rx="14" className="bw-f-cream" />
      <g className="bw-s-mint" strokeWidth="2">
        {rules.map((y) => (
          <path key={y} d={`M70 ${y}H630`} />
        ))}
      </g>
      <path d="M118 40V360" className="bw-s-terra" strokeWidth="2" />
      <text x="140" y="118" className="bw-f-ink" fontFamily={INTER} fontSize="68" fontWeight="700" letterSpacing="-3">
        Fieldnote
      </text>
      <path data-p="ribbon" d="M560 40h60v120l-30-26-30 26z" className="bw-f-terra" />
      <Label x={140} y={330}>BOOKS, PORTLAND</Label>
      <Label x={630} y={330} anchor="end">SINCE PAGE ONE</Label>
    </svg>
  );
}

export function FieldnoteSticker() {
  return (
    <svg viewBox="0 0 360 640" aria-hidden="true" focusable="false">
      <rect width="360" height="640" className="bw-f-ink" />
      <path data-p="ribbon" d="M120 0h120v420l-60-52-60 52z" className="bw-f-terra" />
      <text
        transform="translate(206 60) rotate(90)"
        className="bw-f-cream"
        fontFamily={INTER}
        fontSize="40"
        fontWeight="700"
        letterSpacing="6"
      >
        FIELDNOTE
      </text>
      <Label x={28} y={600} cls="bw-f-cream">DIE-CUT BOOKMARK</Label>
    </svg>
  );
}

/* Hum: rings leaving a lowercase h. */
export function HumMark() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect width="400" height="400" className="bw-f-ink" />
      <g data-p="ring" transform="translate(200 196)" fill="none" className="bw-s-lavender" strokeWidth="10">
        <circle r="60" />
        <circle r="100" opacity="0.6" />
        <circle r="140" opacity="0.3" />
      </g>
      <text x="200" y="258" textAnchor="middle" className="bw-f-cream" fontFamily={INTER} fontSize="190" fontWeight="700">
        h
      </text>
      <Label x={28} y={372} cls="bw-f-cream">HUM SOUND STUDIO</Label>
    </svg>
  );
}

export function HumGlyph() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect width="400" height="400" className="bw-f-pink" />
      <text x="40" y="430" className="bw-f-ink" fontFamily={DISPLAY} fontSize="520" fontWeight="500">
        h
      </text>
      <Label x={28} y={40}>HUM, DISPLAY CUT</Label>
    </svg>
  );
}

/* The studio's own voice on one plate. */
export function StudioNote() {
  const copy = [
    'A logo is the smallest piece',
    'of an identity. The system is',
    'the rest: a palette that survives',
    'a bad printer, type that reads',
    'at eleven pixels, and rules a',
    'new hire can follow on day one.',
  ];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-cream" />
      <Label x={28} y={44}>STUDIO NOTE 01</Label>
      <text x="28" y="96" className="bw-f-ink" fontFamily={INTER} fontSize="22" fontWeight="500">
        {copy.map((line, i) => (
          <tspan key={line} x="28" dy={i ? 30 : 0}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  );
}

/* A round sticker; the scroll spins it. */
export function Badge() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <path id="bw-badge-ring" d="M100 100m-72 0a72 72 0 1 1 144 0a72 72 0 1 1-144 0" />
      </defs>
      <circle cx="100" cy="100" r="100" className="bw-f-orange" />
      <text className="bw-f-ink" fontFamily={INTER} fontSize="17" fontWeight="500" letterSpacing="4">
        <textPath href="#bw-badge-ring">SWITCH CASE STUDIO PORTLAND </textPath>
      </text>
      <text x="100" y="118" textAnchor="middle" className="bw-f-ink" fontFamily={DISPLAY} fontSize="54" fontWeight="500">
        SCS
      </text>
    </svg>
  );
}
