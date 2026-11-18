import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import servicesData from '../../data/services.json';
import ContentWorld from '../contentWorld/ContentWorld';

/* /services/content-social-media (2026-11-18), the Content & Social Media
   world, the studio's fifth service. The service page is the experience;
   the price lives on /pricing/content-social-media only. Exempt from the
   page-head rule on purpose: the h1 sits in the hero, beside the five
   kinds of content. Its own static route record in routes.js. */
const SLUG = 'content-social-media';
const PATH = `/services/${SLUG}`;
const service = servicesData.find((s) => s.slug === SLUG);

export default function ContentSocialMediaPage() {
  return (
    <>
      <Seo
        title="Content & Social Media Services | Switch Case Studio"
        description="Website copy, articles, email and social media for small businesses: planned, written, designed and posted by one studio. Five lessons, each with a live demo."
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
      <ContentWorld />
    </>
  );
}
