import { createFileRoute } from "@tanstack/react-router";

import SkillsPage from "@/pages/SkillsPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/en/skills")({
  head: () =>
    seoHead({
      lang: "en",
      ...PAGE_SEO["skills"]!.en,
      plPath: PAGE_PATHS.skills.pl,
      enPath: PAGE_PATHS.skills.en,
    }),
  component: SkillsPage,
});
