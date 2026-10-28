import { useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Home sections — synchronous (must be ready on first paint)
import Hero from './components/sections/Hero';
import ClientStrip from './components/sections/ClientStrip';
import LandingPageProof from './components/sections/LandingPageProof';
import Services from './components/sections/Services';
import Squares from './components/ui/Squares';
import About from './components/sections/About';
import Reviews from './components/sections/Reviews';
import AboutMarquee from './components/sections/AboutMarquee';
import CaseStudies from './components/sections/CaseStudies';
import Contact from './components/sections/Contact';
import Faq from './components/sections/Faq';
import GradientStripe from './components/sections/StripeSection';
import ScrollToTop from './components/util/ScrollToTop';
import Seo from './components/util/Seo';
import RouteAnalytics from './analytics/RouteAnalytics';
import ConsentBanner from './analytics/ConsentBanner';
import Orb from './assets/images/orb.avif';
import projects from './data/projects.json';
import services from './data/services.json';
import posts from './data/posts.json';
import RouteError from './components/util/RouteError';
import './styles/app.scss';

// Route-only pages — lazy route records: vite-react-ssg resolves them during
// the static build (full content in the HTML) and React Router code-splits
// them on the client, same chunks as the old React.lazy setup.
const page = (loader) => () => loader().then((m) => ({ Component: m.default }));

const HomeContent = () => (
  <>
    <Seo
      title="Portland Web Design & Development | Switch Case Studio"
      description="Portland web design studio. Custom websites, apps and AI automation, built by engineers to load fast. Published prices, real case studies."
      path="/"
    />
    <Hero />
    {/* M7: min height 120px (was 160) — on phones the band is a divider
        accent, not a content section; desktop sizing is unchanged (30vw
        still governs above ~400px viewports). */}
    <GradientStripe
      size="clamp(120px, 30vw, 420px)"
      duration={5.9}
      travel={60}
      orbSrc={Orb}
    />
    {/* Services block (owner, 2026-09-10): intro + menu share one full-screen
        stage over the interactive grid About uses, faded to black at the top
        and bottom so it joins the hero and the stripe without a seam. */}
    <div className="services-block">
      <div className="services-block__grid" aria-hidden="true">
        <Squares
          speed={0.1}
          squareSize={50}
          direction="down"
          // Dimmer than About's #7f7f7f so the lines stay behind the cards.
          borderColor="#3d3d3d"
          hoverFillColor="#dab8ff"
        />
      </div>
      <LandingPageProof />
      <Services />
    </div>
    <CaseStudies />
    <ClientStrip />
    <About />
    {/* "Switch Case Studio" marquee (owner, 2026-09-13): moved out of About,
        swapping places with the TextLoop ribbon. */}
    <AboutMarquee />
    <Reviews />
    <Contact />
    <Faq />
  </>
);

// Routes whose pages are LIGHT-themed (dark text on a light surface) and
// therefore rely on a light backdrop. Everything else is dark (#000).
// - /privacy, /terms, /accessibility  → .legal-page (dark text, no own bg)
// NOTE: /pricing/:slug is now dark (black surface, light cards), so it is
// intentionally NOT in this list.
const LIGHT_ROUTES = /^\/(privacy|terms|accessibility)(\/|$)/;

/**
 * Layout route element — renders MainLayout once and lets nested
 * routes plug into <Outlet />.
 *
 * .route-backdrop is a non-fading layer behind the page, tinted to match
 * the destination page's theme. This is what kills the white flash: each
 * page paints #000 (or light gray), but <body>/<main> are light gray, so
 * while .page-fade animates from opacity 0 the page is transparent and the
 * backdrop shows through. If the backdrop matches the page, fading in
 * changes no color — only the content appears.
 *
 * ScrollToTop / RouteAnalytics / ConsentBanner need the router context
 * (useLocation), so they live here now that the router is owned by
 * vite-react-ssg instead of an app-level <BrowserRouter>.
 *
 * No Suspense around the Outlet (2026-10-09). Page-level code-splitting is the
 * route records' `lazy`, which React Router resolves before it renders the
 * route, so nothing here ever suspends; the nested lazy pieces (About's
 * DepthImage, PartnersGate's offer) carry their own boundaries. A boundary
 * here was worse than useless under React 19: once the streamed HTML passes
 * progressiveChunkSize (12.8KB) the server "outlines" every completed
 * Suspense boundary, i.e. ships <main> holding only the fallback and the real
 * page in a <div hidden id="S:0"> after the footer, moved into place by an
 * inline $RC script. Google runs JS; non-JS crawlers and text extractors do
 * not, and they saw an empty <main> on all 53 pages for two days. The keyed
 * wrapper re-mounts per route to replay the opacity-only fade (resting
 * opacity is 1, so content can never get stuck invisible).
 */
const Layout = () => {
  const { pathname } = useLocation();
  const theme = LIGHT_ROUTES.test(pathname) ? 'is-light' : 'is-dark';

  // The page fade is a route-transition touch — but it animates from opacity:0,
  // and the hero (LCP element) lives inside it. Running it on first paint gates
  // LCP behind the 0.4s fade. So skip the class on the initial render (server +
  // first client render both see prevPath === null → no class → no hydration
  // mismatch, no opacity flash) and only apply it once a client navigation has
  // changed the path.
  const prevPath = useRef(null);
  const isInitial = prevPath.current === null;
  useEffect(() => {
    prevPath.current = pathname;
  }, [pathname]);

  return (
    <MainLayout>
      <ScrollToTop />
      <RouteAnalytics />
      <ConsentBanner />
      <div className={`route-backdrop ${theme}`}>
        <div key={pathname} className={isInitial ? undefined : 'page-fade'}>
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
};

export const routes = [
  {
    path: '/',
    element: <Layout />,
    // Pathless record so the error boundary renders INSIDE Layout (header +
    // footer stay); on the root record it would replace Layout. It catches
    // stale-deploy failures and reloads the page: see RouteError.js.
    children: [{
      errorElement: <RouteError />,
      children: [
      // Landing
      { index: true, element: <HomeContent /> },

      // About
      {
        path: 'about',
        lazy: page(() => import('./components/pages/AboutPage')),
      },

      // Case studies
      {
        path: 'projects',
        lazy: page(() => import('./components/pages/CaseStudiesPage')),
      },
      {
        path: 'projects/:slug',
        lazy: page(() => import('./components/pages/CaseStudyPage')),
        getStaticPaths: () => projects.map((p) => `/projects/${p.slug}`),
      },

      // Service worlds (2026-10-22): a service page is the experience, the
      // pricing page is the number. Each world is its own static record and
      // chunk (two worlds in one param record would ship both in one bundle);
      // the param record under them sends every other slug to its pricing
      // page, the same fallback netlify.toml applies with a 301. Same slug on
      // both sides: /services/<slug> + /pricing/<slug>. A new world: a record
      // here, its slug in SERVICE_PAGES (navigation.js), an entry in
      // generate-sitemap.mjs and generate-llms.mjs.
      {
        path: 'services',
        lazy: page(() => import('./components/pages/ServicesPage')),
      },
      {
        path: 'services/graphic-design-brand-identity',
        lazy: page(() => import('./components/pages/BrandIdentityPage')),
      },
      {
        path: 'services/ai-automation',
        lazy: page(() => import('./components/pages/AiAutomationPage')),
      },
      {
        path: 'services/web-development-mobile-apps',
        lazy: page(() => import('./components/pages/WebDevelopmentPage')),
      },
      {
        path: 'services/seo-ai-search',
        lazy: page(() => import('./components/pages/SeoAiSearchPage')),
      },
      {
        path: 'services/:serviceSlug',
        lazy: page(() => import('./components/pages/ServiceRedirect')),
      },

      // Pricing
      {
        path: 'pricing',
        lazy: page(() => import('./components/pages/PricingOverviewPage')),
      },
      {
        path: 'pricing/:serviceSlug',
        lazy: page(() => import('./components/pages/PricingPage')),
        getStaticPaths: () => services.map((s) => `/pricing/${s.slug}`),
      },

      // Agency-partner wholesale offer — behind a password gate at /partners.
      // The pre-rendered /partners.html ships ONLY the lock screen; PartnersGate
      // SHA-256-checks the typed password in the browser and lazy-loads the
      // offer (PartnersPage) only on a match, so the offer markup never reaches
      // a visitor who hasn't unlocked. noindex,nofollow (page <Seo> + an
      // X-Robots-Tag header in netlify.toml), NOT linked anywhere, absent from
      // the sitemap. Hand partners the URL + password. Lazy so the offer never
      // enters the other pages' bundles.
      {
        path: 'partners',
        lazy: page(() => import('./components/pages/PartnersGate')),
      },

      // Blog
      { path: 'blog', lazy: page(() => import('./components/pages/BlogPage')) },
      {
        path: 'blog/:slug',
        lazy: page(() => import('./components/pages/BlogPostPage')),
        getStaticPaths: () => posts.map((p) => `/blog/${p.slug}`),
      },

      // Shop: themes + office hours (items in src/data/shop.json)
      { path: 'shop', lazy: page(() => import('./components/pages/ShopPage')) },

      // Standalone section pages
      {
        path: 'testimonials',
        lazy: page(() => import('./components/pages/ReviewsPage')),
      },
      {
        path: 'contact',
        lazy: page(() => import('./components/pages/ContactPage')),
      },

      // Legal
      {
        path: 'privacy',
        lazy: page(() => import('./components/pages/Privacy')),
      },
      { path: 'terms', lazy: page(() => import('./components/pages/Terms')) },
      {
        path: 'accessibility',
        lazy: page(() => import('./components/pages/Accessibility')),
      },

      // 404 — emitted as build/404.html, which Netlify serves (with a real
      // 404 status) for any URL that has no static file. The "*" catch-all
      // below renders the same page for unknown in-app navigations (it used
      // to silently redirect home, masking broken links).
      {
        path: '404',
        lazy: page(() => import('./components/pages/NotFoundPage')),
      },
      {
        path: '*',
        lazy: page(() => import('./components/pages/NotFoundPage')),
      },
      ],
    }],
  },
];
