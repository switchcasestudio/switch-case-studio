import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import servicesData from '../../data/services.json';
import SeoWorld from '../seoWorld/SeoWorld';

/* /services/seo-ai-search (2026-10-24), the SEO & AI Search world (the
   slug predates the rename and stays, like its pricing page's). The service
   page is the experience; the price lives on /pricing/seo-ai-search only.
   Exempt from the page-head rule on purpose: the h1 sits in the hero,
   beside the five ways to be found. Its own static route record in
   routes.js. */
const SLUG = 'seo-ai-search';
const PATH = `/services/${SLUG}`;
const service = servicesData.find((s) => s.slug === SLUG);

export default function SeoAiSearchPage() {
  return (
    <>
      <Seo
        title="SEO & AI Search | Switch Case Studio"
        description="Technical SEO and AI-search readiness, every fix shipped on your site. Five ways to be found, each with a demo you can run."
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
      <SeoWorld />
    </>
  );
}
