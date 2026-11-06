import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../../data/books';
import { BOOKS_TOTAL } from '../../data/site';
import { latestBooks } from '../../lib/books';
import { booksText, cx, hash } from '../../lib/format';
import type { CSSVars } from '../../lib/css';
import { useMedia } from '../../lib/hooks';
import { Cover } from '../../components/Cover';
import { StandBook, StandInfo } from '../../components/Stand';

/** Počet knih v knihkupectví = počet míst na ciferníku ohniska. */
const SHELF = 12;

interface ItemProps {
  book: Book;
  face: boolean;
  small: boolean;
  selected: boolean;
  onPick: () => void;
}

/** Hřbet, nebo obálka čelem; kniha, která stojí na stojanu, na polici zeslábne. */
function ShelfItem({ book, face, small, selected, onPick }: ItemProps) {
  const label = `${book.title}, ${book.year}`;
  const current = selected ? 'true' : undefined;
  if (face) {
    return (
      <button type="button" className={cx('face', selected && 'out')} aria-label={label} aria-current={current} onClick={onPick}>
        <span>
          <Cover book={book} />
        </span>
      </button>
    );
  }
  const k = small ? 0.78 : 1;
  const vars: CSSVars = {
    '--w': `${Math.round((10 + book.pages * 0.026) * k)}px`,
    '--h': `${Math.round(((book.types[0] === 'komentar' ? 186 : 166) + (hash(book.id) % 12)) * k)}px`,
  };
  return (
    <button type="button" className={cx('spine', book.types[0], selected && 'out')} style={vars} aria-label={label} aria-current={current} onClick={onPick}>
      <span>{book.label}</span>
    </button>
  );
}

/** Knihkupectví: nejnovější knihy, vybraná stojí uprostřed na stojanu a ohnisko za ní se otočí na její místo. */
export function Shop({ onSelect }: { onSelect: (index: number) => void }) {
  const latest = useMemo(() => latestBooks(SHELF), []);
  const [current, setCurrent] = useState<Book>(latest[0]);
  const small = useMedia('(max-width: 720px)');

  const pick = (b: Book) => {
    setCurrent(b);
    onSelect(latest.indexOf(b));
  };
  const item = (b: Book, i: number) => (
    <ShelfItem key={b.id} book={b} face={i % 3 === 1} small={small} selected={b.id === current.id} onPick={() => pick(b)} />
  );

  return (
    <section className="scene shop-scene" data-side="center" aria-labelledby="t-shop">
      <div className="copy">
        <h2 id="t-shop">Nejnovější knihy</h2>
        <p className="lead">
          Dvanáct posledních ze&nbsp;{BOOKS_TOTAL}&nbsp;knih, které jsem redigovala. Klepněte na knihu a&nbsp;postavte ji doprostřed.
        </p>
      </div>
      <div className="shop">
        <div className="side left">{latest.slice(0, 6).map((b, i) => item(b, i))}</div>
        <StandBook className="shop-book" focus book={current} w={small ? 128 : 168} />
        <div className="side right">{latest.slice(6).map((b, i) => item(b, i + 6))}</div>
        <StandInfo className="shop-info" books={latest} current={current} />
      </div>
      <p className="more">
        <Link className="textlink" to="/knihovna">
          Celá knihovna, {booksText(BOOKS_TOTAL)}
        </Link>
      </p>
    </section>
  );
}
