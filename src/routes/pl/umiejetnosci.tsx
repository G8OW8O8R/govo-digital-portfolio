import { createFileRoute } from "@tanstack/react-router";

import SkillsPage from "@/pages/SkillsPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/pl/umiejetnosci")({
  head: () =>
    seoHead({
      lang: "pl",
      ...PAGE_SEO["skills"]!.pl,
      plPath: PAGE_PATHS.skills.pl,
      enPath: PAGE_PATHS.skills.en,
    }),
  component: SkillsPage,
});
