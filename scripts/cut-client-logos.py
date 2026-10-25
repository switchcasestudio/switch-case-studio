#!/usr/bin/env python3
"""Cut client logos for the "Trusted by" strip out of the cover tiles.

For every project in src/data/projects.json that is `featured` and not a
`studioProject`, open its `coverTile` (a logo centered on black), key the
BACKGROUND black to alpha by flood-filling from the four corners (so black
ink inside a logo, e.g. text on the JO-11 disc, survives), crop to the ink,
pad 4%, and save a 96px-tall 2x WebP with alpha to public/clients/<slug>.webp.
Then set `clientLogo` / `clientLogoAlt` on the project (ClientStrip.js renders
the image when present, the text name otherwise). Needs Pillow:
  python3 -m venv .venv && .venv/bin/pip install pillow && .venv/bin/python scripts/cut-client-logos.py
Added 2026-09-03 (owner: real marks in the marquee, not names).
"""
import json, io, sys
from PIL import Image, ImageDraw

DATA = 'src/data/projects.json'
SENT = (255, 0, 255, 255)
projects = json.load(open(DATA))
text = io.open(DATA, encoding='utf-8').read()
for p in projects:
    if not (p.get('featured') and not p.get('studioProject')): continue
    im = Image.open('public' + p['coverTile']).convert('RGBA'); W, H = im.size
    for xy in ((0, 0), (W-1, 0), (0, H-1), (W-1, H-1)):
        if im.getpixel(xy) != SENT: ImageDraw.floodfill(im, xy, SENT, thresh=40)
    px = im.load()
    for y in range(H):
        for x in range(W):
            if px[x, y] == SENT: px[x, y] = (0, 0, 0, 0)
    bbox = im.getbbox()
    if not bbox: print('no ink:', p['slug']); continue
    x0, y0, x1, y1 = bbox; padx = int((x1-x0)*0.04)+2; pady = int((y1-y0)*0.04)+2
    crop = im.crop((max(0, x0-padx), max(0, y0-pady), min(W, x1+padx), min(H, y1+pady)))
    cw, ch = crop.size; out = crop.resize((max(1, round(cw*96/ch)), 96), Image.LANCZOS)
    dest = f"public/clients/{p['slug']}.webp"; out.save(dest, 'WEBP', quality=90, method=6)
    print(f"{p['slug']:28} {out.size[0]}x{out.size[1]}  {dest}")
    if not p.get('clientLogo'):
        line = f'    "coverTile": "{p["coverTile"]}",\n'
        assert text.count(line) == 1, p['slug']
        text = text.replace(line, line + f'    "clientLogo": "/clients/{p["slug"]}.webp",\n    "clientLogoAlt": "{p["title"]} logo",\n')
io.open(DATA, 'w', encoding='utf-8').write(text); json.loads(text)
