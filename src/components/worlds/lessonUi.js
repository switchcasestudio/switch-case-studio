/* The lessons' two controls (2026-10-27), lifted out of the AI world's
   lessons so the SEO world's run the same ones: a labeled slider with its
   value pill (`bw-lesson__ctl` + the shared `.bw-ui` set) and a pill
   toggle (`bw-lesson__toggle`). Styles in brandWorld.scss. The fact plate
   (a sticker: kicker, up to four rows, footer) joined them on 2026-11-18,
   lifted out of the SEO world's lessons for the Content world's. */

const INTER = "Inter, 'Inter Fallback', sans-serif";
const META = { fontFamily: INTER, fontSize: 18, fontWeight: 700, letterSpacing: 2 };


export function Range({ id, label, value, min, max, step = 1, show, text, onChange }) {
  return (
    <div className="bw-lesson__ctl">
      <label className="bw-ui__lab" htmlFor={id}>
        {label}
      </label>
      <span className="bw-ui__val" aria-hidden="true">
        {show}
      </span>
      <input
        id={id}
        className="bw-ui__range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}

export const Toggle = ({ on, onClick, children }) => (
  <button type="button" className={`bw-lesson__toggle${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onClick}>
    {children}
  </button>
);

// A fact plate: a kicker, up to four rows and a footer, cream on ink.
export function Plate({ kicker, rows, foot, mark = 'dot' }) {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        {kicker}
      </text>
      {rows.map((s, i) => (
        <g key={s} transform={`translate(28 ${74 + i * 46})`}>
          {mark === 'dot' ? (
            <circle cx="11" cy="14" r="11" className="bw-f-orange" />
          ) : (
            <text y="22" className="bw-f-orange" fontFamily={INTER} fontSize="26" fontWeight="800">
              {i + 1}
            </text>
          )}
          <text x={mark === 'dot' ? 38 : 40} y="21" className="bw-f-cream" fontFamily={INTER} fontSize="20" fontWeight="600">
            {s}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        {foot}
      </text>
    </svg>
  );
}
