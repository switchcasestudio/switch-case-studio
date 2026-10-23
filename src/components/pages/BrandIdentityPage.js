import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import servicesData from '../../data/services.json';
import BrandWorld from '../brandWorld/BrandWorld';

/* /services/brand-identity (2026-10-22). The service page is the experience;
   the price lives on /pricing/brand-identity only (owner). This page is
   exempt from the page-head rule on purpose: it exists to show graphic
   design, so the headline sits inside the collage and the tiles run over
   it. Its own static route record in routes.js; a service without a world
   goes to its pricing page (ServiceRedirect + netlify.toml). */
const SLUG = 'brand-identity';
const PATH = `/services/${SLUG}`;
const service = servicesData.find((s) => s.slug === SLUG);

export default function BrandIdentityPage() {
  return (
    <>
      <Seo
        title="Graphic Design & Brand Identity | Switch Case Studio"
        description="Logo, color, type and the rules that keep them together. Five studio concepts you can push around, by the designer who draws them."
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
