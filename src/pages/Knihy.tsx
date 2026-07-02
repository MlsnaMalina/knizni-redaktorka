import { usePageMeta, Tag, CtaSection } from "../ui";
import { bookCategories } from "../books";

export default function Knihy() {
  usePageMeta(
    "Knihy — přes 70 vydaných titulů | Kateřina Mlsnová",
    "Kompletní přehled odborných knih redigovaných pro nakladatelství Wolters Kluwer ČR: komentáře k zákonům, právo IT, umělá inteligence, finanční trh, monografie a učebnice."
  );

  return (
    <main className="page">
      <section className="section-sm container" style={{ paddingTop: "clamp(56px,7vw,96px)" }}>
        <Tag>— Knihy</Tag>
        <h1 className="h1">Více než 70 vydaných titulů.</h1>
        <p className="perex" style={{ marginTop: 24 }}>
          Všechny knihy níže jsem redigovala pro nakladatelství Wolters Kluwer ČR — od komentářů k
          zákonům přes učebnice až po monografie. Autorem každé z nich zůstává její autor; moje
          práce je v tom, jak text drží pohromadě.
        </p>
        <div className="books-microcopy" style={{ marginTop: 28 }}>
          téměř 30 komentářů k zákonům · 11 titulů ve druhém vydání
        </div>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      <section className="section container" style={{ paddingTop: "clamp(48px,6vw,80px)" }}>
        {bookCategories.map((cat) => (
          <div key={cat.name} className="book-cat">
            <div className="book-cat-head">
              <h2>{cat.name}</h2>
              <span className="book-cat-count">{cat.books.length} titulů</span>
            </div>
            {cat.books.map((book) => (
              <div key={book.title} className={`book-row${book.flagship ? " flag" : ""}`}>
                <span className="pilcrow">¶</span>
                <span style={{ flex: 1 }}>{book.title}</span>
                {book.note && <span className="book-note">{book.note}</span>}
              </div>
            ))}
          </div>
        ))}
        <p
          className="mono-note"
          style={{ maxWidth: 620, fontSize: 10.5, lineHeight: 1.8 }}
        >
          {"// druhá vydání znamenají jediné: tituly žijí, aktualizují se — a redakce se vrací."}
        </p>
      </section>

      <CtaSection />
    </main>
  );
}
