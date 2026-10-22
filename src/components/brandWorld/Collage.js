import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ServicePoster from '../servicePoster/ServicePoster';
import useCollageScroll from './useCollageScroll';
import usePosterEngine from '../servicePoster/usePosterEngine';
import VideoTile from './VideoTile';
import PixelTile from './PixelTile';
import { TILES } from './tiles/layout';
import * as ART from './tiles/concepts';
import * as LIVE from './tiles/live';

// A tile with a `create` in tiles/live.js runs on the poster engine: the
// SVG answers the pointer and breathes while in view; the SSR drawing is
// its rest state, so nothing is lost without JS or under reduced motion.
function LiveArt({ art }) {
  const wrapRef = useRef(null);
  const Art = ART[art];
  usePosterEngine({ wrapRef, cardRef: wrapRef, create: LIVE[art] });
  return (
    <div ref={wrapRef} className="bw-tile__live">
      <Art />
    </div>
  );
}

/* The collage hero. The SSR markup is the start state: headline in the
   middle, tiles peeking in from the edges at their `sx/sy`. On a wide
   pointer screen the stage pins and the scroll scrubs every tile along its
   own vector to `ex/ey` (useCollageScroll). Under 1024px, or with reduced
   motion, the stage does not pin and the tiles flow into a sheet under the
   headline (brandWorld.scss), so no state is ever hidden behind JS. */
// A real client site in a drawn browser frame: the reference's "real life"
// tiles. Images are the case-study previews the site already ships.
function SiteShot({ tile }) {
  return (
    <div className="bw-shot">
      <div className="bw-shot__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{tile.caption}</span>
      </div>
      <img src={tile.src} alt={tile.label} loading="lazy" width="600" height="375" />
    </div>
  );
}

function TileBody({ tile }) {
  if (tile.kind === 'video') return <VideoTile src={tile.src} poster={tile.poster} label={tile.label} scrub={!!tile.scrub} />;
  if (tile.kind === 'shot') return <SiteShot tile={tile} />;
  if (tile.kind === 'pixel') return <PixelTile />;
  if (tile.art === 'Register') return <RegisterTile />;
  if (LIVE[tile.art]) return <LiveArt art={tile.art} />;
  const Art = ART[tile.art];
  return <Art />;
}

function Tile({ tile }) {
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
      <TileBody tile={tile} />
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
          Logo, color, type and the rules that keep them together. Drawn by a designer, built for web, print and
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
