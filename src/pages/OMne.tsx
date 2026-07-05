import { usePageMeta, Tag, WaveDivider, CtaSection } from "../ui";

const WORK_STEPS = [
  {
    title: "Nejdřív si text přečtu a zorientuji se v něm",
    desc: "Potřebuji vědět, v jakém stavu text je, co od něj očekáváte a co mu v dané chvíli skutečně pomůže.",
  },
  {
    title: "Navrhnu, co má smysl řešit jako první",
    desc: "Ne všechno je potřeba opravovat najednou. Důležité je rozeznat, co je podstatné a co už by byla zbytečná práce navíc.",
  },
  {
    title: "Pracuji přehledně a s respektem k autorovi",
    desc: "Veškeré návrhy dělám tak, aby bylo jasné, co a proč se v textu mění. Text zlepšuji, ale nepřebírám jeho autorství.",
  },
  {
    title: "Cílem je výsledek, který obstojí",
    desc: "Text má být přesný, srozumitelný, jednotný a profesionální — nejen obsahově, ale i tím, jak působí na čtenáře.",
  },
];

export default function OMne() {
  usePageMeta(
    "O mně — z advokacie do knižní redakce | Kateřina Mlsnová",
    "Právní vzdělání, 9 let advokacie, 9 let knižní redakce a přes 70 vydaných odborných knih. Specializace na právo, právo IT, technologie a umělou inteligenci."
  );

  return (
    <main className="page">
      <section className="about-hero">
        <div className="about-hero-text">
          <Tag>— O mně</Tag>
          <h1 className="h1" style={{ fontSize: "clamp(30px,4vw,54px)" }}>
            Z advokacie do <span className="mark">knižní redakce</span>.
          </h1>
          <p className="perex" style={{ marginTop: 24, maxWidth: 520 }}>
            Devět let jsem pracovala v advokacii. Pak jsem odešla do nakladatelství Wolters Kluwer
            ČR — a zjistila, že mě víc než psaní podání baví dávat tvar odborným textům. Dnes mám
            za sebou přes 70 vydaných knih: komentáře k zákonům, učebnice, monografie i publikace
            na klíč. Nejblíž mám k právu, právu IT, technologiím a umělé inteligenci — redigovala
            jsem mimo jiné komentář k nařízení MiCA nebo monografie o trestní odpovědnosti umělé
            inteligence.
          </p>
          <div className="about-facts tile">
            <div className="about-facts-title">Stručně řečeno</div>
            <ul>
              <li>
                <span className="pilcrow">¶</span>více než 70 vydaných odborných knih,
              </li>
              <li>
                <span className="pilcrow">¶</span>9 let advokacie + 9 let knižní redakce,
              </li>
              <li>
                <span className="pilcrow">¶</span>specializace: právo, právo IT, technologie, AI.
              </li>
            </ul>
          </div>
        </div>
        <div className="about-hero-photo">
          {/* Až bude portrét: <img src="/portret.jpg" alt="Kateřina Mlsnová" /> */}
          <div className="photo-placeholder" aria-hidden="true">
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(48px,6vw,84px)",
                color: "rgba(26,23,20,0.08)",
              }}
            >
              KM<span className="cursor" style={{ fontSize: "0.8em" }}>▌</span>
            </span>
          </div>
          <div className="photo-annot">
            <div className="photo-annot-name">K. Mlsnová</div>
            <div className="photo-annot-role">
              knižní redaktorka
              <br />
              odborných textů
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      <section className="section container">
        <div className="info-cards">
          <div className="info-card tile">
            <h3>Proč mi rozumí právníci</h3>
            <p>
              Vím, jak právní text vzniká a co musí vydržet — protože jsem ho léta sama psala.
              Rozumím terminologii, citacím, judikatuře i tomu, jak přemýšlí oponent. Autor mi
              nemusí vysvětlovat, co je komentář nebo proč záleží na jednom slovu v definici.
            </p>
          </div>
          <div className="info-card tile">
            <h3>Co v textu sleduji</h3>
            <ul>
              <li>logiku a členění výkladu,</li>
              <li>terminologickou a formální jednotnost,</li>
              <li>typografii a citace,</li>
              <li>celkový dojem, jakým text působí na odborného čtenáře.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      <section className="section container">
        <Tag>— Jak pracuji</Tag>
        <h2 className="h2" style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
          Systematicky, přehledně a po vrstvách.
        </h2>
        <div className="vsteps">
          {WORK_STEPS.map((s, i) => (
            <div key={s.title} className="vstep">
              <div className="vstep-rail">
                <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
                {i < WORK_STEPS.length - 1 && <div className="vstep-line" />}
              </div>
              <div className="vstep-body">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      <section className="section container">
        <div className="personal-quote">
          <span
            aria-hidden="true"
            style={{
              fontFamily: "Literata, Georgia, serif",
              fontWeight: 700,
              fontSize: 64,
              lineHeight: 0.65,
              color: "rgba(122,24,64,0.1)",
              display: "block",
              marginBottom: 18,
            }}
          >
            „
          </span>
          <p
            style={{
              fontStyle: "italic",
              fontSize: "clamp(16px,1.8vw,21px)",
              lineHeight: 1.68,
              color: "rgba(26,23,20,0.65)",
              marginBottom: 16,
            }}
          >
            Baví mě chvíle, kdy se z dobrého základu stane opravdu dobrý výsledek. Když text začne
            držet pohromadě, je přesnější, klidnější a působí jistěji než na začátku.
          </p>
          <span className="quote-src">— Kateřina Mlsnová</span>
        </div>
      </section>

      <CtaSection />
    </main>
  );
}
