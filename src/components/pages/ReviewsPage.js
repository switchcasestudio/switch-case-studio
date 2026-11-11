import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import testimonialsData from '../../data/testimonials.json';
import projectsData from '../../data/projects.json';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/testimonialsPage.scss';

// The lede's count follows the data, so a new review can't leave it stale.
const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
const CLIENT_COUNT = COUNT_WORDS[testimonialsData.length] ?? String(testimonialsData.length);

/* /testimonials (2026-09-27, owner: "update the presentation"): one voice at
 * a time. The pull-quote set large, the person, the full review at reading
 * size, and, where the review has a case study on this site, the client's
 * site shot and a sourced figure with a link. The names run down the
 * side and switch the stage (hover or click). The static HTML carries all
 * reviews stacked; hydration adds `is-live`, which collapses them to
 * one at a time on wide screens only. Phones read them all in order. No
 * motion library: the switch is a CSS keyframe. */
const projectOf = (t) => (t.project ? projectsData.find((p) => p.slug === t.project) : null);
const company = (title = '') => title.replace(/^(Owner at|Founder of|Owner of)\s+/i, '');
const small = (src) => src.replace(/\.webp$/, '-600.webp');

const AUTO_MS = 20000;
// Time on stage (2026-11-10): 20 s was shorter than six of the eight reviews
// take to read. Each one gets its own reading time at 238 words a minute (the
// mean silent reading rate, Brysbaert 2019) plus 4 s, never under the 20 s
// the owner asked for.
const readMs = (id) => {
  const t = testimonialsData.find((x) => x.id === id);
  const words = `${t.highlight} ${t.testimonial}`.trim().split(/\s+/).length;
  return Math.max(AUTO_MS, Math.ceil((words / 238) * 60000) + 4000);
};
const nextId = (id) => {
  const i = testimonialsData.findIndex((t) => t.id === id);
  return testimonialsData[(i + 1) % testimonialsData.length].id;
};

const ReviewsPage = () => {
  const [active, setActive] = useState(testimonialsData[0].id);
  const [live, setLive] = useState(false);
  /* Auto-advance (owner, 2026-09-27: "like a carousel, every 20 sec"):
   * on wide screens only, never under reduced motion, paused while the
   * pointer or focus is on the stage or the list, skipped while the tab is
   * hidden, and OFF for good once the visitor picks a name: a person who
   * chose a review is reading it. The active name shows a progress line
   * while it runs. A Pause button stops and restarts it (2026-11-10), and
   * names switch on click or Enter only: switching on hover flipped three
   * reviews on a diagonal path to one name. */
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef(null);
  usePageHeaderReveal(rootRef, '.page-head-animate, .rv');
  useEffect(() => setLive(true), []);
  useEffect(() => {
    if (!live) return;
    // Reduced motion: it never runs, and the button says so ("Play").
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(false);
  }, [live]);
  useEffect(() => {
    if (!live || !auto || paused) return undefined;
    if (!window.matchMedia('(min-width: 901px)').matches) return undefined;
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') setActive((a) => nextId(a));
    }, readMs(active));
    return () => clearInterval(id);
  }, [live, auto, paused, active]);
  const pick = (id) => {
    setActive(id);
    setAuto(false);
  };
  /* Phones stack all the reviews, and at full length the ask sat about nine
     screens down (UX audit, 2026-11-10). There each review shows its pull
     quote and figure; the full text opens on request (`is-open`, styled at
     900px and under only, and only once the page is live, so with no
     JavaScript every review is still there in full). */
  const [opened, setOpened] = useState({});

  return (
    <>
      <Seo
        title="Client Reviews | Switch Case Studio"
        description="See what clients say about Switch Case Studio: real results from real businesses we've helped grow."
        path="/testimonials"
      />

      <article className="testimonials-page" aria-label="Client reviews" ref={rootRef}>
        <header className="testimonials-page__header">
          <p className="testimonials-page__kicker page-head-animate">What clients say</p>
          <h1 className="testimonials-page__title page-head-animate">
            Real words.
            <br />
            Real results.
          </h1>
          <p className="testimonials-page__lede page-head-animate">
            {CLIENT_COUNT} clients in their own words. Where the work is on this site, the measured
            figure from their case study sits next to the words.
          </p>
        </header>

        <div
          className={`rv${live ? ' is-live' : ''}${auto ? ' is-auto' : ''}${paused ? ' is-paused' : ''}`}
          style={{ '--rv-ms': `${readMs(active)}ms` }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* The switcher: one button per client; the pressed one is on stage. */}
          <nav className="rv__list" aria-label="Choose a review">
            {testimonialsData.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`rv__pick${t.id === active ? ' is-active' : ''}`}
                aria-pressed={t.id === active}
                onClick={() => pick(t.id)}
              >
                <span className="rv__pick-name">{t.name}</span>
                <span className="rv__pick-company">{company(t.title)}</span>
              </button>
            ))}
            <button
              type="button"
              className="carousel-pause rv__pause"
              onClick={() => setAuto((a) => !a)}
              aria-label={auto ? 'Pause the reviews' : 'Play the reviews'}
            >
              {auto ? 'Pause' : 'Play'}
            </button>
          </nav>

          <div className="rv__stage">
            {testimonialsData.map((t, i) => {
              const project = projectOf(t);
              const hasMore = t.testimonial && t.testimonial !== t.highlight;
              const metric = t.metric || (project && project.indexMetric
                ? { ...project.indexMetric, href: `/projects/${project.slug}` }
                : null);
              const shot = project && (project.preview || project.imageSrc);
              return (
                <Fragment key={t.id}>
                <figure
                  className={`rv__panel${t.id === active ? ' is-active' : ''}${opened[t.id] ? ' is-open' : ''}${
                    hasMore ? '' : ' is-short'
                  }`}
                  aria-label={`Review by ${t.name}`}
                >
                  <blockquote className="rv__quote">
                    <p className="rv__pull">&ldquo;{t.highlight}&rdquo;</p>
                    <p className="rv__full" id={`rv-full-${t.id}`}>
                      {t.testimonial}
                    </p>
                  </blockquote>
                  {hasMore && (
                    <button
                      type="button"
                      className="rv__more"
                      aria-expanded={!!opened[t.id]}
                      aria-controls={`rv-full-${t.id}`}
                      onClick={() => setOpened((o) => ({ ...o, [t.id]: !o[t.id] }))}
                    >
                      {opened[t.id] ? 'Show less' : 'Read the full review'}
                    </button>
                  )}
                  <figcaption className="rv__who">
                    <img src={t.image} alt="" className="rv__avatar" loading="lazy" width="56" height="56" />
                    <span className="rv__who-text">
                      <span className="rv__name">{t.name}</span>
                      <span className="rv__role">
                        {t.url ? (
                          <a href={t.url} target="_blank" rel="noopener noreferrer">
                            {t.title}
                          </a>
                        ) : (
                          t.title
                        )}
                      </span>
                    </span>
                  </figcaption>
                  {(shot || metric) && (
                    <div className="rv__proof">
                      {shot && (
                        <Link to={`/projects/${project.slug}`} className="rv__shot" aria-label={`${project.title} case study`}>
                          <img
                            src={small(shot)}
                            srcSet={`${small(shot)} 600w, ${shot} 1200w`}
                            sizes="(max-width: 900px) 90vw, 30vw"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            width="600"
                            height="375"
                          />
                        </Link>
                      )}
                      {metric && (
                        <p className="rv__metric">
                          <strong className="rv__metric-value">{metric.value}</strong>
                          <span className="rv__metric-label">{metric.label}</span>
                          {(metric.source || metric.href) && (
                            <span className="rv__metric-source">
                              {metric.source}
                              {metric.href && (
                                <>
                                  {metric.source ? ' · ' : ''}
                                  <Link to={metric.href}>Case study →</Link>
                                </>
                              )}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </figure>
                {/* Phones: the ask, a third of the way down the stack. */}
                {i === 2 && (
                  <div className="rv__mid">
                    <p>Ready to be next? The first call is free.</p>
                    <BookCallCta className="testimonials-page__bottom-btn" />
                  </div>
                )}
                </Fragment>
              );
            })}
          </div>
        </div>

        <div className="testimonials-page__bottom">
          <h2 className="testimonials-page__bottom-heading">Ready to be next?</h2>
          <p className="testimonials-page__bottom-body">
            Book a free call and let&apos;s talk about your project.
          </p>
          <BookCallCta className="testimonials-page__bottom-btn" />
        </div>
      </article>
    </>
  );
};

export default ReviewsPage;
