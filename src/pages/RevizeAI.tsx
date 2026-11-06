import { Link } from 'react-router-dom';
import { SAMPLE_LINK } from '../data/site';
import { nb } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import { SiteHeader } from '../components/SiteHeader';
import './revize.css';

/* Podstránka Revize AI textů (SEO landing, texty z 04_wireframe-copy_v2.md, oddíl 5). V hlavní navigaci není,
   vede na ni kapitola 3 ve Službách. Nemá vlastní koncept: skládá se ze stejných prvků jako ostatní stránky. */

const PROBLEMS: { title: string; desc: string }[] = [
  { title: 'Přesnost', desc: 'AI si vymýšlí zdroje, citace i paragrafy. V odborném textu je to diskvalifikace; každý odkaz proto prověřuji.' },
  { title: 'Jednotnost', desc: 'Terminologie a styl se mění odstavec od odstavce. Sjednotím pojmy, tón i strukturu.' },
  { title: 'Lidský hlas', desc: 'Strojový rytmus, prázdné fráze a „AI vata“. Text zkrátím a vrátím mu přirozenost.' },
  { title: 'Odpovědnost', desc: 'AI za text neručí. Po redakci víte, co v textu je, proč to tam je a že to obstojí.' },
];

const STEPS = [
  'Pošlete draft a řeknete, kde má text fungovat.',
  'Zreviduji ho v režimu sledování změn, sporná místa označím a fakta k ověření vyznačím.',
  'Dostanete text připravený k publikaci, s přehledem všech zásahů.',
];

export default function RevizeAI() {
  usePageMeta(
    'Revize AI textů – redakce textů vytvořených s pomocí AI | Kateřina Mlsnová',
    'AI napíše draft – já z něj udělám text, za který se podepíšete. Kontrola faktů a citací, sjednocení terminologie, lidský tón. Ukázková revize po dohodě zdarma.'
  );

  return (
    <div className="revize">
      <SiteHeader over />
      <main>
        <section className="scene hero quilt-bg" aria-labelledby="t-h">
          <div className="copy">
            <h1 id="t-h">AI napíše draft. Já z&nbsp;něj udělám text, za který se podepíšete.</h1>
            <p className="lead">Bez lidské redakce zůstává AI výstup jen základem.</p>
            <div className="actions">
              <Link className="btn btn--fill" to={SAMPLE_LINK}>
                Chci ukázkovou revizi
              </Link>
            </div>
          </div>
        </section>

        <section className="scene" aria-labelledby="t-chybi">
          <div className="copy">
            <h2 className="eyebrow" id="t-chybi">
              Co AI textům typicky chybí
            </h2>
            <ol className="rv">
              {PROBLEMS.map((p, i) => (
                <li key={p.title}>
                  <b>{i + 1}</b>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{nb(p.desc)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="scene" aria-labelledby="t-jak">
          <div className="copy">
            <h2 className="eyebrow" id="t-jak">
              Jak revize probíhá
            </h2>
            <ol className="rv steps">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <b>{i + 1}</b>
                  <div>
                    <p>{nb(s)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="scene" aria-labelledby="t-koho">
          <div className="copy">
            <h2 className="eyebrow" id="t-koho">
              Pro koho
            </h2>
            <p className="lead">
              Pro právníky, konzultanty, marketéry a&nbsp;firmy, které AI používají na první verze článků, newsletterů, dokumentací nebo e-booků – a&nbsp;potřebují,
              aby finální výstup byl přesný a&nbsp;důvěryhodný.
            </p>
          </div>
        </section>

        <section className="scene quilt-bg" id="zaver" aria-labelledby="t-zaver">
          <div className="copy">
            <p className="eyebrow">Ukázková revize</p>
            <h2 id="t-zaver">Máte AI draft? Pošlete mi ho.</h2>
            <p className="lead">Ukázkovou revizi několika stran většinou dělám zdarma – uvidíte rozdíl dřív, než se rozhodnete.</p>
            <div className="actions">
              <Link className="btn btn--fill" to={SAMPLE_LINK}>
                Chci ukázkovou revizi
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
