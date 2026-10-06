import { useEffect, useRef, useState } from 'react';
import CaseStudyIndex from './CaseStudyIndex';
import TextPressure from '../ui/TextPressure';

import '../../styles/components/projects.scss';

// The TextPressure wordmark pulls in the Roboto Flex variable woff2 (~278KB)
// and a RAF warp loop. The section sits ~6th down, so gate the whole thing
// behind an IntersectionObserver (the MoonSlot pattern from About.js): SSR +
// first client render show an empty, fixed-height slot — zero font bytes on
// the initial critical path — and it mounts (font fetch + effect init) on
// approach.
const CaseStudies = () => {
  const headerRef = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true); // ancient browser: just mount it
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="projects"
      id="projects"
      aria-labelledby="projects-heading"
    >
      {/* Fixed-height slot (CSS min-height) holds layout so the lazy mount
          can't shift the tiles below. SSR + first client render are both
          `near = false` → empty slot, same dimensions, no hydration drift. */}
      <div className="projects-header" aria-hidden="true" ref={headerRef}>
        {near && (
          <>
            <div className="projects-header__word">
              <TextPressure
                text="Case"
                alpha={false}
                stroke={true}
                width
                weight
                italic
                textColor="#ffffff"
                strokeColor="#f0d7ff"
                minFontSize={60}
              />
            </div>
            <div className="projects-header__word">
              <TextPressure
                text="Studies"
                alpha={false}
                stroke={true}
                width
                weight
                italic
                textColor="#ffffff"
                strokeColor="#f0d7ff"
                minFontSize={60}
              />
            </div>
          </>
        )}
      </div>

      <h2 id="projects-heading" className="sr-only">
        Selected work
      </h2>

      {/* Typed index (owner's CV-style reference) replaced the tile grid on
          2026-09-09 (the tile component was deleted in the 2026-10
          cleanup). The "View all" link moved into the index's intro
          column. */}
      <CaseStudyIndex />
    </section>
  );
};

export default CaseStudies;
