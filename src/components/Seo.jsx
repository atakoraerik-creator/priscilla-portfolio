import { useEffect } from 'react';
import { site, defaultSeo } from '../config/site';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Lightweight SEO helper. Set per-page titles and descriptions.
 * <Seo title="Shop" description="..." />
 */
export default function Seo({ title, description, image, noindex }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${site.name}` : defaultSeo.title;
    const pageDescription = description || defaultSeo.description;
    const pageImage = image || site.hero.image;

    document.title = pageTitle;
    setMeta('name', 'description', pageDescription);
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', pageDescription);
    setMeta('property', 'og:image', pageImage);

    let robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, nofollow');
    } else if (robots) {
      robots.setAttribute('content', 'index, follow');
    }
  }, [title, description, image, noindex]);

  return null;
}