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
import { SERVICE_PAGES, servicePath } from '../../data/navigation';
import '../../styles/components/serviceIndexPage.scss';

// Page copy + SEO. One grid, two indexes (2026-10-22): /services lands each
// card on the service's page (its pricing page until it has one) and
// /pricing on the packages, with the "from $X" line. /services was retired
// into /pricing on 2026-09-10 and is back because the service pages needed
// an index of their own; the two header menus each open theirs.
const COPY = {
  services: {
    seoTitle: 'Services | Switch Case Studio',
    seoDescription:
      'Graphic design and brand identity, web development and mobile apps, AI and automation, SEO and AI search. Four services from a Portland studio, shown not told.',
    path: '/services',
    ariaLabel: 'Services',
    kicker: 'Services',
    titleTop: 'What we do,',
    titleBottom: 'shown not told.',
    lede: 'Four services, one studio. Pick one to see the work; the packages and prices are a page away.',
    bottomHeading: 'Not sure which service you need?',
    bottomBody: "Book a free call; we'll figure it out together.",
  },
  pricing: {
    seoTitle: 'Pricing | Switch Case Studio',
    seoDescription:
      'Packages and prices for all four Switch Case Studio services: brand identity, web and mobile apps, AI and automation, SEO. Fixed prices, no hourly billing.',
    path: '/pricing',
    ariaLabel: 'Pricing',
    kicker: 'Pricing',
    titleTop: 'What it costs,',
    titleBottom: 'package by package.',
    lede: 'Pick a service to see what each package includes and what it costs. Every price is on the page.',
    bottomHeading: 'Not sure which package you need?',
    bottomBody: "Book a free call; we'll figure it out together.",
  },
};

// "from $X" for the /pricing variant — the lowest tier price per service,
// derived from pricingData (keyed by the same slug) so the index stays in
// sync with real pricing instead of a duplicated hardcoded number.

const fromPrice = (slug) => {
  const svc = pricingData.services.find((s) => s.id === slug);
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
  // The services index lands on the service page where one exists (same
  // rule as the home cards, navigation.js); the pricing index on the packages.
  const to = priced ? `/pricing/${service.slug}` : servicePath(service.slug);
  const cta = priced || !SERVICE_PAGES.includes(service.slug) ? 'See pricing' : 'See the work';
  return (
    <motion.li ref={itemRef} className="svi-card" variants={variants}>
      <Link to={to} className="svi-card__link">
        <span className="svi-card__meta">
          <span className="svi-card__kicker">{service.kicker}</span>
          <span className="svi-card__cta">{cta}</span>
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
   * usePageHeaderReveal. This component serves BOTH /services and /pricing,
   * so the fix repairs both routes' headers. motion
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
