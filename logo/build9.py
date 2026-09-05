#!/usr/bin/env python3
"""Strip-built alphabet, extended to spell DITCH THE TAPE."""
import pathlib, json

H, W = 100.0, 27.0
BG_FILL = '#0d0b0a'
SW = 3.2

def R(x, y, w, h, sw=SW):
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
            f'fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linejoin="round"/>')

def P(pts, sw=SW):
    return (f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in pts)}" '
            f'fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linejoin="round"/>')

def bowl(xs, xe, y0, y1, sw=SW):
    """A strip bent round: straight left edge, semicircular right side.
    A plain rectangle here made the D read as a stem beside a box."""
    R = (y1 - y0) / 2
    return (f'<path d="M{xs:.1f},{y0:.1f} H{xe-R:.1f} A{R:.1f},{R:.1f} 0 0 1 {xe-R:.1f},{y1:.1f} '
            f'H{xs:.1f} Z" fill="none" stroke="currentColor" stroke-width="{sw}" '
            f'stroke-linejoin="round"/>')

def G():
    g = {}
    g['I'] = (R(0,0,W,H), W)

    Tw = 66
    g['T'] = (R(0,0,Tw,W) + R((Tw-W)/2,0,W,H), Tw)

    Ew = 60
    g['E'] = (R(0,0,W,H) + R(0,0,Ew,W) + R(0,(H-W)/2,Ew-8,W*0.86) + R(0,H-W,Ew,W), Ew)

    Cw = 74
    Ro, Ri = H/2, (H-2*W)/2
    g['C'] = (f'<path d="M{Cw:.1f},0 H{Ro:.1f} A{Ro:.1f},{Ro:.1f} 0 0 0 {Ro:.1f},{H:.1f} '
              f'H{Cw:.1f} V{H-W:.1f} H{W+Ri:.1f} A{Ri:.1f},{Ri:.1f} 0 0 1 {W+Ri:.1f},{W:.1f} '
              f'H{Cw:.1f} Z" fill="none" stroke="currentColor" stroke-width="{SW}" '
              f'stroke-linejoin="round"/>', Cw)

    Hw = 66
    g['H'] = (R(0,0,W,H) + R(Hw-W,0,W,H) + R(0,(H-W)/2,Hw,W*0.86), Hw)

    Dw = 92
    g['D'] = (R(0,0,W,H) + bowl(W*0.7, Dw, 0, H)
              + bowl(W, Dw-W, W, H-W, SW*0.85), Dw)

    Pw = 80
    g['P'] = (R(0,0,W,H) + bowl(W*0.7, Pw, 0, 70)
              + bowl(W, Pw-W, W, 70-W, SW*0.85), Pw)

    Aw = 74
    g['A'] = (P([(1,H),(1+W,H),(Aw/2+9,0),(Aw/2-9,0)]) +
              P([(Aw-1-W,H),(Aw-1,H),(Aw/2+9,0),(Aw/2-9,0)]) +
              R(11,60,Aw-22,21), Aw)

    g['.'] = (R(0,H-W*0.78,W*0.78,W*0.78), W*0.78)
    return g

GL = G()
LETTER_GAP, WORD_GAP = 13.0, 38.0

def phrase(text):
    parts, x = [], 0.0
    for ch in text:
        if ch == ' ':
            x += WORD_GAP
            continue
        svg, w = GL[ch]
        parts.append(f'<g transform="translate({x:.1f},0)">{svg}</g>')
        x += w + LETTER_GAP
    return "".join(parts), x - LETTER_GAP

out = pathlib.Path(__file__).parent
body, w = phrase("DITCH THE TAPE.")
PAD = 6
vb = f"-{PAD} -{PAD} {w+PAD*2:.0f} {H+PAD*2:.0f}"
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="100%" '
       f'style="display:block">{body}</svg>')
(out/"svg8"/"ditch-the-tape.svg").write_text(svg.replace("currentColor", "#f7f3ea"))

# React component for the footer
# JSX needs camelCase DOM props; plain SVG uses kebab-case. The standalone
# .svg file keeps kebab, the React component gets converted.
jsx_body = (body.replace('stroke-width=', 'strokeWidth=')
                 .replace('stroke-linejoin=', 'strokeLinejoin=')
                 .replace('stroke-opacity=', 'strokeOpacity=')
                 .replace('fill-opacity=', 'fillOpacity='))

comp = f'''/**
 * "Ditch the tape." drawn as overlapping strips of tape rather than outlined
 * glyphs — so every letter shows the crossing detail the A and P already had.
 * Decorative: the footer marks it aria-hidden.
 */
export default function TapedPhrase({{ className }}) {{
  return (
    <svg
      viewBox="{vb}"
      className={{className}}
      role="img"
      aria-label="Ditch the tape."
      style={{{{ display: 'block', width: '100%', height: 'auto' }}}}
    >
      {jsx_body}
    </svg>
  );
}}
'''
(pathlib.Path("/Users/juliestromwall/Projects/technottape/app/components/TapedPhrase.jsx")
 ).write_text(comp)

html = f'''<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ditch the tape</title>
<style>body{{background:#0d0b0a;margin:0;padding:50px 44px;font-family:system-ui;color:#f7f3ea}}
h1{{font-size:24px;margin:0 0 8px}} p{{color:#ada496;font-size:14px;margin:0 0 34px}}
.w{{max-width:1200px}} .dim{{color:#241e1a;margin-top:46px}} .lbl{{font-size:10px;letter-spacing:.2em;
color:#94897c;text-transform:uppercase;margin-bottom:12px}}</style></head><body>
<h1>Ditch the tape — as tape</h1>
<p>Same strip construction as the TAPE logotype, extended with D, I, C, H and the full stop.</p>
<div class="lbl">Full strength</div>
<div class="w" style="color:#f7f3ea">{svg}</div>
<div class="lbl" style="margin-top:44px">At footer opacity</div>
<div class="w" style="color:#241e1a">{svg}</div>
</body></html>'''
(out/"explore-ditch.html").write_text(html)
print(f"phrase width {w:.0f} units; component written to app/components/TapedPhrase.jsx")
