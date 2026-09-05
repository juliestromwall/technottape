import { Inter } from 'next/font/google';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Motion from './components/Motion';
import { site } from './site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
  // The dense binary T is beautiful at 48px and up but turns to mush in a
  // 16px browser tab, so the tab gets the simplified T instead.
  icons: {
    icon: [
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-binary.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
};

export const viewport = { themeColor: '#08080a', colorScheme: 'dark' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        {/* Runs before first paint. Arming the motion styles from JS means a
            visitor without JS gets a plain, fully readable page instead of a
            blank one, and nobody sees content flash in then out. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js-motion')",
          }}
        />
      </head>
      <body>
        <SmoothScroll />
        <Cursor />
        <Motion />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
