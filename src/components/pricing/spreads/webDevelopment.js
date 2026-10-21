import { SANS, MONO, Browser, Chip, Lines, Sheet, Spark, gridPath } from "./artKit";

/* Web Development package board (2026-09-26): three sections, the four
   one-time website builds, the mobile app (2026-10-20) and the three
   monthly care plans. Every cell repeats
   that tier's own `includes` line in pricingData.json, shortened; an item
   a tier does not list gets no dot, even when a cheaper tier lists it (the
   holes are reported to the owner, not painted over). Rows are ordered as
   a staircase: what every tier has first, then what each tier adds. */
const stroke = { fill: "none", className: "sp-s-ink", strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" };

/* ── Build tiles ── */
const DesignArt = () => (
  <Browser>
    <rect x="52" y="96" width="150" height="40" rx="6" className="sp-f-ink" />
    <Lines x={52} y={148} widths={[140, 100]} h={8} gap={16} opacity="0.4" />
    <rect x="52" y="196" width="110" height="34" rx="17" className="sp-f-terra" />
    <rect x="224" y="96" width="124" height="134" rx="8" className="tsp-f-lilac" />
    <circle cx="316" cy="132" r="16" className="sp-f-cream" />
    <path d="M224 230L268 172L296 204L314 184L348 230Z" className="sp-f-ink" />
  </Browser>
);
const PagesArt = () => (
  <>
    <Sheet x={190} y={60} rotate={8} />
    <Sheet x={150} y={50} rotate={-4} />
    <Sheet x={110} y={44} lines={[100, 70, 92, 50, 80]} />
    <Chip x={252} y={232} w={92} label="pages" fill="sp-f-terra" />
  </>
);
export const SeoArt = () => (
  <>
    <rect x="40" y="46" width="320" height="58" rx="29" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <circle cx="82" cy="75" r="13" {...stroke} strokeWidth="5" />
    <path d="M92 85L104 97" {...stroke} strokeWidth="5" />
    <Lines x={112} y={69} widths={[150]} h={12} opacity="0.35" />
    <rect x="40" y="130" width="320" height="52" rx="8" className="tsp-f-lilac" />
    <text x="58" y="163" fontFamily={MONO} fontSize="22" fontWeight="700" className="sp-f-ink">
      1. yoursite.com
    </text>
    <Lines x={40} y={200} widths={[320, 260]} gap={34} h={18} opacity="0.18" />
  </>
);
export const HostingArt = () => (
  <>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(70 ${64 + i * 62})`}>
        <rect width="260" height="48" rx="8" className="sp-f-ink" />
        <circle cx="30" cy="24" r="7" className="sp-f-mint" />
        <circle cx="54" cy="24" r="7" className={i === 1 ? "sp-f-terra" : "sp-f-mint"} />
        <rect x="150" y="18" width="90" height="12" rx="6" className="sp-f-cream" fillOpacity="0.5" />
      </g>
    ))}
    <Chip x={210} y={244} w={140} label="1 year" fill="tsp-f-lilac" text="sp-f-ink" />
  </>
);
const CmsArt = () => (
  <>
    <rect x="30" y="40" width="340" height="220" rx="10" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
    <rect x="30" y="40" width="90" height="220" className="sp-f-ink" />
    <Lines x={48} y={70} widths={[54, 40, 48, 36]} h={8} gap={26} className="sp-f-cream" opacity="0.6" />
    <rect x="140" y="62" width="210" height="34" rx="6" className="tsp-f-lilac" />
    <Lines x={140} y={116} widths={[210, 170, 190, 120]} h={9} gap={24} opacity="0.35" />
    <rect x="262" y="212" width="88" height="30" rx="15" className="sp-f-terra" />
    <text x="306" y="233" textAnchor="middle" fontFamily={SANS} fontSize="16" fontWeight="700" className="sp-f-cream">
      Publish
    </text>
  </>
);
export const FormsArt = () => (
  <>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(60 ${52 + i * 60})`}>
        <rect width="280" height="42" rx="8" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
        <rect x="16" y="15" width={[90, 130, 70][i]} height="12" rx="6" className="sp-f-ink" fillOpacity="0.35" />
      </g>
    ))}
    <rect x="60" y="234" width="140" height="40" rx="20" className="sp-f-terra" />
    <text x="130" y="260" textAnchor="middle" fontFamily={SANS} fontSize="18" fontWeight="700" className="sp-f-cream">
      Send
    </text>
  </>
);
const CommerceArt = () => (
  <>
    <path d="M60 70H100L128 190H300L326 108H116" {...stroke} strokeWidth="9" />
    <circle cx="150" cy="232" r="16" className="sp-f-ink" />
    <circle cx="278" cy="232" r="16" className="sp-f-ink" />
    <rect x="170" y="120" width="120" height="54" rx="8" className="tsp-f-lilac" />
    <text x="230" y="156" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="800" className="sp-f-ink">
      $
    </text>
    <rect x="296" y="40" width="70" height="40" rx="8" className="sp-f-mint" />
    <path d="M312 60L326 72L350 48" {...stroke} strokeWidth="6" />
  </>
);
const DatabaseArt = () => (
  <>
    <ellipse cx="200" cy="80" rx="110" ry="34" className="tsp-f-lilac" stroke="#141414" strokeWidth="6" />
    <path d="M90 80V220A110 34 0 0 0 310 220V80" className="sp-f-cream" stroke="#141414" strokeWidth="6" />
    <path d="M90 150A110 34 0 0 0 310 150" {...stroke} strokeWidth="6" />
    <path d="M90 80A110 34 0 0 0 310 80" {...stroke} strokeWidth="6" />
    <circle cx="150" cy="190" r="8" className="sp-f-terra" />
    <circle cx="200" cy="196" r="8" className="sp-f-terra" />
    <circle cx="250" cy="190" r="8" className="sp-f-terra" />
  </>
);
const AiArt = () => (
  <>
    <rect x="110" y="60" width="180" height="180" rx="36" className="tsp-f-lilac" />
    <Spark x={200} y={150} r={60} />
    <Spark x={318} y={78} r={16} className="sp-f-terra" />
    <Spark x={84} y={222} r={12} className="sp-f-mint" />
  </>
);
export const SupportArt = () => (
  <>
    <circle cx="200" cy="150" r="96" className="sp-f-mint" />
    <path d="M150 200L232 118M232 118L214 100A34 34 0 0 1 264 88L246 106L258 118L276 100A34 34 0 0 1 250 136L232 118" {...stroke} strokeWidth="9" />
    <path d="M150 200L136 214A12 12 0 0 1 120 198L134 184" {...stroke} strokeWidth="9" />
  </>
);

const ResponsiveArt = () => (
  <>
    <rect x="40" y="50" width="230" height="160" rx="10" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <rect x="40" y="50" width="230" height="26" rx="10" className="sp-f-ink" />
    <rect x="64" y="96" width="120" height="14" rx="7" className="sp-f-ink" />
    <rect x="64" y="122" width="90" height="10" rx="5" className="sp-f-ink" fillOpacity="0.35" />
    <rect x="64" y="150" width="70" height="26" rx="13" className="sp-f-terra" />
    <rect x="100" y="210" width="110" height="10" className="sp-f-ink" />
    <rect x="272" y="110" width="88" height="160" rx="14" className="tsp-f-lilac" stroke="#141414" strokeWidth="4" />
    <rect x="288" y="140" width="56" height="10" rx="5" className="sp-f-ink" />
    <rect x="288" y="160" width="40" height="8" rx="4" className="sp-f-ink" fillOpacity="0.4" />
    <rect x="288" y="184" width="44" height="20" rx="10" className="sp-f-terra" />
    <path d="M230 246L258 230L230 214" fill="none" className="sp-s-mint" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </>
);
const GalleryArt = () => (
  <>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const x = 50 + (i % 3) * 105;
      const y = 50 + Math.floor(i / 3) * 105;
      const cls = ["tsp-f-lilac", "sp-f-mint", "sp-f-terra", "sp-f-ink", "tsp-f-lilac", "sp-f-mint"][i];
      return (
        <g key={i}>
          <rect x={x} y={y} width="95" height="95" rx="8" className={cls} />
          <circle cx={x + 68} cy={y + 26} r="9" className="sp-f-cream" />
          <path d={`M${x} ${y + 95}L${x + 34} ${y + 50}L${x + 56} ${y + 74}L${x + 70} ${y + 60}L${x + 95} ${y + 95}Z`} className="sp-f-ink" fillOpacity={i === 3 ? 0 : 0.85} />
        </g>
      );
    })}
  </>
);
export const AnalyticsArt = () => (
  <>
    <rect x="30" y="40" width="340" height="220" rx="10" className="sp-f-cream" stroke="#141414" strokeWidth="3" />
    {[70, 110, 90, 150, 130, 190].map((h, i) => (
      <rect key={i} x={62 + i * 50} y={236 - h} width="28" height={h} rx="4" className={i === 5 ? "sp-f-terra" : "tsp-f-lilac"} />
    ))}
    <path d="M76 190L126 150L176 166L226 110L276 124L326 60" fill="none" className="sp-s-ink" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="326" cy="60" r="9" className="sp-f-ink" />
  </>
);
const DomainArt = () => (
  <>
    <rect x="120" y="130" width="160" height="120" rx="16" className="sp-f-terra" />
    <path d="M150 130V100A50 50 0 0 1 250 100V130" fill="none" className="sp-s-ink" strokeWidth="12" strokeLinecap="round" />
    <circle cx="200" cy="180" r="14" className="sp-f-ink" />
    <rect x="194" y="184" width="12" height="30" rx="6" className="sp-f-ink" />
    <text x="200" y="284" textAnchor="middle" fontFamily={MONO} fontSize="24" fontWeight="700" className="sp-f-ink">
      https://
    </text>
  </>
);

/* ── Care tiles ── */
const CareHostingArt = () => (
  <>
    <rect x="50" y="70" width="230" height="150" rx="12" className="sp-f-ink" />
    <path d={gridPath(50, 70, 230, 150, 30)} className="sp-s-cream" strokeOpacity="0.15" strokeWidth="2" />
    <circle cx="86" cy="106" r="8" className="sp-f-mint" />
    <circle cx="86" cy="146" r="8" className="sp-f-mint" />
    <circle cx="86" cy="186" r="8" className="sp-f-mint" />
    <path d="M306 84L356 104V150C356 190 306 216 306 216C306 216 256 190 256 150V104Z" className="sp-f-terra" stroke="#fef7ed" strokeWidth="6" />
    <path d="M284 150L300 166L330 130" fill="none" className="sp-s-cream" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
  </>
);
const BackupsArt = () => (
  <>
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx="150" cy={110 + i * 46} rx="90" ry="26" className={i ? "sp-f-cream" : "tsp-f-lilac"} stroke="#141414" strokeWidth="5" />
    ))}
    <circle cx="300" cy="200" r="54" className="sp-f-cream" stroke="#141414" strokeWidth="6" />
    <path d="M300 170V202L322 216" {...stroke} strokeWidth="7" />
  </>
);
export const MonitoringArt = () => (
  <>
    <rect x="30" y="50" width="340" height="200" rx="10" className="sp-f-ink" />
    <path d="M50 160H120L150 90L190 220L230 130L260 160H350" fill="none" className="sp-s-mint" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="350" cy="160" r="12" className="sp-f-terra" />
  </>
);
const UpdatesArt = () => (
  <>
    <path d="M280 110A100 100 0 0 0 110 120M120 190A100 100 0 0 0 290 180" {...stroke} strokeWidth="11" />
    <path d="M100 82V126H144" {...stroke} strokeWidth="11" />
    <path d="M300 218V174H256" {...stroke} strokeWidth="11" />
    <Chip x={150} y={133} w={100} label="update" fill="sp-f-terra" />
  </>
);
const EditsArt = () => (
  <>
    <Sheet x={80} y={40} w={200} h={220} lines={[120, 150, 90, 140, 70]} />
    <g transform="translate(300 200) rotate(45)">
      <rect x="-22" y="-120" width="44" height="170" rx="6" className="sp-f-terra" stroke="#141414" strokeWidth="5" />
      <path d="M-22 50L0 92L22 50Z" className="sp-f-cream" stroke="#141414" strokeWidth="5" strokeLinejoin="round" />
      <rect x="-22" y="-120" width="44" height="26" className="sp-f-ink" />
    </g>
  </>
);
export const ReportsArt = () => (
  <>
    <Sheet x={100} y={40} w={200} h={220} lines={[120, 90]} />
    {[60, 100, 80, 130].map((h, i) => (
      <rect key={i} x={124 + i * 40} y={236 - h} width="26" height={h} rx="4" className={["sp-f-ink", "tsp-f-lilac", "sp-f-mint", "sp-f-terra"][i]} />
    ))}
  </>
);
export const AppsArt = () => (
  <>
    <path d="M110 150H190M210 150H290M200 140V90M200 160V210" {...stroke} strokeWidth="6" strokeOpacity="0.4" />
    <rect x="50" y="120" width="60" height="60" rx="14" className="sp-f-terra" />
    <rect x="170" y="120" width="60" height="60" rx="14" className="tsp-f-lilac" />
    <Spark x={200} y={150} r={18} />
    <rect x="290" y="120" width="60" height="60" rx="14" className="sp-f-mint" />
    <rect x="170" y="40" width="60" height="50" rx="12" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <rect x="170" y="210" width="60" height="50" rx="12" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
  </>
);

/* ── Mobile app tiles ── */
const PhonesArt = () => (
  <>
    <rect x="96" y="40" width="112" height="220" rx="20" className="sp-f-cream" stroke="#141414" strokeWidth="5" />
    <rect x="112" y="70" width="80" height="54" rx="8" className="sp-f-terra" />
    <Lines x={112} y={140} widths={[80, 56, 70]} h={8} gap={18} opacity="0.4" />
    <rect x="192" y="60" width="112" height="220" rx="20" className="sp-f-ink" />
    <rect x="208" y="90" width="80" height="54" rx="8" className="tsp-f-lilac" />
    <rect x="208" y="160" width="80" height="12" rx="6" className="sp-f-cream" opacity="0.5" />
    <rect x="208" y="186" width="56" height="12" rx="6" className="sp-f-cream" opacity="0.5" />
    <Chip x={232} y={240} w={96} label="ios+android" fill="sp-f-mint" />
  </>
);
const AccountsArt = () => (
  <>
    <rect x="100" y="50" width="200" height="200" rx="18" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <circle cx="200" cy="108" r="26" className="tsp-f-lilac" />
    <rect x="130" y="152" width="140" height="22" rx="11" className="sp-f-ink" opacity="0.15" />
    <rect x="130" y="184" width="140" height="22" rx="11" className="sp-f-ink" opacity="0.15" />
    <rect x="150" y="218" width="100" height="20" rx="10" className="sp-f-terra" />
  </>
);
const PushArt = () => (
  <>
    <rect x="60" y="70" width="280" height="70" rx="16" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <rect x="78" y="88" width="34" height="34" rx="9" className="sp-f-terra" />
    <Lines x={128} y={92} widths={[150, 110]} h={9} gap={18} opacity="0.4" />
    <rect x="80" y="160" width="240" height="60" rx="14" className="sp-f-cream" stroke="#141414" strokeWidth="4" opacity="0.55" />
    <circle cx="322" cy="76" r="16" className="sp-f-mint" />
  </>
);
const StoresArt = () => (
  <>
    <rect x="50" y="90" width="140" height="120" rx="18" className="sp-f-ink" />
    <text x="120" y="160" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="700" className="sp-f-cream">App Store</text>
    <rect x="210" y="90" width="140" height="120" rx="18" className="sp-f-mint" />
    <text x="280" y="160" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="700" className="sp-f-ink">Play</text>
    <Spark x={200} y={66} r={16} />
  </>
);

const LP = "Landing Page";
const SW = "Simple Website";
const BB = "Business Bundle";
const GS = "Growth Suite";
const MA = "Mobile App";
const SC = "Starter Care";
const GC = "Growth Care";
const VP = "VPS & Self-Hosted";

// "Seen in": shipped case studies whose scope matches a build (owner's
// calls, 2026-09-26).
export const TIERS = {
  [LP]: { for: "Campaigns, launches, lead capture", examples: [{ slug: "my-challah-dealer", label: "My Challah Dealer" }] },
  [SW]: { for: "Small businesses and portfolios", examples: [{ slug: "jo-marketing-11", label: "Jo Marketing 11" }] },
  [BB]: { for: "A full business site, run by you", examples: [{ slug: "renewed-bodyworks", label: "Renewed Bodyworks" }] },
  [GS]: {
    for: "E-commerce, web apps, complex builds",
    examples: [
      { slug: "prodani-miami", label: "Prodani Miami" },
      { slug: "zahav-medspa", label: "Zahav Medspa" },
    ],
  },
  [MA]: { for: "iOS and Android apps" },
  [SC]: { for: "Personal sites, artists, micro-businesses" },
  [GC]: { for: "Growing traffic, regular updates" },
  [VP]: { for: "Self-hosting n8n, AI agents or custom apps" },
};

export const SECTIONS = [
  {
    id: "build",
    title: "What's in each build",
    unit: "build",
    tiers: [LP, SW, BB, GS],
    rows: [
      { id: "design", label: "Custom design", Art: DesignArt, cells: { [LP]: "From scratch", [SW]: "To your brand", [BB]: "To your brand", [GS]: "Fully custom" } },
      { id: "pages", label: "Pages", Art: PagesArt, cells: { [LP]: "1 page", [SW]: "Up to 5", [BB]: "Up to 10", [GS]: "Unlimited" } },
      { id: "seo", label: "SEO", Art: SeoArt, cells: { [LP]: "Essentials", [SW]: "Basic setup", [BB]: "Basic", [GS]: "Advanced" } },
      { id: "responsive", label: "Responsive and fast", Art: ResponsiveArt, cells: { [LP]: true, [SW]: true, [BB]: true, [GS]: true } },
      { id: "hosting", label: "Hosting and domain", Art: HostingArt, cells: { [SW]: "1 year", [BB]: "1 year", [GS]: "1 year" } },
      { id: "gallery", label: "Gallery or showcase", Art: GalleryArt, cells: { [SW]: true, [BB]: true, [GS]: true } },
      { id: "cms", label: "Content management", Art: CmsArt, cells: { [BB]: "CMS", [GS]: "Advanced CMS" } },
      { id: "forms", label: "Forms", Art: FormsArt, cells: { [BB]: "Contact form", [GS]: "Detailed and custom forms" } },
      { id: "analytics", label: "Analytics", Art: AnalyticsArt, cells: { [BB]: "Google Analytics", [GS]: "Google Analytics" } },
      { id: "commerce", label: "E-commerce", Art: CommerceArt, cells: { [GS]: "Cart and secure checkout" } },
      { id: "database", label: "Database", Art: DatabaseArt, cells: { [GS]: "Products, users, admin" } },
      { id: "ai", label: "AI features", Art: AiArt, cells: { [GS]: "On request: chat, search, content" } },
      { id: "support", label: "Ongoing support", Art: SupportArt, cells: { [GS]: true } },
    ],
  },
  {
    id: "app",
    title: "Mobile apps",
    unit: "app",
    tiers: [MA],
    rows: [
      { id: "platforms", label: "iOS and Android", Art: PhonesArt, cells: { [MA]: "One React Native codebase" } },
      { id: "app-design", label: "Custom app design", Art: DesignArt, cells: { [MA]: "Screens, flows, app icon" } },
      { id: "accounts", label: "User accounts", Art: AccountsArt, cells: { [MA]: "Sign-in" } },
      { id: "app-database", label: "Backend and database", Art: DatabaseArt, cells: { [MA]: true } },
      { id: "push", label: "Push notifications", Art: PushArt, cells: { [MA]: true } },
      { id: "app-analytics", label: "Analytics", Art: AnalyticsArt, cells: { [MA]: "Installs and usage" } },
      { id: "stores", label: "Store submission", Art: StoresArt, cells: { [MA]: "App Store and Google Play" } },
      { id: "app-support", label: "Ongoing support", Art: SupportArt, cells: { [MA]: true } },
    ],
  },
  {
    id: "care",
    title: "Keep it running",
    unit: "plan",
    tiers: [SC, GC, VP],
    rows: [
      { id: "care-hosting", label: "Hosting", Art: CareHostingArt, cells: { [SC]: "Shared or managed WordPress, 5 GB", [GC]: "VPS or cloud with staging, 15 GB", [VP]: "Your own server, provisioned and hardened" } },
      { id: "domain", label: "Domain and SSL", Art: DomainArt, cells: { [SC]: "Renewal and SSL, at cost", [GC]: "Renewal and SSL, at cost", [VP]: "SSL with provisioning" } },
      { id: "backups", label: "Backups", Art: BackupsArt, cells: { [SC]: "Weekly", [GC]: "Daily", [VP]: "Automated" } },
      { id: "monitoring", label: "Monitoring", Art: MonitoringArt, cells: { [SC]: "Security", [GC]: "Uptime and performance", [VP]: "Uptime, with alerts" } },
      { id: "updates", label: "Updates", Art: UpdatesArt, cells: { [SC]: "Plugins and theme", [GC]: "CMS and plugins, priority security patches", [VP]: "OS and security patches" } },
      { id: "edits", label: "Edits each month", Art: EditsArt, cells: { [SC]: "Up to 1 hour", [GC]: "Up to 3 hours" } },
      { id: "reports", label: "Health report", Art: ReportsArt, cells: { [GC]: "Quarterly", [VP]: "Monthly, with costs" } },
      { id: "apps", label: "Self-hosted apps", Art: AppsArt, cells: { [VP]: "n8n, AI agents, dashboards" } },
    ],
  },
];
