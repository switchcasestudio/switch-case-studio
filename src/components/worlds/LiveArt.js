import { useRef } from 'react';
import usePosterEngine from '../servicePoster/usePosterEngine';

/* A drawing with a `create` in a world's live module runs on the house
   poster engine: the SVG answers the pointer and breathes while in view;
   the SSR drawing is its rest state, so nothing is lost without JS or
   under reduced motion. Used by the collage tiles and by any stage that
   wants a drawing alive. */
export default function LiveArt({ Art, create, className = 'bw-tile__live' }) {
  const wrapRef = useRef(null);
  usePosterEngine({ wrapRef, cardRef: wrapRef, create });
  return (
    <div ref={wrapRef} className={className}>
      <Art />
    </div>
  );
}
