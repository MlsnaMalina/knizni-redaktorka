import type { CSSProperties } from 'react';
import type { Book, BookType } from '../data/books';
import { Cover } from './Cover';
import { cx, pagesText } from '../lib/format';
import type { CSSVars } from '../lib/css';

/** Barvy hřbetů podle edic Wolters Kluwer (komentáře vínové, monografie tmavě modré). */
const SPINE: Record<BookType, string> = { komentar: '#4a1830', monografie: '#1b2945', ostatni: '#2e5e57' };

interface Book3DProps {
  book: Book;
  /** Šířka obálky v px. */
  w?: number;
  /** Natočení ve stupních. */
  ry?: number;
  rx?: number;
  rz?: number;
  /** Kniha leží na ploše (stín na podložce). */
  flat?: boolean;
  /** Ztlumená do šedé (barvu dostane pod myší). */
  muted?: boolean;
  /** Při vložení se otočí z boku. */
  enter?: boolean;
  /** Obálku načítat hned, ne až u okraje obrazovky. */
  eager?: boolean;
  style?: CSSProperties;
}

/** 3D kniha: skutečná obálka, hřbet, ořízka, světlo a stín. */
export function Book3D({ book, w = 180, ry = 28, rx = -5, rz = 0, flat, muted, enter, eager, style }: Book3DProps) {
  const h = Math.round(w * 1.42);
  const t = Math.max(9, Math.round((6 + book.pages * 0.03) * (w / 180)));
  const vars: CSSVars = {
    '--w': `${w}px`,
    '--h': `${h}px`,
    '--t': `${t}px`,
    '--ry': `${ry}deg`,
    '--rx': `${rx}deg`,
    '--rz': `${rz}deg`,
    '--sp': SPINE[book.type],
    ...style,
  };
  return (
    <figure className={cx('b3', flat && 'flat', muted && 'mute')} style={vars} aria-label={`${book.title} — ${pagesText(book.pages)}`}>
      <div className={cx('b3-in', enter && 'enter')}>
        <div className="b3-f b3-floor" />
        <div className="b3-f b3-front">
          <Cover book={book} eager={eager} />
        </div>
        <div className="b3-f b3-back" />
        <div className="b3-f b3-spine">
          <span>{book.label}</span>
        </div>
        <div className="b3-f b3-pages" />
        <div className="b3-f b3-top" />
        <div className="b3-f b3-bottom" />
      </div>
    </figure>
  );
}
