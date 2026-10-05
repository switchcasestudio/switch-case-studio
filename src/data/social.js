/* ------------------------------------------------------------------ *
 * Studio social profiles — SINGLE SOURCE OF TRUTH.
 *
 * Two consumers:
 *   1. Footer.js          — the icon row (maps `key` to a FontAwesome icon)
 *   2. index.html         — the Organization JSON-LD `sameAs` array
 *
 * (2) is the one hand-mirrored spot, because index.html is static and
 * cannot import a module. It carries a comment pointing back here. Same
 * necessary-mirror situation as the slug -> pricing-id maps documented in
 * CLAUDE.md — so when a profile is added or a handle changes, edit HERE
 * first, then mirror into the index.html sameAs array in the same commit.
 *
 * Why `sameAs` matters more than usual for this studio: the brand name
 * collides with Nintendo Switch cases and a Portland coffee chain, so the
 * studio cannot win on string matching. `sameAs` is how search engines and
 * AI assistants resolve these scattered accounts to ONE entity — a match on
 * any profile resolves back to the studio.
 *
 * Order is display order in the footer. GitHub leads: it is the only profile
 * that PROVES the engineering claim rather than asserting it.
 * ------------------------------------------------------------------ */

const SOCIAL_PROFILES = [
  { key: 'gh', label: 'GitHub', url: 'https://github.com/switchcasestudio' },
  { key: 'ig', label: 'Instagram', url: 'https://www.instagram.com/switchcasestudio' },
  { key: 'th', label: 'Threads', url: 'https://www.threads.com/@switchcasestudio' },
  { key: 'x', label: 'X (Twitter)', url: 'https://x.com/s_c_studio' },
  {
    key: 'fb',
    label: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61592118681299',
  },
  { key: 'li', label: 'LinkedIn', url: 'https://www.linkedin.com/company/127224064' },
  {
    key: 'gb',
    label: 'Google Business profile',
    url: 'https://maps.google.com/?cid=875109400879972028',
  },
];

/** Every external profile URL — this is exactly what `sameAs` must contain. */
export const SOCIAL_URLS = SOCIAL_PROFILES.map((p) => p.url);

export default SOCIAL_PROFILES;
