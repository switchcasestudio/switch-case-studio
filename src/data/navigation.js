import projects from './projects.json';
import services from './services.json';

// Derived from services.json (like PROJECT_LINKS below) — title, slug, and
// ORDER all come from the data file, so a service rename/add/reorder can't
// drift here. Consumers: Header dropdown, StaggeredMenu, Footer.
export const PRICING_LINKS = services.map((service) => ({
  label: service.title,
  to: `/pricing/${service.slug}`,
}));

// Services and pricing are separate since 2026-10-22: /services/<slug> is
// the service page, /pricing/<slug> the packages. Only slugs listed here
// have a service page (routes.js emits them); every other service links
// straight to its pricing page until its own page exists, the same
// fallback netlify.toml applies with a 301.
export const SERVICE_PAGES = ['brand-identity'];

export const SERVICE_LINKS = services.map((service) => ({
  label: service.title,
  to: SERVICE_PAGES.includes(service.slug) ? `/services/${service.slug}` : `/pricing/${service.slug}`,
}));

// Dynamically generate project links based on the slugs in projects.json
export const PROJECT_LINKS = projects.map((project) => ({
  label: project.title,
  to: `/projects/${project.slug}`,
}));

// The footer's "Explore" column. Lived in Footer.js as a component-local array
// until 2026-08-05 — the same shape that let the service names drift there once
// already. Any new top-level route gets added HERE, not in a component.
// `hash` entries scroll a section on the current page; `to` entries are routes.
export const EXPLORE_LINKS = [
  { label: 'Services', hash: '#services' },
  { label: 'About', to: '/about' },
  { label: 'Case Studies', to: '/projects' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', hash: '#contact' },
];

// The hero's own nav (the header is hidden over the hero). Routes ONLY, never
// section hashes (owner, 2026-09-30): a hero link lands on a page, so Services
// goes to /pricing, not to the home services section. Order is display order.
export const HERO_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/pricing' },
  { label: 'Case Studies', to: '/projects' },
];

export const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Accessibility Statement', to: '/accessibility' },
];