import { BOOKS_ROUND, LINKEDIN, YEARS_EDITING, YEARS_LAW } from '../data/site';
import { SEO, SITE_NAME, SITE_URL, pageUrl, type PageKey } from '../data/seo';
import { FAQ, SERVICES } from '../pages/sluzby/data';

/**
 * Vizitka pro stroje (strukturovaná data schema.org ve formátu JSON-LD).
 * NÁVRH k posouzení Kateřiny, zatím nenasazeno. Uvádí jen to, co je i viditelně na webu:
 * bez adresy (pracuje online), bez telefonu, bez ceny. E-mail se přidá až po zřízení schránky (plán E2).
 * Texty se berou ze stejných dat jako viditelný web (FAQ, SERVICES), takže se s ním nerozejdou.
 */

type Json = { [key: string]: unknown };

const PERSON_ID = `${SITE_URL}/#katerina-mlsnova`;
const SITE_ID = `${SITE_URL}/#web`;

const person = (): Json => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Kateřina Mlsnová',
  jobTitle: 'Knižní redaktorka',
  description: `Knižní redaktorka. ${YEARS_EDITING} let redakce odborných publikací (komentáře k zákonům, učebnice, monografie), přes ${BOOKS_ROUND} vydaných knih, dříve ${YEARS_LAW} let advokacie.`,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/portret-640.webp`,
  sameAs: [LINKEDIN],
  knowsAbout: [
    'redakce odborných publikací',
    'redakce závěrečných prací',
    'jazyková korektura',
    'úprava profesních textů, e-booků a newsletterů',
    'revize textů vytvořených s pomocí AI',
    'právo',
    'právo informačních technologií',
  ],
});

const website = (): Json => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'cs-CZ',
  publisher: { '@id': PERSON_ID },
});

const PAGE_TYPE: Partial<Record<PageKey, string>> = { omne: 'ProfilePage', kontakt: 'ContactPage', knihovna: 'CollectionPage' };

const pageNode = (key: PageKey): Json => {
  const node: Json = {
    '@type': PAGE_TYPE[key] ?? 'WebPage',
    '@id': `${pageUrl(key)}#stranka`,
    url: pageUrl(key),
    name: SEO[key].title,
    description: SEO[key].description,
    inLanguage: 'cs-CZ',
    isPartOf: { '@id': SITE_ID },
  };
  if (key === 'omne') node.mainEntity = { '@id': PERSON_ID };
  else if (key === 'uvod') node.about = { '@id': PERSON_ID };
  return node;
};

const service = (anchor: string, name: string, description: string): Json => ({
  '@type': 'Service',
  '@id': `${pageUrl('sluzby')}#${anchor}`,
  url: `${pageUrl('sluzby')}#${anchor}`,
  name,
  description,
  provider: { '@id': PERSON_ID },
  areaServed: { '@type': 'Country', name: 'Česko' },
});

/** Čtyři služby a poznámka o samostatné korektuře (je-li u služby). */
const services = (): Json[] =>
  SERVICES.flatMap((s) => [
    service(`k${s.k}`, s.toc, s.d.split('\n')[0]),
    ...(s.note ? [service(s.note.id, s.note.name, s.note.p[0])] : []),
  ]);

const faq = (): Json => ({
  '@type': 'FAQPage',
  '@id': `${pageUrl('sluzby')}#caste-otazky`,
  mainEntity: FAQ.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

/** Celý graf pro stránku: osoba, web, stránka a u Služeb ještě služby a časté otázky. */
export function jsonLd(key: PageKey): Json {
  const graph: Json[] = [person(), website(), pageNode(key)];
  if (key === 'sluzby') graph.push(...services(), faq());
  return { '@context': 'https://schema.org', '@graph': graph };
}
