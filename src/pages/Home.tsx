import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta, Tag, WaveDivider, Manuscript, Quote, CtaSection } from "../ui";

const STATS = [
  { num: 70, suffix: "+", label: "vydaných odborných knih" },
  { num: 9, suffix: "", label: "let v advokacii" },
  { num: 9, suffix: "+", label: "let knižní redakce" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const duration = 1100;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return (
    <>
      {value}
      {suffix}
    </>
  );
}

const SERVICES = [
  {
    num: "01",
    title: "Redakce odborných publikací",
    desc: "Rukopisy komentářů, učebnic, monografií a e-booků. Struktura, terminologická jednotnost, citace a redakční dotažení až k vydání.",
    annot: "⌘ sledování změn: zap.",
    to: "/sluzby",
  },
  {
    num: "02",
    title: "Úprava profesních textů",
    desc: "Odborné články, newslettery, texty na web a materiály, které vás reprezentují navenek.",
    annot: "✎ formulace zpřesněna",
    to: "/sluzby",
  },
  {
    num: "03",
    title: "Revize textů z AI",
    desc: "AI draft zpřesním, sjednotím a zbavím typických AI chyb, aby obstál při profesionálním použití.",
    annot: "↺ lidský hlas obnoven",
    to: "/revize-ai-textu",
  },
  {
    num: "04",
    title: "Redakční konzultace",
    desc: "Posouzení textu, pojmenování slabých míst a doporučení, co upravit a v jakém pořadí.",
    annot: "// poznámka redaktorky",
    to: "/sluzby",
  },
];

const PORTFOLIO_GROUPS = [
  {
    name: "Komentáře k zákonům",
    items: [
      "Komentář nařízení o kryptoaktivech (MiCA)",
      "Komentář zákona o podnikání na kapitálovém trhu",
      "Komentář zákona o platebním styku",
    ],
    more: "+ 24 dalších komentářů",
  },
  {
    name: "Právo IT a kybernetická bezpečnost",
    items: [
      "Právo informačních technologií",
      "Kybernetický bezpečnostní incident 3D: IT, právo a compliance",
    ],
    more: "+ další tituly z práva IT",
  },
  {
    name: "Umělá inteligence",
    items: [
      "Trestní odpovědnost umělé inteligence",
      "Umělá inteligence z pohledu antidiskriminačního práva a GDPR",
      "Právní aspekty umělé inteligence",
    ],
    more: "+ 5 dalších titulů o AI",
  },
];

const PRO_YES = [
  "chcete, aby text působil profesionálně a důvěryhodně,",
  "chápete, že kvalitní text vzniká postupně,",
  "stojíte o zkušený redakční pohled, nejen o rychlé projetí,",
  "jste připraveni na textu dál pracovat a ladit ho.",
];

const PRO_NO = [
  "čekáte, že text napíšu nebo dopíšu za vás,",
  "hledáte jen rychlé formální projetí bez skutečné práce s textem.",
];

const STEPS = [
  {
    title: "Seznámím se s textem",
    desc: "Ujasníme si, v jakém stavu text je, co od něj očekáváte a jaký typ práce dává smysl.",
  },
  {
    title: "Navrhnu vhodný postup",
    desc: "Rozliším, co je potřeba řešit přednostně — strukturu, formulaci, jazyk nebo konzistenci.",
  },
  {
    title: "Pracuji přehledně",
    desc: "Veškeré úpravy provádím v režimu sledování změn — autor má vždy naprostou kontrolu.",
  },
  {
    title: "Text dotáhneme",
    desc: "Cílem je výstup čitelný, profesionální a připravený k dalšímu použití nebo publikaci.",
  },
];

export default function Home() {
  usePageMeta(
    "Kateřina Mlsnová — knižní redaktorka odborných a právních textů",
    "Redakce odborných a právních publikací. Přes 70 vydaných knih — komentáře k zákonům, učebnice i monografie o právu IT a umělé inteligenci. Ukázková redakce zdarma."
  );

  const [hlOn, setHlOn] = useState(false);
  const [edited, setEdited] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setHlOn(true), 100);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <span className="supertag">— redakce odborných a právních textů</span>
          <div className="hero-firstname">K A T E Ř I N A</div>
          <h1 className="hero-surname">
            MLSNOVÁ<span className="cursor">▌</span>
          </h1>
          <p className={`hero-value${hlOn ? " hl-on" : ""}`}>
            <span className="hl">Aby váš odborný text obstál</span> — v knize, v posudku i před
            odbornou komunitou.
          </p>
          <p className="hero-sub">
            Jsem knižní redaktorka právních a odborných publikací. Za devět let jsem redigovala
            více než 70 vydaných knih — od komentářů k zákonům po monografie o umělé inteligenci.
          </p>
          <div className="hero-actions">
            <Link to="/kontakt" className="btn-primary">
              Ukázková redakce zdarma
            </Link>
            <Link to="/sluzby" className="btn-ghost">
              Co dělám
            </Link>
          </div>
          <Manuscript />
        </div>
        <div className="hero-right">
          {STATS.map((s) => (
            <div key={s.label} className="stat-card tile">
              <div className="stat-num">
                <CountUp target={s.num} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
          <div className="mono-note hero-mono">
            {"// právo · právo IT"}
            <br />
            {"// technologie · AI"}
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* PORTFOLIO — stohy papírů */}
      <section className="section container reveal">
        <div className="section-head">
          <div>
            <Tag>— Portfolio</Tag>
            <h2 className="h2">
              Přes <span className="mark">70 vydaných knih</span>. Tady je několik z nich.
            </h2>
          </div>
        </div>
        <div className="pf-grid">
          {PORTFOLIO_GROUPS.map((g) => (
            <div key={g.name} className="stack reveal">
              <div className="tile" style={{ padding: "clamp(22px,3vw,30px)" }}>
                <div className="pf-group-title">{g.name}</div>
                {g.items.map((title) => (
                  <div key={title} className="pf-item">
                    <span className="pilcrow">¶</span>
                    <span>{title}</span>
                  </div>
                ))}
                <div
                  className="mono-note"
                  style={{ marginTop: 14, fontSize: 10, color: "rgba(26,23,20,0.35)" }}
                >
                  {g.more}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pf-footnote">
          <span className="mono-note">
            + celkem více než 70 titulů redigovaných pro nakladatelství Wolters Kluwer ČR —
            komentáře, učebnice, monografie a publikace na klíč.
          </span>
          <Link to="/knihy" className="link-arrow">
            Všech 70+ titulů →
          </Link>
        </div>
      </section>

      {/* SLUŽBY */}
      <section className="section container reveal">
        <div className="section-head">
          <div>
            <Tag>— Služby</Tag>
            <h2 className="h2">
              Každý text potřebuje
              <br />
              <span className="strike">korekturu</span> <span className="mark">redakci</span>.
            </h2>
            <p className="perex" style={{ marginTop: 20 }}>
              A každý trochu jinou. Nejčastěji se na mě autoři obracejí, když text působí
              nejednotně, potřebuje kultivovat styl a formulace — nebo má obstát před odborným a
              náročným čtenářem.
            </p>
          </div>
          <Link to="/sluzby" className="btn-ghost">
            Všechny služby →
          </Link>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <Link key={s.num} to={s.to} className="svc-card tile reveal">
              <span className="svc-annot">{s.annot}</span>
              <span className="svc-num" aria-hidden="true">
                {s.num}
              </span>
              <span className="svc-label">služba {s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="svc-link">Zjistit více →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* REDAKČNÍ STŮL — ukázka před/po */}
      <section className="section container reveal">
        <div className="desk">
          <Tag>— Jak vypadá moje práce</Tag>
          <h2 className="h2" style={{ maxWidth: 680, marginBottom: "clamp(28px,4vw,44px)" }}>
            Podívejte se mi přes rameno.
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <button className="desk-btn" onClick={() => setEdited(!edited)}>
              {edited ? "← ZPĚT NA PŮVODNÍ" : "ZOBRAZIT REDAKCI →"}
            </button>
            <span className="desk-state">
              {edited ? "PO · redakce hotova ✓" : "PŘED · rukopis autora"}
            </span>
          </div>

          <div className="paper" style={{ maxWidth: 640, transform: "rotate(-0.6deg)" }}>
            <div className="demo-doc-label">
              <span>{edited ? "PO · sledování změn" : "PŘED"}</span>
              <span className={edited ? "ok" : undefined}>
                {edited ? "redakce ✓" : "rukopis autora"}
              </span>
            </div>
            {edited ? (
              <p className="demo-text">
                „<span className="del">Zaměstnavatel je povinen zajistit, aby v případě, že dojde
                k situaci, kdy dochází</span> <span className="ins">Dochází-li</span> k rozdílnému
                zacházení se zaměstnanci, <span className="del">bylo toto zacházení posuzováno v
                souladu se zákonem č. 189/2009 Sb.</span>{" "}
                <span className="ins">posuzuje se podle antidiskriminačního zákona (č. 198/2009
                Sb.).</span>"
              </p>
            ) : (
              <p className="demo-text">
                „Zaměstnavatel je povinen zajistit, aby v případě, že dojde k situaci, kdy dochází
                k rozdílnému zacházení se zaměstnanci, bylo toto zacházení posuzováno v souladu se
                zákonem č. 189/2009 Sb."
              </p>
            )}
          </div>
          {edited && (
            <p className="desk-legend">
              přeškrtnuté = vypuštěno · podtržené = vloženo · a mimochodem: antidiskriminační
              zákon je 198/2009 Sb., ne 189
            </p>
          )}

          <div className="demo-mid">{"// někdy opravím tiše — jindy se zeptám"}</div>
          <div className="paper" style={{ maxWidth: 640, transform: "rotate(0.7deg)" }}>
            <p className="demo-text">
              „…postup zadavatele v takovém případě upravuje{" "}
              <span className="ref">zákon č. 137/2006 Sb., o veřejných zakázkách</span>."
            </p>
          </div>
          <div className="demo-bubble">
            <div className="demo-bubble-name">K. Mlsnová</div>
            <div className="demo-bubble-text">
              Skutečně chcete odkazovat na tento zákon? Ke dni 1. 10. 2016 byl zrušen. Přidáme k
              textu tuto informaci, nebo odkážeme na nahrazující zákon č. 134/2016 Sb., o zadávání
              veřejných zakázek?
            </div>
          </div>

          <p className="demo-after">
            Takhle vypadá běžná redakční práce: věta se zkrátí o polovinu, přepis v čísle předpisu
            zmizí dřív, než ho kdokoli uvidí — a tam, kde jde o obsah, se nerozhoduju za vás, ale
            ptám se. Všechny úpravy navrhuji v režimu sledování změn; poslední slovo máte vždy vy.
          </p>
        </div>
      </section>

      {/* PRO KOHO */}
      <section className="section container reveal">
        <Tag>— Pro koho je moje práce vhodná</Tag>
        <h2 className="h2" style={{ marginBottom: "clamp(24px,4vw,40px)" }}>
          Spolupracujeme dobře, když —
        </h2>
        {PRO_YES.map((text) => (
          <div key={text} className="pk-row yes">
            <span className="pk-box">✓</span>
            <span className="pk-text">{text}</span>
          </div>
        ))}
        <div className="pk-sep">— ne, pokud:</div>
        {PRO_NO.map((text) => (
          <div key={text} className="pk-row no">
            <span className="pk-box">✗</span>
            <span className="pk-text">{text}</span>
          </div>
        ))}
      </section>

      <WaveDivider flip />

      {/* REFERENCE */}
      <section className="section container reveal">
        <Tag>— Co říkají autoři</Tag>
        <div className="quote-grid" style={{ marginTop: "clamp(24px,4vw,40px)" }}>
          <Quote
            text="Mimořádná spokojenost s paní Kateřinou, velice lehká spolupráce, odpovídá okamžitě a vždy se snaží hodně pomoct."
            source="AUTOR ODBORNÉ PUBLIKACE"
          />
          <Quote
            text="V posudcích, ale i při obhajobě mi chválili úpravu a celkovou redakci práce. Umíte to!"
            source="AUTOR DIZERTAČNÍ PRÁCE"
          />
        </div>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      {/* PROCES */}
      <section className="section container reveal">
        <Tag>— Jak spolupráce probíhá</Tag>
        <h2 className="h2" style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
          Čtyři kroky od textu k výsledku.
        </h2>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={s.title} className="step">
              <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaSection />
    </main>
  );
}
