import type { Lang } from "@/lib/i18n-routes";



export type BlogCategoryKey = "cost" | "before" | "converting" | "seo";

export const BLOG_CATEGORY_KEYS: BlogCategoryKey[] = ["cost", "before", "converting", "seo"];

export const BLOG_CATEGORIES: Record<BlogCategoryKey, Record<Lang, { label: string; summary: string }>> = {
  cost: {
    pl: {
      label: "Inwestycja w stronę",
      summary: "Jak myśleć o budżecie, wycenie i zakresie, żeby strona realnie się opłacała.",
    },
    en: {
      label: "Investing in a website",
      summary: "How to think about budget, pricing and scope so the site actually pays off.",
    },
  },
  before: {
    pl: {
      label: "Zanim zlecisz",
      summary: "Jak wybrać wykonawcę i nie przepłacić za szablon.",
    },
    en: {
      label: "Before you hire",
      summary: "How to pick the right developer and avoid paying for a template.",
    },
  },
  converting: {
    pl: {
      label: "Strona, która sprzedaje",
      summary: "UX, konwersja, mobile i pierwsze wrażenie.",
    },
    en: {
      label: "Sites that sell",
      summary: "UX, conversion, mobile and first impressions.",
    },
  },
  seo: {
    pl: {
      label: "Google & SEO",
      summary: "Jak sprawić, żeby strony dało się znaleźć.",
    },
    en: {
      label: "Google & SEO",
      summary: "How to make a site findable in search.",
    },
  },
};

/** URL slugs for category archive pages (own page per category — better for SEO). */
export const BLOG_CATEGORY_SLUGS: Record<BlogCategoryKey, Record<Lang, string>> = {
  cost: { pl: "inwestycja-w-strone", en: "investing-in-a-website" },
  before: { pl: "zanim-zlecisz", en: "before-you-hire" },
  converting: { pl: "strona-ktora-sprzedaje", en: "sites-that-sell" },
  seo: { pl: "google-seo", en: "google-seo" },
};

export const BLOG_CATEGORY_SEO: Record<
  BlogCategoryKey,
  Record<Lang, { title: string; description: string; intro: string }>
> = {
  cost: {
    pl: {
      title: "Inwestycja w stronę — budżet, wycena, zakres | GOVO JOURNAL",
      description:
        "Ile kosztuje strona internetowa i od czego zależy cena? Artykuły o budżecie, wycenie i zakresie projektu, żeby strona realnie się opłacała.",
      intro:
        "Artykuły o pieniądzach bez owijania w bawełnę: od czego zależy cena strony, jak układać budżet i jak liczyć, czy inwestycja się zwraca.",
    },
    en: {
      title: "Investing in a website — budget, pricing, scope | GOVO JOURNAL",
      description:
        "How much does a website cost and what drives the price? Articles about budget, pricing and scope so the site actually pays off.",
      intro:
        "Straight talk about money: what drives the price of a website, how to plan a budget and how to judge the return.",
    },
  },
  before: {
    pl: {
      title: "Zanim zlecisz stronę — jak wybrać wykonawcę | GOVO JOURNAL",
      description:
        "Jak przygotować brief, wybrać wykonawcę strony i nie przepłacić za szablon. Praktyczne artykuły przed zleceniem projektu.",
      intro:
        "Co przygotować przed rozmową z wykonawcą, jak czytać ofertę i na co uważać, żeby nie zapłacić dużo za szablon.",
    },
    en: {
      title: "Before you hire — choosing a web developer | GOVO JOURNAL",
      description:
        "How to write a brief, choose a developer and avoid paying custom prices for a template. Practical reading before you commission a site.",
      intro:
        "What to prepare before the first call, how to read an offer and what to watch out for when comparing developers.",
    },
  },
  converting: {
    pl: {
      title: "Strona, która sprzedaje — UX i konwersja | GOVO JOURNAL",
      description:
        "UX, konwersja, mobile i pierwsze wrażenie. Artykuły o tym, jak sprawić, żeby ruch na stronie zamieniał się w zapytania.",
      intro:
        "Jak zamieniać odwiedziny w zapytania: układ treści, wezwania do działania, mobile i pierwsze pięć sekund na stronie.",
    },
    en: {
      title: "Sites that sell — UX and conversion | GOVO JOURNAL",
      description:
        "UX, conversion, mobile and first impressions. Articles about turning traffic into real enquiries.",
      intro:
        "How to turn visits into enquiries: content order, calls to action, mobile and the first five seconds on the page.",
    },
  },
  seo: {
    pl: {
      title: "Google & SEO dla firm — jak być widocznym | GOVO JOURNAL",
      description:
        "SEO dla małych firm, lokalne pozycjonowanie i widoczność w Google. Konkretne artykuły o tym, jak dać się znaleźć klientom.",
      intro:
        "Od podstaw technicznych do lokalnego SEO — jak sprawić, żeby klienci znajdowali Twoją stronę w Google.",
    },
    en: {
      title: "Google & SEO for small business | GOVO JOURNAL",
      description:
        "SEO for small businesses, local search and visibility in Google. Practical articles on getting found by clients.",
      intro:
        "From technical basics to local SEO — how to make sure clients actually find your site in Google.",
    },
  },
};

export function findBlogCategory(lang: Lang, slug: string): BlogCategoryKey | undefined {
  return BLOG_CATEGORY_KEYS.find((key) => BLOG_CATEGORY_SLUGS[key][lang] === slug);
}


export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "cta"; text: string; linkHref: string; linkLabel: string };

export type BlogPostContent = {
  slug: string;
  title: string;
  /** Short line used on cards. */
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  readTime: string;
  body: BlogBlock[];
};

export type BlogPost = {
  id: string;
  category: BlogCategoryKey;
  date: string;
  featured?: boolean;
  /** Optional cover image URL used on cards instead of the icon tile. */
  cover?: string;
  pl: BlogPostContent;
  en: BlogPostContent;
};


export const BLOG_POSTS: BlogPost[] = [
  {
    id: "signals-outgrown",
    category: "converting",
    date: "2026-08-18",
    featured: true,
    cover: "/blog/blog-outgrown-website.png",
    pl: {
      slug: "firma-wyrosla-ponad-swoja-strone",
      title: "9 sygnałów, że Twoja firma wyrosła ponad swoją stronę",
      excerpt:
        "Sprawdź, czy to już czas na redesign i jak rozpoznać, że obecna strona zaczyna Cię ograniczać.",
      metaTitle: "9 sygnałów, że Twoja firma potrzebuje redesignu strony",
      metaDescription:
        "Sprawdź 9 sygnałów, które pokazują, że obecna strona nie nadąża już za Twoją firmą i zaczyna ograniczać sprzedaż, wizerunek lub rozwój.",
      readTime: "7 min",
      body: [
        {
          type: "p",
          text: "Strona internetowa rzadko starzeje się z dnia na dzień. Znacznie częściej dzieje się coś innego: firma idzie do przodu, a strona zostaje w miejscu.",
        },
        {
          type: "p",
          text: "Oferta się rozwija. Zdjęcia są lepsze. Social media wyglądają profesjonalniej. Pojawiają się nowi klienci, realizacje i usługi.",
        },
        {
          type: "p",
          text: "Tylko strona nadal opowiada o firmie sprzed kilku lat. I właśnie wtedy przestaje być jedynie „trochę stara”. Zaczyna być problemem.",
        },
        { type: "h", text: "1. Niechętnie wysyłasz komuś link do własnej strony" },
        {
          type: "p",
          text: "To jeden z najprostszych testów. Klient pyta: „Macie stronę?”, a Ty instynktownie wolisz wysłać Instagram, PDF, Behance albo kilka zdjęć na WhatsAppie.",
        },
        {
          type: "p",
          text: "Jeżeli najlepszym sposobem prezentacji firmy jest wszystko oprócz jej własnej strony, coś jest nie tak. Strona powinna być miejscem, do którego kierujesz ludzi z pełnym przekonaniem. Nie miejscem, które musisz tłumaczyć.",
        },
        { type: "h", text: "2. Twoja oferta wygląda dziś inaczej niż wtedy, kiedy powstawała strona" },
        {
          type: "p",
          text: "Firmy się zmieniają. Dochodzi nowa usługa. Znika stara. Zmienia się grupa klientów. Marka zaczyna obsługiwać droższe projekty.",
        },
        {
          type: "p",
          text: "Problem pojawia się wtedy, gdy nową ofertę próbujesz ciągle wciskać w strukturę zaprojektowaną dla starego biznesu. Efekt? Menu robi się chaotyczne, kolejne sekcje są dokładane przypadkowo, a najważniejsze rzeczy giną pomiędzy treściami, które kiedyś miały większe znaczenie.",
        },
        {
          type: "p",
          text: "To często sygnał, że potrzebna jest nie kolejna podstrona, tylko nowa hierarchia informacji.",
        },
        { type: "h", text: "3. Instagram wygląda lepiej niż strona" },
        {
          type: "p",
          text: "To szczególnie częste w branżach wizualnych: detailing, gastronomia, beauty, wnętrza, nieruchomości, moda. Firma inwestuje w zdjęcia, rolki i identyfikację. Feed wygląda nowocześnie i premium.",
        },
        {
          type: "p",
          text: "Potencjalny klient klika link w bio — i nagle trafia na stronę wyglądającą jak zupełnie inna marka. Taki rozdźwięk potrafi podważyć pierwsze wrażenie.",
        },
        {
          type: "p",
          text: "Nie dlatego, że każda strona musi być spektakularna. Dlatego, że poziom prezentacji powinien odpowiadać poziomowi firmy.",
        },
        { type: "h", text: "4. Strona działa na telefonie, ale nie została dla telefonu zaprojektowana" },
        {
          type: "p",
          text: "To nie jest to samo. Można mieć stronę, która technicznie „jest responsywna”, a nadal korzysta się z niej źle. Za małe przyciski. Ogromne bloki tekstu. Źle wykadrowane zdjęcia. Formularz wymagający ciągłego przewijania. Menu, w którym trudno coś znaleźć.",
        },
        {
          type: "p",
          text: "Jeżeli główna wersja strony powstała z myślą o desktopie, a mobile został tylko pomniejszony, użytkownik bardzo szybko to czuje. Dzisiaj wersja mobilna nie jest dodatkiem. Dla wielu klientów będzie pierwszym i jedynym kontaktem z Twoją stroną.",
        },
        { type: "h", text: "5. Klient nie wie, co zrobić dalej" },
        {
          type: "p",
          text: "Dobra strona nie powinna kończyć się na: „ładnie wygląda”. Powinna prowadzić. Do zapytania. Rezerwacji. Zakupu. Sprawdzenia realizacji. Wyboru usługi.",
        },
        {
          type: "p",
          text: "Jeżeli użytkownik czyta ofertę, ale potem musi sam szukać numeru telefonu albo zgadywać, gdzie przejść dalej, strona nie wykonuje swojej pracy. Najczęściej problemem nie jest brak kolejnego przycisku. Problemem jest brak jasnej ścieżki decyzji.",
        },
        { type: "h", text: "6. Każda zmiana na stronie jest walką" },
        {
          type: "p",
          text: "Zmiana ceny wymaga kontaktu z osobą, która robiła stronę trzy lata temu. Dodanie realizacji rozwala układ. Nowa usługa nie pasuje do żadnej istniejącej sekcji. Każdy kolejny element wymaga obejścia poprzedniego.",
        },
        {
          type: "p",
          text: "To często oznacza, że strona nie była projektowana z myślą o rozwoju. Dobra struktura nie musi przewidzieć przyszłości. Powinna jednak pozwalać firmie rosnąć bez konieczności przebudowy wszystkiego przy każdej zmianie.",
        },
        { type: "h", text: "7. Klienci ciągle pytają o rzeczy, które powinny być oczywiste" },
        {
          type: "p",
          text: "„Jak wygląda współpraca?”, „Ile to trwa?”, „Czy robicie też X?”, „Jak mogę zarezerwować termin?”. Jeżeli te same pytania wracają regularnie, strona prawdopodobnie nie odpowiada na nie wystarczająco jasno.",
        },
        {
          type: "p",
          text: "To cenna informacja. Najlepsze strony często powstają właśnie z analizy realnych rozmów z klientami. Bo dobra witryna powinna zdjąć część tej pracy z właściciela firmy.",
        },
        { type: "h", text: "8. Strona przestała wspierać pozycjonowanie" },
        {
          type: "p",
          text: "Z biegiem czasu zmienia się nie tylko design. Zmienia się sposób wyszukiwania usług, konkurencja i zawartość strony. Jeżeli serwis ma niewiele treści, niejasną strukturę, słabe metadane albo problemy techniczne, może być trudno rozwijać jego widoczność bez większych zmian.",
        },
        {
          type: "p",
          text: "Redesign nie powinien jednak oznaczać wyrzucenia wszystkiego. Jeżeli istniejące adresy i treści generują ruch, trzeba je zachować albo poprawnie przenieść.",
        },
        { type: "h", text: "9. Zamiast rozwijać stronę, ciągle ją obchodzisz" },
        {
          type: "p",
          text: "Tworzysz osobny Linktree. Osobny formularz. Osobny landing. PDF z ofertą. Katalog realizacji gdzie indziej. Każde z tych narzędzi może mieć sens.",
        },
        {
          type: "p",
          text: "Ale jeśli pojawiają się głównie dlatego, że główna strona nie potrafi już pomieścić obecnej działalności, problem jest głębszy.",
        },
        { type: "h", text: "Czy każdy z tych sygnałów oznacza pełny redesign?" },
        {
          type: "p",
          text: "Nie. Czasem wystarczy poprawić pierwszą sekcję, uprościć nawigację, przebudować formularz albo dopracować mobile.",
        },
        {
          type: "p",
          text: "Redesign ma sens wtedy, kiedy problemy zaczynają się ze sobą łączyć. Stara struktura. Nieaktualny wizerunek. Trudna edycja. Słaba wersja mobilna. Chaotyczna oferta. Wtedy poprawianie pojedynczych elementów może przypominać remontowanie pokoju w budynku, którego układ przestał mieć sens.",
        },
        { type: "h", text: "Najważniejsze pytanie brzmi więc nie:" },
        {
          type: "p",
          text: "„Czy moja strona jest stara?”. Tylko: „Czy nadal dobrze reprezentuje firmę, którą prowadzę dzisiaj?”. Jeżeli odpowiedź brzmi „nie”, być może firma rzeczywiście wyrosła ponad swoją stronę.",
        },
        {
          type: "cta",
          text: "Masz wrażenie, że Twoja strona została kilka kroków za firmą? Zobacz, jak podchodzę do redesignu i co warto zachować, zamiast przebudowywać wszystko od zera.",
          linkHref: "/pl/uslugi/redesign-strony",
          linkLabel: "Redesign strony",
        },
      ],
    },
    en: {
      slug: "business-outgrew-its-website",
      title: "9 signs your business has outgrown its website",
      excerpt:
        "Check if it's time for a redesign and how to spot that your current site is starting to hold you back.",
      metaTitle: "9 signs your business needs a website redesign",
      metaDescription:
        "Check these 9 signs that show your current website is no longer keeping up with your business and is starting to limit sales, image or growth.",
      readTime: "7 min",
      body: [
        {
          type: "p",
          text: "A website rarely grows old overnight. Much more often something else happens: the business moves forward and the site stays behind.",
        },
        {
          type: "p",
          text: "The offer evolves. Photos get better. Social media looks more professional. New clients, projects and services appear.",
        },
        {
          type: "p",
          text: "Only the site still tells the story of the company from a few years ago. And that is when it stops being just „a little old” and starts becoming a problem.",
        },
        { type: "h", text: "1. You hesitate to send someone a link to your own site" },
        {
          type: "p",
          text: "This is one of the simplest tests. A client asks: „Do you have a website?”, and your instinct is to send Instagram, a PDF, Behance or a few WhatsApp photos instead.",
        },
        {
          type: "p",
          text: "If the best way to present your business is anything except its own website, something is wrong. The site should be the place you confidently direct people to. Not a place you have to explain.",
        },
        { type: "h", text: "2. Your offer looks different today from when the site was built" },
        {
          type: "p",
          text: "Businesses change. A new service is added. An old one disappears. The customer group changes. The brand starts handling more expensive projects.",
        },
        {
          type: "p",
          text: "The problem starts when you keep forcing the new offer into a structure designed for the old business. The result? The menu becomes chaotic, sections are added randomly, and the most important things get lost between content that used to matter more.",
        },
        {
          type: "p",
          text: "This is often a sign that what you need is not another subpage, but a new information hierarchy.",
        },
        { type: "h", text: "3. Instagram looks better than the website" },
        {
          type: "p",
          text: "This is especially common in visual industries: detailing, gastronomy, beauty, interiors, real estate, fashion. The company invests in photos, reels and identity. The feed looks modern and premium.",
        },
        {
          type: "p",
          text: "A potential client clicks the link in the bio — and suddenly lands on a site that looks like a completely different brand. That disconnect can undermine the first impression.",
        },
        {
          type: "p",
          text: "Not because every site has to be spectacular. Because the level of presentation should match the level of the company.",
        },
        { type: "h", text: "4. The site works on mobile, but was not designed for mobile" },
        {
          type: "p",
          text: "These are not the same thing. A site can be technically „responsive” and still be hard to use. Buttons too small. Huge blocks of text. Poorly cropped photos. A form that requires constant scrolling. A menu where it is hard to find anything.",
        },
        {
          type: "p",
          text: "If the main version of the site was designed for desktop and mobile was just shrunk down, users notice it quickly. Today mobile is not an add-on. For many clients it will be the first and only contact with your site.",
        },
        { type: "h", text: "5. The client does not know what to do next" },
        {
          type: "p",
          text: "A good website should not end with „looks nice”. It should lead. To an enquiry. A booking. A purchase. Checking past work. Choosing a service.",
        },
        {
          type: "p",
          text: "If a user reads the offer but then has to look for the phone number or guess where to go next, the site is not doing its job. Usually the problem is not a missing button. The problem is a missing clear decision path.",
        },
        { type: "h", text: "6. Every change on the site is a fight" },
        {
          type: "p",
          text: "Changing a price means contacting the person who built the site three years ago. Adding a project breaks the layout. A new service does not fit any existing section. Every next element requires working around the previous one.",
        },
        {
          type: "p",
          text: "This usually means the site was not designed with growth in mind. A good structure does not have to predict the future. But it should let the company grow without rebuilding everything with every change.",
        },
        { type: "h", text: "7. Clients keep asking about things that should be obvious" },
        {
          type: "p",
          text: "„What does working with you look like?”, „How long does it take?”, „Do you also do X?”, „How can I book a date?”. If the same questions keep coming back, the site probably does not answer them clearly enough.",
        },
        {
          type: "p",
          text: "That is valuable information. The best sites often come from analysing real conversations with clients. Because a good website should take some of that work off the business owner.",
        },
        { type: "h", text: "8. The site no longer supports SEO" },
        {
          type: "p",
          text: "Over time, not only the design changes. The way people search for services changes, the competition changes and the content changes. If the site has little content, unclear structure, weak metadata or technical issues, it can be hard to grow its visibility without bigger changes.",
        },
        {
          type: "p",
          text: "A redesign should not mean throwing everything away though. If existing URLs and content generate traffic, they should be kept or properly redirected.",
        },
        { type: "h", text: "9. Instead of developing the site, you keep working around it" },
        {
          type: "p",
          text: "You create a separate Linktree. A separate form. A separate landing page. A PDF offer. A portfolio elsewhere. Each of these tools can make sense on its own.",
        },
        {
          type: "p",
          text: "But if they appear mainly because the main site can no longer hold the current business, the problem runs deeper.",
        },
        { type: "h", text: "Does every signal mean a full redesign?" },
        {
          type: "p",
          text: "No. Sometimes it is enough to fix the first section, simplify navigation, rebuild the form or polish mobile.",
        },
        {
          type: "p",
          text: "A redesign makes sense when the problems start connecting. Old structure. Outdated image. Difficult editing. Weak mobile version. Chaotic offer. Then fixing individual elements can feel like renovating a room in a building whose layout no longer makes sense.",
        },
        { type: "h", text: "So the most important question is not:" },
        {
          type: "p",
          text: "„Is my site old?”. It is: „Does it still represent the business I run today?”. If the answer is „no”, your company may indeed have outgrown its website.",
        },
        {
          type: "cta",
          text: "Feel like your website is a few steps behind your business? See how I approach redesigns and what is worth keeping instead of rebuilding everything from scratch.",
          linkHref: "/en/services/website-redesign",
          linkLabel: "Website redesign",
        },
      ],
    },
  },
  {
    id: "why-price-differs",
    category: "cost",
    date: "2026-08-11",
    featured: true,
    cover: "/blog/blog-cost-comparison.png",
    pl: {
      slug: "dlaczego-strony-maja-rozne-ceny",
      title: "Dlaczego jedna strona kosztuje 1500 zł, a druga 15 000 zł?",
      excerpt:
        "Rozkładamy na czynniki pierwsze, co wpływa na cenę strony i co naprawdę dostajesz.",
      metaTitle: "Dlaczego strona kosztuje 1500 zł albo 15 000 zł?",
      metaDescription:
        "Od czego naprawdę zależy cena strony internetowej? Zobacz, co odróżnia prostą realizację od rozbudowanego projektu i za co faktycznie płacisz.",
      readTime: "8 min",
      body: [
        {
          type: "p",
          text: "Na pierwszy rzut oka obie mogą wyglądać podobnie. Logo. Menu. Kilka sekcji. Formularz kontaktowy. Dlaczego więc jedna wycena wynosi 1500 zł, a druga 15 000 zł? Bo liczba ekranów to tylko część ceny. Największe różnice kryją się w tym, czego nie widać na pierwszy rzut oka: zakresie, procesie, liczbie decyzji, technologii i odpowiedzialności.",
        },
        { type: "h", text: "Najpierw ważna rzecz: drożej nie zawsze znaczy lepiej" },
        {
          type: "p",
          text: "Strona za 15 000 zł nie jest automatycznie dziesięć razy lepsza od strony za 1500 zł. Tak samo niska cena nie oznacza automatycznie złej realizacji. Właściwa cena zależy przede wszystkim od tego, co dana strona ma zrobić. Prosty landing dla jednej usługi nie potrzebuje procesu porównywalnego z budową platformy, sklepu czy rozbudowanego serwisu firmowego. Płacenie 15 000 zł za prostą wizytówkę może być równie bezsensowne jak próba zbudowania złożonego e-commerce za 1500 zł.",
        },
        { type: "h", text: "1500 zł może oznaczać dokładnie to, czego potrzebujesz" },
        {
          type: "p",
          text: "Wyobraźmy sobie małą firmę usługową. Ma gotowe logo. Gotowe teksty. Zdjęcia. Potrzebuje kilku sekcji: oferta, realizacje, o firmie, kontakt. Bez panelu klienta. Bez nietypowych integracji. Bez rozbudowanego systemu animacji. Taki projekt może być relatywnie szybki. Zakres jest jasny, liczba decyzji ograniczona, a technicznie nie trzeba budować całego ekosystemu. Wtedy niższa wycena jest całkowicie racjonalna.",
        },
        { type: "h", text: "Cena rośnie, kiedy rośnie liczba unikalnych decyzji" },
        {
          type: "p",
          text: "Pięć podstron nie zawsze oznacza pięć razy więcej pracy. Jeżeli każda korzysta z podobnego systemu komponentów, kolejne widoki można budować efektywnie. Inaczej wygląda projekt, w którym każda część serwisu ma: inną strukturę, inne interakcje, inne zachowanie i własny zestaw funkcji. Płacisz wtedy nie za „kolejną stronę”. Płacisz za kolejny problem do zaprojektowania i rozwiązania.",
        },
        { type: "h", text: "Customowy design wymaga więcej niż wyboru szablonu" },
        {
          type: "p",
          text: "Gotowy motyw może być świetnym rozwiązaniem. Ale narzuca pewne decyzje już na starcie. Jeżeli projekt powstaje od zera, ktoś musi zdecydować o: hierarchii treści, gridzie, typografii, rytmie sekcji, zachowaniu komponentów, wersji mobilnej, stanach interakcji i całym systemie wizualnym. To nie zawsze oznacza setki godzin. Oznacza natomiast więcej świadomych decyzji. A właśnie decyzje są dużą częścią wartości projektowania.",
        },
        { type: "h", text: "Treść potrafi zmienić wycenę bardziej niż design" },
        {
          type: "p",
          text: "Projekt z gotowymi, dobrze przygotowanymi materiałami idzie szybciej. Jeżeli wykonawca musi najpierw zrozumieć ofertę, uporządkować ją, rozpisać strukturę i pomóc stworzyć tekst, zakres zaczyna przypominać bardziej pracę strategiczną niż samo „zrobienie strony”. Dlatego dwa wizualnie podobne serwisy mogą mieć zupełnie inne budżety. Jeden był po prostu wdrożeniem. Drugi zaczął się od pustej kartki.",
        },
        { type: "h", text: "Animacje bywają tanie. I potrafią być bardzo drogie" },
        {
          type: "p",
          text: "Prosty fade-in elementu to chwila pracy. Scroll-controlled sequence, custom cursor, animowane przejścia pomiędzy widokami, WebGL czy złożone interakcje wymagają znacznie więcej. Trzeba je: zaprojektować, zaimplementować, sprawdzić na urządzeniach i upewnić się, że nie niszczą wydajności. Dlatego określenie: „chcemy trochę animacji” może oznaczać zarówno godzinę, jak i kilka dni pracy.",
        },
        { type: "h", text: "Integracje zmieniają stronę w system" },
        {
          type: "p",
          text: "Formularz wysyłający e-mail jest prosty. Formularz, który: kwalifikuje lead, zapisuje dane w CRM, wysyła automatyczną wiadomość, śledzi źródło UTM i uruchamia kolejne akcje — to już inna skala projektu. Podobnie ze sklepem. Karta produktu jest UI-em. Ale płatności, dostawy, podatki, stany magazynowe, warianty, maile transakcyjne i system zamówień tworzą cały proces. Dlatego koszt e-commerce może rosnąć bardzo szybko.",
        },
        { type: "h", text: "W cenie jest też odpowiedzialność" },
        {
          type: "p",
          text: "W małej realizacji często pracuje jedna osoba. W większym projekcie mogą pojawić się: strateg, designer, developer, copywriter, project manager, SEO specialist. Każda kolejna osoba zwiększa koszt. Ale zwiększa też dostępny zakres kompetencji i odpowiedzialności. Duża agencja będzie miała wyższe koszty niż freelancer. Nie oznacza to automatycznie, że zawsze będzie lepszym wyborem. Oznacza, że sprzedaje inny model współpracy.",
        },
        { type: "h", text: "Co więc naprawdę kupujesz?" },
        {
          type: "p",
          text: "Nie „stronę”. Kupujesz określony zakres rozwiązania. Prosta strona może potrzebować: gotowego contentu, kilku widoków, podstawowego UI i sprawnego wdrożenia. Rozbudowany projekt może wymagać: strategii, architektury informacji, customowego designu, wielu wariantów responsive, złożonego frontendu, integracji, analityki, migracji SEO i długiego procesu testów. Oba produkty nazywają się „stroną internetową”. To trochę jak porównanie kawalerki i hotelu, bo oba mają drzwi i okna.",
        },
        { type: "h", text: "Jak porównywać oferty?" },
        {
          type: "p",
          text: "Nie patrz wyłącznie na kwotę końcową. Sprawdź przede wszystkim: co dokładnie wchodzi w zakres. Czy dostajesz indywidualny projekt? Ile widoków? Czy mobile jest projektowany osobno? Czy wykonawca pomaga ze strukturą? Czy hosting i wdrożenie są w cenie? Co z poprawkami? Kto odpowiada za teksty? Co z integracjami? Czy kod i prawa do projektu zostają po Twojej stronie? Dopiero wtedy dwie wyceny można naprawdę porównać.",
        },
        {
          type: "cta",
          text: "Chcesz zobaczyć, ile może kosztować Twój konkretny projekt?",
          linkHref: "/pl/kontakt",
          linkLabel: "Napisz do mnie",
        },
      ],
    },
    en: {
      slug: "why-websites-have-different-prices",
      title: "Why one website costs €400 and another €4,000",
      excerpt:
        "A plain breakdown of what drives website pricing and what you actually get.",
      metaTitle: "Why does a website cost €400 or €4,000?",
      metaDescription:
        "What really determines the price of a website? See what separates a simple build from a complex project and what you are actually paying for.",
      readTime: "8 min",
      body: [
        {
          type: "p",
          text: "At first glance both can look similar. A logo. A menu. A few sections. A contact form. So why does one quote come in at €400 and another at €4,000? Because the number of screens is only part of the price. The biggest differences hide in what is not visible at first sight: scope, process, number of decisions, technology and responsibility.",
        },
        { type: "h", text: "First things first: more expensive does not always mean better" },
        {
          type: "p",
          text: "A €4,000 website is not automatically ten times better than a €400 one. Likewise, a low price does not automatically mean poor work. The right price depends mainly on what the site is supposed to do. A simple landing page for one service does not need a process comparable to building a platform, shop or extensive corporate site. Paying €4,000 for a simple business card can be just as senseless as trying to build complex e-commerce for €400.",
        },
        { type: "h", text: "€400 can mean exactly what you need" },
        {
          type: "p",
          text: "Imagine a small service business. It has a ready logo. Ready copy. Photos. It needs a few sections: offer, portfolio, about, contact. No client panel. No unusual integrations. No elaborate animation system. Such a project can be relatively quick. The scope is clear, the number of decisions is limited and technically there is no need to build an entire ecosystem. Then a lower quote is completely rational.",
        },
        { type: "h", text: "Price rises when the number of unique decisions rises" },
        {
          type: "p",
          text: "Five subpages do not always mean five times more work. If each uses a similar component system, subsequent views can be built efficiently. A different story is a project where every part of the site has: a different structure, different interactions, different behaviour and its own set of features. Then you are not paying for \"another page\". You are paying for another problem to design and solve.",
        },
        { type: "h", text: "Custom design takes more than choosing a template" },
        {
          type: "p",
          text: "A ready-made theme can be a great solution. But it imposes certain decisions from the start. If a project is built from scratch, someone has to decide on: content hierarchy, grid, typography, section rhythm, component behaviour, mobile version, interaction states and the whole visual system. This does not always mean hundreds of hours. But it does mean more conscious decisions. And decisions are a big part of design value.",
        },
        { type: "h", text: "Content can change a quote more than design" },
        {
          type: "p",
          text: "A project with ready, well-prepared materials moves faster. If the contractor first has to understand the offer, organise it, outline the structure and help create the copy, the scope starts to look more like strategic work than just \"making a website\". That is why two visually similar sites can have completely different budgets. One was simply an implementation. The other started from a blank sheet.",
        },
        { type: "h", text: "Animations can be cheap. And they can be very expensive" },
        {
          type: "p",
          text: "A simple element fade-in is a moment's work. A scroll-controlled sequence, custom cursor, animated transitions between views, WebGL or complex interactions require much more. They have to be: designed, implemented, tested on devices and checked that they do not hurt performance. That is why \"we want a bit of animation\" can mean either an hour or several days of work.",
        },
        { type: "h", text: "Integrations turn a site into a system" },
        {
          type: "p",
          text: "A form that sends an email is simple. A form that: qualifies the lead, saves data in a CRM, sends an automatic message, tracks the UTM source and triggers further actions is a different scale of project. The same with a shop. A product card is UI. But payments, delivery, taxes, stock levels, variants, transactional emails and the order system create an entire process. That is why e-commerce costs can grow very quickly.",
        },
        { type: "h", text: "Responsibility is also part of the price" },
        {
          type: "p",
          text: "A small build is often done by one person. A larger project may involve: a strategist, designer, developer, copywriter, project manager, SEO specialist. Each extra person increases the cost. But it also increases the available competence and responsibility. A big agency will have higher costs than a freelancer. That does not automatically make it the better choice. It means it sells a different collaboration model.",
        },
        { type: "h", text: "So what are you really buying?" },
        {
          type: "p",
          text: "Not a \"website\". You are buying a specific solution scope. A simple site may need: ready content, a few views, basic UI and a smooth launch. A complex project may require: strategy, information architecture, custom design, many responsive variants, complex frontend, integrations, analytics, SEO migration and a long testing process. Both products are called \"websites\". It is a bit like comparing a studio flat and a hotel because both have doors and windows.",
        },
        { type: "h", text: "How to compare quotes" },
        {
          type: "p",
          text: "Do not look only at the final amount. Check first: what exactly is in scope. Do you get an individual design? How many views? Is mobile designed separately? Does the contractor help with structure? Are hosting and launch included? What about revisions? Who is responsible for copy? What about integrations? Do the code and project rights stay with you? Only then can two quotes really be compared.",
        },
        {
          type: "cta",
          text: "Want to see what your specific project might cost?",
          linkHref: "/en/contact",
          linkLabel: "Get in touch",
        },
      ],
    },
  },
  {
    id: "traffic-no-enquiries",
    category: "converting",
    date: "2026-08-04",
    featured: true,
    cover: "/blog/blog-traffic-no-enquiries-v2.png",
    pl: {
      slug: "ruch-na-stronie-ale-brak-zapytan",
      title: "Masz ruch na stronie, ale zero zapytań? 8 rzeczy do sprawdzenia",
      excerpt:
        "Duże odwiedziny nie zawsze oznaczają efekty. Zobacz, co może blokować konwersję.",
      metaTitle: "Ruch na stronie, ale brak klientów? 8 rzeczy do sprawdzenia",
      metaDescription:
        "Masz odwiedziny, ale nikt nie wysyła zapytań? Sprawdź 8 najczęstszych problemów, które mogą blokować konwersję Twojej strony.",
      readTime: "7 min",
      body: [
        {
          type: "p",
          text: "1000 odwiedzin wygląda dobrze w panelu analytics. Jeżeli jednak żadna z tych osób nie pisze, nie dzwoni i nie kupuje, sama liczba niewiele znaczy. Ruch jest środkiem. Nie celem. Zanim więc wydasz więcej na reklamę albo SEO, warto sprawdzić, co dzieje się z ludźmi, których już udało Ci się sprowadzić na stronę.",
        },
        { type: "h", text: "1. Na stronę mogą trafiać niewłaściwi ludzie" },
        {
          type: "p",
          text: "Więcej ruchu nie zawsze oznacza lepszy ruch. Artykuł może zdobywać setki wejść na szeroką frazę informacyjną, mimo że osoby te nie mają żadnego zamiaru kupować. Reklama może być źle targetowana. Post viralowy może sprowadzić ciekawskich, a nie klientów. Dlatego pierwsze pytanie brzmi: skąd właściwie przychodzą użytkownicy? Google? Reklamy? Instagram? Polecenia? I czego szukali, zanim trafili na stronę? Jeżeli intencja użytkownika nie pasuje do oferty, nawet najlepszy landing nie zamieni wszystkich w klientów.",
        },
        { type: "h", text: "2. Pierwszy ekran nie mówi jasno, dlaczego warto zostać" },
        {
          type: "p",
          text: "Użytkownik nie czyta strony jak książki. Najpierw szybko próbuje odpowiedzieć sobie na trzy pytania: „Gdzie jestem?”, „Czy to jest dla mnie?”, „Dlaczego powinienem czytać dalej?”. Jeżeli pierwsza sekcja odpowiada: „Tworzymy rozwiązania przyszłości dla nowoczesnych biznesów”, to odpowiedź może być estetyczna, ale nadal niewiele mówi. Dobry hero nie musi opisywać całej firmy. Powinien jednak dawać wystarczający kontekst, żeby właściwa osoba pomyślała: „OK, tego właśnie szukam.”",
        },
        { type: "h", text: "3. Oferta może być zbyt szeroka albo chaotyczna" },
        {
          type: "p",
          text: "Im więcej opcji, tym trudniej wybrać. Firma oferuje 17 usług. Każda opisana podobnie. Brak informacji, od czego zacząć. Użytkownik nie chce analizować Twojej organizacji. Chce rozwiązać własny problem. Dlatego dobry serwis powinien grupować ofertę w sposób, który pomaga podjąć decyzję. Nie zawsze trzeba usuwać usługi. Czasem wystarczy zmienić hierarchię.",
        },
        { type: "h", text: "4. Brakuje powodów, żeby Ci zaufać" },
        {
          type: "p",
          text: "Możesz pisać: „wysoka jakość”, „indywidualne podejście”, „profesjonalna obsługa”. Problem w tym, że podobne zdania może napisać każdy. Zaufanie budują dowody. Realizacje. Konkretny proces. Zdjęcia. Opinie. Ludzie stojący za firmą. Przykłady efektów. Jasne warunki. Jeżeli użytkownik ma zostawić dane, zadzwonić albo zapłacić, musi czuć, że po drugiej stronie znajduje się prawdziwy, wiarygodny biznes.",
        },
        { type: "h", text: "5. CTA jest niewidoczne albo nie wiadomo, co się po nim wydarzy" },
        {
          type: "p",
          text: "„Dowiedz się więcej”. „Sprawdź”. „Kliknij tutaj”. Takie przyciski nie mówią użytkownikowi zbyt wiele. Lepsze wezwanie do działania odpowiada na pytanie: „Co dostanę po kliknięciu?”. „Poproś o wycenę.” „Zarezerwuj konsultację.” „Sprawdź dostępne terminy.” „Zobacz realizacje.” Dodatkowo CTA musi pojawiać się w odpowiednim momencie. Nie tylko raz na końcu strony, do którego połowa odwiedzających nigdy nie dotrze.",
        },
        { type: "h", text: "6. Formularz stawia zbyt duży opór" },
        {
          type: "p",
          text: "Im większa decyzja, tym więcej informacji można sensownie poprosić. Ale jeżeli pierwszy kontakt wymaga: imienia, nazwiska, firmy, telefonu, e-maila, budżetu, terminu, liczby pracowników i ośmiu dodatkowych pól — część osób po prostu odpuści. Pierwszy formularz nie musi zbierać całej dokumentacji projektu. Ma rozpocząć rozmowę. Każde dodatkowe pole powinno mieć konkretny powód istnienia.",
        },
        { type: "h", text: "7. Mobile psuje doświadczenie, którego desktop nie ujawnia" },
        {
          type: "p",
          text: "Możesz oglądać własną stronę codziennie na 27-calowym monitorze i nie zauważyć problemu, który dotyczy większości odwiedzających. Na telefonie: CTA może być poza ekranem, tekst za mały, formularz niewygodny, menu przeładowane, a zdjęcia ciężkie. Dlatego analizując brak zapytań, nie pytaj tylko: „Czy strona działa?”. Sprawdź: jak naprawdę korzysta się z niej jedną ręką na telefonie.",
        },
        { type: "h", text: "8. Możliwe, że po prostu źle mierzysz" },
        {
          type: "p",
          text: "To szczególnie częste. Panel pokazuje ruch. Ale nie śledzi: kliknięcia telefonu, wysłania formularza, mailto, otwarcia projektu, rezerwacji albo przejścia do zewnętrznej platformy. W efekcie strona może generować jakąś aktywność, której nie widzisz. Albo odwrotnie: liczysz kliknięcie „Wyślij” jako konwersję nawet wtedy, gdy formularz zwrócił błąd. Dobra analityka powinna odpowiadać na konkretne pytanie: co użytkownik zrobił po wejściu?",
        },
        { type: "h", text: "Od czego zacząć?" },
        {
          type: "p",
          text: "Nie zmieniaj od razu całej strony. Najpierw prześledź drogę użytkownika: źródło ruchu → pierwsza strona → oferta → CTA → formularz → wysłanie. Znajdź miejsce, w którym odpada najwięcej osób. Jeżeli ruch jest niewłaściwy, popraw marketing. Jeżeli użytkownicy wychodzą od razu, sprawdź komunikat i jakość pierwszego ekranu. Jeżeli czytają ofertę, ale nie klikają CTA, problem może leżeć w wartości albo ścieżce. Jeżeli otwierają formularz i go nie kończą, uprość kontakt. Dopiero potem inwestuj w więcej ruchu. Bo zwiększanie liczby odwiedzin strony, która nie konwertuje, przypomina dolewanie większej ilości wody do dziurawego wiadra.",
        },
        {
          type: "cta",
          text: "Masz stronę, która generuje ruch, ale nie daje zapytań? Nie zawsze potrzebuje pełnego redesignu. Czasem wystarczy znaleźć miejsce, w którym użytkownicy odpadają, i poprawić właśnie ten fragment.",
          linkHref: "/pl/kontakt",
          linkLabel: "Napisz do mnie",
        },
      ],
    },
    en: {
      slug: "traffic-but-no-clients",
      title: "Traffic but no clients? 8 things to check",
      excerpt:
        "Lots of visits do not always mean results. See what might be blocking conversion.",
      metaTitle: "Traffic on your site but no clients? 8 things to check",
      metaDescription:
        "You have visits, but no one is sending enquiries? Check the 8 most common problems that can block your site's conversion.",
      readTime: "7 min",
      body: [
        {
          type: "p",
          text: "A thousand visits looks good in the analytics panel. But if none of those people write, call or buy, the number alone means little. Traffic is a means, not a goal. So before you spend more on ads or SEO, it is worth checking what happens to the people you have already brought to the site.",
        },
        { type: "h", text: "1. The wrong people may be landing on the site" },
        {
          type: "p",
          text: "More traffic is not always better traffic. An article may get hundreds of visits from a broad informational phrase even though those people have no intention to buy. An ad may be poorly targeted. A viral post may bring curious onlookers, not clients. So the first question is: where do users actually come from? Google? Ads? Instagram? Referrals? And what were they looking for before they landed on the site? If the user's intent does not match the offer, even the best landing page will not convert everyone.",
        },
        { type: "h", text: "2. The first screen does not clearly say why it is worth staying" },
        {
          type: "p",
          text: "Users do not read a website like a book. First they quickly try to answer three questions: \"Where am I?\", \"Is this for me?\", \"Why should I keep reading?\". If the first section answers: \"We create future-proof solutions for modern businesses\", the answer may look elegant but still say very little. A good hero does not have to describe the whole company. But it should give enough context for the right person to think: \"OK, this is exactly what I am looking for.\"",
        },
        { type: "h", text: "3. The offer may be too broad or chaotic" },
        {
          type: "p",
          text: "The more options, the harder it is to choose. A company offers 17 services. Each described similarly. No information on where to start. The user does not want to analyse your organisation. They want to solve their own problem. That is why a good site should group the offer in a way that helps make a decision. You do not always have to remove services. Sometimes it is enough to change the hierarchy.",
        },
        { type: "h", text: "4. There are no reasons to trust you" },
        {
          type: "p",
          text: "You can write: \"high quality\", \"individual approach\", \"professional service\". The problem is that anyone can write similar sentences. Trust is built with evidence. Case studies. A concrete process. Photos. Reviews. The people behind the company. Examples of results. Clear terms. If the user is to leave their data, call or pay, they must feel that a real, credible business is on the other side.",
        },
        { type: "h", text: "5. The CTA is invisible or it is unclear what happens after clicking" },
        {
          type: "p",
          text: "\"Learn more\". \"Check it\". \"Click here\". Such buttons do not tell the user very much. A better call to action answers the question: \"What will I get after clicking?\". \"Request a quote.\" \"Book a consultation.\" \"Check available dates.\" \"See case studies.\" The CTA also has to appear at the right moment. Not just once at the bottom of the page, which half of visitors never reach.",
        },
        { type: "h", text: "6. The form creates too much friction" },
        {
          type: "p",
          text: "The bigger the decision, the more information you can reasonably ask for. But if the first contact requires: first name, last name, company, phone, email, budget, deadline, number of employees and eight extra fields — some people will simply give up. The first form does not have to collect the whole project documentation. It should start a conversation. Every extra field should have a concrete reason to exist.",
        },
        { type: "h", text: "7. Mobile ruins an experience desktop does not reveal" },
        {
          type: "p",
          text: "You can look at your own site every day on a 27-inch monitor and not notice a problem that affects most visitors. On a phone: the CTA may be off-screen, the text too small, the form awkward, the menu overloaded and the images heavy. So when analysing a lack of enquiries, do not just ask: \"Does the site work?\". Check what it is really like to use it one-handed on a phone.",
        },
        { type: "h", text: "8. You may simply be measuring wrong" },
        {
          type: "p",
          text: "This is especially common. The panel shows traffic. But it does not track: phone clicks, form submissions, mailto opens, project opens, bookings or moves to an external platform. As a result, the site may be generating activity you cannot see. Or the opposite: you count a \"Send\" click as a conversion even when the form returned an error. Good analytics should answer a concrete question: what did the user do after landing?",
        },
        { type: "h", text: "Where to start" },
        {
          type: "p",
          text: "Do not change the whole site at once. First trace the user journey: traffic source → first page → offer → CTA → form → submission. Find the place where the most people drop off. If the traffic is wrong, fix the marketing. If users leave immediately, check the message and quality of the first screen. If they read the offer but do not click the CTA, the problem may be value or path. If they open the form but do not complete it, simplify contact. Only then invest in more traffic. Because increasing visits to a site that does not convert is like pouring more water into a leaky bucket.",
        },
        {
          type: "cta",
          text: "Do you have a site that gets traffic but no enquiries? It does not always need a full redesign. Sometimes it is enough to find where users drop off and fix exactly that part.",
          linkHref: "/en/contact",
          linkLabel: "Get in touch",
        },
      ],
    },
  },
];

export function blogPostsByCategory(key: BlogCategoryKey) {
  return BLOG_POSTS.filter((p) => p.category === key);
}

export function findBlogPost(lang: Lang, slug: string) {
  return BLOG_POSTS.find((p) => p[lang].slug === slug);
}

export function formatBlogDate(date: string, lang: Lang) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
