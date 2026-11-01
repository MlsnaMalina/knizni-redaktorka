import { BOOKS, TYPE_ORDER, type Book } from '../data/books';

export const bookById = (id: number): Book | undefined => BOOKS.find((b) => b.id === id);

/** Pořadí podle data vydání (rok a měsíc); druhé vydání je o půl měsíce novější než první. */
export const stamp = (b: Book, edition = false): number => b.year * 12 + b.month + (edition && b.edition === 2 ? 0.5 : 0);

/** Nejnovější knihy pro knihkupectví na Úvodu (vydání s odhadnutým rokem se nepočítají). */
export const latestBooks = (n: number): Book[] =>
  BOOKS.filter((b) => !b.estYear)
    .sort((a, b) => stamp(b) - stamp(a))
    .slice(0, n);

/** Pořadí v Knihovně: vlajkové tituly mají nejlepší místa (první řady), dál druh a datum; vzhledem se od ostatních neliší. */
export const libraryOrder = (): Book[] =>
  [...BOOKS].sort(
    (a, b) =>
      Number(b.flagship) - Number(a.flagship) ||
      TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) ||
      stamp(b, true) - stamp(a, true)
  );
