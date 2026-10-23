import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import servicesData from '../../data/services.json';
import AiWorld from '../aiWorld/AiWorld';

/* /services/ai-development (2026-10-22). The service page is the
   experience; the price lives on /pricing/ai-development only. Like the
   brand world it is exempt from the page-head rule on purpose: the
   headline sits inside the collage and the drawings run over it. Its own
   static route record in routes.js. */
const SLUG = 'ai-development';
const PATH = `/services/${SLUG}`;
const service = servicesData.find((s) => s.slug === SLUG);

export default function AiAutomationPage() {
  return (
    <>
      <Seo
        title="AI & Automation | Switch Case Studio"
        description="Assistants trained on your docs, agents that do the follow-ups, workflows wired into your tools. Every demo on this page runs; press the buttons."
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
      <AiWorld />
    </>
  );
}
