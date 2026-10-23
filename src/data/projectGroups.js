/* The case-study groups, ONE definition for the home index
   (CaseStudyIndex.js) and the /projects page (CaseStudiesPage.js). A
   project's `type` picks its group; a type no group names lands in
   "More work" so nothing ever drops off the page (Unhurried did once,
   2026-09-26). Add a new `type` here or it grows a lone column. */
// `color` is the group's plate on /projects (terra / lilac / mint, the
// poster palette); the home index stays monochrome.
export const GROUPS = [
  { heading: 'Rebuilds + SEO', color: 'terra', types: ['Rebuild + Local SEO', 'Rebuild + SEO'] },
  {
    heading: 'Business websites',
    color: 'lilac',
    types: ['Business Website', 'Portfolio Site'],
  },
  {
    heading: 'Products + experiments',
    color: 'mint',
    // Landing Page sits here (owner, 2026-09-11) so the Rebuilds column
    // stays short and the home preview can sit under it.
    types: [
      'WordPress Theme',
      'Open-Source App',
      'SaaS Product',
      'E-Commerce',
      'Full-Stack + API',
      'Interactive Experience',
      'Landing Page',
    ],
  },
];

// Every project, in data order, split into the groups above. Empty groups
// are dropped; unknown types collect in a trailing "More work" group.
export function groupProjects(projects) {
  const grouped = GROUPS.map((g) => ({
    ...g,
    projects: projects.filter((p) => g.types.includes(p.type)),
  }));
  const known = new Set(GROUPS.flatMap((g) => g.types));
  const leftovers = projects.filter((p) => !known.has(p.type));
  if (leftovers.length) {
    grouped.push({ heading: 'More work', color: 'lilac', types: [], projects: leftovers });
  }
  return grouped.filter((g) => g.projects.length);
}
