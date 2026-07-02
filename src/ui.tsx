import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { allBookTitles } from "./books";

/* ---------- meta ---------- */

export function usePageMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
  }, [title, description]);
}

export function ScrollToTop(): null {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Scroll-reveal: prvkům s třídou .reveal přidá .in, jakmile vstoupí do viewportu. */
export function RevealManager(): null {
  const { pathname } = useLocation();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    const t = window.setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    }, 0);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);
  return null;
}

/* ---------- navigace ---------- */

const NAV_ITEMS = [
  { to: "/", label: "Úvod" },
  { to: "/sluzby", label: "Služby" },
  { to: "/knihy", label: "Knihy" },
  { to: "/o-mne", label: "O mně" },
  { to: "/kontakt", label: "Kontakt" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo" aria-label="Kateřina Mlsnová — úvod">
            KM<span className="cursor">▌</span>
          </Link>
          <nav className="nav-links" aria-label="Hlavní navigace">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/kontakt" className="nav-cta">
            NAPSAT MI →
          </Link>
          <button
            className={`hamburger${open ? " open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      {open && (
        <div className="mobile-menu">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/kontakt" style={{ color: "#7A1840", fontWeight: 500 }}>
            Napsat mi →
          </NavLink>
        </div>
      )}
    </>
  );
}

/* ---------- drobné prvky ---------- */

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="wave" aria-hidden="true">
      <svg
        viewBox="0 0 1440 32"
        preserveAspectRatio="none"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        <path
          d="M0,16 C180,32 360,0 540,16 C720,32 900,0 1080,16 C1260,32 1380,8 1440,16"
          fill="none"
          stroke="rgba(26,23,20,0.06)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

/* ---------- manuskript dekorace ---------- */

type MsRowType = "n" | "h" | "d" | "i" | "c";

const MS_ROWS: { type: MsRowType; width: string }[] = [
  { type: "n", width: "92%" },
  { type: "n", width: "84%" },
  { type: "h", width: "68%" },
  { type: "n", width: "90%" },
  { type: "d", width: "56%" },
  { type: "n", width: "88%" },
  { type: "i", width: "74%" },
  { type: "n", width: "81%" },
  { type: "c", width: "48%" },
];

export function Manuscript() {
  return (
    <div className="manuscript-wrap" aria-hidden="true">
      <div className="manuscript">
        <div className="ms-head">
          <span>RUKOPIS v.3</span>
          <span>sledo. změn ✓</span>
        </div>
        {MS_ROWS.map((row, i) => (
          <div key={i} className={`ms-row ${row.type}`} style={{ width: row.width }}>
            {row.type === "i" && <span className="ms-insert-label">+ vložit</span>}
            {row.type === "c" && <span className="cursor">▌</span>}
          </div>
        ))}
        <div className="ms-pageno">— 12 —</div>
      </div>
      <div className="ms-bubble">
        <div className="ms-bubble-name">K. Mlsnová</div>
        <div className="ms-bubble-text">Zpřesnit formulaci — terminologie nejednotná.</div>
      </div>
    </div>
  );
}

/* ---------- citát ---------- */

export function Quote({ text, source }: { text: string; source: string }) {
  return (
    <figure className="quote">
      <span className="quote-mark" aria-hidden="true">
        „
      </span>
      <blockquote className="quote-text">{text}</blockquote>
      <figcaption className="quote-src">— {source}</figcaption>
    </figure>
  );
}

/* ---------- FAQ ---------- */

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="faq">
      {items.map((item, i) => (
        <div key={i} className="faq-item">
          <button
            className="faq-q"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            aria-expanded={openIdx === i}
          >
            <span className="faq-q-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="faq-q-text">{item.q}</span>
            <span className="faq-q-sign" aria-hidden="true">
              {openIdx === i ? "−" : "+"}
            </span>
          </button>
          {openIdx === i && <div className="faq-a">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

/* ---------- CTA sekce ---------- */

export function CtaSection() {
  return (
    <section className="cta">
      <div className="cta-label">UKÁZKA ZDARMA</div>
      <h2>Pošlete mi kapitolu. Uvidíte, co s textem udělám.</h2>
      <p>
        U nových klientů začínám ukázkovou redakcí několika stran zdarma. Vy uvidíte můj styl
        práce, já stav textu — a oba budeme vědět, jestli spolupráce dává smysl.
      </p>
      <Link to="/kontakt" className="btn-primary">
        Chci ukázkovou redakci →
      </Link>
      <Link to="/kontakt" className="cta-secondary">
        nebo mi jen napište o svém textu
      </Link>
    </section>
  );
}

/* ---------- ticker + footer ---------- */

export function BooksTicker() {
  const line = allBookTitles.join(" · ");
  return (
    <Link to="/knihy" aria-label="Všechny redigované knihy">
      <div className="ticker">
        <div className="ticker-track">
          <span className="ticker-content">
            {line}
            <span className="sep">·</span>
          </span>
          <span className="ticker-content" aria-hidden="true">
            {line}
            <span className="sep">·</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Footer() {
  return (
    <>
      <BooksTicker />
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-logo-first">K A T E Ř I N A</div>
              <div className="footer-logo-last">
                MLSNOVÁ<span className="cursor" style={{ fontSize: "22px" }}>▌</span>
              </div>
              <div className="footer-desc">Knižní redaktorka odborných textů na volné noze.</div>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Navigace</div>
              {NAV_ITEMS.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Kontakt</div>
              <a href="mailto:katerina@knizniredaktorka.cz">katerina@knizniredaktorka.cz</a>
              <a
                href="https://www.linkedin.com/in/katerinamlsnova"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/katerinamlsnova
              </a>
              <span>IČO: 22031383</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Kateřina Mlsnová · Pracuji online.</span>
            <span className="footer-monogram">
              KM<span className="cursor" style={{ fontSize: "14px" }}>▌</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
