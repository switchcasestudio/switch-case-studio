import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import testimonials from '../../data/testimonials.json';

/* Client lines as speech bubbles on a blue field (2026-10-22), the
   reference's testimonial billboard. Real reviews from testimonials.json
   (the highlight line, first five). They float a little while in view. */
const LINES = testimonials.slice(0, 5);
const SPOTS = [
  { l: 4, t: 8 },
  { l: 54, t: 4 },
  { l: 10, t: 40 },
  { l: 60, t: 44 },
  { l: 28, t: 74 },
];

export default function Bubbles() {
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
        Once it ships, clients say
      </h2>
      <ul className="bw-bubbles__field">
        {LINES.map((t, i) => (
          <li key={t.id} className="bw-bubble" style={{ left: `${SPOTS[i].l}%`, top: `${SPOTS[i].t}%` }}>
            <q>{t.highlight}</q>
            <span className="bw-bubble__who">{t.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
