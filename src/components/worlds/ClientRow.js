import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../../data/projects.json';

gsap.registerPlugin(ScrollTrigger);

/* A world's client row (2026-11-15): the reference's pinned plate with a row
   of work panning under its title, built from real case studies only. A card
   is a name pill over a tile and one line, and it opens the case study; the
   last card opens the index. Everything a card says is read from
   projects.json (`indexLine`, or the line the caller derives), never typed.
   The row is a wrapped grid in the static HTML, on phones and under reduced
   motion. On the pin gate it is one line: if that line is wider than the
   plate, the plate pins and page scroll pans it; if it fits (the AI world has
   two case studies), nothing pins. Without JS the line scrolls sideways. */
const GATE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const MAX = 6;
const small = (src) => src.replace(/\.webp$/, '-600.webp');

// The case studies sold under a service page, in the data's own order.
export const workFor = (service) =>
  projects
    .filter((p) => (p.servicePages || []).includes(service) && p.preview)
    .slice(0, MAX)
    .map((p) => ({ slug: p.slug, title: p.title, line: p.indexLine, img: p.preview, alt: p.imageAlt || `${p.title} preview` }));

export default function ClientRow({ id, title, items, more = 'All case studies' }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const view = root.querySelector('.bw-row__view');
    const list = root.querySelector('.bw-row__list');
    const mm = gsap.matchMedia();
    mm.add(GATE, () => {
      const over = () => Math.max(0, list.scrollWidth - view.clientWidth);
      if (over() < 8) return undefined;
      const header = document.querySelector('.site-header');
      const top = header ? header.offsetHeight : 0;
      root.classList.add('is-panning');
      const tween = gsap.to(list, {
        x: () => -over(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          // The plate's middle on the middle of what the header leaves.
          start: () => `center ${top + (window.innerHeight - top) / 2}px`,
          end: () => `+=${over()}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
        root.classList.remove('is-panning');
      };
    });
    return () => mm.revert();
  }, [items]);

  if (!items.length) return null;
  return (
    <section ref={rootRef} className="bw-row" aria-labelledby={id}>
      <h2 id={id} className="bw-row__title">
        {title}
      </h2>
      <div className="bw-row__view">
        <ul className="bw-row__list">
          {items.map((p) => (
            <li key={p.slug} className="bw-row__cell">
              <Link to={`/projects/${p.slug}`} className="bw-row__card" aria-label={`${p.title} case study`}>
                <span className="bw-row__pill">{p.title}</span>
                <span className={`bw-row__tile${p.logo ? ' bw-row__tile--logo' : ''}`}>
                  {p.logo ? (
                    <img src={p.img} alt={p.alt} loading="lazy" decoding="async" height="96" />
                  ) : (
                    <img
                      src={p.img}
                      srcSet={`${small(p.img)} 600w, ${p.img} 1200w`}
                      sizes="(min-width: 1024px) 380px, 46vw"
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      width="1200"
                      height="750"
                    />
                  )}
                </span>
                {p.line && <span className="bw-row__line">{p.line}</span>}
              </Link>
            </li>
          ))}
          <li className="bw-row__cell">
            <Link to="/projects" className="bw-row__card bw-row__card--more">
              <span className="bw-row__more">
                {more} <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
