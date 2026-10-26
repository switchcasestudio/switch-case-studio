/* The marks this page teaches with (2026-10-25, owner: "leave the five
   Portland made up brand idea aside ... talk about logo in general"). One
   neutral brand, "Your brand", drawn as each kind of logo: a symbol (an
   arch with a door), a lettermark, a wordmark, an emblem and the
   combination of symbol and name. Each draws in a 100 x 100 box in
   `currentColor`, so its host sets the color; the arch's door is a hole
   (even-odd), so the plate behind shows through. `small` is the cut for
   16 px: the door widens so it stays open, the emblem drops its words. */

export const INTER = "Inter, 'Inter Fallback', sans-serif";
export const NAME = 'Your brand';

const ARCH = 'M14 90V48A36 36 0 0 1 86 48V90Z';
const DOOR = 'M39 90V63A11 11 0 0 1 61 63V90Z';
const DOOR_SMALL = 'M33 90V60A17 17 0 0 1 67 60V90Z';

export function Arch({ small = false }) {
  return <path d={`${ARCH}${small ? DOOR_SMALL : DOOR}`} fillRule="evenodd" fill="currentColor" />;
}

export function Lettermark({ size = 50, y = 67, text = 'YB' }) {
  return (
    <text x="50" y={y} textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize={size} fontWeight="800" letterSpacing={-size * 0.04}>
      {text}
    </text>
  );
}

// The name stacked to fit a square.
export function WordmarkStack() {
  return (
    <g fill="currentColor" fontFamily={INTER} fontWeight="800" textAnchor="middle" letterSpacing="-1">
      <text x="50" y="46" fontSize="28">
        Your
      </text>
      <text x="50" y="74" fontSize="28">
        brand
      </text>
    </g>
  );
}

export function Emblem({ small = false }) {
  if (small) {
    return (
      <g fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="40" strokeWidth="12" />
        <circle cx="50" cy="50" r="9" fill="currentColor" stroke="none" />
      </g>
    );
  }
  return (
    <g>
      <g fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="45" strokeWidth="5" />
        <circle cx="50" cy="50" r="37" strokeWidth="1.5" />
      </g>
      <path d="M30 37H70M30 70H70" stroke="currentColor" strokeWidth="1.5" />
      <g fill="currentColor" fontFamily={INTER} fontWeight="800" textAnchor="middle" letterSpacing="1.5">
        <text x="50" y="51" fontSize="14">
          YOUR
        </text>
        <text x="50" y="65" fontSize="14">
          BRAND
        </text>
      </g>
    </g>
  );
}

// A mark placed at (x, y) and scaled from its 100 box to `size`.
export function At({ x, y, size, children }) {
  return <g transform={`translate(${x} ${y}) scale(${size / 100})`}>{children}</g>;
}

// The name as type, at an SVG position.
export function Name({ x, y, size, anchor = 'start', weight = 800, text = NAME }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill="currentColor" fontFamily={INTER} fontSize={size} fontWeight={weight} letterSpacing={-size * 0.04}>
      {text}
    </text>
  );
}
