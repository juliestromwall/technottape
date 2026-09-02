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
