import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import postsData from '../../data/posts.json';
import BookCallCta from '../ui/BookCallCta';
import { Block, formatDate } from './blogBlocks';
import { plainText } from './inlineLinks';
import useJournalMotion from './useJournalMotion';
import '../../styles/components/journal.scss';

/* The Studio Journal as a split reader (owner, 2026-09-11, after a
   "selected works" index reference): the left third is the post list
   (title + date, the open post highlighted) with the open post's details
   under it; the right two-thirds is the article itself. /blog opens the
   newest post; /blog/:slug opens that post. Each post keeps its own URL.

   Heading levels: on /blog the journal title is the page h1 and the article
   title an h2; on a post page the article title is the h1. Body headings
   are h2 either way, so no level is ever skipped. */

// Newest first: the data file is author-ordered, the journal is date-ordered.
export const sortedPosts = [...postsData].sort((a, b) => (a.date < b.date ? 1 : -1));

const shortDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Posts per list page. 11 so the current 12 posts paginate (owner,
// 2026-09-11): page 1 holds 11, page 2 the oldest.
const PAGE_SIZE = 11;
const pageCount = Math.ceil(sortedPosts.length / PAGE_SIZE);

/* Column rhythm (owner, 2026-09-11): the body is cut into sections at each
   heading, and each section is set in one or two columns. The intro (before
   the first heading) is always two columns. After that the CONTENT decides,
   so the rhythm is irregular but never arbitrary:
   - media (quote, video, download) or a short section (< 110 words) → one;
   - a long prose run (> 200 words) → two;
   - in between, a stable hash of slug + index picks, so each post has its
     own pattern and SSR and hydration agree;
   - never three sections in a row in the same mode. */
const words = (b) =>
  plainText(b.text || (b.items || []).join(' ') || '')
    .split(/\s+/)
    .filter(Boolean).length;
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const sectionize = (body, slug) => {
  const sections = [];
  body.forEach((b) => {
    if (b.type === 'heading' || !sections.length) sections.push({ heading: null, blocks: [] });
    const s = sections[sections.length - 1];
    if (b.type === 'heading') s.heading = b;
    else s.blocks.push(b);
  });
  let run = 0;
  let last = null;
  return sections.map((s, i) => {
    const n = s.blocks.reduce((t, b) => t + words(b), 0);
    const media = s.blocks.some((b) => ['quote', 'video', 'download'].includes(b.type));
    let two;
    if (i === 0 && !s.heading) two = true;
    else if (media || n < 110) two = false;
    else if (n > 200) two = true;
    else two = hash(`${slug}${i}`) % 2 === 0;
    if (!media && i > 0 && run >= 2 && two === last) two = !two;
    run = two === last ? run + 1 : 1;
    last = two;
    return { ...s, two };
  });
};

const JournalReader = ({ post, isIndex = false }) => {
  const idx = sortedPosts.findIndex((p) => p.slug === post.slug);
  // The list opens on the page that holds the open post. Derived from the
  // route (not the viewport), so the static HTML and hydration agree.
  const postPage = Math.max(0, Math.floor(idx / PAGE_SIZE));
  const [page, setPage] = useState(postPage);
  useEffect(() => setPage(postPage), [postPage]);
  const rootRef = useRef(null);
  useJournalMotion(rootRef, post.slug, page);
  const pagePosts = sortedPosts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const nextPost = sortedPosts[(idx + 1) % sortedPosts.length];
  const TitleTag = isIndex ? 'h2' : 'h1';
  const JournalTag = isIndex ? 'h1' : 'p';
  const {
    title,
    excerpt,
    category,
    author,
    authorRole,
    date,
    readingTime,
    tags = [],
    body = [],
    coverImage,
  } = post;

  return (
    <div className="journal" ref={rootRef}>
      <div className="journal__progress" aria-hidden="true" />
      <aside className="journal__side" aria-label="The Studio Journal">
        <JournalTag className="journal__name">
          <Link to="/blog">The Studio Journal</Link>
        </JournalTag>

        <ol className="journal__list" aria-label="All articles">
          {pagePosts.map((p) => {
            const active = p.slug === post.slug;
            return (
              <li key={p.slug}>
                <Link
                  to={`/blog/${p.slug}`}
                  className={`journal__item${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="journal__item-title" title={p.title}>
                    {p.title}
                  </span>
                  <span className="journal__item-date">{shortDate(p.date)}</span>
                </Link>
              </li>
            );
          })}
          {/* A short last page keeps its full height (owner, 2026-09-11): empty
              rows with the same markup, so the pager and details never jump. */}
          {Array.from({ length: pageCount > 1 ? PAGE_SIZE - pagePosts.length : 0 }, (_, n) => (
            <li key={`pad-${n}`} aria-hidden="true">
              <span className="journal__item">
                <span className="journal__item-title">&nbsp;</span>
              </span>
            </li>
          ))}
        </ol>

        {pageCount > 1 && (
          <nav className="journal__pager" aria-label="Article list pages">
            <button
              type="button"
              className="journal__pager-step"
              onClick={() => setPage((n) => Math.max(0, n - 1))}
              disabled={page === 0}
              aria-label="Previous page"
            >
              &larr;
            </button>
            {Array.from({ length: pageCount }, (_, n) => (
              <button
                key={n}
                type="button"
                className={`journal__pager-num${n === page ? ' is-current' : ''}`}
                onClick={() => setPage(n)}
                aria-current={n === page ? 'page' : undefined}
                aria-label={`Page ${n + 1}`}
              >
                {n + 1}
              </button>
            ))}
            <button
              type="button"
              className="journal__pager-step"
              onClick={() => setPage((n) => Math.min(pageCount - 1, n + 1))}
              disabled={page === pageCount - 1}
              aria-label="Next page"
            >
              &rarr;
            </button>
          </nav>
        )}

        <dl className="journal__details" aria-label="About this article">
          <div>
            <dt>Title</dt>
            <dd>{title}</dd>
          </div>
          {category && (
            <div>
              <dt>Category</dt>
              <dd>{category}</dd>
            </div>
          )}
          {date && (
            <div>
              <dt>Published</dt>
              <dd>{formatDate(date)}</dd>
            </div>
          )}
          {readingTime && (
            <div>
              <dt>Reading</dt>
              <dd>{readingTime}</dd>
            </div>
          )}
          {author && (
            <div>
              <dt>Author</dt>
              <dd>
                {author}
                {authorRole ? `, ${authorRole}` : ''}
              </dd>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <dt>Topics</dt>
              <dd>{tags.join(', ')}</dd>
            </div>
          )}
        </dl>
      </aside>

      <article
        key={post.slug}
        className="journal__article"
        aria-labelledby="journal-article-title">
        <figure className="journal__cover">
          {coverImage ? (
            <img src={coverImage} alt="" width="1200" height="675" />
          ) : (
            <span className="journal__cover-mark" aria-hidden="true">
              {category || 'Journal'}
            </span>
          )}
        </figure>

        <header className="journal__head">
          <TitleTag id="journal-article-title" className="journal__title">
            {title}
          </TitleTag>
          {excerpt && <p className="journal__lede">{excerpt}</p>}
        </header>

        <div className="journal__body">
          {sectionize(body, post.slug).map((s, i) => (
            <section key={i} className="journal__section">
              {s.heading && <Block block={s.heading} />}
              <div className={`journal__cols${s.two ? ' is-two' : ''}`}>
                {s.blocks.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="journal__foot">
          <p className="journal__cta-line">Like how we think? Let's build something together.</p>
          <BookCallCta className="journal__cta" />
          {nextPost && nextPost.slug !== post.slug && (
            <Link to={`/blog/${nextPost.slug}`} className="journal__next">
              <span className="journal__next-label">Next article</span>
              <span className="journal__next-title">{nextPost.title} &rarr;</span>
            </Link>
          )}
        </footer>
      </article>
    </div>
  );
};

export default JournalReader;
