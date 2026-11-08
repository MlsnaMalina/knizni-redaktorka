import { useEffect, useRef, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import { BOOKS_ROUND, SAMPLE_LINK, YEARS_EDITING, YEARS_LAW } from '../data/site';
import type { CSSVars } from '../lib/css';
import { reducedMotion, usePageMeta } from '../lib/hooks';
import { nb } from '../lib/format';
import { SiteHeader } from '../components/SiteHeader';
import { Checks } from './omne/Checks';
import './omne.css';

/** Šířka portrétu v hero v px (na telefonu menší); stejné hodnoty patří do `sizes` obrázku. */
const PHOTO_W = 184;
const PHOTO_W_SMALL = 170;

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

/** Modrá tečka jednou oběhne prošitý kruh kolem portrétu: po načtení stránky a pak pokaždé, když na portrét najede myš nebo na něj klepne prst. */
function useDotOrbit(figure: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = figure.current;
    const orb = el?.querySelector<HTMLElement>('.orb');
    if (!el || !orb || reducedMotion() || typeof orb.animate !== 'function') return undefined;
    let run: Animation | null = null;
    const go = () => {
      if (run && run.playState === 'running') return;
      run = orb.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 2000, easing: 'cubic-bezier(.55, 0, .2, 1)' });
    };
    // myš: najetí; dotyk: klepnutí (pointerenter se u dotyku spustí už na začátku tahu prstem, i když chce uživatel jen posouvat stránku)
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') go();
    };
    const start = window.setTimeout(go, 700);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('click', go);
    return () => {
      window.clearTimeout(start);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('click', go);
      run?.cancel();
    };
  }, [figure]);
}

export default function OMne() {
  usePageMeta('omne');
  const rootRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLElement>(null);
  useRoadArrows(rootRef);
  useBookReveal(bookRef);
  useDotOrbit(portraitRef);

  return (
    <div className="omne" ref={rootRef}>
      <SiteHeader over />
      <main>
        <section className="scene mdl quilt-bg" aria-label="O mně">
          <div className="copy">
            <figure className="portrait" ref={portraitRef} style={{ '--pw': `${PHOTO_W}px`, '--pw-s': `${PHOTO_W_SMALL}px` } as CSSVars}>
              <img
                src="/portret-640.webp"
                srcSet="/portret-320.webp 320w, /portret-640.webp 640w"
                sizes={`(max-width: 720px) ${PHOTO_W_SMALL}px, ${PHOTO_W}px`}
                width={640}
                height={800}
                alt="Kateřina Mlsnová, knižní redaktorka (fotografie upravená pomocí AI)"
                fetchPriority="high"
                decoding="async"
              />
              <svg viewBox="0 0 226 226" aria-hidden="true" focusable="false">
                <circle cx="113" cy="113" r="112" />
              </svg>
              <span className="orb" aria-hidden="true">
                <i />
              </span>
            </figure>
            <p className="pcap">{nb('Fotografie upravená pomocí AI')}</p>
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
                <span>let v&nbsp;advokacii</span>
              </li>
            </ul>
            <div className="actions">
              <Link className="btn btn--fill" to={SAMPLE_LINK}>
                Chci ukázkovou redakci
              </Link>
            </div>
          </div>
        </section>

        <section className="path" aria-label="Moje cesta a práce">
          <ol className="line">
            <li className="stn">
              <h2>Wolters Kluwer ČR</h2>
              <p className="t">
                Z&nbsp;advokacie jsem odešla do nakladatelství Wolters Kluwer ČR – a&nbsp;zjistila, že mě víc než psaní podání baví dávat tvar odborným textům.
              </p>
            </li>
            <Gap />
            <li className="stn">
              <p className="lab">
                {YEARS_EDITING}&nbsp;let · {BOOKS_ROUND}+&nbsp;knih
              </p>
              <h2>Dnes</h2>
              <p className="t">
                Mám za sebou přes {BOOKS_ROUND} vydaných knih: komentáře k&nbsp;zákonům, učebnice, monografie i&nbsp;publikace na klíč. Nejblíž mám
                k&nbsp;právu, právu IT, technologiím a&nbsp;umělé inteligenci.
              </p>
            </li>
            <Gap />
            <li className="stn">
              <p className="lab">{YEARS_LAW}&nbsp;let</p>
              <h2>Advokacie</h2>
              <p className="t">Práva jsem vystudovala a&nbsp;{YEARS_LAW}&nbsp;let v&nbsp;advokacii pracovala, takže rozumím terminologii, citacím i&nbsp;judikatuře.</p>
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
              <p className="lab">Co o&nbsp;spolupráci se mnou říkají autoři</p>
              <div className="obook" ref={bookRef}>
                <div className="pg l">
                  <p className="vq">„Mimořádná spokojenost s&nbsp;paní Kateřinou, velice lehká spolupráce, odpovídá okamžitě a&nbsp;vždy se snaží hodně pomoct.“</p>
                  <cite>Autor odborné publikace</cite>
                  <span className="fo">114</span>
                </div>
                <div className="pg r">
                  <p className="vq">„V&nbsp;posudcích, ale i&nbsp;při obhajobě mi chválili úpravu a&nbsp;celkovou redakci práce. Umíte to!“</p>
                  <cite>Autor disertační práce</cite>
                  <span className="fo">115</span>
                </div>
                <i className="rib" aria-hidden="true" />
              </div>
            </li>
          </ol>
        </section>

        <section className="scene quilt-bg" id="zaver" aria-labelledby="t-zaver">
          <div className="copy">
            <p className="eyebrow">Ukázková redakce</p>
            <h2 id="t-zaver">Pojďme váš text dotáhnout.</h2>
            <p className="lead">U&nbsp;nových klientů většinou začínám ukázkovou redakcí několika stran zdarma. Vy uvidíte můj styl práce, já stav vašeho textu.</p>
            <div className="actions">
              <Link className="btn btn--fill" to={SAMPLE_LINK}>
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
