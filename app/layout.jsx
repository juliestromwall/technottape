import { Inter } from 'next/font/google';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { site } from './site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    'Tech Not Tape builds custom websites and software for small businesses in Minneapolis and across the US — built, launched, and supported by one person who stays on the job.',
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      'Custom websites and software for small business. Built properly, launched carefully, supported once live.',
  },
  alternates: { canonical: '/' },
};

export const viewport = { themeColor: '#faf8f4' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} data-scroll-behavior="smooth">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
