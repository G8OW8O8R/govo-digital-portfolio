import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Users } from "lucide-react";
import { lazy, Suspense } from "react";

import Reveal from "@/components/Reveal";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { SERVICES, SERVICE_SECTIONS, type ServiceKey } from "@/content/services";

const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));

const COPY = {
  pl: {
    kicker: "Usługa",
    scope: "Co wchodzi w zakres",
    forWho: "Dla kogo",
    faq: "Częste pytania",
    allServices: "Wszystkie usługi",
    ctaTitle: "Porozmawiajmy o Twoim projekcie",
    ctaText: "Napisz w kilku zdaniach, co chcesz osiągnąć. Odpowiadam zwykle w ciągu 24 godzin.",
    ctaButton: "Napisz do mnie",
    pricing: "Zobacz cennik",
  },
  en: {
    kicker: "Service",
    scope: "What's included",
    forWho: "Who it's for",
    faq: "Common questions",
    allServices: "All services",
    ctaTitle: "Let's talk about your project",
    ctaText: "Tell me in a few lines what you want to achieve. I usually reply within 24 hours.",
    ctaButton: "Get in touch",
    pricing: "See pricing",
  },
} as const;

export default function ServicePage({ serviceKey }: { serviceKey: ServiceKey }) {
  const { t, lang } = useI18n();
  const p = paths(lang);
  const c = COPY[lang];
  const s = SERVICES[serviceKey][lang];
  const sections = SERVICE_SECTIONS[serviceKey][lang];


  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}>
        <InteractiveStars />
      </Suspense>

      <header className="relative z-20 mx-auto flex w-full max-w-4xl items-center justify-between px-6 pt-6 text-xs">
        <Link
          to={p.services}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-foreground/70 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          {c.allServices}
        </Link>
        <LanguageSwitcher />
      </header>

      <article className="relative z-10 mx-auto w-full max-w-4xl px-6 py-14">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            {c.kicker}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 pb-2 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            {s.headline} <span className="italic text-shimmer">{s.headlineAccent}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/70 md:text-base">
            {s.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Reveal delay={220}>
            <section className="h-full rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                {c.scope}
              </h2>
              <ul className="mt-5 space-y-3">
                {s.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal delay={300}>
            <section className="h-full rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                {c.forWho}
              </h2>
              <ul className="mt-5 space-y-3">
                {s.forWho.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        <section className="mt-14 space-y-8">
          {sections.map((section, i) => (
            <Reveal key={section.title} delay={60 + i * 70}>
              <div className="max-w-3xl">
                <h2 className="font-display text-xl tracking-tight sm:text-2xl">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65 md:text-[15px]">
                  {section.text}
                </p>
              </div>
            </Reveal>
          ))}
        </section>



        <section className="mt-12">
          <Reveal>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{c.faq}</h2>
          </Reveal>
          <div className="mt-5 space-y-3">
            {s.faq.map((item, i) => (
              <Reveal key={item.q} delay={80 + i * 70}>
                <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-xl">
                  <h3 className="text-sm font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal delay={120}>
          <div className="mt-12 rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-foreground">{c.ctaTitle}</h2>
            <p className="mt-2 text-sm text-foreground/60">{c.ctaText}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={p.contact}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.03] hover:shadow-glow"
              >
                {c.ctaButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {lang === "pl" ? (
                <Link
                  to="/pl/uslugi/cennik"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
                >
                  {c.pricing}
                </Link>
              ) : (
                <Link
                  to="/en/services/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
                >
                  {c.pricing}
                </Link>
              )}
              <Link
                to={p.projects}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
              >
                {t.cards.projects}
              </Link>

            </div>
          </div>
        </Reveal>
      </article>
    </main>
  );
}
