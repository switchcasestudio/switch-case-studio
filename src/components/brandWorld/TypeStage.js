import { useState } from 'react';
import TextPressure from '../ui/TextPressure';

/* Typography stage (2026-10-22). The house TextPressure (Roboto Flex,
   variable wght/wdth/slnt) warps a concept's name under the pointer; on
   touch it runs off the scroll. The name pills swap the word. Under it,
   the two faces every concept on this page uses, at the weights they ship. */
const NAMES = ['Hatch', 'Lowtide', 'Meridian', 'Fieldnote', 'Hum'];
// Roboto Flex has a continuous weight axis (100 to 1000), so the ramp uses
// steps a reader can tell apart. Inter's static 400/500 and 600/700 pairs
// could not (owner, 2026-10-22).
const WEIGHTS = [100, 300, 500, 700, 900];

export default function TypeStage() {
  const [name, setName] = useState(NAMES[0]);
  return (
    <section className="bw-type" aria-labelledby="bw-type-title">
      <div className="bw-type__head">
        <h2 id="bw-type-title" className="bw-type__title">
          Type does half the talking.
        </h2>
        <p className="bw-type__lede">
          Push the word around. Weight and width follow the cursor; on a phone the scroll does it. Each concept got one
          face and a reason for it.
        </p>
        <div className="bw-type__pills" role="group" aria-label="Pick a concept">
          {NAMES.map((n) => (
            <button
              key={n}
              type="button"
              className={`bw-type__pill${n === name ? ' is-on' : ''}`}
              aria-pressed={n === name}
              onClick={() => setName(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* TextPressure sizes its type from the container width (W / (chars/2)),
          so the box is sized by the name: every word lands near 18vw. */}
      <div className="bw-type__word" aria-hidden="true" style={{ maxWidth: `${name.length * 9}vw` }}>
        <TextPressure key={name} text={name} width weight italic stroke={false} textColor="#fef7ed" minFontSize={48} />
      </div>

      <div className="bw-type__faces">
        <p className="bw-type__display">Aa Bb Cc 0123</p>
        <ul className="bw-type__weights">
          {WEIGHTS.map((w) => (
            <li key={w} style={{ fontVariationSettings: `'wght' ${w}` }}>
              <span className="bw-type__w">{w}</span> Fixed at 7 am. Rolling by noon.
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
