import { SANS, MONO, Chip, Lines, Sheet, Spark, gridPath } from "./artKit";
import { HostingArt, MonitoringArt, ReportsArt, AppsArt } from "./webDevelopment";

/* AI & Automation package board (2026-09-26): two sections, the three
   one-time projects and the two monthly plans. These tiers are not a
   ladder (a roadmap sprint, a chatbot, an agent), so rows say what each
   one is rather than pretend the next includes the last; the group labels
   ("Only in", "From") come from PackageBoard. Every cell repeats that
   tier's own `includes` line, shortened. */
const stroke = { fill: "none", className: "sp-s-ink", strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" };

/* ── Project tiles ── */
const BuildArt = () => (
  <>
    <rect x="30" y="30" width="340" height="240" rx="10" className="sp-f-ink" />
    <path d={gridPath(30, 30, 340, 240, 34)} className="sp-s-cream" strokeOpacity="0.15" strokeWidth="1.5" />
    <rect x="140" y="90" width="120" height="120" rx="28" className="tsp-f-lilac" />
    <Spark x={200} y={150} r={40} />
    <rect x="60" y="120" width="60" height="60" rx="14" className="sp-f-cream" />
    <path d="M78 150L96 162L112 138" {...stroke} strokeWidth="6" />
    <rect x="280" y="120" width="60" height="60" rx="14" className="sp-f-terra" />
    <path d="M120 150H140M260 150H280" className="sp-s-cream" strokeWidth="6" strokeLinecap="round" />
  </>
);
export const DiscoveryArt = () => (
  <>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x="50" y={60 + i * 62} width="200" height="40" rx="8" className={["sp-f-cream", "tsp-f-lilac", "sp-f-cream"][i]} stroke="#141414" strokeWidth="3" />
        <rect x="70" y={74 + i * 62} width={[120, 90, 140][i]} height="12" rx="6" className="sp-f-ink" fillOpacity="0.4" />
      </g>
    ))}
    <circle cx="300" cy="150" r="52" className="sp-f-cream" stroke="#141414" strokeWidth="9" />
    <path d="M338 188L372 222" {...stroke} strokeWidth="12" />
    <circle cx="300" cy="150" r="22" className="sp-f-terra" />
  </>
);
const RoadmapArt = () => (
  <>
    <path d="M60 230C120 230 120 90 200 90S280 230 340 230" fill="none" className="sp-s-ink" strokeWidth="8" strokeDasharray="1 18" strokeLinecap="round" />
    <circle cx="60" cy="230" r="22" className="sp-f-terra" />
    <circle cx="200" cy="90" r="22" className="tsp-f-lilac" stroke="#141414" strokeWidth="4" />
    <circle cx="340" cy="230" r="22" className="sp-f-mint" stroke="#141414" strokeWidth="4" />
    <text x="60" y="238" textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="800" className="sp-f-cream">1</text>
    <text x="200" y="98" textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="800" className="sp-f-ink">2</text>
    <text x="340" y="238" textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="800" className="sp-f-ink">3</text>
    <Chip x={230} y={40} w={130} label="$ and effort" />
  </>
);
const ChannelsArt = () => (
  <>
    <rect x="150" y="100" width="100" height="100" rx="24" className="tsp-f-lilac" />
    <Spark x={200} y={150} r={30} />
    {[
      { x: 40, y: 60, label: "site", cls: "sp-f-cream", ink: true },
      { x: 260, y: 40, label: "Slack", cls: "sp-f-mint" },
      { x: 40, y: 200, label: "WhatsApp", cls: "sp-f-terra", light: true },
      { x: 260, y: 220, label: "CRM", cls: "sp-f-ink", light: true },
    ].map((c) => (
      <g key={c.label} transform={`translate(${c.x} ${c.y})`}>
        <rect width="100" height="40" rx="20" className={c.cls} stroke={c.ink ? "#141414" : "none"} strokeWidth="3" />
        <text x="50" y="26" textAnchor="middle" fontFamily={SANS} fontSize="17" fontWeight="700" className={c.light ? "sp-f-cream" : "sp-f-ink"}>
          {c.label}
        </text>
      </g>
    ))}
    <path d="M140 80L165 110M260 70L235 105M140 220L165 195M260 230L235 195" {...stroke} strokeWidth="5" strokeOpacity="0.45" />
  </>
);
const RailsArt = () => (
  <>
    <path d="M200 40L300 76V150C300 210 200 260 200 260C200 260 100 210 100 150V76Z" className="tsp-f-lilac" stroke="#141414" strokeWidth="6" />
    <path d="M160 150L188 178L244 118" {...stroke} strokeWidth="12" />
    <rect x="290" y="200" width="90" height="60" rx="12" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <circle cx="322" cy="222" r="9" className="sp-f-ink" />
    <path d="M308 250C310 236 334 236 336 250" {...stroke} strokeWidth="5" />
    <path d="M350 214L370 230L350 246" {...stroke} strokeWidth="5" />
  </>
);
const CostsArt = () => (
  <>
    <path d="M70 200A130 130 0 0 1 330 200" fill="none" className="sp-s-ink" strokeWidth="14" strokeLinecap="round" />
    <path d="M70 200A130 130 0 0 1 130 90" fill="none" className="sp-s-mint" strokeWidth="14" strokeLinecap="round" />
    <path d="M200 200L150 120" {...stroke} strokeWidth="10" />
    <circle cx="200" cy="200" r="14" className="sp-f-terra" />
    <text x="200" y="262" textAnchor="middle" fontFamily={MONO} fontSize="26" fontWeight="700" className="sp-f-ink">
      $/1k tokens
    </text>
  </>
);
const LaunchArt = () => (
  <>
    <rect x="80" y="60" width="240" height="200" rx="14" className="sp-f-cream" stroke="#141414" strokeWidth="5" />
    <rect x="80" y="60" width="240" height="46" rx="14" className="sp-f-ink" />
    <rect x="80" y="90" width="240" height="16" className="sp-f-ink" />
    <text x="200" y="200" textAnchor="middle" fontFamily={SANS} fontSize="88" fontWeight="800" letterSpacing="-4" className="sp-f-ink">
      30
    </text>
    <text x="200" y="240" textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="600" className="sp-f-ink" fillOpacity="0.6">
      days
    </text>
  </>
);
const HandoffArt = () => (
  <>
    <Sheet x={60} y={40} w={170} h={220} lines={[110, 80, 120, 60, 100]} />
    <rect x="250" y="120" width="110" height="80" rx="12" className="sp-f-mint" />
    <path d="M280 160L300 180L336 140" {...stroke} strokeWidth="8" />
    <path d="M230 160H250" {...stroke} strokeWidth="6" />
  </>
);

/* ── Monthly tiles ── */
const ShipsArt = () => (
  <>
    <path d="M40 220H360" {...stroke} strokeWidth="8" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={54 + i * 78} y={140} width="60" height="60" rx="10" className={["sp-f-terra", "tsp-f-lilac", "sp-f-mint", "sp-f-cream"][i]} stroke={i === 3 ? "#141414" : "none"} strokeWidth="3" />
    ))}
    <path d="M300 96L340 96M322 78L340 96L322 114" {...stroke} strokeWidth="8" />
    <Lines x={54} y={60} widths={[120, 80]} h={10} opacity="0.3" />
  </>
);
export const ReviewArt = () => (
  <>
    <Sheet x={80} y={40} w={240} h={220} lines={[]} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(104 ${74 + i * 44})`}>
        <rect width="26" height="26" rx="6" className={i < 3 ? "sp-f-mint" : "sp-f-cream"} stroke="#141414" strokeWidth="3" />
        {i < 3 && <path d="M6 13L11 18L20 8" {...stroke} strokeWidth="4" />}
        <rect x="40" y="8" width={[120, 90, 140, 100][i]} height="10" rx="5" className="sp-f-ink" fillOpacity="0.4" />
      </g>
    ))}
  </>
);
const PriorityArt = () => (
  <>
    <circle cx="200" cy="150" r="96" className="sp-f-terra" />
    <path d="M200 96L216 136L258 138L224 164L236 206L200 182L164 206L176 164L142 138L184 136Z" className="sp-f-cream" />
  </>
);

const RS = "AI Roadmap Sprint";
const AS = "AI Assistant";
const AG = "Custom AI Agent";
const AR = "Automation Retainer";
const AP = "AI Partner";

// "Seen in": Scout is the studio's own shipped agent; My Challah Dealer's
// order flow is an n8n workflow (owner: "whatever you think", 2026-09-26).
export const TIERS = {
  [RS]: { for: "Find where AI pays off, leave with one working automation" },
  [AS]: { for: "A chatbot trained on your business" },
  [AG]: { for: "Multi-step work on your own infrastructure", examples: [{ slug: "scout", label: "Scout" }] },
  [AR]: { for: "Marketing, sales and ops automations", examples: [{ slug: "my-challah-dealer", label: "My Challah Dealer" }] },
  [AP]: { for: "Ongoing AI engineering on infrastructure you own" },
};

export const SECTIONS = [
  {
    id: "projects",
    title: "What's in each project",
    unit: "project",
    tiers: [RS, AS, AG],
    rows: [
      { id: "build", label: "What gets built", Art: BuildArt, cells: { [RS]: "One working proof of concept", [AS]: "Claude or OpenAI, trained on your content", [AG]: "Multi-step agent around one process" } },
      { id: "discovery", label: "Discovery and audit", Art: DiscoveryArt, cells: { [RS]: "Tools, bottlenecks, where AI pays off" } },
      { id: "roadmap", label: "Written roadmap", Art: RoadmapArt, cells: { [RS]: "Priorities, effort, costs" } },
      { id: "channels", label: "Connected to", Art: ChannelsArt, cells: { [AS]: "Site, Slack or WhatsApp; leads to your CRM", [AG]: "Your CRM, calendar, email and forms" } },
      { id: "rails", label: "Safety rails", Art: RailsArt, cells: { [AS]: "Scoped knowledge, tone rules, human handoff", [AG]: "Error handling, logging, a monitoring dashboard" } },
      { id: "launch", label: "After launch", Art: LaunchArt, cells: { [AS]: "30 days of monitoring and tuning", [AG]: "30 days of support" } },
      { id: "handoff", label: "Handoff", Art: HandoffArt, cells: { [AS]: "Documentation and a walkthrough", [AG]: "Documentation and handoff" } },
      { id: "hosting", label: "Where it runs", Art: HostingArt, cells: { [AG]: "Self-hosted on a VPS, your data stays yours" } },
      { id: "costs", label: "Running costs", Art: CostsArt, cells: { [AG]: "Token and cost optimization" } },
    ],
  },
  {
    id: "monthly",
    title: "Month to month",
    unit: "plan",
    tiers: [AR, AP],
    rows: [
      { id: "ships", label: "What ships", Art: ShipsArt, cells: { [AR]: "Up to 5 workflows across CRM, ads, email and forms, via APIs and webhooks", [AP]: "1–2 new automations or AI features a month" } },
      { id: "monitoring", label: "Monitoring and upkeep", Art: MonitoringArt, cells: { [AR]: "Error monitoring and maintenance", [AP]: "Monitoring, model updates, cost optimization" } },
      { id: "review", label: "Monthly review", Art: ReviewArt, cells: { [AR]: "Review and optimization, plus a performance and uptime report", [AP]: "What ran, what it saved, what's next" } },
      { id: "dashboards", label: "Dashboards", Art: ReportsArt, cells: { [AR]: "1–2, in Sheets, Notion or Airtable" } },
      { id: "n8n", label: "Self-hosted n8n", Art: AppsArt, cells: { [AP]: "On a VPS, no per-task fees" } },
      { id: "priority", label: "Priority support", Art: PriorityArt, cells: { [AP]: true } },
    ],
  },
];
