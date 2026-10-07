#!/usr/bin/env python3
"""Cut the 600w sibling of every case-study preview.

/projects shows each project's `preview` (1200 x 750) on the desktop stage and,
under 1024px, as a thumbnail on the row. The thumbnail is `preview-600.webp`,
derived from the `preview` path by string replacement in CaseStudiesPage.js, so
a project whose sibling is missing renders an EMPTY thumbnail on phones while
looking perfect on a desktop (the trap the retired coverTile -256/-512 srcset had).

Run after adding a project:  .venv/bin/python scripts/cut-preview-thumbs.py
Existing siblings are left alone unless --force is given.
"""
import glob
import os
import sys

from PIL import Image

FORCE = "--force" in sys.argv
ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "projects")

made = kept = 0
for src in sorted(glob.glob(os.path.join(ROOT, "*", "preview.webp"))):
    dst = src.replace("preview.webp", "preview-600.webp")
    if os.path.exists(dst) and not FORCE:
        kept += 1
        continue
    im = Image.open(src).convert("RGB")
    if im.size != (1200, 750):
        sys.exit(f"{src}: expected 1200x750, got {im.size[0]}x{im.size[1]}")
    im.resize((600, 375), Image.LANCZOS).save(dst, "WEBP", quality=82, method=6)
    made += 1
    print(f"{os.path.getsize(dst):7d}  {os.path.relpath(dst)}")
print(f"{made} written, {kept} kept")
