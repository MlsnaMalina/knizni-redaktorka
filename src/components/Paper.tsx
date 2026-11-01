import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '../lib/hooks';

/** Stav listu: 0 rukopis, 1 sledování změn, 2 změny (nejdelší stav), 3 čistopis. */
export type PaperState = 0 | 1 | 2 | 3;

const LABELS: Record<PaperState, string> = { 0: 'Rukopis', 1: 'Sledování změn', 2: 'Sledování změn', 3: 'Čistopis' };

/** Věta s úpravami: del = škrt, ins = vloženo. Podle data-s na listu je vidět rukopis, změny, nebo čistopis. */
function Diff() {
  return (
    <>
      <del>Zaměstnavatel je povinen zajistit, aby v&nbsp;případě, že dojde k&nbsp;situaci, kdy dochází </del>
      <ins>Dochází-li </ins>k&nbsp;rozdílnému zacházení se zaměstnanci, <del>bylo toto zacházení posuzováno v&nbsp;souladu se zákonem </del>
      <ins>posuzuje se podle antidiskriminačního zákona (</ins>č.&nbsp;<del>189</del>
      <ins>198</ins>/2009&nbsp;Sb.<ins>).</ins>
    </>
  );
}

/** List rukopisu s větou o rovném zacházení; wc je počítadlo slov v záhlaví. */
export function Paper({ s, wc }: { s: PaperState; wc: string }) {
  return (
    <div className="paper" data-s={s}>
      <div className="run">
        <span>Kapitola 4 · Rovné zacházení</span>
        <span className="meta">
          <span className="st">{LABELS[s]}</span> · <span className="wc">{wc}</span>
        </span>
      </div>
      <p>
        <Diff />
      </p>
      <p>
        Za diskriminaci se nepovažuje rozlišování, pro které existuje věcný důvod spočívající v&nbsp;povaze vykonávané práce, je-li takový požadavek pro
        výkon práce nezbytný.
      </p>
    </div>
  );
}

/** Počítadlo slov: rukopis 29 slov, čistopis 14 slov, při přechodu se plynule přepočítá (29 → 14). */
export function useWordCount(s: PaperState): string {
  const [text, setText] = useState(s === 0 ? '29 slov' : s === 3 ? '14 slov' : '29 → 14 slov');
  const prev = useRef<PaperState | undefined>(undefined);
  useEffect(() => {
    const before = prev.current;
    prev.current = s;
    if (s === 0) {
      setText('29 slov');
      return undefined;
    }
    if (s === 3) {
      setText('14 slov');
      return undefined;
    }
    if (before !== 0 && before !== 3 && before !== undefined) return undefined;
    if (reducedMotion()) {
      setText('29 → 14 slov');
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1000);
      setText(`29 → ${Math.round(29 - 15 * p)} slov`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [s]);
  return text;
}
