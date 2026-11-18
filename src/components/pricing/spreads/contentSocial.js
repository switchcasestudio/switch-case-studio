import { SANS, MONO, Browser, Chip, Lines, Sheet } from "./artKit";
import { AnalyticsArt } from "./webDevelopment";
import { CallsArt, ContentArt } from "./seoSearch";

/* Content & Social Media package board (2026-11-18): one board, four
   packages, two one-time and two monthly, so the groups read "Only in" and
   "From". Every cell repeats that tier's own `includes` line, shortened.
   The ladder is the draft the owner chose to start from on 2026-11-18;
   names, prices and what each includes live in pricingData.json. */
const stroke = { fill: "none", className: "sp-s-ink", strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" };

const PagesArt = () => (
  <Browser>
    <rect x="50" y="96" width="210" height="20" rx="10" className="sp-f-ink" />
    <Lines x={50} y={132} widths={[280, 240]} h={9} gap={18} opacity="0.35" />
    <rect x="50" y="178" width="96" height="28" rx="14" className="sp-f-terra" />
    <Lines x={50} y={228} widths={[90]} h={9} opacity="0.35" />
    <Lines x={160} y={228} widths={[90]} h={9} opacity="0.35" />
    <Lines x={270} y={228} widths={[80]} h={9} opacity="0.35" />
  </Browser>
);
const VoiceArt = () => (
  <>
    <rect x="50" y="50" width="250" height="150" rx="24" className="tsp-f-lilac" />
    <path d="M96 200L84 250L150 200" className="tsp-f-lilac" />
    <text x="84" y="150" fontFamily={SANS} fontSize="92" fontWeight="800" letterSpacing="-5" className="sp-f-ink">
      Aa
    </text>
    <Chip x={230} y={206} w={130} label="Your voice" />
  </>
);
const TopicsArt = () => (
  <>
    {["Cost?", "How long?", "Near me?"].map((t, i) => (
      <g key={t} transform={`translate(${50 + i * 26} ${52 + i * 70})`}>
        <rect width="230" height="56" rx="28" className={i === 1 ? "sp-f-terra" : "sp-f-cream"} stroke="#141414" strokeWidth="4" />
        <text x="28" y="37" fontFamily={SANS} fontSize="24" fontWeight="700" className="sp-f-ink">
          {t}
        </text>
      </g>
    ))}
  </>
);
const CalendarArt = () => (
  <>
    <rect x="50" y="50" width="300" height="210" rx="14" className="sp-f-cream" stroke="#141414" strokeWidth="4" />
    <path d="M50 64A14 14 0 0 1 64 50H336A14 14 0 0 1 350 64V96H50Z" className="sp-f-ink" />
    {Array.from({ length: 21 }, (_, i) => (
      <rect
        key={i}
        x={66 + (i % 7) * 39}
        y={112 + Math.floor(i / 7) * 46}
        width="30"
        height="34"
        rx="6"
        className={[1, 3, 8, 12, 15, 17].includes(i) ? "sp-f-terra" : "tsp-f-lilac"}
        fillOpacity={[1, 3, 8, 12, 15, 17].includes(i) ? 1 : 0.5}
      />
    ))}
    <text x="200" y="82" textAnchor="middle" fontFamily={SANS} fontSize="20" fontWeight="700" className="sp-f-cream">
      90 days
    </text>
  </>
);
const PostsArt = () => (
  <>
    <rect x="70" y="40" width="200" height="200" rx="16" className="sp-f-mint" stroke="#141414" strokeWidth="4" />
    <path d="M70 196L130 130L176 176L206 148L270 214V224A16 16 0 0 1 254 240H86A16 16 0 0 1 70 224Z" className="sp-f-ink" />
    <circle cx="222" cy="92" r="22" className="sp-f-cream" />
    <circle cx="300" cy="210" r="48" className="sp-f-terra" />
    <path d="M300 236C280 221 272 211 272 201A14 14 0 0 1 300 198A14 14 0 0 1 328 201C328 211 320 221 300 236Z" className="sp-f-cream" />
  </>
);
const PostingArt = () => (
  <>
    <circle cx="170" cy="150" r="100" className="sp-f-cream" stroke="#141414" strokeWidth="5" />
    <path d="M170 90V150L214 176" {...stroke} strokeWidth="10" />
    <path d="M280 150H360M360 150L330 122M360 150L330 178" {...stroke} strokeWidth="10" />
    <text x="170" y="282" textAnchor="middle" fontFamily={MONO} fontSize="20" fontWeight="700" className="sp-f-ink">
      scheduled
    </text>
  </>
);
const LetterArt = () => (
  <>
    <rect x="60" y="80" width="280" height="170" rx="14" className="sp-f-cream" stroke="#141414" strokeWidth="5" />
    <path d="M60 94L200 190L340 94" {...stroke} strokeWidth="7" />
    <circle cx="320" cy="90" r="34" className="sp-f-terra" />
    <text x="320" y="100" textAnchor="middle" fontFamily={SANS} fontSize="30" fontWeight="800" className="sp-f-cream">
      1
    </text>
  </>
);
const VoiceSheetArt = () => (
  <>
    <Sheet x={110} y={40} w={180} h={220} lines={[120, 140, 100, 130, 90, 110]} rotate={-3} />
    <Chip x={200} y={226} w={140} label="Placed for you" fill="sp-f-terra" />
  </>
);

const WC = "Website Copy";
const CS = "Content Strategy Sprint";
const SS = "Social Starter";
const CP = "Content & Social Partner";

// "Seen in": the clients the owner named for content and social work
// (2026-11-18). Renewed Bodyworks and ProDani are tagged Content & Copy on
// their case studies; Zahav's is the closest shipped monthly engagement.
export const TIERS = {
  [WC]: {
    for: "The words for a small site",
    examples: [
      { slug: "renewed-bodyworks", label: "Re­newed Body­works" },
      { slug: "prodani-miami", label: "ProDani Miami" },
    ],
  },
  [CS]: { for: "A plan to run yourself or hand to us" },
  [SS]: { for: "One platform, kept alive every week" },
  [CP]: { for: "Articles, email and social, every month", examples: [{ slug: "zahav-medspa", label: "Zahav Medspa" }] },
};

export const SECTIONS = [
  {
    id: "packages",
    title: "What's in each package",
    unit: "package",
    tiers: [WC, CS, SS, CP],
    rows: [
      { id: "call", label: "Discovery call", Art: CallsArt, cells: { [WC]: true, [CS]: true } },
      { id: "pages", label: "Website pages", Art: PagesArt, cells: { [WC]: "Up to 5, each with a title and description" } },
      { id: "placed", label: "Placed on your site", Art: VoiceSheetArt, cells: { [WC]: true } },
      { id: "voice", label: "Voice guide", Art: VoiceArt, cells: { [CS]: "How you sound, with examples" } },
      { id: "topics", label: "Topic list", Art: TopicsArt, cells: { [CS]: "From your customers' questions" } },
      { id: "calendar", label: "Content calendar", Art: CalendarArt, cells: { [CS]: "90 days" } },
      { id: "posts", label: "Social posts", Art: PostsArt, cells: { [SS]: "12 a month, 1 platform", [CP]: "20 a month" } },
      { id: "posting", label: "Scheduling and posting", Art: PostingArt, cells: { [SS]: "On your account", [CP]: "On your accounts" } },
      { id: "articles", label: "Articles", Art: ContentArt, cells: { [CP]: "2 a month" } },
      { id: "email", label: "Email newsletter", Art: LetterArt, cells: { [CP]: "1 a month" } },
      { id: "report", label: "Tagged links and a monthly report", Art: AnalyticsArt, cells: { [CP]: true } },
    ],
  },
];
