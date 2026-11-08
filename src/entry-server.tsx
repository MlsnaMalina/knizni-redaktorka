import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { CONTENT_UPDATED, PAGE_KEYS, SEO, SITE_URL } from './data/seo';
import { headFor, socialTags, type Head } from './lib/head';

/**
 * Vykreslení stránek do hotového HTML bez prohlížeče. Používá ho scripts/prerender.mjs po sestavení webu,
 * aby každá adresa měla v HTML skutečný text, titulek, popis a vizitku pro stroje (roboty bez JavaScriptu).
 * NÁVRH k posouzení Kateřiny, zatím nenasazeno.
 */
export function render(path: string): string {
  return renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>
  );
}

export interface PageOut {
  path: string;
  sitemap: boolean;
  head: Head;
}

export const pages: PageOut[] = PAGE_KEYS.map((key) => ({ path: SEO[key].path, sitemap: SEO[key].sitemap, head: headFor(key) }));

export { CONTENT_UPDATED, SITE_URL, socialTags };
