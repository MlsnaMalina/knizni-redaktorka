import { useState, type FormEvent } from "react";
import { usePageMeta, Tag } from "../ui";

/* Formulář odesílá přes FormSubmit (AJAX endpoint). Po zřízení domény
   přepnout adresu na katerina@knizniredaktorka.cz a aktivovat potvrzovacím
   e-mailem (FormSubmit pošle aktivační zprávu při prvním odeslání). */
const FORM_ENDPOINT = "https://formsubmit.co/ajax/k.mlsnova@seznam.cz";

const INTENTS = [
  "Ukázkovou redakci zdarma",
  "Nacenit text",
  "Redakční konzultaci",
  "Jen se zeptat",
];

type FormState = "idle" | "sending" | "done" | "error";

export default function Kontakt() {
  usePageMeta(
    "Kontakt — pošlete mi svůj text | Kateřina Mlsnová",
    "Napište mi, o jaký text jde a co od spolupráce čekáte. Odpovídám do 2 pracovních dnů. Posouzení textu i ukázková redakce zdarma."
  );

  const [state, setState] = useState<FormState>("idle");
  const [intent, setIntent] = useState(INTENTS[0]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get("_honey") as string)?.length) return; // spam past
    setState("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <main className="page">
      <section className="section-sm container" style={{ paddingTop: "clamp(56px,7vw,96px)" }}>
        <Tag>— Kontakt</Tag>
        <h1 className="h1">Pošlete mi svůj text. Nebo jen otázku.</h1>
        <p className="perex" style={{ marginTop: 24 }}>
          Napište mi, o jaký text jde a co od spolupráce čekáte. Odpovídám do 2 pracovních dnů a
          první krok — posouzení nebo ukázková redakce — je vždy zdarma.
        </p>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      <section className="section container" style={{ paddingTop: "clamp(48px,6vw,80px)" }}>
        <div className="contact-grid">
          <div className="contact-form">
            {state === "done" ? (
              <div className="form-success">
                <span className="check">✓</span>
                <h3 style={{ marginBottom: 10 }}>Zpráva odeslána.</h3>
                <p style={{ color: "rgba(26,23,20,0.55)", fontSize: 14.5 }}>
                  Děkuji. Ozvu se vám do 2 pracovních dnů.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <span className="form-label" style={{ marginBottom: 14 }}>
                  CO POTŘEBUJETE?
                </span>
                <div className="intent-group" role="radiogroup" aria-label="Co potřebujete?">
                  {INTENTS.map((opt) => (
                    <label key={opt} className="intent-option">
                      <input
                        type="radio"
                        name="Co potřebujete"
                        value={opt}
                        checked={intent === opt}
                        onChange={() => setIntent(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                <input type="hidden" name="_subject" value="Nová poptávka z knizniredaktorka.cz" />
                <input type="hidden" name="_template" value="table" />

                <div className="field" style={{ marginTop: 24 }}>
                  <label className="form-label" htmlFor="f-name">
                    JMÉNO
                  </label>
                  <input id="f-name" name="Jméno" type="text" required autoComplete="name" />
                </div>
                <div className="field">
                  <label className="form-label" htmlFor="f-email">
                    E-MAIL
                  </label>
                  <input id="f-email" name="E-mail" type="email" required autoComplete="email" />
                </div>
                <div className="field">
                  <label className="form-label" htmlFor="f-text">
                    O JAKÝ TEXT JDE
                  </label>
                  <input id="f-text" name="O jaký text jde" type="text" required />
                  <div className="field-hint">
                    např. komentář, monografie, článek, AI draft, dizertace…
                  </div>
                </div>
                <div className="field">
                  <label className="form-label" htmlFor="f-msg">
                    CO OD SPOLUPRÁCE OČEKÁVÁTE
                  </label>
                  <textarea id="f-msg" name="Zpráva" required />
                  <div className="field-hint">
                    V jaké je text fázi? Kdy přibližně potřebujete výstup?
                  </div>
                </div>

                <p className="gdpr-note">
                  Odesláním souhlasíte se zpracováním údajů pro účely odpovědi na poptávku.
                  S textem i údaji nakládám důvěrně.
                </p>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={state === "sending"}
                  style={{ width: "100%" }}
                >
                  {state === "sending" ? "Odesílám…" : "Odeslat zprávu →"}
                </button>
                {state === "error" && (
                  <p style={{ marginTop: 14, fontSize: 13.5, color: "#7A1840" }}>
                    Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo mi napište přímo na
                    e-mail.
                  </p>
                )}
              </form>
            )}
          </div>

          <aside className="contact-side">
            <div className="side-card tile">
              <div className="side-card-title">Co mi napsat</div>
              <ul>
                <li>o jaký text jde,</li>
                <li>v jaké je fázi,</li>
                <li>co od spolupráce očekáváte,</li>
                <li>kdy přibližně potřebujete výstup.</li>
              </ul>
            </div>
            <div className="side-card tile">
              <div className="side-card-title">Jak to probíhá</div>
              <p>
                Do 2 pracovních dnů se ozvu. Domluvíme si posouzení textu nebo rovnou ukázkovou
                redakci 3–5 stran zdarma — uvidíte, jak pracuji, dřív než se rozhodnete.
              </p>
            </div>
            <div className="side-card dark tile" style={{ background: "#0F0E0C" }}>
              <div className="side-card-title">Přímý kontakt</div>
              <p>
                <a href="mailto:katerina@knizniredaktorka.cz">katerina@knizniredaktorka.cz</a>
                <br />
                <a
                  href="https://www.linkedin.com/in/katerinamlsnova"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <br />
                IČO 22031383
                <br />
                Pracuji online.
              </p>
            </div>
          </aside>
        </div>

        <p className="contact-closing">
          Pokud si nejste jistí, jestli je váš text pro tento typ spolupráce vhodný, klidně se
          ozvěte i tak. Společně ujasníme, co dává smysl řešit a co už ne.
        </p>
      </section>
    </main>
  );
}
