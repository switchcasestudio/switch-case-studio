import pricingData from './pricingData.json';

const usd = (n) => `$${n.toLocaleString('en-US')}`;
const lowest = (tiers) => {
  const prices = tiers.map((t) => t.price).filter((p) => typeof p === 'number');
  return prices.length ? usd(Math.min(...prices)) : null;
};

// Kebab-case of a package name: the id PackageBoard gives its column head
// (`#business-bundle`) and the value `/contact?package=` carries.
export const packageSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* The "from" prices for a service, read from pricingData so they cannot
   drift. One-time and monthly are kept apart (UX audit, 2026-11-10): the SEO
   card read "from $3,000", which is the monthly retainer, while the one-time
   Sprint is $3,500, so a visitor budgeted once for a price that repeats.
   Care plans are add-ons to a build and never the "from". */
export function fromPrices(slug) {
  const svc = pricingData.services.find((s) => s.id === slug);
  const tiers = (svc?.tiers || []).filter((t) => t.group !== 'Care');
  return {
    oneTime: lowest(tiers.filter((t) => t.billing !== 'monthly')),
    monthly: lowest(tiers.filter((t) => t.billing === 'monthly')),
  };
}

// The package a `/contact?service=…&package=…` link names, or null when the
// pair is not in pricingData (nothing typed into a URL reaches the page).
export function findPackage(serviceId, packageId) {
  const svc = pricingData.services.find((s) => s.id === serviceId);
  const tier = svc?.tiers.find((t) => packageSlug(t.name) === packageId);
  return tier ? { service: svc.title, name: tier.name } : null;
}
