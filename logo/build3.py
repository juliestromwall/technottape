#!/usr/bin/env python3
"""Round 3. Every direction derives from the site's own rule: substance is
solid, tape is hollow. Single source -> SVG files + comparison sheet."""
import pathlib

BG, INK = "#0d0b0a", "#f7f3ea"
SAGE, OCHRE, TERRA = "#7fae83", "#e6b455", "#e07f57"
F = "Inter, 'Helvetica Neue', Arial, sans-serif"

def solid(t, x, y, size, fill=INK, ls=-0.045, anchor="start", w=700):
    return (f'<text x="{x}" y="{y}" font-family="{F}" font-size="{size}" font-weight="{w}" '
            f'letter-spacing="{ls*size:.2f}" fill="{fill}" text-anchor="{anchor}">{t}</text>')

def hollow(t, x, y, size, stroke=INK, sw=None, ls=-0.045, anchor="start", w=700, op=0.85):
    sw = sw if sw else max(1.0, size * 0.022)
    return (f'<text x="{x}" y="{y}" font-family="{F}" font-size="{size}" font-weight="{w}" '
            f'letter-spacing="{ls*size:.2f}" fill="none" stroke="{stroke}" stroke-width="{sw:.2f}" '
            f'stroke-opacity="{op}" text-anchor="{anchor}">{t}</text>')

# ---------------------------------------------------------------- directions
def A_stack(big=False):
    s = 46 if big else 30
    return (f'<g>{solid("TECH", 0, s*0.86, s)}'
            f'{solid("NOT", 0, s*1.72, s)}'
            f'{hollow("TAPE", 0, s*2.58, s)}</g>'), (s*3.0, s*2.9)

def B_inline(big=False):
    # one <text> with a tspan: the browser advances the pen, so TAPE can never
    # collide with NOT the way a hand-computed x offset did
    s = 34 if big else 22
    sw = max(1.0, s*0.022)
    t = (f'<text x="0" y="{s}" font-family="{F}" font-size="{s}" font-weight="700" '
         f'letter-spacing="{-0.045*s:.2f}" fill="{INK}">TECH NOT '
         f'<tspan fill="none" stroke="{INK}" stroke-width="{sw:.2f}" stroke-opacity="0.85">TAPE</tspan>'
         f'</text>')
    return f'<g>{t}</g>', (s*8.6, s*1.35)

def C_tnt(big=False):
    s = 62 if big else 40
    sw = max(1.0, s*0.024)
    t = (f'<text x="0" y="{s*0.75}" font-family="{F}" font-size="{s}" font-weight="800" '
         f'letter-spacing="{-0.05*s:.2f}" fill="{INK}">TN'
         f'<tspan fill="none" stroke="{INK}" stroke-width="{sw:.2f}" stroke-opacity="0.85">T</tspan>'
         f'</text>')
    return f'<g>{t}</g>', (s*2.25, s*0.95)

def D_strip(big=False):
    u = 92 if big else 58
    r = u*0.17
    return (f'<g><rect x="0" y="0" width="{u}" height="{u}" rx="{r}" fill="{INK}"/>'
            f'<rect x="{-u*0.06}" y="{u*0.37}" width="{u*1.12}" height="{u*0.26}" rx="{u*0.05}" '
            f'fill="{BG}" stroke="{OCHRE}" stroke-width="{u*0.028}"/></g>'), (u, u)

def E_bars(big=False):
    u = 92 if big else 58
    h, g = u*0.17, u*0.11
    return (f'<g><rect x="0" y="{u*0.16}" width="{u}" height="{h}" rx="{h/2}" fill="{SAGE}"/>'
            f'<rect x="0" y="{u*0.16+h+g}" width="{u}" height="{h}" rx="{h/2}" fill="{OCHRE}"/>'
            f'<rect x="{u*0.02}" y="{u*0.16+2*(h+g)+u*0.02}" width="{u*0.62}" height="{h}" rx="{h/2}" '
            f'fill="none" stroke="{TERRA}" stroke-width="{u*0.026}"/></g>'), (u, u*0.86)

def F_hollowT(big=False):
    u = 92 if big else 58
    sw = u*0.075
    return (f'<g><rect x="0" y="0" width="{u}" height="{sw*1.5}" rx="{sw*0.3}" fill="none" '
            f'stroke="{INK}" stroke-width="{u*0.028}"/>'
            f'<rect x="{u*0.5-sw*0.75}" y="{sw*1.5}" width="{sw*1.5}" height="{u-sw*1.5}" '
            f'rx="{sw*0.3}" fill="{OCHRE}"/></g>'), (u, u)

DIRS = [
    ("A", "Stacked Wordmark", A_stack,
     "The site's own headline treatment, made the logo. Three tight lines, TAPE hollow. "
     "Nothing to explain — it already looks like you."),
    ("B", "Inline Wordmark", B_inline,
     "The same idea laid out horizontally for the site header, an email signature, "
     "or the top of an invoice."),
    ("C", "TNT", C_tnt,
     "Initials, with the last T hollow. The shortest possible version of the whole idea, "
     "and it happens to spell something memorable."),
    ("D", "The Strip", D_strip,
     "A solid block with a hollow strip laid across it. The tape is the empty thing; "
     "the substance underneath is what you get."),
    ("E", "Two Solid, One Hollow", E_bars,
     "Your existing bar mark, corrected: the short bar is now outlined instead of filled. "
     "Built, launched, supported — the last one still open."),
    ("F", "Hollow T", F_hollowT,
     "A single T: hollow crossbar, solid stem. The most compact mark here, "
     "and the only one that is unmistakably a letter."),
]

out = pathlib.Path(__file__).parent
(out / "svg3").mkdir(exist_ok=True)

def wrap(inner, w, h, bg=None, pad=0):
    rect = f'<rect width="{w+pad*2}" height="{h+pad*2}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w+pad*2} {h+pad*2}" '
            f'width="{w+pad*2}" height="{h+pad*2}">{rect}<g transform="translate({pad},{pad})">{inner}</g></svg>')

cards = []
for code, name, fn, idea in DIRS:
    big, (bw, bh) = fn(True)
    sml, (sw_, sh) = fn(False)
    slug = name.lower().replace(" ", "-").replace(",", "")
    (out / "svg3" / f"{code}-{slug}-dark.svg").write_text(wrap(big, bw, bh, BG, 18))
    (out / "svg3" / f"{code}-{slug}-bare.svg").write_text(wrap(big, bw, bh, None, 0))

    light = big.replace(INK, "#12100e")
    cards.append(f"""
<section class="d">
  <div class="d__h">
    <span class="d__id">Direction {code}</span>
    <h2>{name}</h2>
    <p>{idea}</p>
  </div>
  <div class="r r--dark"><span class="l">Mark</span>{wrap(big, bw, bh, None, 8)}</div>
  <div class="r r--light"><span class="l">On light</span>{wrap(light, bw, bh, None, 8)}</div>
  <div class="r r--dark"><span class="l">Small</span>
    <span class="tiny">{wrap(sml, sw_, sh, None, 4)}</span>
  </div>
</section>""")

html = f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>Tech Not Tape — logo, round 3</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{background:{BG};color:{INK};font-family:{F};padding:54px 44px}}
  h1{{font-size:30px;font-weight:700;letter-spacing:-.03em}}
  .sub{{color:#ada496;margin-top:10px;font-size:15px;max-width:78ch;line-height:1.6}}
  .grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-top:40px;max-width:1500px}}
  .d{{border:1px solid rgba(255,236,214,.13);border-radius:18px;overflow:hidden}}
  .d__h{{padding:22px 26px;border-bottom:1px solid rgba(255,236,214,.13)}}
  .d__id{{font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;color:{TERRA}}}
  .d__h h2{{font-size:19px;font-weight:700;margin-top:6px;letter-spacing:-.02em}}
  .d__h p{{font-size:13.5px;color:#ada496;margin-top:7px;line-height:1.55}}
  .r{{display:flex;align-items:center;gap:26px;padding:30px 26px;min-height:130px;
      border-bottom:1px solid rgba(255,236,214,.09)}}
  .r:last-child{{border-bottom:none}}
  .r--light{{background:#f4efe6}}
  .l{{font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:#94897c;width:56px;flex:none}}
  .r--light .l{{color:#8a8076}}
  .tiny{{display:flex;align-items:center;gap:20px}}
  .tiny svg:nth-child(1){{height:34px;width:auto}}
</style></head><body>
<h1>Tech Not Tape — logo, round 3</h1>
<p class="sub">Every direction comes from the rule the site already uses: <strong>substance is solid, tape is hollow</strong>.
Shown on your background, on a light one, and small. Real palette, real type.</p>
<div class="grid">{''.join(cards)}</div>
</body></html>"""
(out / "explore-3.html").write_text(html)
print(f"wrote explore-3.html and {len(DIRS)*2} SVGs in logo/svg3/")
