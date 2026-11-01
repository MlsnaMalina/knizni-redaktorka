import type { ReactNode } from 'react';
import { bookById } from '../../lib/books';
import type { CSSVars } from '../../lib/css';
import { Book3D } from '../../components/Book3D';
import { Ms, SAMPLE_NOTE, SampleSheet } from '../../components/Manuscript';

/** Plocha, na které leží knihy a listy rukopisu; výška podle šířky grafiky. */
function Lay({ aw, ratio, children }: { aw: number; ratio: number; children: ReactNode }) {
  const vars: CSSVars = { '--lh': `${Math.round(aw * ratio)}px` };
  return (
    <div className="art" aria-hidden="true">
      <div className="still lay" style={vars}>
        {children}
      </div>
    </div>
  );
}

/** Kniha ležící na ploše, pohled shora. */
function Flat({ id, w, rz, muted, left, top }: { id: number; w: number; rz: number; muted?: boolean; left: string; top: string }) {
  const book = bookById(id);
  if (!book) return null;
  return <Book3D book={book} w={Math.round(w)} rx={9} ry={-7} rz={rz} flat muted={muted} style={{ left, top }} />;
}

const px = (n: number) => `${Math.round(n)}px`;

export function HeroArt({ aw }: { aw: number }) {
  return (
    <Lay aw={aw} ratio={1.04}>
      <Flat id={8} w={aw * 0.6} rz={12} muted left="2%" top="0" />
      <Flat id={0} w={aw * 0.56} rz={-7} left="32%" top={px(aw * 0.15)} />
    </Lay>
  );
}

export function SluzbyArt({ aw }: { aw: number }) {
  return (
    <Lay aw={aw} ratio={1.06}>
      <Flat id={32} w={aw * 0.54} rz={10} muted left="44%" top="0" />
      <Ms width={aw * 0.56} style={{ left: '4%', top: px(aw * 0.08), rotate: '7deg' }}>
        <SampleSheet run="Kapitola 3 · Výjimky" />
      </Ms>
      <Ms width={aw * 0.56} noteSide="left" note={SAMPLE_NOTE} style={{ left: '22%', top: px(aw * 0.2), rotate: '-4deg' }}>
        <SampleSheet />
      </Ms>
    </Lay>
  );
}

export function ZaverArt({ aw }: { aw: number }) {
  return (
    <Lay aw={aw} ratio={1.06}>
      <Ms width={aw * 0.56} style={{ left: '6%', top: '0', rotate: '-6deg' }}>
        <SampleSheet run="Kapitola 1 · Úvod" />
      </Ms>
      <Ms width={aw * 0.56} style={{ left: '12%', top: px(aw * 0.04), rotate: '2deg' }}>
        <SampleSheet run="Kapitola 1 · Úvod" />
      </Ms>
      <Flat id={27} w={aw * 0.5} rz={-11} muted left="42%" top={px(aw * 0.32)} />
    </Lay>
  );
}
