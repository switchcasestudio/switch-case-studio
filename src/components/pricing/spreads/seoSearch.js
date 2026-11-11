import { SANS, MONO, Browser, Chip, Lines, Sheet } from "./artKit";
import { SeoArt, AnalyticsArt } from "./webDevelopment";
import { DiscoveryArt } from "./aiAutomation";

/* SEO & AI Search package board (2026-09-26): one board, two packages that
   are different animals, a one-time sprint and a monthly retainer, so the
   rows say what each one does and the groups read "Only in". Every cell
   repeats that tier's own `includes` line, shortened. */
const stroke = { fill: "none", className: "sp-s-ink", strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" };

const CallsArt = () => (
  <>
    <rect x="50" y="70" width="200" height="150" rx="20" className="tsp-f-lilac" />
    <path d="M90 220L80 260L130 220" className="tsp-f-lilac" />
    <Lines x={80} y={104} widths={[140, 100, 120]} h={12} gap={26} opacity="0.5" />
    <rect x="200" y="140" width="150" height="110" rx="20" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <path d="M320 250L330 284L290 250" className="sp-f-cream" stroke="#141414" strokeWidth="4" strokeLinejoin="round" />
    <path d="M296 250H332" className="sp-s-cream" strokeWidth="6" />
    <Lines x={222} y={168} widths={[100, 70, 90]} h={10} gap={24} opacity="0.4" />
  </>
);
const ImagesArt = () => (
  <>
    <rect x="50" y="50" width="220" height="180" rx="10" className="sp-f-mint" />
    <circle cx="210" cy="100" r="22" className="sp-f-cream" />
    <path d="M50 230L120 140L160 186L186 156L270 230Z" className="sp-f-ink" />
    <Chip x={230} y={200} w={120} label="WebP + AVIF" />
    <path d="M300 60L340 100M340 60L300 100" {...stroke} strokeWidth="9" strokeOpacity="0.35" />
  </>
);
const MetaArt = () => (
  <Browser>
    <rect x="50" y="90" width="300" height="34" rx="8" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
    <text x="66" y="114" fontFamily={MONO} fontSize="18" className="sp-f-ink">
      {"<title>"}
    </text>
    <rect x="50" y="140" width="220" height="14" rx="7" className="tsp-f-lilac" />
    <Lines x={50} y={166} widths={[300, 260, 200]} h={9} gap={18} opacity="0.35" />
    <text x="50" y="250" fontFamily={MONO} fontSize="16" className="sp-f-ink" fillOpacity="0.6">
      canonical · og:image
    </text>
  </Browser>
);
const SchemaArt = () => (
  <>
    <rect x="30" y="30" width="340" height="240" rx="10" className="sp-f-ink" />
    <text x="60" y="100" fontFamily={MONO} fontSize="34" fontWeight="700" className="sp-f-mint">
      {"{ }"}
    </text>
    <text x="140" y="100" fontFamily={MONO} fontSize="22" className="sp-f-cream">
      "@type": "LocalBusiness"
    </text>
    <text x="60" y="150" fontFamily={MONO} fontSize="22" className="sp-f-cream" fillOpacity="0.7">
      llms.txt
    </text>
    <text x="60" y="196" fontFamily={MONO} fontSize="22" className="sp-f-cream" fillOpacity="0.7">
      FAQPage
    </text>
    <rect x="240" y="170" width="110" height="60" rx="14" className="tsp-f-lilac" />
    <text x="295" y="208" textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="700" className="sp-f-ink">
      AI-read
    </text>
  </>
);
const VitalsArt = () => (
  <>
    <path d="M70 200A130 130 0 0 1 330 200" fill="none" className="sp-s-ink" strokeOpacity="0.2" strokeWidth="16" strokeLinecap="round" />
    <path d="M70 200A130 130 0 0 1 310 150" fill="none" className="sp-s-mint" strokeWidth="16" strokeLinecap="round" />
    <text x="200" y="206" textAnchor="middle" fontFamily={SANS} fontSize="86" fontWeight="800" letterSpacing="-4" className="sp-f-ink">
      89+
    </text>
    <text x="200" y="250" textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="600" className="sp-f-ink" fillOpacity="0.6">
      at handoff
    </text>
  </>
);
const AdsArt = () => (
  <>
    <rect x="40" y="60" width="320" height="180" rx="10" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <Chip x={60} y={80} w={120} label="Sponsored" fill="tsp-f-lilac" text="sp-f-ink" />
    <rect x="60" y="130" width="200" height="14" rx="7" className="sp-f-ink" />
    <Lines x={60} y={156} widths={[260, 180]} h={9} gap={18} opacity="0.35" />
    <rect x="60" y="196" width="90" height="26" rx="13" className="sp-f-terra" />
    <path d="M300 140L340 120V220L300 200Z" className="sp-f-ink" />
    <path d="M300 200V236" {...stroke} strokeWidth="8" />
  </>
);
const ContentArt = () => (
  <>
    <Sheet x={80} y={40} w={180} h={220} lines={[120, 140, 100, 130, 90, 110]} rotate={-3} />
    <Sheet x={150} y={60} w={180} h={220} lines={[120, 140, 100, 130, 90, 110]} rotate={4} />
    <Chip x={230} y={230} w={110} label="2 a month" fill="sp-f-terra" />
  </>
);
const EmailArt = () => (
  <>
    <rect x="60" y="80" width="280" height="170" rx="14" className="sp-f-cream" stroke="#141414" strokeWidth="5" />
    <path d="M60 94L200 190L340 94" {...stroke} strokeWidth="7" />
    <circle cx="320" cy="90" r="34" className="sp-f-terra" />
    <text x="320" y="100" textAnchor="middle" fontFamily={SANS} fontSize="30" fontWeight="800" className="sp-f-cream">
      2
    </text>
  </>
);
const CroArt = () => (
  <>
    <path d="M60 60H340L250 170V250L150 220V170Z" className="tsp-f-lilac" stroke="#141414" strokeWidth="5" strokeLinejoin="round" />
    <path d="M300 250V180M300 180L276 204M300 180L324 204" {...stroke} strokeWidth="10" />
  </>
);

const SP = "SEO + GEO Optimization Sprint";
const GR = "Growth Retainer";

// "Seen in": the SEO case studies with measured before/after (owner:
// "whatever you think", 2026-09-26). Zahav's search + ads work is the
// closest shipped retainer.
export const TIERS = {
  [SP]: {
    for: "One-time, audit to implementation",
    examples: [
      { slug: "renewed-bodyworks", label: "Re\u00ADnewed Body\u00ADworks" },
      { slug: "florida-green-improvements", label: "Florida Green Improve\u00ADments" },
    ],
  },
  [GR]: { for: "Ads, SEO and conversion work, every month", examples: [{ slug: "zahav-medspa", label: "Zahav Medspa" }] },
};

export const SECTIONS = [
  {
    id: "packages",
    title: "What's in each package",
    unit: "package",
    tiers: [SP, GR],
    rows: [
      { id: "calls", label: "Strategy calls", Art: CallsArt, cells: { [SP]: "Discovery call, then a fix-plan walkthrough", [GR]: "Monthly strategy call" } },
      { id: "measure", label: "Measurement", Art: AnalyticsArt, cells: { [SP]: "GA4 + Tag Manager with conversion tracking", [GR]: "Performance dashboard with recommendations" } },
      { id: "audit", label: "Technical audit", Art: DiscoveryArt, cells: { [SP]: "Full technical and on-page audit, written report" } },
      { id: "images", label: "Image modernization", Art: ImagesArt, cells: { [SP]: "WebP + AVIF, sized and compressed" } },
      { id: "meta", label: "Meta tags", Art: MetaArt, cells: { [SP]: "Titles, descriptions, canonical, Open Graph, every page" } },
      { id: "schema", label: "Structured data and AI readiness", Art: SchemaArt, cells: { [SP]: "JSON-LD, AI-crawler access, llms.txt, FAQ schema" } },
      { id: "vitals", label: "Core Web Vitals", Art: VitalsArt, cells: { [SP]: "Lighthouse 89+ at handoff, fixed until met" } },
      { id: "onpage", label: "Keyword research and on-page work", Art: SeoArt, cells: { [GR]: "Ongoing" } },
      { id: "ads", label: "Ad campaigns", Art: AdsArt, cells: { [GR]: "Google and Meta, spend separate" } },
      { id: "content", label: "Content", Art: ContentArt, cells: { [GR]: "Quarterly plan, 2 blog posts a month" } },
      { id: "email", label: "Email campaigns", Art: EmailArt, cells: { [GR]: "2 a month" } },
      { id: "cro", label: "Conversion optimization", Art: CroArt, cells: { [GR]: "On key pages" } },
    ],
  },
];
