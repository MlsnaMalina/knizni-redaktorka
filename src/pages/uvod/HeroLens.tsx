import { useEffect, useRef, useState, type RefObject } from 'react';
import type { CSSVars } from '../../lib/css';
import { reducedMotion } from '../../lib/hooks';

type Step = 0 | 1 | 2;
const RUN = ['Rukopis', 'Změny', 'Čistopis'] as const;

/** Smyčka úpravy v ms od začátku: Rukopis stojí, pak se text opraví (Změny), pak chvíli stojí čistopis a celé se začne znovu. */
const TO_CHANGES = 2000;
const TO_CLEAN = 5800;
const LOOP = 11400;

/** Pořadí opravy: každé smazané místo (a nové slovo za ním) naskočí o kousek později než předchozí. */
const k = (n: number): CSSVars => ({ '--k': n });

/**
 * Úprava věty v lupě se přehrává pořád dokola, dokud je lupa vidět, a při každém načtení stránky od začátku (Kateřina 7. 11. 2026: „uvnitř
 * lupy se neopravuje text“; list v hero na počítači se předvádí jen při první návštěvě, takže ho vracející se návštěvník vidí hotový).
 * Když lupa zmizí z obrazovky, smyčka stojí a po návratu začne znovu. Při omezeném pohybu v systému stojí hotový čistopis.
 */
function useLensLoop(): { step: Step; ref: RefObject<HTMLDivElement | null> } {
  const [step, setStep] = useState<Step>(() => (reducedMotion() ? 2 : 0));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return undefined;
    let timers: number[] = [];
    let visible = false;
    const clear = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };
    const run = () => {
      clear();
      setStep(0);
      timers.push(window.setTimeout(() => setStep(1), TO_CHANGES), window.setTimeout(() => setStep(2), TO_CLEAN), window.setTimeout(run, LOOP));
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        const now = Boolean(entry?.isIntersecting);
        if (now === visible) return;
        visible = now;
        if (now) run();
        else clear();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, []);
  return { step, ref };
}

/**
 * Úvodní obrazovka na telefonu (Kateřina vybrala 7. 11. 2026 Lupu na prošívání a ze tří směrů bohatší grafiky Skutečnou lupu): úprava věty
 * ve skleněném kruhu s černým okrajem a rukojetí (Rukopis, Změny, Čistopis, pořád dokola), kolem modrá nit a kruhy ohniska, které se točí
 * proti sobě. Kolem lupy žádný text. Jen dekorace, nadpis a čísla stojí pod ní.
 */
export function HeroLens() {
  const { step, ref } = useLensLoop();
  return (
    <div className="hl" aria-hidden="true" ref={ref}>
      <div className="hl-field" />
      <div className="hl-nit" />
      {/* dílky ciferníku (šedé) a modrá značka: kruh se točí po směru hodin */}
      <svg className="hl-ring hl-dial" viewBox="-4 -4 108 108">
        <circle cx="50" cy="50" r="48" pathLength="600" strokeDasharray="0.7 9.3" strokeWidth="2" stroke="#0b0b0b" strokeOpacity=".2" />
        <circle cx="50" cy="50" r="47" pathLength="600" strokeDasharray="0.8 49.2" strokeWidth="4" stroke="#0b0b0b" strokeOpacity=".42" />
        <circle cx="50" cy="50" r="52" pathLength="600" strokeDasharray="15 585" strokeWidth=".6" stroke="#002fa7" strokeLinecap="round" />
      </svg>
      {/* tečky: kruh se točí proti směru hodin */}
      <svg className="hl-ring hl-dots" viewBox="-4 -4 108 108">
        <circle cx="50" cy="50" r="50" pathLength="600" strokeDasharray="0.01 5.99" strokeWidth=".7" stroke="#6e6e6e" strokeOpacity=".7" strokeLinecap="round" />
      </svg>
      {/* rukojeť lupy: leží pod okrajem skla, vychází doprava dolů */}
      <div className="hl-handle">
        <i />
      </div>
      <div className={`hl-lens hero-ms st-${step}`}>
        <div className="hl-text">
          <p className="run">{RUN[step]}</p>
          <p>
            <del style={k(0)}>Mým cílem je pomoci vám, aby</del> <ins style={k(0)}>Aby</ins> váš text <del style={k(1)}>byl schopen obstát</del>{' '}
            <ins style={k(1)}>obstál</ins> před recenzenty i&nbsp;čtenáři, <del style={k(2)}>a&nbsp;proto</del> musí být přesný, srozumitelný a&nbsp;jednotný v&nbsp;celém
            rozsahu.
          </p>
        </div>
      </div>
    </div>
  );
}
