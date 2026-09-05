#!/usr/bin/env python3
"""Round 4 — six ways to make TECH read as digital, inside the established
lockup (TECH digital / NOT solid / TAPE hollow)."""
import pathlib

BG, INK = "#0d0b0a", "#f7f3ea"
SAGE, OCHRE, TERRA = "#7fae83", "#e6b455", "#e07f57"
F = "Inter, 'Helvetica Neue', Arial, sans-serif"
MONO = "'SF Mono', Menlo, Consolas, monospace"

# 5x7 bitmaps
GLYPH = {
 "T": ["11111","00100","00100","00100","00100","00100","00100"],
 "E": ["11111","10000","10000","11110","10000","10000","11111"],
 "C": ["01110","10001","10000","10000","10000","10001","01110"],
 "H": ["10001","10001","10001","11111","10001","10001","10001"],
}

def tail(x, s, ink=INK):
    """' NOT TAPE' — one <text> with a tspan so glyphs can never collide."""
    sw = max(0.9, s*0.022)
    return (f'<text x="{x}" y="{s*0.72}" font-family="{F}" font-size="{s}" font-weight="700" '
            f'letter-spacing="{-0.045*s:.2f}" fill="{ink}">NOT '
            f'<tspan fill="none" stroke="{ink}" stroke-width="{sw:.2f}" stroke-opacity="0.85">TAPE</tspan></text>')

def bits(seed, n):
    v = seed
    out = []
    for _ in range(n):
        v = (v*1103515245 + 12345) & 0x7fffffff
        out.append("1" if (v >> 16) & 1 else "0")
    return "".join(out)

# ------------------------------------------------------------------ TECH treatments
def G_binaryfill(s, uid):
    """Letterforms filled with 1s and 0s."""
    w = s*2.62
    rows = []
    row_h = s*0.115
    y = s*0.06
    i = 0
    while y < s*0.80:
        rows.append(f'<text x="0" y="{y+row_h*0.8:.2f}" font-family="{MONO}" font-size="{row_h*0.94:.2f}" '
                    f'letter-spacing="{row_h*0.12:.2f}" fill="{OCHRE}">{bits(7+i, 46)}</text>')
        y += row_h; i += 1
    return (f'<defs><clipPath id="c{uid}"><text x="0" y="{s*0.72}" font-family="{F}" font-size="{s}" '
            f'font-weight="800" letter-spacing="{-0.045*s:.2f}">TECH</text></clipPath></defs>'
            f'<g clip-path="url(#c{uid})">{"".join(rows)}</g>'), w

def H_pixel(s, uid):
    """Letterforms built from solid squares on a coarse grid."""
    c = s*0.72/7
    parts, x0 = [], 0.0
    for ch in "TECH":
        for r, row in enumerate(GLYPH[ch]):
            for col, on in enumerate(row):
                if on == "1":
                    parts.append(f'<rect x="{x0+col*c:.2f}" y="{r*c:.2f}" width="{c*0.86:.2f}" '
                                 f'height="{c*0.86:.2f}" rx="{c*0.16:.2f}" fill="{INK}"/>')
        x0 += 6*c
    return f'<g transform="translate(0,{s*0.03:.2f})">{"".join(parts)}</g>', x0 - c

def I_ribbon(s, uid):
    """Clean letterforms, with a data ribbon running underneath."""
    w = s*2.62
    return (f'<text x="0" y="{s*0.72}" font-family="{F}" font-size="{s}" font-weight="800" '
            f'letter-spacing="{-0.045*s:.2f}" fill="{INK}">TECH</text>'
            f'<text x="0" y="{s*0.94}" font-family="{MONO}" font-size="{s*0.15:.2f}" '
            f'letter-spacing="{s*0.052:.2f}" fill="{OCHRE}" fill-opacity="0.95">{bits(3, 18)}</text>'), w

def J_dissolve(s, uid):
    """Solid on the left, breaking into loose bits on the right."""
    c = s*0.72/7
    parts, x0 = [], 0.0
    for gi, ch in enumerate("TECH"):
        for r, row in enumerate(GLYPH[ch]):
            for col, on in enumerate(row):
                if on != "1":
                    continue
                prog = (x0 + col*c) / (s*2.5)          # 0 at left, ~1 at right
                v = (gi*37 + r*11 + col*7) % 10 / 10
                if prog > 0.55 and v < (prog - 0.55) * 2.1:
                    continue                            # this bit has fallen away
                jit = 0 if prog < 0.6 else (v - 0.5) * c * 1.5 * (prog - 0.6) * 4
                fill = INK if prog < 0.72 else OCHRE
                parts.append(f'<rect x="{x0+col*c:.2f}" y="{r*c+jit:.2f}" width="{c*0.86:.2f}" '
                             f'height="{c*0.86:.2f}" rx="{c*0.16:.2f}" fill="{fill}"/>')
        x0 += 6*c
    return f'<g transform="translate(0,{s*0.03:.2f})">{"".join(parts)}</g>', x0 - c

def K_zero(s, uid):
    """Letterforms untouched — the O in NOT becomes a zero instead."""
    w = s*2.62
    return (f'<text x="0" y="{s*0.72}" font-family="{F}" font-size="{s}" font-weight="800" '
            f'letter-spacing="{-0.045*s:.2f}" fill="{INK}">TECH</text>'), w

def L_dots(s, uid):
    """LED dot-matrix."""
    c = s*0.72/7
    parts, x0 = [], 0.0
    for ch in "TECH":
        for r, row in enumerate(GLYPH[ch]):
            for col, on in enumerate(row):
                parts.append(
                    f'<circle cx="{x0+col*c+c*0.43:.2f}" cy="{r*c+c*0.43:.2f}" r="{c*0.36:.2f}" '
                    f'fill="{INK if on=="1" else INK}" fill-opacity="{1 if on=="1" else 0.11}"/>')
        x0 += 6*c
    return f'<g transform="translate(0,{s*0.03:.2f})">{"".join(parts)}</g>', x0 - c

DIRS = [
 ("G","Binary Fill", G_binaryfill,
  "Exactly what you pictured: the letters of TECH filled with 1s and 0s. Cute, and instantly readable as digital."),
 ("H","Pixel", H_pixel,
  "TECH built from squares on a coarse grid, like an early display. Digital without saying 'binary' out loud, and it holds together small."),
 ("I","Data Ribbon", I_ribbon,
  "Letterforms left clean, with a thin run of 1s and 0s underneath. The most restrained option — and the only one that stays legible at any size."),
 ("J","Dissolve", J_dissolve,
  "Solid on the left, breaking into loose bits on the right. Says 'this is the thing that changes' — my favourite of the six."),
 ("K","Zero Swap", K_zero,
  "TECH untouched. The O in NOT becomes a zero. One character does the whole job, and it never dates."),
 ("L","Dot Matrix", L_dots,
  "An LED panel, unlit dots and all. The most overtly hardware of the set."),
]

out = pathlib.Path(__file__).parent
(out / "svg4").mkdir(exist_ok=True)

def lockup(fn, code, s=54, small=False):
    tech, w = fn(s, code + ("s" if small else ""))
    gap = s*0.30
    if code == "K":
        sw = max(0.9, s*0.022)
        t = (f'<text x="{w+gap:.2f}" y="{s*0.72}" font-family="{F}" font-size="{s}" font-weight="700" '
             f'letter-spacing="{-0.045*s:.2f}" fill="{INK}">N'
             f'<tspan fill="{OCHRE}">0</tspan>T '
             f'<tspan fill="none" stroke="{INK}" stroke-width="{sw:.2f}" stroke-opacity="0.85">TAPE</tspan></text>')
    else:
        t = tail(w+gap, s)
    # 'NOT TAPE' measures 4.626em in Inter 700 at -0.045em tracking (measured,
    # not estimated — guessing this is what clipped the E off TAPE)
    return f'<g>{tech}{t}</g>', (w+gap+s*4.75, s*1.08)

def wrap(inner, w, h, pad=10, bg=None):
    r = f'<rect width="{w+pad*2}" height="{h+pad*2}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w+pad*2} {h+pad*2}" '
            f'width="{w+pad*2}" height="{h+pad*2}">{r}'
            f'<g transform="translate({pad},{pad})">{inner}</g></svg>')

cards = []
for code, name, fn, idea in DIRS:
    big, (bw, bh) = lockup(fn, code, 54)
    sml, (sw_, sh) = lockup(fn, code, 21, small=True)
    slug = name.lower().replace(" ", "-")
    (out / "svg4" / f"{code}-{slug}-dark.svg").write_text(wrap(big, bw, bh, 16, BG))
    (out / "svg4" / f"{code}-{slug}-bare.svg").write_text(wrap(big, bw, bh, 0))
    light = big.replace(INK, "#12100e")
    cards.append(f"""
<section class="d">
  <div class="d__h"><span class="d__id">Direction {code}</span><h2>{name}</h2><p>{idea}</p></div>
  <div class="r">{wrap(big, bw, bh, 8)}</div>
  <div class="r r--light">{wrap(light, bw, bh, 8)}</div>
  <div class="r r--sm"><span class="l">At size</span>{wrap(sml, sw_, sh, 5)}</div>
</section>""")

html = f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>Tech Not Tape — digital TECH</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
 *{{box-sizing:border-box;margin:0;padding:0}}
 body{{background:{BG};color:{INK};font-family:{F};padding:52px 42px}}
 h1{{font-size:29px;font-weight:700;letter-spacing:-.03em}}
 .sub{{color:#ada496;margin-top:9px;font-size:15px;max-width:80ch;line-height:1.6}}
 .grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:38px;max-width:1520px}}
 .d{{border:1px solid rgba(255,236,214,.13);border-radius:18px;overflow:hidden}}
 .d__h{{padding:20px 24px;border-bottom:1px solid rgba(255,236,214,.13)}}
 .d__id{{font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;color:{TERRA}}}
 .d__h h2{{font-size:18px;font-weight:700;margin-top:5px;letter-spacing:-.02em}}
 .d__h p{{font-size:13px;color:#ada496;margin-top:6px;line-height:1.55}}
 .r{{padding:26px 24px;border-bottom:1px solid rgba(255,236,214,.09);
     display:flex;align-items:center;gap:20px}}
 .r:last-child{{border-bottom:none}}
 .r--light{{background:#f4efe6}}
 .l{{font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:#94897c;width:54px;flex:none}}
</style></head><body>
<h1>Making TECH digital</h1>
<p class="sub">Six treatments, all inside the lockup you already have:
<strong>TECH digital · NOT solid · TAPE hollow</strong>. Shown on your background, on light,
and at roughly the size it would sit in your site header.</p>
<div class="grid">{''.join(cards)}</div>
</body></html>"""
(out / "explore-4.html").write_text(html)
print(f"wrote explore-4.html and {len(DIRS)*2} SVGs in logo/svg4/")
