import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BOOKS_ROUND, SAMPLE_LINK, YEARS_EDITING } from '../data/site';
import { createUvodNet, type UvodNet } from '../lib/uvod-net';
import { useArtWidth, useMedia, usePageMeta } from '../lib/hooks';
import { SiteHeader } from '../components/SiteHeader';
import { HeroArt, SluzbyArt, ZaverArt } from './uvod/Arts';
import { HeroLens } from './uvod/HeroLens';
import { Prace } from './uvod/Prace';
import { ProKoho } from './uvod/ProKoho';
import { Shop } from './uvod/Shop';
import './uvod/uvod.css';

export default function Uvod() {
  usePageMeta('uvod');
  const mainRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const netRef = useRef<UvodNet | null>(null);
  const aw = useArtWidth();
  const phone = useMedia('(max-width: 720px)');

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
          {phone ? <HeroLens /> : <HeroArt aw={aw} />}
          <div className="copy" data-focus>
            <h1 id="t-hero">Aby váš (odborný) text obstál.</h1>
            <p className="lead">Redakce odborných publikací, závěrečných prací, právních monografií i&nbsp;komentářů k&nbsp;zákonům.</p>
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
                Ukázková redakce
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
            <h2 id="t-sluzby">Každý text potřebuje něco trochu jiného.</h2>
            <ul className="services">
              <li>
                <h3>Redakce (odborných) publikací</h3>
                <p>Komentáře, učebnice a&nbsp;monografie od rukopisu až k&nbsp;vydání.</p>
              </li>
              <li>
                <h3>Úprava (profesních a odborných) textů</h3>
                <p>
                  Články, disertační, rigorózní, diplomové a&nbsp;bakalářské práce, <span className="nw">e-booky</span>, newslettery a&nbsp;další.
                </p>
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

        <ProKoho />

        <section className="scene" id="zaver" data-side="left" aria-labelledby="t-zaver">
          <ZaverArt aw={aw} />
          <div className="copy" data-focus>
            <p className="eyebrow">Ukázková redakce</p>
            <h2 id="t-zaver">Pojďme váš text dotáhnout.</h2>
            <p className="lead">
              U&nbsp;nových klientů většinou začínám ukázkovou redakcí několika stran zdarma. Vy uvidíte můj styl práce, já stav vašeho textu.
            </p>
            <div className="actions">
              <Link className="btn btn--fill" to={SAMPLE_LINK}>
                Chci ukázkovou redakci
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
