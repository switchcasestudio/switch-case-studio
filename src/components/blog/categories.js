/* The journal's categories, one list (SEO audit fix 14, 2026-10-09).
   Posts had drifted into near-duplicates ("Automation", "Automation &
   Systems", "AI & Automation"; "UX & Web Design", "Web Design"), which
   splits one topic across labels. scripts/add-post.mjs folds the known
   aliases into these and warns on anything else; it never rejects, because
   the daily scheduler runs it unattended. Pure JS, shared with node. */
export const BLOG_CATEGORIES = [
  'Web Design',
  'Web Development',
  'Brand Identity',
  'SEO & Growth',
  'AI & Automation',
  'Studio News',
];

export const CATEGORY_ALIASES = {
  Automation: 'AI & Automation',
  'Automation & Systems': 'AI & Automation',
  AI: 'AI & Automation',
  'UX & Web Design': 'Web Design',
  UX: 'Web Design',
  Performance: 'Web Development',
  SEO: 'SEO & Growth',
  Branding: 'Brand Identity',
};

/* The canonical category for a label, or the label itself when unknown. */
export const normalizeCategory = (c) => CATEGORY_ALIASES[c] || c;

export const isKnownCategory = (c) => BLOG_CATEGORIES.includes(c);
