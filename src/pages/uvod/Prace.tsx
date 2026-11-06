import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/format';
import { Paper, useWordCount, type PaperState } from '../../components/Paper';

const STEPS = ['Rukopis', 'Změny', 'Čistopis'] as const;

/** Vysvětlení pod listem: legenda, ne komentář autorovi (ten je až ve druhé ukázce). */
function Legend({ on }: { on: boolean }) {
  return (
    <p className={cx('pr-legend', on && 'on')}>
      přeškrtnuté = vypuštěno · podtržené = vloženo · a&nbsp;mimochodem: antidiskriminační zákon je 198/2009&nbsp;Sb., ne&nbsp;189
    </p>
  );
}

/**
 * Jak vypadá moje práce (model Přes rameno): list rukopisu stojí na místě a podle posunu stránky přechází
 * Rukopis, Sledování změn, Čistopis (29 → 14 slov). Pod ním druhá ukázka s dotazem autorovi.
 */
export function Prace() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [s, setS] = useState<PaperState>(0);
  const wc = useWordCount(s);

  // stav listu podle toho, kolik stránky je za námi: 0 rukopis, 1 změny, 3 čistopis
  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return undefined;
    const onScroll = () => {
      const r = pin.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight)));
      setS(p < 0.1 ? 0 : p < 0.6 ? 1 : 3);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const step = s === 3 ? 2 : s;

  return (
    <section className="pr" id="prace" aria-labelledby="t-prace">
      <div className="pr-pin" ref={pinRef}>
        <div className="pr-stick">
          <div className="copy">
            <h2 id="t-prace">Jak může vypadat moje práce</h2>
            <div className="pr-stage">
              <div className="pr-live">
                <Paper s={s} wc={wc} />
                <Legend on={s === 1} />
              </div>
              <div className="pr-live pr-ghost" aria-hidden="true">
                <Paper s={2} wc="29 → 14 slov" />
                <Legend on />
              </div>
            </div>
            <ol className="pr-steps" aria-hidden="true">
              {STEPS.map((t, i) => (
                <li key={t} className={cx(i === step && 'on')}>
                  {t}
                </li>
              ))}
            </ol>
            <p className="pr-hint">Posouvejte dolů, text se redakčně upraví</p>
          </div>
        </div>
      </div>
      <div className="pr-two">
        <div className="copy">
          <div className="ex2">
            <p className="eyebrow">Někdy opravím tiše, jindy se zeptám</p>
            <div className="paper">
              <div className="run">
                <span>Kapitola 6 · Zadávání</span>
                <span className="meta">
                  <span className="wc">komentář</span>
                </span>
              </div>
              <p>
                …postup zadavatele v&nbsp;takovém případě upravuje <span className="ref">zákon č.&nbsp;137/2006&nbsp;Sb., o&nbsp;veřejných zakázkách</span>.
              </p>
            </div>
            <div className="cmt">
              <b>K. Mlsnová</b>
              Skutečně chcete odkazovat na tento zákon? Ke dni 1.&nbsp;10.&nbsp;2016 byl zrušen. Přidáme k&nbsp;textu tuto informaci, nebo odkážeme na
              nahrazující zákon č.&nbsp;134/2016&nbsp;Sb., o&nbsp;zadávání veřejných zakázek?
            </div>
          </div>
          <p className="pr-after">
            Takhle vypadá běžná redakční práce: věta se zkrátí o&nbsp;polovinu, přepis v&nbsp;čísle předpisu zmizí dřív, než ho kdokoli uvidí, a&nbsp;tam,
            kde jde o&nbsp;obsah, se nerozhoduju za&nbsp;vás, ale&nbsp;ptám se. Všechny úpravy navrhuji v&nbsp;režimu sledování změn; poslední slovo máte
            vždy vy.
          </p>
        </div>
      </div>
    </section>
  );
}
