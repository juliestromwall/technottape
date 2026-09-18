#!/usr/bin/env python3
"""Open Graph share image, 1200x630 — the size Facebook, LinkedIn and X use."""
import importlib.util, pathlib
spec = importlib.util.spec_from_file_location(
    "card", str(pathlib.Path(__file__).resolve().parents[1] / "business-card/generate.py"))
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)

W, H = 1200, 630
VOID, INK = c.VOID, c.INK
field = c.field(W, H, 30, 16, seed=17, bias=-0.04, fade="left")

html = f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:{W}px;height:{H}px;background:{VOID};overflow:hidden;position:relative;
     font-family:Inter,sans-serif}}
.px{{position:absolute;inset:-12%;width:124%;height:124%;z-index:0}}
.vig{{position:absolute;inset:0;z-index:1;
     background:linear-gradient(100deg,{VOID} 16%,rgba(13,11,10,.72) 56%,rgba(13,11,10,.12) 100%)}}
.wrap{{position:absolute;inset:0;z-index:2;padding:74px 80px;
      display:flex;flex-direction:column;justify-content:center}}
.wm{{width:330px;margin-bottom:46px}}
.solid{{font-size:74px;line-height:.92;font-weight:600;letter-spacing:-.048em;
       text-transform:uppercase;color:{INK}}}
.hollow{{font-size:53px;line-height:.96;font-weight:600;letter-spacing:-.048em;
        text-transform:uppercase;color:transparent;
        -webkit-text-stroke:2.1px rgba(226,219,206,.9);margin-top:10px}}
.foot{{position:absolute;left:80px;bottom:60px;z-index:3;display:flex;align-items:center;gap:16px}}
.dot{{width:9px;height:9px;border-radius:9px}}
.url{{font-size:22px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#cfc7bb}}
</style></head><body>
<svg class="px" viewBox="0 0 {W} {H}" preserveAspectRatio="none">{field}</svg>
<div class="vig"></div>
<div class="wrap">
  <div class="wm">{c.wordmark(uid="ogw")}</div>
  <div class="solid">Software<br>that holds.</div>
  <div class="hollow">Ditch the tape.</div>
</div>
<div class="foot">
  <span class="dot" style="background:{c.SAGE}"></span>
  <span class="dot" style="background:{c.OCHRE}"></span>
  <span class="dot" style="background:{c.TERRA}"></span>
  <span class="url">technottape.com</span>
</div>
</body></html>"""

out = pathlib.Path(__file__).parent / "og.html"
out.write_text(html)
print("wrote", out)
