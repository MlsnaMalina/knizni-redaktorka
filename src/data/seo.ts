import { BOOKS_ROUND, BOOKS_TOTAL, COOKIES_PATH, PRIVACY_PATH, YEARS_EDITING, YEARS_LAW } from './site';

/**
 * Titulek a popis každé stránky na jednom místě (vyhledávače, sdílení na LinkedInu, AI asistenti).
 * NÁVRH k posouzení Kateřiny, zatím nenasazeno. Titulek do 60 znaků, popis do 160.
 * Pravidla: ukázka zdarma jen „po dohodě“, žádné „odborných“ jako jediné zaměření, bez ceny a lhůt.
 */

/** Adresa webu bez lomítka na konci. Před spuštěním potvrdit, zda web poběží s „www“ (rozhodnutí F0: www.knizniredaktorka.cz). */
export const SITE_URL = 'https://www.knizniredaktorka.cz';
export const SITE_NAME = 'Kateřina Mlsnová – knižní redaktorka';

/** Datum poslední změny obsahu (mapa webu). Při každé úpravě textů aktualizovat. */
export const CONTENT_UPDATED = '2026-11-08';

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  /** Do mapy webu patří obsahové stránky; právní texty jsou veřejné, ale v mapě je nepotřebují. */
  sitemap: boolean;
}

export const SEO = {
  uvod: {
    path: '/',
    title: 'Kateřina Mlsnová – knižní redaktorka | redakce a korektura',
    description: `Redakce knih, závěrečných prací, e-booků a newsletterů, korektura textů, revize textů s pomocí AI. Přes ${BOOKS_ROUND} vydaných knih. Ukázková redakce po dohodě zdarma.`,
    sitemap: true,
  },
  sluzby: {
    path: '/sluzby',
    title: 'Služby – redakce a korektura textů | Kateřina Mlsnová',
    description:
      'Redakce publikací, korektura a redakce diplomových, rigorózních a disertačních prací, e-booků a newsletterů, revize AI textů. Cena předem za celý projekt.',
    sitemap: true,
  },
  knihovna: {
    path: '/knihovna',
    title: `Knihovna – ${BOOKS_TOTAL} vydaných knih | Kateřina Mlsnová`,
    description: 'Komentáře k zákonům, monografie a učebnice, které jsem redigovala pro nakladatelství Wolters Kluwer ČR. Filtrujte podle druhu a oblasti práva.',
    sitemap: true,
  },
  omne: {
    path: '/o-mne',
    title: 'O mně – z advokacie do knižní redakce | Kateřina Mlsnová',
    description: `Právní vzdělání, ${YEARS_LAW} let advokacie, ${YEARS_EDITING} let knižní redakce a přes ${BOOKS_ROUND} vydaných odborných knih. Specializace na právo, právo IT, technologie a umělou inteligenci.`,
    sitemap: true,
  },
  kontakt: {
    path: '/kontakt',
    title: 'Kontakt – pošlete mi svůj text | Kateřina Mlsnová',
    description: 'Napište mi, o jaký text jde (kniha, závěrečná práce, e-book, newsletter). Odpovídám do 1–2 pracovních dnů. Posouzení textu zdarma, ukázková redakce po dohodě.',
    sitemap: true,
  },
  revizeai: {
    path: '/revize-ai-textu',
    title: 'Revize AI textů | úprava textů z ChatGPT | Kateřina Mlsnová',
    description: 'AI napíše draft, já z něj udělám text, za který se podepíšete. Kontrola faktů a citací, jednotná terminologie, lidský tón. Ukázková revize po dohodě zdarma.',
    sitemap: true,
  },
  cookies: {
    path: COOKIES_PATH,
    title: 'Cookies | Kateřina Mlsnová',
    description: 'Web nepoužívá cookies ani měření návštěvnosti a nic neukládá ve vašem prohlížeči. Odkud se načítají obálky knih.',
    sitemap: false,
  },
  zasady: {
    path: PRIVACY_PATH,
    title: 'Zásady zpracování osobních údajů | Kateřina Mlsnová',
    description: 'Jak nakládám s osobními údaji, které mi pošlete přes formulář nebo e-mailem: správce, účel, příjemci, doba uchování a vaše práva.',
    sitemap: false,
  },
} as const satisfies Record<string, PageSeo>;

export type PageKey = keyof typeof SEO;
export const PAGE_KEYS = Object.keys(SEO) as PageKey[];

/** Úplná adresa stránky (úvod končí lomítkem, ostatní ne). */
export const pageUrl = (key: PageKey): string => SITE_URL + SEO[key].path;
