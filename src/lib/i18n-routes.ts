export type Lang = "pl" | "en";

export const PAGE_PATHS = {
  home: { pl: "/pl", en: "/en" },
  about: { pl: "/pl/o-mnie", en: "/en/about" },
  projects: { pl: "/pl/projekty", en: "/en/projects" },
  skills: { pl: "/pl/umiejetnosci", en: "/en/skills" },
  process: { pl: "/pl/proces", en: "/en/process" },
  contact: { pl: "/pl/kontakt", en: "/en/contact" },
  services: { pl: "/pl/uslugi", en: "/en/services" },
  blog: { pl: "/pl/blog", en: "/en/blog" },
} as const;

export type PageKey = keyof typeof PAGE_PATHS;

export function paths(lang: Lang) {
  return {
    home: PAGE_PATHS.home[lang],
    about: PAGE_PATHS.about[lang],
    projects: PAGE_PATHS.projects[lang],
    skills: PAGE_PATHS.skills[lang],
    process: PAGE_PATHS.process[lang],
    contact: PAGE_PATHS.contact[lang],
    services: PAGE_PATHS.services[lang],
    blog: PAGE_PATHS.blog[lang],
  };
}

export function langFromPathname(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pl";
}
