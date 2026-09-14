import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { ArrowLeft, ArrowRight, MessagesSquare, LayoutList, Code2, Rocket, Clock, MessageCircle, Layers, Send, Target, User } from "lucide-react";
import { lazy, Suspense } from "react";
const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));
import SplitText from "@/components/SplitText";
import Reveal from "@/components/Reveal";
import ProcessTimeline from "@/components/ProcessTimeline";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";



const STEP_ICONS = [MessagesSquare, LayoutList, Send, Code2, Rocket];

export default function ProcessPage() {
  useEffect(() => {
    void trackEvent("process_open", { once: true });
  }, []);

  const { t, lang } = useI18n();
  const p = paths(lang);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}><InteractiveStars /></Suspense>

      {/* Top nav */}
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

      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14 md:py-20">
        {/* Hero */}
        <div className="mb-14 text-center md:mb-20">
          <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.28em] text-foreground/50">
            {t.processEyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            <SplitText
              text={t.processTitle1}
              stagger={70}
              delay={80}
              className="text-foreground"
            />
            <SplitText
              text={t.processTitle2}
              stagger={70}
              delay={80 + t.processTitle1.trim().split(" ").length * 70}
              className="italic"
              wordClassName="text-shimmer"
            />
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-foreground/60 md:text-base"
            style={{ animationDelay: "160ms" }}
          >
            {t.processIntro}
          </p>
        </div>

        {/* Direct collaboration note */}
        <div
          className="animate-fade-up mb-8 flex flex-col items-start gap-4 md:mb-10 md:flex-row md:gap-5"
          style={{ animationDelay: "200ms" }}
        >
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-card/60 text-primary backdrop-blur-xl">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-base tracking-tight text-foreground md:text-lg">
              {t.processDirectTitle}
            </h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-foreground/60 md:text-base">
              {t.processDirectNote}
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16 grid grid-cols-1 gap-4 md:mb-20 md:grid-cols-3">
          {t.processBenefits.map((benefit, i) => {
            const icons = [MessageCircle, Layers, Target];
            const Icon = icons[i];
            return (
              <div
                key={benefit.title}
                className="animate-fade-up group flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/60"
                style={{ animationDelay: `${240 + i * 60}ms` }}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-primary/10 text-primary transition group-hover:scale-105 group-hover:bg-primary/15">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-tight text-foreground md:text-base">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/60 md:text-sm">
                    {benefit.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Steps */}
        <h2 className="mb-8 text-center font-display text-2xl tracking-tight md:mb-10 md:text-3xl">
          <SplitText
            text={t.processStepsTitle}
            stagger={70}
            wordClassName="text-shimmer"
          />
        </h2>

        <div className="md:-mx-6 md:overflow-x-auto md:px-6 md:pb-2 md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
          <div className="md:min-w-[820px]">
            <ProcessTimeline
              steps={t.processSteps}
              icons={STEP_ICONS}
              stepLabel={t.processStepLabel}
            />
          </div>
        </div>



        {/* Timeline block */}
        <Reveal
          delay={80}
          className="mx-auto mt-10 flex max-w-3xl flex-col items-start gap-4 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-xl md:flex-row md:gap-5 md:p-7"
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-base tracking-tight md:text-lg">
              {t.processTimelineTitle}
            </h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/60">
              {t.processTimelineBody}
            </p>
          </div>
        </Reveal>


        {/* CTA */}
        <div
          className="animate-fade-up mt-12 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card/60 to-pink-500/10 p-8 backdrop-blur-xl md:flex-row md:items-center md:p-10"
          style={{ animationDelay: "160ms" }}
        >
          <div className="min-w-0">
            <h3 className="font-display text-xl leading-snug tracking-tight text-foreground md:text-2xl">
              {t.processCtaTitle}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/65 md:text-base">
              {t.processCtaBody}
            </p>
          </div>
          <Link
            to={p.contact}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:scale-[1.03] active:scale-95"
          >
            {t.processCtaButton}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>


        {/* Footer back link */}
        <div className="mt-12 flex justify-center">
          <Link
            to={p.home}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground hover:shadow-glow"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backHome}
          </Link>
        </div>
      </section>
    </main>
  );
}
