# Product — Tech Not Tape

## Overview

**Tech Not Tape** is Julie Stromwall's services business: custom websites and
software for small businesses, built / launched / supported by one person.

`technottape.com` is the **marketing website** for that business. It is separate
from `juliestromwall.com`, which stays as the personal, password-gated PM
portfolio.

The name is the positioning: most small-business tech is held together with
tape — a site someone's nephew built, a spreadsheet doing a database's job,
three tools that don't talk. The pitch is software that fits, from someone who
is still around to change it later.

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export, JavaScript — no TypeScript)
- **Styling:** Plain CSS with custom properties in `app/globals.css` (no Tailwind)
- **Font:** Inter via `next/font/google`
- **Forms:** Formspree (endpoint ID in `app/site.js`); falls back to a pre-filled
  `mailto:` while the ID is empty
- **Hosting:** Cloudflare Pages (see `docs/DEPLOY.md`)
- **Repo:** https://github.com/juliestromwall/technottape

## Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Hero, the "held together with tape" problem, three services, process, who you get, CTA |
| Services | `/services/` | Build / Launch / Support in detail, plus how pricing works |
| Work | `/work/` | Four projects described without client names, plus a "small jobs welcome" note |
| About | `/about/` | Julie's background, how she works, where the name came from |
| Contact | `/contact/` | Enquiry form, phone, email, and what happens next |
| 404 | any | Friendly not-found page |

## Key Flows

1. **Enquiry:** Contact form → Formspree → email to Julie. With no Formspree ID
   set, submitting opens the visitor's mail client with the fields pre-filled.
2. **Call:** The phone number in the nav, footer, and CTA bands is a `tel:` link.
3. **Mobile nav:** Hamburger toggles a stacked link list; the desktop links,
   phone number, and CTA button are hidden below 720px.

## Terminology

| Term | Meaning |
|------|---------|
| Build | Sites, apps, and internal tools |
| Launch | Domains, DNS, mail, hosting, and the go-live cutover |
| Support | Flat monthly arrangement for changes and maintenance after launch |
| Static export | `next build` writes plain HTML/CSS/JS to `out/` |

## Brand

- **Palette:** carried over from the Betora system — Sage `#4F6F52`, Ochre
  `#BC8F3B`, Terracotta `#A8553A`, Ink `#1C1917`, warm paper `#FAF8F4`.
- **Signature gradient:** sage → ochre → terracotta (115°), used on the hero
  panel, primary buttons, gradient headline text, and the CTA bands.
- **Type:** Inter. Headings 600 weight, tight tracking.
- **Mark:** three squared-off bars in the three brand colours — deliberately the
  opposite of a crossed strip of tape.

> **Note:** this palette is currently also Betora's. If the two brands need to
> read as separate companies, shifting the three accent hues in `:root` is the
> only change required.

## Business facts

| Thing | Value |
|---|---|
| Phone | 970.333.4481 |
| Email | `hello@juliestromwall.com` — technottape.com has **no MX records** yet |
| Location | Colorado; clients anywhere in the US |
