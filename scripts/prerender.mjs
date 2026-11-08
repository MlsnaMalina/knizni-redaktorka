// Předgenerování stránek: po `vite build` a `vite build --ssr` zapíše do dist/ hotové HTML každé stránky
// (skutečný text, titulek, popis, kanonická adresa, sdílení a JSON-LD) a mapu webu. NÁVRH, zatím nenasazeno.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render, pages, socialTags, CONTENT_UPDATED, SITE_URL } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headHtml(h) {
  const tags = socialTags(h).map(([attr, key, content]) => `<meta ${attr}="${esc(key)}" content="${esc(content)}" />`);
  const ld = JSON.stringify(h.jsonLd).replace(/</g, '\u003c');
  return [
    `<title>${esc(h.title)}</title>`,
    ...tags,
    `<link rel="canonical" href="${esc(h.canonical)}" />`,
    `<script type="application/ld+json" id="ld-json">${ld}</script>`,
  ].join('\n    ');
}

for (const page of pages) {
  const body = render(page.path);
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, () => '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, () => '')
    .replace('</head>', () => `    ${headHtml(page.head)}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
  if (!html.includes(`<div id="root">${body.slice(0, 40)}`)) throw new Error('Kořen stránky se nepodařilo vyplnit: ' + page.path);
  const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`;
  fs.writeFileSync(path.join(dist, file), html);
  console.log(`  ${file.padEnd(24)} ${(html.length / 1024).toFixed(0)} kB  ${page.head.title}`);
}

const urls = pages
  .filter((p) => p.sitemap)
  .map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${CONTENT_UPDATED}</lastmod></url>`)
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log(`  sitemap.xml              ${pages.filter((p) => p.sitemap).length} adres`);
