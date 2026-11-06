import { useCallback, useEffect, useRef } from 'react';
import type { Book } from '../../data/books';
import { reducedMotion } from '../../lib/hooks';
import { Cover } from '../../components/Cover';

const GAP = 6;

interface ShopFlowProps {
  books: readonly Book[];
  current: Book;
  onPick: (book: Book) => void;
}

/**
 * Kolotoč nejnovějších knih pro telefon (Kateřina vybrala 6. 11. 2026 z návrhů Jedna police, Ciferník a Kolotoč):
 * vybraná kniha stojí uprostřed a je barevná, sousedé vykukují po stranách šedí a natočení. Posouvá se prstem,
 * vybrat jde i klepnutím na knihu nebo na dílek dole. Údaje o knize a ohnisko se přepnou, až se kolotoč zastaví.
 */
export function ShopFlow({ books, current, onPick }: ShopFlowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLButtonElement | null)[]>([]);
  const ticks = useRef<(HTMLButtonElement | null)[]>([]);
  const currentRef = useRef(current);
  const onPickRef = useRef(onPick);
  currentRef.current = current;
  onPickRef.current = onPick;

  const step = useCallback(() => (slides.current[0]?.offsetWidth ?? 0) + GAP, []);
  const go = useCallback(
    (i: number, smooth: boolean) => {
      trackRef.current?.scrollTo({ left: i * step(), behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
    },
    [step]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let raf = 0;
    let settle = 0;
    const hasScrollEnd = 'onscrollend' in window;
    const nearest = () => Math.max(0, Math.min(books.length - 1, Math.round(track.scrollLeft / (step() || 1))));
    const draw = () => {
      raf = 0;
      const st = step();
      if (!st) return;
      const x = track.scrollLeft / st;
      slides.current.forEach((el, i) => {
        const card = el?.firstElementChild as HTMLElement | null;
        if (!el || !card) return;
        const d = i - x;
        const a = Math.min(Math.abs(d), 2.2);
        const side = d < 0 ? -1 : 1;
        // natáčí se vnitřní karta, ne knoflík, který drží polohu pro scroll-snap (jinak by se body zastavení posouvala s natočením)
        card.style.transform = `perspective(700px) translateX(${(-d * 6).toFixed(1)}px) rotateY(${(-side * Math.min(a, 1.4) * 30).toFixed(1)}deg) scale(${(1 - Math.min(a, 1.6) * 0.14).toFixed(3)})`;
        el.style.zIndex = String(20 - Math.round(a * 3));
        el.toggleAttribute('data-mute', Math.abs(d) > 0.35);
      });
      const n = nearest();
      ticks.current.forEach((t, i) => t?.toggleAttribute('data-on', i === n));
    };
    // kolotoč se zastavil: vybraná je nejbližší kniha (scrollend, jinde krátká prodleva po posledním posunu)
    const settleNow = () => {
      const b = books[nearest()];
      if (b && b !== currentRef.current) onPickRef.current(b);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
      if (hasScrollEnd) return;
      window.clearTimeout(settle);
      settle = window.setTimeout(settleNow, 140);
    };
    // po změně šířky okna zůstane uprostřed vybraná kniha
    const ro = new ResizeObserver(() => {
      const i = books.indexOf(currentRef.current);
      track.scrollLeft = Math.max(0, i) * step();
      draw();
    });
    track.addEventListener('scroll', onScroll, { passive: true });
    if (hasScrollEnd) track.addEventListener('scrollend', settleNow);
    ro.observe(track);
    track.scrollLeft = Math.max(0, books.indexOf(currentRef.current)) * step();
    draw();
    return () => {
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('scrollend', settleNow);
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, [books, step]);

  return (
    <>
      <div className="fl" data-focus="">
        <div className="fl-track" ref={trackRef} role="group" aria-label="Nejnovější knihy">
          {books.map((b, i) => (
            <button
              key={b.id}
              ref={(el) => {
                slides.current[i] = el;
              }}
              type="button"
              className="fl-slide"
              aria-label={`${b.title}, ${b.year}`}
              aria-current={b.id === current.id ? 'true' : undefined}
              onClick={() => go(i, true)}
            >
              <span className="fl-card">
                <span className="fl-cv">
                  <Cover book={b} eager={i < 3} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="fl-ticks" aria-hidden="true">
        {books.map((b, i) => (
          <button
            key={b.id}
            ref={(el) => {
              ticks.current[i] = el;
            }}
            type="button"
            tabIndex={-1}
            onClick={() => go(i, true)}
          >
            <i />
          </button>
        ))}
      </div>
    </>
  );
}
