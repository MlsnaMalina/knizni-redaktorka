import { createElement, Fragment, type ReactNode } from 'react';

const nf = new Intl.NumberFormat('cs-CZ');

/** Číslo česky, s pevnou mezerou mezi tisíci. */
export const num = (n: number): string => nf.format(n);

/** Správný tvar podstatného jména po číslovce: 1 kniha, 2–4 knihy, 5 a více knih (21 knih, 22 knihy). */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const m10 = n % 10;
  const m100 = n % 100;
  return m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
}

/** Počet s pevnou mezerou před podstatným jménem, aby se číslo nikdy neoddělilo od slova. */
export const pagesText = (n: number): string => `${num(n)} ${plural(n, 'strana', 'strany', 'stran')}`;
export const booksText = (n: number): string => `${n} ${plural(n, 'kniha', 'knihy', 'knih')}`;

/** Pseudonáhodné, ale stále stejné číslo 0 až 999 podle čísla knihy (výšky hřbetů). */
export const hash = (n: number): number => ((n * 2654435761) >>> 0) % 1000;

/** Slova e-book a e-mail (i s koncovkou: e-booky, e-mailem) se nesmějí zlomit za pomlčkou. */
const KEEP_TOGETHER = /e-(?:book|mail)\p{L}*/giu;

/**
 * Pevná mezera za jednopísmennými předložkami a spojkami a za číslem před slovem, aby nezůstaly na konci řádku.
 * Slova e-book a e-mail se zabalí do prvku, který se za pomlčkou nezlomí. Přímo v textu nezůstane žádný skrytý znak,
 * takže vyhledávače, čtečky obrazovky i kopírování vidí obyčejné „e-book“.
 * Vrací text pro vložení do JSX; do atributů (aria-label, title) patří obyčejný řetězec.
 */
export function nb(s: string): ReactNode {
  const t = s.replace(/(?<=^|[\s(„])([aikosuvz])\s+/gi, '$1 ').replace(/(\d)\s+(?=\p{L})/gu, '$1 ');
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of t.matchAll(KEEP_TOGETHER)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(t.slice(last, at));
    parts.push(createElement('span', { key: at, className: 'nw' }, m[0]));
    last = at + m[0].length;
  }
  if (!parts.length) return t;
  if (last < t.length) parts.push(t.slice(last));
  return createElement(Fragment, null, ...parts);
}

/** Text bez diakritiky a velkých písmen, pro hledání. */
export const norm = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Spojí třídy; vynechá prázdné hodnoty. */
export const cx = (...parts: (string | false | null | undefined)[]): string => parts.filter(Boolean).join(' ');
