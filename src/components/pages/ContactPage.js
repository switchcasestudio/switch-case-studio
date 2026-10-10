import Seo from '../util/Seo';
import Contact from '../sections/Contact';
import { ORG_REF, SITE, WEBSITE_REF } from '../../utils/schemaIds';
import '../../styles/components/contactPage.scss';

const ContactPage = () => (
  <>
    <Seo
      title="Contact | Switch Case Studio"
      description="Get in touch with Switch Case Studio. Book a strategy call or send us a message about your project."
      path="/contact"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Switch Case Studio',
        url: `${SITE}/contact`,
        isPartOf: WEBSITE_REF,
        mainEntity: ORG_REF,
      }}
    />
    <div className="contact-page">
      <Contact headingTag="h1" />
    </div>
  </>
);

export default ContactPage;
