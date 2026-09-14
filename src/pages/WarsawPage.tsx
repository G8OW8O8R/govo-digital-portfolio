import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import { lazy, Suspense } from "react";

import Reveal from "@/components/Reveal";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { SERVICES, SERVICE_KEYS, SERVICE_SLUGS } from "@/content/services";

const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));

const AREAS = [
  "Warszawa",
  "Kraków",
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Łódź",
  "Katowice",
  "Szczecin",
  "Lublin",
  "Bydgoszcz",
  "Rzeszów",
  "Cała Polska — zdalnie",
];

const REASONS = [
  {
    title: "Kodowane od zera, nie z szablonu",
    text: "Strona powstaje w React i Tailwind CSS, bez ciężkich wtyczek. Efekt: szybkie ładowanie i układ dopasowany do Twojej oferty, a nie do gotowego motywu.",
  },
  {
    title: "Mobile w pierwszej kolejności",
    text: "Większość zapytań przychodzi dziś z telefonu. Każdy widok sprawdzam najpierw na małym ekranie, dopiero potem na desktopie.",
  },
  {
    title: "Współpraca zdalna w całej Polsce",
    text: "Pracuję z okolic Warszawy, ale projekty prowadzę zdalnie dla firm z całego kraju. Zwykle wystarczy rozmowa online, a spotkanie w Warszawie też jest możliwe.",
  },
  {
    title: "Jedna osoba od projektu do wdrożenia",
    text: "Projekt, kod, wdrożenie i domena — nie przekazujesz tematu między agencją, grafikiem i programistą.",
  },
];

const STEPS = [
  "Krótka rozmowa o celu strony i Twoich klientach",
  "Wycena z konkretną kwotą i terminem",
  "Projekt układu do akceptacji",
  "Kodowanie i podgląd na żywo",
  "Wdrożenie na Twojej domenie i kontrola po publikacji",
];

export default function WarsawPage() {
  const { t, lang } = useI18n();
  const p = paths("pl");

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}>
        <InteractiveStars />
      </Suspense>

      <header className="relative z-20 mx-auto flex w-full max-w-4xl items-center justify-between px-6 pt-6 text-xs">
        <Link
          to={p.home}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-foreground/70 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          {lang === "pl" ? t.back : "Home"}
        </Link>
        <LanguageSwitcher />
      </header>

      <article className="relative z-10 mx-auto w-full max-w-4xl px-6 py-14">
        <Reveal>
          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Cała Polska — zdalnie
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 pb-2 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Tworzenie stron internetowych{" "}
            <span className="italic text-shimmer">w całej Polsce.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/70 md:text-base">
            Projektuję i koduję strony internetowe dla firm z całej Polski — od Warszawy po Kraków,
            Wrocław i Trójmiasto: strony firmowe i usługowe, landing pages pod kampanie oraz sklepy
            internetowe. Każdy projekt powstaje od zera — szybki, czytelny na telefonie i nastawiony na to, żeby klient faktycznie się z
            Tobą skontaktował.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={p.contact}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.03] hover:shadow-glow"
            >
              Bezpłatna wycena
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pl/uslugi/cennik"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
            >
              Zobacz cennik
            </Link>
          </div>
        </Reveal>

        <section className="mt-14">
          <Reveal>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              Co robię dla firm w całej Polsce
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {SERVICE_KEYS.map((key, i) => {
              const service = SERVICES[key].pl;
              return (
                <Reveal key={key} delay={80 + i * 70}>
                  <Link
                    to="/pl/uslugi/$slug"
                    params={{ slug: SERVICE_SLUGS[key].pl }}
                    className="group flex h-full flex-col rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
                  >
                    <h3 className="text-base font-semibold text-foreground">{service.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                      {service.cardSummary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                      Szczegóły
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                Dlaczego warto
              </h2>
              <dl className="mt-5 space-y-4">
                {REASONS.map((r) => (
                  <div key={r.title}>
                    <dt className="text-sm font-semibold text-foreground">{r.title}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-foreground/65">{r.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                Jak przebiega współpraca
              </h2>
              <ol className="mt-5 space-y-3">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                    <span className="mt-0.5 font-mono text-[11px] text-primary">
                      0{i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </section>

        <section className="mt-14">
          <Reveal>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              Obszar działania
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/65">
              Działam w całej Polsce — cała współpraca może odbyć się zdalnie, od pierwszej rozmowy
              po wdrożenie. Najczęściej pracuję z firmami z Warszawy i największych miast, a z
              klientami spoza kraju rozmawiam po angielsku.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <ul className="mt-5 flex flex-wrap gap-2">
              {AREAS.map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3.5 py-1.5 font-mono text-[11px] text-foreground/70 backdrop-blur-xl"
                >
                  <Check className="h-3 w-3 text-primary" />
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <Reveal delay={120}>
          <div className="mt-14 rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-foreground">
              Potrzebujesz strony dla swojej firmy?
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              Napisz w kilku zdaniach, czym się zajmujesz i co ma robić strona. Odpowiadam zwykle w
              ciągu 24 godzin.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={p.contact}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.03] hover:shadow-glow"
              >
                Napisz do mnie
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={p.projects}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
              >
                Realizacje
              </Link>
            </div>
          </div>
        </Reveal>
      </article>
    </main>
  );
}
