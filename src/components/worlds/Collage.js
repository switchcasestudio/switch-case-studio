import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ServicePoster from '../servicePoster/ServicePoster';
import useCollageScroll from './useCollageScroll';
import VideoTile from './VideoTile';
import LiveArt from './LiveArt';

/* A world's collage hero (2026-10-22). The SSR markup is the start state:
   headline in the middle, tiles peeking in from the edges at their `sx/sy`.
   On a wide pointer screen the stage pins and the scroll scrubs every tile
   along its own vector (useCollageScroll). Under 1024px, or with reduced
   motion, the stage does not pin and the tiles flow into a sheet under the
   headline (brandWorld.scss), so no state is ever hidden behind JS.
   Shared by the worlds: the page passes its `tiles` (tiles/layout), its
   `art` and `live` modules, any page-only tile `kinds`, and the copy.
   Tile kinds: `art` (an SVG from the art module, live when the live module
   has a create), `video`, `shot` (a real site in browser chrome), `poster`
   (a live service poster), or a key of `kinds`. `plain` tiles get no
   plate (free shapes on the field). */

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

// The live service poster is one of the tiles: it already answers the
// cursor through usePosterEngine.
function PosterTile({ slug }) {
  const cardRef = useRef(null);
  return (
    <div ref={cardRef} className="bw-tile__poster">
      <ServicePoster slug={slug} cardRef={cardRef} />
    </div>
  );
}

function TileBody({ tile, art, live, kinds }) {
  if (tile.kind === 'video') return <VideoTile src={tile.src} poster={tile.poster} label={tile.label} scrub={!!tile.scrub} />;
  if (tile.kind === 'shot') return <SiteShot tile={tile} />;
  if (tile.kind === 'poster') return <PosterTile slug={tile.slug} />;
  if (tile.kind && kinds[tile.kind]) {
    const Kind = kinds[tile.kind];
    return <Kind />;
  }
  const Art = art[tile.art];
  if (live[tile.art]) return <LiveArt Art={Art} create={live[tile.art]} />;
  return <Art />;
}

function Tile({ tile, art, live, kinds }) {
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
    <div className={`bw-tile bw-tile--${tile.id}${tile.plain ? ' bw-tile--plain' : ''}`} style={style} data-tile={tile.id}>
      <TileBody tile={tile} art={art} live={live} kinds={kinds} />
    </div>
  );
}

export default function Collage({ tiles, scrollLength, art, live, kinds = {}, label, copy }) {
  const stageRef = useRef(null);
  useCollageScroll(stageRef, tiles, scrollLength);
  return (
    <section ref={stageRef} className="bw-collage" aria-label={label}>
      <div className="bw-collage__copy">
        <p className="bw-collage__kicker">{copy.kicker}</p>
        <h1 className="bw-collage__title">{copy.title}</h1>
        <p className="bw-collage__lede">{copy.lede}</p>
        <Link to={copy.cta.to} className="bw-collage__cta">
          {copy.cta.label}
        </Link>
      </div>
      <div className="bw-collage__tiles">
        {tiles.map((t) => (
          <Tile key={t.id} tile={t} art={art} live={live} kinds={kinds} />
        ))}
      </div>
    </section>
  );
}
