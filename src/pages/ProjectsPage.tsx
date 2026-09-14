import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers, User } from "lucide-react";
import { lazy, Suspense } from "react";
const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import CaseStudyPanel, { type CaseData } from "@/components/CaseStudyPanel";

import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { usePauseOffscreen } from "@/hooks/usePauseOffscreen";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
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

const NUMBERS: Record<CardId, string> = {
  vane: "01",
  pelagio: "02",
  obsidian: "03",
  rezydencja: "04",
  capsulent: "05",
  miedzywarstwami: "06",
  greenbasket: "07",
  ridenow: "08",
  smashandco: "09",
};

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/45">
        {children}
      </span>
    </div>
  );
}

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
  const [open, setOpen] = useState<Set<string>>(new Set());


  const cards = t.projectCards;

  const toggle = (id: CardId, name: string) => {
    void trackEvent("project_open", { projectSlug: id, metadata: { project_name: name }, once: true });
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const demo = (meta: Meta, name: string) => (
    <a
      href={meta.demoUrl}
      onClick={() =>
        void trackEvent("demo_click", {
          projectSlug: meta.id,
          metadata: { project_name: name, demo_url: meta.demoUrl },
        })
      }
      target="_blank"
      rel="noopener noreferrer"
      className="group/demo relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_color-mix(in_oklab,var(--primary)_30%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_35px_color-mix(in_oklab,var(--primary)_55%,transparent)] hover:scale-[1.03] demo-shimmer"
    >
      <span className="relative z-10">{t.liveDemo}</span>
      <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition duration-300 group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5" />
    </a>
  );

  const caseStudyButton = (meta: Meta, name: string, variant: "solid" | "plain" = "solid") => (
    <button
      type="button"
      onClick={() => toggle(meta.id, name)}
      className={cn(
        "group/cs inline-flex items-center gap-2 text-sm transition",
        variant === "solid"
          ? "rounded-full border border-border/70 bg-background/30 px-5 py-2.5 text-foreground/60 backdrop-blur-xl hover:border-primary/40 hover:text-primary"
          : "text-foreground/60 hover:text-primary",
      )}
    >
      {t.caseStudy}
      <ArrowRight className="h-3.5 w-3.5 transition group-hover/cs:translate-x-0.5" />
    </button>
  );

  const details = (meta: Meta, compact?: boolean, forceOpen?: boolean) => (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity,margin] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
        forceOpen || open.has(meta.id) ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="overflow-hidden">
        {CASE_PANELS[meta.id] ? (
          <CaseStudyPanel data={CASE_PANELS[meta.id]![lang] ?? CASE_PANELS[meta.id]!.en} compact={compact} />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                {t.caseStudy}
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <p className="whitespace-pre-line rounded-xl border border-border/40 bg-background/30 p-3 text-[11px] leading-snug text-foreground/60 transition duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
              {t.projects[meta.descIndex]?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  /** Condensed teaser shown while a small card's overview is collapsed. */
  const miniSummary = (meta: Meta) => {
    const panel = CASE_PANELS[meta.id];
    if (!panel) return null;
    const data = panel[lang] ?? panel.en;
    const role = data.facts[0];
    const tech = data.facts[1];
    const cell = (Icon: typeof User, label: string, value: string) => (
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3 w-3 shrink-0 text-primary/70" />
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">{label}</span>
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-foreground/60">{value}</p>
      </div>
    );
    return (
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
        {role ? cell(User, role.label, role.items.join(", ")) : null}
        {tech ? cell(Layers, tech.label, tech.items.join(", ")) : null}
      </div>
    );

  };


  const tagRow = (tags: readonly string[]) => (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border/70 bg-foreground/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/50 transition duration-500 group-hover:border-primary/25 group-hover:text-foreground/70"
        >
          {tag}
        </span>
      ))}
    </div>
  );


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

        {/* Featured */}
        <GroupLabel>{t.projectsGroupFeatured}</GroupLabel>
        <div className="mb-16 flex flex-col gap-6">
          {FEATURED.map((meta, i) => {
            const c = cards[meta.id];
            return (
              <Reveal key={meta.id} delay={i * 90} distance={28}>
                <article className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-xl transition duration-500 hover:border-primary/40 hover:shadow-glow lg:grid-cols-2">
                  <div className="flex flex-col p-7 md:p-9">
                    <span className="font-mono text-sm text-primary/70">{NUMBERS[meta.id]}</span>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-2xl uppercase tracking-tight transition duration-300 group-hover:text-primary md:text-3xl">
                        {c.name}
                      </h2>
                      <span className="rounded-full border border-primary/40 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary/80">
                        {t.conceptProject}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-foreground/75">{c.subtitle}</p>
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/55">
                      {c.blurb}
                    </p>
                    <div className="mt-6">{tagRow(c.tags)}</div>
                    <div className="mt-7 flex flex-wrap items-center gap-6">
                      {caseStudyButton(meta, c.name)}
                      {demo(meta, c.name)}
                    </div>
                    {CASE_PANELS[meta.id] ? null : details(meta)}

                  </div>
                  <div className="relative min-h-[240px] overflow-hidden border-t border-border lg:border-l lg:border-t-0">
                    <img
                      src={meta.imageSrc}
                      alt={c.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {CASE_PANELS[meta.id] ? (
                    <div
                      className={cn(
                        "transition-[padding] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:col-span-2",
                        open.has(meta.id) ? "px-7 pb-7 md:px-9 md:pb-9" : "px-7 pb-0 md:px-9",
                      )}
                    >
                      {details(meta, false)}
                    </div>
                  ) : null}

                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Selected */}
        <GroupLabel>{t.projectsGroupSelected}</GroupLabel>
        <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SELECTED.map((meta, i) => {
            const c = cards[meta.id];
            return (
              <Reveal key={meta.id} delay={i * 80} distance={26} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl transition duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-1 hover:border-primary/40 hover:bg-card/60 hover:shadow-glow">
                  <div className="relative overflow-hidden">
                    <img
                      src={meta.imageSrc}
                      alt={c.name}
                      className="aspect-[16/11] w-full object-cover transition duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-primary/80 backdrop-blur-md">
                      {NUMBERS[meta.id]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg leading-snug tracking-tight transition duration-300 group-hover:text-primary">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/55">{c.blurb}</p>
                    <div className="mt-4">{tagRow(c.tags)}</div>
                    {miniSummary(meta)}
                    {details(meta, true)}
                    <div className="h-5" />
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                      {caseStudyButton(meta, c.name, "plain")}
                      {demo(meta, c.name)}
                    </div>

                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* More */}
        <GroupLabel>{t.projectsGroupMore}</GroupLabel>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {MORE.map((meta, i) => {
            const c = cards[meta.id];
            return (
              <Reveal key={meta.id} delay={i * 80} distance={26} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl transition duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-1 hover:border-primary/40 hover:bg-card/60 hover:shadow-glow">
                  <div className="relative overflow-hidden">
                    <img
                      src={meta.imageSrc}
                      alt={c.name}
                      className="aspect-[16/10] w-full object-cover transition duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-primary/80 backdrop-blur-md">
                      {NUMBERS[meta.id]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg leading-snug tracking-tight transition duration-300 group-hover:text-primary">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/55">{c.blurb}</p>
                    <div className="mt-4">{tagRow(c.tags)}</div>
                    {miniSummary(meta)}
                    {details(meta, true)}
                    <div className="h-5" />
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                      {caseStudyButton(meta, c.name, "plain")}
                      {demo(meta, c.name)}
                    </div>

                  </div>
                </article>
              </Reveal>
            );
          })}
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
