#!/usr/bin/env python3
"""Business card for technottape.com.

Design language taken from the site's hero: a field of small coloured blocks
on warm near-black, plus the binary wordmark and the binary-T icon.
Trim 3.5x2in, bleed 0.125in all round, safe margin 0.25in inside trim.
"""
import pathlib, math

VOID, INK = "#0d0b0a", "#f7f3ea"
SAGE, OCHRE, TERRA = "#7fae83", "#e6b455", "#e07f57"
SLATE = "#2a221d"

# ---------- the pixel field, same idea as the WebGL hero ----------
def shade(hexcol, f):
    """Lighten (f>1) or darken (f<1) a hex colour."""
    h = hexcol.lstrip("#")
    r, g_, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    cl = lambda v: max(0, min(255, int(v * f)))
    return f"#{cl(r):02x}{cl(g_):02x}{cl(b):02x}"

def cube(x, y, size, colour, op):
    """A little extruded block: front face, lighter top, darker right side —
    the same shapes the hero's WebGL grid draws."""
    d = size * 0.30
    top  = shade(colour, 1.34)
    side = shade(colour, 0.62)
    return (f'<g opacity="{op}">'
            f'<polygon points="{x:.2f},{y:.2f} {x+d:.2f},{y-d:.2f} '
            f'{x+size+d:.2f},{y-d:.2f} {x+size:.2f},{y:.2f}" fill="{top}"/>'
            f'<polygon points="{x+size:.2f},{y:.2f} {x+size+d:.2f},{y-d:.2f} '
            f'{x+size+d:.2f},{y+size-d:.2f} {x+size:.2f},{y+size:.2f}" fill="{side}"/>'
            f'<rect x="{x:.2f}" y="{y:.2f}" width="{size:.2f}" height="{size:.2f}" fill="{colour}"/>'
            f'</g>')


def field(w, h, cols, rows, seed=7, bias=0.0, fade="right"):
    """Deterministic grid of blocks; density and colour fall off across it."""
    cw, ch = w / cols, h / rows
    out, v = [], seed
    for r in range(rows):
        for c in range(cols):
            v = (v * 1103515245 + 12345) & 0x7fffffff
            f = ((v >> 16) & 0xFFFF) / 0xFFFF
            # position 0..1 across the fade axis
            t = (c / (cols - 1)) if fade == "right" else (1 - c / (cols - 1))
            t = max(0.0, min(1.0, t + bias))
            if f > 0.46 + t * 0.44:          # sparser toward the far side
                continue
            v = (v * 1103515245 + 12345) & 0x7fffffff
            g = ((v >> 16) & 0xFFFF) / 0xFFFF
            col = TERRA if g > 0.74 else OCHRE if g > 0.50 else SAGE if g > 0.32 else SLATE
            op = round(0.30 + (1 - t) * 0.95 * (0.5 + g * 0.5), 3)
            size = cw * (0.40 + g * 0.26)
            x = c * cw + (cw - size) / 2
            y = r * ch + (ch - size) / 2
            out.append(cube(x, y, size, col, op))
    # a slight tilt, the way the hero grid sits in perspective
    return f'<g transform="rotate(-5 {w/2:.0f} {h/2:.0f})">{"".join(out)}</g>' 

# ---------- wordmark, measured ratios from the site ----------
S, CAP = 100.0, 72.0
W_TECH, W_TAPE = 2.599 * S, 2.401 * S
NS = S * 0.30
W_NOT = 2.397 * NS
GAP = 0.26 * S
X_NOT = W_TECH + GAP
X_TAPE = X_NOT + W_NOT + GAP
TOTAL = X_TAPE + W_TAPE
BITS = ['010110010111001011010011100101', '110100101100110100101110010110',
        '001011101001011011001010110100', '101001011010100110100101100111']

def wordmark(ink=INK, uid="w"):
    rh = CAP / len(BITS)
    rows = "".join(
        f'<text x="-2" y="{i*rh+rh*0.82:.2f}" font-family="ui-monospace,Menlo,monospace" '
        f'font-size="{rh*0.82:.2f}" letter-spacing="{rh*0.06:.2f}" fill="{ink}" '
        f'fill-opacity="0.92">{r}</text>' for i, r in enumerate(BITS))
    tech = (f'<text x="0" y="{CAP}" font-family="Inter" font-size="{S}" font-weight="800" '
            f'letter-spacing="{-0.045*S}">TECH</text>')
    return (f'<svg viewBox="-4 -5 {TOTAL+10:.0f} {CAP+12}" width="100%" style="display:block">'
            f'<defs><clipPath id="{uid}">{tech}</clipPath></defs>'
            f'<g clip-path="url(#{uid})">{rows}</g>'
            + tech.replace('>TECH<', f' fill="none" stroke="{ink}" stroke-width="{S*0.017}" '
                                      f'stroke-opacity="0.9">TECH<') +
            f'<text x="{X_NOT:.1f}" y="{0.36*(S+NS):.1f}" font-family="Inter" font-size="{NS:.1f}" '
            f'font-weight="600" letter-spacing="{0.08*NS:.2f}" fill="{ink}" fill-opacity="0.85">NOT</text>'
            f'<text x="{X_TAPE:.1f}" y="{CAP}" font-family="Inter" font-size="{S}" font-weight="700" '
            f'letter-spacing="{-0.045*S}" fill="none" stroke="{ink}" stroke-width="{S*0.021}" '
            f'stroke-opacity="0.85">TAPE</text></svg>')

ICON = pathlib.Path(__file__).resolve().parents[1] / "logo/favicon/binary-t-bold.svg"
icon_svg = ICON.read_text().replace('width="64" height="64"', 'width="100%" height="100%"')
# the back sits on the dark field, so the chip is inverted to read against it
icon_light = (icon_svg.replace('fill="#0d0b0a"', 'fill="#f4efe6"')
                      .replace('fill="#f7f3ea"', 'fill="#12100e"'))


ICONS = {
    "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/>',
    "mail":  '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
}

def icon(name, colour, px=9.5):
    return (f'<svg viewBox="0 0 24 24" width="{px}" height="{px}" fill="none" '
            f'stroke="{colour}" stroke-width="2.1" stroke-linecap="round" '
            f'stroke-linejoin="round" style="flex:none">{ICONS[name]}</svg>')

PILLARS = [("Sort", "#a8d1ac"), ("Build", "#f0c069"), ("Launch", "#ef9068"), ("Support", INK)]

CSS = f"""
*{{box-sizing:border-box;margin:0;padding:0}}
html{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
body{{font-family:Inter,-apple-system,Helvetica,Arial,sans-serif;background:#3a3a3a}}
@page{{size:3.75in 2.25in;margin:0}}
.card{{position:relative;width:3.75in;height:2.25in;overflow:hidden;background:{VOID};
      page-break-after:always;break-after:page}}
.card:last-child{{page-break-after:auto;break-after:auto}}
.px{{position:absolute;inset:-14%;width:128%;height:128%;z-index:0}}
.inner{{position:absolute;inset:0.375in;z-index:2;display:flex;flex-direction:column}}

.wm{{width:1.44in}}
.rule{{display:flex;gap:2px;margin:0.10in 0 0.13in}}
.rule i{{height:2.5px;border-radius:2px;display:block}}
.name{{font-size:9.5pt;font-weight:700;letter-spacing:.13em;color:{INK};text-transform:uppercase}}
.role{{font-size:6pt;font-weight:500;letter-spacing:.2em;color:{OCHRE};
       text-transform:uppercase;margin-top:3px}}
.contact{{margin-top:auto;font-size:7.4pt;line-height:1.5;color:#cfc7bb;letter-spacing:.005em}}
.contact div{{display:flex;align-items:center;gap:6px;margin-top:4px}}
.contact b{{color:{INK};font-weight:600}}
.pillars{{position:absolute;right:0.375in;bottom:0.375in;z-index:3;text-align:right;
          padding:8px 10px 8px 22px;
          background:radial-gradient(135% 145% at 80% 55%, rgba(13,11,10,.985) 52%, rgba(13,11,10,0) 100%)}}
.pillars span{{display:block;font-size:8.6pt;font-weight:800;letter-spacing:.1em;
              text-transform:uppercase;line-height:1.32}}

.backwrap{{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;
           align-items:center;justify-content:center;gap:0.15in}}
.lockup{{position:absolute;left:0.375in;right:0.375in;top:50%;transform:translateY(-50%);
         z-index:3;text-transform:uppercase}}
.lockup .solid{{font-size:20.5pt;line-height:0.9;font-weight:600;letter-spacing:-0.048em;
                color:{INK}}}
.lockup .hollow{{font-size:14.8pt;line-height:0.94;font-weight:600;letter-spacing:-0.048em;
                 color:transparent;-webkit-text-stroke:0.95px rgba(226,219,206,0.9);
                 margin-top:0.055in}}
.icon{{width:0.82in;height:0.82in;filter:drop-shadow(0 2px 10px rgba(0,0,0,.55))}}
.tag{{font-size:7pt;letter-spacing:.34em;text-transform:uppercase;color:#cfc7bb}}
.vignette{{position:absolute;inset:0;z-index:1;pointer-events:none}}
"""

def build(show_guides=False):
    guides = ''
    front_px = field(3.75*96, 2.25*96, 34, 20, seed=11, bias=-0.06, fade="left")
    back_px  = field(3.75*96, 2.25*96, 34, 20, seed=29, bias=-0.10, fade="right")
    return f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>

<div class="card">
  <svg class="px" viewBox="0 0 {3.75*96} {2.25*96}" preserveAspectRatio="none">{front_px}</svg>
  <svg class="vignette" viewBox="0 0 100 100" preserveAspectRatio="none">
    <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0.10" stop-color="{VOID}" stop-opacity="0.96"/>
      <stop offset="0.48" stop-color="{VOID}" stop-opacity="0.72"/>
      <stop offset="1" stop-color="{VOID}" stop-opacity="0.05"/>
    </linearGradient></defs>
    <rect width="100" height="100" fill="url(#fg)"/></svg>
  <div class="inner">
    <div class="wm">{wordmark(uid="wf")}</div>
    <div class="name" style="margin-top:0.13in">Julie Stromwall</div>
    <div class="role">Websites &amp; software</div>
    <div class="contact">
      <div>{icon("phone", SAGE)}<b>970.333.4481</b></div>
      <div>{icon("mail", OCHRE)}<span>hello@technottape.com</span></div>
      <div>{icon("globe", TERRA)}<span>technottape.com</span></div>
    </div>
  </div>
  <div class="pillars">
    {"".join(f'<span style="color:{c}">{t}</span>' for t, c in PILLARS)}
  </div>
  {guides}
</div>

<div class="card">
  <svg class="px" viewBox="0 0 {3.75*96} {2.25*96}" preserveAspectRatio="none">{back_px}</svg>
  <svg class="vignette" viewBox="0 0 100 100" preserveAspectRatio="none">
    <defs><radialGradient id="bg2" cx="0.5" cy="0.5" r="0.62">
      <stop offset="0.14" stop-color="{VOID}" stop-opacity="0.86"/>
      <stop offset="0.60" stop-color="{VOID}" stop-opacity="0.62"/>
      <stop offset="1" stop-color="{VOID}" stop-opacity="0.05"/>
    </radialGradient></defs>
    <rect width="100" height="100" fill="url(#bg2)"/></svg>
  <div class="lockup">
    <div class="solid">Software<br>that holds.</div>
    <div class="hollow">Ditch the tape.</div>
  </div>
  {guides}
</div>
</body></html>"""

out = pathlib.Path(__file__).parent
(out / "card.html").write_text(build())
(out / "card-print.html").write_text(build())
print("wrote card.html and card-print.html — no trim guides")
