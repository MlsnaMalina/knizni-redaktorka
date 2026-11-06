import { nb } from '../../lib/format';
import './prokoho.css';

/* Pro koho (5. 11. 2026, návrh A Dvě strany): texty schválené z v2/v3 (čtyři podmínky, dvě odmítnutí), vlevo kdy spolupráce
   dává smysl, vpravo kdy ne. Část leží na čisté bílé; síť na pozadí (uvod-net.ts) se kreslí jen za ohniskem a výzvou. */
const YES = [
  'chcete, aby text působil profesionálně a důvěryhodně',
  'chápete, že kvalitní text vzniká postupně',
  'stojíte o zkušený redakční pohled, nejen o rychlé projetí',
  'jste připraveni na textu dál pracovat a ladit ho',
];
const NO = ['čekáte, že text napíšu nebo dopíšu za vás', 'hledáte jen kontrolu překlepů bez práce s textem'];

/** Kroužek se zaškrtnutím (modrý) nebo křížkem (šedý). Jen ozdoba: význam nese nadpis a štítek Ne, pokud. */
function Mark({ no = false }: { no?: boolean }) {
  return (
    <svg className="pk-mk" viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="12.5" fill="none" stroke={no ? '#9a9a9a' : '#002fa7'} strokeWidth="1.5" />
      <path
        d={no ? 'M9.5 9.5l9 9M18.5 9.5l-9 9' : 'M8.5 14.5l3.6 3.6 7.4-8'}
        fill="none"
        stroke={no ? '#6e6e6e' : '#002fa7'}
        strokeWidth={no ? 1.6 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProKoho() {
  return (
    <section className="scene" id="prokoho" aria-labelledby="t-prokoho">
      <div className="copy pk">
        <h2 id="t-prokoho">Spolupracujeme dobře, když…</h2>
        <div className="pk-cols">
          <ul className="pk-yes">
            {YES.map((t) => (
              <li key={t}>
                <Mark />
                <span>{nb(t)}</span>
              </li>
            ))}
          </ul>
          <div className="pk-no">
            <p className="pk-nh">Ne, pokud:</p>
            <ul>
              {NO.map((t) => (
                <li key={t}>
                  <Mark no />
                  <span>{nb(t)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
