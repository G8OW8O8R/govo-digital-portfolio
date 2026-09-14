import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Code2,
  Zap,
  Palette,
  ShoppingBag,
  Sparkles,
  Wrench,
  Users,
  Lightbulb,
  Eye,
  Package,
  UserRound,
  ListChecks,
  MessageCircle,
} from "lucide-react";
import { lazy, Suspense } from "react";
const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));
import Reveal from "@/components/Reveal";
import MagneticChip from "@/components/MagneticChip";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";



const GROUPS: { icon: React.ElementType; skills: string[] }[] = [
  {
    icon: Code2,
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Vite",
      "Responsive Design",
      "Component Architecture",
    ],
  },
  {
    icon: Zap,
    skills: [
      "GSAP",
      "ScrollTrigger",
      "Canvas API",
      "Scroll-Driven Animations",
      "Frame-by-Frame Sequences",
      "Microinteractions",
    ],
  },
  {
    icon: Palette,
    skills: [
      "UX/UI Design",
      "Responsive Web Design",
      "Visual Direction",
      "Information Architecture",
      "Conversion-Focused Layouts",
      "Art Direction",
    ],
  },
  {
    icon: ShoppingBag,
    skills: [
      "E-commerce UX",
      "Product Pages",
      "Product Collections",
      "Cart & Checkout UX",
      "Product Variants",
      "Product Personalization",
      "Product Configurators",
    ],
  },
  {
    icon: Wrench,
    skills: [
      "Figma",
      "Git",
      "GitHub",
      "Vercel",
      "Chrome DevTools",
      "Frontend Debugging",
      "Performance Optimization",
      "Technical SEO",
      "Deployment",
    ],
  },
  {
    icon: Sparkles,
    skills: [
      "Codex",
      "Google AI Studio",
      "AI-Assisted Development",
      "Rapid Prototyping",
      "AI Asset Creation",
      "Visual Concepting",
    ],
  },
];

const WORKING_STYLE: { icon: React.ElementType; label: string }[] = [
  { icon: Lightbulb, label: "Problem Solving" },
  { icon: Eye, label: "Visual Thinking" },
  { icon: Package, label: "Product Thinking" },
  { icon: UserRound, label: "Independent Work" },
  { icon: ListChecks, label: "Self-Organization" },
  { icon: MessageCircle, label: "Communication" },
];

export default function SkillsPage() {
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
        {/* Heading */}
        <div className="mb-12 text-center md:mb-16">
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-foreground">{t.skillsTitle1}</span>
            <span className="text-shimmer">{t.skillsTitle2}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl whitespace-pre-line text-sm leading-relaxed text-foreground/60 md:text-base">
            {t.skillsIntro}
          </p>
        </div>

        {/* Skill groups */}
        <div className="flex flex-col gap-4 md:gap-5">
          {GROUPS.map((group, i) => {
            const Icon = group.icon;
            const meta = t.skillGroups[i];
            return (
              <Reveal
                key={meta?.title ?? i}
                delay={i * 70}
                className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-xl transition-colors hover:border-primary/40 md:p-8"
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
                  {/* Left: icon, index, title, description */}
                  <div className="flex gap-4">
                    <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
                    <div>
                      <span className="font-mono text-xs text-primary/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-1 font-display text-lg tracking-tight text-foreground md:text-xl">
                        {meta?.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                        {meta?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right: chips */}
                  <div className="flex flex-wrap content-start gap-2">
                    {group.skills.map((skill) => (
                      <MagneticChip key={skill}>
                        <span className="rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-foreground">
                          {skill}
                        </span>
                      </MagneticChip>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Working style strip */}
        <Reveal
          delay={120}
          className="mt-4 rounded-3xl border border-border bg-card/50 p-5 backdrop-blur-xl md:mt-5 md:p-6"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2.5">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-display text-sm tracking-tight text-foreground md:text-base">
                {t.workingStyleTitle}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
              {WORKING_STYLE.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs text-foreground/60 transition-colors hover:text-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-primary/70" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Footer back link */}
        <div className="animate-fade-up mt-12 flex justify-center" style={{ animationDelay: "480ms" }}>
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
