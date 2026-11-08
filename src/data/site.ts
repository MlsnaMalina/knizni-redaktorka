import { BOOKS } from './books';

/** Kontaktní údaje; schránka na doméně se zřizuje před spuštěním (plán E2). */
export const MAIL = 'katerina@knizniredaktorka.cz';
export const LINKEDIN = 'https://www.linkedin.com/in/katerinamlsnova';
export const ICO = '22031383';

/** Odkaz na Kontakt s předvolenou volbou „Ukázkovou redakci“ (tlačítka s ukázkovou redakcí na všech stránkách). */
export const SAMPLE_PARAM = 'zamer';
export const SAMPLE_VALUE = 'ukazka';
export const SAMPLE_LINK = `/kontakt?${SAMPLE_PARAM}=${SAMPLE_VALUE}`;

/** Patička: jméno k ©, adresy stránek Cookies a Zásad a data jejich znění (při každé změně textu příslušné stránky aktualizovat). */
export const OWNER = 'Kateřina Mlsnová';
export const COOKIES_PATH = '/cookies';
export const PRIVACY_PATH = '/zasady-osobnich-udaju';
/** Zásady zpracování osobních údajů: znění z 5. 11. 2026 (7. 11. se nezměnily). */
export const LEGAL_UPDATED = '8. 11. 2026';
/** Cookies: 7. 11. 2026 přepsáno, web už nic neukládá do prohlížeče (zrušen záznam „už viděno“ u úvodní animace). */
export const COOKIES_UPDATED = '7. 11. 2026';

/** Roky praxe; před spuštěním v roce 2027 aktualizovat (plán E4). Z `YEARS_EDITING` se slovy skládá i věta ve FAQ „Spolupracujete i s nakladatelstvími…“ (`yearsText` v `lib/format.ts`). */
export const YEARS_EDITING = 10;
export const YEARS_LAW = 9;

/** Počet knih: z dat, na desítky dolů (71 → „70+“). */
export const BOOKS_TOTAL = BOOKS.length;
export const BOOKS_ROUND = Math.floor(BOOKS_TOTAL / 10) * 10;

/** Rozmezí let vydání (bez odhadnutých). */
const YEARS = BOOKS.filter((b) => !b.estYear).map((b) => b.year);
export const YEAR_FROM = Math.min(...YEARS);
export const YEAR_TO = Math.max(...YEARS);

/** Obsah webu: pět stránek, z nich se staví hlavička i mobilní menu. */
export const NAV = [
  { to: '/', label: 'Úvod' },
  { to: '/sluzby', label: 'Služby' },
  { to: '/knihovna', label: 'Knihovna' },
  { to: '/o-mne', label: 'O mně' },
  { to: '/kontakt', label: 'Kontakt' },
] as const;

/** Ozdobná čísla stran v mobilním obsahu. */
export const PAGE_NUMBERS = [1, 5, 17, 31, 45] as const;
