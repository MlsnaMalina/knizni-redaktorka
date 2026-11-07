import { useHeroSteps } from './Arts';

const RUN = ['Rukopis', 'Změny', 'Čistopis'] as const;

/**
 * Úvodní obrazovka na telefonu (Kateřina vybrala 7. 11. 2026 Lupu na prošívání): úprava věty v kruhu, který se při první návštěvě
 * přehraje (Rukopis, Změny, Čistopis, stejně jako list v hero na počítači), kolem modrá nit a kruhy ohniska, které se pomalu točí
 * proti sobě. Kolem lupy žádný text. Jen dekorace, nadpis a čísla stojí pod ní.
 */
export function HeroLens() {
  const { step, played, ref } = useHeroSteps();
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
      <div className={`hl-lens hero-ms st-${step}${played ? ' play' : ''}`}>
        <div className="hl-text">
          <p className="run">{RUN[step]}</p>
          <p>
            <del>Mým cílem je pomoci vám, aby</del> <ins>Aby</ins> váš text <del>byl schopen obstát</del> <ins>obstál</ins> před recenzenty i&nbsp;čtenáři,{' '}
            <del>a&nbsp;proto</del> musí být přesný, srozumitelný a&nbsp;jednotný v&nbsp;celém rozsahu.
          </p>
        </div>
      </div>
    </div>
  );
}
