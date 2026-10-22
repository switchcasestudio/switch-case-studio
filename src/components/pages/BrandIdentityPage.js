import { Navigate, useParams } from 'react-router-dom';
import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import servicesData from '../../data/services.json';
import BrandWorld from '../brandWorld/BrandWorld';

/* /services/brand-identity (2026-10-22). The service page is the experience;
   the price lives on /pricing/brand-identity only (owner). This page is
   exempt from the page-head rule on purpose: it exists to show graphic
   design, so the headline sits inside the collage and the tiles run over
   it. Only this slug has a world; routes.js emits only this path and
   netlify.toml 301s the other services to their pricing page. */
const SLUG = 'brand-identity';
const PATH = `/services/${SLUG}`;
const service = servicesData.find((s) => s.slug === SLUG);

export default function BrandIdentityPage() {
  const { serviceSlug } = useParams();
  if (serviceSlug && serviceSlug !== SLUG) return <Navigate to={`/pricing/${serviceSlug}`} replace />;

  return (
    <>
      <Seo
        title="Brand Identity Design | Switch Case Studio"
        description="Logo, colour, type and the rules that keep them together. Five studio concepts you can push around, by the designer who draws them."
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
              { '@type': 'ListItem', position: 1, name: 'Services & Pricing', item: 'https://switchcasestudio.com/pricing' },
              { '@type': 'ListItem', position: 2, name: service.title, item: `https://switchcasestudio.com${PATH}` },
            ],
          },
        ]}
      />
      <BrandWorld />
    </>
  );
}
