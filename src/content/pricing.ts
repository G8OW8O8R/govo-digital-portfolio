import type { Lang } from "@/lib/i18n-routes";

export type PricingTier = {
  name: string;
  range: string;
  timeline: string;
  summary: string;
  includes: string[];
};

export type PricingContent = {
  kicker: string;
  headline: string;
  headlineAccent: string;
  intro: string;
  note: string;
  tiersTitle: string;
  tiers: PricingTier[];
  factorsTitle: string;
  factors: { title: string; text: string }[];
  includedTitle: string;
  included: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  ctaSecondary: string;
  timelineLabel: string;
};

export const PRICING: Record<Lang, PricingContent> = {
  pl: {
    kicker: "Cennik",
    headline: "Ile kosztuje strona",
    headlineAccent: "internetowa?",
    intro:
      "Nie sprzedaję szablonów, więc nie mam jednej ceny za wszystko. Poniżej realne widełki dla czterech najczęstszych typów projektu — po krótkiej rozmowie dostajesz konkretną wycenę i termin.",
    note: "Widełki dotyczą projektów kodowanych od zera. Ostateczna cena zależy od liczby podstron, zakresu animacji i integracji.",
    tiersTitle: "Widełki cenowe",
    timelineLabel: "Czas realizacji",
    tiers: [
      {
        name: "Strona firmowa / usługowa",
        range: "od 1 500 zł",
        timeline: "5–10 dni",
        summary:
          "Strona wizytówka lub strona firmowa z kilkoma podstronami: oferta, o firmie, realizacje, kontakt.",
        includes: [
          "Projekt układu i hierarchii treści",
          "3–7 podstron kodowanych od zera",
          "Wersja mobilna i tabletowa",
          "Formularz kontaktowy",
          "SEO techniczne i wdrożenie",
        ],
      },
      {
        name: "Landing page",
        range: "od 800 zł",
        timeline: "2–5 dni",
        summary:
          "Jedna strona pod kampanię, produkt lub zapisy — zbudowana wokół jednego wezwania do działania.",
        includes: [
          "Sekwencja sekcji prowadząca do konwersji",
          "Formularz lub integracja z narzędziem do leadów",
          "Podgląd linków w social mediach",
          "Parametry kampanii (UTM)",
          "Wdrożenie na Twojej domenie",
        ],
      },
      {
        name: "Sklep internetowy",
        range: "od 2 800 zł",
        timeline: "2–4 tygodni",
        summary:
          "Frontend sklepu: karty produktów, listy i filtrowanie, koszyk oraz ścieżka do zamówienia.",
        includes: [
          "Karty produktów i listy kategorii",
          "Koszyk i przejście do zamówienia",
          "System komponentów pod rozbudowę asortymentu",
          "Optymalizacja obrazów i wydajności",
          "Współpraca z Twoją platformą sklepową",
        ],
      },
      {
        name: "Redesign istniejącej strony",
        range: "od 1 200 zł",
        timeline: "3–7 dni",
        summary:
          "Nowa oprawa wizualna i szybszy frontend bez utraty treści oraz adresów, które już przynoszą ruch.",
        includes: [
          "Przegląd obecnej strony i wąskich gardeł",
          "Nowa oprawa wizualna",
          "Przebudowa frontendu i responsywność",
          "Poprawa szybkości ładowania",
          "Zachowanie istniejących adresów URL",
        ],
      },
    ],
    factorsTitle: "Co wpływa na cenę",
    factors: [
      {
        title: "Liczba podstron",
        text: "Każda podstrona z własnym układem to dodatkowy projekt i kod. Strona wizytówka będzie zawsze tańsza niż serwis z rozbudowaną ofertą.",
      },
      {
        title: "Zakres animacji",
        text: "Proste przejścia są w cenie. Bardziej złożone efekty i animacje sterowane przewijaniem to dodatkowy czas pracy.",
      },
      {
        title: "Treści i zdjęcia",
        text: "Jeśli masz gotowe teksty i materiały, projekt idzie szybciej. Pomagam z układem treści, ale nie prowadzę sesji zdjęciowych.",
      },
      {
        title: "Integracje",
        text: "Płatności, systemy rezerwacji, newsletter, panel do edycji treści — każda integracja zwiększa zakres.",
      },
      {
        title: "Termin",
        text: "Standardowy harmonogram jest w cenie. Realizacja ekspresowa jest możliwa, ale wpływa na wycenę.",
      },
    ],
    includedTitle: "Co dostajesz w każdej wycenie",
    included: [
      "Kod pisany od zera w React, TypeScript i Tailwind CSS",
      "Pełną responsywność: telefon, tablet, desktop",
      "Optymalizację szybkości ładowania",
      "SEO techniczne: metadane, dane strukturalne, sitemap, robots",
      "Wdrożenie na hostingu i podłączenie domeny",
      "Poprawki po publikacji w ustalonym zakresie",
    ],
    faqTitle: "Częste pytania o cenę",
    faq: [
      {
        q: "Ile kosztuje strona internetowa dla małej firmy?",
        a: "Najczęściej od 1 500 zł za stronę firmową z kilkoma podstronami. Prostsza strona wizytówka może być tańsza, rozbudowany serwis z wieloma podstronami — droższy.",
      },
      {
        q: "Czy podajesz cenę przed rozpoczęciem pracy?",
        a: "Tak. Po rozmowie i ustaleniu zakresu dostajesz konkretną kwotę oraz termin. Cena nie zmienia się w trakcie, dopóki nie zmieni się zakres.",
      },
      {
        q: "Jak wygląda płatność?",
        a: "Sposób rozliczenia ustalam przed rozpoczęciem projektu. Przy mniejszych realizacjach możliwa jest płatność po akceptacji gotowej strony, a większe projekty mogę rozliczać etapowo. Dla obu stron możliwe jest również bezpieczne rozliczenie przez Useme z fakturą VAT.",
      },
      {
        q: "Czy są koszty miesięczne?",
        a: "Sama strona nie generuje abonamentu u mnie. Płacisz za domenę i hosting bezpośrednio u dostawcy — przy prostych stronach to zwykle kilkadziesiąt złotych rocznie za domenę i darmowy hosting.",
      },
      {
        q: "Czy taniej jest zrobić stronę na WordPressie?",
        a: "Na starcie czasem tak, ale szablony z wtyczkami zwykle działają wolniej i trudniej je później dopasować. Ja koduję od zera, więc strona jest lżejsza i w pełni pod Twoją ofertę.",
      },
      {
        q: "Czy wycena obejmuje pozycjonowanie?",
        a: "W cenie jest SEO techniczne: poprawne metadane, dane strukturalne, sitemap i szybkość. Długofalowe pozycjonowanie i tworzenie treści to osobny temat, o którym chętnie doradzę.",
      },
    ],
    ctaTitle: "Chcesz konkretną wycenę?",
    ctaText:
      "Napisz w kilku zdaniach, co ma robić strona i ile mniej więcej podstron potrzebujesz. Odpowiadam zwykle w ciągu 24 godzin.",
    ctaButton: "Poproś o wycenę",
    ctaSecondary: "Zobacz usługi",
  },
  en: {
    kicker: "Pricing",
    headline: "How much does a website",
    headlineAccent: "cost?",
    intro:
      "I don't sell templates, so there is no single price for everything. Below are honest ranges for the four most common project types — after a short call you get a fixed quote and a timeline.",
    note: "Ranges apply to projects coded from scratch. The final price depends on the number of pages, the amount of motion and the integrations.",
    tiersTitle: "Price ranges",
    timelineLabel: "Timeline",
    tiers: [
      {
        name: "Business / service website",
        range: "from €350",
        timeline: "5–10 days",
        summary:
          "A one-pager or a multi-page business site: services, about, work, contact.",
        includes: [
          "Layout and content hierarchy design",
          "3–7 pages coded from scratch",
          "Mobile and tablet layouts",
          "Contact form",
          "Technical SEO and deployment",
        ],
      },
      {
        name: "Landing page",
        range: "from €180",
        timeline: "2–5 days",
        summary:
          "One page for a campaign, product or signup — built around a single call to action.",
        includes: [
          "Section sequence leading to one conversion",
          "Form or lead-tool integration",
          "Social link previews",
          "Campaign parameters (UTM)",
          "Deployment on your domain",
        ],
      },
      {
        name: "Online store",
        range: "from €650",
        timeline: "2–4 weeks",
        summary:
          "Storefront frontend: product pages, listings and filtering, cart and the path to an order.",
        includes: [
          "Product pages and category listings",
          "Cart and order flow",
          "Component system that scales with your catalogue",
          "Image and performance optimisation",
          "Work alongside your commerce platform",
        ],
      },
      {
        name: "Redesign of an existing site",
        range: "from €280",
        timeline: "3–7 days",
        summary:
          "A new visual layer and a faster frontend without losing the content and URLs that already bring traffic.",
        includes: [
          "Review of the current site and its bottlenecks",
          "New visual direction",
          "Frontend rebuild and responsiveness",
          "Loading speed improvements",
          "Existing URLs preserved",
        ],
      },
    ],
    factorsTitle: "What changes the price",
    factors: [
      {
        title: "Number of pages",
        text: "Every page with its own layout is extra design and code. A one-pager will always cost less than a full multi-page site.",
      },
      {
        title: "Amount of motion",
        text: "Simple transitions are included. Complex, scroll-driven effects add build time.",
      },
      {
        title: "Copy and imagery",
        text: "If your text and photos are ready, the project moves faster. I help with structure, but I don't run photo shoots.",
      },
      {
        title: "Integrations",
        text: "Payments, booking systems, newsletters, a content-editing panel — each integration widens the scope.",
      },
      {
        title: "Deadline",
        text: "A standard schedule is included. Rush delivery is possible but affects the quote.",
      },
    ],
    includedTitle: "Included in every quote",
    included: [
      "Code written from scratch in React, TypeScript and Tailwind CSS",
      "Full responsiveness: phone, tablet, desktop",
      "Loading speed optimisation",
      "Technical SEO: metadata, structured data, sitemap, robots",
      "Deployment and domain setup",
      "Post-launch fixes within an agreed scope",
    ],
    faqTitle: "Pricing questions",
    faq: [
      {
        q: "How much does a website for a small business cost?",
        a: "Usually from around €350 for a business site with a handful of pages. A simple one-pager can cost less; a large multi-page site costs more.",
      },
      {
        q: "Do I get a price before work starts?",
        a: "Yes. After a call and an agreed scope you get a fixed amount and a timeline. The price only changes if the scope changes.",
      },
      {
        q: "How does payment work?",
        a: "Payment terms are agreed before the project starts. Smaller projects can be paid in full after approval, while larger ones can be split into milestones. For both parties, secure settlement through Useme with a VAT invoice is also available.",
      },
      {
        q: "Are there monthly fees?",
        a: "The site itself has no subscription with me. You pay your domain and hosting directly to the provider — for simple sites that is usually a small annual domain fee and free hosting.",
      },
      {
        q: "Isn't WordPress cheaper?",
        a: "Sometimes upfront, but plugin-heavy templates tend to load slower and are harder to adapt later. I code from scratch, so the site stays lighter and fits your offer exactly.",
      },
      {
        q: "Does the quote include SEO?",
        a: "Technical SEO is included: correct metadata, structured data, sitemap and speed. Ongoing SEO and content work is a separate topic I'm happy to advise on.",
      },
    ],
    ctaTitle: "Want a specific quote?",
    ctaText:
      "Tell me in a few lines what the site should do and roughly how many pages you need. I usually reply within 24 hours.",
    ctaButton: "Request a quote",
    ctaSecondary: "See services",
  },
};
