import { Link, Navigate, useParams } from 'react-router-dom';
import pricingData from '../../data/pricingData.json';
import servicesData from '../../data/services.json';
import { clampAtWord } from '../../utils/seoText';
import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import { PricingGuide } from './PricingGuide';

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

  // A service's pricing id is its slug.
  const serviceId = serviceSlug;
  const exists = pricingData.services.some((s) => s.id === serviceId);
  if (!exists) return <Navigate to="/pricing" replace />;

  // services.json carries the marketing copy for the meta tags.
  const service = servicesData.find((s) => s.slug === serviceSlug);
  const label =
    service?.title ||
    servicesIndex.find((s) => s.slug === serviceSlug)?.label ||
    'Pricing';
  // Clamped at a word (house rule, seoText.js): "Web Development & Mobile
  // Apps" plus its subtitle runs 166 characters unclamped (2026-10-22).
  const description = clampAtWord(
    service
      ? `${service.title} pricing: ${service.subTitle.replace(/\.$/, '')}. Transparent packages from Switch Case Studio.`
      : `${label} pricing and packages from Switch Case Studio.`,
  );

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
                name: 'Pricing',
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
      <PricingGuide serviceId={serviceId} serviceSlug={serviceSlug} />
    </>
  );
}

export default PricingPage;
