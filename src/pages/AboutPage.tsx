import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Code2,
  GitBranch,
  MapPin,
  MousePointer2,
  Pencil,
  ShoppingBag,
  Smartphone,
  Sparkle,
  Triangle,
  Waves,
  Zap,
} from "lucide-react";
import avatarUrl from "@/assets/portrait.webp";
import { lazy, Suspense } from "react";
const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));
import MagneticChip from "@/components/MagneticChip";
import ProtectedImage from "@/components/ProtectedImage";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import SplitText from "@/components/SplitText";
import TiltCard from "@/components/TiltCard";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";



const TECH: { label: string; Icon: typeof Atom }[] = [
  { label: "React", Icon: Atom },
  { label: "TypeScript", Icon: Code2 },
  { label: "JavaScript", Icon: Code2 },
  { label: "Tailwind CSS", Icon: Waves },
  { label: "GSAP", Icon: Zap },
  { label: "Framer Motion", Icon: MousePointer2 },
  { label: "UI / UX", Icon: Pencil },
  { label: "Responsive", Icon: Smartphone },
  { label: "E-commerce", Icon: ShoppingBag },
  { label: "Vercel", Icon: Triangle },
  { label: "Git", Icon: GitBranch },
];

export default function AboutPage() {
  const { t, lang } = useI18n();
  const p = paths(lang);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}><InteractiveStars /></Suspense>
      <ScrollProgress />

      {/* Top bar */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6 text-xs">
        <Link
          to={p.home}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          {t.back}
        </Link>
        <LanguageSwitcher />
      </header>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        {/* Hero row: portrait + identity */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,380px)_1fr] md:gap-14">
          {/* Portrait card */}
          <Reveal className="relative mx-auto w-full max-w-[340px] md:max-w-none" distance={26}>
            <div className="absolute inset-6 -z-10 animate-float-y rounded-[2rem]">
              <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-primary/35 via-primary/10 to-primary/25 blur-3xl" />
            </div>
            <TiltCard className="tilt-sheen relative overflow-hidden rounded-[1.75rem] border border-border bg-card/50 p-2 shadow-soft backdrop-blur-xl">
              <ProtectedImage
                src={avatarUrl}
                ariaLabel="Piotr Goworek"
                eager
                className="h-full w-full rounded-[1.4rem] aspect-[4/5]"
              />
            </TiltCard>
          </Reveal>

          {/* Identity */}
          <div className="flex flex-col justify-center">
            <Reveal as="span" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-foreground/55">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t.aboutBadge}
            </Reveal>

            <h1 className="mt-4 font-display text-4xl leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              <SplitText text="Piotr Goworek" stagger={90} delay={80} />
            </h1>

            <Reveal className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {t.aboutLocationShort}
              </span>
              <span className="h-1 w-1 rounded-full bg-foreground/30" />
              <span className="relative inline-flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-pulse-ring absolute inset-0 rounded-full bg-primary" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                {t.aboutAvailability}
              </span>
            </Reveal>

            <h2 className="mt-8 font-display text-2xl leading-[1.15] tracking-tight sm:text-3xl">
              <SplitText
                text={t.aboutHeadline1}
                className="block text-foreground"
                delay={220}
              />
              <SplitText
                text={t.aboutHeadline2}
                className="block"
                wordClassName="text-shimmer"
                delay={340}
              />

            </h2>

            <div className="mt-7 space-y-5 border-t border-border pt-7 text-sm leading-relaxed text-foreground/65 md:text-base">
              {[t.bio1, t.bio2, t.bio3].map((paragraph, i) => (
                <Reveal as="p" key={i} delay={i * 110} distance={14}>
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-14 border-t border-border pt-10">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/45">
            {t.techTitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {TECH.map(({ label, Icon }, i) => (
              <Reveal key={label} delay={i * 55} distance={12}>
                <MagneticChip>
                  <span className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition-colors duration-300 hover:border-primary/50 hover:text-foreground">
                    <Icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    {label}
                  </span>
                </MagneticChip>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Closing card */}
        <Reveal
          distance={24}
          className="mt-10 grid grid-cols-1 gap-8 rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-xl md:grid-cols-2 md:gap-10 md:p-9"
          
        >
          <div className="flex items-start gap-4 md:border-r md:border-border md:pr-10">
            <Sparkle className="animate-float-y mt-1 h-6 w-6 shrink-0 text-primary" />
            <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
              {t.aboutQuote1}{" "}
              <span className="text-primary">{t.aboutQuote2}</span>
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <p className="text-sm text-foreground/60 md:text-base">
              {t.aboutCtaQuestion}
            </p>
            <Link
              to={p.contact}
              className="group inline-flex items-center gap-2 text-base text-primary transition hover:gap-3"
            >
              {t.aboutCtaLink}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
