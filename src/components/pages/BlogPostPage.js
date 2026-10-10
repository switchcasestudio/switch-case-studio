import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Seo from '../util/Seo';
import postsData from '../../data/posts.json';
import teamData from '../../data/team.json';
import JournalReader from '../blog/JournalReader';
import { brandTitle, clampAtWord } from '../../utils/seoText';
import { ORG_REF, SITE, authorNode } from '../../utils/schemaIds';

const TEAM_NAMES = teamData.map((p) => p.name);

const BlogPostPage = () => {
  const { slug } = useParams();

  const post = useMemo(() => postsData.find((p) => p.slug === slug) || null, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

  const { title, seoTitle, excerpt, author, date, updated, coverImage, imageAlt } = post;

  // The excerpt is the page's lede AND its meta description, so it is kept
  // under 160 characters at the data (SEO audit fix 8). The clamp is the net
  // for a future post that runs long; add-post.mjs warns when it would fire.
  const metaDescription =
    clampAtWord(excerpt) || `${title}, from the Switch Case Studio blog.`;

  const url = `${SITE}/blog/${slug}`;

  return (
    <>
      <Seo
        title={brandTitle(seoTitle || title)}
        description={metaDescription}
        path={`/blog/${slug}`}
        ogType="article"
        image={coverImage || undefined}
        imageAlt={imageAlt || title}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            url,
            description: metaDescription,
            ...(date ? { datePublished: date, dateModified: updated || date } : {}),
            ...(coverImage ? { image: `${SITE}${coverImage}` } : {}),
            author: authorNode(author, TEAM_NAMES),
            publisher: ORG_REF,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Blog',
                item: `${SITE}/blog`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: title,
                item: url,
              },
            ],
          },
        ]}
      />

      <JournalReader post={post} />
    </>
  );
};

export default BlogPostPage;
