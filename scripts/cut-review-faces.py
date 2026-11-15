#!/usr/bin/env python3
"""Cut the reviewers' faces for the service pages' client bubbles (worlds/Bubbles.js).

  python3 scripts/cut-review-faces.py        (needs sips, ffmpeg, cwebp; macOS)

Each review's portrait (testimonials.json `image`, public/images/<name>.<ext>) becomes
public/images/faces/<name>-112.webp: a 112px grayscale square, shown as a 56px circle.
The head takes FILL of the circle's height and sits in its middle, so no circle cuts a
head (owner, 2026-11-15: "a little zoom out ... they are getting cut off"; the first
cut filled the circle and clipped hair and chins). Where that square runs past the
photo, the photo's edge is extended and the extension blurred: smearing alone turned a
textured wall into streaks.

A new reviewer: add a row to HEADS, measured on the portrait as fractions of its
height and width (top of the hair, bottom of the chin or beard, the face's center x),
run this, and look at the result in a circle before committing. check:media fails the
build if a review has no face file.
"""
import json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILL = 0.66
SIZE = 112
# name: (hair top, chin bottom, face center x)
HEADS = {
    'scott': (.15, .86, .50),
    'shay': (.02, .71, .51),
    'ori': (.07, .80, .52),
    'shiran': (.07, .75, .49),
    'sean': (.13, .63, .48),
    'dani': (.03, .52, .48),
    'lior': (.07, .68, .51),
    'yuli': (.03, .57, .57),
}


def run(*cmd):
    subprocess.check_call(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def main():
    reviews = json.load(open(os.path.join(ROOT, 'src/data/testimonials.json')))
    out_dir = os.path.join(ROOT, 'public/images/faces')
    os.makedirs(out_dir, exist_ok=True)
    missing = []
    with tempfile.TemporaryDirectory() as tmp:
        for t in reviews:
            src = t.get('image') or ''
            name = os.path.splitext(os.path.basename(src))[0]
            if name not in HEADS:
                missing.append(f"{t.get('name')}: no HEADS row for {src or '(no image)'}")
                continue
            top, bot, cx = HEADS[name]
            png = os.path.join(tmp, name + '.png')
            run('sips', '-s', 'format', 'png', os.path.join(ROOT, 'public', src.lstrip('/')), '--out', png)
            w, h = map(int, subprocess.check_output(
                ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', png]
            ).decode().strip().split(','))
            side = round((bot - top) * h / FILL)
            x0 = round(cx * w - side / 2)
            y0 = round((top + bot) / 2 * h - side / 2)
            l, t_, r, b = max(0, -x0), max(0, -y0), max(0, x0 + side - w), max(0, y0 + side - h)
            W, H = w + l + r, h + t_ + b
            crop = f"crop={side}:{side}:{x0 + l}:{y0 + t_},scale={SIZE}:{SIZE}:flags=lanczos,format=gray"
            if not (l or t_ or r or b):
                graph = f"[0]{crop}[o]"
            else:
                f = lambda p: max(6, round(p * 0.6))  # how far the blur feathers into the photo
                ramps = []
                if t_: ramps.append(f"clip(({t_}+{f(t_)}-Y)/{f(t_)},0,1)")
                if l: ramps.append(f"clip(({l}+{f(l)}-X)/{f(l)},0,1)")
                if r: ramps.append(f"clip((X-({W}-{r}-{f(r)}))/{f(r)},0,1)")
                if b: ramps.append(f"clip((Y-({H}-{b}-{f(b)}))/{f(b)},0,1)")
                m = ramps[0]
                for x in ramps[1:]:
                    m = f"max({m},{x})"
                e = f"255*{m}"
                sigma = max(10, round(max(l, t_, r, b) * 0.35))
                graph = (
                    f"[0]pad={W}:{H}:{l}:{t_},fillborders={l}:{r}:{t_}:{b}:smear,format=gbrp,split=3[a][b][c];"
                    f"[b]gblur=sigma={sigma}[bl];[c]geq=r='{e}':g='{e}':b='{e}'[m];[a][bl][m]maskedmerge,{crop}[o]"
                )
            cut = os.path.join(tmp, name + '-cut.png')
            run('ffmpeg', '-y', '-i', png, '-filter_complex', graph, '-map', '[o]', '-frames:v', '1', cut)
            dest = os.path.join(out_dir, f'{name}-{SIZE}.webp')
            run('cwebp', '-quiet', '-q', '84', cut, '-o', dest)
            print(f"{name}: {os.path.getsize(dest)} bytes, extended l/t/r/b {l}/{t_}/{r}/{b}px of {w}x{h}")
    if missing:
        print('\n'.join(missing), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
