import { useEffect, useRef, useState, type ReactNode, type Ref, type RefObject } from 'react';
import { bookById } from '../../lib/books';
import type { CSSVars } from '../../lib/css';
import { reducedMotion, useMedia } from '../../lib/hooks';
import { Book3D } from '../../components/Book3D';
import { Ms, SAMPLE_NOTE, SampleSheet } from '../../components/Manuscript';

/** Plocha, na které leží knihy a listy rukopisu; výška podle šířky grafiky. */
function Lay({ aw, ratio, children, artRef }: { aw: number; ratio: number; children: ReactNode; artRef?: Ref<HTMLDivElement> }) {
  const vars: CSSVars = { '--lh': `${Math.round(aw * ratio)}px` };
  return (
    <div className="art" aria-hidden="true" ref={artRef}>
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

const SEEN_KEY = 'kr-hero-redakce';
type Step = 0 | 1 | 2;

const heroSeen = (): boolean => {
  try {
    return window.localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};
const markHeroSeen = (): void => {
  try {
    window.localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // bez uložení se ukázka při další návštěvě přehraje znovu
  }
};

/** Rukopis, Změny, Čistopis: při první návštěvě se list zredaguje, jakmile je vidět; jinak stojí rovnou čistopis. */
function useHeroSteps(): { step: Step; played: boolean; ref: RefObject<HTMLDivElement | null> } {
  const [first] = useState(() => !reducedMotion() && !heroSeen());
  const [step, setStep] = useState<Step>(first ? 0 : 2);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!first || !el) return undefined;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        markHeroSeen();
        timers.push(window.setTimeout(() => setStep(1), 900), window.setTimeout(() => setStep(2), 2900));
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [first]);
  return { step, played: first, ref };
}

/** Kruhy a značka jako kolem knihkupectví, jen klidné; střed je za listem rukopisu. */
function Dial({ aw }: { aw: number }) {
  const k = aw / 299;
  const size = Math.round(760 * k);
  const c = size / 2;
  const tickR = 345 * k;
  const markR = 245 * k;
  const m = (38 * Math.PI) / 180;
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i * 6 * Math.PI) / 180;
    const long = i % 5 === 0;
    const r2 = tickR + (long ? 14 : 6) * k;
    return <line key={i} className={long ? 'tick h' : 'tick'} x1={tickR * Math.sin(a)} y1={-tickR * Math.cos(a)} x2={r2 * Math.sin(a)} y2={-r2 * Math.cos(a)} />;
  });
  return (
    <svg className="dial" width={size} height={size} viewBox={`${-c} ${-c} ${size} ${size}`} style={{ left: px(aw * 0.595 - c), top: px(aw * 0.8 - c) }}>
      {[80, 125, 180, 245, 320].map((r, i) => (
        <circle key={r} className={`r${i}`} r={r * k} />
      ))}
      <g className="ticks">{ticks}</g>
      <line className="mark" x1={(markR - 10 * k) * Math.sin(m)} y1={-(markR - 10 * k) * Math.cos(m)} x2={(markR + 10 * k) * Math.sin(m)} y2={-(markR + 10 * k) * Math.cos(m)} />
    </svg>
  );
}

/** Věta, ke které text dospěje, je ta z nadpisu; druhý a třetí odstavec jsou jen ozdoba. */
function HeroSheet({ step }: { step: Step }) {
  return (
    <>
      <p className="run">{['Rukopis', 'Změny', 'Čistopis'][step]}</p>
      <p>
        <del>Mým cílem je pomoci vám, aby</del> <ins>Aby</ins> váš text <del>byl schopen obstát</del> <ins>obstál</ins> před recenzenty i&nbsp;čtenáři, <del>a&nbsp;proto</del> musí být přesný,
        srozumitelný a&nbsp;jednotný v&nbsp;celém rozsahu.
      </p>
      <p>Čtenář nemá hádat, co autor myslel, ani se vracet o&nbsp;stránku zpět, aby pochopil odkaz.</p>
      <p>Zkratky a&nbsp;pojmy sjednotím, zhod&shy;notím návaznost textu, zkontroluji odkazy, posoudím strukturu.</p>
      <svg className="ok" viewBox="0 0 34 34">
        <circle cx="17" cy="17" r="15" />
        <path d="M10 17.5l5 5 9-11" />
      </svg>
    </>
  );
}

export function HeroArt({ aw }: { aw: number }) {
  const { step, played, ref } = useHeroSteps();
  const wide = useMedia('(min-width: 1080px)');
  return (
    <Lay aw={aw} ratio={1.6} artRef={ref}>
      <Dial aw={aw} />
      <Flat id={0} w={aw * 0.69} rz={9} left={px(aw * 0.59)} top={px(aw * 0.635)} />
      <Ms
        width={aw * 1.08}
        className={`hero-ms st-${step}${played ? ' play' : ''}`}
        style={{ left: px(wide ? -aw * 0.12 : aw * 0.1), top: px(aw * 0.047), rotate: '-5deg', zIndex: 2 }}
      >
        <HeroSheet step={step} />
      </Ms>
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
