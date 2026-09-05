# Brand assets

Generated PNGs in `png/`. Sources live in `../logo/`.

## Wordmark — TECH (binary) · NOT · TAPE

| File | Use |
|---|---|
| `wordmark-on-dark-1600.png` / `-800` | On the brand's dark ground |
| `wordmark-on-light-1600.png` / `-800` | On cream |
| `wordmark-on-white-1600.png` / `-800` | On white — documents, invoices |
| `wordmark-transparent-light-ink-*` | Transparent, pale ink — place on dark |
| `wordmark-transparent-dark-ink-*` | Transparent, dark ink — place on light |

## Icon — the binary T

| File | Use |
|---|---|
| `icon-on-dark-{1024,512,180,64}.png` | The favicon artwork; app icons, avatars |
| `icon-on-light-*` | Same on cream |
| `icon-transparent-light-ink-*` | Transparent, pale ink — place on dark |
| `icon-transparent-dark-ink-*` | Transparent, dark ink — place on light |

Social avatars: use `icon-on-dark-512.png`. Anything needing a large square
(app icon, profile picture): `icon-on-dark-1024.png`.

## Two gotchas worth remembering

Both were caught by measuring the output rather than trusting the render:

1. **SVG intrinsic size.** The source files carry `width`/`height`, so dropped
   into a larger canvas they render small in a corner rather than scaling. The
   first icon export put ~48px of art in the middle of a 1024px file. The
   generator now forces `width="100%"`.
2. **Near-black ink on transparency.** A pixel check that compares colour
   against the corner cannot tell `#12100e` ink from transparent black — it
   reports the file as empty when it is fine. Check the **alpha** channel.
