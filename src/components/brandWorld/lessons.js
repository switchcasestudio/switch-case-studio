import { useEffect, useId, useRef, useState } from 'react';
import { Arch, INTER, NAME } from './marks';

/* The lessons of the brand world's stage (2026-10-25, owner: "We are
   authority in what we're doing ... marks, logos, fonts, colors, rhythm,
   composition ... let's talk about logo in general, fonts in general").
   One live demo per principle, each small enough to sit in a stage tile
   and plain enough to stack on a phone: 01 Logo (one mark at a real pixel
   size, and the cut that size gets), 03 Color (a palette in 60/30/10 with
   live WCAG contrast), 04 Rhythm (a type scale from one ratio on an 8 px
   grid), 05 Composition (a poster with thirds and a grid, and a focal
   point to drag). 02 Type is TypeTester. Nothing moves until the visitor
   does something (owner, same day: "doing toooo much"). Each demo draws
   in its plate's currentColor; the stickers are small SVG fact plates. */

/* ---- 01 Logo: the same mark at a real size ---- */

// Lockup width in units of the symbol's size: symbol, gap, ten letters at
// half the size, clear space on both sides.
const LOCKUP = 4.5;
const cutOf = (px) => (px < 32 ? 'small' : px < 56 ? 'symbol' : 'lockup');
const CUTS = {
  small: 'The small cut: no name, and the door is drawn wider so it stays open.',
  symbol: 'The symbol alone. The name would be too small to read here.',
  lockup: 'The full lockup, the name beside the symbol.',
};

export function LogoSize() {
  const id = useId();
  const stageRef = useRef(null);
  const [px, setPx] = useState(64);
  const [max, setMax] = useState(128);
  const [space, setSpace] = useState(true);

  // The biggest size whose lockup still fits the stage.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      const m = Math.max(56, Math.min(160, Math.floor(el.clientWidth / LOCKUP)));
      setMax(m);
      setPx((p) => Math.min(p, m));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cut = cutOf(px);
  return (
    <div className="bw-lesson bw-lesson--dark bw-logo">
      <div className="bw-lesson__bar">
        <div className="bw-lesson__ctl">
          <label className="bw-ui__lab" htmlFor={`${id}-px`}>
            Size
          </label>
          <span className="bw-ui__val" aria-hidden="true">
            {px}px
          </span>
          <input
            id={`${id}-px`}
            className="bw-ui__range"
            type="range"
            min={12}
            max={max}
            value={px}
            aria-valuetext={`${px} pixels`}
            onChange={(e) => setPx(+e.target.value)}
          />
        </div>
        <button type="button" className={`bw-lesson__toggle${space ? ' is-on' : ''}`} aria-pressed={space} onClick={() => setSpace(!space)}>
          Clear space
        </button>
      </div>
      <div ref={stageRef} className="bw-logo__stage">
        <div className={`bw-logo__lockup${space ? ' is-space' : ''}`} style={{ '--s': `${px}px` }}>
          <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" style={{ width: px, height: px }}>
            <Arch small={cut === 'small'} />
          </svg>
          {cut === 'lockup' && <span className="bw-logo__name">{NAME}</span>}
        </div>
      </div>
      <p className="bw-lesson__note" aria-live="polite">
        <strong>{px} px.</strong> {CUTS[cut]}
      </p>
    </div>
  );
}

/* ---- 03 Color: proportion and contrast ---- */

const PALETTE = [
  { name: 'Ink', hex: '#141414' },
  { name: 'Cream', hex: '#fef7ed' },
  { name: 'Lavender', hex: '#dab8ff' },
  { name: 'Orange', hex: '#ff834a' },
  { name: 'Blue', hex: '#1748ef' },
];
const ROLES = [
  { key: 'base', label: 'Base, 60%' },
  { key: 'support', label: 'Support, 30%' },
  { key: 'accent', label: 'Accent, 10%' },
];

// WCAG 2 relative luminance and contrast ratio.
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const verdict = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'large text only' : 'fails');
// The label on the accent: whichever of ink and cream reads better.
const labelOn = (hex) => (contrast(hex, PALETTE[0].hex) >= contrast(hex, PALETTE[1].hex) ? PALETTE[0].hex : PALETTE[1].hex);

export function ColorMix() {
  const [pick, setPick] = useState({ base: 1, support: 0, accent: 3 });
  const c = { base: PALETTE[pick.base].hex, support: PALETTE[pick.support].hex, accent: PALETTE[pick.accent].hex };
  const text = contrast(c.support, c.base);
  const label = labelOn(c.accent);
  const btn = contrast(label, c.accent);
  return (
    <div className="bw-lesson bw-lesson--light bw-color">
      <div className="bw-color__mock" style={{ background: c.base, color: c.support }} aria-hidden="true">
        <div className="bw-color__panel" style={{ background: c.support }} />
        <p className="bw-color__head">Open late on Fridays.</p>
        <p className="bw-color__body">Text in the support color, on the base.</p>
        <span className="bw-color__btn" style={{ background: c.accent, color: label }}>
          Book now
        </span>
      </div>
      <div className="bw-color__side">
        {ROLES.map((role) => (
          <div key={role.key} className="bw-color__role" role="radiogroup" aria-label={role.label}>
            <span className="bw-ui__lab">{role.label}</span>
            <div className="bw-color__swatches">
              {PALETTE.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  role="radio"
                  aria-checked={pick[role.key] === i}
                  aria-label={p.name}
                  className={`bw-color__swatch${pick[role.key] === i ? ' is-on' : ''}`}
                  style={{ background: p.hex }}
                  onClick={() => setPick({ ...pick, [role.key]: i })}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="bw-color__bar" aria-hidden="true">
          <i style={{ background: c.base, flexGrow: 6 }} />
          <i style={{ background: c.support, flexGrow: 3 }} />
          <i style={{ background: c.accent, flexGrow: 1 }} />
        </div>
        <dl className="bw-color__checks" aria-live="polite">
          <div>
            <dt>Text on base</dt>
            <dd>
              {text.toFixed(1)}:1, {verdict(text)}
            </dd>
          </div>
          <div>
            <dt>Button label</dt>
            <dd>
              {btn.toFixed(1)}:1, {verdict(btn)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ---- 04 Rhythm: one ratio, one unit ---- */

const RATIOS = [
  { r: 1.2, name: 'Minor third' },
  { r: 1.25, name: 'Major third' },
  { r: 1.333, name: 'Perfect fourth' },
  { r: 1.5, name: 'Perfect fifth' },
  { r: 1.618, name: 'Golden ratio' },
];
const STEPS = [
  ['H1', 4],
  ['H2', 3],
  ['H3', 2],
  ['H4', 1],
  ['Body', 0],
  ['Small', -1],
];
const BASE = 16;

export function TypeScale() {
  const listRef = useRef(null);
  const [ri, setRi] = useState(1);
  const [grid, setGrid] = useState(true);
  const [k, setK] = useState(1);
  const { r, name } = RATIOS[ri];
  const sizes = STEPS.map(([label, n]) => [label, Math.round(BASE * r ** n)]);

  // Shown smaller, and said so, when the whole scale would not fit: by
  // width always (the H1 row is the widest), by height only on the pinned
  // stage, where the tile's height is fixed. Stacked, the list's height
  // follows its content, so fitting to it would shrink it forever.
  useEffect(() => {
    const el = listRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const pinned = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    const { r: ratio } = RATIOS[ri];
    const h1 = BASE * ratio ** STEPS[0][1];
    const need = STEPS.reduce((sum, [, n]) => sum + Math.max(BASE * ratio ** n * 1.15, 14), 0);
    const fit = () => {
      const byWidth = (el.clientWidth - 100) / (h1 * 3.4);
      const byHeight = pinned.matches ? el.clientHeight / need : 1;
      setK(Math.min(1, byWidth, byHeight));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ri]);

  return (
    <div className="bw-lesson bw-lesson--dark bw-scale">
      <div className="bw-lesson__bar">
        <div className="bw-scale__ratios" role="radiogroup" aria-label="Scale ratio">
          {RATIOS.map((x, i) => (
            <button
              key={x.r}
              type="button"
              role="radio"
              aria-checked={ri === i}
              className={`bw-lesson__chip${ri === i ? ' is-on' : ''}`}
              onClick={() => setRi(i)}
            >
              {x.r}
            </button>
          ))}
        </div>
        <button type="button" className={`bw-lesson__toggle${grid ? ' is-on' : ''}`} aria-pressed={grid} onClick={() => setGrid(!grid)}>
          8 px grid
        </button>
      </div>
      <ol ref={listRef} className={`bw-scale__list${grid ? ' is-grid' : ''}`} style={{ '--k': k }}>
        {sizes.map(([label, px]) => (
          <li key={label} style={{ '--px': `${px}px` }}>
            <span className="bw-scale__tag">
              {label} <b>{px}</b>
            </span>
            <span className="bw-scale__word">Rhythm</span>
          </li>
        ))}
      </ol>
      <p className="bw-lesson__note" aria-live="polite">
        <strong>{name}.</strong> Every size is {BASE} px times {r} again{k < 1 ? `, shown at ${Math.round(k * 100)}%` : ''}.
      </p>
    </div>
  );
}

/* ---- 05 Composition: where the eye lands ---- */

const THIRDS = [100 / 3, 200 / 3];
const SNAP = 6;
const nearThird = (x, y) => {
  let best = null;
  THIRDS.forEach((tx) =>
    THIRDS.forEach((ty) => {
      const d = Math.hypot(x - tx, y - ty);
      if (d < SNAP && (!best || d < best.d)) best = { x: tx, y: ty, d };
    }),
  );
  return best;
};
const clamp = (v) => Math.min(92, Math.max(8, v));
const noteFor = (x, y) => {
  if (nearThird(x, y)) return 'On a third. The eye lands here first, and the empty side gives it room.';
  if (Math.abs(x - 50) < 6 && Math.abs(y - 50) < 6) return 'Dead center: stable, and still. Drag it onto a third.';
  return 'Off the thirds. That can be right on purpose; by accident it reads as unsure.';
};

export function Composition() {
  const frameRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [show, setShow] = useState({ thirds: true, grid: false });
  const [drag, setDrag] = useState(false);

  const place = (e) => {
    const r = frameRef.current.getBoundingClientRect();
    return { x: clamp(((e.clientX - r.left) / r.width) * 100), y: clamp(((e.clientY - r.top) / r.height) * 100) };
  };
  const settle = (p) => {
    const t = nearThird(p.x, p.y);
    setPos(t ? { x: t.x, y: t.y } : p);
  };
  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag(true);
  };
  const onMove = (e) => {
    if (drag) setPos(place(e));
  };
  const onUp = (e) => {
    if (!drag) return;
    setDrag(false);
    settle(place(e));
  };
  const onKey = (e) => {
    const step = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[e.key];
    if (!step) return;
    e.preventDefault();
    settle({ x: clamp(pos.x + step[0]), y: clamp(pos.y + step[1]) });
  };

  return (
    <div className="bw-lesson bw-lesson--light bw-comp">
      <div className="bw-lesson__bar">
        <span className="bw-ui__lab">Show</span>
        {[
          ['thirds', 'Thirds'],
          ['grid', '12 columns'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`bw-lesson__toggle${show[key] ? ' is-on' : ''}`}
            aria-pressed={show[key]}
            onClick={() => setShow({ ...show, [key]: !show[key] })}
          >
            {label}
          </button>
        ))}
      </div>
      <div ref={frameRef} className={`bw-comp__frame${drag ? ' is-drag' : ''}`}>
        {show.grid && (
          <div className="bw-comp__grid" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        )}
        {show.thirds && (
          <svg className="bw-comp__thirds" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
            <path d="M100 0V200M200 0V200M0 66.67H300M0 133.33H300" />
          </svg>
        )}
        <div className="bw-comp__copy" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <button
          type="button"
          className="bw-comp__focal"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          aria-label={`Focal point at ${Math.round(pos.x)}% across, ${Math.round(pos.y)}% down. Drag it, or use the arrow keys.`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <Arch />
          </svg>
        </button>
      </div>
      <p className="bw-lesson__note" aria-live="polite">
        {noteFor(pos.x, pos.y)}
      </p>
    </div>
  );
}

/* ---- Stickers: one fact per plate ---- */

// Sticker plates show at about half their 400 width, so type starts at 18.
const META = { fontFamily: INTER, fontSize: 18, fontWeight: 700, letterSpacing: 2 };

export function PaletteCard() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      {PALETTE.map((p, i) => (
        <g key={p.name} transform={`translate(28 ${24 + i * 46})`}>
          <rect width="84" height="36" rx="6" fill={p.hex} stroke="#fef7ed" strokeOpacity={p.name === 'Ink' ? 0.35 : 0} />
          <text x="100" y="26" className="bw-f-cream" fontFamily={INTER} fontSize="22" fontWeight="600">
            {p.name}
          </text>
          <text x="366" y="26" textAnchor="end" className="bw-f-cream" fontFamily={INTER} fontSize="19" opacity="0.7">
            {p.hex}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        NAMES AND CODES
      </text>
    </svg>
  );
}

export function SpacingScale() {
  const units = [4, 8, 16, 24, 32, 48, 64];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      {units.map((u, i) => (
        <g key={u} transform={`translate(28 ${22 + i * 33})`}>
          <text x="0" y="22" className="bw-f-cream" fontFamily={INTER} fontSize="22" fontWeight="600" opacity="0.75">
            {u}
          </text>
          <rect x="52" y="4" width={u * 4.4} height="22" rx="3" className="bw-f-lavender" />
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        ONE UNIT, MULTIPLIED
      </text>
    </svg>
  );
}

export function ReadingOrder() {
  const dots = [
    [70, 70, '1'],
    [330, 70, '2'],
    [70, 200, '3'],
    [330, 200, '4'],
  ];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-cream" />
      <path d="M70 70H330L70 200H330" fill="none" className="bw-s-ink" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      {dots.map(([x, y, n]) => (
        <g key={n}>
          <circle cx={x} cy={y} r="24" className="bw-f-ink" />
          <text x={x} y={y + 7} textAnchor="middle" className="bw-f-cream" fontFamily={INTER} fontSize="20" fontWeight="700">
            {n}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-ink" {...META}>
        A SPARSE PAGE READS IN A Z
      </text>
    </svg>
  );
}
