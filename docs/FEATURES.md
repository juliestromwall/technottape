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

- **2026-09-02:** Site built from scratch — five pages, brand system, contact
  form with mailto fallback, sitemap/robots/favicon, verified in Chromium at
  1440px and 390px. Fixed low-contrast step text on the dark process band and a
  wrapping logo in the mobile nav.
