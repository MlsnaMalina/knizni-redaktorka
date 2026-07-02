import { Link } from "react-router-dom";
import { usePageMeta, Tag, WaveDivider } from "../ui";

const PROBLEMS = [
  {
    num: "01",
    title: "Přesnost",
    desc: "AI si vymýšlí zdroje, citace i paragrafy. V odborném textu je to diskvalifikace; každý odkaz proto prověřuji.",
  },
  {
    num: "02",
    title: "Jednotnost",
    desc: "Terminologie a styl se mění odstavec od odstavce. Sjednotím pojmy, tón i strukturu.",
  },
  {
    num: "03",
    title: "Lidský hlas",
    desc: "Strojový rytmus, prázdné fráze a „AI vata“. Text zkrátím a vrátím mu přirozenost.",
  },
  {
    num: "04",
    title: "Odpovědnost",
    desc: "AI za text neručí. Po redakci víte, co v textu je, proč to tam je a že to obstojí.",
  },
];

const STEPS = [
  "Pošlete draft a řeknete, kde má text fungovat.",
  "Zreviduji ho v režimu sledování změn, sporná místa označím a fakta k ověření vyznačím.",
  "Dostanete text připravený k publikaci, s přehledem všech zásahů.",
];

export default function RevizeAI() {
  usePageMeta(
    "Revize AI textů — redakce textů vytvořených s pomocí AI | Kateřina Mlsnová",
    "AI napíše draft — já z něj udělám text, za který se podepíšete. Kontrola faktů a citací, sjednocení terminologie, lidský tón. Ukázková revize zdarma."
  );

  return (
    <main className="page">
      <section className="section-sm container" style={{ paddingTop: "clamp(56px,7vw,96px)" }}>
        <Tag>— Revize AI textů</Tag>
        <h1 className="h1">AI napíše draft. Já z něj udělám text, za který se podepíšete.</h1>
        <p className="perex" style={{ marginTop: 24 }}>
          Redigovala jsem odborné knihy o umělé inteligenci — a dnes pomáhám s texty, které s její
          pomocí vznikají. AI výstup umí být skvělý základ. Bez lidské redakce ale zůstává jen
          základem.
        </p>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      <section className="section container">
        <Tag>— Co AI textům typicky chybí</Tag>
        <div style={{ marginTop: 16 }}>
          {PROBLEMS.map((p) => (
            <div key={p.num} className="sit-row">
              <span className="sit-num">{p.num}</span>
              <span className="sit-text">
                <strong style={{ color: "#1A1714", fontWeight: 600 }}>{p.title}</strong> —{" "}
                {p.desc}
              </span>
              <span className="sit-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      <WaveDivider />

      <section className="section container">
        <Tag>— Jak revize probíhá</Tag>
        <div className="price-steps">
          {STEPS.map((s, i) => (
            <div key={s} className="price-step tile">
              <div className="price-step-num">{String(i + 1).padStart(2, "0")}</div>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      <section className="section container">
        <Tag>— Pro koho</Tag>
        <p className="perex" style={{ maxWidth: 680 }}>
          Pro právníky, konzultanty, marketéry a firmy, které AI používají na první verze článků,
          newsletterů, dokumentací nebo e-booků — a potřebují, aby finální výstup byl přesný a
          důvěryhodný.
        </p>
      </section>

      <section className="cta">
        <div className="cta-label">UKÁZKA ZDARMA</div>
        <h2>Máte AI draft? Pošlete mi ho.</h2>
        <p>Ukázková revize několika stran zdarma — uvidíte rozdíl dřív, než se rozhodnete.</p>
        <Link to="/kontakt" className="btn-primary">
          Chci ukázkovou revizi →
        </Link>
      </section>
    </main>
  );
}
