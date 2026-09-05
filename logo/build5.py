#!/usr/bin/env python3
"""Round 5 — binary TECH, monochrome, with six treatments for NOT.
Widths are measured ratios, not estimates:
  TECH w800 @-0.045 = 2.599em | TAPE w700 @-0.045 = 2.401em
  NOT  w600 @+0.08  = 2.397em | not w600 @+0.08   = 1.814em
"""
import pathlib

BG, INK_D, INK_L = "#0d0b0a", "#f7f3ea", "#12100e"
OCHRE = "#e6b455"
F = "Inter, 'Helvetica Neue', Arial, sans-serif"
MONO = "'SF Mono', Menlo, Consolas, monospace"
W_TECH, W_TAPE, W_NOT, W_not = 2.599, 2.401, 2.397, 1.814
CAP = 0.72

def bits(seed, n):
    v, out = seed, []
    for _ in range(n):
        v = (v*1103515245 + 12345) & 0x7fffffff
        out.append("1" if (v >> 16) & 1 else "0")
    return "".join(out)

def tech(S, uid, ink):
    """Letterforms outlined, filled with 1s and 0s in the same colour."""
    rows, rh, y, i = [], S*0.098, 0.0, 0
    while y < S*CAP + rh:
        rows.append(f'<text x="{-S*0.02:.2f}" y="{y+rh*0.82:.2f}" font-family="{MONO}" '
                    f'font-size="{rh*0.92:.2f}" letter-spacing="{rh*0.10:.2f}" '
                    f'fill="{ink}" fill-opacity="0.92">{bits(11+i, 40)}</text>')
        y += rh; i += 1
    t = (f'<text x="0" y="{S*CAP:.2f}" font-family="{F}" font-size="{S}" font-weight="800" '
         f'letter-spacing="{-0.045*S:.2f}">TECH</text>')
    return (f'<defs><clipPath id="t{uid}">{t}</clipPath></defs>'
            f'<g clip-path="url(#t{uid})">{"".join(rows)}</g>'
            f'<text x="0" y="{S*CAP:.2f}" font-family="{F}" font-size="{S}" font-weight="800" '
            f'letter-spacing="{-0.045*S:.2f}" fill="none" stroke="{ink}" '
            f'stroke-width="{S*0.017:.2f}" stroke-opacity="0.9"/>')

def tape(x, S, ink):
    return (f'<text x="{x:.2f}" y="{S*CAP:.2f}" font-family="{F}" font-size="{S}" font-weight="700" '
            f'letter-spacing="{-0.045*S:.2f}" fill="none" stroke="{ink}" '
            f'stroke-width="{S*0.021:.2f}" stroke-opacity="0.85">TAPE</text>')

# ---- NOT treatments: (svg, width) given the left edge x --------------------
def not_caps(x, S, ink, f=0.30, col=None, op=0.85):
    ns = S*f
    base = 0.36*(S + ns)
    return (f'<text x="{x:.2f}" y="{base:.2f}" font-family="{F}" font-size="{ns:.2f}" '
            f'font-weight="600" letter-spacing="{0.08*ns:.2f}" fill="{col or ink}" '
            f'fill-opacity="{op}">NOT</text>'), W_NOT*ns

def not_lower(x, S, ink, f=0.36, op=0.85):
    ns = S*f
    base = 0.36*S + 0.26*ns
    return (f'<text x="{x:.2f}" y="{base:.2f}" font-family="{F}" font-size="{ns:.2f}" '
            f'font-weight="600" letter-spacing="{0.08*ns:.2f}" fill="{ink}" '
            f'fill-opacity="{op}">not</text>'), W_not*ns

def M(x, S, ink): return not_caps(x, S, ink, 0.30)
def N(x, S, ink): return not_lower(x, S, ink, 0.38)
def O(x, S, ink):
    ns = S*0.21
    base = 0.36*(S + ns)
    return (f'<text x="{x:.2f}" y="{base:.2f}" font-family="{F}" font-size="{ns:.2f}" '
            f'font-weight="600" letter-spacing="{0.34*ns:.2f}" fill="{ink}" '
            f'fill-opacity="0.8">NOT</text>'), (W_NOT+0.34*3)*ns
def P(x, S, ink): return not_caps(x, S, ink, 0.30, col=OCHRE, op=1)
def Q(x, S, ink):
    ns = S*0.24
    tw = W_NOT*ns
    padx, pady = ns*0.55, ns*0.42
    bw, bh = tw+padx*2, ns*CAP+pady*2
    top = 0.36*S - bh/2
    return (f'<g><rect x="{x:.2f}" y="{top:.2f}" width="{bw:.2f}" height="{bh:.2f}" '
            f'rx="{bh/2:.2f}" fill="none" stroke="{ink}" stroke-width="{S*0.013:.2f}" '
            f'stroke-opacity="0.55"/>'
            f'<text x="{x+padx:.2f}" y="{top+pady+ns*CAP:.2f}" font-family="{F}" '
            f'font-size="{ns:.2f}" font-weight="600" letter-spacing="{0.08*ns:.2f}" '
            f'fill="{ink}" fill-opacity="0.85">NOT</text></g>'), bw
def R(x, S, ink):
    ns = S*0.40
    return (f'<text x="{x:.2f}" y="{S*CAP:.2f}" font-family="{F}" font-size="{ns:.2f}" '
            f'font-weight="600" letter-spacing="{0.06*ns:.2f}" fill="{ink}" '
            f'fill-opacity="0.75">not</text>'), W_not*ns

DIRS = [
 ("M","Small caps, centred", M,  "NOT at 30% of the big words, centred between them. The safest step down."),
 ("N","Lowercase, centred",  N,  "Lowercase 'not' — softer, more spoken, and it lets TECH and TAPE dominate."),
 ("O","Tracked out",         O,  "Small caps with wide letter-spacing, so NOT reads as a label rather than a word."),
 ("P","Accent",              P,  "Same as M but in ochre — the one spot of colour, since the binary is now monochrome."),
 ("Q","In a pill",           Q,  "NOT inside a hollow outline, echoing the same rule that makes TAPE hollow."),
 ("R","On the baseline",     R,  "Lowercase, larger, sitting on the same baseline instead of centred."),
]

out = pathlib.Path(__file__).parent
(out / "svg5").mkdir(exist_ok=True)

def lockup(fn, code, S, ink, uid):
    g1 = g2 = S*0.26
    x_not = W_TECH*S + g1
    nsvg, nw = fn(x_not, S, ink)
    x_tape = x_not + nw + g2
    total = x_tape + W_TAPE*S + S*0.02
    return (f'<g>{tech(S, uid, ink)}{nsvg}{tape(x_tape, S, ink)}</g>'), (total, S*0.80)

def wrap(inner, w, h, pad=10, bg=None):
    r = f'<rect width="{w+pad*2:.1f}" height="{h+pad*2:.1f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w+pad*2:.1f} {h+pad*2:.1f}" '
            f'width="{w+pad*2:.1f}" height="{h+pad*2:.1f}">{r}'
            f'<g transform="translate({pad},{pad})">{inner}</g></svg>')

cards = []
for code, name, fn, idea in DIRS:
    big, (bw, bh) = lockup(fn, code, 56, INK_D, code+"d")
    lit, (lw, lh) = lockup(fn, code, 56, INK_L, code+"l")
    sml, (sw_, sh) = lockup(fn, code, 22, INK_D, code+"s")
    slug = name.lower().replace(" ", "-").replace(",", "")
    (out / "svg5" / f"{code}-{slug}-dark.svg").write_text(wrap(big, bw, bh, 16, BG))
    (out / "svg5" / f"{code}-{slug}-light.svg").write_text(wrap(lit, lw, lh, 16, "#f4efe6"))
    cards.append(f"""
<section class="d">
  <div class="d__h"><span class="d__id">{code}</span><h2>{name}</h2><p>{idea}</p></div>
  <div class="r">{wrap(big, bw, bh, 8)}</div>
  <div class="r r--light">{wrap(lit, lw, lh, 8)}</div>
  <div class="r"><span class="l">At size</span>{wrap(sml, sw_, sh, 5)}</div>
</section>""")

html = f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>Binary TECH — NOT treatments</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
 *{{box-sizing:border-box;margin:0;padding:0}}
 body{{background:{BG};color:{INK_D};font-family:{F};padding:52px 42px}}
 h1{{font-size:29px;font-weight:700;letter-spacing:-.03em}}
 .sub{{color:#ada496;margin-top:9px;font-size:15px;max-width:82ch;line-height:1.6}}
 .grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:38px;max-width:1540px}}
 .d{{border:1px solid rgba(255,236,214,.13);border-radius:18px;overflow:hidden}}
 .d__h{{padding:20px 24px;border-bottom:1px solid rgba(255,236,214,.13)}}
 .d__id{{font-size:10.5px;letter-spacing:.28em;text-transform:uppercase;color:#e07f57}}
 .d__h h2{{font-size:18px;font-weight:700;margin-top:5px;letter-spacing:-.02em}}
 .d__h p{{font-size:13px;color:#ada496;margin-top:6px;line-height:1.55}}
 .r{{padding:26px 24px;border-bottom:1px solid rgba(255,236,214,.09);display:flex;align-items:center;gap:18px}}
 .r:last-child{{border-bottom:none}}
 .r--light{{background:#f4efe6}}
 .l{{font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:#94897c;width:52px;flex:none}}
</style></head><body>
<h1>Binary TECH — six ways to handle NOT</h1>
<p class="sub">The 1s and 0s are now the same colour as the type: cream on your background, black on light.
The letterforms are outlined so TECH stays readable through the texture. TAPE stays hollow.</p>
<div class="grid">{''.join(cards)}</div>
</body></html>"""
(out / "explore-5.html").write_text(html)
print(f"wrote explore-5.html and {len(DIRS)*2} SVGs in logo/svg5/")
