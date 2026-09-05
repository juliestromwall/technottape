#!/usr/bin/env python3
"""Favicon candidates. Pure geometry — no text — so nothing depends on a font
being installed and every edge stays crisp at 16px."""
import pathlib

PLATE, INK, OCHRE = "#0d0b0a", "#f7f3ea", "#e6b455"
V = 64

def one(x, y, w, h, c=INK):
    """A '1' — a stem with its little flag."""
    bw = w*0.34
    return (f'<rect x="{x+w/2-bw/2:.2f}" y="{y:.2f}" width="{bw:.2f}" height="{h:.2f}" '
            f'rx="{bw*0.25:.2f}" fill="{c}"/>'
            f'<rect x="{x+w*0.16:.2f}" y="{y:.2f}" width="{bw*0.9:.2f}" height="{bw:.2f}" '
            f'rx="{bw*0.25:.2f}" fill="{c}" transform="rotate(-38 {x+w*0.16+bw*0.45:.2f} {y+bw/2:.2f})"/>')

def zero(x, y, w, h, c=INK, plate=PLATE):
    """A '0' — drawn as a filled ring so it holds at small sizes."""
    t = min(w, h)*0.26
    return (f'<rect x="{x+w*0.16:.2f}" y="{y:.2f}" width="{w*0.68:.2f}" height="{h:.2f}" '
            f'rx="{w*0.34:.2f}" fill="{c}"/>'
            f'<rect x="{x+w*0.16+t:.2f}" y="{y+t:.2f}" width="{w*0.68-t*2:.2f}" '
            f'height="{h-t*2:.2f}" rx="{max(0.1,(w*0.68-t*2)/2):.2f}" fill="{plate}"/>')

def binary_T(plate=PLATE, ink=INK):
    """A T spelled out in 1s and 0s."""
    pad, cols, rows = 9.0, 5, 5
    cw = (V-pad*2)/cols
    ch = (V-pad*2)/rows
    p, top = [], "10101"
    for c, d in enumerate(top):
        f = one if d == "1" else zero
        p.append(f(pad+c*cw, pad, cw, ch*0.92, ink) if d == "1"
                 else zero(pad+c*cw, pad, cw, ch*0.92, ink, plate))
    for r, d in enumerate("010"):
        y = pad+ch*(r+1)+ch*0.06
        x = pad+cw*2
        p.append(one(x, y, cw, ch*0.92, ink) if d == "1" else zero(x, y, cw, ch*0.92, ink, plate))
    return "".join(p)

def solid_T(plate=PLATE, ink=INK):
    b = V*0.135
    return (f'<rect x="{V*0.14:.1f}" y="{V*0.22:.1f}" width="{V*0.72:.1f}" height="{b:.1f}" '
            f'rx="{b*0.28:.1f}" fill="{ink}"/>'
            f'<rect x="{V/2-b/2:.1f}" y="{V*0.22:.1f}" width="{b:.1f}" height="{V*0.56:.1f}" '
            f'rx="{b*0.28:.1f}" fill="{ink}"/>')

def outline_T(plate=PLATE, ink=INK):
    b, sw = V*0.15, V*0.055
    return (f'<g fill="none" stroke="{ink}" stroke-width="{sw:.1f}" stroke-linejoin="round">'
            f'<rect x="{V*0.14:.1f}" y="{V*0.22:.1f}" width="{V*0.72:.1f}" height="{b:.1f}" rx="{b*0.3:.1f}"/>'
            f'<rect x="{V/2-b/2:.1f}" y="{V*0.37:.1f}" width="{b:.1f}" height="{V*0.41:.1f}" rx="{b*0.3:.1f}"/></g>')

def T_bits(plate=PLATE, ink=INK):
    """Solid T with a couple of bits knocked out of the stem."""
    b = V*0.135
    holes = "".join(
        f'<rect x="{V/2-b*0.28:.2f}" y="{V*0.44+i*V*0.115:.2f}" width="{b*0.56:.2f}" '
        f'height="{V*0.055:.2f}" rx="{V*0.014:.2f}" fill="{plate}"/>' for i in range(2))
    return solid_T(plate, ink) + holes

def ten(plate=PLATE, ink=INK):
    cw, ch = V*0.30, V*0.44
    y = V*0.28
    return one(V*0.16, y, cw, ch, ink) + zero(V*0.50, y, cw, ch, ink, plate)

def bars(plate=PLATE, ink=INK):
    h, g, w = V*0.15, V*0.075, V*0.62
    x, y = V*0.19, V*0.19
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{h/2:.1f}" fill="#7fae83"/>'
            f'<rect x="{x:.1f}" y="{y+h+g:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{h/2:.1f}" fill="{OCHRE}"/>'
            f'<rect x="{x:.1f}" y="{y+2*(h+g):.1f}" width="{w*0.55:.1f}" height="{h:.1f}" rx="{h/2:.1f}" '
            f'fill="none" stroke="#e07f57" stroke-width="{V*0.028:.1f}"/>')

CANDS = [
 ("binary-t", "Binary T",  binary_T, "Your idea: a T spelled out in 1s and 0s."),
 ("solid-t",  "Solid T",   solid_T,  "The plainest version. Survives anything."),
 ("outline-t","Outline T", outline_T,"The hollow rule applied to the mark."),
 ("t-bits",   "T with bits",T_bits,  "Solid T with two bits knocked out of the stem."),
 ("ten",      "One Zero",  ten,      "Just the two digits, no letter at all."),
 ("bars",     "Bars",      bars,     "The current mark, for comparison."),
]

out = pathlib.Path(__file__).parent
(out / "favicon").mkdir(exist_ok=True)

def svg(body, plate=PLATE, rounded=True):
    r = f'<rect width="{V}" height="{V}" rx="{V*0.22:.1f}" fill="{plate}"/>' if rounded else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {V} {V}" '
            f'width="{V}" height="{V}">{r}{body}</svg>')

rows = []
for slug, name, fn, note in CANDS:
    dark = svg(fn(PLATE, INK))
    light = svg(fn("#f4efe6", "#12100e"), "#f4efe6")
    (out / "favicon" / f"{slug}.svg").write_text(dark)
    (out / "favicon" / f"{slug}-light.svg").write_text(light)
    sizes = "".join(
        f'<span class="s"><span class="px">{p}</span>'
        f'<img src="favicon/{slug}.svg" width="{p}" height="{p}"></span>' for p in (16, 24, 32, 48))
    rows.append(f"""
<tr><td class="n"><strong>{name}</strong><em>{note}</em></td>
<td><img src="favicon/{slug}.svg" width="88" height="88"></td>
<td>{sizes}</td>
<td class="lt"><img src="favicon/{slug}-light.svg" width="48" height="48"></td></tr>""")

html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>Favicon</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
 *{{box-sizing:border-box;margin:0;padding:0}}
 body{{background:{PLATE};color:{INK};font-family:Inter,sans-serif;padding:48px 40px}}
 h1{{font-size:27px;letter-spacing:-.03em}}
 .sub{{color:#ada496;margin-top:8px;font-size:14.5px;max-width:80ch;line-height:1.6}}
 table{{border-collapse:collapse;margin-top:34px;width:100%;max-width:1080px}}
 td{{border-bottom:1px solid rgba(255,236,214,.12);padding:22px 18px;vertical-align:middle}}
 .n{{width:250px}} .n strong{{display:block;font-size:15.5px}}
 .n em{{display:block;font-style:normal;color:#94897c;font-size:12.5px;margin-top:4px;line-height:1.5}}
 .s{{display:inline-flex;flex-direction:column;align-items:center;gap:7px;margin-right:22px}}
 .px{{font-size:9.5px;letter-spacing:.14em;color:#94897c}}
 .lt{{background:#f4efe6;text-align:center;width:110px}}
 img{{image-rendering:auto}}
</style></head><body>
<h1>Favicon candidates</h1>
<p class="sub">Rendered at the sizes browsers actually use. 16px is the browser tab —
if a mark does not survive there, it is not a favicon.</p>
<table>{''.join(rows)}</table>
</body></html>"""
(out / "explore-favicon.html").write_text(html)
print("wrote explore-favicon.html and", len(CANDS)*2, "SVGs in logo/favicon/")
