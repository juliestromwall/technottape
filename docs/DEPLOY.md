# Deploy

Static export → **Cloudflare Pages**, auto-deploying from `main`.

- **Repo:** https://github.com/juliestromwall/technottape
- **Build:** `npm run build` → static site in `out/`
- **Registrar:** **Hostinger** (registered 2026-08-27, expires 2027-08-27)

## Current DNS state (checked 2026-09-02)

| Record | Value |
|---|---|
| Nameservers | `byte.dns-parking.com` / `pixel.dns-parking.com` (Hostinger parking) |
| A (apex) | `2.57.91.91` — Hostinger parking page |
| MX | **none** |

**There is no mail on this domain**, which makes this cutover far lower-risk than
the `juliestromwall.com` one. Nothing is live to break: the domain currently
serves a parking page and receives no email.

## Lock file: generate it with the same npm as the build

The Cloudflare build runs `npm ci`, which refuses to install unless
`package-lock.json` matches `package.json` exactly. Node 22 (from `.nvmrc`)
ships **npm 10.x** there, and npm 10 and npm 11 resolve nested optional
platform packages differently — an npm 11 lock records
`@emnapi/core`/`@emnapi/runtime` at 1.10.0 where npm 10 expects 1.11.3, and
the build fails with `Missing: @emnapi/runtime@... from lock file`.

If you add or update a dependency on a machine running npm 11+, regenerate
the lock the way the build will read it:

```sh
npx -y npm@10.9.2 install --package-lock-only
npx -y npm@10.9.2 ci        # this is exactly what Cloudflare runs
npm run build               # confirm it still builds
```

## 1. Create the Pages project

Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** →
pick `juliestromwall/technottape`.

| Field | Value |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | `/` |
| Production branch | `main` |

Node version comes from `.nvmrc` (22). Deploy and confirm the `*.pages.dev` URL
works before touching DNS.

## 2. Point the domain at it

Two options — the first is cleaner and matches how `juliestromwall.com` is set up.

**Option A — move DNS to Cloudflare (recommended)**

1. Cloudflare → **Add a site** → `technottape.com` → Free plan → let it scan.
2. There is nothing worth keeping in the scanned zone (parking A record only),
   so delete the parking A record.
3. Copy the two Cloudflare nameservers.
4. Hostinger → **Domains** → `technottape.com` → **DNS / Nameservers** → change
   to the Cloudflare pair.
5. Wait for Cloudflare to report the domain **Active** (usually minutes to a few
   hours).
6. Pages project → **Custom domains** → add `technottape.com` and `www.technottape.com`.
   Cloudflare creates the records and issues the certificate itself.

**Option B — keep Hostinger DNS**

In Hostinger's DNS editor, point `www` at the `*.pages.dev` hostname with a
CNAME and use Hostinger's apex forwarding to `www`. Works, but you keep two
control panels and lose Cloudflare's apex flattening. Only worth it if you have
a reason to leave nameservers where they are.

## 3. Verify

```sh
dig +short NS technottape.com
dig +short A technottape.com
curl -sI https://technottape.com | head -1
```

Then open the live site and check: all five pages load, HTTPS is valid, `www`
redirects to the apex (or vice versa), and the contact form submits.

## 4. Turn on the contact form

The form has **no backend** until this is done. Right now, submitting opens the
visitor's mail client with the fields pre-filled — functional, but it loses
anyone without a configured mail app.

1. Create a free account at [formspree.io](https://formspree.io).
2. New form → point it at `hello@juliestromwall.com`.
3. Copy the form ID (the part after `/f/` in the endpoint URL).
4. Paste it into `formspreeId` in `app/site.js`, commit, push.
5. Submit a real test enquiry and confirm it arrives.

## Still open

- **Email on the domain.** `hello@technottape.com` does not exist — there are no
  MX records. Adding Google Workspace (or forwarding via Cloudflare Email
  Routing, which is free) would let the site use a matching address instead of
  `hello@juliestromwall.com`. Cloudflare Email Routing is the cheap option and
  only takes a few minutes once DNS is on Cloudflare.
- Confirm auto-renew at Hostinger before 2027-08-27.
