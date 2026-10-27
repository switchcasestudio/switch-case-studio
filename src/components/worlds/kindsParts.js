/* The drawing parts of a "kinds" hero (2026-10-27), shared by the Web
   world's builds and the AI world's automations: every line is a `path`
   with `pathLength="1"` so it can draw itself in (rounded boxes through
   `rr()`, never `rect`, whose pathLength support is not universal). The
   classes carry the world's prefix (`wb`, `aw`); `kinds-hero` in
   _kindsHero.scss owns their colors and the draw-in. */

export const INTER = "Inter, 'Inter Fallback', sans-serif";

// A rounded box as a path, so it can draw itself in (pathLength 1).
export const rr = (x, y, w, h, r) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${
    y + h
  }H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
export const ring = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

export default function kindsParts(p, kinds) {
  // A line that draws itself; `a` draws it in the accent.
  const D = ({ d, a }) => <path className={`${p}-d${a ? ` ${p}-d--a` : ''}`} d={d} pathLength="1" />;
  const B = ({ x, y, w, h, r = 8 }) => <D d={rr(x, y, w, h, r)} />;
  const L = ({ x1, y1, x2, y2, a }) => <D d={`M${x1} ${y1}L${x2} ${y2}`} a={a} />;
  const O = ({ cx, cy, r, a }) => <D d={ring(cx, cy, r)} a={a} />;
  // An accent plate (the action on each screen), and its label in ink.
  const A = ({ x, y, w, h, r = 8, label, size = 20 }) => (
    <g className={`${p}-f`}>
      <path className={`${p}-a`} d={rr(x, y, w, h, r)} />
      {label && (
        <text className={`${p}-t ${p}-t--on`} x={x + w / 2} y={y + h / 2 + size * 0.36} fontSize={size} fontWeight="700" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
  // Text: `a` in the accent, `on` in ink (on an accent plate).
  const T = ({ x, y, size = 20, w = 500, a, on, anchor, children }) => (
    <text
      className={`${p}-t${a ? ` ${p}-t--a` : ''}${on ? ` ${p}-t--on` : ''}`}
      x={x}
      y={y}
      fontSize={size}
      fontWeight={w}
      textAnchor={anchor}
      letterSpacing={size >= 40 ? -1.5 : undefined}
    >
      {children}
    </text>
  );

  // Every kind's drawing for one screen, stacked; CSS shows the current one.
  function Kinds({ art, x, y }) {
    return (
      <g transform={`translate(${x} ${y})`}>
        {kinds.map((k) => {
          const Draw = art[k.key];
          return (
            <g key={k.key} className={`${p}-v ${p}-v--${k.key}`}>
              <Draw />
            </g>
          );
        })}
      </g>
    );
  }

  return { D, B, L, O, A, T, Kinds };
}
