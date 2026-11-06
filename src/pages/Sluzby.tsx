import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SAMPLE_LINK } from '../data/site';
import { cx, nb } from '../lib/format';
import { usePageMeta, useRevealOnScroll } from '../lib/hooks';
import { Ms } from '../components/Manuscript';
import { SiteHeader } from '../components/SiteHeader';
import { FAQ, LIMITS, PAGES, PRICE_STEPS, SERVICES, SHEETS, SIDE } from './sluzby/data';
import './sluzby.css';

interface Chapter {
  k: number;
  toc: string;
  h: string;
  sub?: string;
  body: ReactNode;
}

/** Křížek v kolečku: hranice spolupráce. */
function Cross() {
  return (
    <svg className="xm" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" />
      <path className="cr" d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
    </svg>
  );
}

/** Fajfka v kolečku: kdy se spolupráce hodí. Kroužek a značka se při objevení dokreslí. */
function Tick() {
  return (
    <svg className="xm" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" />
      <path className="ck" d="M7.4 12.5l3.1 3.1 6.2-6.8" />
    </svg>
  );
}

/** Časté otázky: odpověď se rozbalí plynule. */
function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq">
      {FAQ.map(([q, a, quote], i) => (
        <div key={q} className={cx('fq', open === i && 'open')}>
          <button type="button" id={`fq${i}`} aria-expanded={open === i} aria-controls={`fa${i}`} onClick={() => setOpen(open === i ? null : i)}>
            <span>{nb(q)}</span>
            <i aria-hidden="true" />
          </button>
          <div className="fa" id={`fa${i}`} role="region" aria-labelledby={`fq${i}`}>
            <div>
              <p>{nb(a)}</p>
              {quote && (
                <blockquote className="fq-quote">
                  <p>{nb(quote[0])}</p>
                  <cite>{quote[1]}</cite>
                </blockquote>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// kapitoly 1 až 7: čtyři služby, cena a postup, hranice spolupráce, časté otázky
const CHAPTERS: Chapter[] = [
  ...SERVICES.map((s) => ({
    k: s.k,
    toc: s.toc,
    h: s.toc,
    sub: s.sub,
    body: (
      <>
        {s.d.split('\n').map((p, i) => (
          <p key={p} className={cx('cdesc', i > 0 && 'cont')}>
            {nb(p)}
          </p>
        ))}
        <p className="wh">Hodí se, když:</p>
        <ul className="wl">
          {s.w.map((x, i) => (
            <li key={x} className="rv">
              <Tick />
              <span>
                {nb(x)}
                {i < s.w.length - 1 ? ',' : '.'}
              </span>
            </li>
          ))}
        </ul>
        {s.link && (
          <Link className="textlink lk" to="/revize-ai-textu">
            {s.link}
          </Link>
        )}
      </>
    ),
  })),
  {
    k: 5,
    toc: 'Cena a postup spolupráce',
    h: 'Cena podle textu, ne podle ceníku.',
    body: (
      <>
        <p className="cdesc">
          {nb(
            'Každý rukopis potřebuje jinak hluboký zásah – proto nemám jednotný ceník za stranu. Cenu stanovuji podle rozsahu, stavu textu a typu práce, vždy předem a za celý projekt, ať víte, s čím počítat.'
          )}
        </p>
        <ol className="sl">
          {PRICE_STEPS.map((t, i) => (
            <li key={t} className="rv">
              <b>{i + 1}</b>
              <span>{nb(t)}</span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    k: 6,
    toc: 'Autorem zůstáváte vy',
    h: 'Autorem zůstáváte vy',
    body: (
      <>
        <ul className="sl">
          {LIMITS.map((t) => (
            <li key={t} className="rv">
              <Cross />
              <span>{nb(t)}</span>
            </li>
          ))}
        </ul>
        <p className="cdesc sm">{nb('Pokud budete chtít, mohu do procesu zapojit i další prověřené specialisty, například zkušenou jazykovou korektorku.')}</p>
      </>
    ),
  },
  {
    k: 7,
    toc: 'Časté otázky',
    h: 'Co klienty zajímá, než mi napíšou.',
    body: (
      <>
        <Faq />
        <p className="lk">
          {nb('Nenašli jste svou otázku?')}{' '}
          <Link className="textlink" to="/kontakt">
            Napište mi
          </Link>
        </p>
      </>
    ),
  },
];

const TOTAL = CHAPTERS.length;

/** Živé záhlaví: kde ve knize se čtenář právě nachází. */
interface Running {
  on: boolean;
  title: string;
  num: string;
}

export default function Sluzby() {
  usePageMeta(
    'Služby – redakce textů | Kateřina Mlsnová',
    'Redakce odborných publikací, úprava profesních textů, revize AI textů a redakční konzultace. Ukázková redakce po dohodě zdarma, cena předem za celý projekt.'
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState<Running>({ on: false, title: '', num: '' });
  useRevealOnScroll(rootRef);

  // živé záhlaví ukazuje kapitolu uprostřed obrazovky a postup čtením
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const chaps = [...root.querySelectorAll<HTMLElement>('.chap')];
    let queued = false;
    const head = () => {
      queued = false;
      const mid = window.innerHeight / 2;
      const c = chaps.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      if (!c) {
        setRun((r) => (r.on ? { ...r, on: false } : r));
        return;
      }
      const title = c.dataset.toc ?? '';
      const num = c.dataset.k ? `${c.dataset.k} / ${TOTAL}` : 'Příloha';
      setRun((r) => (r.on && r.title === title && r.num === num ? r : { on: true, title, num }));
      const top = chaps[0].getBoundingClientRect().top + window.scrollY;
      const end = chaps[chaps.length - 1].getBoundingClientRect().bottom + window.scrollY;
      const p = Math.max(0, Math.min(1, (window.scrollY + mid - top) / (end - top)));
      barRef.current?.style.setProperty('--p', p.toFixed(3));
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(head);
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    head();
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);

  return (
    <div className="sluzby" ref={rootRef}>
      <SiteHeader over />
      <div className={cx('runhead', run.on && 'on')} ref={barRef}>
        <a href="#obsah">
          ↑<span> Obsah</span>
        </a>
        <span className="rt">{run.title}</span>
        <span>{run.num}</span>
      </div>

      <main>
        <section className="scene mdl quilt-bg" id="top" aria-labelledby="t-h">
          <div className="copy">
            <h1 id="t-h">{nb('Od konceptu k hotovému textu.')}</h1>
            <p className="lead">{nb('Rediguji hlavně odborné (a právní) publikace, ale i kratší profesní texty (typu newslettery, e-booky apod.) a závěrečné práce.')}</p>
            <div className="actions">
              <Link className="btn btn--fill" to={SAMPLE_LINK}>
                Chci ukázkovou redakci
              </Link>
            </div>
          </div>
        </section>

        <section className="scene mdl" id="obsah" aria-labelledby="t-o">
          <div className="copy">
            <h2 className="ct" id="t-o">
              Co pro vás mohu udělat:
            </h2>
            <nav className="toc" aria-label="Obsah stránky">
              <p className="toc-g">Služby</p>
              <ol>
                {CHAPTERS.slice(0, 4).map((c) => (
                  <TocRow key={c.k} k={c.k} title={c.toc} href={`#k${c.k}`} />
                ))}
              </ol>
              <p className="toc-g">Spolupráce</p>
              <ol>
                {CHAPTERS.slice(4).map((c) => (
                  <TocRow key={c.k} k={c.k} title={c.toc} href={`#k${c.k}`} />
                ))}
                <TocRow k="+" title="Ukázková redakce" href="#zaver" />
              </ol>
            </nav>
          </div>
        </section>

        {CHAPTERS.map((c) => {
          const side = SIDE[c.k];
          const sample = SHEETS[c.k];
          return (
            <article
              key={c.k}
              className={cx('scene chap', side && 'scn', c.k === 1 && 'big')}
              id={`k${c.k}`}
              data-k={c.k}
              data-toc={c.toc}
              data-side={side}
              aria-labelledby={`h-k${c.k}`}
            >
              <div className="copy">
                <p className="cno">
                  <b>{c.k}</b>Kapitola {c.k}
                </p>
                <h2 className="ct" id={`h-k${c.k}`}>
                  {nb(c.h)}
                </h2>
                {c.sub && <p className="csub">{nb(c.sub)}</p>}
                {sample && side && (
                  <div className="art" aria-hidden="true">
                    <Ms noteSide={side === 'left' ? 'right' : 'left'} note={nb(sample.note)}>
                      {sample.sheet}
                    </Ms>
                  </div>
                )}
                {c.body}
              </div>
            </article>
          );
        })}

        <section className="scene chap quilt-bg" id="zaver" data-k="" data-toc="Ukázková redakce" aria-labelledby="t-zaver">
          <div className="copy">
            <p className="cno">
              <b className="pl" />
              Příloha
            </p>
            <h2 className="ct" id="t-zaver">
              {nb('Pojďme váš text dotáhnout.')}
            </h2>
            <p className="cdesc">
              {nb('U nových klientů většinou začínám ukázkovou redakcí několika stran zdarma. Vy uvidíte můj styl práce, já stav vašeho textu.')}
            </p>
            <div className="actions">
              <Link className="btn btn--fill" to={SAMPLE_LINK}>
                Chci ukázkovou redakci
              </Link>
            </div>
            <Link className="textlink" to="/kontakt">
              {nb('nebo mi jen napište o svém textu')}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

/** Řádek obsahu: číslo v kolečku, název, tečkové vodítko a (ozdobné) číslo strany. */
function TocRow({ k, title, href }: { k: number | '+'; title: string; href: string }) {
  return (
    <li>
      <a href={href}>
        {k === '+' ? <b className="pl" /> : <b>{k}</b>}
        <span className="tt">{nb(title)}</span>
        <i className="dots" aria-hidden="true" />
        <span className="pg">{PAGES[k]}</span>
      </a>
    </li>
  );
}
