import { Link } from 'react-router-dom';
import { COVERS_ENABLED } from '../components/Cover';
import { COOKIES_UPDATED, PRIVACY_PATH } from '../data/site';
import { nb } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import { LegalPage, LegalSection } from './Legal';

/* Text vychází z ověřeného stavu webu (7. 11. 2026): žádné cookies, žádná analytika, nic v localStorage ani jiném úložišti prohlížeče
   (záznam „už viděno“ u úvodní animace, klíč kr-hero-redakce, se 7. 11. zrušil: animace se přehrává při každém načtení, viz pages/uvod/editLoop.ts),
   písma hostovaná na webu. Odstavec o obálkách se ukáže jen při COVERS_ENABLED. Kdyby web začal cokoli ukládat, tento text přepsat. */
export default function Cookies() {
  usePageMeta('cookies');

  return (
    <LegalPage title="Cookies" updated={COOKIES_UPDATED} lead={nb('Tento web nepoužívá cookies ani žádné nástroje na měření návštěvnosti nebo reklamu.')}>
      <LegalSection title="Co se ukládá ve vašem prohlížeči">
        <p>
          {nb('Web si ve vašem prohlížeči neukládá žádné záznamy: ani cookies, ani údaje v úložišti prohlížeče (localStorage, sessionStorage).')}
        </p>
      </LegalSection>
      <LegalSection title="Měření návštěvnosti a reklama">
        <p>
          {nb(
            'Nepoužívám Google Analytics ani jiné analytické, reklamní či sociální doplňky. Proto na webu nenajdete cookie lištu a nežádám vás o souhlas.'
          )}
        </p>
      </LegalSection>
      {COVERS_ENABLED && (
        <LegalSection title="Obálky knih">
          <p>
            {nb(
              'Obálky knih se načítají ze serveru nakladatelství Wolters Kluwer (static.wolterskluwer.cz). Při stažení obrázku tento server, stejně jako každý jiný, vidí vaši IP adresu a údaje o prohlížeči.'
            )}
          </p>
        </LegalSection>
      )}
      <LegalSection title="Technické protokoly">
        <p>
          {nb(
            'Web běží u poskytovatele hostingu Vercel. Ten může při zobrazení stránky automaticky zaznamenat IP adresu a čas přístupu do technických protokolů, které slouží k provozu a zabezpečení webu.'
          )}
        </p>
      </LegalSection>
      <p className="more">
        {nb('Další informace jsou v')} <Link to={PRIVACY_PATH}>zásadách zpracování osobních údajů</Link>.
      </p>
    </LegalPage>
  );
}
