#!/usr/bin/env python3
"""Round-2 logo directions. Single source for the marks: writes standalone
SVG files and the comparison sheet from the same definitions."""
import os, pathlib

SAGE, OCHRE, TERRA = "#4f6f52", "#bc8f3b", "#a8553a"
INK, CREAM, GREY = "#1c1917", "#faf7f2", "#8a8078"

# Each mark is a function of (bg, fg) so we can render light/dark variants.
# bg = the plate colour, fg = the colour that must contrast against it.

def beam(bg, fg):
    return f'''<rect x="12" y="15" width="40" height="9" rx="2.5" fill="{SAGE}"/>
  <rect x="27.5" y="24" width="9" height="19" rx="1" fill="{OCHRE}"/>
  <rect x="17" y="43" width="30" height="8" rx="2.5" fill="{TERRA}"/>'''

def notape(bg, fg):
    return f'''<circle cx="32" cy="32" r="19" fill="none" stroke="{GREY}" stroke-width="6"/>
  <circle cx="32" cy="32" r="5.5" fill="{GREY}"/>
  <rect x="28.5" y="5" width="7" height="54" rx="3.5" transform="rotate(45 32 32)" fill="{bg}"/>
  <rect x="29.75" y="7.5" width="4.5" height="49" rx="2.25" transform="rotate(45 32 32)" fill="{TERRA}"/>'''

def northstar(bg, fg):
    return f'''<path d="M32 7 36.6 25.2 55 32 36.6 38.8 32 57 27.4 38.8 9 32 27.4 25.2Z" fill="{SAGE}"/>
  <path d="M32 7 36.6 25.2 55 32 36.6 38.8Z" fill="{OCHRE}"/>
  <circle cx="32" cy="32" r="3.4" fill="{TERRA}"/>'''

def seam(bg, fg):
    return f'''<path d="M12 17H36V31H27V47H12Z" fill="{SAGE}"/>
  <path d="M36 17H52V47H27V33H36Z" fill="{OCHRE}"/>
  <rect x="27" y="31" width="9" height="2" fill="{bg}"/>'''

def unbroken(bg, fg):
    return f'''<path d="M14 19H50V32H22V45H50" fill="none" stroke="{OCHRE}" stroke-width="9"
    stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="14" cy="19" r="4.5" fill="{SAGE}"/>
  <circle cx="50" cy="45" r="4.5" fill="{TERRA}"/>'''

def level(bg, fg):
    return f'''<rect x="8" y="25" width="48" height="15" rx="4.5" fill="{SAGE}"/>
  <path d="M32 25h19.5a4.5 4.5 0 0 1 4.5 4.5v6a4.5 4.5 0 0 1-4.5 4.5H32Z" fill="{TERRA}"/>
  <rect x="24" y="28" width="16" height="9" rx="4.5" fill="{bg}"/>
  <circle cx="32" cy="32.5" r="3" fill="{OCHRE}"/>'''

DIRECTIONS = [
    ("G", "The Beam", beam,
     "A structural column: top plate, web, base plate. The thing that carries load "
     "because of how it is made. Reads as engineering, not decoration."),
    ("H", "No Tape", notape,
     "A roll of tape with a bold stroke through it. The most literal reading of the "
     "name, and the only mark here that a stranger decodes in one second."),
    ("I", "North Star", northstar,
     "Minneapolis, the North Star State, and the thing you steer by. Warm, local, "
     "and it carries no software-industry baggage at all."),
    ("J", "The Seam", seam,
     "Two blocks interlocked with a clean stepped seam. The dovetail idea from the "
     "first round, drawn big enough that the joint actually reads."),
    ("K", "Unbroken", unbroken,
     "One continuous stroke that never lifts — one person, start to finish, nothing "
     "spliced in. The dots mark where it starts and where it ends."),
    ("L", "The Level", level,
     "A spirit level with the bubble dead centre. Straight and true, checked before "
     "it ships. A real tool, and nobody else in software is using it."),
]

out = pathlib.Path(__file__).parent
(out / "svg").mkdir(exist_ok=True)

def plate(body, bg, rounded=True):
    plate = f'<rect width="64" height="64" rx="15" fill="{bg}"/>' if rounded else ''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  {plate}
  {body}
</svg>'''

# ---- standalone SVG files -------------------------------------------------
for code, name, fn, _ in DIRECTIONS:
    slug = name.lower().replace(" ", "-")
    (out / "svg" / f"{code}-{slug}-dark.svg").write_text(plate(fn(INK, CREAM), INK))
    (out / "svg" / f"{code}-{slug}-light.svg").write_text(plate(fn(CREAM, INK), CREAM))
    # plateless: mark on transparent, for placing on any background
    (out / "svg" / f"{code}-{slug}-bare.svg").write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  {fn("#ffffff", INK)}
</svg>''')

# ---- comparison sheet -----------------------------------------------------
cards = []
for code, name, fn, idea in DIRECTIONS:
    dark, light = fn(INK, CREAM), fn(CREAM, INK)
    cards.append(f'''
<section class="dir">
  <div class="dir__head">
    <div class="dir__id">Direction {code}</div>
    <div class="dir__name">{name}</div>
    <div class="dir__idea">{idea}</div>
  </div>
  <div class="row">
    <span class="lbl">Mark</span>
    <svg width="92" height="92" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="{INK}"/>{dark}</svg>
    <svg width="92" height="92" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="{CREAM}" stroke="#e9e4db"/>{light}</svg>
    <svg width="92" height="92" viewBox="0 0 64 64">{fn("#ffffff", INK)}</svg>
  </div>
  <div class="row">
    <span class="lbl">Lockup</span>
    <svg width="300" height="52" viewBox="0 0 300 52">
      <g transform="translate(0,6) scale(.625)">{fn("#faf8f4", INK)}</g>
      <text x="50" y="33.5" font-family="Inter" font-size="21" font-weight="700"
            letter-spacing="-.5" fill="{INK}">Tech Not Tape</text>
    </svg>
  </div>
  <div class="row row--dark">
    <span class="lbl">Reversed</span>
    <svg width="300" height="52" viewBox="0 0 300 52">
      <g transform="translate(0,6) scale(.625)">{fn(INK, CREAM)}</g>
      <text x="50" y="33.5" font-family="Inter" font-size="21" font-weight="700"
            letter-spacing="-.5" fill="{CREAM}">Tech Not Tape</text>
    </svg>
  </div>
  <div class="row">
    <span class="lbl">Favicon</span>
    <div class="tiny">
      <svg width="32" height="32" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="{INK}"/>{dark}</svg>
      <svg width="24" height="24" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="{INK}"/>{dark}</svg>
      <svg width="16" height="16" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="{INK}"/>{dark}</svg>
    </div>
  </div>
</section>''')

html = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>Tech Not Tape — logo directions, round 2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root{{--bg:#faf8f4;--paper:#fff;--line:#e9e4db;--ink:#1c1917;--ink-soft:#57534e;
        --ink-faint:#a8a29e;--terracotta:#a8553a}}
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{background:var(--bg);color:var(--ink);font-family:Inter,system-ui,sans-serif;padding:56px 44px}}
  h1{{font-size:30px;font-weight:700;letter-spacing:-.02em}}
  .sub{{color:var(--ink-soft);margin-top:8px;font-size:15px;max-width:74ch;line-height:1.6}}
  .sheet{{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;margin-top:40px;max-width:1520px}}
  .dir{{background:var(--paper);border:1px solid var(--line);border-radius:20px;overflow:hidden}}
  .dir__head{{padding:20px 26px;border-bottom:1px solid var(--line)}}
  .dir__id{{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--terracotta)}}
  .dir__name{{font-size:19px;font-weight:700;margin-top:5px;letter-spacing:-.01em}}
  .dir__idea{{font-size:13.5px;color:var(--ink-soft);margin-top:6px;line-height:1.55}}
  .row{{display:flex;align-items:center;gap:26px;padding:26px;border-bottom:1px solid var(--line);min-height:126px}}
  .row:last-child{{border-bottom:none}}
  .row--dark{{background:var(--ink)}}
  .lbl{{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
        color:var(--ink-faint);width:62px;flex:none;line-height:1.4}}
  .row--dark .lbl{{color:#7c736b}}
  .tiny{{display:flex;align-items:center;gap:18px}}
</style></head>
<body>
<h1>Tech Not Tape — round two</h1>
<p class="sub">Six new directions, deliberately away from the first set. Each shown on charcoal,
on cream, and bare; then as a header lockup, reversed, and at 32/24/<strong>16&nbsp;px</strong> —
16px is the real browser-tab size, which is where most marks fall apart.</p>
<div class="sheet">{''.join(cards)}</div>
</body></html>'''

(out / "explore-2.html").write_text(html)
print(f"wrote explore-2.html and {len(DIRECTIONS)*3} SVG files in logo/svg/")
