import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import { motion, useReducedMotion } from 'motion/react';
import servicesData from '../../data/services.json';
import pricingData from '../../data/pricingData.json';
import ServicePoster from '../servicePoster/ServicePoster';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import {
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/serviceIndexPage.scss';

// Page copy + SEO. /services was retired 2026-09-10 (it duplicated this page;
// it 301s here), so only the Services & Pricing copy remains.
const COPY = {
  pricing: {
    seoTitle: 'Services & Pricing | Switch Case Studio',
    seoDescription:
      "Explore Switch Case Studio's services: AI development, automation, web development, e-commerce, branding, and growth. Transparent pricing, fast delivery.",
    path: '/pricing',
    ariaLabel: 'Services and pricing',
    kicker: 'Services & Pricing',
    titleTop: 'What we do,',
    titleBottom: 'and what it costs.',
    lede: 'Pick a service to see what is included and what it costs. AI and automation included, hype not.',
    bottomHeading: 'Not sure which service you need?',
    bottomBody: "Book a free call; we'll figure it out together.",
  },
};

// "from $X" for the /pricing variant — the lowest tier price per service,
// derived from pricingData (same slug→id map as PricingPage) so the index
// stays in sync with real pricing instead of a duplicated hardcoded number.
const SLUG_TO_ID = {
  'brand-identity': 'design-branding',
  'web-development': 'web-development',
  'ai-development': 'ai-development',
  'marketing-ads': 'marketing-advertisement',
};

const fromPrice = (slug) => {
  const svc = pricingData.services.find((s) => s.id === SLUG_TO_ID[slug]);
  const prices = (svc?.tiers || [])
    .filter((t) => t.group !== 'Care') // care plans are add-ons, see above
    .map((t) => t.price)
    .filter((p) => typeof p === 'number');
  if (!prices.length) return null;
  return `$${Math.min(...prices).toLocaleString('en-US')}`;
};

/* Card grid (2026-09-14): matches the Home Services teaser — same live
   ServicePoster art, panel + hairline treatment, Inter title (services.scss
   `.services__item`, reused here as `.svi-card` since this page adds the
   "from $X" price line the home teaser doesn't carry). The flat text list
   this replaced (ServiceRow) didn't match the illustrated cards a visitor
   arrives from when they click "See pricing" on the home page. Entrance
   stays on the page's existing motion/react variants (reveal on MOUNT, not
   scroll — REFRESH-1: a scroll `amount` threshold on a tall grid can strand
   rows on mobile), so no new motion system is introduced for this page. */
function PricingCard({ service, description, price, priced, variants }) {
  const itemRef = useRef(null);
  return (
    <motion.li ref={itemRef} className="svi-card" variants={variants}>
      <Link to={`/pricing/${service.slug}`} className="svi-card__link">
        <span className="svi-card__meta">
          <span className="svi-card__kicker">{service.kicker}</span>
          <span className="svi-card__cta">See pricing</span>
          <span className="svi-card__rule" aria-hidden="true" />
        </span>
        <span className="svi-card__body">
          <span className="svi-card__title-mask">
            <span className="svi-card__title">{service.title}</span>
          </span>
          {description && <span className="svi-card__subtitle">{description}</span>}
          {priced && price && (
            <span className="svi-card__price">
              <span className="svi-card__price-from">from</span> {price}
            </span>
          )}
        </span>
        <ServicePoster slug={service.slug} cardRef={itemRef} />
      </Link>
    </motion.li>
  );
}

const ServiceIndexPage = ({ variant = 'pricing' }) => {
  const reduced = useReducedMotion();
  const v = (motionVariant) => (reduced ? undefined : motionVariant);
  /* LC-26e: header is GSAP-revealed (static HTML ships visible) — see
   * usePageHeaderReveal. This component serves BOTH /services and the
   * /pricing overview, so the fix repairs both routes' headers. motion
   * still owns the row list + CTA below. */
  const headerRef = useRef(null);
  usePageHeaderReveal(headerRef);
  const c = COPY[variant];

  return (
    <>
      <Seo title={c.seoTitle} description={c.seoDescription} path={c.path} />

      <article className="service-index" aria-label={c.ariaLabel}>
        {/* ── Header ── */}
        <header className="service-index__header" ref={headerRef}>
          <p className="service-index__kicker page-head-animate">
            {c.kicker}
          </p>
          <h1 className="service-index__title page-head-animate">
            {c.titleTop}
            <br />
            {c.titleBottom}
          </h1>
          <p className="service-index__lede page-head-animate">
            {c.lede}
          </p>
        </header>

        {/* ── Service index ── */}
        {/* Reveal on MOUNT (animate), not on scroll: a scroll `amount`
            threshold on this tall single-column list can be missed on mobile,
            stranding rows invisible (the /projects + /testimonials bug). */}
        <motion.ul
          className="service-index__grid"
          aria-label="Service list"
          variants={v(containerVariants)}
          initial="hidden"
          animate="visible"
        >
          {servicesData.map((service) => (
            <PricingCard
              key={service.slug}
              service={service}
              description={service.subTitle}
              price={variant === 'pricing' ? fromPrice(service.slug) : undefined}
              priced={variant === 'pricing'}
              variants={v(cardVariants)}
            />
          ))}
        </motion.ul>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="service-index__bottom"
          variants={v(cardVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="service-index__bottom-heading">{c.bottomHeading}</h2>
          <p className="service-index__bottom-body">{c.bottomBody}</p>
          <BookCallCta className="service-index__bottom-btn" />
        </motion.div>
      </article>
    </>
  );
};

export default ServiceIndexPage;
