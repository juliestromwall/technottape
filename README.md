# Tech Not Tape

Marketing website for **Tech Not Tape** — Julie Stromwall's business building
custom websites and software for small businesses.

Live at [technottape.com](https://technottape.com) *(pending DNS cutover — see
`docs/DEPLOY.md`)*.

## Run it

```sh
nvm use          # Node 22
npm install
npm run dev      # http://localhost:3000
```

```sh
npm run build    # static export → out/
```

## Structure

```
app/
  site.js              # name, email, phone, nav, Formspree ID — edit here first
  globals.css          # the whole design system, CSS custom properties at the top
  layout.jsx           # shell: font, metadata, nav, footer
  page.jsx             # home
  services/ work/ about/ contact/
  components/          # Nav, Footer, Mark, Icons, CtaBand, ContactForm
docs/
  PRODUCT.md  FEATURES.md  DEPLOY.md  SESSION_LOG.md
```

## Things worth knowing

- **The contact form has no backend yet.** Set `formspreeId` in `app/site.js`.
  Until then it falls back to opening a pre-filled email.
- **Email is `hello@juliestromwall.com`**, not `@technottape.com` — the new
  domain has no MX records.
- **The palette is shared with Betora.** Changing the three accent hues in
  `:root` in `app/globals.css` is all it takes to separate them.
