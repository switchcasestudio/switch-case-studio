import projects from './projects.json';
import services from './services.json';
import servicePages from './servicePages.json';

// Derived from services.json (like PROJECT_LINKS below) — title, slug, and
// ORDER all come from the data file, so a service rename/add/reorder can't
// drift here. Consumers: Header dropdown, StaggeredMenu, Footer. (The
// pricing dropdown was removed on 2026-10-22, owner: Pricing is a plain link
// to /pricing, which lists the packages itself.)
//
// Services and pricing are separate since 2026-10-22: /services is the
// services index and /services/<slug> a service page; /pricing is the
// pricing index and /pricing/<slug> the packages. Only the slugs in
// servicePages.json have a service page (routes.js emits them; the build
// scripts read the same file for llms.txt); every other service links
// straight to its pricing page until its own page exists, the same
// fallback netlify.toml applies with a 301.
export const SERVICE_PAGES = servicePages;

// Where a service's card or menu entry lands: its own page when it has one,
// its pricing page until then. The home cards, the menus and the footer all
// go through this, so a new world only needs its slug added above.
export const servicePath = (slug) => (SERVICE_PAGES.includes(slug) ? `/services/${slug}` : `/pricing/${slug}`);

export const SERVICE_LINKS = services.map((service) => ({
  label: service.title,
  to: servicePath(service.slug),
}));

// Dynamically generate project links based on the slugs in projects.json
export const PROJECT_LINKS = projects.map((project) => ({
  label: project.title,
  to: `/projects/${project.slug}`,
}));

// The Case Studies menu (header dropdown and the phone menu's accordion):
// five picked case studies in the owner's order, then the way to all of
// them (owner, 2026-11-18: "re-arrange the list and shorten it"; the menu
// had every project, 14 rows). Labels come from projects.json; a slug that
// is not there stops the build here, where a filter would drop it quietly.
// The count in the last row follows the data.
const MENU_PROJECT_SLUGS = [
  'sha-design-studio',
  'prodani-miami',
  'zahav-medspa',
  'unhurried',
  'florida-green-improvements',
];

export const MENU_PROJECT_LINKS = [
  ...MENU_PROJECT_SLUGS.map((slug) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) throw new Error(`navigation.js: no project "${slug}" in projects.json`);
    return { label: project.title, to: `/projects/${slug}` };
  }),
  { label: `See all ${projects.length} case studies`, to: '/projects', all: true },
];

// The footer's "Explore" column. Lived in Footer.js as a component-local array
// until 2026-08-05 — the same shape that let the service names drift there once
// already. Any new top-level route gets added HERE, not in a component.
// `hash` entries scroll a section on the current page; `to` entries are routes.
export const EXPLORE_LINKS = [
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Case Studies', to: '/projects' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', hash: '#contact' },
];

// The hero's own nav (the header is hidden over the hero). Routes ONLY, never
// section hashes (owner, 2026-09-30): a hero link lands on a page, so Services
// goes to the /services index, not to the home services section. Order is
// display order.
// Pricing is here since 2026-11-10 (UX audit): the home page had no route to
// a price, and "can I afford this?" is a cold visitor's first question.
export const HERO_LINKS = [
  { label: 'Services', to: '/services' },
  { label: 'Case Studies', to: '/projects' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  // Five links wrap to a second row on a phone, which pushes the intro into
  // the ident; the phone row keeps four (Shop stays in the menu and footer).
  { label: 'Shop', to: '/shop', wideOnly: true },
];

export const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Accessibility Statement', to: '/accessibility' },
];