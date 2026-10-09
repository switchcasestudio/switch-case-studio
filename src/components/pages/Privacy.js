import Seo from '../util/Seo';
import { PRIVACY_UPDATED } from '../../data/legal';
import '../../styles/components/legal.scss';

const Privacy = () => {
  return (
    <div className="legal-page">
      <Seo
        title="Privacy Policy | Switch Case Studio"
        description="How Switch Case Studio collects, uses, and protects your personal information."
        path="/privacy"
      />
      <h1>Privacy Policy</h1>
      <span className="last-updated">Last Updated: {PRIVACY_UPDATED}</span>

      <p>
        Switch Case LLC, doing business as <strong>Switch Case Studio</strong>{' '}
        ("we," "our," or "us"), respects your privacy and is committed to
        protecting the personal information you share with us. This Privacy
        Policy explains how we collect, use, and safeguard your information when
        you visit our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We operate an informational portfolio website. We do not require you to
        create an account or log in. We only collect information that you
        voluntarily provide to us, such as:
      </p>
      <ul>
        <li>
          <strong>Contact Information:</strong> Name, email address, and phone
          number when you fill out our contact form.
        </li>
        <li>
          <strong>Project Details:</strong> Information regarding your business
          needs provided during inquiries.
        </li>
        <li>
          <strong>Submission Records:</strong> When you send one of our
          contact forms, our server records the time, your IP address and the
          approximate location it indicates (country, region, city), your
          browser’s user-agent string, the page you sent it from, and your
          agreement to our Terms of Use and this Privacy Policy, including the
          version of each you agreed to.
        </li>
      </ul>
      <p>
        <strong>Analytics & Advertising Measurement:</strong> With your consent,
        we use two measurement tools. <strong>Google Analytics 4</strong> tells
        us how visitors use our site (which pages are viewed, which links are
        clicked) so we can improve it. The <strong>Meta Pixel</strong> (Facebook)
        measures whether our ads on Meta platforms lead to visits and inquiries,
        and may set the <code>_fbp</code> cookie; Meta processes this data under
        its own{' '}
        <a
          href="https://www.facebook.com/privacy/policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          privacy policy
        </a>
        . Both are governed by one choice: tracking is{' '}
        <strong>off by default</strong> and only runs if you select “Accept” in
        our cookie banner. If you decline, no analytics or advertising cookies
        are set, and the Meta Pixel is not even loaded. You can change your choice
        by clearing this site’s data in your browser. We do not sell any data.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information you provide solely to:</p>
      <ul>
        <li>Respond to your inquiries and consultation requests.</li>
        <li>Schedule meetings via our booking integrations.</li>
        <li>
          Keep a record of each contact-form submission and the consent given
          with it, and protect against spam, fraud and impersonation.
        </li>
        <li>Provide services as agreed upon in separate client contracts.</li>
      </ul>

      <h2>3. Third-Party Links & Tools</h2>
      <p>
        Our website may contain links to third-party websites (e.g., Google
        Calendar for bookings, social media profiles). If you click on a
        third-party link, you will be directed to that site. Note that these
        external sites may collect their own data and use cookies. We strongly
        advise you to review the Privacy Policy of every site you visit. We have
        no control over and assume no responsibility for the content, privacy
        policies, or practices of any third-party sites or services.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement reasonable security measures to maintain the safety of your
        personal information. However, please be aware that no method of
        transmission over the Internet or method of electronic storage is 100%
        secure.
      </p>
      <p>
        Contact-form submission records are stored privately with our hosting
        provider, Netlify, and deleted automatically after 24 months. Your
        message reaches our inbox through EmailJS, an email delivery service.
      </p>

      <h2>5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at:
        <br />
        <strong>Email:</strong>{' '}
        <a href="mailto:hello@switchcasestudio.com">
          hello@switchcasestudio.com
        </a>
      </p>
    </div>
  );
};

export default Privacy;
