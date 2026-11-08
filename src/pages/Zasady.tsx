import { Link } from 'react-router-dom';
import { COVERS_ENABLED } from '../components/Cover';
import { COOKIES_PATH, ICO, MAIL, OWNER } from '../data/site';
import { nb } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import { LegalPage, LegalSection } from './Legal';

/* První znění k posouzení Kateřiny (5. 11. 2026). Opírá se o ověřený stav webu: formulář odesílá FormSubmit do e-mailové schránky,
   web běží na Vercelu, žádné cookies ani analytika. Doba uchování a právní základ jsou obecná znění; sídlo a zpracování
   u FormSubmit nejsou ověřeny, proto se o nich v textu nic netvrdí. Odstavec o obálkách se ukáže jen při COVERS_ENABLED. */
export default function Zasady() {
  usePageMeta('zasady');

  return (
    <LegalPage title="Zásady zpracování osobních údajů" lead={nb('Jak nakládám s údaji, které mi pošlete přes formulář nebo e-mailem.')}>
      <LegalSection title="Kdo údaje zpracovává">
        <p>
          {nb(`Správcem osobních údajů je ${OWNER}, IČO ${ICO}. Kontaktovat mě můžete na e-mailu`)} <a href={`mailto:${MAIL}`}>{MAIL}</a>.
        </p>
      </LegalSection>
      <LegalSection title="Jaké údaje zpracovávám">
        <p>
          {nb(
            'Ze zprávy, kterou mi pošlete přes formulář nebo e-mailem, zpracovávám jméno, e-mailovou adresu a obsah zprávy (o jaký text jde a co od spolupráce očekáváte). Texty, které mi případně pošlete k posouzení nebo k ukázkové redakci, považuji za důvěrné.'
          )}
        </p>
      </LegalSection>
      <LegalSection title="Proč a na jakém základě">
        <p>
          {nb(
            'Údaje používám jen k tomu, abych vám odpověděla, posoudila váš text a připravila případnou spolupráci. Právním základem je vaše žádost o jednání o spolupráci (čl. 6 odst. 1 písm. b) nařízení GDPR); u obecných dotazů můj oprávněný zájem na ně odpovědět (písm. f)). Údaje nepoužívám k marketingu ani je neprodávám.'
          )}
        </p>
      </LegalSection>
      <LegalSection title="Komu údaje předávám">
        <p>
          {nb(
            'Zprávu z formuláře přenáší do mé e-mailové schránky služba FormSubmit (formsubmit.co); zpráva pak leží ve schránce u mého poskytovatele e-mailu. Web běží u poskytovatele hostingu Vercel, který může v technických protokolech zaznamenat IP adresu návštěvníka.'
          )}
          {COVERS_ENABLED &&
            ' ' +
              nb('Při zobrazení obálek knih se váš prohlížeč připojí k serveru nakladatelství Wolters Kluwer (static.wolterskluwer.cz), který vidí vaši IP adresu.')}
        </p>
        <p>{nb('Pokud si objednáte jazykovou korekturu, dostane text i profesionální jazyková korektorka, se kterou spolupracuji. Je vázána mlčenlivostí a veškerá komunikace probíhá přese mě.')}</p>
        <p>{nb('Dalším příjemcům údaje nepředávám.')}</p>
      </LegalSection>
      <LegalSection title="Jak dlouho údaje uchovávám">
        <p>
          {nb(
            'Jen po dobu nezbytnou k vyřízení vaší zprávy a případné spolupráce. Pokud ke spolupráci nedojde, zprávu po vyřízení smažu. Pokud spolupráce vznikne, uchovávám údaje po dobu, kterou vyžadují právní předpisy (například u účetních dokladů).'
          )}
        </p>
      </LegalSection>
      <LegalSection title="Vaše práva">
        <p>
          {nb(
            'Máte právo na přístup ke svým údajům, jejich opravu nebo výmaz, omezení zpracování, přenositelnost a právo vznést námitku. Stačí mi napsat na e-mail výše. Pokud se domníváte, že s údaji nakládám nesprávně, můžete podat stížnost u Úřadu pro ochranu osobních údajů'
          )}{' '}
          (<a href="https://uoou.gov.cz" target="_blank" rel="noopener noreferrer">uoou.gov.cz</a>).
        </p>
      </LegalSection>
      <LegalSection title="Cookies a měření">
        <p>
          {nb('Web nepoužívá cookies ani analytiku. Podrobnosti jsou na stránce')} <Link to={COOKIES_PATH}>Cookies</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
