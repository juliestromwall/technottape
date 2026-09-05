# Email signature

`signature.html` — paste-ready for Gmail. `preview.html` shows it under a real
reply on light and dark backgrounds.

## Install in Gmail

1. Open `preview.html` in a browser
2. Select the signature block (from the wordmark down to the Minneapolis line)
   and copy — **copy the rendered page, not the HTML source**
3. Gmail → Settings (gear) → **See all settings** → **General** → Signature
4. Create a signature, paste, **Save changes** at the bottom

Set it for both "For new emails" and "On reply/forward".

## Why it is built this way

- **Tables and inline styles only.** Gmail strips `<style>` blocks and ignores
  flex and grid.
- **PNG, never SVG.** Most mail clients will not render SVG.
- **An explicit white card.** Dark-mode clients invert text unpredictably and
  never invert images. Without a fixed background the wordmark floated on a
  white plate while the name disappeared entirely — both visible in
  `preview.html` before this was added. The card renders identically
  everywhere.
- **System font stack.** Inter is not installed on recipients' machines.
- The wordmark is hot-linked from `https://technottape.com/signature-wordmark.png`,
  so it must stay published at that path.
