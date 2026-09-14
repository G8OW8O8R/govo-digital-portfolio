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
import { lazy, Suspense } from "react";

import Reveal from "@/components/Reveal";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_KEYS,
  BLOG_CATEGORY_SEO,
  BLOG_CATEGORY_SLUGS,
  blogPostsByCategory,
  formatBlogDate,
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
    back: "Wróć do bloga",
    articles: "Artykuły w tej kategorii",
    empty: "Wkrótce pojawią się tu nowe teksty.",
    read: "Czytaj artykuł",
    other: "Inne tematy",
    ctaKicker: "GOVO Digital",
    ctaTitle: "Chcesz stronę,",
    ctaAccent: "nie tylko artykuł?",
    ctaText:
      "Wykorzystuję tę samą wiedzę i decyzje, o których piszę, w projektach klientów. Napisz kilka zdań o swoim pomyśle.",
    ctaButton: "Porozmawiajmy",
  },
  en: {
    kicker: "GOVO Journal",
    back: "Back to blog",
    articles: "Articles in this topic",
    empty: "New pieces are coming soon.",
    read: "Read article",
    other: "Other topics",
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
      <div className={`relative overflow-hidden rounded-2xl border border-border ${className}`} aria-hidden>
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

export default function BlogCategoryPage({ categoryKey }: { categoryKey: BlogCategoryKey }) {
  const { lang } = useI18n();
  const p = paths(lang);
  const c = COPY[lang];
  const cat = BLOG_CATEGORIES[categoryKey][lang];
  const seo = BLOG_CATEGORY_SEO[categoryKey][lang];
  const Icon = CATEGORY_ICONS[categoryKey];

  const posts = [...blogPostsByCategory(categoryKey)].sort((a, b) => (a.date < b.date ? 1 : -1));
  const others = BLOG_CATEGORY_KEYS.filter((key) => key !== categoryKey);

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

  const categoryLink = (key: BlogCategoryKey, className: string, children: React.ReactNode) =>
    lang === "pl" ? (
      <Link
        to="/pl/blog/kategoria/$slug"
        params={{ slug: BLOG_CATEGORY_SLUGS[key].pl }}
        className={className}
      >
        {children}
      </Link>
    ) : (
      <Link
        to="/en/blog/category/$slug"
        params={{ slug: BLOG_CATEGORY_SLUGS[key].en }}
        className={className}
      >
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
          to={p.blog}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-foreground/70 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          {c.back}
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 py-14">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            {c.kicker}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-4 flex items-center gap-4">
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${CATEGORY_TINT[categoryKey]}`}
            >
              <Icon className="h-5 w-5 text-primary" />
            </span>
            <h1 className="pb-2 font-display text-3xl leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
              <span className="italic text-shimmer">{cat.label}</span>
            </h1>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-foreground/60 md:text-base">
            {seo.intro}
          </p>
        </Reveal>
      </section>

      {/* Articles */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-14">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            {c.articles}
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={80}>
            <p className="mt-5 text-sm text-foreground/50">{c.empty}</p>
          </Reveal>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {posts.map((post, i) => {
              const content = post[lang];
              return (
                <Reveal key={post.id} delay={120 + i * 70}>
                  {postLink(
                    post,
                    "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/60 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow",
                    <>
                      <Thumb category={post.category} cover={post.cover} className="h-32 w-full" />
                      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                        <span className="text-foreground/45">{formatBlogDate(post.date, lang)}</span>
                        <span className="text-foreground/25">·</span>
                        <span className="text-foreground/35">{content.readTime}</span>
                      </div>
                      <h2 className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
                        {content.title}
                      </h2>
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
        )}
      </section>

      {/* Other topics */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-14">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
            {c.other}
          </p>
        </Reveal>
        <div className="mt-5 flex flex-wrap gap-2">
          {others.map((key, i) => (
            <Reveal key={key} delay={80 + i * 60}>
              {categoryLink(
                key,
                "group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-foreground/60 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground",
                <>
                  {BLOG_CATEGORIES[key][lang].label}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </>,
              )}
            </Reveal>
          ))}
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
