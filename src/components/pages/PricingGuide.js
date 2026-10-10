import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import pricingData from '../../data/pricingData.json';
import testimonialsData from '../../data/testimonials.json';
import SinglePricingCard from '../ui/SinglePricingCard';
import RotatingProof from '../ui/RotatingProof';
import PackageBoard, { hasPackageBoard } from '../pricing/PackageBoard';
import BookCallCta from '../ui/BookCallCta';
import { BOOK_CALL_URL, BOOK_CALL_LABEL } from '../../data/cta';
import useReducedMotion from '../../hooks/useReducedMotion';
import {
  DUR_MED,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_STAGGER,
  REVEAL_SAFETY_DELAY,
} from '../../animation/motionTokens';

import '../../styles/components/pricingGuide.scss';

gsap.registerPlugin(ScrollTrigger);

// Shared studio reassurances shown on every tier. A tier may override these
// with its own bullets in pricingData.json ({ text, icon }); the icon key
// is unused since the 2026-09-14 facelift (plain hairline list, no chips)
// but stays in the data as it's still a meaningful category tag per bullet.
const BENEFITS = [
  { text: 'Custom build, no templates' },
  { text: 'Most builds ship in under 2 weeks' },
  { text: 'Work directly with the people building it' },
];

const tierBenefits = (tier) => (tier.benefits?.length ? tier.benefits : BENEFITS);

// Rotating social proof, mapped from the testimonials data.
// Split tiers into their `group`s, preserving first-seen order. No group
// anywhere → one unheaded block (every service but Web Development).
const tierGroups = (tiers) => {
  const order = [];
  const byGroup = {};
  tiers.forEach((t) => {
    const g = t.group || '';
    if (!byGroup[g]) {
      byGroup[g] = [];
      order.push(g);
    }
    byGroup[g].push(t);
  });
  return order.map((g) => ({ group: g, tiers: byGroup[g] }));
};

const TESTIMONIALS = testimonialsData.map((t) => ({
  id: t.id,
  name: t.name,
  role: t.title,
  content: t.highlight,
  avatar: t.image,
}));

const formatMoney = (n) =>
  n.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

export const PricingGuide = ({ serviceId }) => {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);

  const service = useMemo(
    () => pricingData.services.find((s) => s.id === serviceId),
    [serviceId]
  );

  /* VE-8: house safe-reveal for the whole page (header lines, cards,
   * outro, footer). Replaces the motion whileInView header, which BAKED
   * opacity:0 into the SSG HTML — the pricing h1 was invisible without
   * JS. gsap.set applies hidden only at runtime, so static HTML always
   * ships visible; play-once + in-view fallback + safety net; reduced
   * motion stays static-visible. This is a conversion page — nothing may
   * ever strand hidden. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const items = gsap.utils.toArray('.pg-animate', root);
    if (!items.length) return undefined;

    if (reduced) {
      gsap.set(items, { clearProps: 'all' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, y: REVEAL_Y });

      const reveal = () =>
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: DUR_MED,
          stagger: REVEAL_STAGGER,
          ease: EASE_OUT_SOFT,
          overwrite: 'auto',
        });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        once: true,
        onEnter: reveal,
      });

      // Pricing pages load with the section at the top — reveal now.
      if (root.getBoundingClientRect().top < window.innerHeight * 0.85) {
        reveal();
      }

      const safety = gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        if (items.some((el) => gsap.getProperty(el, 'opacity') < 1)) {
          reveal();
        }
      });

      return () => {
        trigger.kill();
        safety.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [reduced, serviceId]);

  if (!service) {
    return (
      <section className="pricing-guide">
        <p className="pg-empty">No pricing found for this service.</p>
      </section>
    );
  }

  return (
    <section
      className="pricing-guide"
      aria-labelledby="pg-title"
      ref={rootRef}
    >
      <header className="pg-head">
        <p className="pg-kicker pg-animate">Pricing</p>
        <h1 id="pg-title" className="pg-h1 pg-animate">
          {service.title}
        </h1>
        <p className="pg-sub pg-animate">{service.subtitle}</p>
      </header>

      {/* A service with a package board (PackageBoard.js) compares its tiers
          on one sheet, with the proof once under it. The rest keep the
          stacked tier cards: tiers may carry a `group` (Web Development:
          Build / Care); grouped services render one headed block per group,
          in data order, the others a single ungrouped list. */}
      {hasPackageBoard(serviceId) && (
        <>
          <PackageBoard serviceId={serviceId} tiers={service.tiers} formatPrice={formatMoney} />
          <div className="pb-proof pg-animate">
            <RotatingProof testimonials={TESTIMONIALS} />
          </div>
        </>
      )}
      {!hasPackageBoard(serviceId) && tierGroups(service.tiers).map(({ group, tiers }) => (
        <div className="pg-group" key={group || 'all'}>
          {group && <h2 className="pg-group__title pg-animate">{group}</h2>}
          <div className="pg-cards">
            {tiers.map((tier, idx) => (
              <div className="pg-card-slot pg-animate" key={tier.name}>
                <SinglePricingCard
                  badge={service.title}
                  title={tier.name}
                  subtitle={tier.description}
                  price={{
                    current: formatMoney(tier.price),
                    note: tier.billing === 'monthly' ? 'per month' : 'one-time',
                  }}
                  benefits={tierBenefits(tier)}
                  features={tier.includes}
                  featuresTitle="What's included"
                  primaryButton={{ text: BOOK_CALL_LABEL, href: BOOK_CALL_URL }}
                  secondaryButton={{ text: 'See our work', href: '/projects' }}
                  testimonials={TESTIMONIALS}
                  rotationSpeed={5000 + idx * 600}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pg-outro pg-animate">
        <p className="pg-outro__line">
          Think of this as a starting point - real pricing depends on the size,
          complexity, and goals of your project. Let’s talk through the details
          so we can put together the right plan for you.
        </p>
        {/* Each service links its cost guide (SEO audit fix 10, 2026-10-09):
            price searches rank long guides, and the guide is where these
            packages are compared with the market. */}
        {service.costGuide && (
          <p className="pg-outro__guide">
            <span className="pg-outro__guide-kicker">Cost guide</span>
            <Link to={`/blog/${service.costGuide.slug}`} className="pg-outro__guide-link">
              {service.costGuide.label}
            </Link>
          </p>
        )}
      </div>

      <footer className="pg-footer pg-animate" aria-label="Contact">
        <BookCallCta className="pg-btn pg-btn--primary" />
        <a
          className="pg-btn pg-btn--secondary"
          href="mailto:hello@switchcasestudio.com"
        >
          Email the studio
        </a>
      </footer>
    </section>
  );
};
