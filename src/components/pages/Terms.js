import Seo from '../util/Seo';
import { TERMS_UPDATED } from '../../data/legal';
import '../../styles/components/legal.scss';

const Terms = () => {
  return (
    <div className="legal-page">
      <Seo
        title="Terms of Use | Switch Case Studio"
        description="The terms governing your use of the Switch Case Studio website and services."
        path="/terms"
      />
      <h1>Terms of Use</h1>
      <span className="last-updated">Last Updated: {TERMS_UPDATED}</span>

      <p>
        Welcome to Switch Case Studio. These Terms of Use ("Terms") govern your
        access to and use of our website. By accessing our site, you agree to be
        bound by these Terms.
      </p>

      <h2>1. Use of Website</h2>
      <p>
        This website is provided for informational purposes regarding our
        creative agency services (Web Development, Branding, Marketing). You
        agree to use this site only for lawful purposes and in a way that does
        not infringe the rights of, restrict, or inhibit anyone else's use and
        enjoyment of the website.
      </p>

      <h2>2. Intellectual Property</h2>
      <p>
        All content on this website, including but not limited to text, code,
        graphics, logos, images, video, and software, is the property of{' '}
        <strong>Switch Case LLC</strong> or its content suppliers and is
        protected by copyright, trademark, and other intellectual property laws.
        You may not reproduce, distribute, modify, or create derivative works of
        any content without our express written permission.
      </p>

      <h2>3. Service Agreements & Refunds</h2>
      <p>
        This website serves as a portfolio and contact point. The engagement of
        our services for any project is governed by a separate, written proposal
        or Master Services Agreement (MSA) signed by both parties.
      </p>
      <p>
        <strong>Refund Policy:</strong> Due to the custom nature of our creative
        and technical work, we generally do not offer refunds. Specific payment
        terms, milestones, and cancellation policies are outlined strictly in
        your individual client contract/proposal.
      </p>

      <h2>4. Limitation of Liability</h2>
      <p>
        The information on this website is provided "as is" without any
        representations or warranties, express or implied. Switch Case LLC makes
        no representations or warranties in relation to this website or the
        information and materials provided on this website. We will not be
        liable for any direct, indirect, incidental, or consequential damages
        arising out of the use of this website.
      </p>

      <h2>5. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws
        of the <strong>State of Oregon</strong>, without regard to its conflict
        of law provisions.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        For any legal inquiries regarding these Terms, please contact us at:
        <br />
        <a href="mailto:hello@switchcasestudio.com">
          hello@switchcasestudio.com
        </a>
      </p>
    </div>
  );
};

export default Terms;
