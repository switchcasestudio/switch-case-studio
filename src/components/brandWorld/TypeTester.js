import { useCallback, useEffect, useId, useRef, useState } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';

/* 03 Type as a type tester (2026-10-25, owner: "something like this
   screenshot, interactive, dynamic and responsive", a foundry's tester
   with fewer visuals). One face, Roboto Flex (self-hosted, OFL), and five
   presets, one per job type does (headline, body text, caption, signage,
   display), each with the reason it is set that way. A row of controls (preset, size, weight, width,
   spacing, line height, alignment, Breathe, reset), one big line anyone
   can click and type over, and the facts under it, read from the font
   file itself (13 axes, 221 glyphs).
   Dynamic on request: nothing moves until the visitor presses Breathe,
   which swings the weight slowly while the tester is on screen and its
   state is showing; any slider or preset hands the axis back. The loop
   writes the CSS variable, the slider and its label straight to the DOM
   (no React render per frame) and syncs state when it stops. Not offered
   under reduced motion.
   Responsive: the size follows the tester's width until the visitor sets
   it; the row of controls wraps; stacked, it is a plain card. The SSR
   markup is the Headline preset at rest. */

// Five presets, one per job a typeface does (owner, 2026-10-25: type in
// general, not the Portland concepts). `fit` scales the size from the
// tester's width, because body text and captions only make sense small.
// Straight quotes only: the subset has no curly ones.
const PRESETS = [
  {
    key: 'headline',
    name: 'Headline',
    why: 'Heavy and tight. It is read in one look, so it can afford to be loud.',
    text: 'Good type makes the first second count.',
    fit: 1,
    wght: 800,
    wdth: 100,
    slnt: 0,
    track: -2,
    lh: 1,
  },
  {
    key: 'body',
    name: 'Body text',
    why: 'Regular weight, open lines, short measure: built to be read for minutes, not seconds.',
    text: 'Body text is read for minutes, not seconds. It wants a calm weight, a line height near one and a half, and lines that stop before they get long.',
    fit: 0.3,
    wght: 400,
    wdth: 100,
    slnt: 0,
    track: 0,
    lh: 1.5,
  },
  {
    key: 'caption',
    name: 'Caption',
    why: 'Small and a little open: tight spacing closes up at small sizes.',
    text: 'Fig. 3. The same mark at 16, 32 and 64 pixels. Small type gets a little more space between letters.',
    fit: 0.22,
    wght: 500,
    wdth: 100,
    slnt: 0,
    track: 1,
    lh: 1.4,
  },
  {
    key: 'signage',
    name: 'Signage',
    why: 'Condensed and bold: more letters fit the sign, and each still reads from across the street.',
    text: 'OPEN 7 DAYS. PARKING IN BACK.',
    fit: 1,
    wght: 700,
    wdth: 60,
    slnt: 0,
    track: 2,
    lh: 1,
  },
  {
    key: 'display',
    name: 'Display',
    why: 'As wide and as heavy as the font goes, for a few words at a large size.',
    text: 'Big, wide, few.',
    fit: 1.15,
    wght: 1000,
    wdth: 151,
    slnt: 0,
    track: -3,
    lh: 0.92,
  },
];

const RANGES = {
  size: { min: 24, max: 220, step: 1, label: 'Size', fmt: (v) => `${v}px`, say: (v) => `${v} pixels` },
  wght: { min: 100, max: 1000, step: 1, label: 'Weight', fmt: (v) => `${v}`, say: (v) => `${v}` },
  wdth: { min: 25, max: 151, step: 1, label: 'Width', fmt: (v) => `${v}%`, say: (v) => `${v} percent` },
  track: { min: -10, max: 20, step: 1, label: 'Spacing', fmt: (v) => `${v < 0 ? '\u2212' : ''}${Math.abs(v)}px`, say: (v) => `${v} pixels` },
  lh: { min: 0.8, max: 1.8, step: 0.05, label: 'Height', fmt: (v) => `${+v.toFixed(2)}`, say: (v) => `${+v.toFixed(2)}` },
};
const SLIDERS = ['size', 'wght', 'wdth', 'track', 'lh'];
const ALIGNS = ['left', 'center', 'right'];

// The size a preset starts at: a tenth of the tester's width, times its
// fit, with a floor that keeps body text and captions readable.
const autoSize = (w, fit = 1) => Math.round(Math.min(190, Math.max(fit < 1 ? 16 : 44, w * 0.1 * fit)));
const pick = ({ wght, wdth, slnt, track, lh }) => ({ wght, wdth, slnt, track, lh });

// Breathe: weight only, 160 either side of where it starts, once every 10s
// (owner, 2026-10-25: "constantly shaking and moving... doing toooo much";
// width swung too, and every width step re-wrapped the lines). Entered at
// the phase that matches the slider, so nothing jumps.
const AMP = 160;
const OMEGA = (2 * Math.PI) / 10;

// Three rules of 16, 10 and 14 units, set the way the button aligns.
function AlignIcon({ align }) {
  const start = (len) => (align === 'left' ? 4 : align === 'right' ? 20 - len : 12 - len / 2);
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {[16, 10, 14].map((len, i) => (
        <path key={len} d={`M${start(len)} ${7 + i * 5}h${len}`} />
      ))}
    </svg>
  );
}

export default function TypeTester() {
  const uid = useId();
  const rootRef = useRef(null);
  const sampleRef = useRef(null);
  const inputs = useRef({});
  const labels = useRef({});
  const live = useRef({ wght: PRESETS[0].wght });
  const sizeAuto = useRef(true);
  const fitRef = useRef(PRESETS[0].fit);
  const edited = useRef(false);
  const [initialText] = useState(PRESETS[0].text);
  const [preset, setPreset] = useState(0);
  const [vals, setVals] = useState(() => ({ size: 110, ...pick(PRESETS[0]) }));
  const [align, setAlign] = useState('left');
  const [canBreathe, setCanBreathe] = useState(false);
  const [breathe, setBreathe] = useState(false);

  // Breathe waits for a press, and is not offered under reduced motion.
  useEffect(() => {
    setCanBreathe(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // The size follows the tester's width until the visitor sets it.
  useIsomorphicLayoutEffect(() => {
    const el = sampleRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    // Width only: the line's height changes with every axis step.
    let width = 0;
    const fit = () => {
      if (!sizeAuto.current || el.clientWidth === width) return;
      width = el.clientWidth;
      setVals((v) => ({ ...v, size: autoSize(width, fitRef.current) }));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Hand the axes back: whatever Breathe reached becomes the state.
  const settle = useCallback(() => {
    setBreathe(false);
    setVals((v) => ({ ...v, wght: Math.round(live.current.wght) }));
  }, []);

  // The Breathe loop. Runs while it is on, the tester is on screen, the tab
  // is visible and the pinned stage is showing this state (GSAP hides the
  // others with an inline `visibility: hidden`); polls slowly otherwise.
  useEffect(() => {
    if (!breathe) return undefined;
    const root = rootRef.current;
    const state = root && root.closest('.bw-state');
    let raf = 0;
    let poll = 0;
    let visible = false;
    let t0 = 0;
    let mid = 0;
    const showing = () => visible && !document.hidden && !(state && state.style.visibility === 'hidden');
    const frame = (now) => {
      raf = 0;
      if (!showing()) {
        t0 = 0;
        poll = setTimeout(loop, 400);
        return;
      }
      // (Re)entering: center the wave inside the axis and start it at the
      // phase that matches the slider.
      if (!t0) {
        const cur = live.current.wght;
        mid = Math.min(1000 - AMP, Math.max(100 + AMP, cur));
        t0 = now - (Math.asin(Math.max(-1, Math.min(1, (cur - mid) / AMP))) / OMEGA) * 1000;
      }
      const wght = Math.round(mid + AMP * Math.sin((OMEGA * (now - t0)) / 1000));
      if (wght !== live.current.wght) {
        live.current = { wght };
        root.style.setProperty('--t-wght', wght);
        if (inputs.current.wght) inputs.current.wght.value = wght;
        const lab = labels.current.wght;
        if (lab && lab.firstChild) lab.firstChild.nodeValue = RANGES.wght.fmt(wght);
      }
      raf = requestAnimationFrame(frame);
    };
    const loop = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      clearTimeout(poll);
      if (visible) loop();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(root);
    return () => {
      io.disconnect();
      clearTimeout(poll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [breathe]);

  const setSample = (text) => {
    if (sampleRef.current && !edited.current) sampleRef.current.textContent = text;
  };

  const onSlide = (k) => (e) => {
    const v = k === 'lh' ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
    if (k === 'size') sizeAuto.current = false;
    if (breathe) settle();
    if (k === 'wght') live.current = { wght: v };
    setVals((s) => ({ ...s, [k]: v }));
  };

  const onPreset = (e) => {
    const i = +e.target.value;
    setBreathe(false);
    setPreset(i);
    live.current = { wght: PRESETS[i].wght };
    // A preset sets its own size; the visitor's Size wins only until then.
    sizeAuto.current = true;
    fitRef.current = PRESETS[i].fit;
    const w = sampleRef.current ? sampleRef.current.clientWidth : 1200;
    setVals((s) => ({ ...s, size: autoSize(w, PRESETS[i].fit), ...pick(PRESETS[i]) }));
    setSample(PRESETS[i].text);
  };

  const reset = () => {
    edited.current = false;
    sizeAuto.current = true;
    const p = PRESETS[preset];
    live.current = { wght: p.wght };
    fitRef.current = p.fit;
    setVals({ size: autoSize(sampleRef.current ? sampleRef.current.clientWidth : 1200, p.fit), ...pick(p) });
    setAlign('left');
    setSample(p.text);
    setBreathe(false);
  };

  // While Breathe runs, the axis it drives comes from the loop.
  const shown = (k) => (breathe && k === 'wght' ? live.current.wght : vals[k]);
  const p = PRESETS[preset];

  return (
    <div
      ref={rootRef}
      className={`bw-tester${breathe ? ' is-breathing' : ''}`}
      style={{
        '--t-size': `${vals.size}px`,
        '--t-wght': shown('wght'),
        '--t-wdth': shown('wdth'),
        '--t-slnt': vals.slnt,
        '--t-track': `${vals.track}px`,
        '--t-lh': vals.lh,
        '--t-align': align,
      }}
    >
      <div className="bw-tester__bar">
        <div className="bw-tester__ctl bw-tester__ctl--face">
          <label className="bw-ui__lab" htmlFor={`${uid}-preset`}>
            Roboto Flex
          </label>
          <select id={`${uid}-preset`} className="bw-tester__select" value={preset} onChange={onPreset}>
            {PRESETS.map((x, i) => (
              <option key={x.key} value={i}>
                {x.name}
              </option>
            ))}
          </select>
        </div>

        {SLIDERS.map((k) => {
          const r = RANGES[k];
          const v = shown(k);
          return (
            <div key={k} className="bw-tester__ctl">
              <label className="bw-ui__lab" htmlFor={`${uid}-${k}`}>
                {r.label}
              </label>
              <span
                className="bw-ui__val"
                aria-hidden="true"
                ref={(el) => {
                  labels.current[k] = el;
                }}
              >
                {r.fmt(v)}
              </span>
              <input
                id={`${uid}-${k}`}
                ref={(el) => {
                  inputs.current[k] = el;
                }}
                className="bw-ui__range"
                type="range"
                min={r.min}
                max={r.max}
                step={r.step}
                value={v}
                aria-valuetext={r.say(v)}
                onChange={onSlide(k)}
              />
            </div>
          );
        })}

        <div className="bw-tester__ctl bw-tester__ctl--tools">
          <span className="bw-ui__lab">Align</span>
          <div className="bw-tester__aligns" role="group" aria-label="Alignment">
            {ALIGNS.map((a) => (
              <button
                key={a}
                type="button"
                className={`bw-ui__icon${align === a ? ' is-on' : ''}`}
                aria-pressed={align === a}
                aria-label={`Align ${a}`}
                onClick={() => setAlign(a)}
              >
                <AlignIcon align={a} />
              </button>
            ))}
          </div>
          <div className="bw-tester__row">
            {canBreathe && (
              <button
                type="button"
                className={`bw-tester__breathe${breathe ? ' is-on' : ''}`}
                aria-pressed={breathe}
                onClick={() => (breathe ? settle() : setBreathe(true))}
              >
                <i aria-hidden="true" />
                Breathe
              </button>
            )}
            <button type="button" className="bw-ui__icon" aria-label="Reset the tester" onClick={reset}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M19 12a7 7 0 1 1-2.05-4.95M19 4v4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={sampleRef}
        className="bw-tester__sample"
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-multiline="true"
        aria-label="Sample text. Type to try your own."
        onInput={() => {
          edited.current = true;
        }}
      >
        {initialText}
      </div>

      <div className="bw-tester__foot">
        <p className="bw-tester__about">
          Type does half the talking. One variable font, set five ways for five jobs: pick a job, push the sliders, or
          click the line and type your own.
        </p>
        <ul className="bw-tester__facts">
          <li>13 axes</li>
          <li>221 glyphs, Latin</li>
          <li>Open Font License</li>
        </ul>
        <p className="bw-tester__why" aria-live="polite">
          <strong>{p.name}.</strong> {p.why}
        </p>
      </div>
    </div>
  );
}
