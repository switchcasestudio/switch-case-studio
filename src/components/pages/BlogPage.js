import Seo from '../util/Seo';
import JournalReader, { sortedPosts } from '../blog/JournalReader';
import teamData from '../../data/team.json';
import { ORG_REF, SITE, authorNode } from '../../utils/schemaIds';

/* /blog opens the journal on the newest post (split reader). The Blog
   JSON-LD still lists every post for search engines. */
const posts = sortedPosts;
const TEAM_NAMES = teamData.map((p) => p.name);

const BlogPage = () => (
  <>
      <Seo
        title="Blog | Switch Case Studio"
        description="Field notes on web design, development, AI, automation, and growth from Switch Case Studio: practical thinking from the team that builds and automates it."
        path="/blog"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          '@id': `${SITE}/blog#blog`,
          name: 'Switch Case Studio Blog',
          url: `${SITE}/blog`,
          description:
            'Field notes on web design, development, branding, and growth.',
          publisher: ORG_REF,
          blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${SITE}/blog/${p.slug}`,
            datePublished: p.date,
            dateModified: p.updated || p.date,
            author: authorNode(p.author, TEAM_NAMES),
          })),
        }}
      />
    <JournalReader post={posts[0]} isIndex />
  </>
);

export default BlogPage;
