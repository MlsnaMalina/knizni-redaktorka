import { typeLine, type Book } from '../data/books';
import { cx, pagesText } from '../lib/format';
import { Book3D } from './Book3D';

/** Kniha na stojanu: při výměně se otočí z boku. */
export function StandBook({ book, w, className, focus }: { book: Book; w: number; className?: string; focus?: boolean }) {
  return (
    <div className={cx('stand-book', className)} data-focus={focus ? '' : undefined}>
      <Book3D key={book.id} book={book} w={w} ry={26} rx={-4} enter eager />
    </div>
  );
}

function StandCard({ book, on }: { book: Book; on: boolean }) {
  const when = book.estYear ? '1. vydání' : (book.edition === 2 ? '2. vydání, ' : '') + (book.month ? `${book.month}/` : '') + book.year;
  return (
    <div className={cx('stand-card', on && 'on')} aria-hidden={on ? undefined : true}>
      <p className="stand-meta">{[typeLine(book), when, pagesText(book.pages)].join(' · ')}</p>
      <h2>{book.title}</h2>
      <p className="stand-authors">{book.authors ?? ''}</p>
      {book.isNew && <p className="stand-new">Novinka</p>}
      {book.url && (
        <a className="textlink" href={book.url} target="_blank" rel="noopener noreferrer" tabIndex={on ? undefined : -1}>
          Detail v e-shopu Wolters Kluwer
        </a>
      )}
    </div>
  );
}

interface StandInfoProps {
  /** Knihy, které se mohou na stojanu objevit; výška údajů se drží podle nejdelší z nich. */
  books: readonly Book[];
  current: Book;
  nav?: { onPrev: () => void; onNext: () => void };
  className?: string;
}

/** Údaje o knize na stojanu; všechny kandidátky leží na sobě, vidět je vybraná, a nic se výběrem neposouvá. */
export function StandInfo({ books, current, nav, className }: StandInfoProps) {
  return (
    <div className={cx('stand-info', className)} aria-live="polite">
      {books.map((b) => (
        <StandCard key={b.id} book={b} on={b.id === current.id} />
      ))}
      {nav && (
        <div className="stand-nav">
          <button type="button" onClick={nav.onPrev}>
            Předchozí
          </button>
          <button type="button" onClick={nav.onNext}>
            Další
          </button>
        </div>
      )}
    </div>
  );
}
