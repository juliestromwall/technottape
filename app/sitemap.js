import { site } from './site';

export const dynamic = 'force-static';

export default function sitemap() {
  const routes = ['/', '/services/', '/work/', '/about/', '/contact/'];
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
