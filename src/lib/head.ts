import { SEO, SITE_NAME, pageUrl, type PageKey } from '../data/seo';
import { jsonLd } from './jsonld';

/**
 * Hlavička stránky: titulek, popis, kanonická adresa, značky pro sdílení a vizitka pro stroje (JSON-LD).
 * headFor() je čistá funkce bez prohlížeče, použije ji i předgenerování stránek při sestavení webu.
 * applyHead() to samé nastaví v běžícím prohlížeči při přechodu mezi stránkami.
 * NÁVRH k posouzení Kateřiny, zatím nenasazeno. Obrázek pro sdílení (og:image) se doplní, až bude hotový.
 */

export interface Head {
  title: string;
  description: string;
  canonical: string;
  jsonLd: object;
}

export function headFor(key: PageKey): Head {
  const s = SEO[key];
  return { title: s.title, description: s.description, canonical: pageUrl(key), jsonLd: jsonLd(key) };
}

type Tag = [attr: 'name' | 'property', key: string, content: string];

/** Značky, které čtou LinkedIn, Facebook a další služby při sdílení odkazu. */
export function socialTags(h: Head): Tag[] {
  return [
    ['name', 'description', h.description],
    ['property', 'og:type', 'website'],
    ['property', 'og:site_name', SITE_NAME],
    ['property', 'og:locale', 'cs_CZ'],
    ['property', 'og:title', h.title],
    ['property', 'og:description', h.description],
    ['property', 'og:url', h.canonical],
    ['name', 'twitter:card', 'summary'],
  ];
}

function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(data: object): void {
  let el = document.getElementById('ld-json') as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'ld-json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function applyHead(h: Head): void {
  document.title = h.title;
  for (const [attr, key, content] of socialTags(h)) setMeta(attr, key, content);
  setCanonical(h.canonical);
  setJsonLd(h.jsonLd);
}
