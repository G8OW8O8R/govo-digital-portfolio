import type { Lang } from "@/lib/i18n-routes";

export type ServiceKey = "website" | "landing" | "ecommerce" | "redesign";

export const SERVICE_KEYS: ServiceKey[] = ["website", "landing", "ecommerce", "redesign"];

export const SERVICE_SLUGS: Record<ServiceKey, Record<Lang, string>> = {
  website: { pl: "strony-internetowe", en: "website-development" },
  landing: { pl: "landing-page", en: "landing-pages" },
  ecommerce: { pl: "sklep-internetowy", en: "ecommerce-development" },
  redesign: { pl: "redesign-strony", en: "website-redesign" },
};

export type ServiceContent = {
  /** Short label used in cards and navigation */
  label: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  headlineAccent: string;
  intro: string;
  cardSummary: string;
  deliverables: string[];
  forWho: string[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Record<ServiceKey, Record<Lang, ServiceContent>> = {
  website: {
    pl: {
      label: "Strony internetowe",
      metaTitle: "Tworzenie stron internetowych — GOVO DIGITAL",
      metaDescription:
        "Tworzenie stron internetowych dla firm i usług: szybkie, responsywne strony w React i Tailwind, z animacjami i dbałością o wydajność.",
      headline: "Tworzenie stron internetowych dla firm i",
      headlineAccent: "usług.",
      intro:
        "Projektuję i koduję strony firmowe od zera — bez szablonów i bez ciężkich wtyczek. Dostajesz stronę, która szybko się ładuje, dobrze wygląda na telefonie i realnie prowadzi do kontaktu.",
      cardSummary: "Strona firmowa lub usługowa napisana od zera, z animacjami i wysoką wydajnością.",
      deliverables: [
        "Projekt układu i hierarchii treści pod Twoją ofertę",
        "Kod w React, TypeScript i Tailwind CSS — bez gotowych motywów",
        "Pełna responsywność: telefon, tablet, desktop",
        "Płynne animacje i przejścia, zawsze z myślą o wydajności",
        "Podstawy SEO technicznego: metadane, dane strukturalne, sitemap, robots",
        "Formularz kontaktowy i wdrożenie na hostingu",
      ],
      forWho: [
        "Firmy usługowe, które chcą pierwszej porządnej strony",
        "Specjaliści i małe zespoły zamiast profilu na social mediach",
        "Marki, którym zależy na jakości i płynności, nie na kreatorze",
      ],
      faq: [
        {
          q: "Ile trwa realizacja strony firmowej?",
          a: "Zależy od zakresu i tempa dostarczania treści. Zawsze zaczynam od rozmowy i dopiero po niej podaję realny termin oraz kolejność etapów.",
        },
        {
          q: "Czy przygotujesz też treści i zdjęcia?",
          a: "Pracuję na Twoich materiałach, a przy pisaniu treści pomagam: podpowiadam strukturę sekcji i to, co warto podkreślić na każdej podstronie.",
        },
        {
          q: "Czy będę mógł samodzielnie edytować stronę?",
          a: "Tak, jeśli tego potrzebujesz — omawiamy to na początku i wtedy dobieram rozwiązanie do edycji treści.",
        },
      ],
    },
    en: {
      label: "Website development",
      metaTitle: "Website development for businesses — GOVO DIGITAL",
      metaDescription:
        "Custom website development in React and Tailwind: fast, responsive business websites with smooth motion and careful performance work.",
      headline: "Custom websites for businesses and",
      headlineAccent: "services.",
      intro:
        "I design and build business websites from scratch — no templates, no heavy plugin stacks. You get a site that loads fast, looks right on mobile and actually leads visitors to contact you.",
      cardSummary: "A business or service website coded from scratch, with motion and strong performance.",
      deliverables: [
        "Layout and content hierarchy designed around your offer",
        "Built with React, TypeScript and Tailwind CSS — no off-the-shelf themes",
        "Fully responsive across phone, tablet and desktop",
        "Smooth motion and transitions, always budgeted for performance",
        "Technical SEO basics: metadata, structured data, sitemap, robots",
        "Contact form and deployment to your hosting",
      ],
      forWho: [
        "Service businesses that need their first solid website",
        "Specialists and small teams moving beyond a social profile",
        "Brands that care about craft and smoothness, not a page builder",
      ],
      faq: [
        {
          q: "How long does a business website take?",
          a: "It depends on scope and how quickly content arrives. I start with a short call and give you a realistic timeline and stage order after it.",
        },
        {
          q: "Do you write the copy and provide photos?",
          a: "I build on your materials and help with the writing: I suggest the section structure and what each page should emphasise.",
        },
        {
          q: "Will I be able to edit the site myself?",
          a: "Yes if you need that — we agree on it upfront and I pick a content-editing setup that fits.",
        },
      ],
    },
  },
  landing: {
    pl: {
      label: "Landing page",
      metaTitle: "Landing page — projektowanie i wdrożenie | GOVO DIGITAL",
      metaDescription:
        "Landing page pod kampanię, produkt lub usługę: jedna strona skupiona na konwersji, szybka, responsywna i gotowa pod reklamy.",
      headline: "Landing page skupiony na jednym",
      headlineAccent: "celu.",
      intro:
        "Jedna strona, jeden cel: zapis, zapytanie albo sprzedaż. Buduję landing pod konkretną kampanię lub ofertę, z czytelną sekwencją sekcji i mocnym wezwaniem do działania.",
      cardSummary: "Jedna strona pod kampanię lub ofertę, zbudowana wokół konkretnej konwersji.",
      deliverables: [
        "Struktura sekcji prowadząca do jednego wezwania do działania",
        "Projekt i kod dopasowany do kampanii lub premiery produktu",
        "Szybkie ładowanie i lekkie animacje wspierające czytanie",
        "Formularz lub integracja z Twoim narzędziem do leadów",
        "Poprawne metadane i podglądy linków w social mediach",
        "Wdrożenie oraz podłączenie parametrów kampanii (UTM)",
      ],
      forWho: [
        "Kampanie reklamowe, które potrzebują dedykowanej strony",
        "Premiery produktu, usługi lub zapisów na listę",
        "Testowanie nowej oferty przed budową pełnej strony",
      ],
      faq: [
        {
          q: "Czym landing page różni się od strony firmowej?",
          a: "Landing skupia się na jednej decyzji odwiedzającego i nie rozprasza go nawigacją. Strona firmowa opowiada o całej działalności i ma wiele podstron.",
        },
        {
          q: "Czy landing będzie działał z reklamami?",
          a: "Tak — przygotowuję stronę tak, aby dało się mierzyć ruch z kampanii i rozpoznać, z jakiego źródła przyszedł.",
        },
      ],
    },
    en: {
      label: "Landing pages",
      metaTitle: "Landing page design and development — GOVO DIGITAL",
      metaDescription:
        "Landing pages built around a single conversion: fast, responsive, campaign-ready pages for products, services and launches.",
      headline: "A landing page built around one",
      headlineAccent: "goal.",
      intro:
        "One page, one goal: a signup, an enquiry or a sale. I build landing pages for a specific campaign or offer, with a clear section sequence and one strong call to action.",
      cardSummary: "A single campaign or offer page built around one specific conversion.",
      deliverables: [
        "Section structure leading to one call to action",
        "Design and code matched to your campaign or product launch",
        "Fast loading with light motion that supports reading",
        "Form or integration with your lead tool",
        "Correct metadata and social link previews",
        "Deployment and campaign parameter (UTM) setup",
      ],
      forWho: [
        "Ad campaigns that need a dedicated page",
        "Product, service or waitlist launches",
        "Testing a new offer before building a full website",
      ],
      faq: [
        {
          q: "How is a landing page different from a website?",
          a: "A landing page focuses on one decision and removes distractions like full navigation. A website covers your whole business across several pages.",
        },
        {
          q: "Will it work with paid ads?",
          a: "Yes — I set the page up so campaign traffic can be measured and the source of each visit is recognisable.",
        },
      ],
    },
  },
  ecommerce: {
    pl: {
      label: "Sklep internetowy",
      metaTitle: "Sklep internetowy — wdrożenie i frontend | GOVO DIGITAL",
      metaDescription:
        "Sklep internetowy i frontend e-commerce: karty produktów, koszyk i ścieżka zakupu dopracowane pod konwersję i szybkość.",
      headline: "Sklep internetowy dopracowany na",
      headlineAccent: "każdym kroku.",
      intro:
        "Zajmuję się warstwą, którą widzi klient: prezentacją produktu, listami i filtrowaniem, koszykiem oraz całą ścieżką do zamówienia. Pracowałem przy sklepach z perfumami, kosmetykami i piekarnią rzemieślniczą.",
      cardSummary: "Frontend sklepu: karty produktów, listy, koszyk i ścieżka zakupowa.",
      deliverables: [
        "Karty produktów z czytelną prezentacją i zdjęciami",
        "Listy, kategorie i filtrowanie, które da się szybko przeglądać",
        "Koszyk i przejście do zamówienia bez zbędnych kroków",
        "Spójny system komponentów pod rozbudowę asortymentu",
        "Optymalizacja obrazów i wydajności przy dużej liczbie produktów",
        "Współpraca z Twoją platformą sklepową (np. Shopify)",
      ],
      forWho: [
        "Marki, które sprzedają online i potrzebują lepszej prezentacji produktu",
        "Sklepy z gotowym szablonem, który ogranicza sprzedaż",
        "Nowe marki startujące ze sprzedażą",
      ],
      faq: [
        {
          q: "Czy pracujesz na Shopify?",
          a: "Tak, realizowałem projekty e-commerce w oparciu o Shopify, a także sklepy oparte na własnym frontendzie.",
        },
        {
          q: "Czy zajmujesz się płatnościami i wysyłką?",
          a: "Konfiguracja płatności i dostaw zależy od platformy — ustalamy na starcie, co jest po Twojej stronie, a co po mojej.",
        },
      ],
    },
    en: {
      label: "E-commerce development",
      metaTitle: "E-commerce development and storefronts — GOVO DIGITAL",
      metaDescription:
        "E-commerce frontend development: product pages, listings, cart and checkout flow tuned for conversion and speed.",
      headline: "An online store polished at every",
      headlineAccent: "step.",
      intro:
        "I work on the layer your customer sees: product presentation, listings and filtering, the cart and the whole path to an order. I have built storefronts for perfume, cosmetics and an artisan bakery.",
      cardSummary: "Storefront frontend: product pages, listings, cart and purchase flow.",
      deliverables: [
        "Product pages with clear presentation and imagery",
        "Listings, categories and filtering that stay fast to browse",
        "Cart and order flow without unnecessary steps",
        "A consistent component system that scales with your catalogue",
        "Image and performance optimisation for large catalogues",
        "Work alongside your commerce platform (e.g. Shopify)",
      ],
      forWho: [
        "Brands selling online that need stronger product presentation",
        "Stores held back by a rigid template",
        "New brands launching their first store",
      ],
      faq: [
        {
          q: "Do you work with Shopify?",
          a: "Yes, I have delivered e-commerce projects on Shopify as well as stores with a custom frontend.",
        },
        {
          q: "Do you handle payments and shipping?",
          a: "Payment and delivery configuration depends on the platform — we agree upfront what sits on your side and what on mine.",
        },
      ],
    },
  },
  redesign: {
    pl: {
      label: "Redesign strony",
      metaTitle: "Redesign strony internetowej — GOVO DIGITAL",
      metaDescription:
        "Redesign istniejącej strony: nowy wygląd, lepsza czytelność na telefonie i wyraźnie szybsze działanie bez utraty treści.",
      headline: "Redesign strony, która przestała",
      headlineAccent: "wystarczać.",
      intro:
        "Masz stronę, ale wygląda przestarzale, wolno działa albo źle czyta się na telefonie. Przebudowuję warstwę wizualną i frontend, zachowując to, co już działa na Twoją korzyść.",
      cardSummary: "Nowy wygląd i frontend istniejącej strony, bez utraty tego, co działa.",
      deliverables: [
        "Przegląd obecnej strony: układ, czytelność, szybkość",
        "Nowa oprawa wizualna spójna z Twoją marką",
        "Przebudowa frontendu i pełna responsywność",
        "Poprawa wydajności: obrazy, animacje, ładowanie",
        "Zachowanie adresów i treści, które już przynoszą ruch",
        "Wdrożenie zmian oraz kontrola po publikacji",
      ],
      forWho: [
        "Firmy ze stroną sprzed kilku lat",
        "Strony, które nie wyglądają dobrze na telefonach",
        "Właściciele, którym strona ładuje się zbyt wolno",
      ],
      faq: [
        {
          q: "Czy redesign zaszkodzi mojej widoczności w Google?",
          a: "Nie musi. Zachowuję istniejące adresy i treści, które przynoszą ruch, a poprawa szybkości i wersji mobilnej zwykle pomaga.",
        },
        {
          q: "Czy trzeba przenosić stronę na nową technologię?",
          a: "Nie zawsze. Najpierw sprawdzam, co jest wąskim gardłem, i dopiero potem proponuję zakres zmian.",
        },
      ],
    },
    en: {
      label: "Website redesign",
      metaTitle: "Website redesign — GOVO DIGITAL",
      metaDescription:
        "Website redesign: a new look, better mobile readability and clearly faster loading without losing the content that works.",
      headline: "A redesign for a site that stopped being",
      headlineAccent: "enough.",
      intro:
        "You have a website, but it looks dated, loads slowly or reads badly on mobile. I rebuild the visual layer and the frontend while keeping what already works in your favour.",
      cardSummary: "A new look and frontend for an existing site, keeping what already works.",
      deliverables: [
        "Review of the current site: layout, readability, speed",
        "A new visual direction consistent with your brand",
        "Frontend rebuild with full responsiveness",
        "Performance work: images, motion, loading",
        "Keeping the URLs and content that already bring traffic",
        "Deployment and a post-launch check",
      ],
      forWho: [
        "Businesses with a site built years ago",
        "Sites that fall apart on phones",
        "Owners whose pages simply load too slowly",
      ],
      faq: [
        {
          q: "Will a redesign hurt my Google visibility?",
          a: "It does not have to. I keep existing URLs and the content that brings traffic, and better speed and mobile layout usually help.",
        },
        {
          q: "Do we have to move to a new technology?",
          a: "Not always. I check what the real bottleneck is first and then propose the scope.",
        },
      ],
    },
  },
};

export function serviceSlugToKey(lang: Lang, slug: string): ServiceKey | null {
  const found = SERVICE_KEYS.find((key) => SERVICE_SLUGS[key][lang] === slug);
  return found ?? null;
}

/** Longer, keyword-rich body sections rendered under the service intro. */
export const SERVICE_SECTIONS: Record<ServiceKey, Record<Lang, { title: string; text: string }[]>> =
  {
    website: {
      pl: [
        {
          title: "Projektowanie stron internetowych od podstaw",
          text: "Projektowanie stron internetowych zaczynam od tego, kto ma na nią trafić i po co. Dopiero potem powstaje układ sekcji, hierarchia treści i dobór typografii. Dzięki temu strona firmowa nie jest zestawem gotowych bloków, tylko prowadzi odwiedzającego od pierwszego zdania do formularza kontaktowego.",
        },
        {
          title: "Strona wizytówka czy pełny serwis firmowy?",
          text: "Jeśli działasz lokalnie i masz jedną główną usługę, wystarczy strona wizytówka: oferta, dowody zaufania i kontakt na jednej, dobrze poukładanej stronie. Przy szerszej ofercie sensowniej rozbić ją na osobne podstrony usług — każda może wtedy odpowiadać na inne zapytanie w Google.",
        },
        {
          title: "Szybkość, mobile i widoczność w Google",
          text: "Strona kodowana od zera waży dużo mniej niż szablon obładowany wtyczkami, więc ładuje się szybciej — a to wpływa i na odbiór, i na pozycje. W każdym projekcie dostajesz poprawne metadane, dane strukturalne, sitemap oraz układ zaprojektowany najpierw na telefon.",
        },
      ],
      en: [
        {
          title: "Website design from the ground up",
          text: "I start with who should land on the page and why. Only then do the section order, content hierarchy and typography follow. The result is a business website that guides a visitor from the first sentence to the contact form instead of stacking generic blocks.",
        },
        {
          title: "One-pager or a full multi-page site?",
          text: "With one core service, a focused one-pager is enough: offer, proof and contact on a single well-ordered page. With a wider offer it pays to split it into separate service pages, so each one can answer a different search.",
        },
        {
          title: "Speed, mobile and search visibility",
          text: "A site coded from scratch weighs far less than a plugin-heavy template, so it loads faster — which affects both perception and rankings. Every project ships with correct metadata, structured data, a sitemap and a mobile-first layout.",
        },
      ],
    },
    landing: {
      pl: [
        {
          title: "Landing page pod kampanię reklamową",
          text: "Landing page pod reklamy Google lub Meta ma jedno zadanie: zamienić kliknięcie w zapytanie. Buduję go wokół jednej obietnicy, z krótką ścieżką do formularza i bez nawigacji, która odciąga uwagę. Ruch z kampanii jest od razu oznaczony parametrami UTM, więc widzisz, co realnie działa.",
        },
        {
          title: "Struktura, która prowadzi do konwersji",
          text: "Nagłówek z konkretną korzyścią, dowód (realizacje, opinie, liczby), wyjaśnienie oferty, odpowiedzi na wątpliwości i wezwanie do działania powtórzone w kilku miejscach. Animacje są lekkie i wspierają czytanie, nie zasłaniają treści.",
        },
      ],
      en: [
        {
          title: "A landing page built for paid campaigns",
          text: "A landing page for Google or Meta ads has one job: turn a click into an enquiry. I build it around a single promise, with a short path to the form and no navigation pulling attention away. Campaign traffic is tagged with UTM parameters from day one.",
        },
        {
          title: "A structure that leads to conversion",
          text: "A headline with a concrete benefit, proof (work, reviews, numbers), the offer explained, objections answered and the call to action repeated where it matters. Motion stays light and supports reading instead of hiding content.",
        },
      ],
    },
    ecommerce: {
      pl: [
        {
          title: "Sklep internetowy, który da się szybko przeglądać",
          text: "W sprzedaży online najwięcej tracisz na wolnym wczytywaniu list produktów i na kartach, które nie odpowiadają na pytania klienta. Optymalizuję obrazy, ograniczam ciężkie skrypty i porządkuję kartę produktu tak, żeby cena, warianty i dostawa były widoczne bez przewijania w nieskończoność.",
        },
        {
          title: "Ścieżka zakupowa bez zbędnych kroków",
          text: "Koszyk i przejście do zamówienia to miejsce, w którym najczęściej urywa się sprzedaż. Upraszczam liczbę kroków, jasno pokazuję koszty i status zamówienia, a system komponentów projektuję tak, żeby dodawanie nowych kategorii nie wymagało przebudowy sklepu.",
        },
      ],
      en: [
        {
          title: "A store that stays fast to browse",
          text: "Most online sales are lost on slow product listings and pages that never answer the customer's question. I optimise images, cut heavy scripts and order the product page so price, variants and delivery are visible without endless scrolling.",
        },
        {
          title: "A purchase flow without extra steps",
          text: "The cart and checkout is where sales drop off. I reduce the number of steps, show costs and order status clearly, and design the component system so new categories don't require rebuilding the store.",
        },
      ],
    },
    redesign: {
      pl: [
        {
          title: "Kiedy warto zrobić redesign strony",
          text: "Najczęstsze sygnały: strona wygląda jak z innej dekady, na telefonie trzeba powiększać treść, ładowanie trwa kilka sekund albo nie da się jej samodzielnie rozbudować. Zaczynam od przeglądu i wskazania, co realnie ogranicza wyniki, zanim cokolwiek przepisuję.",
        },
        {
          title: "Redesign bez utraty pozycji w Google",
          text: "Zachowuję adresy URL i treści, które już przynoszą ruch, a tam gdzie coś musi się zmienić, ustawiam przekierowania. Poprawa szybkości, wersji mobilnej i struktury nagłówków zwykle pomaga widoczności, nie szkodzi jej.",
        },
      ],
      en: [
        {
          title: "When a redesign is worth it",
          text: "The usual signals: the site looks a decade old, mobile visitors have to pinch to read, loading takes seconds, or you simply can't extend it. I start with a review of what actually limits results before rewriting anything.",
        },
        {
          title: "A redesign without losing rankings",
          text: "I keep the URLs and content that already bring traffic, and set up redirects where something has to change. Better speed, mobile layout and heading structure usually helps visibility rather than hurting it.",
        },
      ],
    },
  };
