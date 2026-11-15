# Service pages: scroll experience plan (2026-11-15)

Goal: the four service pages scroll like the owner's reference recording
(Readymag portfolio page, analysis in `brand-identity-reference.md`).
Status: Phase 1 built on `feat/stage-continuity` (2026-11-15, brand page only, committed, not pushed);
its probe is `scripts/probe-stage.mjs`. Phases 0 (baseline of the other three pages) and 2 to 5 wait on the
owner's verdict. Owner decisions at the bottom.

## 1. The finding

Read from 257 frames of the reference (4 fps, plus 10 fps passes over two
state changes) against a wheel-scroll recording of our live brand page
(`scripts/record-scroll.mjs`, 1440x900).

The reference stage is one unbroken shot. Ours is a slideshow.

| | Reference | Ours (`worlds/ProcessStage.js`) |
|---|---|---|
| Between states | The plate stays put; only its contents change | Art, card, title, sticker all fade to 0 (`at + 0.8`), next fades in at `at + 1` |
| Empty screen | Never | About 30% of each state's scroll is a ghosted or empty field |
| Field color | Flips under the plate in under 0.1 s | 0.3 s crossfade on an empty screen |
| Hand-off | Old content becomes the new (icon shrinks into a toolbar button, next demo builds in the same plate) | None |
| Entrance | Demo arrives full width, still playing, and shrinks into the stage | Stage is already pinned, on the page's own cream |
| During a hold | Demo plays, sticker drifts the full screen height | Nothing moves; `tryHint` runs once, 5 s at most |
| Text card | Slides off one edge, the next slides in from the other, always opaque | Fades with an 80px nudge |

Whole-page rhythm:

| Reference beat | Ours | Gap |
|---|---|---|
| Hero collage, scrubbed | One-screen teaching hero | Owner decision (10-25, 10-27); stays |
| Breath paragraph | None | Missing |
| Pinned billboard + sideways card row | Brand: 3 static marks; others: none | Missing |
| Billboard that names the stage | A 12px "WHAT WE KNOW" label | Missing |
| Stage | See table above | The big one |
| Demo grid, bubbles, circles, pill | Same four sections | Already matched |

## 2. Fixed constraints (owner decisions and house rules that stay)

- Heroes teach and are one screen; no collage, no made-up clients, no heading plates.
- Lessons stay real, interactive demos. A real press, key or focus owns a demo for good.
- Motion that starts by itself and runs over 5 s needs a pause control (WCAG 2.2.2,
  the `.carousel-pause` rule). Motion driven by the visitor's scroll does not.
- Gate stays `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`;
  below it the states stack; reduced motion gets the static page.
- Text never sits where a drawing can run under it; CSS owns colors, GSAP transforms;
  no CSS transition on a property GSAP writes; nothing server-renders `opacity: 0`.

## 3. Phases

### Phase 0. Baseline and a measuring harness (about 1 h)
1. Record all four live pages at 1440x900 and 1024x768; keep the frame sheets.
2. `scripts/probe-stage.mjs`: step through the pin in 40px wheel ticks and log, per tick:
   highest opacity of any art layer, field color, sticker y, the active demo's main value.
3. Targets the new engine must hit:
   - an art layer at opacity 1 on every tick (today: fails on about 30% of ticks);
   - the field finishes changing within 5% of a state's scroll;
   - the sticker's y changes on every tick of a hold;
   - the demo's value changes at least every 3 ticks of a hold.

### Phase 1. Stage engine v2, prototyped on brand (4 to 6 h)
One file drives all four pages: `worlds/ProcessStage.js` plus the stage block in `brandWorld.scss`.
1. **One plate.** A single `.bw-stage__plate` holds every state's Art as stacked layers.
   The plate never fades. The incoming Art covers the outgoing one with a clip-path wipe
   that grows from the center; the outgoing layer stays at opacity 1 until it is covered,
   then goes `visibility: hidden` (so Tab cannot reach it).
2. **Plate morphs.** Where ratios differ (16/10, 4/3, `narrow`), the plate tweens its
   size. A `full` state (brand Type) is the plate growing to the whole stage.
3. **Field hard cut.** Field and ink change in 0.08, timed to the wipe's first frame.
4. **Cards travel.** Outgoing card slides fully off its edge, incoming slides in from the
   other side, opacity 1 throughout.
5. **Counter ticks.** "01 / 05" rolls its digit; the title word swaps on the wipe.
6. **Sticker drifts.** Scrubbed along its edge lane for the whole hold (bottom to top on
   the left, top to bottom on the right). Lanes checked against card and art at 1024 and 1440.
7. **Entrance.** The stage scrolls in as a wide inset plate on the page color; as it pins,
   the plate shrinks to rest while the first field floods in and card and sticker arrive.
   Adds about 60% of a viewport to the pin.
8. **Static HTML.** State 1 is visible by CSS, not only after GSAP runs.
9. Verify: Phase 0 probe, recording side by side with the reference, hydration probe,
   keyboard pass, build checks.

### Phase 2. Scroll runs the demos (4 to 5 h, 20 lessons)
1. During a hold, scroll progress drives the lesson's main control through React events
   (the `tryHint` step builders, seeking by progress instead of by clock): a slider sweeps,
   chips step, a toggle flips at a threshold. Scrolling back runs it backward.
2. User-driven, so no 5 s cap and no pause button. Live regions stay hushed while it runs.
3. A real press, key or focus takes the demo over for good (today's rule).
4. Generic for ranges, chip groups and toggles; custom seek for drag handles
   (`.bw-comp__focal`, `.ww-flow__edge`) and the type tester.
5. `tryHint` keeps the grid, the circles and the heroes. On the stage it runs once only if
   the visitor rests in a state for 2 s.

### Phase 3. The page rhythm around the stage (4 to 6 h, needs copy approval)
1. **Billboard before the stage** on each page: an inset rounded plate, one large line
   that names what the five lessons are. The stage's entrance plate rises out of it.
2. **Breath** between hero and billboard: one paragraph in a screen of air.
3. **Pinned client row** (owner decision 2 below): real case studies for that service from
   `projects.json` `servicePages` (brand 5, web 14, SEO 4, AI 2), name pill over a preview
   tile, sideways pan on the house services gate, last card "All case studies". Replaces
   brand's `ClientMarks`; AI's two projects sit as a static pair, no pan.

### Phase 4. Phones, tablets, reduced motion (about 3 h)
1. Stacked states wear their own field color instead of five cream cards.
2. Each stacked demo is scrubbed by its own pass through the viewport (no pin), so the
   page moves under a thumb. Coarse-pointer gate, per the tap-size rule.
3. Reduced motion: static, as today.
4. iPhone pass in the simulator; iPad at 1024.

### Phase 5. Roll out, verify, record (3 to 4 h)
1. AI, Web, SEO: lane and plate checks per page, probe targets on all four.
2. Standing build checks, `npm test`, `check:us`, hydration one page at a time.
3. Rules into `.audit/rules.md` + one line each in `CLAUDE.md`; `STATUS.md`; summary entry.

Total: about 3 working days. Phase 1 alone shows whether the idea lands.

## 4. Optional, not in the estimate
- **Sticker as proof.** The reference's sticker is a phone video of a person using the
  product. Ours is a second diagram. A real client clip per lesson (captioned, linked to
  its case study, with a pause control) would add the human beat. Needs footage: only one
  project has a `longVideo` today.
- **Hero exit.** The hero's own pieces drift apart at different speeds as it scrolls out.
  Touches the kinds engine's transforms; do last or not at all.

## 5. Owner decisions
1. Order: prototype Phase 1 on the brand page first, judge it in the browser, then continue?
2. Pinned client row on every service page (real case studies), yes or no?
3. Brand's stage opens on cream, the page's own color, so the entrance has no punch.
   Open on a saturated field instead? (Options would come as rendered images.)
4. Sticker: keep the fact plates, now drifting, or start collecting client clips?

## 6. Reproduce the evidence
- Reference frames: `ffmpeg -i "<recording>.mov" -vf "fps=4,scale=480:-1,tile=4x4" sheets/s%02d.png`
- Ours: `STEP=40 node scripts/record-scroll.mjs <url> <out> 1440 900 1`, then the same tile filter on `<out>/list.txt` (concat).
