/* Shared blog rendering: the date formatter and the body-block renderer,
   used by both /blog and /blog/:slug (the split-reader layout, 2026-09-11).
   Moved here verbatim from BlogPostPage. The `download` block's `download`
   attribute is load-bearing: ga.js's delegated listener matches on it to
   fire file_download. Adding a block type means updating BOTH this switch
   and scripts/add-post.mjs's BLOCK_TYPES (see CLAUDE.md, blog contract).
   The block styles are imported HERE, not by a page: /blog is its own route
   chunk, and when only BlogPostPage imported them, /blog rendered unstyled,
   run-together paragraphs. */
import { Fragment } from 'react';
import { tokenize } from './inlineLinks';
import '../../styles/components/blogPostPage.scss';

/* Paragraph and list text may carry inline links, [label](url), since
   2026-10-09 (see inlineLinks.js): root-absolute urls stay on the site, https
   urls open in a new tab, like the `link` block. Everything else is text. */
export const Inline = ({ text }) =>
  tokenize(text).map((t, i) =>
    t.type === 'link' ? (
      <a
        key={i}
        href={t.url}
        className="blog-post__a"
        {...(t.url.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {t.label}
      </a>
    ) : (
      <Fragment key={i}>{t.value}</Fragment>
    ),
  );

export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/* Turn a YouTube watch/share/embed URL into an embeddable /embed/<id> URL.
   Returns null if it isn't a YouTube URL we recognize. */
export const youTubeEmbed = (url) => {
  if (!url) return null;
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
};

/* Render one body block. The block vocabulary is intentionally small so an
   automation (Beau via n8n) can emit posts as plain JSON:
   { type: 'paragraph' | 'heading' | 'list' | 'quote' | 'video', ... }.
   Unknown types are ignored rather than crashing the page. */
export const Block = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return <h2 className="blog-post__h2">{block.text}</h2>;
    case 'video': {
      const embed = youTubeEmbed(block.url);
      if (!embed) return null;
      return (
        <figure className="blog-post__video">
          <div className="blog-post__video-frame">
            <iframe
              src={embed}
              title={block.title || 'Embedded video'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          {block.caption && (
            <figcaption className="blog-post__video-caption">{block.caption}</figcaption>
          )}
        </figure>
      );
    }
    case 'paragraph':
      return (
        <p className="blog-post__p">
          <Inline text={block.text} />
        </p>
      );
    case 'list':
      return (
        <ul className="blog-post__list">
          {(block.items || []).map((item, i) => (
            <li key={i}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case 'download': {
      if (!block.url || !block.label) return null;
      // Root-absolute path to a file in public/. The download attribute is what
      // ga.js's delegated listener matches on to fire file_download, so it is
      // load-bearing, not cosmetic.
      return (
        <a className="blog-post__download" href={block.url} download>
          <span className="blog-post__download-label">{block.label}</span>
          {block.note && <span className="blog-post__download-note">{block.note}</span>}
        </a>
      );
    }
    case 'link': {
      // A button-style link (added 2026-09-25): root-absolute paths stay on
      // the site, https URLs open in a new tab. No download attribute, so it
      // does not fire file_download; use the download block for files in public/.
      if (!block.url || !block.label) return null;
      const external = block.url.startsWith('https://');
      return (
        <a
          className="blog-post__download blog-post__link"
          href={block.url}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span className="blog-post__download-label">{block.label}</span>
          {block.note && <span className="blog-post__download-note">{block.note}</span>}
        </a>
      );
    }
    case 'quote':
      return (
        <blockquote className="blog-post__quote">
          <p>{block.text}</p>
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      );
    default:
      return null;
  }
};
