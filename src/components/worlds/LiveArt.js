import { useRef } from 'react';
import usePosterEngine from '../servicePoster/usePosterEngine';

/* A drawing with a `create` in a world's live module runs on the house
   poster engine: the SVG answers the pointer and breathes while in view;
   the SSR drawing is its rest state, so nothing is lost without JS or
   under reduced motion. Used by any stage or tile that wants a drawing
   alive; the caller names the wrapper's class. */
export default function LiveArt({ Art, create, className }) {
  const wrapRef = useRef(null);
  usePosterEngine({ wrapRef, cardRef: wrapRef, create });
  return (
    <div ref={wrapRef} className={className}>
      <Art />
    </div>
  );
}
