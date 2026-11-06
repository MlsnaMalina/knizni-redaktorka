import { useState } from 'react';
import { TYPES, type Book } from '../data/books';

/**
 * Obálky se berou z e-shopu Wolters Kluwer. Dokud Wolters Kluwer nedá svolení (plán C6),
 * stačí přepnout na false a web všude ukáže typografické obálky.
 */
export const COVERS_ENABLED = true;

/** Obálka bez obrázku: barva podle druhu, název a rok. */
export function TypographicCover({ book }: { book: Book }) {
  return (
    <div className={`tcover tcover--${book.types[0]}`}>
      <span className="tcover-type">{TYPES[book.types[0]].one}</span>
      <span className="tcover-title">{book.label}</span>
      <span className="tcover-meta">
        {book.edition === 2 ? '2. vydání · ' : ''}
        {book.estYear ? '' : book.year}
      </span>
      <span className="tcover-pub">Wolters Kluwer</span>
    </div>
  );
}

/** Obálka z e-shopu; než se načte, nebo když se nenačte, je vidět typografická náhrada. */
export function Cover({ book, eager = false }: { book: Book; eager?: boolean }) {
  const [state, setState] = useState<'wait' | 'ok' | 'fail'>('wait');
  return (
    <>
      {state !== 'ok' && <TypographicCover book={book} />}
      {COVERS_ENABLED && book.cover && state !== 'fail' && (
        <img
          className="cover-img"
          src={book.cover}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setState('ok')}
          onError={() => setState('fail')}
        />
      )}
    </>
  );
}
