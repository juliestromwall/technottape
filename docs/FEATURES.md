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
