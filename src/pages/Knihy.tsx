import { useMemo, useState } from "react";
import { usePageMeta, Tag, CtaSection } from "../ui";
import { bookCategories, wkLink, totalBooks, type Book } from "../books";

interface ShelfBook {
  book: Book;
  catId: string;
  catShort: string;
  spine: string;
  width: number;
  height: number;
}

/** Deterministický pseudonáhodný rozměr hřbetu z názvu knihy. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return h;
}

const SHELF: ShelfBook[] = bookCategories.flatMap((cat) =>
  cat.books.map((book) => ({
    book,
    catId: cat.id,
    catShort: cat.short,
    spine: cat.spine,
    width: 9 + (hash(book.title) % 7),
    height: 86 + (hash(book.title) % 42),
  }))
);

const LEGEND: { spine: string; label: string }[] = [
  { spine: "raspberry-dark", label: "komentáře" },
  { spine: "black", label: "právo IT a AI" },
  { spine: "raspberry", label: "fintech" },
  { spine: "white", label: "proces a monografie" },
  { spine: "white-band", label: "podnikání a ekonomie" },
];

const LEGEND_SWATCH: Record<string, React.CSSProperties> = {
  "raspberry-dark": { background: "#7A1840" },
  black: { background: "#0F0E0C" },
  raspberry: { background: "#B83066" },
  white: { background: "#fff", border: "1px solid rgba(26,23,20,0.35)" },
  "white-band": {
    background: "#fff",
    borderTop: "3px solid #B83066",
    borderLeft: "1px solid rgba(26,23,20,0.3)",
    borderRight: "1px solid rgba(26,23,20,0.3)",
    borderBottom: "1px solid rgba(26,23,20,0.3)",
  },
};

const DEFAULT_CAPTION =
  "Každý hřbet je jedna skutečná kniha — najeďte na něj myší, kliknutím přefiltrujete kartotéku.";

export default function Knihy() {
  usePageMeta(
    "Knihy — přes 70 vydaných titulů | Kateřina Mlsnová",
    "Kompletní přehled odborných knih redigovaných pro nakladatelství Wolters Kluwer ČR: komentáře k zákonům, právo IT, umělá inteligence, finanční trh, monografie a učebnice."
  );

  const [filter, setFilter] = useState<string>("all");
  const [caption, setCaption] = useState<string>(DEFAULT_CAPTION);

  const visibleCategories = useMemo(
    () => bookCategories.filter((c) => filter === "all" || c.id === filter),
    [filter]
  );

  return (
    <main className="page">
      <section className="section-sm container" style={{ paddingTop: "clamp(56px,7vw,96px)" }}>
        <Tag>— Knihy</Tag>
        <h1 className="h1">
          Více než <span className="mark">70 vydaných titulů</span>.
        </h1>
        <p className="perex" style={{ marginTop: 24, maxWidth: 780 }}>
          Všechny knihy níže jsem redigovala pro nakladatelství Wolters Kluwer ČR — od komentářů k
          zákonům přes učebnice až po monografie. Autorem každé z nich zůstává její autor; moje
          práce je v tom, jak text drží pohromadě.
        </p>

        {/* ŽIVÁ KNIHOVNA */}
        <div className="shelf-wrap">
          <div className="shelf">
            {SHELF.map((s, i) => (
              <button
                key={s.book.title + i}
                type="button"
                className={`spine s-${s.spine}${s.book.flagship ? " flag" : ""}${
                  i === SHELF.length - 1 ? " lean" : ""
                }`}
                style={{ width: s.width, height: s.height }}
                aria-label={`${s.book.title} — ${s.catShort}`}
                onMouseEnter={() =>
                  setCaption(
                    `▌ ${s.book.title}${s.book.note ? ` (${s.book.note})` : ""} · ${s.catShort}`
                  )
                }
                onMouseLeave={() => setCaption(DEFAULT_CAPTION)}
                onClick={() => {
                  setFilter(s.catId);
                  setCaption(
                    `▌ ${s.book.title}${s.book.note ? ` (${s.book.note})` : ""} · ${s.catShort}`
                  );
                }}
              />
            ))}
            <span className="bookend" aria-hidden="true">
              KM<span style={{ color: "#B83066" }}>▌</span>
            </span>
          </div>
          <div className="shelf-board" />
          <div className={`shelf-caption${caption !== DEFAULT_CAPTION ? " active" : ""}`}>
            {caption}
          </div>
          <div className="shelf-legend">
            {LEGEND.map((l) => (
              <span key={l.spine}>
                <i style={LEGEND_SWATCH[l.spine]} />
                {l.label}
              </span>
            ))}
            <span>
              <i style={{ background: "#FF2D8C", width: 5, height: 12 }} />
              záložka = vlajkový titul
            </span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="hairline" />
      </div>

      {/* KARTOTÉKA */}
      <section className="section container" style={{ paddingTop: "clamp(48px,6vw,80px)" }}>
        <Tag>— Kartotéka</Tag>
        <div className="books-microcopy" style={{ marginBottom: 20 }}>
          téměř 30 komentářů k zákonům · 11 titulů ve druhém vydání
        </div>
        <div className="chips" role="group" aria-label="Filtr kategorií">
          <button
            className={`chip${filter === "all" ? " on" : ""}`}
            onClick={() => setFilter("all")}
          >
            Vše · {totalBooks}
          </button>
          {bookCategories.map((c) => (
            <button
              key={c.id}
              className={`chip${filter === c.id ? " on" : ""}`}
              onClick={() => setFilter(c.id)}
            >
              {c.short} · {c.books.length}
            </button>
          ))}
        </div>

        {visibleCategories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: "clamp(28px,4vw,44px)" }}>
            {filter === "all" && (
              <div className="book-cat-head" style={{ marginBottom: 14 }}>
                <h2>{cat.name}</h2>
                <span className="book-cat-count">{cat.books.length} titulů</span>
              </div>
            )}
            <div className="book-grid">
              {cat.books.map((book) => (
                <div
                  key={book.title}
                  className={`tile book-card${book.flagship ? " flag" : ""}`}
                >
                  <div className="book-card-cat">
                    <span>{cat.short}</span>
                    {book.note && <span>{book.note}</span>}
                  </div>
                  <div className="book-card-title">{book.title}</div>
                  <a
                    className="book-card-wk"
                    href={wkLink(book)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    zobrazit v e-shopu WK ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="mono-note" style={{ maxWidth: 620, fontSize: 10.5, lineHeight: 1.8 }}>
          {"// druhá vydání znamenají jediné: tituly žijí, aktualizují se — a redakce se vrací."}
        </p>
      </section>

      <CtaSection />
    </main>
  );
}
