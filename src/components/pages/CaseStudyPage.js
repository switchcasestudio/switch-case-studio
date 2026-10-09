import { useEffect, useRef, useState, useMemo } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../util/Seo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REVEAL_Y, DUR_SLOW, EASE_OUT_SOFT, REVEAL_SAFETY_DELAY } from '../../animation/motionTokens';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import projectsData from '../../data/projects.json';
import servicesData from '../../data/services.json';
import useReducedMotion from '../../hooks/useReducedMotion';

import ScrollingShot from '../ui/ScrollingShot';
import ZoomLightbox from '../ui/ZoomLightbox';
import MagneticButton from '../ui/MagneticButton';
import MotionReel from '../ui/MotionReel';

import '../../styles/components/projectPage.scss';

/* ── Meta-description clamp ──
   A blind .slice() cut every case study mid-word ("…Jelly Belly site; the "),
   which is what ships to SERPs and social cards. Cut on a word boundary
   instead, trim trailing punctuation, and mark the elision. */
const TRAILING_STOPWORDS =
  /\s+(a|an|the|and|or|but|of|to|in|on|for|with|from|that|this|its|it|as|at|by|is|are|was|were)$/i;

const clampAtWord = (text, max) => {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);

  // Prefer a clause break — it reads as a finished thought, not a severed one.
  const clause = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  // Otherwise fall back to the last word boundary, if it isn't so early it
  // guts the sentence.
  const space = cut.lastIndexOf(' ');
  const at = clause > max * 0.5 ? clause : space > max * 0.6 ? space : max;

  let body = cut.slice(0, at);
  // A cut landing on "…site; the" leaves a dangling article. Drop it.
  while (TRAILING_STOPWORDS.test(body)) body = body.replace(TRAILING_STOPWORDS, '');
  return `${body.replace(/[\s,;:.—–-]+$/, '')}…`;
};

/* ── Image preload (returns true when image loads, false on error) ── */
/* ── Media gate: render first, remove on failure ──
   Media tiles are in the static HTML from the first byte. They used to wait
   for a client-side preload (`useImagePreload`), which meant the live band
   mounted AFTER hydration, between the hero and the summary, and pushed the
   whole page down: the Zahav page measured CLS 0.19 desktop / 0.13 phone with
   the summary section as the shifted element (2026-10-09 SEO audit; the band
   has a fixed height, so once it is in the HTML nothing moves). The gate now
   only REMOVES a tile whose file fails to load, so a dead path in
   projects.json renders nothing rather than a broken image. */
const useImageFailed = (src) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
    if (!src) return undefined;
    const img = new Image();
    img.onerror = () => setFailed(true);
    img.src = src;
    return () => {
      img.onerror = null;
    };
  }, [src]);
  return failed;
};

const CaseStudyPage = () => {
  const { slug } = useParams();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef(null);

  // null = closed. Holds the src of the image being zoomed (any media tile).
  const [zoomSrc, setZoomSrc] = useState(null);

  // Find project + compute neighbour for "View next →"
  const { project, nextProject } = useMemo(() => {
    const idx = projectsData.findIndex((p) => p.slug === slug);
    if (idx === -1) return { project: null, nextProject: null };
    return {
      project: projectsData[idx],
      nextProject: projectsData[(idx + 1) % projectsData.length],
    };
  }, [slug]);

  const publicLongWeb = project?.longWeb ? project.longWeb : null;
  const publicImageSrc = project?.imageSrc ? project.imageSrc : null;

  const mockupOK = !useImageFailed(publicLongWeb);
  const detailImageOK = !useImageFailed(publicImageSrc);

  /* ── Entrance animation. GSAP owns start + end state.
     Hero (first viewport) reveals on MOUNT — the first-viewport law. Every
     section below it reveals when it scrolls into view (house pattern:
     gsap.set hidden, ScrollTrigger.create onEnter once, in-view fallback,
     safety net) so the gallery / comparison bands still get their moment
     instead of being fully visible before the reader reaches them. ── */
  useIsomorphicLayoutEffect(() => {
    if (!project) return;

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const reveals = gsap.utils.toArray('.reveal', root);

      if (reducedMotion) {
        gsap.set(reveals, { autoAlpha: 1, y: 0 });
        return;
      }

      const hero = reveals.filter((el) => el.classList.contains('project-page__hero'));
      const sections = reveals.filter((el) => !el.classList.contains('project-page__hero'));

      gsap.set(reveals, { autoAlpha: 0, y: REVEAL_Y });
      gsap.to(hero, { autoAlpha: 1, y: 0, duration: DUR_SLOW, ease: EASE_OUT_SOFT, delay: 0.1 });

      const revealed = new WeakSet();
      const reveal = (el) => {
        if (revealed.has(el)) return; // idempotent: trigger + fallback + net may all call it
        revealed.add(el);
        gsap.to(el, { autoAlpha: 1, y: 0, duration: DUR_SLOW, ease: EASE_OUT_SOFT, overwrite: 'auto' });
      };
      const inView = (el) => el.getBoundingClientRect().top < window.innerHeight * 0.88;

      const triggers = sections.map((el) =>
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => reveal(el) }),
      );
      // Already in view at mount (short viewport, deep link)? onEnter may not fire.
      sections.forEach((el) => inView(el) && reveal(el));

      // Lazy media shifts layout after 'start' is measured.
      root.querySelectorAll('img').forEach((img) => {
        if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      });

      // Safety nets: nothing that has entered the viewport may stay hidden.
      // (Below-fold sections stay hidden until scrolled to — that's the feature.)
      const sweep = () => sections.forEach((el) => inView(el) && reveal(el));
      ScrollTrigger.addEventListener('scrollEnd', sweep);
      const safety = gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        sweep();
        hero.forEach((el) => {
          if (gsap.getProperty(el, 'opacity') < 1 && !gsap.isTweening(el)) gsap.set(el, { autoAlpha: 1, y: 0 });
        });
      });

      return () => {
        triggers.forEach((t) => t.kill());
        ScrollTrigger.removeEventListener('scrollEnd', sweep);
        safety.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [project, reducedMotion]);

  /* ── 404 fallback ── */
  if (!project) {
    return <Navigate to="/" replace />;
  }

  const {
    title,
    subtitle,
    outcome,
    year,
    description,
    services = [],
    // Slugs of the service pages (services.json) this work was sold under.
    // Rendered as links in the top bar so every case study points at the
    // offer it proves (SEO audit 2026-10-09, fix 7). Absent → no links.
    servicePages = [],
    highlights = [],
    metrics = [],
    result,
    kicker,
    // True for self-initiated work (no paying client). Optional; absent on
    // every client project, so nothing renders there.
    studioProject,
    ctaLabel,
    ctaUrl,
    // Public source repos for this build. Optional, and optional per project:
    // two case studies are client work with no public repo, so they render no
    // code button at all rather than a dead link. Same conditional-tile law as
    // the bento media below — absent data means the element doesn't exist.
    repos = [],
    // Non-code live links that aren't the primary CTA — e.g. hosted API docs.
    // Same conditional law as `repos`: absent means the button doesn't exist.
    links = [],
    // Optional architecture diagram. Gets its own full-width band rather than a
    // gallery tile, because gallery tiles are 4/3 + object-fit:cover and would
    // crop a wide diagram into uselessness.
    diagram,
    diagramAlt,
    // Optional before/after comparison band. Same law as `diagram` and for the
    // same reason: a labelled side-by-side has to be READ, so it gets a
    // contain-fit scroll frame, never a 4/3 cover tile that would crop the
    // labels off. Absent → the whole section doesn't exist.
    comparisons = [],
    comparisonsLabel,
    comparisonsNote,
    // Optional brand kit: a stack of full-width boards, Behance style, each
    // shown whole at its own ratio (never a cropped tile). Absent → no section.
    brandKit = [],
    brandKitNote,
    // Optional motion piece: { mp4, webm?, poster, alt, caption?, note? }.
    motion,
    imageAlt,
    // ── Optional bento media. Each tile renders ONLY if its field exists. ──
    mediaMobile,
    mediaMobileAlt,
    mediaCopy,
    mediaCopyAlt,
    mediaCta,
    mediaCtaAlt,
  } = project;

  const metaDescription =
    outcome ||
    clampAtWord(description, 155) ||
    `${title}, a case study by Switch Case Studio.`;

  /* ── Media tiles, declared once, rendered conditionally ──
     Missing data → tile is filtered out, so no empty placeholder boxes.
     `longWeb`/`imageSrc` fill two slots today; the rest are optional
     fields you can add to projects.json later and they light up. */

  // Small tiles that live in the Results column (right of the summary).
  const detailTiles = [
    mediaMobile && {
      key: 'mobile',
      src: mediaMobile,
      caption: 'Mobile view',
      alt: mediaMobileAlt || `${title}: mobile view`,
      zoom: true,
    },
    publicImageSrc &&
      detailImageOK && {
        key: 'hero-detail',
        src: publicImageSrc,
        caption: 'Hero detail',
        alt: imageAlt || `${title}: hero detail`,
        zoom: true,
      },
  ].filter(Boolean);

  // The live desktop preview leads the page as a hero band (see below).
  const liveOK = !!(publicLongWeb && mockupOK);

  // Supporting shots in the gallery band below the result quote.
  const galleryTiles = [
    mediaCopy && {
      key: 'copy',
      src: mediaCopy,
      caption: 'Copy / offer block',
      alt: mediaCopyAlt || `${title}: copy and offer block`,
      zoom: true,
    },
    mediaCta && {
      key: 'cta',
      src: mediaCta,
      caption: 'CTA / form',
      alt: mediaCtaAlt || `${title}: CTA and form`,
      zoom: true,
    },
  ].filter(Boolean);

  const hasResults = metrics.length > 0 || detailTiles.length > 0;

  // Service pages this case study links to, resolved against services.json so
  // a renamed service updates every case study; an unknown slug renders nothing.
  const servicePageLinks = servicePages
    .map((s) => servicesData.find((x) => x.slug === s))
    .filter(Boolean);
  const hasSummary = !!description || highlights.length > 0 || hasResults;

  /* ── Reusable image tile (optionally click-to-zoom) ── */
  const ImageTile = ({ tile, className = '' }) => {
    const body = (
      <>
        <img
          src={tile.src}
          alt={tile.alt}
          className="project-page__tile-img"
          loading="lazy"
        />
        {tile.caption && (
          <span className="project-page__tile-caption">{tile.caption}</span>
        )}
      </>
    );

    if (tile.zoom) {
      return (
        <button
          type="button"
          className={`project-page__tile project-page__tile--media project-page__tile--zoom ${className}`}
          onClick={() => setZoomSrc(tile.src)}
          aria-label={`Zoom into ${tile.alt}`}
        >
          {body}
        </button>
      );
    }
    return (
      <figure
        className={`project-page__tile project-page__tile--media ${className}`}
      >
        {body}
      </figure>
    );
  };

  return (
    <>
      <Seo
        title={`${title} | Switch Case Studio`}
        description={metaDescription}
        path={`/projects/${slug}`}
        ogType="article"
        image={publicImageSrc || undefined}
        imageAlt={imageAlt || title}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: title,
            url: `https://switchcasestudio.com/projects/${slug}`,
            description: metaDescription,
            creator: {
              '@type': 'Organization',
              name: 'Switch Case Studio',
              url: 'https://switchcasestudio.com',
            },
            ...(year ? { dateCreated: String(year) } : {}),
            ...(publicImageSrc
              ? { image: `https://switchcasestudio.com${publicImageSrc}` }
              : {}),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Case Studies',
                item: 'https://switchcasestudio.com/projects',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: title,
                item: `https://switchcasestudio.com/projects/${slug}`,
              },
            ],
          },
        ]}
      />

      <article
        className="project-page project-page--bento"
        ref={rootRef}
        aria-labelledby="project-title"
      >
        {/* ── Top bar ── */}
        <nav className="project-page__topbar" aria-label="Project navigation">
          <Link
            to="/projects"
            className="project-page__back"
            aria-label="Back to all case studies"
          >
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            <span>All case studies</span>
          </Link>
          {servicePageLinks.length > 0 && (
            <p className="project-page__services">
              <span className="project-page__services-label">
                {servicePageLinks.length > 1 ? 'Services' : 'Service'}
              </span>
              {servicePageLinks.map((s) => (
                <Link
                  key={s.slug}
                  to={`/pricing/${s.slug}`}
                  className="project-page__service-link"
                >
                  {s.title}
                </Link>
              ))}
            </p>
          )}
        </nav>

        {/* ── Hero ── */}
        <header className="project-page__hero reveal">
          {/* `studioProject` is the self-initiated disclosure — it rides the
              kicker line so it can't be missed and can't shift layout. */}
          {(kicker || year || studioProject) && (
            <p className="project-page__kicker">
              {[kicker, year, studioProject && 'Studio project']
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}

          <h1 id="project-title" className="project-page__title">
            {title}
          </h1>

          {(outcome || subtitle) && (
            <p className="project-page__lede">{outcome || subtitle}</p>
          )}

          {services.length > 0 && (
            <ul className="project-page__tags" aria-label="Services delivered">
              {services.map((s) => (
                <li key={s.label} className="project-page__tag">
                  {s.label.replace(/^#/, '')}
                </li>
              ))}
            </ul>
          )}

          {(ctaUrl ||
            repos.length > 0 ||
            links.length > 0 ||
            (nextProject && nextProject.slug !== slug)) && (
            <div className="project-page__hero-actions">
              {ctaUrl && (
                <MagneticButton>
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-page__cta-button project-page__cta-button--primary"
                  >
                    {ctaLabel || 'View Live'}{' '}
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      aria-hidden="true"
                    />
                  </a>
                </MagneticButton>
              )}

              {/* Live things that aren't the primary CTA and aren't source —
                  hosted API docs, a spec, a status page. */}
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-page__cta-button project-page__cta-button--secondary"
                >
                  {link.label}{' '}
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    aria-hidden="true"
                  />
                </a>
              ))}

              {/* One button per public repo. A single repo reads "View the
                  code"; several are labelled by their role in the build so the
                  row tells the pipeline story (scraper → API → front end). */}
              {repos.map((repo) => (
                <a
                  key={repo.url}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-page__cta-button project-page__cta-button--code"
                >
                  <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
                  {repos.length === 1
                    ? 'View the code'
                    : `Code: ${repo.label}`}
                </a>
              ))}

              {nextProject && nextProject.slug !== slug && (
                <Link
                  to={`/projects/${nextProject.slug}`}
                  className="project-page__cta-button project-page__cta-button--secondary"
                >
                  Next: {nextProject.title}{' '}
                  <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </header>

        {/* ── Live site (hero band) — the real, working proof, up top ── */}
        {liveOK && (
          <section
            className="project-page__live reveal"
            aria-label="Live site preview"
          >
            <div className="project-page__live-tile">
              <span className="project-page__live-badge">
                <span
                  className="project-page__live-dot"
                  aria-hidden="true"
                />
                Live
              </span>
              <ScrollingShot
                key={slug}
                src={publicLongWeb}
                alt={imageAlt || `${title}: landing page`}
              />
            </div>
          </section>
        )}

        {/* ── Architecture band — the build's shape, before the prose ──
            Full width and object-fit:contain (never cover), so a wide diagram
            is never cropped. Below ~$pp-max the figure scrolls horizontally at
            a legible min-width instead of shrinking the labels to nothing. */}
        {diagram && (
          <section
            className="project-page__diagram reveal"
            aria-label="Architecture"
          >
            <h2 className="project-page__section-label">Architecture</h2>
            <button
              type="button"
              className="project-page__diagram-frame"
              onClick={() => setZoomSrc(diagram)}
              aria-label="Zoom into the architecture diagram"
            >
              <img
                src={diagram}
                alt={diagramAlt || `${title}: architecture diagram`}
                className="project-page__diagram-img"
                loading="lazy"
              />
            </button>
          </section>
        )}

        {/* ── Summary bento: Overview + Scope (left) · Results (right) ── */}
        {hasSummary && (
          <section
            className="project-page__summary reveal"
            aria-label="Overview, scope and results"
          >
            {(description || highlights.length > 0) && (
              <div className="project-page__col">
                {description && (
                  <div className="project-page__tile project-page__tile--text">
                    <h2 className="project-page__section-label">Overview</h2>
                    <p className="project-page__desc">{description}</p>
                  </div>
                )}

                {highlights.length > 0 && (
                  <div className="project-page__tile project-page__tile--text">
                    <h2 className="project-page__section-label">Scope</h2>
                    <dl className="project-page__scope-list">
                      {highlights.map((item) => (
                        <div
                          key={item.title}
                          className="project-page__scope-item"
                        >
                          <dt className="project-page__scope-title">
                            {item.title}
                          </dt>
                          <dd className="project-page__scope-summary">
                            {item.summary}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            )}

            {hasResults && (
              <div
                className="project-page__col project-page__col--results"
                aria-label="Results"
              >
                <h2 className="project-page__section-label">Results</h2>
                <div className="project-page__results-grid">
                  {metrics.map((m, i) => (
                    <div
                      key={m.label}
                      className={`project-page__tile project-page__metric${
                        i === 0 ? ' project-page__metric--lead' : ''
                      }`}
                    >
                      <span className="project-page__metric-value">
                        {m.value}
                      </span>
                      <span className="project-page__metric-label">
                        {m.label}
                      </span>
                    </div>
                  ))}

                  {detailTiles.map((tile) => (
                    <ImageTile key={tile.key} tile={tile} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Result quote band ── */}
        {result && (
          <section className="project-page__result reveal" aria-label="Outcome">
            <p className="project-page__result-text">{result}</p>
          </section>
        )}

        {/* ── Brand kit — the identity, board by board ── */}
        {brandKit.length > 0 && (
          <section
            className="project-page__kit reveal"
            aria-label="Brand kit"
          >
            <h2 className="project-page__section-label">Brand kit</h2>
            {brandKitNote && (
              <p className="project-page__compare-note">{brandKitNote}</p>
            )}
            <div className="project-page__kit-stack">
              {brandKit.map((board) => (
                <button
                  key={board.src}
                  type="button"
                  className="project-page__kit-board"
                  onClick={() => setZoomSrc(board.src)}
                  aria-label={`Zoom into ${board.alt}`}
                >
                  {/* `srcSmall` (1200w) is optional and explicit, never a
                      derived filename: a guessed sibling that 404s inside a
                      srcSet fails silently (CLAUDE.md, "Adding a project" rule). */}
                  <img
                    src={board.src}
                    srcSet={
                      board.srcSmall
                        ? `${board.srcSmall} 1200w, ${board.src} ${board.width || 2000}w`
                        : undefined
                    }
                    sizes="(max-width: 1248px) calc(100vw - 2.5rem), 1200px"
                    alt={board.alt}
                    width={board.width || 2000}
                    height={board.height || 1250}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Motion — a video piece made for the brand ── */}
        {motion?.mp4 && (
          <section
            className="project-page__motion reveal"
            aria-label="Motion"
          >
            <div className="project-page__motion-text">
              <h2 className="project-page__section-label">Motion</h2>
              {motion.caption && (
                <p className="project-page__motion-caption">{motion.caption}</p>
              )}
              {motion.note && (
                <p className="project-page__compare-note">{motion.note}</p>
              )}
            </div>
            <MotionReel
              mp4={motion.mp4}
              webm={motion.webm}
              poster={motion.poster}
              label={motion.alt || `${title}: motion piece`}
            />
          </section>
        )}

        {/* ── Before/after band — last, after the reader has the context ──
            Sits below the live view and the overview/scope/results so the
            comparison lands on someone who already knows what changed and why.
            One contain-fit frame per comparison: below ~$pp-max each frame
            scrolls sideways at a legible min-width rather than shrinking a
            side-by-side into two unreadable thumbnails. */}
        {comparisons.length > 0 && (
          <section
            className="project-page__compare reveal"
            aria-label={comparisonsLabel || 'Before and after'}
          >
            <h2 className="project-page__section-label">
              {comparisonsLabel || 'Before and after'}
            </h2>
            {comparisonsNote && (
              <p className="project-page__compare-note">{comparisonsNote}</p>
            )}
            {comparisons.map((cmp) => (
              <figure className="project-page__compare-item" key={cmp.src}>
                <button
                  type="button"
                  className="project-page__diagram-frame"
                  onClick={() => setZoomSrc(cmp.src)}
                  aria-label={`Zoom into ${cmp.alt || cmp.caption}`}
                >
                  <img
                    src={cmp.src}
                    alt={cmp.alt || `${title}: ${cmp.caption}, before and after`}
                    className="project-page__compare-img"
                    loading="lazy"
                  />
                </button>
                {(cmp.caption || cmp.note) && (
                  <figcaption className="project-page__compare-caption">
                    {cmp.caption && <strong>{cmp.caption}</strong>}
                    {cmp.note && <span>{cmp.note}</span>}
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        )}

        {/* ── Media gallery bento ── */}
        {galleryTiles.length > 0 && (
          <section
            className="project-page__gallery reveal"
            data-count={galleryTiles.length}
            aria-label="Project visuals"
          >
            {galleryTiles.map((tile) => (
              <ImageTile key={tile.key} tile={tile} />
            ))}
          </section>
        )}

        {/* ── Lightbox (any zoomable tile) ── */}
        {zoomSrc && (
          <ZoomLightbox
            src={zoomSrc}
            alt={
              zoomSrc === diagram
                ? diagramAlt || `${title}: architecture diagram`
                : comparisons.find((c) => c.src === zoomSrc)?.alt ||
                  brandKit.find((b) => b.src === zoomSrc)?.alt ||
                  imageAlt ||
                  title
            }
            open={!!zoomSrc}
            onClose={() => setZoomSrc(null)}
          />
        )}
      </article>
    </>
  );
};

export default CaseStudyPage;
