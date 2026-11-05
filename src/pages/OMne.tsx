import { useEffect, useRef, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { BOOKS_ROUND, YEARS_EDITING, YEARS_LAW } from '../data/site';
import type { CSSVars } from '../lib/css';
import { reducedMotion, usePageMeta } from '../lib/hooks';
import { SiteHeader } from '../components/SiteHeader';
import { Checks } from './omne/Checks';
import './omne.css';

/** Šipka mezi částmi cesty: jak se mezera posouvá nahoru, šipka v ní sjíždí dolů (pohyb řídí useRoadArrows). */
function Gap() {
  return (
    <li className="gap" aria-hidden="true">
      <svg className="arw" viewBox="0 0 16 26">
        <rect width="16" height="26" fill="#fff" stroke="none" />
        <path d="M8 2v20M2 15l6 8 6-8" />
      </svg>
    </li>
  );
}

const STEPS: { h: string; t: string }[] = [
  { h: 'Nejdřív si text přečtu a zorientuji se v něm', t: 'Potřebuji vědět, v jakém stavu text je, co od něj očekáváte a co mu v dané chvíli skutečně pomůže.' },
  { h: 'Navrhnu, co má smysl řešit jako první', t: 'Ne všechno je potřeba opravovat najednou. Důležité je rozeznat, co je podstatné a co už by byla zbytečná práce navíc.' },
  { h: 'Pracuji přehledně a s respektem k autorovi', t: 'Veškeré návrhy dělám tak, aby bylo jasné, co a proč se v textu mění. Text zlepšuji, ale nepřebírám jeho autorství.' },
  { h: 'Cílem je výsledek, který obstojí', t: 'Text má být přesný, srozumitelný, jednotný a profesionální – nejen obsahově, ale i tím, jak působí na čtenáře.' },
];

/** Šipky v mezerách sjíždějí dolů podle posunu stránky. */
function useRoadArrows(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const gaps = [...el.querySelectorAll<HTMLElement>('.gap')];
    const still = reducedMotion();
    let queued = false;
    const place = () => {
      queued = false;
      gaps.forEach((g) => {
        const p = still ? 0.5 : Math.max(0, Math.min(1, (window.innerHeight * 0.8 - g.getBoundingClientRect().top) / (window.innerHeight * 0.55)));
        (g.firstElementChild as SVGElement | null)?.style.setProperty('--ty', `${(p * (g.clientHeight - 26)).toFixed(1)}px`);
      });
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(place);
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    place();
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, [root]);
}

/** Kniha se při příchodu do záběru rozevře; mimo záběr při načtení nebo bez pohybu stojí hotová. */
function useBookReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !('IntersectionObserver' in window) || el.getBoundingClientRect().top < window.innerHeight * 0.6) return undefined;
    el.classList.add('pre');
    const io = new IntersectionObserver(
      (entries, o) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          el.classList.remove('pre');
          o.disconnect();
        }),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

export default function OMne() {
  usePageMeta(
    'O mně – z advokacie do knižní redakce | Kateřina Mlsnová',
    `Právní vzdělání, ${YEARS_LAW} let advokacie, ${YEARS_EDITING} let knižní redakce a přes ${BOOKS_ROUND} vydaných odborných knih. Specializace na právo, právo IT, technologie a umělou inteligenci.`
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  useRoadArrows(rootRef);
  useBookReveal(bookRef);

  return (
    <div className="omne" ref={rootRef}>
      <SiteHeader over />
      <main>
        <section className="scene mdl" aria-label="O mně">
          <div className="copy">
            <div className="photo" style={{ '--pw': '150px' } as CSSVars}>
              <b>K. Mlsnová</b>knižní redaktorka
            </div>
            <h1>Z&nbsp;advokacie do knižní redakce.</h1>
            <ul className="facts three" aria-label="Stručně řečeno">
              <li>
                <b>{YEARS_EDITING}</b>
                <span>let knižní redakce</span>
              </li>
              <li>
                <b>
                  {BOOKS_ROUND}
                  <i>+</i>
                </b>
                <span>vydaných knih</span>
              </li>
              <li>
                <b>{YEARS_LAW}</b>
                <span>let advokacie</span>
              </li>
            </ul>
            <div className="actions">
              <Link className="btn btn--fill" to="/kontakt">
                Chci ukázkovou redakci
              </Link>
            </div>
          </div>
        </section>

        <section className="path" aria-label="Moje cesta a práce">
          <ol className="line">
            <li className="stn">
              <p className="lab">Změna</p>
              <h2>Wolters Kluwer ČR</h2>
              <p className="t">
                Odešla jsem do nakladatelství Wolters Kluwer ČR – a&nbsp;zjistila, že mě víc než psaní podání baví dávat tvar odborným textům.
              </p>
            </li>
            <Gap />
            <li className="stn">
              <p className="lab">
                {YEARS_EDITING}&nbsp;let · {BOOKS_ROUND}+&nbsp;knih
              </p>
              <h2>Dnes</h2>
              <p className="t">
                Dnes mám za sebou přes {BOOKS_ROUND} vydaných knih: komentáře k&nbsp;zákonům, učebnice, monografie i&nbsp;publikace na klíč. Nejblíž mám
                k&nbsp;právu, právu IT, technologiím a&nbsp;umělé inteligenci – redigovala jsem mimo jiné komentář k&nbsp;nařízení MiCA nebo monografie
                o&nbsp;trestní odpovědnosti umělé inteligence.
              </p>
            </li>
            <Gap />
            <li className="stn">
              <p className="lab">{YEARS_LAW}&nbsp;let</p>
              <h2>Advokacie</h2>
              <p className="t">Devět let jsem pracovala v&nbsp;advokacii – rozumím terminologii, citacím i&nbsp;judikatuře.</p>
            </li>

            <li className="blk far" id="sleduji">
              <h2>Co v&nbsp;textu sleduji</h2>
              <p className="t">Kromě čtení rukopisu hlídám i&nbsp;to, co se při čtení snadno přehlédne.</p>
              <Checks />
            </li>

            <li className="blk head far">
              <p className="lab">Jak pracuji</p>
              <h2>Systematicky, přehledně a&nbsp;po vrstvách.</h2>
            </li>
            <Gap />
            {STEPS.map((s, i) => (
              <StepItem key={s.h} h={s.h} t={s.t} last={i === STEPS.length - 1} />
            ))}

            <li className="blk far">
              <blockquote className="quote">
                Baví mě chvíle, kdy se z&nbsp;dobrého základu stane opravdu dobrý výsledek. Když text začne držet pohromadě, je přesnější, klidnější a&nbsp;působí
                jistěji než na&nbsp;začátku.<cite>Kateřina Mlsnová</cite>
              </blockquote>
            </li>

            <li className="blk far">
              <p className="lab">Co říkají autoři</p>
              <div className="obook" ref={bookRef}>
                <div className="pg l">
                  <p className="vq">„Mimořádná spokojenost s&nbsp;paní Kateřinou, velice lehká spolupráce, odpovídá okamžitě a&nbsp;vždy se snaží hodně pomoct.“</p>
                  <cite>Autor odborné publikace</cite>
                  <span className="fo">114</span>
                </div>
                <div className="pg r">
                  <p className="vq">„V&nbsp;posudcích, ale i&nbsp;při obhajobě mi chválili úpravu a&nbsp;celkovou redakci práce. Umíte to!“</p>
                  <cite>Autor dizertační práce</cite>
                  <span className="fo">115</span>
                </div>
                <i className="rib" aria-hidden="true" />
              </div>
            </li>
          </ol>
        </section>

        <section className="scene" id="zaver" aria-labelledby="t-zaver">
          <div className="copy">
            <p className="eyebrow">Ukázka zdarma</p>
            <h2 id="t-zaver">Pošlete mi kapitolu. Uvidíte, co s&nbsp;textem udělám.</h2>
            <p className="lead">U&nbsp;nových klientů začínám ukázkovou redakcí několika stran zdarma. Vy uvidíte můj styl práce, já stav vašeho textu.</p>
            <div className="actions">
              <Link className="btn btn--fill" to="/kontakt">
                Chci ukázkovou redakci
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/** Krok práce; šipka za ním je jen mezi kroky, za posledním ne. */
function StepItem({ h, t, last }: { h: string; t: string; last: boolean }) {
  return (
    <>
      <li className="stn stp">
        <h2>{h}</h2>
        <p className="t">{t}</p>
      </li>
      {!last && <Gap />}
    </>
  );
}
