import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Layers,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { lazy, Suspense, useMemo } from "react";


import Reveal from "@/components/Reveal";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_KEYS,
  BLOG_CATEGORY_SLUGS,
  BLOG_POSTS,
  type BlogCategoryKey,
  type BlogPost,
} from "@/content/blog";

const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));

const CATEGORY_ICONS: Record<BlogCategoryKey, React.ElementType> = {
  cost: Layers,
  before: User,
  converting: BarChart3,
  seo: Search,
};

const CATEGORY_TINT: Record<BlogCategoryKey, string> = {
  cost: "from-primary/25 to-sky-500/10",
  before: "from-sky-500/25 to-primary/10",
  converting: "from-emerald-400/20 to-primary/10",
  seo: "from-pink-500/20 to-primary/10",
};

const COPY = {
  pl: {
    kicker: "GOVO Journal",
    headline: "Konkret o stronach, bez",
    accent: "webowego bełkotu.",
    intro:
      "Praktyczna wiedza o stronach, redesignie, SEO, wycenach i podejmowaniu dobrych decyzji w biznesie. Bez lania wody. Tylko to, co naprawdę ma znaczenie.",
    topicsKicker: "Tematyka",
    topicsTitle: "Wybierz, co Cię",
    topicsAccent: "interesuje.",
    topicsNote: "Konkretnie. Praktycznie. Na temat.",
    browse: "Przeglądaj artykuły",
    featuredKicker: "Polecane na start",
    featuredTitle: "Warto przeczytać",
    featuredAccent: "na początek.",
    featuredNote:
      "Trzy teksty, które pomogą Ci lepiej zrozumieć, jak myśleć o stronie internetowej.",
    read: "Czytaj artykuł",
    ctaKicker: "GOVO Digital",

    ctaTitle: "Chcesz stronę,",
    ctaAccent: "nie tylko artykuł?",
    ctaText:
      "Wykorzystuję tę samą wiedzę i decyzje, o których piszę, w projektach klientów. Napisz kilka zdań o swoim pomyśle.",
    ctaButton: "Porozmawiajmy",
  },
  en: {
    kicker: "GOVO Journal",
    headline: "Straight talk about websites,",
    accent: "no jargon.",
    intro:
      "Practical writing about websites, redesigns, SEO, pricing and making good business decisions. No filler. Only what actually matters.",
    topicsKicker: "Topics",
    topicsTitle: "Pick what you",
    topicsAccent: "care about.",
    topicsNote: "Concrete. Practical. On point.",
    browse: "Browse articles",
    featuredKicker: "Start here",
    featuredTitle: "Worth reading",
    featuredAccent: "first.",
    featuredNote: "Three pieces that reframe how you think about a website.",
    read: "Read article",
    ctaKicker: "GOVO Digital",

    ctaTitle: "Want a website,",
    ctaAccent: "not just an article?",
    ctaText:
      "The same thinking you read here goes into client projects. Send a few lines about your idea.",
    ctaButton: "Let's talk",
  },
} as const;

function Thumb({
  category,
  cover,
  className = "",
}: {
  category: BlogCategoryKey;
  cover?: string;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[category];
  if (cover) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-border ${className}`}
        aria-hidden
      >
        <img
          src={cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
    );
  }
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${CATEGORY_TINT[category]} ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(255,255,255,0.10),transparent_70%)]" />
      <Icon className="h-6 w-6 text-foreground/60" />
    </div>
  );
}


export default function BlogIndexPage() {
  const { t, lang } = useI18n();
  const p = paths(lang);
  const c = COPY[lang];

  const featured = useMemo(() => BLOG_POSTS.filter((post) => post.featured).slice(0, 3), []);


  const postLink = (post: BlogPost, className: string, children: React.ReactNode) =>
    lang === "pl" ? (
      <Link to="/pl/blog/$slug" params={{ slug: post.pl.slug }} className={className}>
        {children}
      </Link>
    ) : (
      <Link to="/en/blog/$slug" params={{ slug: post.en.slug }} className={className}>
        {children}
      </Link>
    );


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

      {/* Hero */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14">
        <div>
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
        </div>
      </section>

      {/* Topics */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-4">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            {c.topicsKicker}
          </p>
        </Reveal>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
          <Reveal delay={60}>
            <h2 className="pb-1 font-display text-2xl tracking-tight sm:text-3xl">
              {c.topicsTitle} <span className="italic text-shimmer">{c.topicsAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-mono text-[11px] text-foreground/40">{c.topicsNote}</p>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {BLOG_CATEGORY_KEYS.map((key, i) => {
            const cat = BLOG_CATEGORIES[key][lang];
            const Icon = CATEGORY_ICONS[key];
            const cardClass =
              "group flex w-full items-start gap-4 rounded-3xl border border-border bg-card/60 p-5 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow";
            const inner = (
              <>
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${CATEGORY_TINT[key]} transition group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[15px] font-semibold text-foreground">{cat.label}</span>
                    <span className="font-mono text-[10px] text-foreground/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-foreground/60">
                    {cat.summary}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                    {c.browse}
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </span>
              </>
            );
            return (
              <Reveal key={key} delay={160 + i * 70}>
                {lang === "pl" ? (
                  <Link
                    to="/pl/blog/kategoria/$slug"
                    params={{ slug: BLOG_CATEGORY_SLUGS[key].pl }}
                    className={cardClass}
                  >
                    {inner}
                  </Link>
                ) : (
                  <Link
                    to="/en/blog/category/$slug"
                    params={{ slug: BLOG_CATEGORY_SLUGS[key].en }}
                    className={cardClass}
                  >
                    {inner}
                  </Link>
                )}
              </Reveal>
            );
          })}

        </div>
      </section>

      {/* Featured */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            {c.featuredKicker}
          </p>
        </Reveal>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
          <Reveal delay={60}>
            <h2 className="pb-1 font-display text-2xl tracking-tight sm:text-3xl">
              {c.featuredTitle} <span className="italic text-shimmer">{c.featuredAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-xs font-mono text-[11px] leading-relaxed text-foreground/40">
              {c.featuredNote}
            </p>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featured.map((post, i) => {
            const content = post[lang];
            return (
              <Reveal key={post.id} delay={160 + i * 80}>
                {postLink(
                  post,
                  "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/60 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow",
                  <>
                    <Thumb category={post.category} cover={post.cover} className="h-32 w-full" />
                    <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                      <span className="rounded-full border border-border px-2 py-0.5 text-foreground/55">
                        {BLOG_CATEGORIES[post.category][lang].label}
                      </span>
                      <span className="text-foreground/35">{content.readTime}</span>
                    </div>
                    <h3 className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
                      {content.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                      {content.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-[11px] uppercase tracking-wider text-primary">
                      {c.read}
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </>,
                )}
              </Reveal>
            );
          })}
        </div>
      </section>



      {/* CTA */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
                {c.ctaKicker}
              </p>
              <h2 className="mt-3 pb-1 font-display text-2xl tracking-tight sm:text-3xl">
                {c.ctaTitle} <span className="italic text-shimmer">{c.ctaAccent}</span>
              </h2>
            </div>
            <div className="flex flex-col gap-4 md:max-w-sm md:items-end">
              <p className="text-sm leading-relaxed text-foreground/55 md:text-right">{c.ctaText}</p>
              <Link
                to={p.contact}
                className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.03] hover:shadow-glow md:self-end"
              >
                <Sparkles className="h-4 w-4" />
                {c.ctaButton}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
