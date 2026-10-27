import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import servicesData from '../../data/services.json';
import WebWorld from '../webWorld/WebWorld';

/* /services/web-development-mobile-apps (2026-10-24), the Web Development & Mobile
   Apps world. The service page is the experience; the price lives on
   /pricing/web-development-mobile-apps only. Exempt from the page-head rule on
   purpose: the h1 sits in the hero, beside the five kinds of build.
   Its own static route record in routes.js. */
const SLUG = 'web-development-mobile-apps';
const PATH = `/services/${SLUG}`;
const service = servicesData.find((s) => s.slug === SLUG);

export default function WebDevelopmentPage() {
  return (
    <>
      <Seo
        title="Web Development & Mobile Apps | Switch Case Studio"
        description="Landing pages, websites, stores, web apps and iOS and Android apps, built by engineers to load fast, then kept running. Every demo on this page runs."
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
      <WebWorld />
    </>
  );
}
