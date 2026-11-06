import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { BOOKS, TOPICS, TYPES, TYPE_ORDER, type Book } from '../data/books';
import { BOOKS_TOTAL, YEAR_FROM, YEAR_TO } from '../data/site';
import { libraryOrder, stamp } from '../lib/books';
import { cx, plural } from '../lib/format';
import { reducedMotion, usePageMeta } from '../lib/hooks';
import { createLibraryNet, type LibraryModel, type LibraryNet } from '../lib/library-net';
import type { CSSVars } from '../lib/css';
import { Cover } from '../components/Cover';
import { SiteHeader } from '../components/SiteHeader';
import { StandBook, StandInfo } from '../components/Stand';
import './knihovna.css';

/** Filtry: vše, druhy a oblasti. Definice držet na jednom místě (data/books.ts), tady se jen skládají. */
const FILTERS: readonly { id: string; label: string }[] = [
  { id: 'all', label: 'Vše' },
  ...TYPE_ORDER.map((t) => ({ id: t, label: TYPES[t].many })),
  ...TOPICS.map((t) => ({ id: t.id, label: t.label })),
];

const matches = (b: Book, f: string): boolean => f === 'all' || b.type === f || b.topic === f;
const COUNTS = new Map(FILTERS.map((f) => [f.id, BOOKS.filter((b) => matches(b, f.id)).length]));

/** Odhad šířky výlohy před prvním měřením (šířka okna bez okrajů). */
const estimateWidth = (): number => Math.round(Math.min(1280, window.innerWidth) - 2 * Math.max(16, window.innerWidth * 0.05));

interface Last {
  filter: string;
  currentId: number;
  vw: number;
  bookW: number;
}

export default function Knihovna() {
  usePageMeta(
    'Knihovna – vydané knihy | Kateřina Mlsnová',
    'Komentáře k zákonům, monografie a učebnice, které jsem redigovala pro nakladatelství Wolters Kluwer ČR. Filtrujte podle druhu a oblasti práva.'
  );
  const order = useMemo(libraryOrder, []);
  const byDate = (f: string): Book[] => order.filter((b) => matches(b, f)).sort((a, b) => stamp(b, true) - stamp(a, true));

  const [filter, setFilter] = useState('all');
  const [current, setCurrent] = useState<Book>(() => byDate('all')[0]);
  const [vw, setVw] = useState(estimateWidth);

  const vRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const netSvg = useRef<SVGSVGElement>(null);
  const linksSvg = useRef<SVGSVGElement>(null);
  const dialSvg = useRef<SVGSVGElement>(null);
  const net = useRef<LibraryNet | null>(null);
  const last = useRef<Last | null>(null);
  const first = useRef<Map<Element, DOMRect> | null>(null);
  const dir = useRef(1);

  // rozložení výlohy: počet sloupců podle šířky, stojan vždy uprostřed mřížky
  const small = vw < 600;
  const gap = small ? 12 : 18;
  const cw = small ? 40 : 58;
  const n = Math.max(6, Math.floor((vw + gap) / (cw + gap)));
  const sc = small ? n : Math.min(5, n);
  const sr = small ? 6 : 5;
  const shown = COUNTS.get(filter) ?? BOOKS_TOTAL;
  const big = filter === 'all' ? 0 : shown;
  const rows = Math.ceil((big * 4 + (order.length - big) + sc * sr) / n);
  const bookW = small ? 112 : 158;
  const stageStyle: CSSProperties = {
    gridColumn: `${Math.floor((n - sc) / 2) + 1} / span ${sc}`,
    gridRow: `${Math.max(1, Math.floor((rows - sr) / 2) + 1)} / span ${sr}`,
  };

  const model: LibraryModel = { order, filtered: filter !== 'all', match: (b) => matches(b, filter), current, bookW, gap };

  // šířka výlohy
  useLayoutEffect(() => {
    const v = vRef.current;
    if (!v) return undefined;
    const measure = () => setVw(Math.round(v.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(v);
    return () => ro.disconnect();
  }, []);

  // síť a ciferník vznikají po vykreslení výlohy
  useLayoutEffect(() => {
    if (!vRef.current || !stageRef.current || !netSvg.current || !linksSvg.current || !dialSvg.current) return undefined;
    const created = createLibraryNet(
      { v: vRef.current, stage: stageRef.current, netSvg: netSvg.current, linksSvg: linksSvg.current, dialSvg: dialSvg.current },
      model
    );
    net.current = created;
    last.current = { filter, currentId: current.id, vw, bookW };
    return () => {
      created.destroy();
      net.current = null;
    };
  }, []);

  // po každé změně se síť přizpůsobí: filtr = přeskládání, šířka = nové rozložení, výběr knihy = ciferník
  useLayoutEffect(() => {
    const c = net.current;
    const p = last.current;
    if (!c || !p) return;
    c.setModel(model);
    if (p.filter !== filter) c.applyFilter(first.current);
    else if (p.vw !== vw || p.bookW !== bookW) c.relayout();
    else if (p.currentId !== current.id) c.select(dir.current);
    first.current = null;
    last.current = { filter, currentId: current.id, vw, bookW };
  });

  const select = (b: Book, scroll: boolean, d = 1) => {
    dir.current = d;
    setCurrent(b);
    if (scroll) stageRef.current?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  };

  const onFilter = (next: string) => {
    if (next === filter) return;
    const v = vRef.current;
    const stage = stageRef.current;
    if (v && stage && !reducedMotion()) {
      first.current = new Map<Element, DOMRect>([...v.querySelectorAll('.cv'), stage].map((e) => [e, e.getBoundingClientRect()]));
    }
    dir.current = 1;
    setFilter(next);
    setCurrent(matches(current, next) ? current : byDate(next)[0]);
  };

  const step = (d: 1 | -1) => {
    const list = byDate(filter);
    const i = list.indexOf(current);
    select(list[(i + d + list.length) % list.length], false, d);
  };

  return (
    <div className="wrap knihovna">
      <SiteHeader />
      <main>
        <section className="intro">
          <h1>
            {BOOKS_TOTAL}&nbsp;{plural(BOOKS_TOTAL, 'aktuálně vydaná kniha', 'aktuálně vydané knihy', 'aktuálně vydaných knih')}
          </h1>
          <p className="lead">Komentáře k&nbsp;zákonům, monografie a&nbsp;učebnice z&nbsp;let {YEAR_FROM} až {YEAR_TO}.</p>
          <div className="filters" role="group" aria-label="Filtr knihovny">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" aria-pressed={f.id === filter} onClick={() => onFilter(f.id)}>
                {f.label}
                <span>{COUNTS.get(f.id)}</span>
              </button>
            ))}
          </div>
          <p className="count" aria-live="polite">
            {shown === BOOKS_TOTAL ? `Všech ${BOOKS_TOTAL} knih` : `Zobrazeno ${shown} z ${BOOKS_TOTAL} knih`}
          </p>
        </section>

        <div className="vitrine" ref={vRef} style={{ '--n': n } as CSSVars}>
          <svg className="knet" ref={netSvg} aria-hidden="true" />
          <svg className="klinks" ref={linksSvg} aria-hidden="true" />
          {order.map((b) => {
            const m = matches(b, filter);
            return (
              <button
                key={b.id}
                type="button"
                data-id={b.id}
                className={cx('cv', b.isNew && 'new', filter !== 'all' && m && 'big', !m && 'dim', b.id === current.id && 'sel')}
                aria-label={`${b.title}${b.edition === 2 ? ', 2. vydání' : ''}`}
                aria-current={b.id === current.id ? 'true' : undefined}
                onClick={() => select(b, true)}
              >
                <span>
                  <Cover book={b} />
                </span>
              </button>
            );
          })}
          <div className="stage" ref={stageRef} style={stageStyle}>
            <svg className="sdial" ref={dialSvg} aria-hidden="true" />
            <StandBook className="stage-book" book={current} w={bookW} />
            <StandInfo className="stage-info" books={[current]} current={current} nav={{ onPrev: () => step(-1), onNext: () => step(1) }} />
          </div>
        </div>
      </main>
    </div>
  );
}
