import { useEffect, useRef, useState, type RefObject } from 'react';
import type { CSSVars } from '../../lib/css';
import { reducedMotion } from '../../lib/hooks';

/** Stavy úpravy věty: 0 rukopis, 1 změny (škrtání a nová slova), 2 čistopis. */
export type EditStep = 0 | 1 | 2;

/** Smyčka v ms od začátku: Rukopis stojí, pak se text opraví (Změny), pak chvíli stojí čistopis a celé se začne znovu. */
const TO_CHANGES = 2000;
const TO_CLEAN = 5800;
const LOOP = 11400;

/** Pořadí opravy: každé smazané místo (a nové slovo za ním) naskočí o kousek později než předchozí (CSS čte --k). */
export const editOrder = (n: number): CSSVars => ({ '--k': n });

/**
 * Úprava věty v úvodu (list v hero na počítači a tabletu, lupa na telefonu) se přehrává při každém načtení stránky a pak pořád dokola,
 * dokud je vidět. Kateřina 7. 11. 2026: „uvnitř lupy se neopravuje text“ (úprava se předváděla jen při první návštěvě a její telefon
 * už web znal), a na otázku, zda i list na počítači, odpověděla „ano“. Proto se do prohlížeče nic neukládá (stránka Cookies to říká).
 * Když prvek zmizí z obrazovky, smyčka stojí a po návratu začne znovu. Při omezeném pohybu v systému stojí hotový čistopis.
 */
export function useEditLoop(): { step: EditStep; ref: RefObject<HTMLDivElement | null> } {
  const [step, setStep] = useState<EditStep>(() => (reducedMotion() ? 2 : 0));
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
