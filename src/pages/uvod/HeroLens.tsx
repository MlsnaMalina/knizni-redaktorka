import { editOrder, useEditLoop } from './editLoop';

const RUN = ['Rukopis', 'Změny', 'Čistopis'] as const;

/**
 * Úvodní obrazovka na telefonu (Kateřina vybrala 7. 11. 2026 Lupu na prošívání a ze tří směrů bohatší grafiky Skutečnou lupu): úprava věty
 * ve skleněném kruhu s černým okrajem a rukojetí (Rukopis, Změny, Čistopis, při každém načtení a pak dokola, viz editLoop.ts), kolem modrá
 * nit a kruhy ohniska, které se točí proti sobě. Kolem lupy žádný text. Jen dekorace, nadpis a čísla stojí pod ní.
 */
export function HeroLens() {
  const { step, ref } = useEditLoop();
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
            <del style={editOrder(0)}>Mým cílem je pomoci vám, aby</del> <ins style={editOrder(0)}>Aby</ins> váš text <del style={editOrder(1)}>byl schopen obstát</del>{' '}
            <ins style={editOrder(1)}>obstál</ins> před recenzenty i&nbsp;čtenáři, <del style={editOrder(2)}>a&nbsp;proto</del> musí být přesný, srozumitelný a&nbsp;jednotný v&nbsp;celém
            rozsahu.
          </p>
        </div>
      </div>
    </div>
  );
}
