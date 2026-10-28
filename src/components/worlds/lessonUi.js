/* The lessons' two controls (2026-10-27), lifted out of the AI world's
   lessons so the SEO world's run the same ones: a labeled slider with its
   value pill (`bw-lesson__ctl` + the shared `.bw-ui` set) and a pill
   toggle (`bw-lesson__toggle`). Styles in brandWorld.scss. */

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
