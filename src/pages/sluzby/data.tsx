import type { ReactNode } from 'react';

/** Texty Služeb: čtyři služby jejími slovy, listy rukopisu v kapitolách a časté otázky. */

export interface SheetSample {
  sheet: ReactNode;
  note: string;
}

/** Listy rukopisu: ukázkové texty, v každé kapitole ukazují, co služba dělá. */
export const SHEETS: Record<number, SheetSample> = {
  1: {
    sheet: (
      <>
        <p className="run">Kapitola 4 · Rovné zacházení</p>
        <p>
          <del>Zaměstnavatel je povinen zajistit, aby v případě, že dojde k situaci, kdy dochází</del> <ins>Dochází-li</ins> k&nbsp;rozdílnému zacházení se
          zaměstnanci, <del>bylo toto zacházení posuzováno v souladu se zákonem</del> <ins>posuzuje se podle antidiskriminačního zákona</ins> (č.{' '}
          <del>189</del>
          <ins>198</ins>/2009 Sb.).
        </p>
        <p>
          Za diskriminaci se nepovažuje rozlišování, pro které existuje věcný důvod spočívající v&nbsp;povaze vykonávané práce, je-li takový požadavek pro
          výkon práce nezbytný.
        </p>
        <p>Účel sledovaný takovou výjimkou musí být oprávněný a&nbsp;požadavek přiměřený.</p>
      </>
    ),
    note: 'Antidiskriminační zákon je č. 198/2009 Sb., ne 189.',
  },
  2: {
    sheet: (
      <>
        <p className="run">Newsletter · říjen 2026</p>
        <p>
          <del>Rádi bychom Vás touto cestou informovali o&nbsp;tom, že od října došlo k&nbsp;zavedení nového postupu</del> <ins>Od října zavádíme nový postup</ins>{' '}
          příjmu klientů, <del>jehož cílem je zkrácení doby vyřízení</del> <ins>který zkrátí dobu vyřízení</ins>.
        </p>
        <p>Formulář vyplníte už při objednání, na recepci jej jen potvrdíme.</p>
        <p>
          Potvrzení dostanete e-mailem. <del>V&nbsp;případě jakýchkoli dotazů nás neváhejte kontaktovat</del> <ins>Ptejte se kdykoli</ins>.
        </p>
      </>
    ),
    note: 'Věta je poloviční, význam stejný.',
  },
  3: {
    sheet: (
      <>
        <p className="run">Koncept · vytvořeno s&nbsp;pomocí&nbsp;AI</p>
        <p>
          <del>V&nbsp;dnešní rychle se měnící době je nesmírně důležité zdůraznit, že podle nejnovějších studií</del> <ins>Podle interního měření</ins> nový
          postup příjmu zkrátil vyřízení o&nbsp;<del>18%</del> <ins>18&nbsp;%</ins>.
        </p>
        <p>
          Postup nazýváme <del>“rychlý příjem”</del> <ins>„rychlý příjem“</ins> <del>—</del> <ins>–</ins> jeho zavedení{' '}
          <del>bylo velmi úspěšné a&nbsp;přineslo řadu pozitivních výsledků</del> <ins>stálo 50&nbsp;000&nbsp;Kč</ins>.
        </p>
        <p>
          <del>Nicméně, postup</del> <ins>Postup</ins> odpovídá <del>všem relevantním normám</del> <ins>normě ISO 9001</ins>.
        </p>
      </>
    ),
    note: 'Které studie? Zdroj chybí, ověřím ho, nebo větu vypustím.',
  },
  4: {
    sheet: (
      <>
        <p className="run">Posudek rukopisu</p>
        <p>Rukopis má pevný základ a&nbsp;jasný výklad. Před sazbou doporučuji tři kroky v&nbsp;tomto pořadí:</p>
        <p>
          <b>1</b> sjednotit pojmy ve všech kapitolách,
        </p>
        <p>
          <b>2</b> zkrátit úvod o&nbsp;třetinu,
        </p>
        <p>
          <b>3</b> doplnit zdroje u&nbsp;tabulek.
        </p>
      </>
    ),
    note: 'Tohle řešte jako první. Zbytek může počkat.',
  },
  5: {
    sheet: (
      <>
        <p className="run">Nabídka redakce</p>
        <p>Po přečtení textu navrhuji tento postup:</p>
        <p className="row">
          <span>Rozsah práce</span>
          <i />
        </p>
        <p className="row">
          <span>Termín</span>
          <i />
        </p>
        <p className="row">
          <span>Cena za celý projekt</span>
          <i />
        </p>
        <p>
          Posouzení textu a&nbsp;ukázková redakce: <ins>zdarma</ins>.
        </p>
      </>
    ),
    note: 'Nabídku dostanete do 2–3 pracovních dnů.',
  },
};

/** Na které straně obrazovky stojí list rukopisu u kapitoly (střídavě vlevo a vpravo). */
export const SIDE: Record<number, 'left' | 'right'> = { 1: 'left', 2: 'right', 3: 'left', 4: 'right', 5: 'left' };

export interface Service {
  k: number;
  toc: string;
  d: string;
  w: string[];
  link?: string;
}

/** Čtyři služby jejími slovy (z původního webu). Vlajková služba je první. */
export const SERVICES: Service[] = [
  {
    k: 1,
    toc: 'Redakce (odborných) publikací',
    d: 'Kompletní redakce rukopisu zahrnuje: kontrolu a úpravu struktury a logiky výkladu, terminologickou a formální jednotnost, jazykovou a stylistickou kultivaci, dodržování typografických pravidel, kontrolu citací a odkazů + připomínky autorovi.\nVždy pracuji v režimu sledování změn, takže autor má nad každou úpravou plnou kontrolu.',
    w: ['připravujete komentář, učebnici, monografii nebo odborný e-book', 'rukopis vzniká od většího autorského kolektivu a potřebuje sjednotit', 'text má projít nakladatelstvím, recenzním řízením nebo odbornou oponenturou'],
  },
  {
    k: 2,
    toc: 'Úprava (profesních a odborných) textů',
    d: 'Odborné články, newslettery, texty na web, profesní medailonky a doprovodné materiály. Cílem je text, který reprezentuje – přesný, kultivovaný a přirozený. Právě u kratších textů rozhoduje každá věta o tom, jak budete působit na čtenáře, klienta nebo odbornou komunitu.',
    w: ['odborné sdělení potřebuje jasnější formulaci', 'text má obstát i před náročným čtenářem', 'výstup reprezentuje vás nebo vaši instituci navenek'],
  },
  {
    k: 3,
    toc: 'Revize textů vytvořených s pomocí AI',
    d: 'AI umí připravit základ. Neumí ale ručit za přesnost, jednotnou terminologii ani za to, jak text působí na odborného čtenáře. Draft zpřesním, sjednotím a dotáhnu do podoby, za kterou se podepíšete – včetně kontroly faktů, citací a odkazů na předpisy.',
    w: ['máte AI draft, který nechcete pustit ven v surové podobě', 'text zní obecně, strojově nebo si nejste jistí fakty a citacemi', 'potřebujete profesionální výstup, nejen rychlý základ'],
    link: 'Více o revizích AI textů',
  },
  {
    k: 4,
    toc: 'Redakční konzultace k textu',
    d: 'Posouzení rukopisu nebo textu: zhodnotím silná a slabá místa textu, jeho nejasnosti a strukturální problémy a doplním doporučení, co upravit jako první, nebo co už řešit nemusíte. Dostanete jasný plán práce místo nejasného pocitu, že „by to chtělo ještě projít“.',
    w: ['si nejste jistí, v jakém stavu text vlastně je', 'chcete nezávislé posouzení před odevzdáním nebo publikací', 'část práce si uděláte sami a potřebujete jen jasný směr'],
  },
];

export const PRICE_STEPS = [
  'Pošlete mi text nebo jeho část.',
  'Do 2–3 pracovních dnů dostanete konkrétní nabídku – rozsah práce, termín a cenu.',
  'Posouzení textu i ukázková redakce několika stran (pokud se na ni domluvíme) jsou zdarma a k ničemu vás nezavazují.',
];

export const LIMITS = [
  'Nepíšu text na klíč místo autora.',
  'Nepřebírám odbornou odpovědnost za obsah.',
  'Nenahrazuji autorskou práci, ale pomáhám text sjednotit a doplnit tak, abyste s ním byli spokojeni.',
];

export const FAQ: [string, string][] = [
  ['Jak je to s důvěrností?', 'S každým textem nakládám jako s důvěrným – bez výjimky. Rukopis nikomu neukazuji, nepoužívám ho jako referenci bez vašeho svolení a na přání podepíšu smlouvu o mlčenlivosti (NDA). U právních a firemních textů to považuji za samozřejmost.'],
  ['Jak probíhá ukázková redakce zdarma?', 'Pošlete mi 3–5 stran textu. Zrediguji je v režimu sledování změn, přidám okrajové komentáře a pošlu zpět – uvidíte přesně, jak pracuji a co s textem dělám. Je to zdarma a k ničemu vás to nezavazuje.'],
  ['V jakém formátu pracujeme?', 'Standardně ve Wordu s režimem sledování změn. Každá úprava je viditelná a můžete ji přijmout, nebo odmítnout. Komentáře a dotazy píšu na okraj – nic se neděje bez vašeho vědomí.'],
  ['Co když s navrženou úpravou nesouhlasím?', 'Pak platí vaše verze. Jsem redaktorka, ne spoluautorka – návrhy zdůvodňuji, ale rozhodnutí je vždy na vás.'],
  ['Jak dlouho redakce trvá?', 'Podle rozsahu a stavu textu – kratší text dny, rozsáhlý rukopis týdny. Termín je vždy součástí nabídky a platí.'],
  ['Kolik to stojí?', 'Cenu stanovuji předem za celý projekt podle rozsahu a stavu textu. První krok – posouzení i ukázková redakce – je zdarma, takže nabídku dostanete dřív, než se k čemukoli zavážete.'],
  ['Spolupracujete i s nakladatelstvími a institucemi?', 'Ano. Deset let rediguji knihy pro nakladatelství Wolters Kluwer ČR a externí redakce nabízím i dalším nakladatelstvím, profesním organizacím a odborným institucím.'],
  ['Upravujete i dizertační a jiné kvalifikační práce?', 'Nabízím jazykovou a redakční kultivaci textu v mezích pravidel dané univerzity – strukturu, jednotnost, formulace, citace. Obsah, odborné závěry a autorství zůstávají vždy plně na autorovi.'],
];

/** Ozdobná čísla stran v obsahu (strany nejsou skutečné). */
export const PAGES: Record<string, number> = { 1: 5, 2: 17, 3: 25, 4: 31, 5: 37, 6: 41, 7: 45, '+': 53 };
