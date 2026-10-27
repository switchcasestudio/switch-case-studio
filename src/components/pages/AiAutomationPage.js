import Seo from '../util/Seo';
import { ORG_REF } from '../../utils/schemaIds';
import servicesData from '../../data/services.json';
import AiWorld from '../aiWorld/AiWorld';

/* /services/ai-automation (2026-10-22). The service page is the
   experience; the price lives on /pricing/ai-automation only. Exempt from
   the page-head rule on purpose: the h1 sits in the workbench hero
   (AutomationHero), beside the five kinds it runs. Its own static route
   record in routes.js. */
const SLUG = 'ai-automation';
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
