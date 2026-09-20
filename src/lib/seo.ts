import { siteConfig } from "./site-config";
import type { Lang } from "./i18n-routes";

export function seoHead(opts: {
  lang: Lang;
  title: string;
  description: string;
  plPath: string;
  enPath: string;
  ogType?: string;
  /** Page exists only in one language (e.g. local PL landing) — skip hreflang alternates. */
  singleLanguage?: boolean;
  /** JSON-LD objects appended as ld+json script tags. */
  jsonLd?: Record<string, unknown>[];
}) {
  const {
    lang,
    title,
    description,
    plPath,
    enPath,
    ogType = "website",
    singleLanguage = false,
    jsonLd,
  } = opts;
  // Absolute URLs — Google requires fully-qualified hreflang/og:url values.
  const abs = (path: string) =>
    path.startsWith("http") ? path : `${siteConfig.siteUrl}${path}`;
  const plUrl = abs(plPath);
  const enUrl = abs(enPath);
  const url = lang === "pl" ? plUrl : enUrl;

  const ogImage = `${siteConfig.siteUrl}/og-image.jpg`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: url },
      { property: "og:locale", content: lang === "pl" ? "pl_PL" : "en_US" },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: siteConfig.brand },
      { property: "og:image:type", content: "image/jpeg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: singleLanguage
      ? [{ rel: "canonical", href: url }]
      : [
          { rel: "canonical", href: url },
          // lowercase "hreflang" — camelCase is emitted verbatim and ignored by crawlers
          { rel: "alternate", hreflang: "pl", href: plUrl },
          { rel: "alternate", hreflang: "en", href: enUrl },
          { rel: "alternate", hreflang: "x-default", href: enUrl },
        ],
    ...(jsonLd && jsonLd.length
      ? {
          scripts: jsonLd.map((data) => ({
            type: "application/ld+json",
            children: JSON.stringify(data),
          })),
        }
      : {}),
  };
}

/** FAQPage structured data — makes questions eligible for rich results. */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Service structured data for a single service page. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    url: opts.url,
    provider: { "@type": "Organization", name: "GOVO DIGITAL" },
    areaServed: (opts.areaServed ?? ["Poland"]).map((n) => ({ "@type": "Place", name: n })),
  };
}

/** BreadcrumbList structured data. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** BlogPosting structured data for a single article. */
export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  lang: "pl" | "en";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    author: { "@type": "Organization", name: "GOVO DIGITAL" },
    publisher: { "@type": "Organization", name: "GOVO DIGITAL" },
    inLanguage: opts.lang === "pl" ? "pl-PL" : "en-US",
  };
}



type Copy = { title: string; description: string };

export const PAGE_SEO: Record<string, Record<Lang, Copy>> = {
  home: {
    pl: {
      title: "GOVO DIGITAL — tworzenie stron internetowych i UI",
      description:
        "Tworzę szybkie, dopracowane strony internetowe i interfejsy w React i Tailwind. Portfolio, usługi i kontakt — GOVO DIGITAL, Polska.",
    },
    en: {
      title: "GOVO DIGITAL — web development & UI design",
      description:
        "I build fast, polished websites and interfaces with React and Tailwind. Working remotely with clients worldwide — portfolio, services and contact.",
    },
  },
  about: {
    pl: {
      title: "O mnie — GOVO DIGITAL",
      description:
        "Poznaj osobę za GOVO DIGITAL: frontend developer i projektant UI z Polski, tworzący płynne i dopracowane strony internetowe.",
    },
    en: {
      title: "About — GOVO DIGITAL",
      description:
        "Meet the person behind GOVO DIGITAL: a frontend developer and UI designer building smooth, premium websites.",
    },
  },
  projects: {
    pl: {
      title: "Projekty i realizacje stron — GOVO DIGITAL",
      description:
        "Wybrane realizacje: strony firmowe, landing pages i sklepy internetowe — od kierunku wizualnego po responsywny frontend.",
    },
    en: {
      title: "Projects and case studies — GOVO DIGITAL",
      description:
        "Selected work: business websites, landing pages and online stores — from visual direction to responsive frontend.",
    },
  },
  skills: {
    pl: {
      title: "Umiejętności i technologie — GOVO DIGITAL",
      description:
        "React, TypeScript, Tailwind CSS, animacje, e-commerce i optymalizacja wydajności — czym się zajmuję i jak pracuję.",
    },
    en: {
      title: "Skills and technologies — GOVO DIGITAL",
      description:
        "React, TypeScript, Tailwind CSS, motion, e-commerce and performance work — what I do and how I work.",
    },
  },
  process: {
    pl: {
      title: "Proces współpracy — GOVO DIGITAL",
      description:
        "Pięć jasnych kroków od pierwszej rozmowy do gotowej strony: konsultacja, plan, projekt, kod i publikacja.",
    },
    en: {
      title: "How we work together — GOVO DIGITAL",
      description:
        "Five clear steps from the first call to a finished website: consultation, plan, design, code and launch.",
    },
  },
  contact: {
    pl: {
      title: "Kontakt — GOVO DIGITAL",
      description:
        "Napisz w sprawie strony internetowej, landing page'a lub sklepu. Odpowiadam zwykle w ciągu 24 godzin.",
    },
    en: {
      title: "Contact — GOVO DIGITAL",
      description:
        "Get in touch about a website, landing page or online store. I usually reply within 24 hours.",
    },
  },
  services: {
    pl: {
      title: "Usługi — strony, landing pages, sklepy | GOVO DIGITAL",
      description:
        "Tworzenie stron internetowych, landing pages, sklepów internetowych i redesign istniejących stron. Sprawdź zakres i napisz.",
    },
    en: {
      title: "Services — websites, landing pages, stores | GOVO DIGITAL",
      description:
        "Website development, landing pages, e-commerce frontends and redesigns of existing sites. See the scope and get in touch.",
    },
  },
  blog: {
    pl: {
      title: "Blog o stronach internetowych — GOVO JOURNAL | GOVO DIGITAL",
      description:
        "Konkretna wiedza o stronach internetowych: koszty, wycena, redesign, SEO i konwersja. Bez lania wody — tylko to, co realnie pomaga w biznesie.",
    },
    en: {
      title: "Web design blog — GOVO JOURNAL | GOVO DIGITAL",
      description:
        "Practical writing about websites: cost, redesign, SEO and conversion. No filler — only what actually helps a business.",
    },
  },
  pricing: {
    pl: {
      title: "Ile kosztuje strona internetowa? Cennik 2026 | GOVO DIGITAL",
      description:
        "Ile kosztuje strona internetowa, landing page i sklep online? Widełki cenowe, co wpływa na cenę, co jest w cenie i ile trwa realizacja.",
    },
    en: {
      title: "Website pricing — how much does a website cost | GOVO DIGITAL",
      description:
        "How much does a website, landing page or online store cost? Clear price ranges, what changes the price, what's included and typical timelines.",
    },
  },
  warsaw: {
    pl: {
      title: "Tworzenie stron internetowych — cała Polska | GOVO DIGITAL",
      description:
        "Tworzenie stron internetowych dla firm z całej Polski — Warszawa, Kraków, Wrocław, Poznań, Trójmiasto. Strony firmowe, landing pages i sklepy online, kodowane od zera.",
    },
    en: {
      title: "Web development worldwide — remote | GOVO DIGITAL",
      description:
        "Remote web development for clients worldwide: business websites, landing pages and online stores built from scratch in React and Tailwind.",
    },
  },
};

