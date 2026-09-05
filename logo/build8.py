#!/usr/bin/env python3
"""TAPE drawn as overlapping strips of tape.

The A and P already read as taped because the crossbar and bowl cross other
strokes and leave a visible box. T and E, as plain outlined glyphs, have no
crossing at all. Building every letter from strips gives all four the same
overlap detail.
"""
import pathlib

H, W_STROKE = 100.0, 27.0     # cap height, strip width
INK = "#f7f3ea"
BG = "#0d0b0a"

def rect(x, y, w, h, sw, rot=0, cx=0, cy=0):
    t = f' transform="rotate({rot} {cx} {cy})"' if rot else ""
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
            f'fill="none" stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round"{t}/>')

def poly(pts, sw, rot=0, cx=0, cy=0):
    t = f' transform="rotate({rot} {cx} {cy})"' if rot else ""
    p = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return f'<polygon points="{p}" fill="none" stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round"{t}/>'

def letters(sw, tilt=0):
    """Returns (svg, width) for each letter, as overlapping strips."""
    w = W_STROKE
    def t_(i): return (tilt * ((i % 3) - 1)) if tilt else 0

    T_w = 66
    T = (rect(0, 0, T_w, w, sw, t_(0), T_w/2, w/2) +
         rect((T_w-w)/2, 0, w, H, sw, t_(1), T_w/2, H/2))

    A_w = 74
    A = (poly([(1, H), (1+w, H), (A_w/2+9, 0), (A_w/2-9, 0)], sw, t_(2), A_w/2, H/2) +
         poly([(A_w-1-w, H), (A_w-1, H), (A_w/2+9, 0), (A_w/2-9, 0)], sw, t_(0), A_w/2, H/2) +
         rect(11, 60, A_w-22, 21, sw, t_(1), A_w/2, 70))

    P_w = 64
    P = (rect(0, 0, w, H, sw, t_(2), w/2, H/2) +
         rect(w*0.7, 0, P_w-w*0.7, 54, sw, t_(0), P_w/2, 27) +
         rect(w*0.7+w, w, P_w-w*0.7-w*2, 54-w*2, sw*0.85, t_(0), P_w/2, 27))

    E_w = 60
    E = (rect(0, 0, w, H, sw, t_(1), w/2, H/2) +
         rect(0, 0, E_w, w, sw, t_(2), E_w/2, w/2) +
         rect(0, (H-w)/2, E_w-8, w*0.86, sw, t_(0), E_w/2, H/2) +
         rect(0, H-w, E_w, w, sw, t_(1), E_w/2, H-w/2))

    return [(T, T_w), (A, A_w), (P, P_w), (E, E_w)]

def word(sw=3.0, tilt=0, gap=13):
    parts, x = [], 0.0
    for svg, lw in letters(sw, tilt):
        parts.append(f'<g transform="translate({x:.1f},0)">{svg}</g>')
        x += lw + gap
    return "".join(parts), x - gap

VARIANTS = [
    ("A", "Square overlaps", dict(sw=3.0, tilt=0),
     "Every letter built from strips. Where two cross, the overlap shows — the same box the A already had."),
    ("B", "Hand-applied", dict(sw=3.0, tilt=1.6),
     "Same strips, each rotated a degree or two, like tape stuck on by hand rather than printed."),
    ("C", "Heavier line", dict(sw=4.4, tilt=0.9),
     "Thicker stroke and a slight tilt — holds together better at small sizes."),
]

out = pathlib.Path(__file__).parent
(out / "svg8").mkdir(exist_ok=True)

def wrap(body, w, h, pad, bg=None):
    r = f'<rect width="{w+pad*2:.0f}" height="{h+pad*2:.0f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w+pad*2:.0f} {h+pad*2:.0f}" '
            f'width="100%" style="display:block">{r}'
            f'<g transform="translate({pad},{pad})">{body}</g></svg>')

cards = []
for code, name, kw, note in VARIANTS:
    body, w = word(**kw)
    svg = wrap(body, w, H, 16, BG)
    (out / "svg8" / f"tape-{code}.svg").write_text(svg)
    cards.append(f"""
<section class="d">
  <div class="h"><span class="id">{code}</span><h2>{name}</h2><p>{note}</p></div>
  <div class="r"><div style="width:360px">{svg}</div></div>
  <div class="r"><span class="l">Small</span><div style="width:150px">{svg}</div></div>
</section>""")

# the current version, for comparison
cur = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 128" width="100%" style="display:block">'
       f'<rect width="290" height="128" fill="{BG}"/>'
       f'<text x="16" y="98" font-family="Inter" font-size="100" font-weight="700" '
       f'letter-spacing="-4.5" fill="none" stroke="{INK}" stroke-width="2.1" stroke-opacity="0.85">TAPE</text></svg>')

html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>Taped TAPE</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>
 *{{box-sizing:border-box;margin:0;padding:0}}
 body{{background:{BG};color:{INK};font-family:Inter,sans-serif;padding:46px 40px}}
 h1{{font-size:26px;letter-spacing:-.03em}}
 .sub{{color:#ada496;margin-top:8px;font-size:14.5px;max-width:78ch;line-height:1.6}}
 .grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:34px;max-width:1180px}}
 .d{{border:1px solid rgba(255,236,214,.14);border-radius:16px;overflow:hidden}}
 .h{{padding:18px 22px;border-bottom:1px solid rgba(255,236,214,.14)}}
 .id{{font-size:10.5px;letter-spacing:.28em;color:#e07f57}}
 .h h2{{font-size:17px;margin-top:5px}}
 .h p{{font-size:12.5px;color:#ada496;margin-top:6px;line-height:1.5}}
 .r{{padding:24px 22px;display:flex;align-items:center;gap:18px;
     border-bottom:1px solid rgba(255,236,214,.09)}}
 .r:last-child{{border-bottom:none}}
 .l{{font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:#94897c;width:46px;flex:none}}
</style></head><body>
<h1>TAPE, drawn as tape</h1>
<p class="sub">The A and P read as taped because their crossbar and bowl cross another stroke and leave a
visible box. T and E, as plain outlined glyphs, never cross anything. Here every letter is built from
overlapping strips, so all four get that detail.</p>
<div class="grid">
<section class="d">
  <div class="h"><span class="id">NOW</span><h2>Current</h2><p>Inter 700, outlined. Only A and P show any overlap.</p></div>
  <div class="r"><div style="width:360px">{cur}</div></div>
  <div class="r"><span class="l">Small</span><div style="width:150px">{cur}</div></div>
</section>
{''.join(cards)}
</div></body></html>"""
(out / "explore-tape.html").write_text(html)
print("wrote explore-tape.html and", len(VARIANTS), "SVGs in logo/svg8/")
