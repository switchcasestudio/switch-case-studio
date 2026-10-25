import sys
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen

# Source of truth = the full OTF. We fix metrics on a COPY; the original is
# never written. The woff2 subset is regenerated from the fixed OTF afterward.
# NOTE: `fonts-src/` is gitignored (local only) — this repo is public and the
# unsubsetted brand face is not for redistribution. Only the subset woff2 in
# public/fonts/ ships. Clone ≠ has the input; get the OTF from the owner.
IN = "fonts-src/SCS-heading-font-Regular.otf"
OUT = "fonts-src/SCS-heading-font-Regular-fixed.otf"
TARGET_RSB = 27   # right sidebearing in font units. Tuned to the face's own
                  # rhythm: the correctly-scaled glyphs have RSB median ~27
                  # (lowercase ~24). 80 left the fixed glyphs ~3x looser than
                  # their siblings; 27 makes them indistinguishable. Bounds-safe
                  # at any positive value (xMax <= advance still holds).

# Glyph NAMES as they appear in font.getGlyphOrder() (verified), NOT unicode chars.
# A batch transform scaled these outlines ~2.1x but left their advances small, so
# ink spills past the advance (large negative RSB) -> next glyph collides.
BROKEN = ["b", "x", "u", "q", "z", "r",
          "quotedbl", "asterisk", "slash", "question", "bar"]


def fix(in_path, out_path):
    font = TTFont(in_path)
    gs, hmtx = font.getGlyphSet(), font["hmtx"]
    rows = []
    for name in BROKEN:
        if name not in hmtx.metrics:
            print(f"!! {name} not found, skipping")
            continue
        pen = BoundsPen(gs)
        gs[name].draw(pen)
        if pen.bounds is None:            # empty glyph (e.g. space) — leave it
            continue
        xMin, _, xMax, _ = pen.bounds
        old_adv, old_lsb = hmtx.metrics[name]
        # Bounds-based recompute — do NOT trust a uniform *2.1 scale factor.
        new_adv = round(xMax + TARGET_RSB)
        new_lsb = round(xMin)
        hmtx.metrics[name] = (new_adv, new_lsb)
        rows.append((name, old_adv, new_adv, round(xMin), round(xMax), old_lsb, new_lsb))

    print("BEFORE/AFTER (advance + LSB), TARGET_RSB = %d:" % TARGET_RSB)
    print(f"  {'glyph':<12}{'adv old':>9}{'adv new':>9}{'inkXmin':>9}{'inkXmax':>9}{'lsb old':>9}{'lsb new':>9}")
    for name, oa, na, xmn, xmx, ol, nl in rows:
        print(f"  {name:<12}{oa:>9}{na:>9}{xmn:>9}{xmx:>9}{ol:>9}{nl:>9}")

    font.save(out_path)
    print(f"\nsaved {out_path}\n")


def verify(path, tolerance=0):
    """Re-open from disk and assert ink never spills past the advance, across the
    ENTIRE glyph order (surfaces any other glyph hit by the same batch edit)."""
    font = TTFont(path)
    gs, hmtx = font.getGlyphSet(), font["hmtx"]
    offenders = []
    for name in font.getGlyphOrder():
        if name not in hmtx.metrics:
            continue
        pen = BoundsPen(gs)
        try:
            gs[name].draw(pen)
        except Exception as e:
            print(f"  (could not draw {name}: {e})")
            continue
        if pen.bounds is None:
            continue
        _, _, xMax, _ = pen.bounds
        adv, _ = hmtx.metrics[name]
        if xMax - adv > tolerance:
            offenders.append((name, adv, round(xMax), round(xMax - adv)))

    if offenders:
        print(f"FAIL — {len(offenders)} glyph(s) still spill past their advance:")
        print(f"  {'glyph':<12}{'adv':>8}{'xMax':>8}{'overshoot':>11}")
        for name, adv, xMax, over in sorted(offenders, key=lambda r: -r[3]):
            print(f"  {name:<12}{adv:>8}{xMax:>8}{over:>11}")
        return False

    print(f"PASS — all {len(font.getGlyphOrder())} glyphs: xMax <= advance (tol={tolerance})")
    return True


if __name__ == "__main__":
    fix(IN, OUT)
    ok = verify(OUT)
    sys.exit(0 if ok else 1)
