/* One set of JSON-LD node ids for the whole site (SEO audit fix 9,
   2026-10-09). index.html defines the Organization (#org), the WebSite
   (#website) and the founder; every page-level node points at them by @id
   instead of restating a bare { name, url } copy, so search engines and AI
   assistants read one entity, not four slightly different ones.
   index.html is static and cannot import this file: its ids are a
   hand-mirror, checked on the build (see the CLAUDE.md rule). */
export const SITE = 'https://switchcasestudio.com';
export const ORG_ID = `${SITE}/#org`;
export const WEBSITE_ID = `${SITE}/#website`;

export const ORG_REF = { '@id': ORG_ID };
export const WEBSITE_REF = { '@id': WEBSITE_ID };

/* A person's node id, from their name: "Moses Atia Poston" → /#moses-atia-poston. */
export const personId = (name) =>
  `${SITE}/#${String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;

/* The node a blog post's author points at. Every post so far is by the
   founder; a byline that is not a person on the team still gets a Person
   node, just without the shared id. */
export const authorNode = (name, teamNames = []) => {
  const author = name || 'Moses Atia Poston';
  return teamNames.includes(author)
    ? { '@type': 'Person', '@id': personId(author), name: author, url: `${SITE}/about` }
    : { '@type': 'Person', name: author };
};
