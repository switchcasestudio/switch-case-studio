/* The five studio concepts (owner pick, 2026-10-22): Hatch (ceramics),
   Lowtide (coffee), Meridian (bike repair), Fieldnote (bookshop), Hum (sound
   studio). Pure SVG, SSR-safe, presentation attributes only. Fills are
   classes from brandWorld.scss so the palette stays on tokens. Each tile is
   a plate: flat color, rounded corners come from the tile box, no shadows.
   The process stage and the deliverables use these; the hero draws its own
   cut of each mark (BrandHero.js). The collage's tiles went with it
   (2026-10-25). */
import { INNER_STAR, OUTER_STAR } from './starPaths';

const INTER = "Inter, 'Inter Fallback', sans-serif";
const META = { fontFamily: INTER, fontSize: 14, fontWeight: 500, letterSpacing: 2 };

const Label = ({ x, y, children, cls = 'bw-f-ink', anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} className={cls} {...META}>
    {children}
  </text>
);

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

/* The studio's star seal in two and a half dimensions: the star stacked
   eight deep in ink, the lilac face on top, the orange spark turning. */
export function SealStar() {
  const depth = [7, 6, 5, 4, 3, 2, 1];
  return (
    <svg viewBox="0 0 776 748" aria-hidden="true" focusable="false">
      <rect width="776" height="748" className="bw-f-ink" />
      <g transform="translate(0 -10) scale(0.92) translate(34 34)">
        {depth.map((d) => (
          <path key={d} data-p="layer" d={OUTER_STAR} fill="#6f5a86" transform={`translate(${d * 3} ${d * 3})`} />
        ))}
        <g data-p="top">
          <path d={OUTER_STAR} className="bw-f-lavender" />
          <g data-p="spark">
            <path d={INNER_STAR} className="bw-f-terra" />
          </g>
        </g>
      </g>
      <Label x={40} y={720} cls="bw-f-cream">SWITCH CASE STUDIO</Label>
      <Label x={736} y={720} cls="bw-f-cream" anchor="end">SEAL</Label>
    </svg>
  );
}

/* A sticker sheet: all five marks die-cut on one page. */
export function StickerSheet() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <rect width="400" height="400" className="bw-f-cream" />
      <g className="bw-s-ink" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.4">
        <circle cx="110" cy="110" r="74" />
        <circle cx="290" cy="110" r="74" />
        <circle cx="110" cy="290" r="74" />
        <circle cx="290" cy="290" r="74" />
      </g>
      <g transform="translate(110 110)">
        <circle r="62" className="bw-f-ink" />
        <rect x="-32" y="-34" width="13" height="68" className="bw-f-cream" />
        <rect x="19" y="-34" width="13" height="68" className="bw-f-cream" />
        <path d="M-19 -8H19M-19 0H19M-19 8H19" className="bw-s-cream" strokeWidth="3" />
      </g>
      <g transform="translate(290 110)">
        <circle r="62" className="bw-f-blue" />
        <circle cx="18" cy="-22" r="12" className="bw-f-cream" />
        <rect x="-30" y="-28" width="12" height="52" rx="2" className="bw-f-cream" />
        <path d="M-30 30c10 0 10-8 20-8s10 8 20 8 10-8 20-8" fill="none" className="bw-s-cream" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g transform="translate(110 290)">
        <circle r="62" className="bw-f-lavender" />
        <circle r="38" fill="none" className="bw-s-ink" strokeWidth="9" strokeDasharray="7 5" />
        <circle r="13" className="bw-f-ink" />
        <rect x="-2.5" y="-54" width="5" height="108" rx="2.5" className="bw-f-ink" />
      </g>
      <g transform="translate(290 290)">
        <circle r="62" className="bw-f-mint" />
        <rect x="-36" y="-30" width="72" height="60" rx="5" className="bw-f-cream" />
        <path d="M-26 -12H26M-26 0H26M-26 12H26" className="bw-s-mint" strokeWidth="2" />
        <path d="M14 -30h16v30l-8-7-8 7z" className="bw-f-terra" />
      </g>
      <Label x={28} y={32}>STICKER SHEET, 4 OF 5</Label>
    </svg>
  );
}

/* A poster for Hum: the h and its rings at A2, hung on a wall of ink. */
export function HumPoster() {
  return (
    <svg viewBox="0 0 400 560" aria-hidden="true" focusable="false">
      <rect width="400" height="560" className="bw-f-ink" />
      <rect x="40" y="40" width="320" height="452" className="bw-f-pink" />
      <g transform="translate(200 230)" fill="none" className="bw-s-ink" strokeWidth="8">
        <circle r="46" />
        <circle r="84" opacity="0.6" />
        <circle r="122" opacity="0.3" />
      </g>
      <text x="200" y="280" textAnchor="middle" className="bw-f-ink" fontFamily={INTER} fontSize="150" fontWeight="700">
        h
      </text>
      <text x="64" y="440" className="bw-f-ink" fontFamily={INTER} fontSize="30" fontWeight="700" letterSpacing="-1">
        Hum, every Friday.
      </text>
      <Label x={64} y={470}>SOUND STUDIO, PORTLAND</Label>
      <Label x={40} y={530} cls="bw-f-cream">A2 POSTER</Label>
    </svg>
  );
}