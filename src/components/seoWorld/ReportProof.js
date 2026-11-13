import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* A client's month, in Google's words (owner, 2026-11-12: "use this image as
   a motion vector in one of the services pages with interactive scroll").
   The Google Analytics report Florida Energy Assistance's owner was emailed
   for October 16 to November 12, 2026, rebuilt as live text in the house
   type (no Google or Analytics logo is redrawn: the names stay plain words).
   The HTML is the finished report; with motion allowed, the section holds
   while the reader scrolls and the report assembles: sheet, title, date,
   cards, then each number counts up from the 28 days before (Google's own
   comparison: 75 is 120.59% over 34) and its arrow fills in. Scroll owns
   the timeline, so scrolling back runs it backward. Reduced motion, or no
   script, shows the finished report. */
const CARDS = [
  { label: 'Active Users', from: 34, to: 75, unit: '', pct: 120.59 },
  { label: 'New Users', from: 33, to: 74, unit: '', pct: 124.24 },
  { label: 'Avg engagement time', from: 44, to: 47, unit: 's', pct: 6.86 },
  { label: 'Events', from: 173, to: 377, unit: '', pct: 117.92 },
];

const GATE = '(prefers-reduced-motion: no-preference)';

function Arrow() {
  return (
    <svg className="sw-report__arrow" viewBox="0 0 20 20" aria-hidden="true">
      <circle className="sw-report__arrow-dot" cx="10" cy="10" r="10" />
      <path className="sw-report__arrow-mark" d="M10 15V5.5M5.8 9.6 10 5.4l4.2 4.2" />
    </svg>
  );
}

export default function ReportProof() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const mm = gsap.matchMedia();
    mm.add(GATE, () => {
      const header = document.querySelector('.site-header');
      root.style.setProperty('--sw-top', `${header ? header.offsetHeight : 0}px`);
      root.classList.add('is-live');

      const q = (s) => [...root.querySelectorAll(s)];
      // React rendered the final strings; write digits through the text
      // node so React's own copy is never replaced (house rule).
      const nums = q('.sw-report__num').map((el) => el.firstChild);
      const pcts = q('.sw-report__pct').map((el) => el.firstChild);
      const write = (p) => {
        CARDS.forEach((c, i) => {
          const done = p >= 1;
          nums[i].nodeValue = `${done ? c.to : Math.round(c.from + (c.to - c.from) * p)}${c.unit}`;
          pcts[i].nodeValue = `${(c.pct * (done ? 1 : p)).toFixed(2)}%`;
        });
      };
      const count = { p: 0 };

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 1 },
        scrollTrigger: {
          trigger: root.querySelector('.sw-report__track'),
          // Starts as the track enters, so the sheet assembles on its way
          // to the pin instead of leaving an empty frame above the fold.
          start: 'top 75%',
          end: 'bottom bottom',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
      tl.from('.sw-report__sheet', { y: 80, autoAlpha: 0, scale: 0.94 }, 0)
        .from('.sw-report__brand', { autoAlpha: 0 }, 0.6)
        .from('.sw-report__rule', { scaleX: 0, transformOrigin: '0 50%' }, 0.6)
        .from('.sw-report__line', { y: 28, autoAlpha: 0, stagger: 0.35 }, 1)
        .fromTo(
          '.sw-report__date',
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1.4 },
          1.8,
        )
        .from('.sw-report__sub', { y: 16, autoAlpha: 0 }, 3)
        .from('.sw-report__card', { y: 48, autoAlpha: 0, stagger: 0.3 }, 3.4)
        .to(count, { p: 1, ease: 'power1.inOut', duration: 3, onUpdate: () => write(count.p) }, 4.4)
        .from('.sw-report__arrow', { scale: 0, transformOrigin: '50% 50%', stagger: 0.25, ease: 'back.out(2)' }, 4.6)
        .from('.sw-report__arrow-mark', { y: 6, stagger: 0.25 }, 4.8)
        .from('.sw-report__cap', { y: 16, autoAlpha: 0 }, 7.2)
        .to({}, { duration: 0.8 });
      write(count.p);

      return () => {
        write(1);
        root.classList.remove('is-live');
      };
    }, root); // scope: the timeline's selector strings resolve inside this section
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="sw-report" aria-labelledby="sw-report-title">
      <h2 id="sw-report-title" className="sw-report__title">
        A client&apos;s month, in Google&apos;s words.
      </h2>
      <div className="sw-report__track">
        <div className="sw-report__pin">
          <figure className="sw-report__fig">
            <div className="sw-report__sheet">
              <div className="sw-report__brand" aria-hidden="true">
                <span>Google</span>
                <span>Analytics</span>
              </div>
              <span className="sw-report__rule" aria-hidden="true" />
              <p className="sw-report__h">
                <span className="sw-report__line">Your Google Analytics </span>
                <span className="sw-report__line">performance report for </span>
                <span className="sw-report__line sw-report__date">October 16th - November 12th</span>
              </p>
              <p className="sw-report__sub">Review the latest metrics for your business to see what&apos;s working.</p>
              <ul className="sw-report__cards">
                {CARDS.map((c) => (
                  <li key={c.label} className="sw-report__card">
                    <span className="sw-report__label">{c.label}</span>
                    <span className="sw-report__num" aria-hidden="true">{`${c.to}${c.unit}`}</span>
                    <span className="sw-report__delta" aria-hidden="true">
                      <Arrow />
                      <span className="sw-report__pct">{`${c.pct.toFixed(2)}%`}</span>
                    </span>
                    <span className="sr-only">{`${c.to}${c.unit}, up ${c.pct.toFixed(2)}% on the 28 days before`}</span>
                  </li>
                ))}
              </ul>
            </div>
            <figcaption className="sw-report__cap">
              Florida Energy Assistance, a landing page we built and set up for search. Google emailed its owner
              this report in 2026; each number counts up from the 28 days before.{' '}
              <Link to="/projects/florida-energy-assistance">See the case study</Link>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
