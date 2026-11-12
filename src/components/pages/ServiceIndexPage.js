import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import servicesData from '../../data/services.json';
import { fromPrices } from '../../data/fromPrice';
import ServicePoster from '../servicePoster/ServicePoster';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import BookCallCta from '../ui/BookCallCta';
import { BOOK_CALL_KIND } from '../../data/cta';
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
    ledeLink: { to: '/pricing', label: 'Compare packages and prices' },
    bottomHeading: 'Not sure which service you need?',
    bottomBody: `Book a ${BOOK_CALL_KIND}; we'll figure it out together.`,
  },
  pricing: {
    seoTitle: 'Pricing | Switch Case Studio',
    seoDescription:
      'Packages and prices for all four Switch Case Studio services: brand identity, web and mobile apps, AI and automation, SEO. Starting prices, no hourly billing.',
    path: '/pricing',
    ariaLabel: 'Pricing',
    kicker: 'Pricing',
    titleTop: 'What it costs,',
    titleBottom: 'package by package.',
    lede: 'Pick a service to see what each package includes and where its price starts. Every starting price is on the page.',
    bottomHeading: 'Not sure which package you need?',
    bottomBody: `Book a ${BOOK_CALL_KIND}; we'll figure it out together.`,
  },
};

// "from $X" for the /pricing variant comes from `fromPrices`
// (src/data/fromPrice.js): derived from pricingData, one-time and monthly
// kept apart, each printed with its period.

/* Card grid (2026-09-14): matches the Home Services teaser — same live
   ServicePoster art, panel + hairline treatment, Inter title (services.scss
   `.services__item`, reused here as `.svi-card` since this page adds the
   "from $X" price line the home teaser doesn't carry). The flat text list
   this replaced (ServiceRow) didn't match the illustrated cards a visitor
   arrives from when they click "See pricing" on the home page. Entrance
   is a CSS keyframe (`svi-rise`, serviceIndexPage.scss) staggered by `--i`
   and gated on `prefers-reduced-motion: no-preference` (2026-11-10): the
   motion/react variants it replaced server-rendered `opacity: 0`, and under
   Reduce Motion nothing ever animated the cards back in, so both indexes
   were blank. The static HTML now ships every card visible. */
function PricingCard({ service, description, price, priced, index }) {
  const itemRef = useRef(null);
  // The services index lands on the service page where one exists (same
  // rule as the home cards, navigation.js); the pricing index on the packages.
  const to = priced ? `/pricing/${service.slug}` : servicePath(service.slug);
  const cta = priced || !SERVICE_PAGES.includes(service.slug) ? 'See pricing' : 'Explore the service';
  return (
    <li ref={itemRef} className="svi-card" style={{ '--i': index }}>
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
          {priced && price && (price.oneTime || price.monthly) && (
            <span className="svi-card__price">
              <span className="svi-card__price-from">from</span>{' '}
              {price.oneTime || price.monthly}{' '}
              <span className="svi-card__price-from">
                {price.oneTime ? 'one-time' : 'per month'}
              </span>
              {price.oneTime && price.monthly && (
                <span className="svi-card__price-alt">or {price.monthly} per month</span>
              )}
            </span>
          )}
        </span>
        <ServicePoster slug={service.slug} cardRef={itemRef} />
      </Link>
    </li>
  );
}

const ServiceIndexPage = ({ variant = 'pricing' }) => {
  /* LC-26e: header is GSAP-revealed (static HTML ships visible) — see
   * usePageHeaderReveal. This component serves BOTH /services and /pricing,
   * so the fix repairs both routes' headers. The card list below enters
   * with a CSS keyframe; the bottom CTA is static. */
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
          {/* /services shows no prices; this is its one-tap route to them
              (UX audit, 2026-11-10). */}
          {c.ledeLink && (
            <p className="service-index__lede-link page-head-animate">
              <Link to={c.ledeLink.to}>
                {c.ledeLink.label} <span aria-hidden="true">→</span>
              </Link>
            </p>
          )}
        </header>

        {/* Phones, /pricing only: the four "from" prices in one screen. The
            cards are 525px or taller there, so comparing them meant holding
            four prices across four screens (UX audit, 2026-11-10). */}
        {variant === 'pricing' && (
          <ul className="service-index__quick" aria-label="Prices at a glance">
            {servicesData.map((service) => {
              const p = fromPrices(service.slug);
              const first = p.oneTime || p.monthly;
              if (!first) return null;
              return (
                <li key={service.slug}>
                  <Link to={`/pricing/${service.slug}`}>
                    <span className="service-index__quick-name">{service.title}</span>
                    <span className="service-index__quick-price">
                      from {first}
                      {p.oneTime ? '' : ' per month'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* ── Service index ── */}
        {/* Visible in the static HTML; the entrance is CSS (`svi-rise`), on
            load and not on scroll, so no row can be stranded invisible. */}
        <ul className="service-index__grid" aria-label="Service list">
          {servicesData.map((service, index) => (
            <PricingCard
              key={service.slug}
              service={service}
              description={service.subTitle}
              price={variant === 'pricing' ? fromPrices(service.slug) : undefined}
              priced={variant === 'pricing'}
              index={index}
            />
          ))}
        </ul>

        {/* ── Bottom CTA ── */}
        <div className="service-index__bottom">
          <h2 className="service-index__bottom-heading">{c.bottomHeading}</h2>
          <p className="service-index__bottom-body">{c.bottomBody}</p>
          <BookCallCta className="service-index__bottom-btn" />
        </div>
      </article>
    </>
  );
};

export default ServiceIndexPage;
