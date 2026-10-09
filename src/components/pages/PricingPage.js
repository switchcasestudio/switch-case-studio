import { Link, Navigate, useParams } from 'react-router-dom';
import pricingData from '../../data/pricingData.json';
import servicesData from '../../data/services.json';
import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import { PricingGuide } from './PricingGuide';

const slugToServiceId = {
  'design-branding': 'design-branding',
  'web-development': 'web-development',
  'ai-development': 'ai-development',
  'marketing-ads': 'marketing-advertisement',
};

// Derived from services.json — another hand-written mirror of the service
// list that could drift on a rename (same failure class as the old Footer
// SERVICES_LINKS copy).
const servicesIndex = servicesData.map((s) => ({
  slug: s.slug,
  label: s.title,
}));

function PricingPage() {
  const { serviceSlug } = useParams();

  // Overview (no slug)
  if (!serviceSlug) {
    return (
      <section className="pricing-overview">
        <h1 className="sr-only">Pricing</h1>
        <ul className="pricing-overview__list">
          {servicesIndex.map((s) => (
            <li key={s.slug}>
              <Link
                className="pricing-overview__link"
                to={`/pricing/${s.slug}`}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // Resolve slug → service id
  const serviceId = slugToServiceId[serviceSlug];
  if (!serviceId) return <Navigate to="/pricing" replace />;

  const exists = pricingData.services.some((s) => s.id === serviceId);
  if (!exists) return <Navigate to="/pricing" replace />;

  // services.json carries the marketing copy for the meta tags.
  const service = servicesData.find((s) => s.slug === serviceSlug);
  const label =
    service?.title ||
    servicesIndex.find((s) => s.slug === serviceSlug)?.label ||
    'Pricing';
  const description = service
    ? `${service.title} pricing: ${service.subTitle.replace(/\.$/, '')}. Transparent packages from Switch Case Studio.`
    : `${label} pricing and packages from Switch Case Studio.`;

  return (
    <>
      <Seo
        title={`${label} Pricing | Switch Case Studio`}
        description={description}
        path={`/pricing/${serviceSlug}`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: label,
            ...(service?.description
              ? { description: service.description }
              : {}),
            url: `https://switchcasestudio.com/pricing/${serviceSlug}`,
            provider: ORG_REF,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Services & Pricing',
                item: 'https://switchcasestudio.com/pricing',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: label,
                item: `https://switchcasestudio.com/pricing/${serviceSlug}`,
              },
            ],
          },
        ]}
      />
      <PricingGuide serviceId={serviceId} />
    </>
  );
}

export default PricingPage;
