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
          Posouzení textu a&nbsp;ukázková redakce (po&nbsp;dohodě) <ins>zdarma</ins>.
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
  /** Řádek pod nadpisem kapitoly: jaké druhy textů služba zahrnuje. */
  sub?: string;
  d: string;
  w: string[];
  link?: string;
  /** Poznámka pod seznamem „Hodí se, když“: otázka jako nadpis (q), název služby pro stroje (name) a odstavce (p). */
  note?: { id: string; q: string; name: string; p: string[] };
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
    sub: 'Články, disertační, rigorózní, diplomové a bakalářské práce, e-booky, newslettery a další.',
    d: 'Odborné články, newslettery, texty na web, profesní medailonky a doprovodné materiály. Cílem je text, který reprezentuje – přesný, kultivovaný a přirozený. Právě u kratších textů rozhoduje každá věta o tom, jak budete působit na čtenáře, klienta nebo odbornou komunitu.',
    w: ['odborné sdělení potřebuje jasnější formulaci', 'text má obstát před vedoucím práce, oponentem nebo jiným náročným čtenářem', 'e-book nebo newsletter reprezentuje vás, vaši kancelář nebo instituci navenek'],
    note: {
      id: 'korektura',
      q: 'Stačí vám jen korektura?',
      name: 'Jazyková korektura',
      p: [
        'Pokud je text po obsahové stránce hotový, zajistím klasickou jazykovou korekturu: profesionální korektorka, se kterou spolupracuji, opraví překlepy, pravopis, interpunkci a typografii (uvozovky, pomlčky, mezery, zápis čísel a dat). Obsah, členění ani odborné závěry nemění; nejasnosti označí komentářem na okraji.',
        'Veškerá komunikace probíhá přese mě a text zůstává důvěrný; na přání podepíšu smlouvu o mlčenlivosti, která platí i pro korektorku. Opravy dostanete ve Wordu v režimu sledování změn a zároveň jako čistou verzi. Korekturu doporučuji až po redakci, aby se neopravovalo to, co se ještě změní.',
      ],
    },
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
  'Nenahrazuji autorskou práci, ale pomáhám text sjednotit a vyladit tak, abyste s ním byli spokojeni.',
];

/** Otázka, odpověď a (volitelně) citace autora pod odpovědí: [text, podpis]. */
export type FaqItem = [question: string, answer: string, quote?: [text: string, cite: string]];

export const FAQ: FaqItem[] = [
  ['Jak je to s důvěrností?', 'S každým textem nakládám jako s důvěrným – bez výjimky. Rukopis nikomu neukazuji, jen případně jazykové korektorce, pokud si korekturu objednáte; i ta je vázána mlčenlivostí. Nepoužívám ho jako referenci bez vašeho svolení a na přání podepíšu smlouvu o mlčenlivosti (NDA), která platí i pro korektorku. U právních a firemních textů to považuji za samozřejmost.'],
  [
    'Redigujete i diplomové, rigorózní a disertační práce?',
    'Ano, včetně právnických. Nabízím jazykovou a redakční kultivaci textu v mezích pravidel dané univerzity – strukturu, jednotnost, formulace a citace (včetně předpisů a judikatury) podle pravidel vaší fakulty (například ČSN ISO 690 nebo fakultní směrnice), aby práce obstála před vedoucím i oponentem. Obsah, odborné závěry a autorství zůstávají vždy plně na autorovi. Pravidla vaší školy, včetně pravidel o používání AI, platí i při redakci.',
    ['„V posudcích, ale i při obhajobě mi chválili úpravu a celkovou redakci práce. Umíte to!“', 'Autor disertační práce'],
  ],
  [
    'Musím v práci uvést, že mi s textem někdo pomáhal?',
    'Řiďte se pravidly své fakulty, ta to řeší různě. Některé chtějí, aby student uvedl pomoc třetích osob, jiné počítají s tím, že text projde redaktorem nebo korektorem. Přesné znění najdete ve směrnici o závěrečných pracích; v pochybnostech se zeptejte vedoucího práce. Obsah a autorství práce zůstávají vždy na vás.',
  ],
  [
    'Jaký je rozdíl mezi redakcí a korekturou?',
    'Korektura opravuje překlepy, pravopis, interpunkci a typografii. Redakce jde dál: hlídá stavbu textu, logiku výkladu, jednotnost pojmů, citace a srozumitelnost pro čtenáře. Nabízím obojí; co váš text potřebuje, poznáme po přečtení několika stran.',
  ],
  [
    'Nabízíte i samotnou jazykovou korekturu, například diplomové práce?',
    'Ano, pokud je text po obsahové stránce hotový, třeba diplomová práce těsně před odevzdáním. Korekturu dělá profesionální jazyková korektorka, se kterou spolupracuji; komunikujete jen se mnou. Opraví překlepy, pravopis, interpunkci a typografii a opravy dostanete ve Wordu v režimu sledování změn i jako čistou verzi. Obsah, členění ani odborné závěry nemění; nejasnosti označí komentářem na okraji.',
  ],
  [
    'Pomůžete s e-bookem nebo newsletterem advokátní kanceláře?',
    'Ano. U e-booků a newsletterů hlídám přesnost odkazů na předpisy, srozumitelnost pro klienty bez právního vzdělání, jednotný styl a to, aby text zněl jako vaše kancelář. Texty zůstávají vaše; navrhuji úpravy a tam, kde jde o obsah, se ptám. U pravidelných newsletterů se domluvíme předem, jak spolupráce poběží.',
  ],
  ['Jak probíhá ukázková redakce?', 'Pošlete mi 3–5 stran textu. Zrediguji je v režimu sledování změn, přidám okrajové komentáře a pošlu zpět – uvidíte přesně, jak pracuji a co s textem dělám. Pokud se na ní domluvíme, je zdarma a k ničemu vás nezavazuje.'],
  ['V jakém formátu pracujeme?', 'Standardně ve Wordu s režimem sledování změn. Každá úprava je viditelná a můžete ji přijmout, nebo odmítnout. Komentáře a dotazy píšu na okraj – nic se neděje bez vašeho vědomí.'],
  ['Co když s navrženou úpravou nesouhlasím?', 'Pak platí vaše verze. Jsem redaktorka, ne spoluautorka – návrhy zdůvodňuji, ale rozhodnutí je vždy na vás.'],
  ['Jak dlouho redakce trvá?', 'Podle rozsahu a stavu textu – kratší text dny, rozsáhlý rukopis týdny. Termín je vždy součástí nabídky a platí. Termín odevzdání napište hned do první zprávy.'],
  ['Kolik to stojí?', 'Cenu stanovuji předem za celý projekt podle rozsahu a stavu textu. První krok – posouzení textu, případně i ukázková redakce po dohodě – je zdarma, takže nabídku dostanete dřív, než se k čemukoli zavážete.'],
  ['Spolupracujete i s nakladatelstvími, kancelářemi a institucemi?', 'Ano. Deset let rediguji knihy pro nakladatelství Wolters Kluwer ČR a externí redakce nabízím i dalším nakladatelstvím, advokátním a poradenským kancelářím, profesním organizacím a odborným institucím.'],
];

/** Ozdobná čísla stran v obsahu (strany nejsou skutečné). */
export const PAGES: Record<string, number> = { 1: 5, 2: 17, 3: 25, 4: 31, 5: 37, 6: 41, 7: 45, '+': 53 };
