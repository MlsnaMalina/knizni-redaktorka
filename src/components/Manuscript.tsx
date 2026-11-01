import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../lib/format';
import type { CSSVars } from '../lib/css';

interface MsProps {
  /** Šířka listu v px (určuje i velikost písma). */
  width?: number;
  /** Komentář redaktorky leží vedle listu na dané straně. */
  noteSide?: 'left' | 'right';
  note?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** List rukopisu se sledováním změn a (volitelně) komentářem K. Mlsnové; jen ozdoba. */
export function Ms({ width, noteSide, note, className, style, children }: MsProps) {
  const vars: CSSVars = { ...(width === undefined ? {} : { '--sw': `${Math.round(width)}px` }), ...style };
  return (
    <div className={cx('ms', noteSide && `note-${noteSide}`, className)} style={vars}>
      <div className="sheet">{children}</div>
      {note !== undefined && (
        <p className="note">
          <b>K. Mlsnová</b>
          {note}
        </p>
      )}
    </div>
  );
}

/** Ukázkový list: věta o rovném zacházení před redakcí a po ní. */
export function SampleSheet({ run = 'Kapitola 4 · Rovné zacházení' }: { run?: string }) {
  return (
    <>
      <p className="run">{run}</p>
      <p>
        <del>Zaměstnavatel je povinen zajistit, aby v případě, že dojde k situaci, kdy dochází</del> <ins>Dochází-li</ins> k rozdílnému zacházení se
        zaměstnanci, <del>bylo toto zacházení posuzováno v souladu se zákonem</del> <ins>posuzuje se podle antidiskriminačního zákona</ins> (č.{' '}
        <del>189</del>
        <ins>198</ins>/2009 Sb.).
      </p>
      <p>
        Za diskriminaci se nepovažuje rozlišování, pro které existuje věcný důvod spočívající v povaze vykonávané práce, je-li takový požadavek pro
        výkon práce nezbytný.
      </p>
      <p>
        Účel sledovaný takovou výjimkou musí být oprávněný a požadavek přiměřený. Zaměstnavatel přitom postupuje tak, aby rozlišování nepřesáhlo míru
        nutnou k dosažení tohoto účelu.
      </p>
    </>
  );
}

export const SAMPLE_NOTE = 'Antidiskriminační zákon je č. 198/2009 Sb., ne 189.';
