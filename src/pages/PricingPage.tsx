import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { lazy, Suspense } from "react";

import Reveal from "@/components/Reveal";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { PRICING } from "@/content/pricing";

const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));

export default function PricingPage() {
  const { lang } = useI18n();
  const p = paths(lang);
  const c = PRICING[lang];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}>
        <InteractiveStars />
      </Suspense>

      <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-6 text-xs">
        <Link
          to={p.services}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-foreground/70 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          {lang === "pl" ? "Wszystkie usługi" : "All services"}
        </Link>
        <LanguageSwitcher />
      </header>

      <article className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            {c.kicker}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 pb-2 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            {c.headline} <span className="italic text-shimmer">{c.headlineAccent}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/70 md:text-base">
            {c.intro}
          </p>
        </Reveal>
        <Reveal delay={220}>
          <p className="mt-3 max-w-2xl font-mono text-[11px] leading-relaxed text-foreground/45">
            {c.note}
          </p>
        </Reveal>

        <section className="mt-14">
          <Reveal>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{c.tiersTitle}</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {c.tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={80 + i * 70}>
                <div className="flex h-full flex-col rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl transition hover:border-primary/40">
                  <h3 className="text-base font-semibold text-foreground">{tier.name}</h3>
                  <p className="mt-3 font-display text-3xl tracking-tight text-shimmer">
                    {tier.range}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground/45">
                    <Clock className="h-3.5 w-3.5" />
                    {c.timelineLabel}: {tier.timeline}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/65">{tier.summary}</p>
                  <ul className="mt-5 space-y-2.5">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-foreground/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                {c.factorsTitle}
              </h2>
              <dl className="mt-5 space-y-4">
                {c.factors.map((f) => (
                  <div key={f.title}>
                    <dt className="text-sm font-semibold text-foreground">{f.title}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-foreground/65">{f.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                {c.includedTitle}
              </h2>
              <ul className="mt-5 space-y-3">
                {c.included.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section className="mt-14">
          <Reveal>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{c.faqTitle}</h2>
          </Reveal>
          <div className="mt-5 space-y-3">
            {c.faq.map((item, i) => (
              <Reveal key={item.q} delay={70 + i * 60}>
                <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-xl">
                  <h3 className="text-sm font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal delay={120}>
          <div className="mt-14 rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
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
              <Link
                to={p.services}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
              >
                {c.ctaSecondary}
              </Link>
            </div>
          </div>
        </Reveal>
      </article>
    </main>
  );
}
