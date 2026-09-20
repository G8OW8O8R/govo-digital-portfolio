export type Lang = "en" | "pl";

export const translations = {
  en: {
    // Index
    greeting: "HEY — I'M OWNER OF GOVO DIGITAL",
    headlineLead: "I build beautiful",
    rotating: ["interfaces", "experiences", "interactions", "moments"],
    tagline:
      "Frontend developer crafting smooth, premium web experiences — where every pixel earns its place and every transition has a reason.",
    askPlaceholder: "Tell me about your vision",
    cards: { me: "Me", projects: "Projects", skills: "Skills", contact: "Contact", process: "Process", blog: "Blog" },

    // Process
    processEyebrow: "HOW I WORK",
    processTitle1: "From the first idea to a ",
    processTitle2: "finished website.",
    processIntro:
      "I run the project from structure and visual direction through frontend, interactions and deployment.\nThe process is simple, organised and focused on real results.",
    processStepLabel: "Step",
    processDirectTitle: "You work directly with me",
    processStepsTitle: "Collaboration process",
    processSpeedLabel: "FAST TURNAROUND",
    processSpeedBody:
      "First version ready in 1–3 business days for smaller, well-prepared projects.",
    processSpeedCta: "Start your project",
    processDirectNote:
      "No intermediaries, long approval paths or splitting the project between several people. That means more consistency, faster decisions and better control over the final result.",
    processBenefits: [
      { title: "Direct collaboration", body: "Contact, questions and revisions go straight to the person who designs and builds the website." },
      { title: "Consistent process", body: "Strategy, UX/UI and frontend are joined in one process, so the project keeps its direction from start to finish." },
      { title: "Refined result", body: "I focus on clarity, responsiveness, interactions and the quality of the final deployment." },
    ],
    processSteps: [
      {
        title: "Discovery",
        subtitle: "I define what the website needs to achieve.",
        body: "We talk about your offer, audience, goals and the action a visitor should take on the website.",
      },
      {
        title: "Structure & content",
        subtitle: "I organise the user experience.",
        body: "I lay out the site structure, content hierarchy, sections and the main calls to action.",
      },
      {
        title: "Visual direction",
        subtitle: "I give the website its character.",
        body: "I build an aesthetic matched to the brand — typography, colour, layout, imagery and the overall interface style.",
      },
      {
        title: "Design & development",
        subtitle: "I turn the design into a working website.",
        body: "I build a responsive frontend and implement sections, forms, interactions and every required element.",
      },
      {
        title: "Refinement & launch",
        subtitle: "I finalise the project and prepare it for publication.",
        body: "I check responsiveness, polish the details and deploy the finished website or hand over the files.",
      },
    ],
    processTimelineTitle: "Scope and schedule",
    processTimelineBody:
      "Every project is agreed individually. Smaller websites can be built quickly, while more extensive work — especially e-commerce or additional integrations — needs its own schedule.",
    processCtaTitle: "Got an idea, a redesign, or a site that no longer keeps up with your business?",
    processCtaBody:
      "Let's talk about the project and see what we can build together.",
    processCtaButton: "Let's talk",

    // Common
    back: "back",
    backHome: "back to home",
    backHomeAlt: "Back home",

    // Me
    aboutPath: "/about",
    age: "20 YEARS OLD",
    location: "BRWINÓW, POLAND",
    iAm: "I am",
    roles: [
      "Frontend Developer",
      "Web Designer",
      "UI Designer",
      "Landing Page Designer",
      "E-commerce Frontend Developer",
      "Digital Implementation Specialist",
    ],
    tags: ["Frontend", "React", "UI Design", "E-commerce", "Motion UI", "Web Deployment"],
    bio1:
      "I run GOVO Digital — an independent brand focused on web design and frontend development. I combine structure, UX/UI, responsive development and interaction so the project ends as a working website, not just a mockup.",
    bio2:
      "I like working on projects where design has a distinct character, yet stays readable, fast and functional.",
    bio3:
      "I'm interested in e-commerce, digital branding and how technology can support better user experiences.",
    aboutBadge: "ABOUT ME",
    aboutAvailability: "AVAILABLE REMOTELY",
    aboutLocationShort: "POLAND",
    aboutHeadline1: "I design and build",
    aboutHeadline2: "modern websites.",
    techTitle: "TECHNOLOGIES I WORK WITH",
    aboutQuote1: "Great websites combine aesthetics, technology and business understanding.",
    aboutQuote2: "And that's exactly what I build.",
    aboutCtaQuestion: "Have a project or a website that needs a new level?",
    aboutCtaLink: "Write to me",


    // Projects
    projectsTitle1: "My ",
    projectsTitle2: "Projects",
    projectsIntro:
      "Websites, e-commerce and digital experiences designed\nfrom structure and visual direction to responsive implementation and interactions.",
    projectsEyebrow: "SELECTED WORK",
    projectsHeadline1: "Projects that merge",
    projectsHeadline2: "design",
    projectsHeadlineAnd: "and",
    projectsHeadline3: "frontend.",
    projectsGroupFeatured: "FEATURED PROJECTS",
    projectsGroupSelected: "SELECTED WORK",
    projectsGroupMore: "MORE WORK",
    projectsClose: "Close",
    projectsDragHint: "Drag to explore",
    projectsViewProject: "View project",
    caseStudy: "Project overview",
    projectsCtaTitle1: "Have a project that needs",
    projectsCtaTitle2: "a similar level?",
    projectsCtaBody: "Tell me about your idea\nand I'll prepare a proposal.",
    projectsCtaButton: "Let's talk",
    projectCards: {
      vane: {
        name: "VANE PARFUMS",
        subtitle: "Luxury e-commerce experience",
        blurb:
          "Editorial e-commerce for a fragrance house.\nStorytelling, product personalization\nand standout animation combined.",
        tags: ["UX/UI", "Frontend", "E-commerce", "Motion"],
      },
      pelagio: {
        name: "PELAGIO",
        subtitle: "Hospitality & restaurant experience",
        blurb:
          "A premium restaurant site combining visual direction,\na seasonal menu and interactive dish presentation\nin one coherent experience.",
        tags: ["UX/UI", "Frontend", "Motion", "Interaction"],
      },
      obsidian: {
        name: "Obsidian Detailing",
        subtitle: "Car detailing",
        blurb: "Website for a premium car detailing studio.",
        tags: ["UI/UX", "Frontend", "Motion"],
      },
      rezydencja: {
        name: "Rezydencja",
        subtitle: "Real estate",
        blurb: "Platform for a real estate office with a client and agent panel.",
        tags: ["Product UI", "Frontend", "React"],
      },
      capsulent: {
        name: "Capsulent",
        subtitle: "Hospitality",
        blurb: "Boutique hotel website in a slow-hospitality spirit.",
        tags: ["UX/UI", "Frontend", "Motion"],
      },
      miedzywarstwami: {
        name: "Między Warstwami",
        subtitle: "Bakery commerce",
        blurb: "Online store for an artisan bakery.",
        tags: ["E-commerce", "Frontend"],
      },
      greenbasket: {
        name: "GreenBasket",
        subtitle: "Food commerce",
        blurb: "Online store with organic products.",
        tags: ["E-commerce", "Frontend"],
      },
      ridenow: {
        name: "RideNow",
        subtitle: "Mobility",
        blurb: "Landing page for an e-scooter rental service.",
        tags: ["UI/UX", "Frontend"],
      },
      smashandco: {
        name: "Smash & Co",
        subtitle: "Restaurant",
        blurb: "Smash burger restaurant site with a street vibe.",
        tags: ["UI/UX", "Frontend"],
      },
    },
    liveDemo: "Live demo",
    screenshotSoon: "Project screenshot coming soon",
    conceptProject: "CONCEPT PROJECT",
    categorySuffix: "UX/UI · Frontend Development",
    projects: [

      {
        title: "VANE PARFUMS — Luxury Fragrance E-commerce",
        category: "Fragrance E-commerce",
        description:
          "A digital fragrance house where commerce and brand storytelling operate as one experience: large-scale campaign photography, editorial typography and a distinctive bottle system combined with a complete e-commerce journey.\n\nUsers explore fragrances by category, discover scent notes and intensity, select bottle sizes, personalize products with engraving and use the refill programme. A scroll-controlled cinematic intro animates the VANE bottle frame by frame before transitioning into the main site, with dedicated desktop and mobile compositions.",
      },
      {
        title: "PELAGIO — Mediterranean Seafood Dining Experience",
        category: "Hospitality",
        description:
          "A premium seafood restaurant website combining editorial visual direction, a seasonal menu, dish presentation, delivery and interactive reservations into one cohesive experience.\n\nThis is a concept project.",
      },
      {
        title: "OBSIDIAN DETAILING — Premium Automotive Care Platform",
        category: "Car Detailing",
        description:
          "A premium car detailing platform combining bold automotive art direction with a functional service and project experience.\n\nThe concept includes interactive before-and-after comparisons, a filtered realizations gallery, detailed case studies, digital gift cards, team presentation and enquiry-focused booking paths.",
      },
      {
        title: "GREENBASKET — Organic Grocery & Meal Delivery",
        category: "Food Commerce",
        description:
          "A complete organic grocery and meal-delivery experience combining product discovery, curated baskets, recipe-led shopping and live order tracking.\n\nThe concept includes a responsive storefront, detailed product views and a clear journey from first visit to delivery.",
      },
      {
        title: "Między Warstwami — Artisan Bakery & Pickup Experience",
        category: "Bakery Commerce",
        description:
          "An interactive boutique bakery experience combining premium product presentation, pickup reservations, order management and family-brand storytelling within one cohesive interface.",
      },
      {
        title: "Capsulent — Premium Booking Landing Page",
        category: "Hospitality landing page",
        description:
          "A premium hospitality website for a fictional lakeside capsule retreat in Mazury, Poland. The project focuses on calm visual storytelling, elegant layout, immersive nature-inspired branding and a clear reservation-focused structure.\n\nThe website presents three unique stay options, introduces the brand philosophy, highlights activities such as sauna, hot tub and kayaking, and uses guest reviews to build trust and atmosphere. The goal was to create a digital experience that feels quiet, refined and high-end while still guiding users toward a simple booking action.\n\nMy role covered frontend development, UI design, responsive layout, visual direction, animation flow, landing page structure, CTA placement and deployment.",
      },
      {
        title: "REZYDENCJA — Property & Client Management Experience",
        category: "Real Estate Platform",
        description:
          "A premium real estate platform that presents high-end properties through curated listings, detailed residence showcases and direct client-to-advisor communication.\n\nThe interface combines elegant property cards, refined typography, a warm dark palette and a clear visual hierarchy — creating a boutique agency feel focused on trust, exclusivity and ease of discovery.",
      },
      {
        title: "RideNow — Premium Carsharing Website Concept",
        category: "Mobility landing page",
        description:
          "A modern mobility website for a fictional premium carsharing brand in Poland. The project focuses on a clean app-driven user journey, strong automotive visuals, clear service explanation and conversion-oriented sections for app downloads, vehicle discovery and location-based rentals.\n\nThe website presents premium cars available for minutes, hours or days, highlights key benefits such as insurance, comfort and 24/7 support, and introduces city and airport pickup locations. The landing page also includes an app-focused section, loyalty bonuses, FAQ and business-oriented navigation to make the service feel complete and ready for real-world use.\n\nMy role covered frontend development, UI design, responsive layout, landing page structure, visual direction, CTA placement, motion flow and deployment.",
      },
      {
        title: "Smash & Co \u2014 Restaurant Website Concept",
        category: "Restaurant website",
        description:
          "A dynamic restaurant website for a modern smash burger brand in Warsaw. The project focuses on strong visual identity, bold typography, food-driven storytelling and clear conversion paths for online orders, catering and local restaurant visits.\n\nThe website includes a full landing page structure with a hero section, weekly bestsellers, limited offers, loyalty club, catering section, customer reviews, location cards and delivery platform links. The goal was to create a website that feels energetic, modern and easy to use \u2014 while helping visitors quickly choose a product, find a location or place an order.\n\nMy role covered frontend development, UI design, responsive layout, page structure, visual direction, animations, CTA placement and deployment.",
      },
    ],

    // Skills
    skillsTitle1: "My ",
    skillsTitle2: "Skills",
    skillsIntro:
      "Technologies, tools and areas I work with\nwhen designing, building and shipping websites.",
    skillGroups: [
      {
        title: "Frontend Development",
        desc: "I build responsive interfaces in React and TypeScript, caring about component structure, readable code and behaviour across devices.",
      },
      {
        title: "Motion & Interactive Web",
        desc: "I create animations, microinteractions and scroll-based experiences that strengthen the interface instead of distracting from the content.",
      },
      {
        title: "Web Design & UX",
        desc: "I design the structure and visual layer of websites with a focus on information hierarchy, usability and a consistent brand direction.",
      },
      {
        title: "E-commerce & Product Experience",
        desc: "I design product experiences covering product presentation, variants, personalisation and the whole purchase path.",
      },
      {
        title: "Tools, Performance & Delivery",
        desc: "Tools and practices that let me build, test and ship fast, stable and scalable websites.",
      },
      {
        title: "AI-Assisted Workflow",
        desc: "I use AI for research, prototyping, working with code and creating supporting assets, while keeping control over design and implementation.",
      },
    ],
    workingStyleTitle: "Working style",


    // Contact
    contactTitle1: "Get in ",
    contactTitle2: "Touch",
    contactIntro:
      "Let's build something that works.\n\n\nHave a website, landing page or ecommerce idea? Send me a short message and I'll get back to you with the next steps.",
    email: "Email",
    emailDirect: "Prefer to write directly?",
    emailReply: "I usually reply within 24h.",
    phone: "Phone",
    phoneText: "Phone available after first contact.",
    socials: "Socials",
    formName: "Name",
    formNamePh: "Your name",
    formEmail: "Email",
    formEmailPh: "you@example.com",
    formMessage: "Message",
    formMessagePh: "Tell me briefly about your company, project\nand what you want to achieve...",
    formType: "Project type",
    formTypePh: "Choose a project type",
    formTypeOptions: [
      "Company / service website",
      "Landing page",
      "Portfolio",
      "Online store / e-commerce",
      "Redesign of an existing website",
      "Other web project",
      "Not sure yet — I need advice",
    ],
    formCta: "Tell me about your project",
    formNote: "The first message commits you to nothing.",
    sendMessage: "Send message",
    sent: "Sent — talk soon",
    contactBriefCtaTitle: "No brief yet?",
    contactBriefCtaBody: "No problem. Just a few sentences about your company and what you'd like to improve.",
  },
  pl: {
    greeting: "CZEŚĆ — JESTEM TWÓRCĄ GOVO DIGITAL",
    headlineLead: "Tworzę piękne",
    rotating: ["interfejsy", "witryny", "interakcje", "projekty"],
    tagline:
      "Frontend developer tworzący nowoczesne strony internetowe — dopracowane wizualnie, płynne w działaniu i zaprojektowane tak, aby każdy element miał swoje miejsce oraz konkretny cel.",
    askPlaceholder: "Opowiedz mi o swoim projekcie",
    cards: { me: "O mnie", projects: "Projekty", skills: "Umiejętności", contact: "Kontakt", process: "Proces", blog: "Blog" },

    // Process
    processEyebrow: "JAK PRACUJĘ",
    processTitle1: "Od pierwszego pomysłu do ",
    processTitle2: "gotowej strony.",
    processIntro:
      "Prowadzę projekt od struktury i kierunku wizualnego po frontend, interakcje i wdrożenie.\nProces jest prosty, uporządkowany i nastawiony na realny efekt.",
    processStepLabel: "Krok",
    processDirectTitle: "Pracujesz bezpośrednio ze mną",
    processStepsTitle: "Proces współpracy",
    processSpeedLabel: "SZYBKI CZAS REALIZACJI",
    processSpeedBody:
      "Wersja gotowa do publikacji może być ukończona w 1–3 dni robocze dla mniejszych, dobrze przygotowanych projektów.",
    processSpeedCta: "Rozpocznij projekt",
    processDirectNote:
      "Bez pośredników, długich ścieżek akceptacji i rozdzielania projektu między kilka osób. To daje większą spójność, szybsze decyzje i lepszą kontrolę nad końcowym efektem.",
    processBenefits: [
      { title: "Bezpośrednia współpraca", body: "Kontakt, pytania i poprawki trafiają bezpośrednio do osoby, która projektuje i buduje stronę." },
      { title: "Spójny proces", body: "Strategia, UX/UI i frontend są połączone w jednym procesie, dzięki czemu projekt zachowuje kierunek od początku do końca." },
      { title: "Dopracowany efekt", body: "Skupiam się na czytelności, responsywności, interakcjach i jakości finalnego wdrożenia." },
    ],
    processSteps: [
      {
        title: "Discovery",
        subtitle: "Ustalam, co strona ma osiągnąć.",
        body: "Rozmawiamy o Twojej ofercie, odbiorcach, celach i tym, co użytkownik ma zrobić na stronie.",
      },
      {
        title: "Struktura i treść",
        subtitle: "Porządkuję doświadczenie użytkownika.",
        body: "Układam strukturę strony, hierarchię treści, sekcje i główne wezwania do działania.",
      },
      {
        title: "Kierunek wizualny",
        subtitle: "Nadaję stronie charakter.",
        body: "Buduję estetykę dopasowaną do marki — typografię, kolory, układ, obrazy i ogólny styl interfejsu.",
      },
      {
        title: "Design i development",
        subtitle: "Zamieniam projekt w działającą stronę.",
        body: "Tworzę responsywny frontend, wdrażam sekcje, formularze, interakcje i potrzebne elementy.",
      },
      {
        title: "Dopracowanie i wdrożenie",
        subtitle: "Finalizuję projekt i przygotowuję go do publikacji.",
        body: "Sprawdzam responsywność, poprawiam szczegóły i wdrażam gotową stronę lub przekazuję pliki.",
      },
    ],
    processTimelineTitle: "Zakres i harmonogram",
    processTimelineBody:
      "Każdy projekt ustalam indywidualnie. Mniejsze strony mogą powstać szybko, a bardziej rozbudowane realizacje — szczególnie z e-commerce lub dodatkowymi integracjami — wymagają osobnego harmonogramu.",
    processCtaTitle: "Masz pomysł, redesign albo stronę, która już nie nadąża za Twoim biznesem?",
    processCtaBody:
      "Porozmawiajmy o projekcie i zobaczmy, co możemy razem zbudować.",
    processCtaButton: "Porozmawiajmy",

    back: "wróć",
    backHome: "wróć do strony głównej",
    backHomeAlt: "Strona główna",

    aboutPath: "/o-mnie",
    age: "20 LAT",
    location: "BRWINÓW, POLSKA",
    iAm: "Jestem",
    roles: [
      "Frontend Developerem",
      "Web Designerem",
      "UI Designerem",
      "Projektantem Landing Page",
      "Frontend Developerem E-commerce",
      "Specjalistą ds. Wdrożeń Cyfrowych",
    ],
    tags: ["Frontend", "React", "UI Design", "E-commerce", "Motion UI", "Web Deployment"],
    bio1:
      "Prowadzę GOVO Digital — niezależną markę skupioną na web designie i frontend developmencie. Łączę strukturę, UX/UI, responsive development i interakcje, żeby projekt kończył się działającą stroną, a nie tylko makietą.",
    bio2:
      "Lubię pracować nad projektami, w których design ma wyraźny charakter, ale nadal pozostaje czytelny, szybki i funkcjonalny.",
    bio3:
      "Interesuję się e-commerce, brandingiem cyfrowym i tym, jak technologia może wspierać lepsze doświadczenia użytkowników.",
    aboutBadge: "O MNIE",
    aboutAvailability: "DOSTĘPNY ZDALNIE",
    aboutLocationShort: "POLSKA",
    aboutHeadline1: "Projektuję i buduję",
    aboutHeadline2: "nowoczesne strony internetowe.",
    techTitle: "TECHNOLOGIE, Z KTÓRYMI PRACUJĘ",
    aboutQuote1: "Dobre strony internetowe to połączenie estetyki, technologii i zrozumienia biznesu.",
    aboutQuote2: "I właśnie takie tworzę.",
    aboutCtaQuestion: "Masz projekt lub stronę, która potrzebuje nowego poziomu?",
    aboutCtaLink: "Napisz do mnie",


    projectsTitle1: "Moje ",
    projectsTitle2: "Projekty",
    projectsIntro:
      "Strony, e-commerce i doświadczenia cyfrowe projektowane\nod struktury i kierunku wizualnego po responsywną implementację i interakcje.",
    projectsEyebrow: "WYBRANE REALIZACJE",
    projectsHeadline1: "Projekty, które łączą",
    projectsHeadline2: "design",
    projectsHeadlineAnd: "i",
    projectsHeadline3: "frontend.",
    projectsGroupFeatured: "FEATURED PROJECTS",
    projectsGroupSelected: "SELECTED WORK",
    projectsGroupMore: "MORE WORK",
    projectsClose: "Zamknij",
    projectsDragHint: "Przeciągnij, aby zobaczyć więcej",
    projectsViewProject: "Zobacz projekt",
    caseStudy: "Przegląd projektu",
    projectsCtaTitle1: "Masz projekt, który potrzebuje",
    projectsCtaTitle2: "podobnego poziomu?",
    projectsCtaBody: "Opowiedz mi o swoim pomyśle,\na przygotuję propozycję.",
    projectsCtaButton: "Porozmawiajmy",
    projectCards: {
      vane: {
        name: "VANE PARFUMS",
        subtitle: "Luxury e-commerce experience",
        blurb:
          "Editorial e-commerce dla domu perfumeryjnego.\nPołączenie storytellingu, personalizacji produktu\ni wyjątkowych animacji.",
        tags: ["UX/UI", "Frontend", "E-commerce", "Motion"],
      },
      pelagio: {
        name: "PELAGIO",
        subtitle: "Hospitality & restaurant experience",
        blurb:
          "Strona restauracji premium łącząca kierunek wizualny,\nsezonowe menu i interaktywną prezentację dań\nw jednym, spójnym doświadczeniu.",
        tags: ["UX/UI", "Frontend", "Motion", "Interaction"],
      },
      obsidian: {
        name: "Obsidian Detailing",
        subtitle: "Car detailing",
        blurb: "Strona studia car detailingu premium.",
        tags: ["UI/UX", "Frontend", "Motion"],
      },
      rezydencja: {
        name: "Rezydencja",
        subtitle: "Nieruchomości",
        blurb: "Platforma dla biura nieruchomości z panelem dla klientów i agentów.",
        tags: ["Product UI", "Frontend", "React"],
      },
      capsulent: {
        name: "Capsulent",
        subtitle: "Hospitality",
        blurb: "Strona hotelu butikowego w duchu slow hospitality.",
        tags: ["UX/UI", "Frontend", "Motion"],
      },
      miedzywarstwami: {
        name: "Między Warstwami",
        subtitle: "Bakery commerce",
        blurb: "Sklep internetowy piekarni rzemieślniczej.",
        tags: ["E-commerce", "Frontend"],
      },
      greenbasket: {
        name: "GreenBasket",
        subtitle: "Food commerce",
        blurb: "Sklep internetowy z produktami ekologicznymi.",
        tags: ["E-commerce", "Frontend"],
      },
      ridenow: {
        name: "RideNow",
        subtitle: "Mobility",
        blurb: "Landing page usługi wypożyczania pojazdów",
        tags: ["UI/UX", "Frontend"],
      },
      smashandco: {
        name: "Smash & Co",
        subtitle: "Restauracja",
        blurb: "Strona restauracji typu smash burger w streetowym klimacie.",
        tags: ["UI/UX", "Frontend"],
      },
    },
    liveDemo: "Zobacz demo",
    screenshotSoon: "Zrzut ekranu wkrótce",
    conceptProject: "PROJEKT KONCEPCYJNY",
    categorySuffix: "UX/UI · Frontend Development",
    projects: [

      {
        title: "VANE PARFUMS — Luxury Fragrance E-commerce",
        category: "Perfumeria E-commerce",
        description:
          "Koncepcja cyfrowego domu perfumeryjnego, w którym strona nie pełni wyłącznie funkcji sklepu, ale buduje atmosferę i charakter marki — duże kampanijne fotografie, editorialowa typografia i charakterystyczny system flakonów w połączeniu z pełną ścieżką e-commerce.\n\nUżytkownik odkrywa kolekcję według kategorii, poznaje nuty zapachowe i intensywność, wybiera pojemność, korzysta z grawerowania i programu refill. Integralną częścią jest interaktywne intro sterowane scrollem — sekwencja klatek z flakonem VANE rozpylającym zapach. Całość zaprojektowana responsywnie, z osobnym podejściem do desktopu i mobile.",
      },
      {
        title: "PELAGIO — Mediterranean Seafood Dining Experience",
        category: "Hospitality",
        description:
          "Strona restauracji seafood premium łącząca editorialowy kierunek wizualny, sezonową kartę, prezentację dań, dostawę i interaktywną rezerwację w jednym spójnym doświadczeniu.\n\nProjekt koncepcyjny.",
      },
      {
        title: "OBSIDIAN DETAILING — Premium Automotive Care Platform",
        category: "Car Detailing",
        description:
          "Platforma dla studia car detailingu premium, łącząca wyrazisty automotive art direction z funkcjonalną prezentacją usług i realizacji.\n\nProjekt obejmuje interaktywne porównania przed i po, filtrowaną galerię, szczegółowe case studies, karty podarunkowe, prezentację zespołu oraz ścieżkę kontaktu i rezerwacji.",
      },
      {
        title: "GREENBASKET — Sklep z ekologiczną żywnością i dostawą",
        category: "Food Commerce",
        description:
          "Kompletny koncept sklepu z ekologiczną żywnością i dostawą gotowych zestawów, łączący odkrywanie produktów, wybór koszy, zakupy oparte na przepisach oraz śledzenie zamówienia.\n\nProjekt obejmuje responsywny sklep, szczegółowe widoki produktów i czytelną ścieżkę od pierwszej wizyty do dostawy.",
      },
      {
        title: "Między Warstwami — Artisan Bakery & Pickup Experience",
        category: "Bakery Commerce",
        description:
          "Butikowa strona cukierni łącząca prezentację wypieków, rezerwację odbioru i zarządzanie zamówieniem z charakterystycznym storytellingiem marki.",
      },
      {
        title: "Capsulent — koncepcyjna strona rezerwacyjna premium",
        category: "Hospitality landing page",
        description:
          "Strona internetowa dla luksusowych kapsuł wypoczynkowych nad mazurskim jeziorem. Projekt skupia się na spokojnym, premium charakterze marki, storytellingu opartym o naturę oraz przejrzystej strukturze prowadzącej użytkownika do rezerwacji.\n\nStrona prezentuje dostępne kapsuły, filozofię marki, aktywności, opinie gości i wyraźne CTA rezerwacyjne. Celem projektu było stworzenie doświadczenia, które wygląda elegancko, działa płynnie i buduje wrażenie wyjątkowego miejsca jeszcze przed kontaktem z obiektem.",
      },
      {
        title: "REZYDENCJA — Property & Client Management Experience",
        category: "Real Estate Platform",
        description:
          "Platforma nieruchomości premium łącząca wyselekcjonowane oferty, szczegółowe prezentacje rezydencji i bezpośrednią komunikację klienta z doradcą.\n\nInterfejs buduje wrażenie butikowej agencji — łącząc eleganckie karty nieruchomości, dopracowaną typografię, ciepłą ciemną paletę i przejrzystą hierarchię wizualną, która prowadzi od przeglądania ofert po bezpośredni kontakt z doradcą.",
      },
      {
        title: "RideNow — koncepcyjna strona premium carsharingu",
        category: "Mobility landing page",
        description:
          "Strona internetowa dla marki carsharingowej oferującej auta premium w Polsce. Projekt skupia się na przejrzystej prezentacji usługi, mocnej oprawie wizualnej, strukturze nastawionej na pobranie aplikacji oraz szybkim zrozumieniu oferty przez użytkownika.\n\nStrona prezentuje segmenty aut, lokalizacje w miastach i na lotniskach, korzyści usługi, sekcję aplikacji, bonusy lojalnościowe oraz FAQ. Celem projektu było stworzenie landing page’a, który wygląda nowocześnie, buduje zaufanie i prowadzi użytkownika do konkretnej akcji — pobrania aplikacji lub rozpoczęcia rezerwacji.",
      },
      {
        title: "Smash & Co — koncepcyjna strona restauracji",
        category: "Restaurant website",
        description:
          "Strona internetowa dla nowoczesnej burgerowni typu smash burger w Warszawie. Projekt skupia się na mocnej identyfikacji wizualnej, wyrazistej typografii, energetycznym klimacie marki oraz przejrzystej strukturze prowadzącej użytkownika do zamówienia online lub odwiedzenia lokalu.\n\nStrona zawiera sekcję hero, menu, bestsellery tygodnia, oferty limitowane, program lojalnościowy, catering, opinie klientów, lokalizacje oraz przyciski prowadzące do platform zamówień. Celem projektu było stworzenie strony, która wygląda dynamicznie, nowocześnie i sprzedażowo — tak, aby szybko pokazać ofertę, zbudować apetyt i zachęcić użytkownika do konkretnej akcji.",
      },
    ],

    skillsTitle1: "Moje ",
    skillsTitle2: "Umiejętności",
    skillsIntro:
      "Technologie, narzędzia i obszary, z których korzystam\nprzy projektowaniu, budowaniu i wdrażaniu stron internetowych.",
    skillGroups: [
      {
        title: "Frontend Development",
        desc: "Buduję responsywne interfejsy w React i TypeScript, dbając o strukturę komponentów, czytelność kodu i zachowanie na różnych urządzeniach.",
      },
      {
        title: "Motion & Interactive Web",
        desc: "Tworzę animacje, mikrointerakcje i doświadczenia scroll-based, które wzmacniają interfejs zamiast odciągać uwagę od treści.",
      },
      {
        title: "Web Design & UX",
        desc: "Projektuję strukturę i warstwę wizualną stron z naciskiem na hierarchię informacji, użyteczność i spójny kierunek marki.",
      },
      {
        title: "E-commerce & Product Experience",
        desc: "Projektuję doświadczenia produktowe obejmujące prezentację produktu, warianty, personalizację i ścieżkę zakupową.",
      },
      {
        title: "Tools, Performance & Delivery",
        desc: "Narzędzia i praktyki, które pozwalają mi tworzyć, testować i wdrażać szybkie, stabilne i skalowalne strony internetowe.",
      },
      {
        title: "AI-Assisted Workflow",
        desc: "Wykorzystuję AI do researchu, prototypowania, pracy z kodem i tworzenia materiałów pomocniczych, zachowując kontrolę nad designem i implementacją.",
      },
    ],
    workingStyleTitle: "Working style",


    contactTitle1: "Skontaktuj się ",
    contactTitle2: "ze mną",
    contactIntro:
      "Zbudujmy coś, co naprawdę działa.\n\n\nMasz pomysł na stronę, landing page lub sklep? Napisz krótką wiadomość, a wrócę z propozycją kolejnych kroków.",
    email: "E-mail",
    emailDirect: "Wolisz napisać bezpośrednio?",
    emailReply: "Odpowiadam zwykle w ciągu 24h.",
    phone: "Telefon",
    phoneText: "Numer telefonu dostępny po pierwszym kontakcie.",
    socials: "Social media",
    formName: "Imię",
    formNamePh: "Twoje imię",
    formEmail: "E-mail",
    formEmailPh: "ty@przyklad.pl",
    formMessage: "Wiadomość",
    formMessagePh: "Napisz krótko o swojej firmie, projekcie\ni tym, co chcesz osiągnąć...",
    formType: "Rodzaj projektu",
    formTypePh: "Wybierz rodzaj projektu",
    formTypeOptions: [
      "Strona firmowa / usługowa",
      "Landing page",
      "Portfolio",
      "Sklep internetowy / e-commerce",
      "Redesign istniejącej strony",
      "Inny projekt webowy",
      "Nie wiem jeszcze — potrzebuję doradztwa",
    ],
    formCta: "Opowiedz mi o projekcie",
    formNote: "Pierwsza wiadomość do niczego Cię nie zobowiązuje.",
    sendMessage: "Wyślij wiadomość",
    sent: "Wysłane — do usłyszenia",
    contactBriefCtaTitle: "Nie masz jeszcze gotowego briefu?",
    contactBriefCtaBody: "Nie szkodzi. Wystarczy kilka zdań o firmie i tym, co chciałbyś poprawić.",
  },
};

export type Dict = typeof translations.en;

