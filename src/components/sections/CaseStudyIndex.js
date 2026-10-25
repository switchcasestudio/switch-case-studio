import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '../../data/projects.json';
import { groupProjects } from '../../data/projectGroups';
import useReducedMotion from '../../hooks/useReducedMotion';
import armSafetyNet from '../../animation/armSafetyNet';
import CircularText from '../ui/CircularText';
import {
  DUR_MED,
  DUR_SLOW,
  EASE_OUT,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_SAFETY_DELAY,
} from '../../animation/motionTokens';

gsap.registerPlugin(ScrollTrigger);

import '../../styles/components/caseStudyIndex.scss';

/* Case-study index (2026-09-09, owner's reference: a CV-style typed index).
   Featured projects are grouped by `type` into three headed columns; every
   entry is a link, and hovering (or focusing) one swaps the preview slot to
   that project's `preview` (2026-09-13, owner: raw screenshots were cut off
   at random and Zahav's showed its promo popup): a designed 1200×750 (16:10,
   the slot's ratio) poster, desktop in a browser frame plus the phone view,
   on black; desktop-only for Scout (private app) and Jelly Belly (not
   responsive). Falls back to `imageSrc`. The slot lives in the intro column under
   the "View all" pill, at column width, and starts on the newest project,
   which is whatever sits FIRST in projects.json. */
// Every project, not only `featured`: the index is a complete list (the
// owner asked why Birth of Venus, featured: false, was missing). The
// `featured` flag still governs the "Trusted by" strip and the tiles.
const featured = projectsData;

// The typed groups live in src/data/projectGroups.js, shared with /projects
// (2026-09-27), so the home index and the page can never disagree on where
// a case study sits. Unknown types land in a trailing "More work" group.
const grouped = groupProjects(featured);


const CaseStudyIndex = () => {
  const [active, setActive] = useState(featured[0]?.slug);
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  /* Reveal: the intro, then each column's entries in a stagger, the slot
     last. Hidden at runtime only (static HTML stays visible). One trigger on
     the whole index rather than per entry: the columns start on one line, so
     per-entry triggers would all fire in the same frame anyway. Idempotent,
     with the in-view fallback AND the timed net (the repo records both
     behaviors for an already-passed `once` trigger). */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const intro = root.querySelector('.csi__intro');
    const entries = gsap.utils.toArray('.csi__entry, .csi__heading', root);
    const slot = root.querySelector('.csi__slot');
    const all = [intro, ...entries, slot];
    if (reducedMotion) {
      gsap.set(all, { clearProps: 'all' });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(all, { autoAlpha: 0, y: REVEAL_Y });
      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        root.dataset.revealed = String((Number(root.dataset.revealed) || 0) + 1);
        gsap.to(intro, { autoAlpha: 1, y: 0, duration: DUR_SLOW, ease: EASE_OUT_SOFT });
        gsap.to(entries, {
          autoAlpha: 1,
          y: 0,
          duration: DUR_SLOW,
          ease: EASE_OUT_SOFT,
          stagger: { each: 0.05, grid: 'auto', from: 'start' },
          delay: 0.1,
        });
        gsap.to(slot, { autoAlpha: 1, y: 0, duration: DUR_SLOW, ease: EASE_OUT_SOFT, delay: 0.45 });
      };
      const st = ScrollTrigger.create({ trigger: root, start: 'top 85%', once: true, onEnter: reveal });
      if (st.progress > 0) reveal();
      const disarm = armSafetyNet(
        root,
        () => revealed || all.some((el) => gsap.isTweening(el)),
        () => {
          revealed = true;
          gsap.set(all, { autoAlpha: 1, y: 0 });
        },
        { delay: REVEAL_SAFETY_DELAY },
      );
      return () => disarm();
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  /* Preview swap: the incoming image settles from 98% while the CSS
     crossfade runs. Scale is GSAP's, opacity is the stylesheet's. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;
    const img = root.querySelector('.csi__preview.is-active');
    if (!img) return undefined;
    const tween = gsap.fromTo(img, { scale: 0.98 }, { scale: 1, duration: DUR_MED, ease: EASE_OUT, overwrite: 'auto' });
    return () => tween.kill();
  }, [active, reducedMotion]);

  return (
    <div className="csi" ref={rootRef}>
      <div className="csi__intro">
        <p className="csi__intro-title">Selected work</p>
        <p className="csi__intro-meta">{featured.length} projects</p>
        <Link to="/projects" className="csi__viewall">
          All case studies
        </Link>
      </div>

      {/* Every preview is in the DOM, stacked, so a hover crossfades instead
            of waiting on a fetch; they lazy-load together when the slot scrolls
            into view (~60KB each). Opacity is CSS-owned: no GSAP touches it. */}
        <div className="csi__slot" aria-hidden="true">
          {featured.map((p) => (
            <img
              key={p.slug}
              className={`csi__preview${p.slug === active ? ' is-active' : ''}`}
              src={p.preview || p.imageSrc}
              alt=""
              loading="lazy"
              decoding="async"
              width="1200"
              height="750"
            />
          ))}
        </div>

      {/* Stamp on the preview's top-left corner. A sibling, not a child: the
          slot clips (overflow) and ignores the pointer, the ring needs both. */}
      <div className="csi__seal">
        <CircularText text="seal*of*quality*" onHover="speedUp" spinDuration={20} />
      </div>

      {grouped.map((g, i) => (
        <div className={`csi__group${i === 0 ? ' csi__group--lead' : ''}`} key={g.heading}>
          <p className="csi__heading">{g.heading}</p>
          {g.projects.map((p) => (
            <Link
              key={p.slug}
              to={`/projects/${p.slug}`}
              className={`csi__entry${p.slug === active ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(p.slug)}
              onFocus={() => setActive(p.slug)}
            >
              <span className="csi__entry-title">{p.title}</span>
              {p.indexLine && <span className="csi__entry-line">{p.indexLine}</span>}
              <span className="csi__entry-meta">{p.type}</span>
            </Link>
          ))}
        </div>
      ))}

    </div>
  );
};

export default CaseStudyIndex;
