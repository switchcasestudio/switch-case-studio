import Seo from '../util/Seo';
import '../../styles/components/legal.scss';

const Accessibility = () => {
  return (
    <div className="legal-page">
      <Seo
        title="Accessibility Statement | Switch Case Studio"
        description="Switch Case Studio's commitment to digital accessibility and the standards we follow."
        path="/accessibility"
      />
      <p className="legal-page__kicker">Legal</p>
      <h1>Accessibility Statement</h1>
      <span className="last-updated">Last Updated: January 8, 2026</span>

      <p>
        <strong>Switch Case Studio</strong> is committed to ensuring digital
        accessibility for people with disabilities. We are continually improving
        the user experience for everyone and applying the relevant accessibility
        standards.
      </p>

      <h2>Measures to Support Accessibility</h2>
      <p>
        Switch Case Studio takes the following measures to ensure accessibility
        of our website:
      </p>
      <ul>
        <li>
          Include accessibility as part of our internal mission statement.
        </li>
        <li>Ensure sufficient color contrast for text and backgrounds.</li>
        <li>
          Design UI components (like our menus and marquees) to support keyboard
          navigation.
        </li>
        <li>Respect "Reduce Motion" system preferences in our animations.</li>
      </ul>

      <h2>Conformance Status</h2>
      <p>
        The Web Content Accessibility Guidelines (WCAG) defines requirements for
        designers and developers to improve accessibility for people with
        disabilities. It defines three levels of conformance: Level A, Level AA,
        and Level AAA. Switch Case Studio is partially conformant with{' '}
        <strong>WCAG 2.1 level AA</strong>. Partially conformant means that some
        parts of the content may not fully conform to the accessibility
        standard, though we strive for full compliance.
      </p>

      <h2>Feedback</h2>
      <p>
        We welcome your feedback on the accessibility of the Switch Case Studio
        website. Please let us know if you encounter accessibility barriers:
      </p>
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:hello@switchcasestudio.com">
          hello@switchcasestudio.com
        </a>
      </p>
      <p>We try to respond to feedback within 2 business days.</p>
    </div>
  );
};

export default Accessibility;
