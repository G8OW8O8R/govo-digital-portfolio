import { createFileRoute } from "@tanstack/react-router";

import ProjectsPage from "@/pages/ProjectsPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/pl/projekty")({
  head: () =>
    seoHead({
      lang: "pl",
      ...PAGE_SEO["projects"]!.pl,
      plPath: PAGE_PATHS.projects.pl,
      enPath: PAGE_PATHS.projects.en,
    }),
  component: ProjectsPage,
});
