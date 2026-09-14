import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { lazy, Suspense, useRef } from "react";

import ReadingProgress from "@/components/ReadingProgress";
import Reveal from "@/components/Reveal";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { BLOG_CATEGORIES, BLOG_POSTS, formatBlogDate, type BlogPost } from "@/content/blog";

const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));

const COPY = {
  pl: {
    back: "Wróć do bloga",
    read: "Czas czytania",
    related: "Powiązane artykuły",
    ctaTitle: "Chcesz wdrożyć to na swojej stronie?",
    ctaText: "Napisz w sprawie projektu — zaczynamy od krótkiej rozmowy o celu.",
    ctaButton: "Porozmawiajmy",
    toc: "Spis treści",
  },
  en: {
    back: "Back to blog",
    read: "Reading time",
    related: "Related articles",
    ctaTitle: "Want to apply this to your site?",
    ctaText: "Get in touch about your project — we start with a short call about the goal.",
    ctaButton: "Let's talk",
    toc: "Table of contents",
  },
} as const;

export default function BlogPostPage({ postId }: { postId: string }) {
  const { t, lang } = useI18n();
  const p = paths(lang);
  const c = COPY[lang];
  const articleRef = useRef<HTMLElement>(null);

  const post = BLOG_POSTS.find((p) => p.id === postId);
  if (!post) return null;
  const content = post[lang];
  const category = BLOG_CATEGORIES[post.category][lang];

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

  const headings = content.body
    .map((block, blockIndex) => ({ block, blockIndex }))
    .filter((entry): entry is { block: { type: "h"; text: string }; blockIndex: number } =>
      entry.block.type === "h",
    )
    .map(({ block, blockIndex }, i) => ({
      id: `${slugify(block.text) || "sekcja"}-${i + 1}`,
      text: block.text,
      blockIndex,
    }));

  const related = BLOG_POSTS.filter(
    (p) => p.id !== post.id && p.category === post.category,
  )
    .slice(0, 2)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const relatedLink = (post: BlogPost, className: string, children: React.ReactNode) =>
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
      <ReadingProgress targetRef={articleRef} />

      <Suspense fallback={null}>
        <InteractiveStars />
      </Suspense>

      <header className="relative z-20 mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-6 text-xs">
        <Link
          to={p.blog}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-foreground/70 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          {c.back}
        </Link>
        <LanguageSwitcher />
      </header>

      <article ref={articleRef} className="relative z-10 mx-auto w-full max-w-3xl px-6 py-14">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
            <span className="rounded-full border border-border px-2 py-0.5">{category.label}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatBlogDate(post.date, lang)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {content.readTime}
            </span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            {content.title}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-5 text-base leading-relaxed text-foreground/75 md:text-lg">
            {content.excerpt}
          </p>
        </Reveal>

        {post.cover && (
          <Reveal delay={200}>
            <figure className="mt-8 overflow-hidden rounded-3xl border border-border bg-card/40">
              <img
                src={post.cover}
                alt={content.title}
                loading="lazy"
                className="h-52 w-full object-cover sm:h-64 md:h-80"
              />
            </figure>
          </Reveal>
        )}

        {headings.length >= 4 && (
          <Reveal delay={210}>
            <nav
              aria-label={c.toc}
              className="mt-10 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl"
            >
              <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                {c.toc}
              </h2>
              <ol className="mt-4 space-y-2">
                {headings.map((h, i) => (
                  <li key={h.id} className="flex items-start gap-3 text-[14px]">
                    <span className="mt-0.5 font-mono text-[11px] text-primary/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${h.id}`}
                      className="text-foreground/80 underline-offset-4 transition hover:text-primary hover:underline"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}

        <Reveal delay={220}>
          <div className="mt-10 space-y-8">
            {content.body.map((block, i) => {
              if (block.type === "h") {
                const index = headings.findIndex((h) => h.blockIndex === i);
                return (
                  <div key={i} className="pt-6">
                    <div className="mb-4 h-px w-full bg-gradient-to-r from-primary/40 via-border to-transparent" />
                    <h2
                      id={headings[index]?.id}
                      className="flex scroll-mt-24 items-baseline gap-3 font-display text-xl tracking-tight text-foreground sm:text-2xl"
                    >
                      {index >= 0 && (
                        <span className="font-mono text-xs text-primary/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                      <span>{block.text}</span>
                    </h2>
                  </div>
                );
              }
              if (block.type === "p") {
                const isLead = i > 0 && content.body[i - 1]?.type === "h";
                return (
                  <p
                    key={i}
                    className={
                      isLead
                        ? "border-l-2 border-primary/30 pl-4 text-[16px] leading-[1.75] text-foreground/90"
                        : "text-[15px] leading-[1.8] text-foreground/85"
                    }
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.type === "list") {
                return (
                  <ul
                    key={i}
                    className="space-y-3 rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur-xl"
                  >
                    {block.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-[15px] text-foreground/85">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="leading-[1.7]">{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "cta") {
                return (
                  <p key={i} className="text-[15px] leading-[1.8] text-foreground/85">
                    {block.text}{" "}
                    <Link
                      to={block.linkHref}
                      className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 transition hover:text-primary/80 hover:underline"
                    >
                      {block.linkLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </p>
                );

              }
              return null;
            })}
          </div>
        </Reveal>

        {related.length > 0 && (
          <Reveal delay={300}>
            <div className="mt-16">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                {c.related}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((rel) => {
                  const relContent = rel[lang];
                  return (
                    <div key={rel.id}>
                      {relatedLink(
                        rel,
                        "group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow",
                        <>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                            {BLOG_CATEGORIES[rel.category][lang].label}
                          </span>
                          <span className="mt-2 block font-medium text-foreground">
                            {relContent.title}
                          </span>
                          <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">
                            {lang === "pl" ? "Czytaj" : "Read"}
                            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                          </span>
                        </>,
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={360}>
          <div className="mt-12 rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl">
            <h3 className="font-display text-xl tracking-tight text-foreground">{c.ctaTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">{c.ctaText}</p>
            <Link
              to={p.contact}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.03] hover:shadow-glow"
            >
              {c.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </article>
    </main>
  );
}
