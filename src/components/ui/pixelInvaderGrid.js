/* The 👾 as glowing pixel tiles (2026-11-05, owner's references: OpenMoji,
   Apple, Facebook). A 16×14 drawing in their shared shape (OpenMoji's outline as the
   guide): two head bumps, tall raised arms set off the body by a gap, two
   tall dark eyes, an arch between the legs, feet stepping out, in a dark
   outline; tiles run light lavender (top) to deep violet (bottom), and the
   tips carry highlight pixels. The SVG poster and the three.js scene both
   draw from this grid.
   X body · H highlight · E eye · . empty */
export const GRID = [
  '.....HH..HH.....',
  '.....XX..XX.....',
  'HH..XXXXXXXX..HH',
  'XX.XXXXXXXXXX.XX',
  'XX.XXXXXXXXXX.XX',
  'XX.XXEXXXXEXX.XX',
  'XX.XXEXXXXEXX.XX',
  'XX.XXEXXXXEXX.XX',
  '.XXXXXXXXXXXXXX.',
  '...XXXXXXXXXX...',
  '...XXXXXXXXXX...',
  '...XXX....XXX...',
  '..XX........XX..',
  '..XX........XX..',
];

export const W = GRID[0].length;
export const H = GRID.length;

export const PALETTE = {
  top: '#d3b0ff', // lit lavender
  bottom: '#7d3cf0', // deep violet
  highlight: '#f1e4ff',
  outline: '#1b1622',
  eye: '#140f1c',
};

const at = (x, y) => (GRID[y] && GRID[y][x]) || '.';

// Every drawn cell: { x, y, kind } with kind body | highlight | eye.
export const CELLS = GRID.flatMap((row, y) =>
  [...row].flatMap((c, x) => {
    const kind = { X: 'body', H: 'highlight', E: 'eye' }[c];
    return kind ? [{ x, y, kind }] : [];
  }),
);

// The outline: every empty cell touching a drawn one (8 ways).
export const OUTLINE = (() => {
  const out = [];
  for (let y = -1; y <= H; y += 1) {
    for (let x = -1; x <= W; x += 1) {
      if (at(x, y) !== '.') continue;
      let touch = false;
      for (let dy = -1; dy <= 1 && !touch; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (at(x + dx, y + dy) !== '.' && at(x + dx, y + dy) !== 'E') {
            touch = true;
            break;
          }
        }
      }
      if (touch) out.push({ x, y });
    }
  }
  return out;
})();

// A tile's color: the top-to-bottom ramp, or the highlight.
export function tileColor(kind, y, palette, mix) {
  if (kind === 'highlight') return palette.highlight;
  return mix(palette.top, palette.bottom, y / (H - 1));
}

// Hex blend for the SVG poster (three.js uses its own Color.lerp).
export function mixHex(a, b, t) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [ra, ga, ba] = p(a);
  const [rb, gb, bb] = p(b);
  const c = (u, v) => Math.round(u + (v - u) * t).toString(16).padStart(2, '0');
  return `#${c(ra, rb)}${c(ga, gb)}${c(ba, bb)}`;
}
