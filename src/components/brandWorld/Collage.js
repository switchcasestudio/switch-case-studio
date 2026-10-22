import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ServicePoster from '../servicePoster/ServicePoster';
import useCollageScroll from './useCollageScroll';
import { TILES } from './tiles/layout';
import * as ART from './tiles/concepts';

/* The collage hero. The SSR markup is the start state: headline in the
   middle, tiles peeking in from the edges at their `sx/sy`. On a wide
   pointer screen the stage pins and the scroll scrubs every tile along its
   own vector to `ex/ey` (useCollageScroll). Under 1024px, or with reduced
   motion, the stage does not pin and the tiles flow into a sheet under the
   headline (brandWorld.scss), so no state is ever hidden behind JS. */
function Tile({ tile }) {
  const Art = ART[tile.art];
  // Custom properties, not left/top, so the sheet mode (phones, reduced
  // motion) can drop the positioning in CSS without fighting inline styles.
  const style = {
    '--sx': `${tile.sx}%`,
    '--sy': `${tile.sy}%`,
    '--w': `${tile.w}vw`,
    zIndex: tile.z,
    aspectRatio: tile.ratio,
  };
  return (
    <div className={`bw-tile bw-tile--${tile.id}`} style={style} data-tile={tile.id}>
      {tile.art === 'Register' ? <RegisterTile /> : <Art />}
    </div>
  );
}

// The live service poster (In register / Out of register) is one of the
// tiles: it already answers the cursor through usePosterEngine.
function RegisterTile() {
  const cardRef = useRef(null);
  return (
    <div ref={cardRef} className="bw-tile__poster">
      <ServicePoster slug="brand-identity" cardRef={cardRef} />
    </div>
  );
}

export default function Collage() {
  const stageRef = useRef(null);
  useCollageScroll(stageRef);
  return (
    <section ref={stageRef} className="bw-collage" aria-label="Brand identity">
      <div className="bw-collage__copy">
        <p className="bw-collage__kicker">Brand identity</p>
        <h1 className="bw-collage__title">A mark that holds up when it moves.</h1>
        <p className="bw-collage__lede">
          Logo, colour, type and the rules that keep them together. Drawn by a designer, built for web, print and
          packaging.
        </p>
        <Link to="/contact" className="bw-collage__cta">
          Start a brand
        </Link>
      </div>
      <div className="bw-collage__tiles">
        {TILES.map((t) => (
          <Tile key={t.id} tile={t} />
        ))}
      </div>
    </section>
  );
}
