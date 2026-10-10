// Head is vite-react-ssg's <Helmet> passthrough, bound to ITS react-helmet-async
// instance — the one its HelmetProvider and static-build collector share. The
// app must never import react-helmet-async directly: the repo had 3.0.0 while
// vite-react-ssg bundles 1.x, and two copies = two contexts = tags silently
// missing from the static HTML.
import { Head } from 'vite-react-ssg';

const SITE = 'https://switchcasestudio.com';
const DEFAULT_IMAGE = `${SITE}/images/og/og.png`;

/**
 * Per-route head tags — one of these must render on EVERY route.
 *
 * Why: index.html can't vary per route in a SPA, and react-helmet-async only
 * manages tags it creates. So route-variable tags (title, description,
 * canonical, og:*) live here exclusively; index.html keeps only site-wide
 * constants. A route without <Seo> would leak the previous route's title and
 * ship no canonical at all.
 *
 * `path` is the route path ("/about"), used for both canonical and og:url —
 * always the bare non-www domain, matching the sitemap.
 */
const Seo = ({
  title,
  description,
  path,
  ogType = 'website',
  image,
  imageAlt,
  jsonLd,
  noindex = false, // error/utility pages (404) must not enter the index
  robots, // explicit robots string (e.g. "noindex,follow"); overrides `noindex`
}) => {
  const url = `${SITE}${path}`;
  // A page that asks not to be indexed gets no canonical (SEO audit fix 13,
  // 2026-10-09): the 404 page pointed its canonical at /404, which tells a
  // crawler "index this URL" in the same head that says "don't".
  const indexable = !(noindex || (robots && /noindex/i.test(robots)));
  const img = image
    ? image.startsWith('http')
      ? image
      : `${SITE}${image}`
    : DEFAULT_IMAGE;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {robots ? (
        <meta name="robots" content={robots} />
      ) : (
        noindex && <meta name="robots" content="noindex" />
      )}
      {indexable && <link rel="canonical" href={url} />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Head>
  );
};

export default Seo;
