#!/usr/bin/env python3
"""AI-writing tells scan (Wikipedia:Signs_of_AI_writing) over the BUILT site.

Run after `npm run build`:  python3 scripts/ai-writing-scan.py
Reports, for site pages and blog posts separately: AI-vocabulary hits per
1,000 words (with the words), negative parallelisms, participial "…, ensuring"
tails, rule-of-three density, vague attribution, chat-style phrasing, em
dashes / curly quotes / emoji, and heading-level skips. Added 2026-09-02
(REFRESH-1): the first pass found the site clean on every hard tell, one
blog post with a textbook opener, and 8 heading-level skips. Baselines then:
site 1.7 vocab/1k, 14/1k triads (mostly service enumerations); blog 0.7 and
11/1k. Comments are not scanned — this reads what visitors read.
"""
import glob, html, io, re, sys
from collections import Counter

ROOT = 'build'
VOCAB = ['delve','tapestry','testament','pivotal','crucial','vibrant','meticulous','bolster','garner',
  'intricate','interplay','enduring','underscor','landscape','realm','journey','navigat','seamless','robust',
  'leverag','streamlin','elevat','empower','unlock','harness','foster','cutting-edge','game-chang',
  'transformative','holistic','innovative','groundbreaking','renowned','nestled','in the heart of',
  'diverse array','showcas','highlight','emphasiz','enhanc','ensur','valuable insight','insights',
  'commitment to','digital presence','additionally','moreover','furthermore','in conclusion','ultimately',
  'in today','fast-paced','ever-evolving','worth noting','dive into','unpack','embark','look no further',
  'at the end of the day','stands as','serves as','represents a','marks a','functions as','boasts',
  'exemplif','profound','align with','resonate']
NEG = [(r"\bnot only\b.*?\bbut\b", 'not only … but'), (r"\bnot just\b", 'not just'),
       (r"\b(it|this|that)['’]s not\b.*?,\s*(it|this|that)['’]s\b", "it's not …, it's …"),
       (r",\s*not\s+(a|an|the|just|only|from|to)\b", ', not X'), (r"\brather than\b", 'rather than')]
PART = r",\s*(ensuring|highlighting|underscoring|emphasizing|reflecting|symbolizing|contributing to|fostering|enhancing|showcasing|demonstrating|making it|allowing|enabling|helping)\b"
VAGUE = [r"\bexperts?\b", r"\bstudies (show|suggest)", r"\bresearch (shows|suggests)", r"\bindustry (reports|leaders)", r"\bobservers\b", r"\bmany businesses\b"]
SYCO = [r"\bgreat question\b", r"\bi hope this helps\b", r"\bcertainly[,!]", r"\blet me know\b", r"\bas an ai\b"]
RULE3 = r"\b\w[\w'’-]*(?:\s\w[\w'’-]*){0,3},\s\w[\w'’-]*(?:\s\w[\w'’-]*){0,3},\s(?:and|or)\s\w[\w'’-]*(?:\s\w[\w'’-]*){0,3}\b"
SKIP = ('404.html', 'partners', 'p/')

def text_of(path):
    s = io.open(path, encoding='utf-8').read()
    m = re.search(r'<main[^>]*>(.*?)</main>', s, re.S); body = m.group(1) if m else s
    body = re.sub(r'<(script|style|noscript|svg)[^>]*>.*?</\1>', '', body, flags=re.S)
    body = re.sub(r'</(p|li|h[1-6]|div|section|article|blockquote|dt|dd|tr)>', '\n', body)
    body = re.sub(r'<br\s*/?>', '\n', body)
    t = html.unescape(re.sub(r'<[^>]+>', '', body))
    return re.sub(r'\n\s*\n+', '\n', re.sub(r'[ \t]+', ' ', t)).strip(), body

def snippet(t, m, w=55): return re.sub(r'\s+', ' ', t[max(0, m.start()-w):m.end()+w]).strip()

def scan(pages, label):
    words = sum(len(t.split()) for t, _ in pages.values())
    print(f"\n== {label}: {len(pages)} pages, {words} words ==")
    hits = {}
    for pg, (t, _) in pages.items():
        low = t.lower()
        for v in VOCAB:
            for m in re.finditer(re.escape(v), low): hits.setdefault(v, []).append((pg, snippet(t, m)))
    tot = sum(len(v) for v in hits.values())
    print(f"AI vocabulary: {tot} ({tot/words*1000:.1f}/1k)")
    for v, l in sorted(hits.items(), key=lambda kv: -len(kv[1])):
        print(f"  {v!r} x{len(l)}: {l[0][0]} …{l[0][1]}…")
    for rx, name in NEG:
        n = sum(len(re.findall(rx, t, re.I)) for t, _ in pages.values()); print(f"{name}: {n}")
    print("participial tails:", sum(len(re.findall(PART, t, re.I)) for t, _ in pages.values()))
    tri = sum(len(re.findall(RULE3, t)) for t, _ in pages.values()); print(f"rule-of-three: {tri} ({tri/words*1000:.1f}/1k)")
    print("vague attribution:", sum(len(re.findall(rx, t, re.I)) for t, _ in pages.values() for rx in VAGUE))
    print("chat-style:", sum(len(re.findall(rx, t, re.I)) for t, _ in pages.values() for rx in SYCO))
    print("em dashes:", sum(t.count('—') for t, _ in pages.values()), "| curly quotes:", sum(len(re.findall(r'[“”‘’]', t)) for t, _ in pages.values()),
          "| emoji:", sum(len(re.findall(r'[\U0001F300-\U0001FAFF]', t)) for t, _ in pages.values()))
    skips = []
    for pg, (_, body) in pages.items():
        lv = [int(x) for x in re.findall(r'<h([1-6])\b', body)]
        skips += [(pg, f'h{a}->h{b}') for a, b in zip(lv, lv[1:]) if b > a + 1]
    print("heading-level skips:", len(skips), skips[:5])

site, blog = {}, {}
for p in sorted(glob.glob(f'{ROOT}/**/*.html', recursive=True)):
    rel = p[len(ROOT)+1:]
    if rel.startswith(SKIP): continue
    (blog if rel.startswith('blog/') else site)[rel] = text_of(p)
if not site: sys.exit('no build/ output — run npm run build first')
scan(site, 'SITE PAGES'); scan(blog, 'BLOG POSTS')
