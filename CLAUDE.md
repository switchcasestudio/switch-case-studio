# Switch Case Studio (SCS) — Working Instructions

Living instructions for AI work on this project. **Every fix from a review goes back into this file** — that's how it improves as it goes (Rule 5).

## Thumb rules (always on)

1. **Write sharp, not more.** AI made words cheap; substance is the scarce thing. Attention is the currency — pack the most information into the fewest words. Applies to site copy *and* to anything I write here.
2. **Build instructions that learn.** When a review surfaces a fix, the fix lands in the code *and* the rule lands here, so the same mistake isn't repeated. Add to "Review fixes → rules" below.

(Full set of general working rules: `~/Downloads/ai-rules-of-thumb.md`.)

## Status

Running audit + status doc: `.audit/summary.md` — keep it current with git, not behind it.

## Blog (`/blog`, `/blog/:slug`) — data contract, do not break

The blog is data-driven from `src/data/posts.json` and pre-rendered per post via `getStaticPaths`
in `routes.js`. It's the publish target for the **Studio Journal Factory** (Beau writes weekly,
commits `posts.json`, pushes → Netlify deploys). Since 2026-09-11 both pages render ONE split reader,
`src/components/blog/JournalReader.js` (styles `journal.scss`): the left third is the post list (title
+ date, the open post in lavender) with the open post's details under it; the right two-thirds is
the article. `/blog` opens the newest post (journal title = h1, article title = h2); `/blog/:slug`
opens that post (article title = h1). The body-block renderer and date formatter live in
`src/components/blog/blogBlocks.js` (block styles still in `blogPostPage.scss`). `BlogPage.js` and
`BlogPostPage.js` now own only their `<Seo>` and route handling.
The list paginates at `PAGE_SIZE = 11` in JournalReader.js and opens on the page holding the open post
(derived from the route, so static HTML and hydration agree). The article spans its full two-thirds
by owner request (no ~70ch cap): at 1440 a line runs ~110 characters.
Grid pass (2026-09-11, `feat/blog-grid`): list rows are one line (title ellipsis, dates in a fixed
6.5rem column); the pager sits under the list and a short last page is padded with `aria-hidden`
rows so nothing below it moves; details lead with Title. The article is cover (16:9; a lavender
category-word plate while no post has `coverImage`) → title + lede → body cut into sections at each
heading, each set in 1 or 2 CSS columns by `sectionize()`: intro always 2; media or < 110 words → 1;
> 200 words → 2; in between a stable slug hash; never 3 in a row. Motion lives in
`useJournalMotion.js` (scroll reveals with `armSafetyNet`, progress bar, cover drift/light, list
cascade) plus a CSS `journal-enter` keyframe for title/lede/intro — see the rule below.

- **A post is a flat object** with a `body` array of blocks; block `type` ∈ `paragraph` |
  `heading` | `list` (items[]) | `quote` (text, cite?) | `video` (url, caption?/title?) |
  `download` (url, label, note?) | `link` (url, label, note?; added 2026-09-25, a button link to a root-absolute path or an https URL, no `download` attribute).
  `video` embeds a YouTube URL (watch/share/shorts/embed all accepted) as a lazy, responsive
  16:9 `youtube-nocookie` iframe — embedding only, no video files hosted. `download` (added
  2026-08-05 for the n8n giveaway) renders an anchor with a root-absolute `url` into `public/`
  and **the `download` attribute, which is load-bearing**: `ga.js`'s delegated click listener
  matches on that attribute to fire `file_download`, so a download link written any other way
  (plain `<a>`, no attribute) silently stops being measured. Unknown types render nothing (safe).
  Required: `slug` (unique kebab), `title`, `excerpt`, `category`, `body`. The rest have defaults.
  `excerpt` stays ≤ 160 characters (it is the lede AND the meta description); a `title` over 60
  characters gets an optional `seoTitle` for the title tag (2026-10-09, see the fix-8 rule).
  `category` is one of `src/components/blog/categories.js` (Web Design, Web Development, Brand Identity,
  SEO & Growth, AI & Automation, Studio News); `updated` (YYYY-MM-DD) marks a substantial rewrite (fix 14).
- **Paragraph text and list items may carry inline links, `[label](url)`** (2026-10-09, `src/components/blog/inlineLinks.js`): url is root-absolute (same site) or https (new tab); anything else stays literal text and `add-post.mjs` rejects the post. A statistic or a quoted fact links its source in the sentence this way, never only in a `link` button after it.
- **Never hand-edit `posts.json` from an automation** — insert via `node scripts/add-post.mjs
  <post.json>` (validates schema + unique slug, fills date/readingTime/author, inserts newest-first,
  rejects malformed posts). Adding a block type means updating BOTH `add-post.mjs`'s `BLOCK_TYPES`
  and `blogBlocks.js`'s `Block` switch, or posts using it silently render blank.
- `coverImage` is optional and currently unused by the reader (it still feeds `og:image` and the
  BlogPosting JSON-LD); the split reader shows no cover, by design.
- The sitemap generator (`generate-sitemap.mjs`) already emits `/blog` + every post; it derives
  from `posts.json`, so new posts appear automatically. Both pages render `<Seo>` (Blog /
  BlogPosting + breadcrumb JSON-LD) — keep that.

## Review fixes → rules

Full text, evidence and verification steps: **`.audit/rules.md`**. Read the matching entry there before touching that area. A new fix: full rule in `.audit/rules.md`, one line here (Rule 2).

**Standing checks on every build** (details in `.audit/rules.md`):
- `grep -l 'id="S:' build/**/*.html` matches nothing; `<h1` sits inside `<main>` on every page.
- `grep -l '__SCS_LANDING_PATHNAME__' build/assets/app-*.js` matches (entry chunk only).
- `grep -o '—' build/**/*.html build/assets/*` returns only `clampAtWord`'s regex.
- `find build -name '*.html' | wc -l` = route baseline (59 as of 2026-10-22); re-baseline in `.audit/rules.md` when routes change.
- `npm run check:us` (postbuild) is clean: US English only in every built page (`scripts/check-us-english.mjs`).
- Every `<title>` ≤ 60, every meta description ≤ 160; `grep -c "SCS Display" build/assets/*.css` hits only the app bundle.
- Before blog work: fetch + rebase (scheduler pushes to main daily); no post with empty `coverImage`.
- Never write VPS specifics (paths, hosts, IPs, ports) into this file or `.audit/`: both are public.

**Index:**
- No highlighter plates on headings (a phrase on a coloured rounded box): it is a client's style, not the studio's (owner, 2026-10-22).
- Read a reference site's own data (widget JSON, `__NEXT_DATA__`) before its pixels: the recording shows the result, the data shows the mechanism; and serve a static build with clean URLs when probing, or the `.html` becomes a route param (baseline 59 HTML files, 2026-10-22).
- GA4 counts only visitors who accept the banner, so the site keeps its own cookie-free visit log: `src/analytics/visitLog.js` beacons every route view to `/api/visit` (`netlify/functions/visit.mjs`), Blobs store `site-visits`, read with `npm run visits --…
- A site whose design is scroll motion gets a recorded scroll (`longVideo`), because a full-page screenshot of a pinned section is a blank stretch.
- A case-study refresh re-measures BOTH sides on the same day, and a full-page capture scrolls the page through first.
- One topic, one post; one label, one category; a rewrite carries an `updated` date.
- An image ships at the size it is shown: team photos are 144px squares for a 72px box, and the case-study band has a 700w sibling (`long-700.webp`) in a `srcset`; `scripts/check-media.mjs` (prebuild) fails the build when any referenced or derived media file…
- Each service has a cost guide on the journal, and its pricing page links it (`costGuide: { slug, label }` per service in `pricingData.json`, rendered in `PricingGuide`'s outro).
- `public/sitemap.xml` and `public/llms.txt` are both generated on prebuild from the data files, and the sitemap's `lastmod` is per page.
- Phones read at 16px and tap at 44px: `body` keeps the browser's 16px at every width, reading paragraphs carry a 1rem phone floor, menu/footer/consent targets are 44px on touch, and a pricing board's cells never drop under 12px (micro-labels 10px).
- Titles stay at or under 60 characters and descriptions at or under 160, on every built page; the rules live once in `src/utils/seoText.js` (`brandTitle`, `clampAtWord`, `TITLE_MAX`, `DESC_MAX`), shared by the pages and `scripts/add-post.mjs`.
- Every page-level JSON-LD node points at the site's entities by `@id` (`src/utils/schemaIds.js`): `publisher`, `provider` and `creator` are `{"@id": "…/#org"}`, a blog author on the team is a Person with `@id` `…/#<name-slug>` and `url` `/about`, and…
- Every blog post carries one service link and one case-study link in its text, and every case study links the service pages it was sold under: `servicePages` in `projects.json` (slugs from `services.json`), rendered in the case page's top bar beside "All…
- Unsourced claims, second sweep (fix 6, 2026-10-09): a Lighthouse number is labelled Lighthouse, never "Google score", and a source you cannot read in the fetched HTML is not a source you can cite.
- Under React 19 a Suspense boundary around the route Outlet turns every SSG page into a hidden-body page: `<main>` ships the fallback, the content sits in `<div hidden id="S:0">` after the footer, and an inline `$RC` script moves it into place.
- Blog paragraphs and list items carry inline links as `[label](url)` (`src/components/blog/inlineLinks.js`); the url is root-absolute or https, anything else is left as literal text and `add-post.mjs` rejects it.
- Case-study media tiles render in the static HTML and only drop out on image error (`useImageFailed` in `CaseStudyPage.js`); they never wait for a client-side preload.
- Hashed `/assets/*` are cached for a year (`netlify.toml`, `immutable`); everything else keeps Netlify's `max-age=0, must-revalidate`.
- Contact forms post to `/api/contact` (`netlify/functions/contact.mjs`), never to EmailJS from the browser: only a server sees the sender's real IP.
- A "build unchanged" gate must normalise what the build randomises, and a dead-code sweep must follow the orphans one hop out.
- Vite 8 + React 19 (2026-10-07): three traps, none of which fails loudly.
- Serve local builds for Chrome probes on a port Chrome allows: 5060/5061 (SIP), 6000, 6665-6669 and others are on its unsafe-port list.
- The blog has a second committer: `.github/workflows/scheduled-posts.yml` pushes straight to `main` as `scs-scheduler` every day at 14:00 UTC, so fetch and rebase before touching `posts.json`, and a scheduled post with an empty `coverImage` ships the…
- On an iPhone the page's html/body background IS the phone's chrome, and three mobile-only defects hid behind desktop testing.
- zsh does not word-split an unquoted `$VAR`, so ffmpeg flags kept in a string variable arrive as ONE argument.
- A container that is `aria-hidden` hides every real link a caller later puts inside it.
- Capturing a live client site for a preview: phones need a real phone user agent, late widgets need injected CSS, and a full-page screenshot lies about the footer.
- Every number on /about is read from projects.json, never typed.
- A stock component with a per-frame loop gets the house changes before it ships: iso layout effect, visibility gate, local SCSS.
- A component that draws its own cursor must be listed in `CursorComponent.js` `OWN_CURSOR_ZONES`, or the global dot wraps it first.
- In a Perl `s///` replacement, `$1{...}` is a HASH lookup, not "group 1 then a brace" — write `${1}{" "}`.
- To animate an element whose `transform` another system already writes, use the CSS individual properties (`scale`, `translate`, `rotate`) plus `opacity` — they compose with `transform` instead of replacing it.
- When GSAP claims a CSS-centred transform, claim the centring too: `xPercent: -50`, not 0.
- An entrance for first-screen content on an SSG route is a CSS keyframe from first paint, not a JS reveal — and "the animations don't run" usually means everything was already in view.
- Blog posts carry the same sourcing law as case-study metrics: an industry statistic with no source gets deleted, not softened.
- `python3 scripts/ai-writing-scan.py` after a build is a standing check for new copy
- Titled cards rendered under a page `<h1>` must not skip heading levels.
- No em dashes in anything that renders — owner rule, 2026-09-02, swept to zero.
- [historical] A remainder-1 home grid promoted the OLDEST project to a double-size finale — the spotlight slot is whatever sits LAST in `projects.json`.
- A client logo for the marquee is cut by `scripts/cut-client-logos.py`, not hand-exported — a hand-made one shipped as the only opaque asset in the set.
- Lighthouse splits `--chrome-flags` on whitespace, so a flag whose VALUE contains a space silently never reaches Chrome.
- A case study's capture viewport is an editorial choice and must not flatter the rebuild.
- No page h1 uses the display face since 2026-09-26 (owner: "I love this header, let's normalise the rest"); every page hero is the `_page-head.scss` pattern.
- Dead-code sweeps: prove death, then prove the removal changed nothing.
- A `! grep -q` sweep that flags ~100% positives is a broken sweep, not a dead codebase.
- A licensed component does NOT license the assets it references — verify font/asset provenance separately.
- A third-party/non-critical resource loaded in the LCP window can gate LCP even when the LCP element itself isn't blocked — defer it past LCP.
- `React.lazy` code-splits but does NOT defer — rendering the lazy component fires the import at hydration.
- Animation loops: batch reads-then-writes, gate by visibility+input, stop on convergence.
- Headless verification: `scrollIntoView` is a silent no-op under `scroll-behavior: smooth`
- Fonts: self-host, latin-subset woff2, `font-display: swap`, preload ONLY the hero face.
- [historical] typed.js / cycling-text slots need a reserved width (ch units for monospace) or they shift layout once content paints early enough to be measured.
- `netlify deploy` BUILDS by default (CLI v17+) and injects the site's env vars — drafts are faithful to prod, and your local `build/` gets overwritten by that env-injected build.
- Verify a library's integration story in `node_modules`, not from training data.
- vite-react-ssg injects jsdom globals before rendering — a build that doesn't crash is NOT proof of SSR-safety.
- CJS deps imported with named ESM imports must be in `ssr.noExternal`.
- Never render CSS as a JSX text child of `<style>` — use `dangerouslySetInnerHTML`.
- No browser globals at module scope or in first-paint render paths — SSG renders in Node.
- Route-variable head tags live ONLY in `src/components/util/Seo.js` — never in `index.html`.
- `public/sitemap.xml` is generated — never hand-edit.
- One `h1` per page; reusable sections take a `headingTag` prop.
- [historical] When a breakpoint changes a component's layout mode, re-place its absolutely-positioned decorations.
- Every text section caps at `$max-width` (1200px, `_variables.scss`), centered.
- ScrollTrigger `once:true` + already-past start: do NOT assume whether `onEnter` fires at creation — instrument and count.
- [historical] A scroll reveal must never be able to leave content invisible.
- `repos` on a project is a PUBLIC-visibility claim — a private repo renders a 404 to visitors while looking perfect to you.
- Before making any repo public, audit it for CLIENT-CONFIDENTIAL data, not just credentials — and audit the full history, since going public exposes every commit, not HEAD.
- Data-driven tiles render conditionally — never ship an empty placeholder box.
- Vite does NOT rewrite `url()` asset refs pulled in through a Sass `@import`.
- Verify UI rendering with real pixels, not computed styles.
- Two live GSAP tweens on the same property of the same target: the one created LAST wins every frame, silently.
- A bare `1fr` grid track is `minmax(auto, 1fr)` — its floor is the column's min-content, so a multi-column grid of text overflows its container the moment one cell's longest word or label is wider than its share.
- A CSS percentage transform poisons GSAP `xPercent` tweens — `gsap.set({x: 0, xPercent: …})` when taking over a CSS-positioned element.
- On a mixed light/dark SPA, a page that fades in must sit on a backdrop matching its own theme.
- Overlapping/colliding letters that CSS can't fix = bad glyph ADVANCES in the font, not a CSS bug.
- `security.txt` (`public/.well-known/security.txt`, RFC 9116) has an `Expires` date that MUST be bumped before it passes — a past `Expires` invalidates the whole file (scanners reject it).
- SCSS `$variables` don't cross `@use` module scope — export shared tokens as `:root` custom properties.
- The CSS-percentage-transform poison strikes on the FIRST new-axis tween, even years after the original code shipped.
- motion/react's `initial="hidden"` is SERVER-RENDERED — whileInView entrances bake `opacity:0` into SSG HTML.
- [historical] typed.js is PINNED to 2.x (MIT) — v3.0 relicensed to GPL-3.0 with paid commercial tiers.
- An occluded automation window freezes CSS transitions AND the GSAP ticker — only END states are verifiable agent-side.
- motion/react `whileInView` with a `viewport.amount` threshold STRANDS tall sections that can't clear the threshold on load — the taller the section, the more absolute scroll must be in view.
- Every package imported at runtime must be declared in `dependencies` — transitive hoisting is not a declaration.
- Chunk placement is a per-build property — verify it on the FINAL artifact, never the instrumented one, and treat entry-chunk pinning as load-bearing.
- Enumerate affected surfaces by COMPONENT, then map to paths — a path census undercounts when one component serves several routes.
- CLS culprit rows are attributions, not independent components.
- Asset-hash comparison is a SAME-ENVIRONMENT method — scope it or it silently loses its meaning.
- Adding a project to `projects.json` has three unwritten constraints — check all three, because none of them fails loudly.
- Case-study prose has a house density — measure the new page against the existing ones before shipping it, don't eyeball it.
- Route-count verification: count emitted files (`find build -name '*.html' | wc -l`), never grep the build log
- A new project `type` must be added to `src/data/projectGroups.js` `GROUPS` (one definition for the home index AND `/projects`, since the 2026-09-27 redesign), or both grow a lone fourth "More work" column.
- A case-study `metric` is a published claim about a client's business — every one needs a source you can point at, and "it was already on the site" is not one.
- CSS transitions must not cover properties GSAP writes per-frame — the transform-owner rule extends to width/height/any prop.
- `usePageHeaderReveal` may be called ONCE per page — its first-load detection lives in MODULE-level latches, so a second call on the same page silently inverts the behaviour it exists to provide.
- Web video for the site is encoded LIMITED-range BT.709 yuv420p, and playback is verified in a real browser by frame count, never by ffmpeg.
- Chrome will not lay out a window narrower than ~500px, so a 390px `--window-size` screenshot (headless) or MCP `resize_window` is a 500px layout cropped to 390, and every paragraph "overflows" by 110px.
- On the home route the header is `display:none` while `#hero` intersects the viewport and comes back `position: fixed` once the hero has scrolled past; the hero is a plain `100svh`.
- Third trigger for the CSS-percentage-transform poison: a `gsap.set` that runs while the element is `display:none`.
- Headless Chrome verifies END STATES and scroll-position scrubs; it cannot verify tween TIMING, and neither can the visible automation tab.
- A safety net timed from MOUNT pre-empts every scroll reveal below a hero that holds the visitor; nets are viewport-aware now (`src/animation/armSafetyNet.js`).
- Services are 4 and mirror the hero: Design, Code, AI, Growth. A merged service keeps ONE slug and the retired slugs 301 to it in `netlify.toml`.
- `Squares` (the interactive grid canvas) runs its drift loop only while on screen, and each instance is a full-canvas stroke per frame.
- A transform that moves content toward a clipping edge needs padding equal to its travel.
- The services block is a pinned horizontal pan on desktop only, and the pin, the row layout and the end card share ONE gate: `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`, in both Services.js (`gsap.matchMedia`) and services.scss.
- Live service posters (`src/components/servicePoster/`, 2026-09-11): the SSR SVG IS the poster, and runtime only ever animates away from it.
- A pricing page with tile art compares its packages on ONE board (`src/components/pricing/PackageBoard.js`): rows are deliverables (thumbnail + name), columns are packages, terra dots form a staircase.
- `/projects` is the home index grown into a page (2026-09-27, owner: "re-design and update"): typed groups from `projectGroups.js`, numbered rows with ONE measured figure each, a sticky stage with the real site preview on the right, thumbnails per row on…
- `/testimonials` is one voice at a time (2026-09-27): a stage (pull-quote large, the person, the full review at reading size, the client's site shot and a sourced figure where the review has a case study) and a name list that switches it.
- THIS FILE AND `.audit/
- A repo whose application source is 100% clean can still be unpublishable — `git log -p` includes commit MESSAGES, and docs are where the attack surface actually lives.
- `rsync`/`scp` do NOT honour `.gitignore` — pulling a source tree off a server drags the live `.env` with it.
- Studio social profiles live ONLY in `src/data/social.js`; the `sameAs` mirror in `index.html` is guarded by `npm run check:sameas` on prebuild.
- Nav/service link lists live ONLY in `src/data/navigation.js` — a component-local copy WILL drift.
- The "mobile feels more static than desktop" complaint is usually NOT a perf downgrade — it's that the reactive layer is pointer-only.
- A CSP wildcard host (`https://*.domain.com`) does NOT match the apex (`https://domain.com`) — and a "clean" Report-Only run only proves the flows you exercised.
- Consent Mode v2 + a manual `page_view` loses the ENTRY page of every visitor who accepts — re-send the view on the deny→grant transition.
- Meta Pixel (2026-08-29) is LOAD-ON-CONSENT — a different consent model from GA's, on purpose, and the wiring has three traps.
- Bento media tiles are `aspect-ratio: 4/3` + `object-fit: cover` — anything that must be READ (architecture diagrams, screenshots of text, tables) cannot live in one.
- A meta description built by slicing prose (`description.slice(0, N)`) severs mid-word, and that severed string is what ships to Google and social cards.
- Case-study numbers get pulled from the running artifact at write time, never from the repo README or memory.
- `src/data/projects.json` is hand-formatted (compact single-line objects) and the repo has NO Prettier — `json.dump(...)` reformats all 8 projects into a 346-line diff.
- A `flex` shorthand set for one layout mode governs a DIFFERENT axis after a breakpoint flips `flex-direction` — and `flex-basis` beats a declared `height`/`width` silently.
- Unlinking a repo is not remediation — changing its visibility is.
- A Dependabot bump can sit INSIDE the advisory's own vulnerable range — check the proposed version against the fixed-version boundary before believing the PR fixes anything.
- A Dependabot `ignore` written with `update-types` does NOT stop security updates — use `versions`.
- `npm audit fix --only=prod` PRUNES devDependencies out of `node_modules` — the next build dies on a missing build-time plugin.
- A "this page doesn't match the rest of the site" complaint needs `git log -1` on the suspect file before touching CSS — a shared convention (same color/font on two OTHER recently-touched pages) is not staleness, even if it looks dated next to the newest…
- Copying a card layout from another component means copying its CONTAINER WIDTH, not just the card's own CSS — a `flex: 1 1 auto` child can silently collapse to 0px when a narrower column wraps its siblings onto extra lines.
- A per-section "static vs. animated" complaint is a scope decision, not a bug — settle it with the owner via a scope + priority choice before touching code, then reuse the house pattern that already matches, don't invent a new one.
- A metric value with a heterogeneous, sourced string format (`−94%`, `61 → 100`, `1 in 13`) does not get a digit count-up animation — reformatting it for an animation risks shipping a mid-count value that doesn't match the sourced string, and the…
- `pointer-events: none` INHERITS — anything interactive placed inside `#about .work-wrapper` is dead until it claims `pointer-events: auto` itself.
