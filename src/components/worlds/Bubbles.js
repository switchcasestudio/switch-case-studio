import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import testimonials from '../../data/testimonials.json';
import projects from '../../data/projects.json';

/* Client lines as speech bubbles on a field (2026-10-22), the reference's
   testimonial billboard. Real reviews from testimonials.json (the highlight
   line). With a `service`, the voices are the clients whose case study is
   filed under that service, and each names its business and links the case
   study (UX audit, 2026-11-10: the brand page quoted web and SEO clients,
   and no quote could be tied to a real site). A service with fewer than
   three such reviews falls back to five from `offset`. They float a little
   while in view. Each voice has a face (owner, 2026-11-15: "B&W profile
   shots of the commenters ... in a circle, around their faces"): a 112px
   grayscale square cut around the face from the review's own `image`
   (`public/images/faces/<name>-112.webp`, shown at 56px; `check:media`
   fails the build if one is missing). The name is beside it, so the
   portrait's alt is empty. The face stands outside the card, at its tail,
   the way a messaging app shows who is speaking (owner, same day: "extract
   the client face from the card and put it in a circle next to the text
   message looking review card"): the `li` is the row, `__card` the bubble. */
const SPOTS = [
  { l: 4, t: 8 },
  { l: 54, t: 4 },
  { l: 10, t: 40 },
  { l: 60, t: 44 },
  { l: 28, t: 74 },
];

// Three voices sit on a diagonal instead of leaving the field half empty.
const SPOTS_3 = [
  { l: 4, t: 6 },
  { l: 52, t: 34 },
  { l: 12, t: 64 },
];

const SOLD_UNDER = Object.fromEntries(projects.map((p) => [p.slug, p.servicePages || []]));
// "Owner at Renewed Bodyworks" -> "Renewed Bodyworks"
const business = (t) => (t.title || '').replace(/^.*?\b(?:at|of)\s+/, '');
// "/images/scott.webp" -> "/images/faces/scott-112.webp"
export const face = (src) => (src || '').replace(/^\/images\/([^/.]+)\.\w+$/, '/images/faces/$1-112.webp');

export default function Bubbles({ title, offset = 0, service }) {
  const sold = service ? testimonials.filter((t) => (SOLD_UNDER[t.project] || []).includes(service)) : [];
  const lines = sold.length >= 3 ? sold.slice(0, SPOTS.length) : testimonials.slice(offset, offset + SPOTS.length);
  const spots = lines.length <= 3 ? SPOTS_3 : SPOTS;
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.bw-bubble').forEach((el, i) => {
        gsap.to(el, { y: 'random(-10, 10)', rotation: 'random(-1.5, 1.5)', duration: 'random(2.5, 4)', delay: i * 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="bw-bubbles" aria-labelledby="bw-bubbles-title">
      <h2 id="bw-bubbles-title" className="bw-bubbles__title">
        {title}
      </h2>
      <ul className={`bw-bubbles__field${lines.length > 3 ? ' bw-bubbles__field--five' : ''}`}>
        {lines.map((t, i) => (
          <li key={t.id} className="bw-bubble" style={{ left: `${spots[i].l}%`, top: `${spots[i].t}%` }}>
            {t.image && (
              <img className="bw-bubble__face" src={face(t.image)} alt="" width="56" height="56" loading="lazy" decoding="async" />
            )}
            <div className="bw-bubble__card">
              <q>{t.highlight}</q>
              <span className="bw-bubble__who">
                {t.name}
                {business(t) && (
                  <>
                    ,{' '}
                    {t.project ? (
                      <Link to={`/projects/${t.project}`} aria-label={`${business(t)} case study`}>
                        {business(t)}
                      </Link>
                    ) : (
                      business(t)
                    )}
                  </>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
