import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { lazy, Suspense } from "react";
const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import ProjectShowcase, { type ShowcaseItem } from "@/components/ProjectShowcase";
import type { CaseData } from "@/components/CaseStudyPanel";
import projectOverrides from "@/content/project-overrides.json";

import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { usePauseOffscreen } from "@/hooks/usePauseOffscreen";
import vaneImg from "@/assets/vane-screenshot.webp";
import obsidianImg from "@/assets/obsidian.webp";
import greenbasketImg from "@/assets/greenbasket.webp";
import capsulentImg from "@/assets/capsulent.webp";
import ridenowImg from "@/assets/ridenow.webp";
import miedzywarstwamiImg from "@/assets/miedzywarstwami.webp";
import smashandcoImg from "@/assets/smashandco.webp";
import rezydencjaImg from "@/assets/rezydencja.webp";
import pelagioImg from "@/assets/pelagio.webp";



type CardId =
  | "vane"
  | "pelagio"
  | "obsidian"
  | "rezydencja"
  | "capsulent"
  | "miedzywarstwami"
  | "greenbasket"
  | "ridenow"
  | "smashandco";

type Meta = {
  id: CardId;
  /** index into the long-form t.projects array */
  descIndex: number;
  demoUrl: string;
  imageSrc: string;
};

const FEATURED: Meta[] = [
  { id: "vane", descIndex: 0, demoUrl: "https://govodemo11.vercel.app/", imageSrc: vaneImg },
  { id: "pelagio", descIndex: 1, demoUrl: "https://govodemo10.vercel.app/", imageSrc: pelagioImg },
];

const SELECTED: Meta[] = [
  { id: "obsidian", descIndex: 2, demoUrl: "https://govodemo8.vercel.app/", imageSrc: obsidianImg },
  { id: "rezydencja", descIndex: 6, demoUrl: "https://govodemo6.vercel.app/", imageSrc: rezydencjaImg },
  { id: "capsulent", descIndex: 5, demoUrl: "https://govodemo2.vercel.app/", imageSrc: capsulentImg },
  {
    id: "miedzywarstwami",
    descIndex: 4,
    demoUrl: "https://govodemo9.vercel.app/",
    imageSrc: miedzywarstwamiImg,
  },
];

const MORE: Meta[] = [
  { id: "greenbasket", descIndex: 3, demoUrl: "https://govodemo7.vercel.app/", imageSrc: greenbasketImg },
  { id: "ridenow", descIndex: 7, demoUrl: "https://govodemo3.vercel.app/", imageSrc: ridenowImg },
  { id: "smashandco", descIndex: 8, demoUrl: "https://govodemo1.vercel.app/#", imageSrc: smashandcoImg },
];

const ALL_PROJECTS: Meta[] = [...FEATURED, ...SELECTED, ...MORE];
const CONCEPT_IDS = new Set<CardId>(["vane", "pelagio"]);

const VANE_CASE: Record<string, CaseData> = {
  pl: {
    facts: [
      { label: "Moja rola", items: ["UX/UI Design", "Frontend Development", "Motion"] },
      { label: "Technologie", items: ["React", "TypeScript", "GSAP", "Tailwind CSS"] },
      { label: "Focus", items: ["Luxury E-commerce", "Product Experience", "UI Animation"] },
      { label: "Rok", items: ["2026"] },
    ],
    focusTitle: "Na czym się skupiłem",
    focus: [
      {
        title: "Product-first experience",
        body: "Produkt i fotografia na pierwszym planie. Interfejs buduje historię wokół zapachu, bez zbędnego szumu.",
      },
      {
        title: "E-commerce clarity",
        body: "Warianty, personalizacja i zakup zaprojektowane w przejrzysty sposób, aby decyzja była intuicyjna i szybka.",
      },
      {
        title: "Motion & interaction",
        body: "Scroll-based animation, subtelne mikrointerakcje i płynne przejścia wspierają luksusowy charakter marki.",
      },
      {
        title: "Responsive implementation",
        body: "Oddzielne kompozycje dla desktopu i mobile. Układ i animacje dopasowane do każdego ekranu, a nie tylko przeskalowane.",
      },
    ],
  },
  en: {
    facts: [
      { label: "My role", items: ["UX/UI Design", "Frontend Development", "Motion"] },
      { label: "Tech", items: ["React", "TypeScript", "GSAP", "Tailwind CSS"] },
      { label: "Focus", items: ["Luxury E-commerce", "Product Experience", "UI Animation"] },
      { label: "Year", items: ["2026"] },
    ],
    focusTitle: "What I focused on",
    focus: [
      {
        title: "Product-first experience",
        body: "Product and photography lead the page. The interface builds a story around the scent, with no visual noise.",
      },
      {
        title: "E-commerce clarity",
        body: "Variants, personalisation and checkout are laid out clearly so the decision stays intuitive and fast.",
      },
      {
        title: "Motion & interaction",
        body: "Scroll-based animation, subtle micro-interactions and smooth transitions support the luxury feel of the brand.",
      },
      {
        title: "Responsive implementation",
        body: "Separate compositions for desktop and mobile — layout and motion tuned per screen, never just scaled down.",
      },
    ],
  },
};

const PELAGIO_CASE: Record<string, CaseData> = {
  pl: {
    facts: [
      { label: "Moja rola", items: ["UX/UI Design", "Frontend Development", "Visual Direction"] },
      { label: "Technologie", items: ["React", "TypeScript", "GSAP", "Tailwind CSS"] },
      { label: "Focus", items: ["Hospitality Website", "Reservation Experience", "Editorial UI"] },
      { label: "Rok", items: ["2026"] },
    ],
    focusTitle: "What I focused on",
    focus: [
      {
        title: "Editorial atmosphere",
        body: "Duże kadry potraw i oszczędna typografia budują klimat premium restauracji.",
      },
      {
        title: "Reservation clarity",
        body: "Rezerwacja pozostaje łatwa do znalezienia i naturalnie prowadzi użytkownika do działania.",
      },
      {
        title: "Menu & storytelling",
        body: "Sezonowe menu, prezentacja dań i informacje o restauracji tworzą spójne doświadczenie.",
      },
      {
        title: "Responsive experience",
        body: "Układ zachowuje klimat i czytelność na desktopie i mobile, bez utraty hierarchii.",
      },
    ],
  },
  en: {
    facts: [
      { label: "My role", items: ["UX/UI Design", "Frontend Development", "Visual Direction"] },
      { label: "Tech", items: ["React", "TypeScript", "GSAP", "Tailwind CSS"] },
      { label: "Focus", items: ["Hospitality Website", "Reservation Experience", "Editorial UI"] },
      { label: "Year", items: ["2026"] },
    ],
    focusTitle: "What I focused on",
    focus: [
      {
        title: "Editorial atmosphere",
        body: "Large food photography and restrained typography build the premium feel of the restaurant.",
      },
      {
        title: "Reservation clarity",
        body: "Booking stays easy to find and guides the user naturally towards action.",
      },
      {
        title: "Menu & storytelling",
        body: "Seasonal menu, dish presentation and restaurant information form one coherent experience.",
      },
      {
        title: "Responsive experience",
        body: "The layout keeps its atmosphere and legibility on desktop and mobile, without losing hierarchy.",
      },
    ],
  },
};

const OBSIDIAN_CASE: Record<string, CaseData> = {
  pl: {
    facts: [
      { label: "Moja rola", items: ["UX/UI Design", "Frontend Development", "Conversion Strategy"] },
      { label: "Technologie", items: ["React", "TypeScript", "Tailwind CSS", "Vite"] },
      { label: "Focus", items: ["Service Website", "Conversion Flow", "Visual Proof"] },
      { label: "Rok", items: ["2026"] },
    ],
    focusTitle: "Na czym się skupiłem",
    focus: [
      {
        title: "Premium positioning",
        body: "Strona buduje wizerunek studia premium przez mocną automotive art direction.",
      },
      {
        title: "Before/after proof",
        body: "Realizacje i porównania wzmacniają zaufanie zamiast opierać się wyłącznie na copy.",
      },
      {
        title: "Clear enquiry paths",
        body: "Usługi, kontakt i ścieżki zapytania są czytelne i prowadzą do szybkiego działania.",
      },
      {
        title: "Responsive structure",
        body: "Sekcje ofertowe i galerie zachowują przejrzystość na różnych urządzeniach.",
      },
    ],
  },
  en: {
    facts: [
      { label: "My role", items: ["UX/UI Design", "Frontend Development", "Conversion Strategy"] },
      { label: "Tech", items: ["React", "TypeScript", "Tailwind CSS", "Vite"] },
      { label: "Focus", items: ["Service Website", "Conversion Flow", "Visual Proof"] },
      { label: "Year", items: ["2026"] },
    ],
    focusTitle: "What I focused on",
    focus: [
      {
        title: "Premium positioning",
        body: "The site builds a premium studio image through strong automotive art direction.",
      },
      {
        title: "Before/after proof",
        body: "Realisations and comparisons build trust instead of relying solely on copy.",
      },
      {
        title: "Clear enquiry paths",
        body: "Services, contact and enquiry routes are clear and lead to quick action.",
      },
      {
        title: "Responsive structure",
        body: "Offer sections and galleries stay clear across all devices.",
      },
    ],
  },
};

const REZYDENCJA_CASE: Record<string, CaseData> = {
  pl: {
    facts: [
      { label: "Moja rola", items: ["UX/UI Design", "Frontend Development", "Product UI"] },
      { label: "Technologie", items: ["React", "TypeScript", "Tailwind CSS", "Vite"] },
      { label: "Focus", items: ["Real Estate Platform", "Product UI", "Information Architecture"] },
      { label: "Rok", items: ["2026"] },
    ],
    focusTitle: "Na czym się skupiłem",
    focus: [
      {
        title: "Information hierarchy",
        body: "Duża ilość danych o nieruchomościach została uporządkowana w czytelną strukturę.",
      },
      {
        title: "Product-style interface",
        body: "Listingi, wyszukiwarka i widoki szczegółowe zostały zaprojektowane jak spójny produkt.",
      },
      {
        title: "Advisor communication",
        body: "Kontakt klienta z doradcą jest integralną częścią doświadczenia, a nie dodatkiem.",
      },
      {
        title: "Responsive density",
        body: "Gęstszy interfejs został dopasowany do mniejszych ekranów bez utraty użyteczności.",
      },
    ],
  },
  en: {
    facts: [
      { label: "My role", items: ["UX/UI Design", "Frontend Development", "Product UI"] },
      { label: "Tech", items: ["React", "TypeScript", "Tailwind CSS", "Vite"] },
      { label: "Focus", items: ["Real Estate Platform", "Product UI", "Information Architecture"] },
      { label: "Year", items: ["2026"] },
    ],
    focusTitle: "What I focused on",
    focus: [
      {
        title: "Information hierarchy",
        body: "A large amount of property data was organised into a readable structure.",
      },
      {
        title: "Product-style interface",
        body: "Listings, search and detailed views were designed as a cohesive product.",
      },
      {
        title: "Advisor communication",
        body: "Contact between the client and advisor is an integral part of the experience, not an add-on.",
      },
      {
        title: "Responsive density",
        body: "The denser interface was adapted to smaller screens without losing usability.",
      },
    ],
  },
};

const CAPSULENT_CASE: Record<string, CaseData> = {
  pl: {
    facts: [
      { label: "Moja rola", items: ["UX/UI Design", "Frontend Development", "Visual Direction"] },
      { label: "Technologie", items: ["React", "TypeScript", "Tailwind CSS", "GSAP"] },
      { label: "Focus", items: ["Hospitality Website", "Booking Flow", "Editorial Experience"] },
      { label: "Rok", items: ["2026"] },
    ],
    focusTitle: "Na czym się skupiłem",
    focus: [
      {
        title: "Calm-first atmosphere",
        body: "Cisza, przestrzeń i typografia budują spokojny, premium charakter retreatu.",
      },
      {
        title: "Booking clarity",
        body: "Warianty pobytu i rezerwacja pozostają proste mimo bardziej immersyjnej narracji.",
      },
      {
        title: "Experience storytelling",
        body: "Atrakcje, lokalizacja i filozofia miejsca wspierają decyzję o pobycie.",
      },
      {
        title: "Responsive composition",
        body: "Duże kadry i sekcje editorialowe zostały przystosowane do mobile z zachowaniem rytmu.",
      },
    ],
  },
  en: {
    facts: [
      { label: "My role", items: ["UX/UI Design", "Frontend Development", "Visual Direction"] },
      { label: "Tech", items: ["React", "TypeScript", "Tailwind CSS", "GSAP"] },
      { label: "Focus", items: ["Hospitality Website", "Booking Flow", "Editorial Experience"] },
      { label: "Year", items: ["2026"] },
    ],
    focusTitle: "What I focused on",
    focus: [
      {
        title: "Calm-first atmosphere",
        body: "Silence, space and typography build the calm, premium character of the retreat.",
      },
      {
        title: "Booking clarity",
        body: "Stay options and booking stay simple despite the more immersive narrative.",
      },
      {
        title: "Experience storytelling",
        body: "Attractions, location and the philosophy of the place support the decision to stay.",
      },
      {
        title: "Responsive composition",
        body: "Large frames and editorial sections were adapted to mobile while keeping their rhythm.",
      },
    ],
  },
};

const MIEDZYWARSTWAMI_CASE: Record<string, CaseData> = {
  pl: {
    facts: [
      { label: "Moja rola", items: ["UX/UI Design", "Frontend Development", "Brand Storytelling"] },
      { label: "Technologie", items: ["React", "TypeScript", "Tailwind CSS", "GSAP"] },
      { label: "Focus", items: ["Bakery E-commerce", "Product Storytelling", "Pickup Experience"] },
      { label: "Rok", items: ["2026"] },
    ],
    focusTitle: "Na czym się skupiłem",
    focus: [
      {
        title: "Appetite-driven visuals",
        body: "Mocna prezentacja produktów buduje emocję i charakter marki piekarni.",
      },
      {
        title: "Ordering clarity",
        body: "Oferta, zamówienie i odbiór pozostają proste mimo bardziej ekspresyjnej oprawy.",
      },
      {
        title: "Brand storytelling",
        body: "Rodzinny charakter marki i historia produktu wzmacniają autentyczność doświadczenia.",
      },
      {
        title: "Responsive commerce",
        body: "Strona zachowuje czytelność oferty i ścieżki zakupu na wszystkich urządzeniach.",
      },
    ],
  },
  en: {
    facts: [
      { label: "My role", items: ["UX/UI Design", "Frontend Development", "Brand Storytelling"] },
      { label: "Tech", items: ["React", "TypeScript", "Tailwind CSS", "GSAP"] },
      { label: "Focus", items: ["Bakery E-commerce", "Product Storytelling", "Pickup Experience"] },
      { label: "Year", items: ["2026"] },
    ],
    focusTitle: "What I focused on",
    focus: [
      {
        title: "Appetite-driven visuals",
        body: "Strong product presentation builds emotion and character for the bakery brand.",
      },
      {
        title: "Ordering clarity",
        body: "Offer, ordering and pickup stay simple despite the more expressive visual treatment.",
      },
      {
        title: "Brand storytelling",
        body: "The family character of the brand and product history reinforce the authenticity of the experience.",
      },
      {
        title: "Responsive commerce",
        body: "The site keeps the offer and purchase path readable across all devices.",
      },
    ],
  },
};

const CASE_PANELS: Partial<Record<CardId, Record<string, CaseData>>> = {
  vane: VANE_CASE,
  pelagio: PELAGIO_CASE,
  obsidian: OBSIDIAN_CASE,
  rezydencja: REZYDENCJA_CASE,
  capsulent: CAPSULENT_CASE,
  miedzywarstwami: MIEDZYWARSTWAMI_CASE,
};

export default function ProjectsPage() {
  const { t, lang } = useI18n();
  const p = paths(lang);
  const marqueeRef = usePauseOffscreen<HTMLDivElement>();

  const cards = t.projectCards;
  const overrides = projectOverrides as Record<
    string,
    Partial<Record<"pl" | "en", { name?: string; subtitle?: string; blurb?: string; tags?: string[] }>> & {
      media?: { gallery?: string[]; video?: string };
    }
  >;

  const showcaseItems: ShowcaseItem[] = ALL_PROJECTS.map((meta) => {
    const c = cards[meta.id];
    const panel = CASE_PANELS[meta.id];
    const override = overrides[meta.id]?.[lang];
    const media = overrides[meta.id]?.media;
    return {
      id: meta.id,
      imageSrc: meta.imageSrc,
      name: override?.name || c.name,
      subtitle: override?.subtitle || c.subtitle,
      blurb: override?.blurb || c.blurb,
      tags: override?.tags?.length ? override.tags : c.tags,
      demoUrl: meta.demoUrl,
      isConcept: CONCEPT_IDS.has(meta.id),
      casePanel: panel ? (panel[lang] ?? panel.en) : undefined,
      gallery: media?.gallery,
      video: media?.video,
    };
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}><InteractiveStars /></Suspense>

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
        <Link
          to={p.home}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm backdrop-blur-xl transition hover:border-primary/50 hover:shadow-glow"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          {t.backHomeAlt}
        </Link>
        <LanguageSwitcher />
      </header>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-14 md:pt-20">
        {/* Hero */}
        <div className="mb-16 text-center md:mb-20">
          <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-foreground/45">
            {t.projectsEyebrow}
          </span>
          <h1 className="mt-5 pb-2 font-display text-4xl leading-[1.14] tracking-tight sm:text-5xl md:text-6xl">
            <SplitText text={t.projectsHeadline1} className="block" />
            <Reveal delay={260} distance={22}>
              <span className="mt-1 block italic">
                <span className="text-shimmer inline-block pr-[0.08em]">
                  {t.projectsHeadline2} {t.projectsHeadlineAnd} {t.projectsHeadline3}
                </span>
              </span>

            </Reveal>
          </h1>

          <p className="mx-auto mt-6 max-w-xl whitespace-pre-line text-sm leading-relaxed text-foreground/55 md:text-base">
            {t.projectsIntro}
          </p>
        </div>

        {/* Showcase */}
        <div className="mb-16">
          <ProjectShowcase
            items={showcaseItems}
            lang={lang}
            labels={{
              liveDemo: t.liveDemo,
              caseStudy: t.caseStudy,
              conceptProject: t.conceptProject,
              close: t.projectsClose,
              dragHint: t.projectsDragHint,
              viewProject: t.projectsViewProject,
            }}
          />
        </div>

        {/* Bottom CTA */}
        <Reveal delay={120} distance={28}>
          <div className="mx-auto mt-16 flex max-w-4xl flex-col items-start gap-6 rounded-3xl border border-border bg-card/50 p-7 backdrop-blur-xl transition duration-500 hover:border-primary/40 hover:shadow-glow md:flex-row md:items-center md:justify-between md:p-9">
            <div className="flex items-center gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-400 text-background">
                <ArrowUpRight className="h-6 w-6" />
              </span>
              <h2 className="font-display text-xl leading-snug tracking-tight md:text-2xl">
                <span className="block text-foreground">{t.projectsCtaTitle1}</span>
                <span className="block text-shimmer">{t.projectsCtaTitle2}</span>
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/55">
                {t.projectsCtaBody}
              </p>
              <Link
                to={p.contact}
                className="group/cta inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-3 text-sm backdrop-blur-xl transition hover:border-primary/50 hover:text-primary hover:shadow-glow"
              >
                {t.projectsCtaButton}
                <ArrowRight className="h-4 w-4 transition group-hover/cta:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Bottom marquee */}
      <div className="relative z-10 mb-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div ref={marqueeRef} className="flex w-max animate-marquee gap-10 font-mono text-sm text-foreground/40">
          {[
            "React",
            "TypeScript",
            "Tailwind",
            "GSAP",
            "Vite",
            "UI Design",
            "E-commerce",
            "Motion UI",
            "Vercel",
            "Shopify",
            "React",
            "TypeScript",
            "Tailwind",
            "GSAP",
            "Vite",
            "UI Design",
            "E-commerce",
            "Motion UI",
            "Vercel",
            "Shopify",
          ].map((s, i) => (
            <span key={i} className="flex items-center gap-10">
              {s}
              <span className="text-primary/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
