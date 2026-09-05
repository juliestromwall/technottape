# Features

## Components

| Component | Location | Description |
|-----------|----------|-------------|
| Nav | `app/components/Nav.jsx` | Sticky blurred header, active-route highlighting, phone link, CTA button, mobile hamburger menu (client component) |
| Footer | `app/components/Footer.jsx` | Dark footer — brand blurb, site links, contact details, auto-updating copyright year |
| Mark | `app/components/Mark.jsx` | Inline SVG logo: three squared bars in sage/ochre/terracotta on charcoal |
| Icons | `app/components/Icons.jsx` | Stroked 24px icon set — Check, Arrow, Build, Launch, Support, Mail, Phone, Pin, Menu, Close |
| CtaBand | `app/components/CtaBand.jsx` | Reusable gradient call-to-action band; title and body overridable per page |
| ContactForm | `app/components/ContactForm.jsx` | Client-side enquiry form — Formspree POST, honeypot field, status messages, `mailto:` fallback when no Formspree ID is set |
| Site config | `app/site.js` | Single source for name, domain, email, phone, location, nav items, Formspree ID |

## Sections

| Section | Page | Description |
|---------|------|-------------|
| Hero | Home | Availability pill, gradient headline, lead copy, CTAs, Built/Launched/Supported showcase panel |
| Problem | Home | "Why the name" — three tinted cards on what goes wrong with patched-together tech |
| Services | Home | Three service cards with coloured icon badges, linking to `/services/` |
| Process | Home | Dark three-step band — talk, fixed scope, ship and keep working |
| Who you get | Home | Julie's background with a checklist of platform types built |
| Service detail | Services | Anchor-linked deep sections for Build, Launch, Support with six checklist items each |
| Pricing posture | Services | Dark band — fixed price, no hourly meter, monthly support |
| Work list | Work | Four projects: meta label, title, description, capability tags |
| Small jobs | Work | Explicit note that small websites and setup jobs are welcome |
| About intro | About | Portrait plus three-paragraph bio and the origin of the name |
| How I work | About | Four principle cards |
| Background | About | Dark band with a five-item experience checklist |
| Contact | Contact | Form alongside phone/email/location card and a "what happens next" list |

## Infrastructure

| Piece | Location | Description |
|---|---|---|
| Static export | `next.config.mjs` | `output: 'export'`, unoptimized images, trailing slashes |
| Sitemap | `app/sitemap.js` | Generates `/sitemap.xml` for all five routes |
| robots.txt | `public/robots.txt` | Allows all, points at the sitemap |
| Favicon | `app/icon.svg` | The bar mark, served by Next's icon convention |
| Per-page SEO | each `page.jsx` | Title, description, and canonical URL per route |
| Node version | `.nvmrc` | 22, matching the Cloudflare Pages build |

## Changelog

- **2026-09-02:** Copy pass across all five pages — removed a fabricated
  "fifteen years" claim, put Minneapolis in the hero, switched the whole site to
  contractions so it reads like speech, and de-duplicated four lines that
  appeared verbatim on two pages each. Added a repeated-copy audit over the
  built HTML.

- **2026-09-02:** Site built from scratch — five pages, brand system, contact
  form with mailto fallback, sitemap/robots/favicon, verified in Chromium at
  1440px and 390px. Fixed low-contrast step text on the dark process band and a
  wrapping logo in the mobile nav.

## Immersive redesign (branch: `redesign-immersive`)

| Piece | Location | Description |
|---|---|---|
| Design system | `app/globals.css` | Dark system on near-black `#08080a`; brand accents lifted for a dark ground; uppercase display type; grain + vignette overlay |
| HeroCanvas | `app/components/HeroCanvas.jsx` | three.js `InstancedMesh` grid (one draw call). Idle wave, pointer displacement with colour bloom, scroll tilt/recede. Falls back to nothing if WebGL is unavailable; static single frame under reduced motion |
| SmoothScroll | `app/components/SmoothScroll.jsx` | Lenis inertia scrolling; intercepts in-page anchors; disabled under reduced motion |
| Cursor | `app/components/Cursor.jsx` | Glowing ochre core (tracks exactly) + difference-blended ring (lags) + 5-dot comet trail, so the pointer is easy to find on a near-black page. Ring fills and shows a contextual label over interactive targets — Call / Email / Send / Type / View / Read / More / Open, overridable per element with `data-cursor`. Shrinks on mousedown. Fine pointers only |
| CursorToggle | `app/components/CursorToggle.jsx` | Nav button that switches back to the system cursor; persisted in localStorage, shared with the cursor via `app/cursor-pref.js`. The escape hatch for anyone who dislikes custom cursors |
| Motion | `app/components/Motion.jsx` | One IntersectionObserver for every `.reveal` / `.kinetic` on the page; re-runs per route |
| SplitText | `app/components/SplitText.jsx` | Server component splitting a line into per-character spans for the staggered reveal; real text in the HTML |
| Nav | `app/components/Nav.jsx` | Fixed, blurs and shrinks on scroll; full-screen clip-path overlay menu on mobile |

**Robustness:** an inline pre-paint script adds `js-motion` to `<html>`, and only
that class arms the hidden state. With JS off or broken, every page renders as
plain readable content instead of blank. Verified: 183–548 words of visible copy
per page with JavaScript disabled.

## Portrait frame (About)

`.media-wrap` / `.media` in `app/globals.css`. The photo sits in a frame with
24px rounded corners, a 1px border, and a deep shadow. A sage outline offset
22px behind it supplies the depth; a soft top-left sheen makes it read as a
physical object. On hover the photo lifts 6px, the shadow deepens, and the
offset outline slides in to 12px and warms to ochre.

The image is full colour at all times — no grayscale treatment.

## Interactive sections (replacing the numbered boxes)

Four sections previously used the same numbered-cell pattern. Each now has its
own treatment, and all are keyboard accessible:

| Component | Where | Behaviour |
|---|---|---|
| `Accordion.jsx` | Home problems, Services pricing, About principles | One panel open at a time; real `<button>` with `aria-expanded`/`aria-controls`; height animates via `grid-template-rows: 0fr→1fr` |
| `PillarPicker.jsx` | Home "what I do" | Tablist of the four pillars; switches on hover, click, focus, and arrow keys; panel cross-fades |
| `Stepper.jsx` | Home process | Dots on a rail that draws left-to-right on scroll; hovering a step fills its dot |
| `SwapList.jsx` | Home "off paper" | before → after rows; the "before" strikes through on scroll and on hover |
| `NodeCanvas.jsx` | Home "off paper" backdrop | Second WebGL scene — drifting nodes that link when close and lean toward the pointer. Deliberately a different idea from the hero's block grid |

Numbers now appear only on the Work index, where an index genuinely reads as
numbered. Checklists use a dash rule instead of `01/02/03`.

**No-JS:** every accordion body and all four pillar panels render visible;
collapsing is armed only by `html.js-motion`. Verified at 1022 words on the
home page with JavaScript disabled.

## Positioning

`app/pillars.js` is the single source for Sort / Build / Launch / Support —
home and `/services` both render from it. **Sort** covers workflow mapping,
SOPs, and bottleneck consulting; **Launch** now carries the secure-cloud,
encryption, backup, and access-control story. The home page has an "Off paper"
section aimed at businesses that have never used anything formal.

## Kinetic heading mask (bug fix)

The reveal mask originally sat on `.k-line` with `overflow: hidden`, and each
character translated down 105% of its own height. That works only while a line
occupies exactly one visual row. When a line wrapped to two rows, the first
row's characters slid down into the second row's space — still inside the box,
so they were never clipped and were visible before the animation ran.

The mask now sits on `.k-word` instead. A word never wraps inside itself, so
each mask is always exactly one row tall and wrapping between words is
harmless. Verified at 1512 / 1180 / 390px: 0 of 46 masks multi-row, and 0% of
the first character visible 90ms after load.

**Outline treatment:** the word "tape" is rendered stroke-only wherever it
appears — the hero's second line, the "with tape." heading, and the footer
wordmark. `.outline-text` carries it, with a heavier stroke at hero size.
