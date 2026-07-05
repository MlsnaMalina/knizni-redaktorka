import { Link } from "react-router-dom";
import { usePageMeta, Tag, WaveDivider, Faq, CtaSection, type FaqItem } from "../ui";

interface ServiceDetail {
  num: string;
  title: string;
  desc: string;
  annot: string;
  bullets: string[];
  link?: { to: string; label: string };
}

const SERVICES: ServiceDetail[] = [
  {
    num: "01",
    title: "Redakce odborných publikací",
    desc: "Kompletní redakce rukopisu: struktura a logika výkladu, terminologická a formální jednotnost, jazyková a stylistická kultivace, typografie, kontrola citací a odkazů, připomínky autorovi. Pracuji v režimu sledování změn — autor má nad každou úpravou kontrolu.",
    annot: "⌘ sledování změn: zap.",
    bullets: [
      "připravujete komentář, učebnici, monografii nebo odborný e-book,",
      "rukopis vzniká od většího autorského kolektivu a potřebuje sjednotit,",
      "text má projít nakladatelstvím, recenzním řízením nebo odbornou oponenturou.",
    ],
  },
  {
    num: "02",
    title: "Úprava profesních a odborných textů",
    desc: "Odborné články, newslettery, texty na web, profesní medailonky a doprovodné materiály. Cílem je text, který reprezentuje — přesný, kultivovaný a přirozený. Právě u kratších textů rozhoduje každá věta o tom, jak budete působit na čtenáře, klienta nebo odbornou komunitu.",
    annot: "✎ formulace zpřesněna",
    bullets: [
      "odborné sdělení potřebuje jasnější formulaci,",
      "text má obstát i před náročným čtenářem,",
      "výstup reprezentuje vás nebo vaši instituci navenek.",
    ],
  },
  {
    num: "03",
    title: "Revize textů vytvořených s pomocí AI",
    desc: "AI umí připravit základ. Neumí ale ručit za přesnost, jednotnou terminologii ani za to, jak text působí na odborného čtenáře. Draft zpřesním, sjednotím a dotáhnu do podoby, za kterou se podepíšete — včetně kontroly faktů, citací a odkazů na předpisy.",
    annot: "↺ lidský hlas obnoven",
    bullets: [
      "máte AI draft, který nechcete pustit ven v surové podobě,",
      "text zní obecně, strojově nebo si nejste jistí fakty a citacemi,",
      "potřebujete profesionální výstup, nejen rychlý základ.",
    ],
    link: { to: "/revize-ai-textu", label: "Více o revizích AI textů →" },
  },
  {
    num: "04",
    title: "Redakční konzultace k textu",
    desc: "Posouzení rukopisu nebo textu: silná a slabá místa, nejasnosti, strukturální problémy — a doporučení, co upravit jako první a co už řešit nemusíte. Dostanete jasný plán práce místo vágního pocitu, že „by to chtělo ještě projít“.",
    annot: "// poznámka redaktorky",
    bullets: [
      "si nejste jistí, v jakém stavu text vlastně je,",
      "chcete nezávislé posouzení před odevzdáním nebo publikací,",
      "část práce si uděláte sami a potřebujete jen jasný směr.",
    ],
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Jak je to s důvěrností?",
    a: "S každým textem nakládám jako s důvěrným — bez výjimky. Rukopis nikomu neukazuji, nepoužívám ho jako referenci bez vašeho svolení a na přání podepíšu smlouvu o mlčenlivosti (NDA). U právních a firemních textů to považuji za samozřejmost.",
  },
  {
    q: "Jak probíhá ukázková redakce zdarma?",
    a: "Pošlete mi 3–5 stran textu. Zrediguji je v režimu sledování změn, přidám okrajové komentáře a pošlu zpět — uvidíte přesně, jak pracuji a co s textem dělám. Je to zdarma a k ničemu vás to nezavazuje.",
  },
  {
    q: "V jakém formátu pracujeme?",
    a: "Standardně ve Wordu s režimem sledování změn. Každá úprava je viditelná a můžete ji přijmout, nebo odmítnout. Komentáře a dotazy píšu na okraj — nic se neděje bez vašeho vědomí.",
  },
  {
    q: "Co když s navrženou úpravou nesouhlasím?",
    a: "Pak platí vaše verze. Jsem redaktorka, ne spoluautorka — návrhy zdůvodňuji, ale rozhodnutí je vždy na vás.",
  },
  {
    q: "Jak dlouho redakce trvá?",
    a: "Podle rozsahu a stavu textu — kratší text dny, rozsáhlý rukopis týdny. Termín je vždy součástí nabídky a platí.",
  },
  {
    q: "Kolik to stojí?",
    a: "Cenu stanovuji předem za celý projekt podle rozsahu a stavu textu. První krok — posouzení i ukázková redakce — je zdarma, takže nabídku dostanete dřív, než se k čemukoli zavážete.",
  },
  {
    q: "Spolupracujete i s nakladatelstvími a institucemi?",
    a: "Ano. Devět let rediguji knihy pro nakladatelství Wolters Kluwer ČR a externí redakce nabízím i dalším nakladatelstvím, profesním organizacím a odborným institucím.",
  },
  {
    q: "Upravujete i dizertační a jiné kvalifikační práce?",
    a: "Nabízím jazykovou a redakční kultivaci textu v mezích pravidel dané univerzity — strukturu, jednotnost, formulace, citace. Obsah, odborné závěry a autorství zůstávají vždy plně na autorovi.",
  },
];

export default function Sluzby() {
  usePageMeta(
    "Služby — redakce odborných textů | Kateřina Mlsnová",
    "Redakce odborných publikací, úprava profesních textů, revize AI textů a redakční konzultace. Ukázková redakce zdarma, cena předem za celý projekt."
  );

  return (
    <main className="page">
      <section className="section-sm container" style={{ paddingTop: "clamp(56px,7vw,96px)" }}>
        <Tag>— Moje služby</Tag>
        <h1 className="h1" style={{ maxWidth: "none" }}>
          Od rukopisu k <span className="mark">vydané knize</span>. A ke všemu mezi tím.
        </h1>
        <p className="perex" style={{ marginTop: 24, maxWidth: 780 }}>
          Nejčastěji rediguji odborné a právní publikace — komentáře, učebnice, monografie.
          Pracuji ale i s kratšími profesními texty, AI drafty a s autory, kteří zatím potřebují
          jen zkušený pohled zvenčí.
        </p>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      {/* SLUŽBY — střídavý layout s obřími čísly */}
      <section className="section-sm container">
        <Tag>— Co pro vás mohu udělat</Tag>
        {SERVICES.map((s, idx) => (
          <div key={s.num} className={`alt-row reveal${idx % 2 === 1 ? " rev" : ""}`}>
            <div className="alt-num" aria-hidden="true">
              <span className="big">{s.num}</span>
              <span className="alt-annot">{s.annot}</span>
            </div>
            <div className="alt-body">
              <span className="svc-label">služba {s.num}</span>
              <h3 style={{ fontSize: "clamp(20px,2.4vw,28px)", margin: "10px 0 14px" }}>
                {s.title}
              </h3>
              <p
                className="just"
                style={{ fontSize: 15, color: "rgba(26,23,20,0.65)", lineHeight: 1.75 }}
              >
                {s.desc}
              </p>
              <div className="svc-label" style={{ display: "block", margin: "22px 0 10px" }}>
                HODÍ SE, KDYŽ:
              </div>
              <ul style={{ listStyle: "none" }}>
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "4px 0",
                      fontSize: "14.5px",
                      color: "rgba(26,23,20,0.65)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        color: "#7A1840",
                        fontSize: 12,
                        paddingTop: 3,
                      }}
                    >
                      →
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {s.link && (
                <Link
                  to={s.link.to}
                  className="link-arrow"
                  style={{ display: "inline-block", marginTop: 16 }}
                >
                  {s.link.label}
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>

      <WaveDivider />

      {/* CENY */}
      <section className="section container reveal">
        <div className="split">
          <div className="split-main">
            <Tag>— Ceny</Tag>
            <h2 className="h2">
              Cena podle textu, <span className="mark">ne podle ceníku</span>.
            </h2>
            <p className="perex just" style={{ marginTop: 20, maxWidth: "none" }}>
              Každý rukopis potřebuje jinak hluboký zásah — proto nemám jednotný ceník za stranu.
              Cenu stanovuji podle rozsahu, stavu textu a typu práce, vždy předem a za celý
              projekt, ať víte, s čím počítat.
            </p>
          </div>
        </div>
        <div className="price-steps">
          <div className="price-step tile">
            <div className="price-step-num">01</div>
            <p>Pošlete mi text nebo jeho část.</p>
          </div>
          <div className="price-step tile">
            <div className="price-step-num">02</div>
            <p>Do 2–3 pracovních dnů dostanete konkrétní nabídku — rozsah práce, termín a cenu.</p>
          </div>
          <div className="price-step tile">
            <div className="price-step-num">03</div>
            <p>
              Posouzení textu i ukázková redakce několika stran jsou zdarma a k ničemu vás
              nezavazují.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      {/* HRANICE */}
      <section className="section container reveal">
        <Tag>— Moje role a hranice spolupráce</Tag>
        <h2 className="h2" style={{ marginBottom: 20 }}>
          Text posunu. <span className="mark">Autorem zůstáváte vy.</span>
        </h2>
        <div className="split" style={{ alignItems: "center" }}>
          <div className="split-main">
            <div className="limits" style={{ maxWidth: "none" }}>
              <div className="limit-row">
                <span className="x">✗</span>
                <span>nepíšu text na klíč místo autora,</span>
              </div>
              <div className="limit-row">
                <span className="x">✗</span>
                <span>nepřebírám odbornou odpovědnost za obsah,</span>
              </div>
              <div className="limit-row">
                <span className="x">✗</span>
                <span>nenahrazuji autorskou práci, ale pomáhám text dovést na vyšší úroveň.</span>
              </div>
              <p className="limits-note">
                Pokud budete chtít, mohu do procesu zapojit i další prověřené specialisty,
                například zkušenou jazykovou korektorku.
              </p>
            </div>
          </div>
          <div className="split-side" aria-hidden="true" style={{ textAlign: "center" }}>
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(90px,12vw,160px)",
                color: "rgba(184,48,102,0.1)",
                lineHeight: 1,
              }}
            >
              ¶
            </span>
          </div>
        </div>
      </section>

      <WaveDivider flip />

      {/* FAQ s grafikou */}
      <section className="section container reveal">
        <Tag>— Časté otázky</Tag>
        <h2 className="h2" style={{ marginBottom: "clamp(28px,4vw,44px)" }}>
          Co klienty zajímá, než mi napíšou.
        </h2>
        <div className="faq-wrap">
          <div className="faq-deco" aria-hidden="false">
            <span className="qmark" aria-hidden="true">
              ?
            </span>
            <div className="faq-bubble">
              <div className="demo-bubble-name">K. Mlsnová</div>
              <div style={{ fontSize: 13, color: "rgba(26,23,20,0.65)", lineHeight: 1.55 }}>
                Nenašli jste svou otázku?{" "}
                <Link to="/kontakt" style={{ color: "#7A1840", fontWeight: 500 }}>
                  Napište mi →
                </Link>
              </div>
            </div>
          </div>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      <CtaSection />
    </main>
  );
}
