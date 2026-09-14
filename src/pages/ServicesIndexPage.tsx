import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Code2, Rocket, ShoppingBag, Sparkles } from "lucide-react";
import { lazy, Suspense } from "react";

import Reveal from "@/components/Reveal";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { SERVICES, SERVICE_KEYS, SERVICE_SLUGS, type ServiceKey } from "@/content/services";

const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));

const ICONS: Record<ServiceKey, React.ElementType> = {
  website: Code2,
  landing: Rocket,
  ecommerce: ShoppingBag,
  redesign: Sparkles,
};

const COPY = {
  pl: {
    kicker: "Usługi",
    headline: "Co mogę dla Ciebie",
    accent: "zbudować.",
    intro:
      "Cztery obszary, w których pracuję najczęściej. Każdy projekt zaczynam od rozmowy o celu strony, a nie od szablonu.",
    more: "Zobacz szczegóły",
    ctaTitle: "Nie wiesz, co wybrać?",
    ctaText: "Opisz krótko pomysł — podpowiem, jaki zakres ma sens.",
    ctaButton: "Napisz do mnie",
  },
  en: {
    kicker: "Services",
    headline: "What I can build",
    accent: "for you.",
    intro:
      "Four areas I work in most often. Every project starts with a conversation about the goal of the site, not with a template.",
    more: "See details",
    ctaTitle: "Not sure what you need?",
    ctaText: "Describe the idea in a few lines and I will suggest a sensible scope.",
    ctaButton: "Get in touch",
  },
} as const;

export default function ServicesIndexPage() {
  const { t, lang } = useI18n();
  const p = paths(lang);
  const c = COPY[lang];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}>
        <InteractiveStars />
      </Suspense>

      <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-6 text-xs">
        <Link
          to={p.home}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-foreground/70 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          {t.back}
        </Link>
        <LanguageSwitcher />
      </header>

      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            {c.kicker}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 pb-2 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            {c.headline} <span className="italic text-shimmer">{c.accent}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-foreground/60 md:text-base">
            {c.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {SERVICE_KEYS.map((key, i) => {
            const service = SERVICES[key][lang];
            const slug = SERVICE_SLUGS[key][lang];
            const Icon = ICONS[key];
            const inner = (
              <>
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-lg font-semibold text-foreground">{service.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {service.cardSummary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                  {c.more}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </>
            );
            const className =
              "group flex flex-col rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow";

            return (
              <Reveal key={key} delay={200 + i * 70}>
                {lang === "pl" ? (
                  <Link to="/pl/uslugi/$slug" params={{ slug }} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <Link to="/en/services/$slug" params={{ slug }} className={className}>
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={480}>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {lang === "pl" ? (
              <Link
                to="/pl/uslugi/cennik"
                className="group flex flex-col rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
              >
                <h2 className="text-lg font-semibold text-foreground">Cennik</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  Ile kosztuje strona internetowa, landing page i sklep online — widełki, terminy i
                  co wpływa na cenę.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                  {c.more}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ) : (
              <Link
                to="/en/services/pricing"
                className="group flex flex-col rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
              >
                <h2 className="text-lg font-semibold text-foreground">Pricing</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  What a website, landing page or online store costs — ranges, timelines and what
                  changes the price.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                  {c.more}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            )}

            {lang === "pl" && (
              <Link
                to="/pl/strony-internetowe-warszawa"
                className="group flex flex-col rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
              >
                <h2 className="text-lg font-semibold text-foreground">Cała Polska</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  Tworzenie stron internetowych dla firm z całej Polski — jak wygląda współpraca na
                  miejscu i zdalnie.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                  {c.more}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            )}
          </div>
        </Reveal>

        <Reveal delay={560}>
          <div className="mt-12 rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-foreground">{c.ctaTitle}</h2>
            <p className="mt-2 text-sm text-foreground/60">{c.ctaText}</p>
            <Link
              to={p.contact}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.03] hover:shadow-glow"
            >
              {c.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

      </section>
    </main>
  );
}
