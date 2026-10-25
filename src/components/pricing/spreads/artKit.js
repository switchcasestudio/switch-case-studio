/* Shared pieces for the package-board tile art (400x300 SVG scenes in the
   brand-book language: cream page, ink lines, the site palette). Fill and
   stroke classes: sp-f-* / sp-s-* from servicePoster.scss, tsp-f-* from
   packageBoard.scss. */
export const SANS = "Inter, 'Inter Fallback', sans-serif";
export const DISPLAY = "'SCS Display', 'SCS Display Fallback', sans-serif";
export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
export const WORDMARK = "/brand/switch-case-studio-logo-square-lilac.svg";

export const Wordmark = (p) => <image href={WORDMARK} preserveAspectRatio="xMidYMid meet" {...p} />;

// N-point star, centered on 0,0.
export const starPoints = (outer, inner, n = 8) => {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
};

export const Burst = ({ x, y, r, className, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <polygon points={starPoints(r, r * 0.62)} className={className} />
    {children}
  </g>
);

// The star mark, simplified: lilac burst, terra spark, cream "switch case".
export const Mark = ({ x, y, r }) => (
  <Burst x={x} y={y} r={r} className="tsp-f-lilac">
    <polygon points={starPoints(r * 0.14, r * 0.06, 4)} className="sp-f-terra" transform={`translate(${r * 0.5} ${r * 0.08})`} />
    <text x={-r * 0.08} y={-r * 0.06} textAnchor="middle" fontFamily={SANS} fontSize={r * 0.2} fontWeight="800" className="sp-f-cream">
      SWITCH
    </text>
    <text x={-r * 0.08} y={r * 0.3} textAnchor="middle" fontFamily={SANS} fontSize={r * 0.2} fontWeight="800" className="sp-f-cream">
      CASE
    </text>
  </Burst>
);

// The four-point AI spark from Poster 03.
export const Spark = ({ x, y, r, className = "sp-f-ink" }) => (
  <polygon points={starPoints(r, r * 0.3, 4)} className={className} transform={`translate(${x} ${y})`} />
);

// Ruled grid, the site's own background.
export const gridPath = (x, y, w, h, step) => {
  let d = "";
  for (let i = x + step; i < x + w; i += step) d += `M${i} ${y}V${y + h}`;
  for (let j = y + step; j < y + h; j += step) d += `M${x} ${j}H${x + w}`;
  return d;
};

export const Chip = ({ x, y, w, label, fill = "sp-f-ink", text = "sp-f-cream" }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height="34" rx="17" className={fill} />
    <text x={w / 2} y="23" textAnchor="middle" fontFamily={SANS} fontSize="17" fontWeight="700" className={text}>
      {label}
    </text>
  </g>
);

export const Lines = ({ x, y, widths, gap = 16, h = 8, className = "sp-f-ink", opacity }) =>
  widths.map((w, i) => (
    <rect key={i} x={x} y={y + i * gap} width={w} height={h} rx={h / 2} className={className} fillOpacity={opacity} />
  ));

// A browser window frame; children draw the page inside (x 30..370, y 82..270).
export const Browser = ({ children, page = "sp-f-cream" }) => (
  <>
    <rect x="30" y="30" width="340" height="240" rx="10" className={page} stroke="#141414" strokeWidth="3" />
    <path d="M40 30H360A10 10 0 0 1 370 40V72H30V40A10 10 0 0 1 40 30Z" className="sp-f-ink" />
    <circle cx="54" cy="51" r="6" className="sp-f-cream" />
    <circle cx="74" cy="51" r="6" className="sp-f-cream" />
    <circle cx="94" cy="51" r="6" className="sp-f-cream" />
    {children}
  </>
);

// One sheet of paper with ruled lines.
export const Sheet = ({ x, y, w = 150, h = 200, lines = [100, 80, 92, 60], rotate = 0 }) => (
  <g transform={`rotate(${rotate} ${x + w / 2} ${y + h / 2})`}>
    <rect x={x} y={y} width={w} height={h} className="sp-f-cream" stroke="#141414" strokeWidth="3" />
    <Lines x={x + 20} y={y + 28} widths={lines} h={7} gap={18} opacity="0.35" />
  </g>
);
