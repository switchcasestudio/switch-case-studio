# Brand Identity world: reference analysis

Source: owner's 64 s screen recording of https://readymag.com/readymag/portfolio/ (2026-10-06, 3530x2240, 60 fps),
read as 129 frames at 2 fps plus 10 fps passes over the hero and the feature stage. The live page
is a Readymag project (`viewer.js`), so nothing is copyable; the principles below are read from
the pixels. Palette, type and voice stay SCS; only the mechanics travel.

## 1. What the recording shows, in order

| t (s) | Section | What happens |
|---|---|---|
| 0 | Hero | White field. Centred two-line headline, one word on a yellow plate, outline CTA. Tiles already peek in from every edge. |
| 0.1–0.6 | Hero flood | First scroll: 25–30 tiles sweep in from the edges and OVER the headline. The headline is not protected; by 0.5 s it is buried. |
| 0.6–7 | Collage pan | Tiles sit in three horizontal bands. Bands pan in alternating directions, scrubbed to scroll (a small scroll moves a tile most of the way across), with lerp so motion lags the wheel. 8–12 tiles on screen at once, 30–60 % overlap, mixed z-order. No idle drift: when the wheel stops the tiles stop. |
| 7–8 | Breath | One grey centred paragraph and a full screen of white. |
| 8–17 | "See how creatives…" | Yellow rounded billboard (inset from the page edge, ~24 px radius). Headline in blue with the key phrase on a blue plate. Under it a card row: name pill (orange / blue alternating) over a yellow-outlined preview. Billboard pins; page scroll pans the row horizontally; last card is an orange "Explore more". |
| 17–20 | Breath + billboard | Grey paragraph, then a blue billboard, white text, highlight phrase in orange on yellow. |
| 20–44 | Feature stage | One pinned viewport, five states. Per state: the field colour crossfades (yellow → violet → orange → green → blue, ~0.3 s, an olive mid-frame proves it is a real crossfade), a central product mockup fades/scales out and the next in, a white text card jumps to the opposite side, a 9:16 phone video with a caption slides in from the opposite corner. Inside each mockup the demo runs on its own clock (values tick 60 → 72 → 86, swatches appear, a layout reflows 320/768/1024). Each state holds 4–6 s of scroll. |
| 44–46 | Feature grid | Orange field, white cards: a blurred 3D stack, a password field, a logo row, a "drag me" square, a "Hover me" custom-cursor card. The demos are the content. |
| 46–48 | Testimonials | Blue billboard, white speech-bubble pills scattered, one emoji bubble. |
| 48–52 | Plan | White card, two giant circles as buttons (yellow, blue). Hover flips a circle to orange. |
| 52–57 | Help | Grey field, 2x2 tiles with blobby icon-art (gear, scallop, browser window). |
| 57–64 | CTA + footer | One full-width pill button, hover flips blue to yellow. Dark footer. |

Persistent: floating pill nav at the top, orange "Sign up" pill, default cursor everywhere except the custom-cursor demo.

## 1b. What the page actually does (read from its own data, 2026-10-22)

The project's widget data is public (`/api/viewer/project/5445736/widgets?pageId=…`, 7 pages, 236 widgets). Browsed live too (scroll + hover). The truth behind the pixels:

- **236 widgets:** 84 shapes (CSS-drawn vectors), 59 texts, 39 pictures, 28 videos, 16 buttons, 1 "shots" (61-frame PNG sequence scrubbed by scroll, 1600 px frames, 51 MB).
- **123 animated widgets, 66 animations:** 63 `scroll`, 2 `load`, 1 `hover`. Scroll animations are per-widget `move` paths (dx, dy), some two-step, one bezier curve; all `ease-both`; speed 0.5 / 1 / 2 / 10 (10 = snap); `delay_px` staggers them (300, 950, 1000, 1450, 2700, 3990 px).
- **The hero collage is per-tile diagonal paths, not rows.** Example: dx −883 dy −421 at speed 1.5, then dx −786 dy −964 at 0.5. Each of ~25 tiles has its own vector and speed. No pinning.
- **The "pinned stage" is 67 `fixed_position` widgets.** Each feature's pieces are `position: fixed` and fade in at a `delay_px` (speed 10), drift 198 px, fade out (speed 10). The colour "crossfade" is one fixed background fading over another. No pin, no ScrollTrigger equivalent, just fixed elements with scroll-scrubbed opacity + move.
- **Every mockup demo is a muted video file** (500×277, 553×310, 1008×565; the phone stickers are 99×170 and 212×120 9:16). Not Lottie, not SVG. The owner's "interactive SVG" read is the 84 vector shapes moving on scroll around those videos.
- **Hover is almost absent:** one hover animation (opacity swap) on the whole page; the colour flips are button hover styles. The gear in "Getting Started" is a `load` rotate 360° over 8 s, looped.
- **Mobile:** every widget has a `viewport_phone_portrait` variant; the collage is re-laid out, not shrunk.

So the recipe is: fixed-position layers + scroll-scrubbed move/opacity per element + muted video tiles + many flat vector shapes. Everything else is the designer's eye.

## 2. The principles

1. **Everything is a plate.** Every unit sits on a flat, saturated, rounded rectangle. No shadows, no gradients, no borders (one exception: the yellow outline on preview tiles). Depth comes from overlap, never from shading.
2. **Sections are cards on a canvas.** Each section is a full-width rounded rect with its own field colour, inset by a gutter from the page edge. The page background itself changes (white → yellow → grey) so blocks read as objects laid on a table, not as stripes.
3. **One phrase per headline wears a plate.** Headline in the field's accent colour; the key phrase on a contrasting plate in a third colour. Two colours per headline, never more.
4. **Collage, not grid.** Tiles are real artefacts at their native aspect ratios (type specimens, photos, screenshots in browser chrome, a vertical video, a giant single glyph, a text block, a sticker). Overlap is a feature. Position is a function of scroll.
5. **Scroll is the clock.** Hero = scrubbed pans. Card row = pinned horizontal pan. Feature stage = pinned, discrete states, crossfaded. Everything else is static. The only motion not driven by scroll is inside a demo (a mockup's own loop, a video).
6. **Discrete states, soft edges.** The stage never tweens continuously between features; it switches, and the switch is a 0.3 s crossfade of colour, a fade/scale of the artefact, a slide of the card and the sticker. Clear beats, soft transitions.
7. **Alternate sides.** Text card left, then right. Sticker video bottom-left, then top-right. The eye is pulled across the stage on every state change.
8. **Hover flips colour.** Interactive = a plate that swaps its fill on hover. No scale, no shadow, no underline animation.
9. **Density breathes.** Max density (hero) → one paragraph in a screen of air → billboard. Whitespace is a beat, not a gap.
10. **Media lives in tiles.** Video is never a background; it is a tile or a sticker. The vertical 9:16 sticker with a caption is the signature media unit.
11. **Type is one grotesk at two sizes.** Display (~56–64 px, medium) and body (14–16 px). Italics and exotic faces only inside specimens, i.e. as content.
12. **Six flats.** Five saturated fields + white + black + one grey. Never tinted, never translucent.

## 3. Mapped to SCS

| Reference | SCS |
|---|---|
| Fields: yellow, blue, orange, violet, green | `$blue-color #1748ef`, `$orange-color #ff834a`, lavender `$g5 #dab8ff` / `$g6 #d99cff`, `$white-color #fef7ed` (cream), `$black-color #303334` (ink), `$grey-color #e7eced` |
| Page background white → yellow → grey | cream → lavender tint `$g7 #f0d7ff` → grey |
| Highlight plate | lavender plate with ink text on light fields; orange plate with cream text on ink |
| Graphik | the site's body grotesk; the display face stays out of h1s (rule, 2026-09-26) |
| Pinned stage, scrubbed pans | GSAP + ScrollTrigger, same gate as the services pan: `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`, in JS and SCSS |
| Mockup demos | SSR SVG posters animated away from their static state (`servicePoster` pattern) |
| Custom cursor demo | add the zone to `CursorComponent.js OWN_CURSOR_ZONES` |
| Yellow preview outline | lavender outline |

Mobile: the whole thing is scroll-driven, so it survives touch. Below 1024 the pins drop (house gate) and the stage becomes a vertical stack of states; the hero collage keeps its pan via scroll only.

## 4. The page: `/services/brand-identity`

Owner, 2026-10-22: this page is exempt from the general page rules (page-head h1, one-reveal restraint). It exists to show virtuosity in graphic design. SCS palette stays, with tweaks. Assets are made here: SVG (interactive, house `usePosterEngine` idiom) and Remotion renders for the video tiles.

0. **Hero.** The h1 sits in the collage and the tiles run over it on first scroll (the reference's signature move).
1. **Collage.** ~25 tiles, each on its own scroll-scrubbed diagonal path (dx, dy, speed), GSAP `scrub` with a short lag. Tile types: live SVG posters (the `InRegister` idiom: the cursor changes them), type specimens, colour systems, stationery, a 9:16 Remotion video sticker, a giant glyph, one text block.
2. **Breath.** One paragraph, a screen of air.
3. **Concept row.** Pinned billboard, horizontal pan of the concept brands (name pill + outlined preview), last card → `/projects`.
4. **Process stage.** Fixed-layer stage, five states (Discovery, Mark, Type, Colour, System): field colour fades over the last, central artefact is a live SVG or a Remotion loop, text card alternates sides, sticker video alternates corners. Built as fixed layers with scrubbed opacity/move, exactly as the reference does it, not as a pin.
5. **Deliverables grid.** Cards whose demos are the deliverables: a mark that re-registers under the cursor, a sticker you drag, a custom-cursor card, a gear that turns on load.
6. **Testimonials.** Bubbles from `testimonials` data.
7. **Two circles.** "Start a brand" → `/contact`, "See the work" → `/projects`. No price on the page (owner); pricing stays one nav click away.
8. **Pill CTA + footer.**

Engine: GSAP + ScrollTrigger (`scrub`), fixed layers, `usePosterEngine` for every interactive SVG, `prefers-reduced-motion` → static SSR state. Lives at `src/components/brandWorld/`; route `services/:slug` in `routes.js`, `getStaticPaths` from `services.json`.

## 5. Costs and risks

- **Assets are the long pole.** ~30 new concept pieces across ~5 fictional brands. Nothing else on the page is expensive.
- **SSG.** Tiles must be in the static HTML with CSS positions; GSAP only moves them. No hidden-until-JS content (safety-net rule).
- **CLS and media size.** Every tile ships at displayed size (`check-media.mjs`), aspect ratios declared.
- **The h1 question** above decides whether the collage is a hero or a band.
- **Pointer-only charm.** Hover flips need a touch equivalent (tap toggles) or the phone gets a static page.

Frame sheets: scratchpad `ref/sheets/` (s01–s11 at 2 fps, `hero_fine`, `sticky_01`, `features_fine`).
