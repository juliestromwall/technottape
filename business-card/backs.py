#!/usr/bin/env python3
"""Three alternatives for the card back."""
import importlib.util, pathlib
spec = importlib.util.spec_from_file_location("gen", "generate.py")
g = importlib.util.module_from_spec(spec); spec.loader.exec_module(g)

VOID, INK, CREAM = g.VOID, g.INK, "#f2ece2"
SAGE, OCHRE, TERRA = g.SAGE, g.OCHRE, g.TERRA
W, H = 3.75*96, 2.25*96

icon_dark = g.icon_svg                      # cream-on-charcoal chip
icon_ink  = (g.icon_svg.replace('fill="#0d0b0a"', 'fill="none"')
                        .replace('fill="#f7f3ea"', 'fill="#12100e"'))

def light_field():
    """Muted blocks for a cream ground."""
    out, v = [], 53
    cols, rows = 34, 20
    cw, ch = W/cols, H/rows
    for r in range(rows):
        for c in range(cols):
            v = (v*1103515245 + 12345) & 0x7fffffff
            f = ((v>>16)&0xFFFF)/0xFFFF
            t = c/(cols-1)
            if f > 0.30 + t*0.55: continue
            v = (v*1103515245 + 12345) & 0x7fffffff
            gq = ((v>>16)&0xFFFF)/0xFFFF
            col = TERRA if gq > 0.74 else OCHRE if gq > 0.50 else SAGE if gq > 0.30 else "#d8d0c3"
            op = round(0.16 + (1-t)*0.5*(0.4+gq*0.6), 3)
            size = cw*(0.44+gq*0.32)
            out.append(f'<rect x="{c*cw+(cw-size)/2:.2f}" y="{r*ch+(ch-size)/2:.2f}" '
                       f'width="{size:.2f}" height="{size:.2f}" rx="{size*0.22:.2f}" '
                       f'fill="{col}" opacity="{op}"/>')
    return "".join(out)

dark_px  = g.field(W, H, 34, 20, seed=29, bias=0.10, fade="right")
faint_px = g.field(W, H, 34, 20, seed=41, bias=0.34, fade="right")

BACKS = [
 ("A", "Cream back", f'''
  <div class="card" style="background:{CREAM}">
    <svg class="px" viewBox="0 0 {W} {H}" preserveAspectRatio="none">{light_field()}</svg>
    <svg class="vignette" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><radialGradient id="lb" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0.18" stop-color="{CREAM}" stop-opacity="0.96"/>
        <stop offset="1" stop-color="{CREAM}" stop-opacity="0.05"/></radialGradient></defs>
      <rect width="100" height="100" fill="url(#lb)"/></svg>
    <div class="backwrap">
      <div style="width:0.80in;height:0.80in">{icon_ink}</div>
      <div class="tag" style="color:#6b6357">technottape.com</div>
    </div>
  </div>''',
  "Light back against the dark front, the way a printed pair usually works. Icon in ink, no chip."),

 ("B", "Wordmark", f'''
  <div class="card">
    <svg class="px" viewBox="0 0 {W} {H}" preserveAspectRatio="none">{faint_px}</svg>
    <svg class="vignette" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><radialGradient id="wb" cx="0.5" cy="0.5" r="0.66">
        <stop offset="0.24" stop-color="{VOID}" stop-opacity="0.97"/>
        <stop offset="1" stop-color="{VOID}" stop-opacity="0.35"/></radialGradient></defs>
      <rect width="100" height="100" fill="url(#wb)"/></svg>
    <div class="backwrap" style="gap:0.13in">
      <div style="width:2.05in">{g.wordmark(uid="wb2")}</div>
      <div class="tag">Ditch the tape</div>
    </div>
  </div>''',
  "The identity itself, large and centred. No icon — the wordmark is the mark."),

 ("C", "Field only", f'''
  <div class="card">
    <svg class="px" viewBox="0 0 {W} {H}" preserveAspectRatio="none">{dark_px}</svg>
    <svg class="vignette" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><linearGradient id="cb" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0.05" stop-color="{VOID}" stop-opacity="0.97"/>
        <stop offset="0.75" stop-color="{VOID}" stop-opacity="0.30"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#cb)"/></svg>
    <div style="position:absolute;left:0.375in;bottom:0.375in;z-index:3">
      <div style="width:1.30in">{g.wordmark(uid="wb3")}</div>
      <div class="tag" style="margin-top:9px;letter-spacing:.3em">Ditch the tape</div>
    </div>
  </div>''',
  "Field left to run, wordmark tucked into one corner. The most graphic of the three."),
]

cards = "".join(f'<div class="cell"><div class="lbl"><b>{c}</b> · {n}<span>{d}</span></div>{h}</div>'
                for c, n, h, d in [(c, n, h, d) for c, n, h, d in BACKS])
html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>{g.CSS}
body{{background:#26262a;padding:34px;font-family:Inter,sans-serif}}
.cell{{margin-bottom:26px}}
.lbl{{color:#e8e2d8;font-size:13px;margin-bottom:9px;font-weight:600}}
.lbl b{{color:{OCHRE}}}
.lbl span{{display:block;color:#a49a8d;font-weight:400;font-size:12px;margin-top:3px}}
.card{{box-shadow:0 8px 26px rgba(0,0,0,.5)}}
</style></head><body>{cards}</body></html>"""
pathlib.Path("backs.html").write_text(html)
print("wrote backs.html")
