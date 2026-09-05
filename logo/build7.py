#!/usr/bin/env python3
"""Binary T favicon — dense 1s and 0s clipped into a geometric T.
The T is a path, not a glyph, so nothing depends on a font for the shape;
only the digits use monospace, which every system has."""
import pathlib
V = 64
PLATE, INK = "#0d0b0a", "#f7f3ea"

def bits(seed, n):
    v, o = seed, []
    for _ in range(n):
        v = (v*1103515245 + 12345) & 0x7fffffff
        o.append("1" if (v >> 16) & 1 else "0")
    return "".join(o)

def T_path(cw=48.0, ct=11.0, sw=11.0, top=11.0, bot=53.0, r=1.6):
    """Crossbar + stem as one path."""
    x0 = (V-cw)/2
    sx = (V-sw)/2
    return (f'M{x0} {top} h{cw} v{ct} h{-(cw-sw)/2} v{bot-top-ct} h{-sw} '
            f'v{-(bot-top-ct)} h{-(cw-sw)/2} z')

def binary_T(density=13, fs=4.6, ink=INK, plate=PLATE, uid="bt"):
    rows, y, i = [], 10.0, 0
    step = 43.0/density
    while y < 54:
        rows.append(f'<text x="6" y="{y:.2f}" font-family="ui-monospace, Menlo, monospace" '
                    f'font-size="{fs:.2f}" letter-spacing="0.55" fill="{ink}">{bits(17+i, 26)}</text>')
        y += step; i += 1
    return (f'<defs><clipPath id="{uid}"><path d="{T_path()}"/></clipPath></defs>'
            f'<g clip-path="url(#{uid})">{"".join(rows)}</g>')

def svg(body, plate=PLATE, rounded=True):
    r = f'<rect width="{V}" height="{V}" rx="{V*0.22:.1f}" fill="{plate}"/>' if rounded else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {V} {V}" '
            f'width="{V}" height="{V}">{r}{body}</svg>')

out = pathlib.Path(__file__).parent
(out/"favicon").mkdir(exist_ok=True)

VARIANTS = [
 ("binary-t-fine",  "Fine",   dict(density=15, fs=4.0), "Densest — closest to the crop you sent."),
 ("binary-t",       "Medium", dict(density=12, fs=5.0), "A little coarser, so more of it survives shrinking."),
 ("binary-t-bold",  "Coarse", dict(density=8,  fs=7.2), "Fewest, largest digits. The most legible when small."),
]
rows=[]
for slug, name, kw, note in VARIANTS:
    d = svg(binary_T(uid=slug, **kw))
    l = svg(binary_T(uid=slug+"l", ink="#12100e", plate="#f4efe6", **kw), "#f4efe6")
    (out/"favicon"/f"{slug}.svg").write_text(d)
    (out/"favicon"/f"{slug}-light.svg").write_text(l)
    sizes = "".join(f'<span class="s"><span class="px">{p}</span>'
                    f'<img src="favicon/{slug}.svg" width="{p}" height="{p}"></span>'
                    for p in (16,24,32,48,180))
    rows.append(f'<tr><td class="n"><strong>{name}</strong><em>{note}</em></td>'
                f'<td><img src="favicon/{slug}.svg" width="96" height="96"></td>'
                f'<td>{sizes}</td></tr>')

# the pragmatic 16px companion
(out/"favicon"/"tab-16.svg").write_text(svg(
    f'<path d="{T_path(cw=44, ct=10, sw=10, top=13, bot=51)}" fill="{INK}"/>'
    f'<rect x="29.2" y="30" width="5.6" height="3.4" rx="0.9" fill="{PLATE}"/>'
    f'<rect x="29.2" y="37.4" width="5.6" height="3.4" rx="0.9" fill="{PLATE}"/>'))
rows.append('<tr><td class="n"><strong>Tab companion</strong><em>Same T, bits instead of digits — for 16px only.</em></td>'
            '<td><img src="favicon/tab-16.svg" width="96" height="96"></td>'
            '<td>' + "".join(f'<span class="s"><span class="px">{p}</span>'
            f'<img src="favicon/tab-16.svg" width="{p}" height="{p}"></span>' for p in (16,24,32,48,180)) + '</td></tr>')

html = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>Binary T</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:{PLATE};color:{INK};font-family:Inter,sans-serif;padding:46px 38px}}
h1{{font-size:26px;letter-spacing:-.03em}} .sub{{color:#ada496;margin-top:8px;font-size:14.5px;max-width:80ch;line-height:1.6}}
table{{border-collapse:collapse;margin-top:32px}} td{{border-bottom:1px solid rgba(255,236,214,.12);padding:20px 16px;vertical-align:middle}}
.n{{width:240px}} .n strong{{display:block;font-size:15px}} .n em{{display:block;font-style:normal;color:#94897c;font-size:12.5px;margin-top:4px;line-height:1.5}}
.s{{display:inline-flex;flex-direction:column;align-items:center;gap:6px;margin-right:20px;vertical-align:bottom}}
.px{{font-size:9.5px;letter-spacing:.14em;color:#94897c}}</style></head><body>
<h1>Binary T — density test</h1>
<p class="sub">Dense 1s and 0s clipped into a T. Shown at the sizes browsers use.
180px is the phone home screen; 16px is the browser tab.</p>
<table>{''.join(rows)}</table></body></html>"""
(out/"explore-binary-t.html").write_text(html)
print("wrote explore-binary-t.html")
