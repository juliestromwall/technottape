# Session Log

## 2026-09-02

**Worked on:** Built technottape.com from scratch — the marketing site for Tech
Not Tape, Julie's websites-and-software business.

**Decisions taken with Julie up front:**
- The site is a **business services site**, not a portfolio. `juliestromwall.com`
  stays as the personal PM portfolio.
- **Multi-page**, not a single landing page.
- **Betora's palette** (sage / ochre / terracotta on warm paper), reused here at
  Julie's request. Flagged that the two brands now read as one; trivially
  reversible since it is all CSS custom properties.
- **Contact form** wanted, not just mailto links.

**Changes made:**
- New repo at `~/Projects/technottape`. Next.js 16, App Router, static export,
  plain JavaScript, plain CSS — no Tailwind, no TypeScript.
- Design system in `app/globals.css`: surfaces, brand accents, signature
  gradient, buttons, cards, nav, hero, steps, work list, forms, footer, and
  three responsive breakpoints.
- Five pages — Home, Services, Work, About, Contact — plus a 404.
- Copy written from the brand's existing positioning on the business card:
  "Custom Websites & Software for Small Business", Build / Launch / Support.
  Leaned into the name — the "held together with tape" problem section.
- Work page describes the four real projects (medical records platform,
  RepCommish, journey management, provider network) **without client names**,
  with no invented metrics or testimonials.
- `ContactForm` posts to Formspree when an ID is configured, and otherwise opens
  a pre-filled `mailto:` so no enquiry is silently lost. Honeypot field for spam.
- `app/site.js` as the single source for name, email, phone, location, nav, and
  the Formspree ID.
- SEO basics: per-page title/description/canonical, generated sitemap,
  robots.txt, SVG favicon from the bar mark.
- Portrait reused from the portfolio repo (`public/julie.jpg`).

**Verified:** production build clean (9 static routes). Chromium at 1440px and
390px across all five pages — no console errors, no failed requests. Two real
bugs found and fixed in the process:
- `.step p` overrode `.section--dark p` at equal specificity, rendering the
  process steps in near-black on the charcoal band.
- The mobile nav crowded at 390px — the logo wrapped to two lines. Desktop CTA
  now hides below 720px and the logo no longer wraps.

**Next steps:**
1. **Create the Cloudflare Pages project** and connect the GitHub repo
   (`docs/DEPLOY.md` step 1).
2. **Move nameservers off Hostinger parking** (`byte`/`pixel.dns-parking.com`)
   to Cloudflare, then attach the custom domain. No mail exists on this domain,
   so unlike the juliestromwall.com cutover there is nothing to protect.
3. **Set up Formspree** and paste the ID into `app/site.js` — the form is a
   mailto fallback until then.
4. Decide on email: `hello@technottape.com` needs MX records. Cloudflare Email
   Routing is free and would take minutes once DNS is on Cloudflare.

**Open questions:**
- Should the palette diverge from Betora's, given both are Julie's brands?
- Does Tech Not Tape want its own email address, or is
  `hello@juliestromwall.com` the long-term answer?
- Any real client work that *can* be named, with logos or a testimonial? The
  Work page is deliberately anonymous right now, which is honest but less
  persuasive than a named reference would be.

## 2026-09-02 (later)

**Worked on:** Corrected the location, explored logos, then a full copy pass.

**Changes made:**
- **Location fixed: Minneapolis, MN, not Colorado.** I had assumed Colorado from
  the old portfolio context and it was wrong. Corrected in `app/site.js`, the
  layout metadata, the About page, and `docs/PRODUCT.md`.
- Logo: twelve directions across two rounds in `logo/`, driven by `logo/build.py`
  (mark geometry lives once and generates both the preview sheet and the SVG
  files). All exported to `logo/svg/`. **No direction chosen — parked.** The site
  still carries the placeholder bar mark.
- **Copy pass across all five pages:**
  - Cut **"One person. Fifteen years of shipping."** — I had invented that
    number. Now "One person, who has built this before," which the rest of the
    page actually supports.
  - Minneapolis moved into the hero. It had only been in the footer, which is
    useless for a local services business and for local search.
  - Converted the site to contractions throughout. It had been written in a
    stiff, formal register ("you do not need", "that is my failure") while
    claiming to speak plainly.
  - De-duplicated four lines that ran verbatim on two pages each — "software is
    never finished", "the part where projects stall", "the piece you're stuck
    on", and the "nobody asked the right questions" argument.
  - Second CTA relabelled "See what I do" → "What I build".

**Verified:** build clean, no console errors, and a repeated-phrase audit over
the built HTML in `out/` now shows no body copy shared between pages (only the
nav and footer chrome, which is meant to repeat).

**Next steps:**
1. Cloudflare Pages project + DNS cutover (`docs/DEPLOY.md`) — still the blocker
   on going live.
2. Formspree ID into `app/site.js`.
3. Logo: pick a direction, or decide the site ships wordmark-only.

**Open questions — things only Julie can answer:**
- **Is "Taking on new projects" true right now?** It's in the hero pill.
- **Pricing.** The site says "fixed price, agreed up front" but names no number
  or range. Small-business buyers commonly bounce without one. A "projects
  typically start at £X" line would convert better — I don't know the figure.
- **Can any client be named?** The Work page is anonymous, which is honest but
  much less persuasive than one named reference or a single real quote.
- **How long has she actually been doing this?** A true number would strengthen
  the About page; I removed the invented one rather than guess again.
