import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BOOKS_ROUND, YEARS_EDITING } from '../data/site';
import { createUvodNet, type UvodNet } from '../lib/uvod-net';
import { useArtWidth, usePageMeta } from '../lib/hooks';
import { SiteHeader } from '../components/SiteHeader';
import { HeroArt, SluzbyArt, ZaverArt } from './uvod/Arts';
import { Prace } from './uvod/Prace';
import { Shop } from './uvod/Shop';
import './uvod/uvod.css';

export default function Uvod() {
  usePageMeta(
    'Kateřina Mlsnová – knižní redaktorka',
    `Knižní redaktorka: redakce knih a dalších textů, revize textů s pomocí AI, redakční konzultace. Přes ${BOOKS_ROUND} vydaných knih, ukázková redakce zdarma.`
  );
  const mainRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const netRef = useRef<UvodNet | null>(null);
  const aw = useArtWidth();

  useEffect(() => {
    if (!mainRef.current || !svgRef.current) return undefined;
    const net = createUvodNet(mainRef.current, svgRef.current);
    netRef.current = net;
    return () => {
      net.destroy();
      netRef.current = null;
    };
  }, []);

  return (
    <>
      <SiteHeader over />
      <main ref={mainRef} className="uvod">
        <svg ref={svgRef} className="net" aria-hidden="true" />

        <section className="scene hero" data-side="left" aria-labelledby="t-hero">
          <HeroArt aw={aw} />
          <div className="copy" data-focus>
            <h1 id="t-hero">Aby váš (odborný) text obstál.</h1>
            <p className="lead">Redakce komentářů k&nbsp;zákonům, právních monografií a&nbsp;odborných publikací.</p>
            <ul className="facts" aria-label="Zkušenosti v číslech">
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
            </ul>
            <div className="actions">
              <a className="btn btn--fill" href="#zaver">
                Ukázková redakce zdarma
              </a>
              <Link className="btn btn--line" to="/knihovna">
                Knihovna
              </Link>
            </div>
          </div>
        </section>

        <Shop onSelect={(index) => netRef.current?.select(index)} />

        <section className="scene" id="sluzby" data-side="right" aria-labelledby="t-sluzby">
          <SluzbyArt aw={aw} />
          <div className="copy" data-focus>
            <p className="eyebrow">Služby</p>
            <h2 id="t-sluzby">Každý text potřebuje něco trochu jiného.</h2>
            <ul className="services">
              <li>
                <h3>Redakce odborných publikací</h3>
                <p>Komentáře, učebnice a&nbsp;monografie od rukopisu až k&nbsp;vydání.</p>
              </li>
              <li>
                <h3>Úprava profesních textů</h3>
                <p>Články, newslettery a&nbsp;texty, které vás reprezentují navenek.</p>
              </li>
              <li>
                <h3>Revize textů z&nbsp;AI</h3>
                <p>Draft zpřesním, sjednotím a&nbsp;zbavím typických chyb AI.</p>
              </li>
              <li>
                <h3>Redakční konzultace</h3>
                <p>Posouzení textu a&nbsp;doporučení, co upravit nejdřív.</p>
              </li>
            </ul>
            <Link className="textlink" to="/sluzby">
              Všechny služby
            </Link>
          </div>
        </section>

        <Prace />

        <section className="scene" id="zaver" data-side="left" aria-labelledby="t-zaver">
          <ZaverArt aw={aw} />
          <div className="copy" data-focus>
            <p className="eyebrow">Ukázka zdarma</p>
            <h2 id="t-zaver">Pošlete mi kapitolu. Uvidíte, co s&nbsp;textem udělám.</h2>
            <p className="lead">
              U&nbsp;nových klientů začínám ukázkovou redakcí několika stran zdarma. Vy uvidíte můj styl práce, já stav vašeho textu.
            </p>
            <div className="actions">
              <Link className="btn btn--fill" to="/kontakt">
                Chci ukázkovou redakci
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
