export interface Book {
  title: string;
  note?: string;
  flagship?: boolean;
}

export interface BookCategory {
  name: string;
  books: Book[];
}

export const bookCategories: BookCategory[] = [
  {
    name: "Komentáře k zákonům a nařízením",
    books: [
      { title: "Komentář nařízení o kryptoaktivech (MiCA)", flagship: true },
      { title: "Komentář zákona o podnikání na kapitálovém trhu", flagship: true },
      { title: "Komentář zákona o platebním styku", flagship: true },
      { title: "Komentář zákona o bankovní identitě" },
      { title: "Komentář zákona o pojišťovnictví" },
      { title: "Komentář zákona o prověřování zahraničních investic" },
      { title: "Komentář občanského zákoníku, sv. III", note: "2. vyd." },
      { title: "Komentář občanského zákoníku, sv. IV", note: "2. vyd." },
      { title: "Praktický komentář zákoníku práce" },
      { title: "Komentář zákona o ochranných známkách" },
      { title: "Praktický komentář zákona o ochranných známkách" },
      { title: "Komentář zákona o ochraně spotřebitele", note: "2. vyd." },
      { title: "Komentář Nařízení Řím I a Nařízení Řím II" },
      { title: "Komentář Nařízení eIDAS a české adaptační zákony" },
      { title: "Komentář zákona o elektronických komunikacích", note: "2. vyd." },
      { title: "Komentář zákona o poštovních službách" },
      { title: "Komentář zákona o rozhodčím řízení" },
      { title: "Komentář zákona o mediaci" },
      { title: "Komentář zákona o soudních poplatcích", note: "2. vyd." },
      { title: "Komentář novelizace exekučního řádu" },
      { title: "Komentář Milostivého léta" },
      { title: "Komentář zákona o veřejném ochránci práv" },
      { title: "Komentář zákona o krajích" },
      { title: "Komentář knihovního zákona" },
      { title: "Komentář zákona o protiprávnosti komunistického režimu" },
      { title: "Komentář zákona o umělém přerušení těhotenství" },
      { title: "Praktický komentář zákona o nelékařských zdravotnických povoláních" },
    ],
  },
  {
    name: "Právo IT, technologie a umělá inteligence",
    books: [
      { title: "Právo informačních technologií", note: "2. vyd.", flagship: true },
      { title: "Kybernetický bezpečnostní incident 3D: IT, právo a compliance", note: "1. + 2. vyd.", flagship: true },
      { title: "Trestní odpovědnost umělé inteligence", flagship: true },
      { title: "Umělá inteligence z pohledu antidiskriminačního práva a GDPR", note: "1. + 2. vyd.", flagship: true },
      { title: "Právní aspekty umělé inteligence", flagship: true },
      { title: "Umělá inteligence a právo" },
      { title: "Umělá inteligence jako technologická výzva autorskému právu" },
      { title: "Právo na sebeurčení a nositelná elektronika" },
      { title: "Pojištění odpovědnosti z provozu autonomních vozidel" },
      { title: "Programování pro právníky" },
      { title: "Výjimky a omezení autorského práva v prostředí digitálních sítí" },
      { title: "Vymahatelnost práva pomocí online řešení sporů" },
    ],
  },
  {
    name: "Finanční trh a fintech",
    books: [
      { title: "Fintech v mezinárodním prostředí" },
      { title: "Fintech in the International Environment", note: "anglické vydání" },
      { title: "Blockchain a dematerializace cenných papírů" },
      { title: "Delisting" },
      { title: "Selhání subjektů finančního trhu" },
      { title: "Finanční trh a jeho stabilita" },
      { title: "Moderní nástroje aktivní politiky finančních inovací" },
      { title: "Platební styk v rámci vysoce rizikových odvětví" },
      { title: "Postavení spotřebitele v oblasti distribuce pojištění v digitální době" },
    ],
  },
  {
    name: "Civilní proces, mediace a monografie",
    books: [
      { title: "Žaloba v civilním řízení", note: "2. vyd." },
      { title: "Hledání pravdy v civilním procesu" },
      { title: "Citační analýza judikatury" },
      { title: "Procesní postavení osoby neznámého pobytu" },
      { title: "Mediace v praxi" },
      { title: "Právní a sociální aspekty mediace" },
      { title: "Překryv působnosti Veřejného ochránce práv" },
      { title: "Dědický statut" },
      { title: "Smlouva o přepravě" },
    ],
  },
  {
    name: "Podnikání, ekonomie a mezinárodní témata",
    books: [
      { title: "Zahájení podnikání", note: "1. + 2. vyd." },
      { title: "Ukončení podnikání" },
      { title: "Ekonomické základy práva", note: "1. + 2. vyd." },
      { title: "Beyond Compliance" },
      { title: "Legal English" },
      { title: "Vademecum of International Law" },
      { title: "Vývoj mezinárodního kosmického práva" },
      { title: "Arabsko-izraelské otázky" },
      { title: "Kvóty a mýty" },
      { title: "Teoretické a praktické aspekty investičního životního pojištění" },
    ],
  },
];

export const allBookTitles: string[] = bookCategories.flatMap((c) =>
  c.books.map((b) => (b.note ? `${b.title} (${b.note})` : b.title))
);
