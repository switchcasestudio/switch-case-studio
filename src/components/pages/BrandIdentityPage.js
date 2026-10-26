import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import servicesData from '../../data/services.json';
import BrandWorld from '../brandWorld/BrandWorld';

/* /services/graphic-design-brand-identity (2026-10-22). The service page is the experience;
   the price lives on /pricing/graphic-design-brand-identity only (owner). Exempt from the
   page-head rule on purpose: the h1 sits in the brand hero (BrandHero),
   beside the five kinds of logo on six touchpoints. Its own static route record in
   routes.js; a service without a world goes to its pricing page
   (ServiceRedirect + netlify.toml). */
const SLUG = 'graphic-design-brand-identity';
const PATH = `/services/${SLUG}`;
const service = servicesData.find((s) => s.slug === SLUG);

export default function BrandIdentityPage() {
  return (
    <>
      <Seo
        title="Graphic Design & Brand Identity | Switch Case Studio"
        description="Logo, type, color, rhythm and composition, each shown live: what a brand identity is made of, and how we draw one for web, print and packaging."
        path={PATH}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.description,
            url: `https://switchcasestudio.com${PATH}`,
            provider: ORG_REF,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Services', item: 'https://switchcasestudio.com/services' },
              { '@type': 'ListItem', position: 2, name: service.title, item: `https://switchcasestudio.com${PATH}` },
            ],
          },
        ]}
      />
      <BrandWorld />
    </>
  );
}
