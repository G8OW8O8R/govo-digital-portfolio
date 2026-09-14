import { useNavigate, useRouterState } from "@tanstack/react-router";
import { createContext, useContext, useEffect, type ReactNode } from "react";

import { translations, type Dict } from "./translations";
import { PAGE_PATHS, langFromPathname, type Lang } from "@/lib/i18n-routes";
import { SERVICE_KEYS, SERVICE_SLUGS } from "@/content/services";
import { BLOG_POSTS } from "@/content/blog";

interface I18nCtx {
  lang: Lang;
  t: Dict;
}

const Ctx = createContext<I18nCtx | null>(null);

/** Maps the current path to its counterpart in the other language. */
export function alternatePath(pathname: string, target: Lang): string {
  const current = langFromPathname(pathname);
  const clean = pathname.replace(/\/$/, "") || "/";

  for (const key of Object.keys(PAGE_PATHS) as (keyof typeof PAGE_PATHS)[]) {
    if (PAGE_PATHS[key][current] === clean) return PAGE_PATHS[key][target];
  }

  for (const key of SERVICE_KEYS) {
    const from = `${PAGE_PATHS.services[current]}/${SERVICE_SLUGS[key][current]}`;
    if (from === clean) return `${PAGE_PATHS.services[target]}/${SERVICE_SLUGS[key][target]}`;
  }

  for (const post of BLOG_POSTS) {
    const from = `${PAGE_PATHS.blog[current]}/${post[current].slug}`;
    if (from === clean) return `${PAGE_PATHS.blog[target]}/${post[target].slug}`;
  }

  return PAGE_PATHS.home[target];
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = langFromPathname(pathname);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return <Ctx.Provider value={{ lang, t: translations[lang] }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { lang: "pl" as Lang, t: translations.pl };
  }
  return ctx;
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = langFromPathname(pathname);

  const base =
    "rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition";

  const go = (target: Lang) => {
    if (target === lang) return;
    void navigate({ to: alternatePath(pathname, target) as never });
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur-xl ${className}`}
    >
      <button
        type="button"
        onClick={() => go("pl")}
        aria-pressed={lang === "pl"}
        className={`${base} ${lang === "pl" ? "bg-primary text-primary-foreground shadow-glow" : "text-foreground/60 hover:text-foreground"}`}
      >
        PL
      </button>
      <button
        type="button"
        onClick={() => go("en")}
        aria-pressed={lang === "en"}
        className={`${base} ${lang === "en" ? "bg-primary text-primary-foreground shadow-glow" : "text-foreground/60 hover:text-foreground"}`}
      >
        EN
      </button>
    </div>
  );
}
