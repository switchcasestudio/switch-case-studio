import { useCallback, useEffect, useId, useRef, useState } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';

/* 03 Type as a type tester (2026-10-25, owner: "something like this
   screenshot, interactive, dynamic and responsive", a foundry's tester
   with fewer visuals). One face, Roboto Flex (self-hosted, OFL), and five
   presets: the voice each made-up Portland business on this page got from
   the same variable file. A row of controls (preset, size, weight, width,
   spacing, line height, alignment, Breathe, reset), one big line anyone
   can click and type over, and the facts under it, read from the font
   file itself (13 axes, 221 glyphs).
   Dynamic: Breathe runs weight and width through their range while the
   tester is on screen and its state is showing; any slider or preset hands
   the axes back to the visitor. The loop writes CSS variables, the slider
   positions and the value labels straight to the DOM (no React render per
   frame) and syncs state when it stops. Off under reduced motion.
   Responsive: the size follows the tester's width until the visitor sets
   it; the row of controls wraps; stacked, it is a plain card. The SSR
   markup is the Hatch preset at rest. */

// Straight quotes only: the subset has no curly ones.
const PRESETS = [
  {
    key: 'hatch',
    name: 'Hatch',
    why: 'Condensed and black, like mugs packed on a kiln shelf.',
    text: 'Fired twice, glazed by hand, gone by Friday.',
    wght: 900,
    wdth: 35,
    slnt: 0,
    track: -1,
    lh: 0.95,
  },
  {
    key: 'lowtide',
    name: 'Lowtide',
    why: 'Light and wide, like water going out.',
    text: 'Low tide, slow pour. Open at six.',
    wght: 250,
    wdth: 140,
    slnt: 0,
    track: 2,
    lh: 1.1,
  },
  {
    key: 'meridian',
    name: 'Meridian',
    why: 'Bold and slanted: it leans like a rider in a turn.',
    text: 'Fixed at 7 am. Rolling by noon.',
    wght: 700,
    wdth: 90,
    slnt: -10,
    track: 0,
    lh: 1,
  },
  {
    key: 'fieldnote',
    name: 'Fieldnote',
    why: 'A book weight, set to be read for an hour.',
    text: 'Every book on this shelf was read by someone first.',
    wght: 420,
    wdth: 100,
    slnt: 0,
    track: 0,
    lh: 1.15,
  },
  {
    key: 'hum',
    name: 'Hum',
    why: 'As wide and as loud as the font goes.',
    text: 'Bring the song. We bring the room.',
    wght: 1000,
    wdth: 151,
    slnt: 0,
    track: -2,
    lh: 0.95,
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

// The size the line starts at: about a tenth of the tester's width.
const autoSize = (w) => Math.round(Math.min(170, Math.max(44, w * 0.1)));
const pick = ({ wght, wdth, slnt, track, lh }) => ({ wght, wdth, slnt, track, lh });

// Breathe: weight 200 to 950 over ~6s, width 40 to 145 over ~9s, entered at
// the phase that matches where the sliders are, so nothing jumps.
const WAVE = {
  wght: { mid: 575, amp: 375, w: (2 * Math.PI) / 6 },
  wdth: { mid: 92.5, amp: 52.5, w: (2 * Math.PI) / 9 },
};
const phaseOf = (k, v) => Math.asin(Math.max(-1, Math.min(1, (v - WAVE[k].mid) / WAVE[k].amp)));

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
  const live = useRef({ wght: PRESETS[0].wght, wdth: PRESETS[0].wdth });
  const sizeAuto = useRef(true);
  const edited = useRef(false);
  const [initialText] = useState(PRESETS[0].text);
  const [preset, setPreset] = useState(0);
  const [vals, setVals] = useState(() => ({ size: 110, ...pick(PRESETS[0]) }));
  const [align, setAlign] = useState('left');
  const [canBreathe, setCanBreathe] = useState(false);
  const [breathe, setBreathe] = useState(false);

  // Motion is opt-out: Breathe starts on unless the visitor asked for less.
  useEffect(() => {
    const ok = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanBreathe(ok);
    setBreathe(ok);
  }, []);

  // The size follows the tester's width until the visitor sets it.
  useIsomorphicLayoutEffect(() => {
    const el = sampleRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const fit = () => {
      if (sizeAuto.current) setVals((v) => ({ ...v, size: autoSize(el.clientWidth) }));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Hand the axes back: whatever Breathe reached becomes the state.
  const settle = useCallback(() => {
    setBreathe(false);
    setVals((v) => ({ ...v, wght: Math.round(live.current.wght), wdth: Math.round(live.current.wdth) }));
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
    const ph = { wght: 0, wdth: 0 };
    const showing = () => visible && !document.hidden && !(state && state.style.visibility === 'hidden');
    const frame = (now) => {
      raf = 0;
      if (!showing()) {
        t0 = 0;
        poll = setTimeout(loop, 400);
        return;
      }
      // (Re)entering: start each wave at the phase that matches the sliders.
      if (!t0) {
        ph.wght = phaseOf('wght', live.current.wght);
        ph.wdth = phaseOf('wdth', live.current.wdth);
        t0 = now - (ph.wght / WAVE.wght.w) * 1000;
      }
      const s = (now - t0) / 1000;
      const wght = Math.round(WAVE.wght.mid + WAVE.wght.amp * Math.sin(WAVE.wght.w * s));
      const wdth = Math.round(WAVE.wdth.mid + WAVE.wdth.amp * Math.sin(WAVE.wdth.w * s + ph.wdth - (WAVE.wdth.w * ph.wght) / WAVE.wght.w));
      if (wght !== live.current.wght || wdth !== live.current.wdth) {
        live.current = { wght, wdth };
        root.style.setProperty('--t-wght', wght);
        root.style.setProperty('--t-wdth', wdth);
        ['wght', 'wdth'].forEach((k) => {
          const v = live.current[k];
          if (inputs.current[k]) inputs.current[k].value = v;
          const lab = labels.current[k];
          if (lab && lab.firstChild) lab.firstChild.nodeValue = RANGES[k].fmt(v);
        });
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
    if (k === 'wght' || k === 'wdth') live.current = { ...live.current, [k]: v };
    setVals((s) => ({ ...s, [k]: v }));
  };

  const onPreset = (e) => {
    const i = +e.target.value;
    setBreathe(false);
    setPreset(i);
    live.current = { wght: PRESETS[i].wght, wdth: PRESETS[i].wdth };
    setVals((s) => ({ ...s, ...pick(PRESETS[i]) }));
    setSample(PRESETS[i].text);
  };

  const reset = () => {
    edited.current = false;
    sizeAuto.current = true;
    const p = PRESETS[preset];
    live.current = { wght: p.wght, wdth: p.wdth };
    setVals({ size: autoSize(sampleRef.current ? sampleRef.current.clientWidth : 1200), ...pick(p) });
    setAlign('left');
    setSample(p.text);
    setBreathe(canBreathe);
  };

  // While Breathe runs, the two axes it drives come from the loop.
  const shown = (k) => (breathe && (k === 'wght' || k === 'wdth') ? live.current[k] : vals[k]);
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
          <label className="bw-tester__lab" htmlFor={`${uid}-preset`}>
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
              <label className="bw-tester__lab" htmlFor={`${uid}-${k}`}>
                {r.label}
              </label>
              <span
                className="bw-tester__val"
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
                className="bw-tester__range"
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
          <span className="bw-tester__lab">Align</span>
          <div className="bw-tester__aligns" role="group" aria-label="Alignment">
            {ALIGNS.map((a) => (
              <button
                key={a}
                type="button"
                className={`bw-tester__icon${align === a ? ' is-on' : ''}`}
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
            <button type="button" className="bw-tester__icon" aria-label="Reset the tester" onClick={reset}>
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
          Type does half the talking. One variable font gave each concept its own voice: pick one, push the sliders, or
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
