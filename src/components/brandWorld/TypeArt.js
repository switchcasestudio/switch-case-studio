import { useState } from 'react';
import TextPressure from '../ui/TextPressure';

/* The Type state's art and sticker (2026-10-25: the type stage that sat
   under the hero moved into 03 Type, owner: "the content can replace the
   5th section"). The house TextPressure (Roboto Flex, variable
   wght/wdth/slnt) warps a concept's name under the pointer; on touch it
   runs off the scroll. The name pills swap the word. The sticker is the
   weight ramp of the same face. Ink on the state's lavender field. */
const NAMES = ['Hatch', 'Lowtide', 'Meridian', 'Fieldnote', 'Hum'];
// Roboto Flex has a continuous weight axis (100 to 1000), so the ramp uses
// steps a reader can tell apart. Inter's static 400/500 and 600/700 pairs
// could not (owner, 2026-10-22).
const WEIGHTS = [100, 300, 500, 700, 900];

export function TypeWord() {
  const [name, setName] = useState(NAMES[0]);
  return (
    <div className="bw-typeword">
      {/* TextPressure sizes its type from the container width (W / (chars/2)),
          so the box is sized by the name: a word lands near 28% of the tile
          tall, the longest at the tile's full width. */}
      <div
        className="bw-typeword__word"
        aria-hidden="true"
        style={{ maxWidth: `${Math.min(100, name.length * 14)}%` }}
      >
        <TextPressure key={name} text={name} width weight italic stroke={false} textColor="#141414" minFontSize={32} />
      </div>
      <div className="bw-typeword__pills" role="group" aria-label="Pick a concept">
        {NAMES.map((n) => (
          <button
            key={n}
            type="button"
            className={`bw-typeword__pill${n === name ? ' is-on' : ''}`}
            aria-pressed={n === name}
            onClick={() => setName(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function WeightRamp() {
  return (
    <ul className="bw-ramp" aria-label="Roboto Flex from weight 100 to 900">
      {WEIGHTS.map((w) => (
        <li key={w} style={{ fontVariationSettings: `'wght' ${w}` }}>
          <span className="bw-ramp__w">{w}</span> Rolling by noon.
        </li>
      ))}
    </ul>
  );
}
