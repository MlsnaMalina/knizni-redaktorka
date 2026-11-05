import { Link } from 'react-router-dom';
import { COVERS_ENABLED } from '../components/Cover';
import { PRIVACY_PATH } from '../data/site';
import { nb } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import { LegalPage, LegalSection } from './Legal';

/* Text vychází z ověřeného stavu webu (5. 11. 2026): žádné cookies, žádná analytika, jediný záznam v localStorage
   (klíč kr-hero-redakce v pages/uvod/Arts.tsx), písma hostovaná na webu. Odstavec o obálkách se ukáže jen při COVERS_ENABLED. */
export default function Cookies() {
  usePageMeta(
    'Cookies | Kateřina Mlsnová',
    'Web nepoužívá cookies ani měření návštěvnosti. Co se ukládá v prohlížeči a odkud se načítají obálky knih.'
  );

  return (
    <LegalPage title="Cookies" lead={nb('Tento web nepoužívá cookies ani žádné nástroje na měření návštěvnosti nebo reklamu.')}>
      <LegalSection title="Co se ukládá ve vašem prohlížeči">
        <p>
          {nb('Web si v úložišti prohlížeče (localStorage) ukládá jediný záznam s názvem')} <span className="nw">kr-hero-redakce</span>
          {nb(
            '. Pamatuje si v něm, že jste už viděli úvodní animaci, aby se vám nepřehrávala při každé návštěvě. Záznam neobsahuje žádné osobní údaje, nesleduje vás a nikam se neodesílá. Smazat ho můžete kdykoli v nastavení prohlížeče.'
          )}
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
