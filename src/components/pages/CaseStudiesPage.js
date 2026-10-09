import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import projectsData from '../../data/projects.json';
import { groupProjects } from '../../data/projectGroups';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import { ORG_REF, SITE, WEBSITE_REF } from '../../utils/schemaIds';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/projectsPage.scss';

/* /projects (2026-09-27, fifth pass, owner: "something is not working
 * for me with the colors"): SITE-FIRST tiles, black, in the site's own
 * register. The real site shot is the tile's top, full bleed; under it the
 * type and year, the title, the index line and the project's one measured
 * figure (`indexMetric`, value verbatim from its `metrics[]`) in lavender.
 * The sites bring their own colour; the page adds none. Groups from
 * projectGroups.js (shared with the home index), three across. Static HTML
 * is complete; hover is CSS. */
const grouped = groupProjects(projectsData);

/* CollectionPage + ItemList in the page's own order (SEO audit fix 9). */
const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Case Studies',
  url: `${SITE}/projects`,
  isPartOf: WEBSITE_REF,
  publisher: ORG_REF,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: grouped
      .flatMap((g) => g.projects)
      .map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: `${SITE}/projects/${p.slug}`,
      })),
  },
};

// The 600w sibling serves tiles up to ~2x of their width; the 1200w covers
// wide single-column phones.
const small = (src) => src.replace(/\.webp$/, '-600.webp');

// First sentence of the case-study description, for the feature tile.
const firstSentence = (text = '') => {
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : text).trim();
};

/* Grid roles inside a group (12 columns): the newest project is the
 * feature (8 wide, 2 rows), the next two stack beside it, the rest run in
 * thirds; a leftover pair goes half and half, a single leftover half. */
const role = (i, n) => {
  if (i === 0) return ' pt__card--feature';
  if (i < 3) return '';
  const rest = n - 3;
  const ri = i - 3;
  const rem = rest % 3;
  if ((rem === 2 && ri >= rest - 2) || (rem === 1 && ri === rest - 1)) return ' pt__card--half';
  return '';
};

const CaseStudiesPage = () => {
  const rootRef = useRef(null);
  /* One call per page (module-level latches): head and groups in one
   * stagger on client navigation; a direct load keeps the static HTML. */
  usePageHeaderReveal(rootRef, '.page-head-animate, .pt__group');
  return (
    <>
      <Seo
        title="Case Studies | Switch Case Studio"
        description="Browse Switch Case Studio's portfolio: landing pages, websites, e-commerce stores, and apps built for clients across the US."
        path="/projects"
        jsonLd={collectionJsonLd}
      />

      <article className="projects-page" aria-label="Case studies" ref={rootRef}>
        <header className="projects-page__header">
          <p className="projects-page__kicker page-head-animate">Portfolio</p>
          <h1 className="projects-page__title page-head-animate">Selected work</h1>
          <p className="projects-page__lede page-head-animate">
            {projectsData.length} projects, every one built from scratch, most with a
            number you can check.
          </p>
        </header>

        <div className="pt">
          {grouped.map((g) => (
            <section className="pt__group" key={g.heading} aria-labelledby={`pt-${g.color}`}>
              <h2 className="pt__heading" id={`pt-${g.color}`}>{g.heading}</h2>
              <div className="pt__grid">
                {g.projects.map((p, i) => {
                  const src = p.preview || p.imageSrc;
                  const line = [p.indexLine, p.studioProject && 'Studio project'].filter(Boolean).join(' · ');
                  const feature = i === 0;
                  return (
                    <Link
                      key={p.slug}
                      to={`/projects/${p.slug}`}
                      className={`pt__card${role(i, g.projects.length)}`}
                      /* The card's visible text runs together for a screen
                         reader (meta, title, blurb, figure with no spaces),
                         so the link's name is spelled out. */
                      aria-label={[
                        `${p.title}, ${p.type}`,
                        p.indexMetric && `${p.indexMetric.value} ${p.indexMetric.label}`,
                        'case study',
                      ].filter(Boolean).join(', ')}
                    >
                      {/* The site itself is the tile's top two-thirds. */}
                      <img
                        className="pt__shot"
                        src={small(src)}
                        srcSet={`${small(src)} 600w, ${src} 1200w`}
                        sizes={feature ? '(max-width: 1024px) 90vw, 62vw' : '(max-width: 640px) 90vw, (max-width: 1024px) 44vw, 30vw'}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="375"
                      />
                      <span className="pt__body">
                        <span className="pt__meta">
                          <span className="pt__meta-type">{p.type}</span>
                          {p.year && <span className="pt__meta-year">{p.year}</span>}
                        </span>
                        <span className="pt__title">{p.title}</span>
                        {line && <span className="pt__line">{line}</span>}
                        {feature && p.description && (
                          <span className="pt__blurb">{firstSentence(p.description)}</span>
                        )}
                        {p.indexMetric && (
                          <span className="pt__figure">
                            <span className="pt__value">{p.indexMetric.value}</span>
                            <span className="pt__label">{p.indexMetric.label}</span>
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="projects-page__bottom">
          <p className="projects-page__bottom-text">Want to see what we can build for you?</p>
          <BookCallCta className="projects-page__bottom-btn" />
        </div>
      </article>
    </>
  );
};

export default CaseStudiesPage;
