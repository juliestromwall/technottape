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
  location: 'Colorado — working with clients anywhere in the US',

  // Paste the Formspree form ID here (the bit after /f/ in the endpoint URL).
  // While it's empty the contact form falls back to opening a pre-filled email.
  formspreeId: '',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/services/', label: 'Services' },
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
];
