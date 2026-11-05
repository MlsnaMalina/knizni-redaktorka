import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BOOKS } from '../data/books';
import { COOKIES_PATH, ICO, OWNER, PRIVACY_PATH } from '../data/site';
import { stamp } from '../lib/books';
import { cx } from '../lib/format';
import './footer.css';

/** Rychlost pásu s tituly v px za sekundu; délka smyčky se dopočítá z naměřené šířky. */
const STRIP_SPEED = 30;

/** Tituly pro pás: nejnovější první, titul s více vydáními jednou, střídavě do dvou řad. Nové knihy se přidají samy z dat. */
const STRIP_ROWS: [string[], string[]] = (() => {
  const seen = new Set<string>();
  const titles: string[] = [];
  for (const b of [...BOOKS].sort((x, y) => stamp(y, true) - stamp(x, true))) {
    if (seen.has(b.title)) continue;
    seen.add(b.title);
    titles.push(b.title);
  }
  return [titles.filter((_, i) => i % 2 === 0), titles.filter((_, i) => i % 2 === 1)];
})();

/**
 * Jedna řada: vrstva s odkazy a nad ní stejná vrstva, vidět jen uprostřed (titul uprostřed zčerná).
 * Obě vrstvy mají stejnou animaci, takže jedou v souladu; druhá kopie sady dělá smyčku bezešvou.
 */
function StripRow({ titles, reverse = false }: { titles: string[]; reverse?: boolean }) {
  // tituly jsou klikací pro myš a dotyk, z klávesnice se k nim nechodí (vede z nich vše do Knihovny jako tlačítko pod pásem)
  const links = () => (
    <div className="ft-set">
      {titles.map((t) => (
        <Link key={t} className="ft-tt" to="/knihovna" tabIndex={-1}>
          {t}
        </Link>
      ))}
    </div>
  );
  const plain = () => (
    <div className="ft-set">
      {titles.map((t) => (
        <span key={t} className="ft-tt">
          {t}
        </span>
      ))}
    </div>
  );
  return (
    <div className={cx('ft-row', reverse && 'rev')}>
      <div className="ft-lay">
        <div className="ft-trk">
          {links()}
          {links()}
        </div>
      </div>
      <div className="ft-lay ft-ink" aria-hidden="true">
        <div className="ft-trk">
          {plain()}
          {plain()}
        </div>
      </div>
    </div>
  );
}

/** Pás s tituly knih (návrh B2 Protisměr): dvě řady v protisměru, tituly modře, uprostřed ohnisko s modrou značkou. */
function TitleStrip() {
  const ref = useRef<HTMLDivElement>(null);

  // délka smyčky z naměřené šířky sady: obě řady jedou stejně rychle, i po načtení písem a při změně šířky okna
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const rows = [...root.querySelectorAll<HTMLElement>('.ft-row')];
    const measure = () =>
      rows.forEach((row) => {
        const set = row.querySelector<HTMLElement>('.ft-set');
        if (set) row.style.setProperty('--d', `${(set.getBoundingClientRect().width / STRIP_SPEED).toFixed(1)}s`);
      });
    measure();
    void document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  // mimo obrazovku se pohyb zastaví
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(([e]) => root.classList.toggle('is-off', !e.isIntersecting), { rootMargin: '160px' });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // na dotyku se pohyb zastaví po dobu držení prstu
  const hold = (on: boolean) => ref.current?.classList.toggle('is-held', on);

  return (
    <div
      className="ft-strip"
      ref={ref}
      role="region"
      aria-label="Knihy, které jsem redigovala"
      onPointerDown={() => hold(true)}
      onPointerUp={() => hold(false)}
      onPointerCancel={() => hold(false)}
      onPointerLeave={() => hold(false)}
    >
      {/* pohyblivé tituly jsou ozdoba: totéž je v Knihovně, čtečky a klávesnice používají tlačítko Celá knihovna */}
      <div className="ft-rows" aria-hidden="true">
        <svg className="ft-ring" viewBox="0 0 148 148" aria-hidden="true">
          <circle cx="74" cy="74" r="44" stroke="#d9d9d9" />
          <circle cx="74" cy="74" r="72" stroke="#e6e6e6" />
        </svg>
        <StripRow titles={STRIP_ROWS[0]} />
        <StripRow titles={STRIP_ROWS[1]} reverse />
        <i className="ft-dot" aria-hidden="true" />
      </div>
      <p className="ft-more">
        <Link className="btn btn--line" to="/knihovna">
          Celá knihovna
        </Link>
      </p>
    </div>
  );
}

/** Patička na všech stránkách: pás s tituly (kromě Knihovny a stránek Cookies a Zásady), © a IČO, cookies, zásady. */
export function SiteFooter() {
  const { pathname } = useLocation();
  const strip = pathname !== '/knihovna' && pathname !== COOKIES_PATH && pathname !== PRIVACY_PATH;
  return (
    <footer className={cx('ft', !strip && 'ft--plain')}>
      {strip && <TitleStrip />}
      <div className="ft-info">
        <p className="ft-fl">
          <span>
            ©&nbsp;{new Date().getFullYear()} {OWNER}
          </span>
          <i aria-hidden="true">·</i>
          <span>IČO&nbsp;{ICO}</span>
        </p>
        <p className="ft-fl">
          <Link to={COOKIES_PATH}>Cookies</Link>
          <i aria-hidden="true">·</i>
          <Link to={PRIVACY_PATH}>Zásady zpracování osobních údajů</Link>
        </p>
      </div>
    </footer>
  );
}
