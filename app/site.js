// Single source of truth for anything that appears in more than one place.
export const site = {
  name: 'Tech Not Tape',
  domain: 'technottape.com',
  url: 'https://technottape.com',
  tagline: 'Custom websites & software for small business',
  // Mail still lives on juliestromwall.com — technottape.com has no MX records yet.
  email: 'hello@juliestromwall.com',
  phone: '970.333.4481',
  phoneHref: 'tel:+19703334481',
  owner: 'Julie Stromwall',
  location: 'Minneapolis, MN — working with clients anywhere in the US',

  // Enquiries POST here — a Cloudflare Pages Function that calls Resend with
  // a key held as an encrypted env var, never in this repo. If it fails for
  // any reason the form falls back to opening a pre-filled email.
  contactEndpoint: '/api/contact',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/services/', label: 'Services' },
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
];
